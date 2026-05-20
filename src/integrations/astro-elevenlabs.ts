/**
 * astro-elevenlabs — Build-time article audio pipeline.
 *
 * Generates MP3 read-aloud audio and word-level alignment JSON for blog
 * articles using ElevenLabs' /with-timestamps endpoint. Output files are
 * content-hash addressed in public/audio/, so unchanged articles are cached
 * by filename and skip the API entirely.
 *
 * Authentication strategy:
 * 1. ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID set
 *    → generate missing audio during production builds
 * 2. Missing credentials
 *    → warn and skip generation without failing the build
 *
 * Cost guard:
 * MAX_AUDIO_PER_BUILD defaults to 10 generated articles per build. Cached
 * articles do not count against this limit. Use npm run audio:backfill for
 * the initial all-post generation.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { createHash, createSign } from 'crypto';
import { spawnSync } from 'child_process';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import type { AstroIntegration } from 'astro';

const CACHE_DIR = '.cache/elevenlabs';
const PUBLIC_DIR = 'public/audio';
const BLOG_DIR = 'src/content/blog';
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const DEFAULT_SHARED_DRIVE_NAME = 'Whiteport Team';
const MODEL_ID = 'eleven_multilingual_v2';
const MAX_CHARS_PER_CHUNK = 5000;
const CHUNK_SILENCE_SECONDS = 0.3;
const DEFAULT_MAX_AUDIO_PER_BUILD = 10;

// ── Types ──

interface ArticleInput {
  sourcePath: string;
  slug: string;
  text: string;
  hash: string;
  mediaFolder?: string;
}

interface AlignmentResponse {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

interface ElevenLabsResponse {
  audio_base64: string;
  alignment: AlignmentResponse;
}

export interface WordAlignment {
  text: string;
  start: number;
  end: number;
}

export interface AlignmentJson {
  hash: string;
  generatedAt: string;
  words: WordAlignment[];
}

interface GeneratedArticle {
  slug: string;
  hash: string;
  mp3Path: string;
  jsonPath: string;
  wordCount: number;
  chunks: number;
}

interface PipelineResult {
  total: number;
  generated: number;
  cached: number;
  skipped: number;
  failed: ArticleInput[];
  generatedArticles: GeneratedArticle[];
}

interface Logger {
  info: (msg: string) => void;
  warn?: (msg: string) => void;
}

interface PipelineOptions {
  projectRoot?: string;
  logger?: Logger;
  apiKey?: string;
  voiceId?: string;
  maxAudioPerBuild?: number;
  fetchImpl?: typeof fetch;
  driveCache?: DriveCacheClient | null;
}

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface DriveFile {
  id: string;
  name: string;
}

export interface DriveCacheClient {
  findFile: (folderPath: string, name: string) => Promise<DriveFile | null>;
  downloadFile: (fileId: string) => Promise<Buffer>;
  uploadFile: (folderPath: string, name: string, mimeType: string, content: Buffer) => Promise<void>;
}

// ── Env file loader (no dotenv dependency) ──

function loadEnvFile(projectRoot = process.cwd()) {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

// ── Markdown / content helpers ──

function stripFrontmatter(content: string): string {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return content;
  const afterMarker = content.indexOf('\n', end + 4);
  return afterMarker === -1 ? '' : content.slice(afterMarker + 1);
}

function parseMediaFolder(content: string): string | undefined {
  if (!content.startsWith('---')) return undefined;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return undefined;
  const frontmatter = content.slice(3, end);
  const match = frontmatter.match(/^mediaFolder:\s*(.+)$/m);
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, '') || undefined;
}

function naturalizeLine(line: string, sentenceBreak = false): string {
  const trimmed = line.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  if (!sentenceBreak) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function markdownToPlainText(markdown: string): string {
  const tree = unified().use(remarkParse).parse(stripFrontmatter(markdown));
  const lines: string[] = [];
  const root = tree as { children?: Array<{ type?: string; children?: unknown[] }> };

  for (const node of root.children ?? []) {
    const text = toString(node).trim();
    if (!text) continue;

    switch (node.type) {
      case 'heading':
        lines.push(naturalizeLine(text, true));
        break;
      case 'paragraph':
      case 'blockquote':
        lines.push(naturalizeLine(text));
        break;
      case 'list':
        for (const item of node.children ?? []) {
          const itemText = toString(item).trim();
          if (itemText) lines.push(naturalizeLine(itemText, true));
        }
        break;
      default:
        break;
    }
  }

  return lines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function contentHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

export function audioSlugFromId(idOrPath: string): string {
  const relPath = idOrPath.replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '');
  let decoded = relPath;
  try {
    decoded = decodeURIComponent(relPath);
  } catch {
    // Keep the original path if it is not valid URI-encoded text.
  }

  return decoded
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/\//g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'article';
}

function safeSlug(sourcePath: string, contentDir: string): string {
  return audioSlugFromId(relative(contentDir, sourcePath));
}

function scanFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanFiles(path));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

function scanArticles(projectRoot: string): ArticleInput[] {
  const contentDir = join(projectRoot, BLOG_DIR);
  return scanFiles(contentDir)
    .map((sourcePath) => {
      const raw = readFileSync(sourcePath, 'utf-8');
      const text = markdownToPlainText(raw);
      return {
        sourcePath,
        slug: safeSlug(sourcePath, contentDir),
        text,
        hash: contentHash(text),
        mediaFolder: parseMediaFolder(raw),
      };
    })
    .filter(article => article.text.length > 0);
}

export function chunkText(text: string, maxChars = MAX_CHARS_PER_CHUNK): string[] {
  if (text.length <= maxChars) return [text];

  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);

    if (paragraph.length <= maxChars) {
      current = paragraph;
      continue;
    }

    for (let i = 0; i < paragraph.length; i += maxChars) {
      chunks.push(paragraph.slice(i, i + maxChars));
    }
    current = '';
  }

  if (current) chunks.push(current);
  return chunks;
}

// ── Alignment ──

// Word characters include letters, digits, and apostrophes (straight + curly)
// so contractions like "don't" / "it's" stay intact for sync highlighting.
function isWordCharacter(char: string): boolean {
  return /[\p{L}\p{N}'’]/u.test(char);
}

function roundTime(seconds: number): number {
  return Math.round(seconds * 1000) / 1000;
}

export function aggregateWords(alignment: AlignmentResponse, timeOffset = 0): WordAlignment[] {
  const words: WordAlignment[] = [];
  let current = '';
  let start: number | null = null;
  let end: number | null = null;

  function flush() {
    if (!current || start === null || end === null) return;
    words.push({
      text: current,
      start: roundTime(start + timeOffset),
      end: roundTime(end + timeOffset),
    });
    current = '';
    start = null;
    end = null;
  }

  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i] ?? '';
    const charStart = alignment.character_start_times_seconds[i] ?? alignment.character_end_times_seconds[i] ?? 0;
    const charEnd = alignment.character_end_times_seconds[i] ?? charStart;

    if (isWordCharacter(char)) {
      if (!current) start = charStart;
      current += char;
      end = charEnd;
    } else {
      flush();
    }
  }

  flush();
  return words;
}

function alignmentDuration(alignment: AlignmentResponse): number {
  return Math.max(0, ...alignment.character_end_times_seconds);
}

// ── ElevenLabs API ──

async function synthesizeWithTimestamps(
  text: string,
  apiKey: string,
  voiceId: string,
  fetchImpl: typeof fetch,
): Promise<ElevenLabsResponse> {
  const response = await fetchImpl(`${ELEVENLABS_API}/${voiceId}/with-timestamps`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'WhiteportAstro/1.0',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs API failed: HTTP ${response.status} — ${body}`);
  }

  return await response.json() as ElevenLabsResponse;
}

// ── Google Drive cache ──

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function loadServiceAccountKey(projectRoot: string): ServiceAccountKey | null {
  const jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch {
      console.warn('[elevenlabs] Invalid GOOGLE_SERVICE_ACCOUNT_JSON — Drive cache disabled');
    }
  }

  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  if (keyFile && existsSync(keyFile)) {
    try {
      return JSON.parse(readFileSync(keyFile, 'utf-8'));
    } catch {
      console.warn('[elevenlabs] Failed to read service account key file — Drive cache disabled');
    }
  }

  const localKey = join(projectRoot, 'service-account-key.json');
  if (existsSync(localKey)) {
    try {
      return JSON.parse(readFileSync(localKey, 'utf-8'));
    } catch {
      console.warn('[elevenlabs] Failed to read local service-account-key.json — Drive cache disabled');
    }
  }

  return null;
}

async function getDriveAccessToken(key: ServiceAccountKey, fetchImpl: typeof fetch): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60_000) {
    return cachedAccessToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    scope: DRIVE_SCOPE,
    aud: key.token_uri || TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const unsigned = `${b64url(header)}.${b64url(payload)}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(key.private_key, 'base64url');

  const response = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${unsigned}.${signature}`,
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed: HTTP ${response.status} — ${await response.text()}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

function driveQueryValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function encodeDriveParams(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

class GoogleDriveCacheClient implements DriveCacheClient {
  private driveId: string | null = null;
  private folderCache = new Map<string, string>();

  constructor(
    private readonly key: ServiceAccountKey,
    private readonly fetchImpl: typeof fetch,
    private readonly sharedDriveName: string,
  ) {}

  private async accessToken(): Promise<string> {
    return await getDriveAccessToken(this.key, this.fetchImpl);
  }

  private async request(url: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.accessToken();
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return await this.fetchImpl(url, { ...init, headers });
  }

  private async getDriveId(): Promise<string> {
    if (this.driveId) return this.driveId;

    const response = await this.request(`${DRIVE_API}/drives?${encodeDriveParams({
      pageSize: '100',
      fields: 'drives(id,name)',
    })}`);
    if (!response.ok) {
      throw new Error(`Google Drive list failed: HTTP ${response.status} — ${await response.text()}`);
    }

    const data = await response.json() as { drives?: Array<{ id: string; name: string }> };
    const drive = data.drives?.find(item => item.name === this.sharedDriveName);
    if (!drive) throw new Error(`Shared Drive not found: ${this.sharedDriveName}`);

    this.driveId = drive.id;
    return drive.id;
  }

  private async findChildFolder(parentId: string | null, name: string): Promise<string | null> {
    const driveId = await this.getDriveId();
    const parentClause = parentId ? `'${driveQueryValue(parentId)}' in parents` : `'${driveId}' in parents`;
    const q = [
      `name = '${driveQueryValue(name)}'`,
      `mimeType = 'application/vnd.google-apps.folder'`,
      parentClause,
      'trashed = false',
    ].join(' and ');
    const response = await this.request(`${DRIVE_API}/files?${encodeDriveParams({
      corpora: 'drive',
      driveId,
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      q,
      fields: 'files(id,name)',
      pageSize: '10',
    })}`);
    if (!response.ok) {
      throw new Error(`Google Drive folder lookup failed: HTTP ${response.status} — ${await response.text()}`);
    }
    const data = await response.json() as { files?: DriveFile[] };
    return data.files?.[0]?.id ?? null;
  }

  private async resolveFolder(folderPath: string): Promise<string | null> {
    const normalized = folderPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    if (this.folderCache.has(normalized)) return this.folderCache.get(normalized) ?? null;

    let parentId: string | null = null;
    for (const part of normalized.split('/').filter(Boolean)) {
      const childId = await this.findChildFolder(parentId, part);
      if (!childId) return null;
      parentId = childId;
    }

    if (parentId) this.folderCache.set(normalized, parentId);
    return parentId;
  }

  async findFile(folderPath: string, name: string): Promise<DriveFile | null> {
    const folderId = await this.resolveFolder(folderPath);
    if (!folderId) return null;

    const driveId = await this.getDriveId();
    const q = [
      `name = '${driveQueryValue(name)}'`,
      `'${driveQueryValue(folderId)}' in parents`,
      'trashed = false',
    ].join(' and ');
    const response = await this.request(`${DRIVE_API}/files?${encodeDriveParams({
      corpora: 'drive',
      driveId,
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      q,
      fields: 'files(id,name)',
      pageSize: '10',
    })}`);
    if (!response.ok) {
      throw new Error(`Google Drive file lookup failed: HTTP ${response.status} — ${await response.text()}`);
    }
    const data = await response.json() as { files?: DriveFile[] };
    return data.files?.[0] ?? null;
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    const response = await this.request(`${DRIVE_API}/files/${fileId}?alt=media&supportsAllDrives=true`);
    if (!response.ok) {
      throw new Error(`Google Drive download failed: HTTP ${response.status} — ${await response.text()}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async uploadFile(folderPath: string, name: string, mimeType: string, content: Buffer): Promise<void> {
    const folderId = await this.resolveFolder(folderPath);
    if (!folderId) throw new Error(`Google Drive folder not found: ${folderPath}`);

    const metadata = { name, mimeType, parents: [folderId] };
    const boundary = `whiteport-${Date.now()}`;
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
      content,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await this.request(`${DRIVE_UPLOAD_API}/files?uploadType=multipart&supportsAllDrives=true`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    });
    if (!response.ok) {
      throw new Error(`Google Drive upload failed: HTTP ${response.status} — ${await response.text()}`);
    }
  }
}

function createDriveCacheClient(projectRoot: string, fetchImpl: typeof fetch, logger: Logger): DriveCacheClient | null {
  const key = loadServiceAccountKey(projectRoot);
  if (!key) return null;

  const sharedDriveName = process.env.GOOGLE_SHARED_DRIVE_NAME || DEFAULT_SHARED_DRIVE_NAME;
  logger.info(`ElevenLabs Drive cache enabled for Shared Drive: ${sharedDriveName}`);
  return new GoogleDriveCacheClient(key, fetchImpl, sharedDriveName);
}

// ── MP3 stitching ──

function ffmpegPath(): string {
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

function assertFfmpegAvailable() {
  const result = spawnSync(ffmpegPath(), ['-version'], { encoding: 'utf-8' });
  if (result.error || result.status !== 0) {
    throw new Error('ffmpeg is required for chunked article audio but was not found. Set FFMPEG_PATH if needed.');
  }
}

function escapeConcatPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/'/g, "'\\''");
}

function concatenateMp3sWithSilence(buffers: Buffer[], cacheDir: string, baseName: string): Buffer {
  assertFfmpegAvailable();
  const workDir = join(cacheDir, `${baseName}-${Date.now()}`);
  mkdirSync(workDir, { recursive: true });

  try {
    const silencePath = join(workDir, 'silence.mp3');
    const silence = spawnSync(ffmpegPath(), [
      '-y',
      '-f', 'lavfi',
      '-i', 'anullsrc=r=44100:cl=mono',
      '-t', String(CHUNK_SILENCE_SECONDS),
      '-q:a', '9',
      '-acodec', 'libmp3lame',
      silencePath,
    ], { encoding: 'utf-8' });
    if (silence.status !== 0) {
      throw new Error(`ffmpeg silence generation failed: ${silence.stderr}`);
    }

    const listEntries: string[] = [];
    buffers.forEach((buffer, index) => {
      const chunkPath = join(workDir, `chunk-${index}.mp3`);
      writeFileSync(chunkPath, buffer);
      if (index > 0) listEntries.push(`file '${escapeConcatPath(silencePath)}'`);
      listEntries.push(`file '${escapeConcatPath(chunkPath)}'`);
    });

    const listPath = join(workDir, 'concat.txt');
    const outputPath = join(workDir, 'output.mp3');
    writeFileSync(listPath, listEntries.join('\n'));

    const concat = spawnSync(ffmpegPath(), [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', listPath,
      '-acodec', 'libmp3lame',
      '-q:a', '4',
      outputPath,
    ], { encoding: 'utf-8' });
    if (concat.status !== 0) {
      throw new Error(`ffmpeg MP3 concatenation failed: ${concat.stderr}`);
    }

    return readFileSync(outputPath);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

// ── Main Pipeline ──

function parseMaxAudioPerBuild(value: string | undefined): number {
  if (!value) return DEFAULT_MAX_AUDIO_PER_BUILD;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_MAX_AUDIO_PER_BUILD;
}

function relativeDisplayPath(projectRoot: string, path: string): string {
  return relative(projectRoot, path).split(sep).join('/');
}

function audioBaseName(article: ArticleInput): string {
  return `${article.slug}-elevenlabs-${article.hash}`;
}

function audioPaths(projectRoot: string, article: ArticleInput) {
  const baseName = audioBaseName(article);
  return {
    baseName,
    mp3Name: `${baseName}.mp3`,
    jsonName: `${baseName}.json`,
    mp3Path: join(projectRoot, PUBLIC_DIR, `${baseName}.mp3`),
    jsonPath: join(projectRoot, PUBLIC_DIR, `${baseName}.json`),
  };
}

async function downloadDriveCache(
  article: ArticleInput,
  projectRoot: string,
  driveCache: DriveCacheClient,
): Promise<boolean> {
  if (!article.mediaFolder) return false;

  const { mp3Name, jsonName, mp3Path, jsonPath } = audioPaths(projectRoot, article);
  const [mp3File, jsonFile] = await Promise.all([
    driveCache.findFile(article.mediaFolder, mp3Name),
    driveCache.findFile(article.mediaFolder, jsonName),
  ]);
  if (!mp3File || !jsonFile) return false;

  const [mp3, json] = await Promise.all([
    driveCache.downloadFile(mp3File.id),
    driveCache.downloadFile(jsonFile.id),
  ]);

  mkdirSync(dirname(mp3Path), { recursive: true });
  writeFileSync(mp3Path, mp3);
  writeFileSync(jsonPath, json);
  return true;
}

async function uploadDriveCache(
  article: ArticleInput,
  projectRoot: string,
  driveCache: DriveCacheClient | null,
  audio: Buffer,
  alignmentJson: AlignmentJson,
): Promise<void> {
  if (!driveCache || !article.mediaFolder) return;
  const { mp3Name, jsonName } = audioPaths(projectRoot, article);
  await driveCache.uploadFile(article.mediaFolder, mp3Name, 'audio/mpeg', audio);
  await driveCache.uploadFile(
    article.mediaFolder,
    jsonName,
    'application/json',
    Buffer.from(JSON.stringify(alignmentJson, null, 2)),
  );
}

async function generateArticle(
  article: ArticleInput,
  projectRoot: string,
  apiKey: string,
  voiceId: string,
  fetchImpl: typeof fetch,
  driveCache: DriveCacheClient | null,
): Promise<GeneratedArticle> {
  const cacheDir = join(projectRoot, CACHE_DIR);
  const { baseName, mp3Path, jsonPath } = audioPaths(projectRoot, article);
  const chunks = chunkText(article.text);
  const audioBuffers: Buffer[] = [];
  const words: WordAlignment[] = [];
  let offset = 0;

  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(dirname(mp3Path), { recursive: true });

  for (const chunk of chunks) {
    const result = await synthesizeWithTimestamps(chunk, apiKey, voiceId, fetchImpl);
    audioBuffers.push(Buffer.from(result.audio_base64, 'base64'));
    words.push(...aggregateWords(result.alignment, offset));
    offset += alignmentDuration(result.alignment) + CHUNK_SILENCE_SECONDS;
  }

  const audio = audioBuffers.length === 1
    ? audioBuffers[0]
    : concatenateMp3sWithSilence(audioBuffers, cacheDir, baseName);

  const alignmentJson: AlignmentJson = {
    hash: article.hash,
    generatedAt: new Date().toISOString(),
    words,
  };

  const jsonContent = JSON.stringify(alignmentJson, null, 2);
  writeFileSync(mp3Path, audio);
  writeFileSync(jsonPath, jsonContent);
  await uploadDriveCache(article, projectRoot, driveCache, audio, alignmentJson);

  return {
    slug: article.slug,
    hash: article.hash,
    mp3Path,
    jsonPath,
    wordCount: words.length,
    chunks: chunks.length,
  };
}

export async function runElevenLabsPipeline(options: PipelineOptions = {}): Promise<PipelineResult> {
  const projectRoot = options.projectRoot ?? process.cwd();
  loadEnvFile(projectRoot);

  const logger = options.logger ?? console;
  const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
  const voiceId = options.voiceId ?? process.env.ELEVENLABS_VOICE_ID;
  const maxAudioPerBuild = options.maxAudioPerBuild ?? parseMaxAudioPerBuild(process.env.MAX_AUDIO_PER_BUILD);
  const fetchImpl = options.fetchImpl ?? fetch;

  logger.info('Scanning blog posts for ElevenLabs audio...');

  const articles = scanArticles(projectRoot);
  if (articles.length === 0) {
    logger.info('No blog articles found for audio generation.');
    return { total: 0, generated: 0, cached: 0, skipped: 0, failed: [], generatedArticles: [] };
  }

  mkdirSync(join(projectRoot, PUBLIC_DIR), { recursive: true });
  const driveCache = options.driveCache === undefined
    ? createDriveCacheClient(projectRoot, fetchImpl, logger)
    : options.driveCache;
  const canGenerate = Boolean(apiKey && voiceId);

  if (!canGenerate) {
    logger.info(
      'ElevenLabs credentials not configured — checking local/Drive cache only. ' +
      'Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID to enable generation.'
    );
  }

  let generated = 0;
  let cached = 0;
  let skipped = 0;
  const failed: ArticleInput[] = [];
  const generatedArticles: GeneratedArticle[] = [];

  for (const article of articles) {
    const { mp3Path, jsonPath } = audioPaths(projectRoot, article);

    if (existsSync(mp3Path) && existsSync(jsonPath)) {
      cached++;
      continue;
    }

    if (driveCache && article.mediaFolder) {
      try {
        const driveHit = await downloadDriveCache(article, projectRoot, driveCache);
        if (driveHit) {
          cached++;
          logger.info(`  Drive cache hit: ${article.slug} (${article.mediaFolder})`);
          continue;
        }
      } catch (err) {
        const msg = `  [elevenlabs] Drive cache read failed for ${article.slug}: ${(err as Error).message}`;
        if (logger.warn) logger.warn(msg);
        else logger.info(msg);
      }
    }

    if (!canGenerate) {
      skipped++;
      continue;
    }

    if (generated >= maxAudioPerBuild) {
      skipped++;
      continue;
    }

    try {
      logger.info(`  Generating audio: ${article.slug} (${article.text.length} chars)`);
      const result = await generateArticle(article, projectRoot, apiKey!, voiceId!, fetchImpl, driveCache);
      generatedArticles.push(result);
      generated++;
      logger.info(`  ✓ ${relativeDisplayPath(projectRoot, result.mp3Path)} (${result.wordCount} words, ${result.chunks} chunk${result.chunks === 1 ? '' : 's'})`);
    } catch (err) {
      failed.push(article);
      const msg = `  [elevenlabs] ${article.slug}: ${(err as Error).message}`;
      if (logger.warn) logger.warn(msg);
      else logger.info(msg);
    }
  }

  logger.info(
    `ElevenLabs audio pipeline: ${generated} generated, ${cached} cached, ${skipped} skipped, ${failed.length} failed.`
  );

  // Default: lenient — transient API failures (429, 5xx, network blips) should
  // not break a production deploy when other articles generated fine. Opt into
  // strict failure with ELEVENLABS_STRICT=true if a build pipeline needs it.
  if (failed.length > 0 && process.env.ELEVENLABS_STRICT === 'true') {
    throw new Error(
      `astro-elevenlabs: ${failed.length} article(s) failed audio generation. ` +
      `Unset ELEVENLABS_STRICT or set it to false to build anyway.`
    );
  }

  return { total: articles.length, generated, cached, skipped, failed, generatedArticles };
}

export default function astroElevenLabsIntegration(): AstroIntegration {
  return {
    name: 'astro-elevenlabs',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        await runElevenLabsPipeline({ logger });
      },
      'astro:server:setup': async ({ logger }) => {
        if (process.env.ELEVENLABS_GENERATE_IN_DEV === 'true') {
          await runElevenLabsPipeline({ logger });
        } else {
          logger.info('ElevenLabs audio generation is disabled in dev. Set ELEVENLABS_GENERATE_IN_DEV=true to run it.');
        }
      },
    },
  };
}

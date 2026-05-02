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
import { createHash } from 'crypto';
import { spawnSync } from 'child_process';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import type { AstroIntegration } from 'astro';

const CACHE_DIR = '.cache/elevenlabs';
const PUBLIC_DIR = 'public/audio';
const BLOG_DIR = 'src/content/blog';
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';
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

function contentHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}

function safeSlug(sourcePath: string, contentDir: string): string {
  const relPath = relative(contentDir, sourcePath).replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '');
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

async function generateArticle(
  article: ArticleInput,
  projectRoot: string,
  apiKey: string,
  voiceId: string,
  fetchImpl: typeof fetch,
): Promise<GeneratedArticle> {
  const cacheDir = join(projectRoot, CACHE_DIR);
  const publicDir = join(projectRoot, PUBLIC_DIR);
  const baseName = `${article.slug}-read-${article.hash}`;
  const mp3Path = join(publicDir, `${baseName}.mp3`);
  const jsonPath = join(publicDir, `${baseName}.json`);
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

  writeFileSync(mp3Path, audio);
  writeFileSync(jsonPath, JSON.stringify(alignmentJson, null, 2));

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

  if (!apiKey || !voiceId) {
    logger.info(
      'ElevenLabs credentials not configured — skipping audio generation. ' +
      'Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID to enable it.'
    );
    return { total: articles.length, generated: 0, cached: 0, skipped: articles.length, failed: [], generatedArticles: [] };
  }

  mkdirSync(join(projectRoot, PUBLIC_DIR), { recursive: true });

  let generated = 0;
  let cached = 0;
  let skipped = 0;
  const failed: ArticleInput[] = [];
  const generatedArticles: GeneratedArticle[] = [];

  for (const article of articles) {
    const baseName = `${article.slug}-read-${article.hash}`;
    const mp3Path = join(projectRoot, PUBLIC_DIR, `${baseName}.mp3`);
    const jsonPath = join(projectRoot, PUBLIC_DIR, `${baseName}.json`);

    if (existsSync(mp3Path) && existsSync(jsonPath)) {
      cached++;
      continue;
    }

    if (generated >= maxAudioPerBuild) {
      skipped++;
      continue;
    }

    try {
      logger.info(`  Generating audio: ${article.slug} (${article.text.length} chars)`);
      const result = await generateArticle(article, projectRoot, apiKey, voiceId, fetchImpl);
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

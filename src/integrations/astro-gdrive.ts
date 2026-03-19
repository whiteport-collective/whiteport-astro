/**
 * astro-gdrive — Build-time Google Drive & media pipeline.
 *
 * Downloads GDrive images and videos, plus migrates WP-hosted media.
 * All media is cached in .cache/gdrive/ and copied to public/media/gdrive/
 * at build time. Both directories are gitignored — zero media in the repo.
 *
 * Authentication strategy (layered):
 * 1. Google Service Account (GOOGLE_SERVICE_ACCOUNT_JSON env var)
 *    → Uses Drive API v3 for all files, regardless of share status
 * 2. Public endpoints (fallback, no auth needed)
 *    → Thumbnail API for images, /uc?export=download for videos
 *    → Only works for publicly shared files
 *
 * Setup for service account:
 * 1. Create a service account in Google Cloud Console
 * 2. Enable Google Drive API
 * 3. Download the JSON key file
 * 4. Set GOOGLE_SERVICE_ACCOUNT_JSON in .env (the full JSON string)
 *    or GOOGLE_SERVICE_ACCOUNT_KEY_FILE (path to the JSON file)
 * 5. Share the GDrive folder with the service account email
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { createSign } from 'crypto';
import type { AstroIntegration } from 'astro';

const CACHE_DIR = '.cache/gdrive';
const PUBLIC_DIR = 'public/media/gdrive';
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// ── Types ──

interface ManifestEntry {
  localPath: string;
  downloadedAt: string;
  size: number;
  type: 'image' | 'video';
  source: 'gdrive' | 'wp-migrate';
  modifiedTime?: string; // GDrive file modifiedTime for staleness check
}

interface CacheManifest {
  [key: string]: ManifestEntry;
}

interface ScannedMedia {
  id: string;
  type: 'image' | 'video';
  source: 'gdrive' | 'wp-migrate';
  wpUrl?: string;
}

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

// ── Env file loader (no dotenv dependency) ──

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env');
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

// ── Google Service Account Auth ──

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function loadServiceAccountKey(): ServiceAccountKey | null {
  // Option 1: Full JSON in env var
  const jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch {
      console.warn('[gdrive] Invalid GOOGLE_SERVICE_ACCOUNT_JSON — ignoring');
    }
  }

  // Option 2: Path to JSON file
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  if (keyFile && existsSync(keyFile)) {
    try {
      return JSON.parse(readFileSync(keyFile, 'utf-8'));
    } catch {
      console.warn('[gdrive] Failed to read service account key file — ignoring');
    }
  }

  return null;
}

/**
 * Create a signed JWT and exchange it for a Google access token.
 * Uses Node.js built-in crypto — zero dependencies.
 */
async function getAccessToken(key: ServiceAccountKey): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60_000) {
    return cachedAccessToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    scope: SCOPES,
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

  const jwt = `${unsigned}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${response.status} — ${text}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// ── Manifest ──

function loadManifest(projectRoot: string): CacheManifest {
  const manifestPath = join(projectRoot, CACHE_DIR, 'manifest.json');
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, 'utf-8'));
  }
  return {};
}

function saveManifest(projectRoot: string, manifest: CacheManifest) {
  const manifestPath = join(projectRoot, CACHE_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

// ── Content Scanner ──

function scanForMedia(projectRoot: string): ScannedMedia[] {
  const media: ScannedMedia[] = [];
  const seen = new Set<string>();
  const contentDir = join(projectRoot, 'src/content/blog');

  if (!existsSync(contentDir)) return media;

  const files = readdirSync(contentDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  for (const file of files) {
    const content = readFileSync(join(contentDir, file), 'utf-8');
    const lines = content.split('\n');
    let currentGdriveId: string | null = null;
    let currentSrc: string | null = null;
    let currentType: 'image' | 'video' = 'image';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('- gdriveId:') || line.startsWith('- src:')) {
        // Flush previous item
        if (currentGdriveId && !seen.has(currentGdriveId)) {
          seen.add(currentGdriveId);
          media.push({ id: currentGdriveId, type: currentType, source: 'gdrive' });
        }
        if (currentSrc && currentSrc.includes('whiteport.com/wp-content/') && !seen.has(currentSrc)) {
          seen.add(currentSrc);
          const filename = currentSrc.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
          media.push({ id: `wp-${filename}`, type: currentType, source: 'wp-migrate', wpUrl: currentSrc });
        }

        currentGdriveId = null;
        currentSrc = null;
        currentType = 'image';

        const gdriveMatch = line.match(/gdriveId:\s*"?([a-zA-Z0-9_-]+)"?/);
        if (gdriveMatch) currentGdriveId = gdriveMatch[1];

        const srcMatch = line.match(/src:\s*"?([^"]+)"?/);
        if (srcMatch) currentSrc = srcMatch[1].trim();
      }

      if (line.startsWith('type:') && (line.includes('video') || line.includes('image'))) {
        currentType = line.includes('video') ? 'video' : 'image';
      }

      if (line.startsWith('poster:') && !line.includes('http')) {
        const posterMatch = line.match(/poster:\s*"?([a-zA-Z0-9_-]+)"?/);
        if (posterMatch && !seen.has(posterMatch[1])) {
          seen.add(posterMatch[1]);
          media.push({ id: posterMatch[1], type: 'image', source: 'gdrive' });
        }
      }
    }

    // Flush last item
    if (currentGdriveId && !seen.has(currentGdriveId)) {
      seen.add(currentGdriveId);
      media.push({ id: currentGdriveId, type: currentType, source: 'gdrive' });
    }
    if (currentSrc && currentSrc.includes('whiteport.com/wp-content/') && !seen.has(currentSrc)) {
      seen.add(currentSrc);
      const filename = currentSrc.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
      media.push({ id: `wp-${filename}`, type: currentType, source: 'wp-migrate', wpUrl: currentSrc });
    }
  }

  return media;
}

// ── Download Functions ──

/**
 * Download via Google Drive API v3 (authenticated).
 * Works for all files regardless of share status.
 */
async function downloadViaApi(gdriveId: string, accessToken: string, outputPath: string): Promise<number> {
  const url = `${DRIVE_API}/${gdriveId}?alt=media`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'WhiteportAstro/1.0',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`  [gdrive] API download failed: HTTP ${response.status} — ${gdriveId}`);
      return 0;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, buffer);
    return buffer.length;
  } catch (err) {
    console.warn(`  [gdrive] API error: ${(err as Error).message}`);
    return 0;
  }
}

/**
 * Download a GDrive image via public thumbnail URL (no auth).
 */
async function downloadPublicImage(gdriveId: string, outputPath: string): Promise<number> {
  const url = `https://drive.google.com/thumbnail?id=${gdriveId}&sz=w1600`;
  return downloadPublicFile(url, outputPath);
}

/**
 * Download a GDrive video via public direct download URL (no auth).
 */
async function downloadPublicVideo(gdriveId: string, outputPath: string): Promise<number> {
  const url = `https://drive.google.com/uc?export=download&id=${gdriveId}`;
  return downloadPublicFile(url, outputPath);
}

/**
 * Download any file from a public URL.
 */
async function downloadPublicFile(url: string, outputPath: string): Promise<number> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'WhiteportAstro/1.0' },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`  [gdrive] Failed: HTTP ${response.status} — ${url}`);
      return 0;
    }

    // Handle Google's virus scan confirmation page
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch) {
        const confirmUrl = `${url}&confirm=${confirmMatch[1]}`;
        return downloadPublicFile(confirmUrl, outputPath);
      }
      console.warn(`  [gdrive] Got HTML instead of file (needs auth) — ${url}`);
      return 0;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, buffer);
    return buffer.length;
  } catch (err) {
    console.warn(`  [gdrive] Error: ${(err as Error).message}`);
    return 0;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ── Main Pipeline ──

interface PipelineResult {
  total: number;
  downloaded: number;
  cached: number;
  copied: number;
  failed: ScannedMedia[];
  mediaItems: ScannedMedia[];
}

async function runPipeline(logger: { info: (msg: string) => void }): Promise<PipelineResult> {
  const projectRoot = process.cwd();

  logger.info('Scanning content for media references...');

  const mediaItems = scanForMedia(projectRoot);
  if (mediaItems.length === 0) {
    logger.info('No media references found.');
    return { total: 0, downloaded: 0, cached: 0, copied: 0, failed: [], mediaItems: [] };
  }

  const images = mediaItems.filter(m => m.type === 'image');
  const videos = mediaItems.filter(m => m.type === 'video');
  logger.info(`Found ${mediaItems.length} media items (${images.length} images, ${videos.length} videos).`);

  // Try to load service account for authenticated downloads
  const serviceAccountKey = loadServiceAccountKey();
  let accessToken: string | null = null;

  if (serviceAccountKey) {
    try {
      accessToken = await getAccessToken(serviceAccountKey);
      logger.info('Using Google Service Account for authenticated downloads.');
    } catch (err) {
      logger.info(`Service account auth failed: ${(err as Error).message} — falling back to public endpoints.`);
    }
  } else {
    logger.info('No service account configured — using public endpoints (set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_KEY_FILE for full access).');
  }

  // Ensure directories exist
  mkdirSync(join(projectRoot, CACHE_DIR), { recursive: true });
  mkdirSync(join(projectRoot, PUBLIC_DIR), { recursive: true });

  const manifest = loadManifest(projectRoot);

  // Check for stale cached files by comparing remote size to manifest
  const staleIds = new Set<string>();
  if (accessToken) {
    const cachedGdriveIds = mediaItems
      .filter(m => m.source === 'gdrive' && manifest[m.id])
      .map(m => m.id);

    if (cachedGdriveIds.length > 0) {
      // Batch HEAD requests in groups of 20
      for (let i = 0; i < cachedGdriveIds.length; i += 20) {
        const batch = cachedGdriveIds.slice(i, i + 20);
        await Promise.all(batch.map(async (id) => {
          try {
            // Try metadata API first (works if folder is shared with SA)
            const metaRes = await fetch(`${DRIVE_API}/${id}?fields=modifiedTime`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (metaRes.ok) {
              const data = await metaRes.json() as { modifiedTime: string };
              if (manifest[id].modifiedTime && data.modifiedTime !== manifest[id].modifiedTime) {
                staleIds.add(id);
              } else if (!manifest[id].modifiedTime) {
                // Backfill modifiedTime for existing entries
                manifest[id].modifiedTime = data.modifiedTime;
              }
              return;
            }
            // Fallback: HEAD request to check Content-Length
            const headRes = await fetch(`${DRIVE_API}/${id}?alt=media`, {
              method: 'HEAD',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (headRes.ok) {
              const remoteSize = parseInt(headRes.headers.get('content-length') || '0', 10);
              if (remoteSize > 0 && remoteSize !== manifest[id].size) {
                staleIds.add(id);
              }
            }
          } catch { /* ignore — will use cached version */ }
        }));
      }
      if (staleIds.size > 0) {
        logger.info(`Found ${staleIds.size} updated file(s) on GDrive — re-downloading.`);
      }
    }
  }

  let downloaded = 0;
  let cached = 0;
  let copied = 0;
  const failedItems: ScannedMedia[] = [];

  for (const item of mediaItems) {
    const ext = item.type === 'video' ? '.mp4' : '.jpg';
    const cachePath = join(projectRoot, CACHE_DIR, `${item.id}${ext}`);
    const publicPath = join(projectRoot, PUBLIC_DIR, `${item.id}${ext}`);
    const servePath = `/media/gdrive/${item.id}${ext}`;

    // Step 1: Ensure file is in cache (skip if stale)
    if (manifest[item.id] && existsSync(cachePath) && !staleIds.has(item.id)) {
      cached++;
    } else {
      let size = 0;

      if (item.source === 'wp-migrate' && item.wpUrl) {
        logger.info(`  Migrating WP media: ${item.wpUrl.split('/').pop()}`);
        size = await downloadPublicFile(item.wpUrl, cachePath);
      } else if (accessToken) {
        logger.info(`  Downloading via API: ${item.id} (${item.type})`);
        size = await downloadViaApi(item.id, accessToken, cachePath);

        // Refresh token if expired mid-pipeline
        if (size === 0 && serviceAccountKey) {
          try {
            cachedAccessToken = null;
            accessToken = await getAccessToken(serviceAccountKey);
            size = await downloadViaApi(item.id, accessToken, cachePath);
          } catch {
            // Fall through to public fallback
          }
        }
      }

      // Fallback to public endpoints if API didn't work or isn't available
      if (size === 0 && item.source === 'gdrive') {
        if (item.type === 'video') {
          logger.info(`  Trying public download: ${item.id}`);
          size = await downloadPublicVideo(item.id, cachePath);
        } else {
          size = await downloadPublicImage(item.id, cachePath);
        }
      }

      if (size > 0) {
        // Fetch modifiedTime for GDrive files when we have auth
        let modifiedTime: string | undefined;
        if (accessToken && item.source === 'gdrive') {
          try {
            const metaRes = await fetch(`${DRIVE_API}/${item.id}?fields=modifiedTime`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (metaRes.ok) {
              const meta = await metaRes.json() as { modifiedTime: string };
              modifiedTime = meta.modifiedTime;
            }
          } catch { /* non-critical */ }
        }

        manifest[item.id] = {
          localPath: servePath,
          downloadedAt: new Date().toISOString(),
          size,
          type: item.type,
          source: item.source,
          ...(modifiedTime && { modifiedTime }),
        };
        downloaded++;
        logger.info(`  ✓ ${item.id} (${formatSize(size)})`);
      } else {
        failedItems.push(item);
        continue;
      }

      // Rate limit: 200ms between requests
      await new Promise(r => setTimeout(r, 200));
    }

    // Step 2: Copy from cache to public (if missing or re-downloaded)
    const needsCopy = existsSync(cachePath) && (!existsSync(publicPath) || staleIds.has(item.id));
    if (needsCopy) {
      mkdirSync(dirname(publicPath), { recursive: true });
      copyFileSync(cachePath, publicPath);
      copied++;
    }
  }

  saveManifest(projectRoot, manifest);

  const totalSize = Object.values(manifest).reduce((sum, e) => sum + e.size, 0);
  logger.info(
    `Media pipeline: ${downloaded} downloaded, ${cached} cached, ${copied} copied to public, ${failedItems.length} failed. Total: ${formatSize(totalSize)}`
  );

  return { total: mediaItems.length, downloaded, cached, copied, failed: failedItems, mediaItems };
}

export default function astroDriveIntegration(): AstroIntegration {
  let lastResult: PipelineResult | null = null;

  return {
    name: 'astro-gdrive',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        const result = await runPipeline(logger);
        lastResult = result;

        // ── Build gate: fail the build if any media couldn't be downloaded ──
        if (result.failed.length > 0) {
          logger.info('');
          logger.info('╔══════════════════════════════════════════════════════════╗');
          logger.info('║  BUILD BLOCKED — Media verification failed              ║');
          logger.info('╚══════════════════════════════════════════════════════════╝');
          logger.info('');
          logger.info(`${result.failed.length} media file(s) could not be downloaded:`);
          logger.info('');

          for (const item of result.failed) {
            const label = item.source === 'wp-migrate'
              ? `WP: ${item.wpUrl}`
              : `GDrive: ${item.id}`;
            logger.info(`  ✗ [${item.type}] ${label}`);
          }

          logger.info('');
          logger.info('To fix:');
          logger.info('  1. Ensure files are shared on Google Drive ("Anyone with the link")');
          logger.info('  2. Or set up a service account (see .env.example)');
          logger.info('  3. Or skip this check: GDRIVE_STRICT=false npm run build');
          logger.info('');

          // Allow overriding in development
          const strict = process.env.GDRIVE_STRICT !== 'false';
          if (strict) {
            throw new Error(
              `astro-gdrive: ${result.failed.length} media file(s) unavailable. ` +
              `Set GDRIVE_STRICT=false to build anyway.`
            );
          } else {
            logger.info('GDRIVE_STRICT=false — continuing build with missing media.');
          }
        }
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (!lastResult) return;
        const manifest = lastResult.mediaItems.map(item => ({
          id: item.id,
          type: item.type,
          source: item.source,
          ...(item.wpUrl && { wpUrl: item.wpUrl }),
        }));
        const outPath = join(dir.pathname.replace(/^\/([A-Z]:)/, '$1'), 'media-manifest.json');
        writeFileSync(outPath, JSON.stringify(manifest, null, 2));
        logger.info(`Wrote media-manifest.json (${manifest.length} items) to dist/`);
      },
      'astro:server:setup': async ({ logger }) => {
        // Dev mode: always non-strict, just warn about missing media
        const result = await runPipeline(logger);
        if (result.failed.length > 0) {
          logger.info(`[dev] ${result.failed.length} media file(s) unavailable — pages will show placeholders.`);
        }
      },
    },
  };
}

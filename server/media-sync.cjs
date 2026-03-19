#!/usr/bin/env node
/**
 * media-sync.cjs — Server-side GDrive media downloader.
 *
 * Runs on the Hostup cPanel server to download media directly from Google Drive,
 * avoiding the need to upload 900MB+ from local machine.
 *
 * Usage:
 *   node media-sync.cjs [--manifest path] [--output path] [--key path]
 *
 * Defaults:
 *   --manifest ./media-manifest.json
 *   --output   ./media/gdrive
 *   --key      ./service-account-key.json
 *
 * Requires Node.js 18+ (native fetch).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Config ──

const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const MANIFEST_PATH = getArg('manifest', './media-manifest.json');
const OUTPUT_DIR = getArg('output', './media/gdrive');
const KEY_PATH = getArg('key', './service-account-key.json');
const STATE_PATH = path.join(path.dirname(MANIFEST_PATH), 'sync-state.json');

const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// ── Google Service Account Auth ──

let cachedAccessToken = null;

function loadServiceAccountKey() {
  if (!fs.existsSync(KEY_PATH)) {
    console.warn(`[sync] No service account key at ${KEY_PATH} — using public endpoints only`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(KEY_PATH, 'utf-8'));
  } catch (err) {
    console.warn(`[sync] Failed to read service account key: ${err.message}`);
    return null;
  }
}

async function getAccessToken(key) {
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 60000) {
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

  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${b64url(header)}.${b64url(payload)}`;

  const signer = crypto.createSign('RSA-SHA256');
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

  const data = await response.json();
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// ── Download Functions ──

async function downloadViaApi(gdriveId, accessToken, outputPath) {
  const url = `${DRIVE_API}/${gdriveId}?alt=media`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'WhiteportMediaSync/1.0',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`  [api] HTTP ${response.status} — ${gdriveId}`);
      return 0;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    return buffer.length;
  } catch (err) {
    console.warn(`  [api] Error: ${err.message}`);
    return 0;
  }
}

async function downloadPublicImage(gdriveId, outputPath) {
  const url = `https://drive.google.com/thumbnail?id=${gdriveId}&sz=w1600`;
  return downloadPublicFile(url, outputPath);
}

async function downloadPublicVideo(gdriveId, outputPath) {
  const url = `https://drive.google.com/uc?export=download&id=${gdriveId}`;
  return downloadPublicFile(url, outputPath);
}

async function downloadPublicFile(url, outputPath) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'WhiteportMediaSync/1.0' },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`  [public] HTTP ${response.status} — ${url}`);
      return 0;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch) {
        return downloadPublicFile(`${url}&confirm=${confirmMatch[1]}`, outputPath);
      }
      console.warn(`  [public] Got HTML instead of file (needs auth) — ${url}`);
      return 0;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    return buffer.length;
  } catch (err) {
    console.warn(`  [public] Error: ${err.message}`);
    return 0;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ── State Management ──

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8')); } catch { return {}; }
  }
  return {};
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// ── Main ──

async function main() {
  console.log('=== Whiteport Media Sync ===');
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Output:   ${OUTPUT_DIR}`);
  console.log(`Key:      ${KEY_PATH}`);
  console.log('');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`Found ${manifest.length} media items in manifest`);

  const serviceAccountKey = loadServiceAccountKey();
  let accessToken = null;

  if (serviceAccountKey) {
    try {
      accessToken = await getAccessToken(serviceAccountKey);
      console.log('Authenticated via Google Service Account');
    } catch (err) {
      console.warn(`Service account auth failed: ${err.message} — using public endpoints`);
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const state = loadState();
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytes = 0;

  for (const item of manifest) {
    const ext = item.type === 'video' ? '.mp4' : '.jpg';
    const filename = `${item.id}${ext}`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Skip if already downloaded and file exists
    if (state[item.id] && fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    let size = 0;

    if (item.source === 'wp-migrate' && item.wpUrl) {
      console.log(`  Downloading WP media: ${item.wpUrl.split('/').pop()}`);
      size = await downloadPublicFile(item.wpUrl, outputPath);
    } else if (accessToken) {
      console.log(`  Downloading via API: ${item.id} (${item.type})`);
      size = await downloadViaApi(item.id, accessToken, outputPath);

      // Refresh token if expired
      if (size === 0 && serviceAccountKey) {
        try {
          cachedAccessToken = null;
          accessToken = await getAccessToken(serviceAccountKey);
          size = await downloadViaApi(item.id, accessToken, outputPath);
        } catch { /* fall through to public */ }
      }
    }

    // Fallback to public endpoints
    if (size === 0 && item.source === 'gdrive') {
      if (item.type === 'video') {
        console.log(`  Trying public download: ${item.id}`);
        size = await downloadPublicVideo(item.id, outputPath);
      } else {
        size = await downloadPublicImage(item.id, outputPath);
      }
    }

    if (size > 0) {
      state[item.id] = {
        downloadedAt: new Date().toISOString(),
        size,
        filename,
      };
      downloaded++;
      totalBytes += size;
      console.log(`  OK ${filename} (${formatSize(size)})`);
    } else {
      failed++;
      console.error(`  FAILED ${item.id} (${item.type}, ${item.source})`);
    }

    // Rate limit: 200ms between requests
    await new Promise(r => setTimeout(r, 200));
  }

  saveState(state);

  console.log('');
  console.log(`Done: ${downloaded} downloaded (${formatSize(totalBytes)}), ${skipped} already cached, ${failed} failed`);
  console.log(`Total files in ${OUTPUT_DIR}: ${fs.readdirSync(OUTPUT_DIR).length}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

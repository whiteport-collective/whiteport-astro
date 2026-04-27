#!/usr/bin/env node
/**
 * Deploy to astro.whiteport.com (astrowhi account).
 * Uploads site files + media in one go.
 */

const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const CONFIG = {
  host: process.env.DEPLOY_HOST || 'mu.hostup.se',
  port: parseInt(process.env.DEPLOY_PORT || '22'),
  username: process.env.DEPLOY_ASTRO_USER,
  password: process.env.DEPLOY_ASTRO_PASS,
  remoteBase: '/home/astrowhi/public_html',
};
if (!CONFIG.username || !CONFIG.password) {
  console.error('Missing DEPLOY_ASTRO_USER / DEPLOY_ASTRO_PASS in .env');
  process.exit(1);
}

const DIST_DIR = path.join(__dirname, 'dist');

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(path.join(dir, entry.name), relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

async function main() {
  const sftp = new SftpClient();

  try {
    console.log(`Connecting to ${CONFIG.host} as ${CONFIG.username}...`);
    await sftp.connect({
      host: CONFIG.host,
      port: CONFIG.port,
      username: CONFIG.username,
      password: CONFIG.password,
      readyTimeout: 30000,
    });
    console.log('Connected.');

    // First upload site files (excluding media)
    const siteFiles = (await getAllFiles(DIST_DIR)).filter(f => !f.startsWith('media/gdrive/'));
    console.log(`\nPhase 1: Uploading ${siteFiles.length} site files...`);

    const dirs = new Set();
    for (const file of siteFiles) {
      const dir = path.dirname(file);
      if (dir !== '.') {
        const parts = dir.split('/');
        for (let i = 1; i <= parts.length; i++) dirs.add(parts.slice(0, i).join('/'));
      }
    }
    for (const dir of [...dirs].sort()) {
      try { await sftp.mkdir(`${CONFIG.remoteBase}/${dir}`, true); } catch {}
    }

    let uploaded = 0;
    let totalSize = 0;
    for (const file of siteFiles) {
      const localPath = path.join(DIST_DIR, file);
      const remotePath = `${CONFIG.remoteBase}/${file}`;
      const size = fs.statSync(localPath).size;
      await sftp.put(localPath, remotePath);
      uploaded++;
      totalSize += size;
      if (uploaded % 50 === 0) console.log(`  ${uploaded}/${siteFiles.length} (${formatSize(totalSize)})`);
    }
    console.log(`  Site: ${uploaded} files (${formatSize(totalSize)})`);

    // Now upload media files
    const mediaDir = path.join(DIST_DIR, 'media', 'gdrive');
    if (fs.existsSync(mediaDir)) {
      const mediaFiles = fs.readdirSync(mediaDir).filter(f => !f.startsWith('.'));
      console.log(`\nPhase 2: Uploading ${mediaFiles.length} media files...`);

      try { await sftp.mkdir(`${CONFIG.remoteBase}/media`, true); } catch {}
      try { await sftp.mkdir(`${CONFIG.remoteBase}/media/gdrive`, true); } catch {}

      // Check existing
      let remoteFiles = {};
      try {
        const listing = await sftp.list(`${CONFIG.remoteBase}/media/gdrive`);
        for (const f of listing) remoteFiles[f.name] = f.size;
      } catch {}

      let mediaUploaded = 0;
      let mediaSkipped = 0;
      let mediaBytes = 0;
      let mediaFailed = 0;

      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const localPath = path.join(mediaDir, file);
        const remotePath = `${CONFIG.remoteBase}/media/gdrive/${file}`;
        const localSize = fs.statSync(localPath).size;

        if (remoteFiles[file] && remoteFiles[file] === localSize) {
          mediaSkipped++;
          continue;
        }

        try {
          await sftp.put(localPath, remotePath);
          mediaUploaded++;
          mediaBytes += localSize;
          console.log(`  [${i + 1}/${mediaFiles.length}] ${file} (${formatSize(localSize)})`);
        } catch (err) {
          mediaFailed++;
          console.error(`  FAILED ${file}: ${err.message}`);
          // Reconnect
          try {
            await sftp.end();
            await sftp.connect({
              host: CONFIG.host, port: CONFIG.port,
              username: CONFIG.username, password: CONFIG.password,
              readyTimeout: 30000,
            });
          } catch { break; }
        }
      }
      console.log(`  Media: ${mediaUploaded} uploaded (${formatSize(mediaBytes)}), ${mediaSkipped} skipped, ${mediaFailed} failed`);
    }

    console.log('\nDone!');
  } catch (err) {
    console.error('Deploy failed:', err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

main();

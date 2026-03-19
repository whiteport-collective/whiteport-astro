#!/usr/bin/env node
/**
 * Deploy whiteport-astro dist/ to Hostup cPanel via SFTP.
 * Excludes media/gdrive/ (handled by server-side media-sync.cjs).
 *
 * Usage: node deploy.cjs
 */

const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const CONFIG = {
  host: process.env.DEPLOY_HOST || 'mu.hostup.se',
  port: parseInt(process.env.DEPLOY_PORT || '22'),
  username: process.env.DEPLOY_USER,
  password: process.env.DEPLOY_PASS,
  remoteBase: `/home/${process.env.DEPLOY_USER || 'aiwhitep'}/public_html`,
};
if (!CONFIG.username || !CONFIG.password) {
  console.error('Missing DEPLOY_USER / DEPLOY_PASS in .env');
  process.exit(1);
}

const DIST_DIR = path.join(__dirname, 'dist');
const EXCLUDE = ['media/gdrive']; // downloaded server-side

async function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;

    // Skip excluded paths
    if (EXCLUDE.some(ex => relPath.startsWith(ex))) continue;

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
    console.log(`Connecting to ${CONFIG.host}...`);
    await sftp.connect({
      host: CONFIG.host,
      port: CONFIG.port,
      username: CONFIG.username,
      password: CONFIG.password,
      readyTimeout: 30000,
    });
    console.log('Connected.');

    const files = await getAllFiles(DIST_DIR);
    console.log(`Uploading ${files.length} files (excluding media/gdrive)...`);

    // Collect unique directories
    const dirs = new Set();
    for (const file of files) {
      const dir = path.dirname(file);
      if (dir !== '.') {
        const parts = dir.split('/');
        for (let i = 1; i <= parts.length; i++) {
          dirs.add(parts.slice(0, i).join('/'));
        }
      }
    }

    // Create directories
    for (const dir of [...dirs].sort()) {
      const remotePath = `${CONFIG.remoteBase}/${dir}`;
      try {
        await sftp.mkdir(remotePath, true);
      } catch { /* exists */ }
    }

    // Upload files
    let uploaded = 0;
    let totalSize = 0;
    for (const file of files) {
      const localPath = path.join(DIST_DIR, file);
      const remotePath = `${CONFIG.remoteBase}/${file}`;
      const size = fs.statSync(localPath).size;

      await sftp.put(localPath, remotePath);
      uploaded++;
      totalSize += size;

      if (uploaded % 50 === 0 || uploaded === files.length) {
        console.log(`  ${uploaded}/${files.length} files (${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
      }
    }

    console.log(`\nDone: ${uploaded} files uploaded (${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
  } catch (err) {
    console.error('Deploy failed:', err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

main();

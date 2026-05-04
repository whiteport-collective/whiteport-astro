#!/usr/bin/env node
/**
 * Deploy dist/ to Hostup via SFTP.
 *
 * CI path:
 *   HOSTUP_SSH_KEY -> private key for astrowhi@mu.hostup.se
 *
 * Manual fallback:
 *   HOSTUP_PASSWORD or DEPLOY_ASTRO_PASS
 */

const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const CONFIG = {
  host: process.env.HOSTUP_HOST || process.env.DEPLOY_HOST || 'mu.hostup.se',
  port: Number.parseInt(process.env.HOSTUP_PORT || process.env.DEPLOY_PORT || '22', 10),
  username: process.env.HOSTUP_USER || process.env.DEPLOY_ASTRO_USER || 'astrowhi',
  privateKey: normalizePrivateKey(process.env.HOSTUP_SSH_KEY),
  password: process.env.HOSTUP_PASSWORD || process.env.DEPLOY_ASTRO_PASS,
  remoteBase: process.env.HOSTUP_REMOTE_BASE || '/home/astrowhi/public_html',
};

function normalizePrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n').trim() + '\n';
}

function requiredConfig() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`Missing build output: ${DIST_DIR}`);
  }
  if (!CONFIG.privateKey && !CONFIG.password) {
    throw new Error('Missing HOSTUP_SSH_KEY or HOSTUP_PASSWORD/DEPLOY_ASTRO_PASS');
  }
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function listFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(absPath, relPath));
    } else {
      files.push(relPath);
    }
  }

  return files;
}

async function ensureDirs(sftp, remoteRoot, files) {
  const dirs = new Set();
  for (const file of files) {
    const dir = path.posix.dirname(file);
    if (dir === '.') continue;
    const parts = dir.split('/');
    for (let i = 1; i <= parts.length; i++) {
      dirs.add(parts.slice(0, i).join('/'));
    }
  }

  for (const dir of [...dirs].sort()) {
    await sftp.mkdir(`${remoteRoot}/${dir}`, true);
  }
}

async function exists(sftp, remotePath) {
  try {
    return Boolean(await sftp.exists(remotePath));
  } catch {
    return false;
  }
}

async function removeIfExists(sftp, remotePath) {
  if (await exists(sftp, remotePath)) {
    await sftp.rmdir(remotePath, true);
  }
}

async function main() {
  requiredConfig();

  const files = listFiles(DIST_DIR);
  if (files.length === 0) throw new Error('dist/ is empty');

  const deployId = `${Date.now()}-${process.env.GITHUB_RUN_ID || 'local'}`;
  const remoteParent = path.posix.dirname(CONFIG.remoteBase);
  const liveName = path.posix.basename(CONFIG.remoteBase);
  const tempDir = `${remoteParent}/.${liveName}.next-${deployId}`;
  const backupDir = `${remoteParent}/.${liveName}.previous-${deployId}`;
  const sftp = new SftpClient();

  try {
    console.log(`Connecting to ${CONFIG.host} as ${CONFIG.username}...`);
    await sftp.connect({
      host: CONFIG.host,
      port: CONFIG.port,
      username: CONFIG.username,
      privateKey: CONFIG.privateKey,
      password: CONFIG.privateKey ? undefined : CONFIG.password,
      readyTimeout: 30000,
    });

    console.log(`Uploading ${files.length} files to ${tempDir}...`);
    await sftp.mkdir(tempDir, true);
    await ensureDirs(sftp, tempDir, files);

    let uploaded = 0;
    let totalSize = 0;
    for (const file of files) {
      const localPath = path.join(DIST_DIR, file);
      const remotePath = `${tempDir}/${file}`;
      const size = fs.statSync(localPath).size;
      await sftp.put(localPath, remotePath);
      uploaded++;
      totalSize += size;
      if (uploaded % 100 === 0 || uploaded === files.length) {
        console.log(`  ${uploaded}/${files.length} (${formatSize(totalSize)})`);
      }
    }

    console.log('Swapping deployment into place...');
    await removeIfExists(sftp, backupDir);
    if (await exists(sftp, CONFIG.remoteBase)) {
      await sftp.rename(CONFIG.remoteBase, backupDir);
    }
    await sftp.rename(tempDir, CONFIG.remoteBase);
    await removeIfExists(sftp, backupDir);

    console.log(`Deploy complete: ${uploaded} files (${formatSize(totalSize)}) -> ${CONFIG.remoteBase}`);
  } catch (err) {
    console.error(`Deploy failed: ${err.message}`);
    try {
      if (await exists(sftp, tempDir)) await sftp.rmdir(tempDir, true);
      if (!(await exists(sftp, CONFIG.remoteBase)) && await exists(sftp, backupDir)) {
        await sftp.rename(backupDir, CONFIG.remoteBase);
      }
    } catch (cleanupErr) {
      console.error(`Cleanup failed: ${cleanupErr.message}`);
    }
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

main();

#!/usr/bin/env node
/**
 * Upload media/gdrive files to server one-by-one via SFTP.
 * Uses the local .cache/gdrive/ files (already downloaded during build).
 * Skips files that already exist on the server with the same size.
 */

const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  host: 'mu.hostup.se',
  port: 22,
  username: 'aiwhitep',
  password: 'oGzvx%6&tOz%NEfeREHL',
  remoteBase: '/home/aiwhitep/public_html/media/gdrive',
};

const LOCAL_DIR = path.join(__dirname, 'dist', 'media', 'gdrive');

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  if (!fs.existsSync(LOCAL_DIR)) {
    console.error(`Local media dir not found: ${LOCAL_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(LOCAL_DIR).filter(f => !f.startsWith('.'));
  console.log(`Found ${files.length} media files to upload`);

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

    // Ensure remote directory exists
    try { await sftp.mkdir(CONFIG.remoteBase, true); } catch {}

    // Get list of existing remote files for skip logic
    let remoteFiles = {};
    try {
      const listing = await sftp.list(CONFIG.remoteBase);
      for (const f of listing) {
        remoteFiles[f.name] = f.size;
      }
      console.log(`${Object.keys(remoteFiles).length} files already on server`);
    } catch { /* empty dir */ }

    let uploaded = 0;
    let skipped = 0;
    let totalBytes = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localPath = path.join(LOCAL_DIR, file);
      const remotePath = `${CONFIG.remoteBase}/${file}`;
      const localSize = fs.statSync(localPath).size;

      // Skip if same size exists on server
      if (remoteFiles[file] && remoteFiles[file] === localSize) {
        skipped++;
        continue;
      }

      try {
        await sftp.put(localPath, remotePath);
        uploaded++;
        totalBytes += localSize;
        console.log(`  [${i + 1}/${files.length}] ${file} (${formatSize(localSize)})`);
      } catch (err) {
        failed++;
        console.error(`  FAILED ${file}: ${err.message}`);
        // Reconnect on failure
        try {
          await sftp.end();
          await sftp.connect({
            host: CONFIG.host,
            port: CONFIG.port,
            username: CONFIG.username,
            password: CONFIG.password,
            readyTimeout: 30000,
          });
        } catch { break; }
      }
    }

    console.log(`\nDone: ${uploaded} uploaded (${formatSize(totalBytes)}), ${skipped} skipped (already on server), ${failed} failed`);
  } catch (err) {
    console.error('Deploy failed:', err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

main();

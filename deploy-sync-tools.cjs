#!/usr/bin/env node
/**
 * Upload media-sync.cjs + service-account-key.json + media-manifest.json
 * to the Hostup server for server-side media downloading.
 */

const SftpClient = require('ssh2-sftp-client');
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

const FILES = [
  { local: 'server/media-sync.cjs', remote: '_sync/media-sync.cjs' },
  { local: 'service-account-key.json', remote: '_sync/service-account-key.json' },
  { local: 'dist/media-manifest.json', remote: '_sync/media-manifest.json' },
];

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

    // Create _sync directory
    try { await sftp.mkdir(`${CONFIG.remoteBase}/_sync`, true); } catch {}

    for (const file of FILES) {
      const localPath = path.join(__dirname, file.local);
      const remotePath = `${CONFIG.remoteBase}/${file.remote}`;
      console.log(`Uploading ${file.local} → ${file.remote}`);
      await sftp.put(localPath, remotePath);
    }

    console.log('\nDone. To run the sync on the server:');
    console.log('  ssh aiwhitep@mu.hostup.se');
    console.log('  cd public_html');
    console.log('  node _sync/media-sync.cjs --manifest _sync/media-manifest.json --key _sync/service-account-key.json --output media/gdrive');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

main();

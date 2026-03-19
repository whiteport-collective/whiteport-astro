#!/usr/bin/env node
/**
 * Extract poster frames from video files using ffmpeg-static.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');

const MEDIA_DIR = path.join(__dirname, 'public', 'media', 'gdrive');

const videos = [
  'wp-WDS-Session-2-invitation',
  'wp-20-dec-post-link-below-2',
  'wp-Talktocamera-invite-WDS-session1-2',
  'wp-Marten-Whiteport',
];

for (const name of videos) {
  const mp4 = path.join(MEDIA_DIR, `${name}.mp4`);
  const jpg = path.join(MEDIA_DIR, `${name}.jpg`);

  if (!fs.existsSync(mp4)) { console.log(`SKIP: ${name}.mp4 not found`); continue; }
  if (fs.existsSync(jpg)) { console.log(`SKIP: ${name}.jpg already exists`); continue; }

  console.log(`Extracting poster from ${name}.mp4 ...`);
  try {
    execSync(`"${ffmpegPath}" -i "${mp4}" -ss 00:00:00.5 -vframes 1 -q:v 3 "${jpg}" -y`, {
      timeout: 30000,
      stdio: 'pipe',
    });
    const size = Math.round(fs.statSync(jpg).size / 1024);
    console.log(`  OK: ${name}.jpg (${size}KB)`);
  } catch (err) {
    console.log(`  ERROR: ${err.stderr?.toString().split('\n').pop() || err.message}`);
  }
}

console.log('Done!');

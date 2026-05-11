/**
 * Scans all content files and extracts gdriveIds + wp-content URLs into
 * media-manifest.json. The manifest is used as the cache key for GDrive
 * media in CI — it only changes when new media is actually added.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function scanDir(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...scanDir(full));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

const files = scanDir('src/content');
const gdriveIds = new Set();
const wpUrls = new Set();

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  for (const m of content.matchAll(/gdriveId:\s*['"]?([A-Za-z0-9_-]{15,})/g)) {
    gdriveIds.add(m[1]);
  }
  for (const m of content.matchAll(/src:\s*['"]?(https?:\/\/[^'"]+wp-content[^'"]+)/g)) {
    wpUrls.add(m[1]);
  }
}

const manifest = {
  gdriveIds: [...gdriveIds].sort(),
  wpUrls: [...wpUrls].sort(),
};

writeFileSync('media-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`media-manifest.json: ${gdriveIds.size} GDrive IDs, ${wpUrls.size} WP URLs`);

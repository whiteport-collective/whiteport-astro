#!/usr/bin/env node
/**
 * Converts all .jpg/.jpeg/.png in public/images/ to .webp
 * Then updates all references in src/ files.
 *
 * Excludes: favicon.png, og-default.png (social/browser compat)
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');
const SRC_DIR = join(ROOT, 'src');

const EXCLUDE = new Set([
  join(ROOT, 'public', 'favicon.png'),
  join(ROOT, 'public', 'og-default.png'),
]);

const CONVERTABLE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
const SRC_EXTS = new Set(['.astro', '.md', '.mdx', '.ts', '.tsx', '.js']);

// Collect all images to convert
function collectImages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectImages(full));
    } else if (CONVERTABLE_EXTS.has(extname(full).toLowerCase()) && !EXCLUDE.has(full)) {
      results.push(full);
    }
  }
  return results;
}

// Collect all source files to update
function collectSrcFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectSrcFiles(full));
    } else if (SRC_EXTS.has(extname(full).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function convertImage(srcPath) {
  const ext = extname(srcPath).toLowerCase();
  const webpPath = srcPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  const opts = ext === '.png'
    ? { quality: 90, lossless: false }
    : { quality: 85 };

  await sharp(srcPath).webp(opts).toFile(webpPath);

  const origSize = statSync(srcPath).size;
  const webpSize = statSync(webpPath).size;
  const pct = Math.round((1 - webpSize / origSize) * 100);
  return { srcPath, webpPath, origSize, webpSize, pct };
}

function updateReferences(conversions) {
  const srcFiles = collectSrcFiles(SRC_DIR);
  let totalChanges = 0;

  for (const file of srcFiles) {
    let content = readFileSync(file, 'utf8');
    let changed = false;

    for (const { srcPath } of conversions) {
      // Build the URL path (relative to public/) used in src files
      const publicRelative = '/' + relative(join(ROOT, 'public'), srcPath).replace(/\\/g, '/');
      const webpRelative = publicRelative.replace(/\.(jpg|jpeg|png)$/i, '.webp');

      if (content.includes(publicRelative)) {
        content = content.replaceAll(publicRelative, webpRelative);
        changed = true;
        totalChanges++;
      }
    }

    if (changed) {
      writeFileSync(file, content, 'utf8');
      console.log(`  updated: ${relative(ROOT, file)}`);
    }
  }

  return totalChanges;
}

async function main() {
  console.log('Converting images to WebP...\n');

  const images = collectImages(PUBLIC_IMAGES);
  console.log(`Found ${images.length} images to convert\n`);

  const conversions = [];
  let totalSaved = 0;

  for (const img of images) {
    try {
      const result = await convertImage(img);
      conversions.push(result);
      totalSaved += result.origSize - result.webpSize;
      const rel = relative(ROOT, img);
      console.log(`  ✓ ${rel} (${result.pct > 0 ? '-' : '+'}${Math.abs(result.pct)}%)`);
    } catch (err) {
      console.error(`  ✗ ${relative(ROOT, img)}: ${err.message}`);
    }
  }

  console.log(`\nConverted ${conversions.length}/${images.length} images`);
  console.log(`Total savings: ${Math.round(totalSaved / 1024)} KB\n`);

  console.log('Updating source references...\n');
  const changes = updateReferences(conversions);
  console.log(`\nUpdated ${changes} references across source files`);
  console.log('\nDone. Run: npm run build');
}

main().catch(console.error);

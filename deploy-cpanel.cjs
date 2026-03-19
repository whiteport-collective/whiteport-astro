#!/usr/bin/env node
/**
 * Deploy Astro dist/ to astrowhi cPanel account via WHM File Manager API
 * Reads files from dist/ and uploads them to /home/astrowhi/public_html/
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const REMOTE_BASE = '/home/astrowhi/public_html';

async function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const relPath = path.join(base, entry.name);
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getAllFiles(fullPath, relPath));
    } else {
      const stat = fs.statSync(fullPath);
      files.push({ relPath, fullPath, size: stat.size });
    }
  }
  return files;
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();

  const whmPage = pages.find(p => p.url().includes('2087'));
  if (!whmPage) { console.log('No WHM page'); return; }

  const whmBase = whmPage.url().match(/https:\/\/mu\.hostup\.se:\d+\/cpsess\d+/)?.[0];
  const apiUrl = whmBase + '/json-api/cpanel';

  // Get all files from dist/
  const files = await getAllFiles(DIST);
  console.log(`Found ${files.length} files to deploy`);

  // Filter to just HTML, CSS, JS, XML, JSON, and small files (skip large media)
  const deployFiles = files.filter(f => {
    const ext = path.extname(f.relPath).toLowerCase();
    // Always include HTML, CSS, JS, XML, JSON, SVG, ICO, TXT
    if (['.html', '.css', '.js', '.xml', '.json', '.svg', '.ico', '.txt', '.png', '.jpg'].includes(ext)) return true;
    // Include _redirects file
    if (f.relPath === '_redirects') return true;
    // Skip large files (media > 1MB)
    if (f.size > 1024 * 1024) return false;
    return true;
  });

  console.log(`Deploying ${deployFiles.length} files (skipping large media)`);

  let success = 0;
  let errors = 0;

  for (const file of deployFiles) {
    const remotePath = REMOTE_BASE + '/' + file.relPath.replace(/\\/g, '/');
    const remoteDir = path.dirname(remotePath).replace(/\\/g, '/');
    const fileName = path.basename(file.relPath);

    // Read file content
    const content = fs.readFileSync(file.fullPath, 'utf-8').catch ? null : fs.readFileSync(file.fullPath, 'utf-8');

    try {
      // Create directory first
      if (remoteDir !== REMOTE_BASE) {
        await whmPage.evaluate(async (url, dir, user) => {
          const params = new URLSearchParams();
          params.append('api.version', '1');
          params.append('cpanel_jsonapi_user', user);
          params.append('cpanel_jsonapi_apiversion', '3');
          params.append('cpanel_jsonapi_module', 'Fileman');
          params.append('cpanel_jsonapi_func', 'save_file_content');
          params.append('dir', dir);
          params.append('file', '.keep');
          params.append('content', '');
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          });
        }, apiUrl, remoteDir, 'astrowhi');
      }

      // Write file
      const result = await whmPage.evaluate(async (url, dir, fileName, content, user) => {
        const params = new URLSearchParams();
        params.append('api.version', '1');
        params.append('cpanel_jsonapi_user', user);
        params.append('cpanel_jsonapi_apiversion', '3');
        params.append('cpanel_jsonapi_module', 'Fileman');
        params.append('cpanel_jsonapi_func', 'save_file_content');
        params.append('dir', dir);
        params.append('file', fileName);
        params.append('content', content);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
        return await res.json();
      }, apiUrl, remoteDir, fileName, content, 'astrowhi');

      if (result?.result?.status === 1) {
        success++;
      } else {
        console.log(`  FAIL: ${file.relPath}`, JSON.stringify(result?.result?.errors));
        errors++;
      }
    } catch (e) {
      console.log(`  ERROR: ${file.relPath}: ${e.message}`);
      errors++;
    }

    if ((success + errors) % 20 === 0) {
      console.log(`  Progress: ${success + errors}/${deployFiles.length} (${success} ok, ${errors} errors)`);
    }
  }

  console.log(`\nDone! ${success} files deployed, ${errors} errors`);
})();

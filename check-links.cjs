#!/usr/bin/env node
/**
 * Crawl astro.whiteport.com and report broken links/images
 */
const puppeteer = require('puppeteer');

const BASE = process.argv[2] || 'https://astro.whiteport.com';
const visited = new Set();
const broken = [];
const queue = ['/'];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.status;
  } catch {
    return 0;
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  while (queue.length > 0) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);

    const url = BASE + path;
    console.log(`Crawling: ${path}`);

    try {
      const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      const status = res?.status() || 0;

      if (status >= 400) {
        broken.push({ url: path, status, type: 'page' });
        continue;
      }

      // Get all links and images on the page
      const { links, images } = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href'))
          .filter(Boolean);
        const images = Array.from(document.querySelectorAll('img[src]'))
          .map(img => ({ src: img.getAttribute('src'), natural: img.naturalWidth }));
        return { links, images };
      });

      // Check images
      for (const img of images) {
        if (!img.src) continue;
        const imgUrl = img.src.startsWith('http') ? img.src : BASE + img.src;
        if (img.natural === 0) {
          const imgStatus = await checkUrl(imgUrl);
          broken.push({ url: path, resource: img.src, status: imgStatus, type: 'image' });
        }
      }

      // Queue internal links
      for (const href of links) {
        if (!href) continue;
        let linkPath;
        if (href.startsWith('/')) {
          linkPath = href;
        } else if (href.startsWith(BASE)) {
          linkPath = href.replace(BASE, '');
        } else {
          continue; // external link, skip
        }
        // Normalize
        linkPath = linkPath.split('#')[0].split('?')[0];
        if (!linkPath || visited.has(linkPath)) continue;
        // Skip non-page resources
        if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|webp|mp4|pdf|xml|json|woff|woff2|ttf)$/i.test(linkPath)) continue;
        queue.push(linkPath);
      }

    } catch (err) {
      broken.push({ url: path, status: 'timeout', type: 'page' });
    }
  }

  await browser.close();

  console.log(`\n=== RESULTS ===`);
  console.log(`Pages crawled: ${visited.size}`);

  if (broken.length === 0) {
    console.log('No broken links or images found!');
  } else {
    console.log(`\nBroken items (${broken.length}):`);
    for (const b of broken) {
      if (b.type === 'image') {
        console.log(`  [IMG ${b.status}] ${b.url} → ${b.resource}`);
      } else {
        console.log(`  [${b.status}] ${b.url}`);
      }
    }
  }
})();

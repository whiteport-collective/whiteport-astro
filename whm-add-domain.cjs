#!/usr/bin/env node
/**
 * Add astro.whiteport.com as a parked domain on the aiwhitep cPanel account
 * via WHM JSON API (accessed through HostUp dashboard → WHM session).
 */

const puppeteer = require('puppeteer-core');

const HOSTUP_EMAIL = 'marten@angner.se';
const HOSTUP_PASSWORD = 'NviU+WL30r!X%LL5';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();

  try {
    // Step 1: Login to HostUp
    console.log('Logging in to cloud.hostup.se...');
    await page.goto('https://cloud.hostup.se', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);

    // Check if already logged in
    const url = page.url();
    if (url.includes('login') || url === 'https://cloud.hostup.se/') {
      // Fill login form
      await page.type('input[type="email"], input[name="email"]', HOSTUP_EMAIL);
      await page.type('input[type="password"], input[name="password"]', HOSTUP_PASSWORD);

      // Click login button
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Logga in') || text.includes('Login') || text.includes('Sign in')) {
          await btn.click();
          break;
        }
      }
      await sleep(5000);
    }

    console.log('Dashboard loaded at:', page.url());

    // Step 2: Intercept WHM URL
    console.log('Getting WHM session...');
    await page.evaluate(() => {
      window._whmUrl = null;
      const origOpen = window.open;
      window.open = function(url) {
        window._whmUrl = url;
        return { focus: function(){} };
      };
    });

    // Click WHM button
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.textContent.trim().startsWith('WHM')) { b.click(); break; }
      }
    });

    // Wait for URL to be captured
    await sleep(5000);
    let whmUrl = await page.evaluate(() => window._whmUrl);

    if (!whmUrl) {
      // Try again with longer wait
      await sleep(5000);
      whmUrl = await page.evaluate(() => window._whmUrl);
    }

    if (!whmUrl) {
      throw new Error('Could not capture WHM session URL');
    }

    console.log('WHM URL captured');

    // Step 3: Navigate to WHM
    await page.goto(whmUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(3000);

    const whmPageUrl = page.url();
    console.log('WHM page:', whmPageUrl);

    // Extract cpsess token
    const cpsessMatch = whmPageUrl.match(/(cpsess\d+)/);
    if (!cpsessMatch) {
      throw new Error('Could not extract cpsess token from WHM URL');
    }
    const cpsess = cpsessMatch[1];
    console.log('Session token:', cpsess);

    // Step 4: Use WHM API to park domain astro.whiteport.com on aiwhitep account
    console.log('Adding astro.whiteport.com as parked domain...');

    const result = await page.evaluate(async (cpsess) => {
      const params = new URLSearchParams({
        'api.version': '1',
        'domain': 'astro.whiteport.com',
        'topdomain': 'ai.whiteport.com',
      });
      const apiUrl = `/${cpsess}/json-api/park?${params}`;

      try {
        const res = await fetch(apiUrl, { credentials: 'same-origin' });
        return await res.text();
      } catch (err) {
        return 'FETCH_ERROR: ' + err.message;
      }
    }, cpsess);

    console.log('Park result:', result);

    // If park didn't work, try addalias or setsiteip
    if (result.includes('error') || result.includes('Error') || result.includes('FETCH_ERROR')) {
      console.log('\nTrying alternative: adddomain (addon domain)...');

      const result2 = await page.evaluate(async (cpsess) => {
        const params = new URLSearchParams({
          'api.version': '1',
          'newdomain': 'astro.whiteport.com',
          'user': 'aiwhitep',
          'dir': '/home/aiwhitep/public_html',
        });
        const apiUrl = `/${cpsess}/json-api/adddomain?${params}`;

        try {
          const res = await fetch(apiUrl, { credentials: 'same-origin' });
          return await res.text();
        } catch (err) {
          return 'FETCH_ERROR: ' + err.message;
        }
      }, cpsess);

      console.log('Addon result:', result2);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await page.close();
  }
})();

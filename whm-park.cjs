const puppeteer = require('puppeteer-core');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('hostup'));

  if (!page) {
    console.log('No HostUp page found');
    process.exit(1);
  }

  await page.setViewport({ width: 1280, height: 900 });
  console.log('On:', page.url());

  // Intercept window.open
  await page.evaluate(() => {
    window._whmUrl = null;
    window.open = function(url) {
      window._whmUrl = url;
      return { focus: function(){} };
    };
  });

  // Click WHM button
  const clickResult = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.trim().startsWith('WHM')) {
        b.click();
        return 'Clicked: ' + b.textContent.trim();
      }
    }
    const links = document.querySelectorAll('a');
    for (const a of links) {
      if (a.textContent.trim().includes('WHM')) {
        a.click();
        return 'Clicked link: ' + a.textContent.trim();
      }
    }
    return 'No WHM button found';
  });
  console.log(clickResult);

  await sleep(5000);
  let whmUrl = await page.evaluate(() => window._whmUrl);
  if (!whmUrl) {
    await sleep(5000);
    whmUrl = await page.evaluate(() => window._whmUrl);
  }

  if (!whmUrl) {
    console.log('Could not capture WHM URL');
    const allBtns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a'))
        .filter(b => b.textContent.trim().length > 0)
        .slice(0, 20)
        .map(b => ({ tag: b.tagName, text: b.textContent.trim().slice(0, 60) }));
    });
    console.log(JSON.stringify(allBtns, null, 2));
    process.exit(1);
  }

  console.log('WHM URL captured');

  // Navigate to WHM
  await page.goto(whmUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(3000);

  const whmPageUrl = page.url();
  console.log('WHM page:', whmPageUrl);

  const cpsessMatch = whmPageUrl.match(/(cpsess\d+)/);
  if (!cpsessMatch) {
    console.log('No cpsess token');
    process.exit(1);
  }
  const cpsess = cpsessMatch[1];
  console.log('Session:', cpsess);

  // Park astro.whiteport.com
  console.log('Parking astro.whiteport.com on aiwhitep...');

  const parkResult = await page.evaluate(async (cpsess) => {
    try {
      const params = new URLSearchParams({
        'api.version': '1',
        'domain': 'astro.whiteport.com',
        'topdomain': 'ai.whiteport.com',
      });
      const res = await fetch('/' + cpsess + '/json-api/park?' + params, { credentials: 'same-origin' });
      return await res.text();
    } catch (err) {
      return 'ERROR: ' + err.message;
    }
  }, cpsess);

  console.log('Park result:', parkResult);

  // Check if it worked
  let success = false;
  try {
    const parsed = JSON.parse(parkResult);
    if (parsed.metadata && parsed.metadata.result === 1) {
      success = true;
      console.log('SUCCESS: astro.whiteport.com parked on aiwhitep');
    }
  } catch {}

  if (!success) {
    // Try addon domain approach
    console.log('Trying adddomain...');
    const addonResult = await page.evaluate(async (cpsess) => {
      try {
        const params = new URLSearchParams({
          'api.version': '1',
          'newdomain': 'astro.whiteport.com',
          'user': 'aiwhitep',
          'dir': '/home/aiwhitep/public_html',
        });
        const res = await fetch('/' + cpsess + '/json-api/adddomain?' + params, { credentials: 'same-origin' });
        return await res.text();
      } catch (err) {
        return 'ERROR: ' + err.message;
      }
    }, cpsess);
    console.log('Addon result:', addonResult);
  }

  // Also enable shell access while we're here
  console.log('Enabling shell access for aiwhitep...');
  const shellResult = await page.evaluate(async (cpsess) => {
    try {
      const params = new URLSearchParams({
        'api.version': '1',
        'user': 'aiwhitep',
        'shell': '/bin/bash',
      });
      const res = await fetch('/' + cpsess + '/json-api/modifyacct?' + params, { credentials: 'same-origin' });
      return await res.text();
    } catch (err) {
      return 'ERROR: ' + err.message;
    }
  }, cpsess);
  console.log('Shell result:', shellResult);
})();

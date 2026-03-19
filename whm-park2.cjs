const puppeteer = require('puppeteer-core');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('mu.hostup.se'));

  if (!page) {
    console.log('No WHM page found, looking for HostUp...');
    page = pages.find(p => p.url().includes('hostup'));
    if (!page) { console.log('No page found'); process.exit(1); }
  }

  const whmPageUrl = page.url();
  console.log('On:', whmPageUrl);

  const cpsessMatch = whmPageUrl.match(/(cpsess\d+)/);
  if (!cpsessMatch) {
    console.log('No cpsess token - need to get WHM session first');
    process.exit(1);
  }
  const cpsess = cpsessMatch[1];
  console.log('Session:', cpsess);

  // Try multiple approaches to add astro.whiteport.com

  // Approach 1: WHM v0 API - park
  console.log('\n--- Approach 1: WHM v0 park ---');
  const r1 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/park?domain=astro.whiteport.com&topdomain=ai.whiteport.com';
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log(r1);

  // Approach 2: cPanel proxy through WHM
  console.log('\n--- Approach 2: cPanel proxy (Park) ---');
  const r2 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/cpanel?cpanel_jsonapi_user=aiwhitep&cpanel_jsonapi_module=Park&cpanel_jsonapi_func=park&domain=astro.whiteport.com';
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log(r2);

  // Approach 3: cPanel proxy (Alias/ServerAlias)
  console.log('\n--- Approach 3: cPanel proxy (ServerAlias) ---');
  const r3 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/cpanel?cpanel_jsonapi_user=aiwhitep&cpanel_jsonapi_apiversion=3&cpanel_jsonapi_module=DomainInfo&cpanel_jsonapi_func=domains_data';
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log(r3);

  // Approach 4: WHM addalias
  console.log('\n--- Approach 4: WHM addalias ---');
  const r4 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/addalias?domain=ai.whiteport.com&alias=astro.whiteport.com';
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log(r4);

  // Approach 5: WHM set_serveralias
  console.log('\n--- Approach 5: WHM setsiteip (ServerAlias via httpd) ---');
  const r5 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/domainuserdata?domain=ai.whiteport.com';
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log(r5);

  // List available WHM API functions
  console.log('\n--- Available functions ---');
  const r6 = await page.evaluate(async (cpsess) => {
    try {
      const url = '/' + cpsess + '/json-api/applist';
      const res = await fetch(url, { credentials: 'same-origin' });
      const data = await res.json();
      if (data.app) {
        const funcs = Object.keys(data.app);
        return funcs.filter(f => f.includes('domain') || f.includes('park') || f.includes('alias') || f.includes('addon') || f.includes('Domain')).join(', ');
      }
      return JSON.stringify(data).slice(0, 500);
    } catch (e) { return 'ERR: ' + e.message; }
  }, cpsess);
  console.log('Domain-related functions:', r6);
})();

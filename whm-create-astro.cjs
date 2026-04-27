const puppeteer = require('puppeteer-core');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Generate password
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
let pw = '';
for (let i = 0; i < 20; i++) pw += chars[Math.floor(Math.random() * chars.length)];

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('mu.hostup.se'));

  if (!page) {
    console.log('No WHM page found');
    process.exit(1);
  }

  const cpsessMatch = page.url().match(/(cpsess\d+)/);
  if (!cpsessMatch) {
    console.log('No cpsess token');
    process.exit(1);
  }
  const cpsess = cpsessMatch[1];

  console.log('Creating cPanel account for astro.whiteport.com...');
  console.log('Password:', pw);

  const result = await page.evaluate(async (cpsess, pw) => {
    try {
      const params = new URLSearchParams({
        'api.version': '1',
        'domain': 'astro.whiteport.com',
        'username': 'astrowhi',
        'password': pw,
        'contactemail': 'marten@angner.se',
        'plan': 'websespr_Whiteport',
        'cgi': '1',
        'language': 'en'
      });
      const url = '/' + cpsess + '/json-api/createacct?' + params;
      const res = await fetch(url, { credentials: 'same-origin' });
      return await res.text();
    } catch (e) {
      return 'ERR: ' + e.message;
    }
  }, cpsess, pw);

  console.log('\nResult:', result);

  try {
    const parsed = JSON.parse(result);
    if (parsed.metadata && parsed.metadata.result === 1) {
      console.log('\nSUCCESS!');
      console.log('Domain: astro.whiteport.com');
      console.log('Username: astrowhi');
      console.log('Password:', pw);
      if (parsed.data && parsed.data.ip) {
        console.log('IP:', parsed.data.ip);
      }
    } else {
      console.log('\nFailed:', parsed.metadata?.reason || 'unknown error');
    }
  } catch {
    console.log('Could not parse response');
  }
})();

#!/usr/bin/env node
/**
 * Download all whiteport.com images needed for the Astro site.
 * Saves to public/images/wp/ preserving a flat structure with descriptive names.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const OUTPUT_DIR = 'public/images/wp';

// Only the actual site content images (not plugin/theme chrome)
const IMAGES = [
  // Logo
  ['https://whiteport.com/wp-content/uploads/2024/10/logo-whiteport.svg', 'logo-whiteport.svg'],

  // Social icons
  ['https://whiteport.com/wp-content/uploads/2025/03/icons8-linkedin.svg', 'icon-linkedin.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/fb-white.svg', 'icon-facebook.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/03/icons8-instagram-100-1.svg', 'icon-instagram.svg'],

  // Hero / intro
  ['https://whiteport.com/wp-content/uploads/2024/10/Logo-1.svg', 'hero-logo.svg'],
  ['https://whiteport.com/wp-content/uploads/2023/09/Emblem.png', 'emblem.png'],
  ['https://whiteport.com/wp-content/uploads/2024/10/Intro1_1_3Phrase-1.svg', 'hero-phrase.svg'],

  // Agency section icons
  ['https://whiteport.com/wp-content/uploads/2024/10/analytics-1.svg', 'icon-analytics.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/agreement-1.svg', 'icon-agreement.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/develop-1.svg', 'icon-develop.svg'],

  // Arrow
  ['https://whiteport.com/wp-content/themes/whiteport/assets/dist/svg/arrow.svg', 'arrow.svg'],

  // Trusted by logos
  ['https://whiteport.com/wp-content/uploads/2025/04/image.svg', 'logo-trusted-01.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-1.svg', 'logo-trusted-02.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-2.svg', 'logo-trusted-03.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-3.svg', 'logo-trusted-04.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-4.svg', 'logo-trusted-05.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-5.svg', 'logo-trusted-06.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-6.svg', 'logo-trusted-07.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-7.svg', 'logo-trusted-08.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-8.svg', 'logo-trusted-09.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-9.svg', 'logo-trusted-10.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-10.svg', 'logo-trusted-11.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-11.svg', 'logo-trusted-12.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-12.svg', 'logo-trusted-13.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-13.svg', 'logo-trusted-14.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-14.svg', 'logo-trusted-15.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-15.svg', 'logo-trusted-16.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/05/aj-logo-300x113.png', 'logo-trusted-aj.png'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-17.svg', 'logo-trusted-17.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-18.svg', 'logo-trusted-18.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-19.svg', 'logo-trusted-19.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-20.svg', 'logo-trusted-20.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-21.svg', 'logo-trusted-21.svg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/image-22.svg', 'logo-trusted-22.svg'],

  // Calendar icon
  ['https://whiteport.com/wp-content/uploads/2024/10/calendar.svg', 'icon-calendar.svg'],

  // Project case study images
  ['https://whiteport.com/wp-content/uploads/2025/04/histreamers-screens-1024x448.jpg', 'project-histreamers.jpg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/goal-screens-case-img-1024x448.jpg', 'project-goalenvision.jpg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/Group-2-1024x448.png', 'project-skargardspartner.png'],
  ['https://whiteport.com/wp-content/uploads/2025/04/bythjul-screen-1024x448.jpg', 'project-bythjul.jpg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/1.-Indoor.jpg', 'project-indoor.jpg'],
  ['https://whiteport.com/wp-content/uploads/2025/04/eveandadam-screens-1024x448.jpg', 'project-eveadam.jpg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/4.-Fyndiqsvajpen.jpg', 'project-fyndiqsvajpen.jpg'],

  // Service icons
  ['https://whiteport.com/wp-content/uploads/2024/10/light-1.svg', 'icon-strategy.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/tap-1.svg', 'icon-ux.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/engine.svg', 'icon-requirements.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/creativity.svg', 'icon-visual.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/development.svg', 'icon-development.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/bot.svg', 'icon-ai.svg'],

  // Stream/blog images
  ['https://whiteport.com/wp-content/uploads/2026/02/SoMe-Instagram-4x5-10-819x1024.jpg', 'stream-seo.jpg'],
  ['https://whiteport.com/wp-content/uploads/2026/01/2026-01-29-WDS-Sessions-3-Instagram-768x1024.jpg', 'stream-wds-session3.jpg'],
  ['https://whiteport.com/wp-content/uploads/2026/01/2026-01-14-The-burn-is-real.jpg', 'stream-burn.jpg'],

  // Solutions
  ['https://whiteport.com/wp-content/uploads/2025/05/social-plugin-1.png', 'solution-social-plugin.png'],
  ['https://whiteport.com/wp-content/uploads/2024/10/Course1_3_1Hourse.svg', 'solution-course-horse.svg'],
  ['https://whiteport.com/wp-content/uploads/2024/10/Course1_3_2Tablet.svg', 'solution-course-tablet.svg'],

  // Team
  ['https://whiteport.com/wp-content/uploads/2025/05/Marten-square-3-300x300.jpg', 'team-marten.jpg'],
  ['https://whiteport.com/wp-content/uploads/2025/05/Anna-square-2-1-300x300.jpg', 'team-anna.jpg'],

  // Cookie
  ['https://beta.whiteport.se/wp-content/uploads/2024/10/cookies-2.svg', 'icon-cookie.svg'],
];

async function download() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let ok = 0, fail = 0;

  for (const [url, filename] of IMAGES) {
    const outPath = join(OUTPUT_DIR, filename);
    if (existsSync(outPath)) {
      console.log(`  SKIP ${filename} (exists)`);
      ok++;
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(outPath, buf);
      console.log(`  OK   ${filename} (${(buf.length / 1024).toFixed(1)}KB)`);
      ok++;
    } catch (e) {
      console.error(`  FAIL ${filename}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed`);
}

download();

#!/usr/bin/env node
/**
 * Design Extraction Script — whiteport.com
 *
 * Downloads the live page HTML + computed styles for each page.
 * Outputs structured JSON that can be compared to the Astro version.
 *
 * Usage:
 *   node scripts/extract-design.mjs <url> [output-dir]
 *
 * Examples:
 *   node scripts/extract-design.mjs https://whiteport.com
 *   node scripts/extract-design.mjs https://whiteport.com/about
 *   node scripts/extract-design.mjs https://whiteport.com design-extracts/homepage
 *
 * Output per page:
 *   - page.html          — raw HTML source
 *   - styles.json         — computed styles for key elements
 *   - structure.json      — semantic structure (headings, sections, nav, footer)
 *   - colors.json         — all unique colors found
 *   - typography.json     — all font families, sizes, weights, line-heights
 *   - spacing.json        — all margins, paddings, gaps found
 *   - assets.txt          — list of images, fonts, stylesheets referenced
 *   - summary.md          — human-readable summary for review
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const url = process.argv[2];
const outputDir = process.argv[3] || `design-extracts/${slugify(url)}`;

if (!url) {
  console.error('Usage: node scripts/extract-design.mjs <url> [output-dir]');
  process.exit(1);
}

function slugify(u) {
  try {
    const parsed = new URL(u);
    const path = parsed.pathname.replace(/^\/|\/$/g, '') || 'homepage';
    return path.replace(/\//g, '--');
  } catch {
    return 'page';
  }
}

async function extract() {
  // We use a simple fetch + regex approach — no browser needed.
  // This captures the SOURCE design, not rendered layout.
  console.log(`Extracting design from: ${url}`);
  console.log(`Output: ${outputDir}/\n`);

  mkdirSync(outputDir, { recursive: true });

  // 1. Download raw HTML
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`HTTP ${res.status} — ${res.statusText}`);
    process.exit(1);
  }
  const html = await res.text();
  writeFileSync(join(outputDir, 'page.html'), html);
  console.log(`  page.html (${(html.length / 1024).toFixed(1)}KB)`);

  // 2. Extract all linked stylesheets
  const cssLinks = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)]
    .map(m => m[1])
    .map(href => href.startsWith('http') ? href : new URL(href, url).href);

  let allCSS = '';
  const assets = { stylesheets: cssLinks, images: [], fonts: [] };

  for (const cssUrl of cssLinks) {
    try {
      const cssRes = await fetch(cssUrl);
      const cssText = await cssRes.text();
      allCSS += cssText + '\n';
      console.log(`  stylesheet: ${cssUrl.split('/').pop()} (${(cssText.length / 1024).toFixed(1)}KB)`);
    } catch (e) {
      console.log(`  SKIP stylesheet: ${cssUrl} (${e.message})`);
    }
  }

  // Also extract inline styles
  const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(m => m[1])
    .join('\n');
  allCSS += inlineStyles;

  writeFileSync(join(outputDir, 'all-styles.css'), allCSS);
  console.log(`  all-styles.css (${(allCSS.length / 1024).toFixed(1)}KB)`);

  // 3. Extract colors
  const colorPatterns = [
    /#[0-9a-fA-F]{3,8}\b/g,
    /rgba?\([^)]+\)/g,
    /hsla?\([^)]+\)/g,
  ];
  const colors = new Set();
  for (const pattern of colorPatterns) {
    for (const match of allCSS.matchAll(pattern)) {
      colors.add(match[0].toLowerCase());
    }
    // Also check inline styles in HTML
    for (const match of html.matchAll(pattern)) {
      colors.add(match[0].toLowerCase());
    }
  }
  const colorData = { unique_count: colors.size, colors: [...colors].sort() };
  writeFileSync(join(outputDir, 'colors.json'), JSON.stringify(colorData, null, 2));
  console.log(`  colors.json (${colors.size} unique colors)`);

  // 4. Extract typography
  const fontFamilies = new Set();
  for (const m of allCSS.matchAll(/font-family:\s*([^;}\n]+)/gi)) {
    fontFamilies.add(m[1].trim().replace(/["']/g, ''));
  }
  const fontSizes = new Set();
  for (const m of allCSS.matchAll(/font-size:\s*([^;}\n]+)/gi)) {
    fontSizes.add(m[1].trim());
  }
  const fontWeights = new Set();
  for (const m of allCSS.matchAll(/font-weight:\s*([^;}\n]+)/gi)) {
    fontWeights.add(m[1].trim());
  }
  const lineHeights = new Set();
  for (const m of allCSS.matchAll(/line-height:\s*([^;}\n]+)/gi)) {
    lineHeights.add(m[1].trim());
  }
  const letterSpacings = new Set();
  for (const m of allCSS.matchAll(/letter-spacing:\s*([^;}\n]+)/gi)) {
    letterSpacings.add(m[1].trim());
  }

  // Extract @font-face declarations
  const fontFaces = [...allCSS.matchAll(/@font-face\s*\{([^}]+)\}/gi)].map(m => {
    const block = m[1];
    const family = block.match(/font-family:\s*["']?([^"';]+)/i)?.[1]?.trim();
    const weight = block.match(/font-weight:\s*([^;]+)/i)?.[1]?.trim();
    const style = block.match(/font-style:\s*([^;]+)/i)?.[1]?.trim();
    const src = block.match(/src:\s*([^;]+)/i)?.[1]?.trim();
    return { family, weight, style, src: src?.substring(0, 100) + '...' };
  });

  const typography = {
    font_families: [...fontFamilies].sort(),
    font_sizes: [...fontSizes].sort(),
    font_weights: [...fontWeights].sort(),
    line_heights: [...lineHeights].sort(),
    letter_spacings: [...letterSpacings].sort(),
    font_faces: fontFaces,
  };
  writeFileSync(join(outputDir, 'typography.json'), JSON.stringify(typography, null, 2));
  console.log(`  typography.json (${fontFamilies.size} families, ${fontSizes.size} sizes)`);

  // 5. Extract spacing (margins, paddings, gaps)
  const margins = new Set();
  for (const m of allCSS.matchAll(/margin(?:-(?:top|right|bottom|left))?:\s*([^;}\n]+)/gi)) {
    margins.add(m[1].trim());
  }
  const paddings = new Set();
  for (const m of allCSS.matchAll(/padding(?:-(?:top|right|bottom|left))?:\s*([^;}\n]+)/gi)) {
    paddings.add(m[1].trim());
  }
  const gaps = new Set();
  for (const m of allCSS.matchAll(/gap:\s*([^;}\n]+)/gi)) {
    gaps.add(m[1].trim());
  }

  const spacing = {
    margins: [...margins].sort(),
    paddings: [...paddings].sort(),
    gaps: [...gaps].sort(),
  };
  writeFileSync(join(outputDir, 'spacing.json'), JSON.stringify(spacing, null, 2));
  console.log(`  spacing.json (${margins.size} margins, ${paddings.size} paddings, ${gaps.size} gaps)`);

  // 6. Extract page structure
  const headings = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
    level: m[1].toLowerCase(),
    text: m[2].replace(/<[^>]+>/g, '').trim().substring(0, 100),
  }));

  const sections = [...html.matchAll(/<section[^>]*(?:id=["']([^"']+)["'])?[^>]*(?:class=["']([^"']+)["'])?/gi)]
    .map(m => ({ id: m[1] || null, classes: m[2] || null }));

  const navLinks = [...html.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/gi)]
    .flatMap(m => [...m[1].matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)])
    .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));

  const structure = { headings, sections, nav_links: navLinks };
  writeFileSync(join(outputDir, 'structure.json'), JSON.stringify(structure, null, 2));
  console.log(`  structure.json (${headings.length} headings, ${sections.length} sections)`);

  // 7. Extract image references
  const images = [...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*/gi)]
    .map(m => m[1]);
  const bgImages = [...allCSS.matchAll(/url\(["']?([^)"']+)["']?\)/gi)]
    .map(m => m[1])
    .filter(u => /\.(jpg|jpeg|png|gif|svg|webp|avif)/i.test(u));
  assets.images = [...new Set([...images, ...bgImages])];

  // Font files
  const fontFiles = [...allCSS.matchAll(/url\(["']?([^)"']+\.(?:woff2?|ttf|otf|eot))["']?\)/gi)]
    .map(m => m[1]);
  assets.fonts = [...new Set(fontFiles)];

  writeFileSync(join(outputDir, 'assets.txt'),
    `# Stylesheets (${assets.stylesheets.length})\n${assets.stylesheets.join('\n')}\n\n` +
    `# Images (${assets.images.length})\n${assets.images.join('\n')}\n\n` +
    `# Fonts (${assets.fonts.length})\n${assets.fonts.join('\n')}\n`
  );
  console.log(`  assets.txt (${assets.images.length} images, ${assets.fonts.length} fonts)`);

  // 8. Generate summary
  const summary = `# Design Extract: ${url}
Extracted: ${new Date().toISOString().split('T')[0]}

## Page Structure
- ${headings.length} headings (${headings.filter(h => h.level === 'h1').length} H1, ${headings.filter(h => h.level === 'h2').length} H2, ${headings.filter(h => h.level === 'h3').length} H3)
- ${sections.length} sections
- ${navLinks.length} nav links

## Typography
- Font families: ${[...fontFamilies].join(', ') || 'none found in CSS'}
- Font sizes: ${fontSizes.size} unique values
- Font weights: ${[...fontWeights].join(', ')}

## Colors
- ${colors.size} unique colors found
- Key colors (first 20): ${[...colors].slice(0, 20).join(', ')}

## Spacing
- ${margins.size} unique margin values
- ${paddings.size} unique padding values
- ${gaps.size} unique gap values

## Assets
- ${assets.stylesheets.length} stylesheets
- ${assets.images.length} images
- ${assets.fonts.length} font files

## Headings
${headings.map(h => `- ${h.level}: ${h.text}`).join('\n')}

## Sections
${sections.map(s => `- ${s.id || '(no id)'} — ${s.classes || '(no classes)'}`).join('\n')}

---

**Next step:** Compare this extract with the Astro version.
Review colors, typography, and structure. Propose changes only after discussion.
`;
  writeFileSync(join(outputDir, 'summary.md'), summary);
  console.log(`  summary.md`);

  console.log(`\nDone. Review ${outputDir}/summary.md to start.`);
}

extract().catch(e => {
  console.error('Extraction failed:', e.message);
  process.exit(1);
});

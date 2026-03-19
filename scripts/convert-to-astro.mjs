#!/usr/bin/env node
/**
 * Convert WordPress stream post JSON export to Astro content collection markdown.
 *
 * Usage:
 *   node scripts/convert-to-astro.mjs scripts/stream-posts-export.json
 *
 * Output:
 *   src/content/stream/<slug>.md  — one file per stream post
 *
 * The JSON input should be the output of wp-export-stream-posts.php
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// --- HTML to Markdown conversion (basic, no dependencies) ---

function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove the stream_post-footer-block div entirely (it's the boilerplate footer)
  md = md.replace(/<div class="stream_post-footer-block">[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // Headings
  md = md.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
    return '\n' + '#'.repeat(parseInt(level)) + ' ' + stripTags(content).trim() + '\n';
  });

  // Bold
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');

  // Italic
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      return '- ' + stripTags(item).trim() + '\n';
    });
  });

  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 0;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      i++;
      return `${i}. ` + stripTags(item).trim() + '\n';
    });
  });

  // Horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return stripTags(content).trim().split('\n').map(l => '> ' + l).join('\n') + '\n';
  });

  // Remove remaining HTML tags
  md = stripTags(md);

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

function stripTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

// --- YAML serialization helpers ---

function yamlString(val) {
  if (!val) return '""';
  // If contains special chars, quote it
  if (/[:#\[\]{}&*!|>'"%@`\n]/.test(val) || val.startsWith(' ') || val.endsWith(' ')) {
    return '"' + val.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
  }
  return val;
}

function yamlDate(dateStr) {
  if (!dateStr || dateStr.startsWith('1970')) return null;
  // Parse WP date format "2026-01-22T12:00:00" or "2026-01-22 12:00:00"
  const d = new Date(dateStr.replace(' ', 'T') + (dateStr.includes('+') ? '' : 'Z'));
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

// --- Main conversion ---

function convertPost(post, taxonomies) {
  const slug = post.slug || `post-${post.id}`;
  const title = post.title || `Untitled (${post.id})`;
  const publishDate = yamlDate(post.date);
  const isDraft = post.status !== 'publish';
  const hideFromStream = post.hide_from_stream || false;

  // Categories
  const categories = (post.categories || []).map(c => c.slug);

  // Tags
  const tags = (post.tags || []).map(t => t.slug);

  // Collect all locations and mentions from social posts
  const allLocations = new Set();
  const allMentions = new Set();

  for (const sp of (post.social_posts || [])) {
    for (const loc of (sp.locations || [])) {
      allLocations.add(loc.slug || loc.name);
    }
    for (const m of (sp.mentions || [])) {
      allMentions.add(m.slug || m.name);
    }
    for (const c of (sp.collaborations || [])) {
      allMentions.add(c.slug || c.name);
    }
  }

  // Gallery items
  const gallery = (post.gallery || []).map(item => {
    const entry = {};
    if (item.media) {
      if (item.media.gdrive_file_id) {
        entry.gdriveId = item.media.gdrive_file_id;
      } else {
        entry.src = item.media.url || '';
      }
      entry.alt = item.media.filename || '';
      const isVideo = (item.media.type === 'video' ||
        (item.media.subtype && ['mp4', 'webm', 'mov', 'avi'].includes(item.media.subtype)));
      entry.type = isVideo ? 'video' : 'image';

      if (item.media.width) entry.width = item.media.width;
      if (item.media.height) entry.height = item.media.height;
    }
    if (item.poster) {
      entry.poster = item.poster.gdrive_file_id || item.poster.url || '';
    }
    if (item.display && item.display.length > 0) {
      entry.display = item.display;
    }
    return entry;
  }).filter(e => e.gdriveId || e.src);

  // Social posts (simplified — keep platform and text)
  const socialPosts = (post.social_posts || [])
    .filter(sp => sp.post_text && sp.post_text.trim())
    .map(sp => ({
      platform: sp.platform,
      postText: stripTags(sp.post_text).trim().substring(0, 200),
    }));

  // Google Drive link
  const gdriveLink = post.gdrive_link || (post.linked_object && post.linked_object.gdrive_link) || '';

  // --- Build frontmatter ---
  const fm = [];
  fm.push('---');
  fm.push(`title: ${yamlString(title)}`);
  if (publishDate) {
    fm.push(`publishDate: ${publishDate}`);
  }
  if (isDraft) {
    fm.push(`draft: true`);
  }
  fm.push(`author: ${yamlString(post.author || 'Whiteport')}`);

  if (categories.length > 0) {
    fm.push(`categories:`);
    categories.forEach(c => fm.push(`  - ${yamlString(c)}`));
  }

  if (tags.length > 0) {
    fm.push(`tags:`);
    tags.forEach(t => fm.push(`  - ${yamlString(t)}`));
  }

  if (allLocations.size > 0) {
    fm.push(`locations:`);
    [...allLocations].forEach(l => fm.push(`  - ${yamlString(l)}`));
  }

  if (allMentions.size > 0) {
    fm.push(`mentions:`);
    [...allMentions].forEach(m => fm.push(`  - ${yamlString(m)}`));
  }

  if (hideFromStream) {
    fm.push(`hideFromStream: true`);
  }

  if (post.creative_note) {
    fm.push(`creativeNote: ${yamlString(post.creative_note)}`);
  }

  if (gdriveLink) {
    fm.push(`gdriveLink: ${yamlString(gdriveLink)}`);
  }

  if (post.featured_image) {
    if (post.featured_image.gdrive_file_id) {
      fm.push(`featuredImage:`);
      fm.push(`  gdriveId: ${yamlString(post.featured_image.gdrive_file_id)}`);
    } else if (post.featured_image.url) {
      fm.push(`featuredImage:`);
      fm.push(`  src: ${yamlString(post.featured_image.url)}`);
    }
  }

  if (gallery.length > 0) {
    fm.push(`gallery:`);
    for (const item of gallery) {
      const first = item.gdriveId ? `gdriveId` : `src`;
      const firstVal = item.gdriveId || item.src;
      fm.push(`  - ${first}: ${yamlString(firstVal)}`);
      if (item.alt) fm.push(`    alt: ${yamlString(item.alt)}`);
      fm.push(`    type: ${item.type}`);
      if (item.width) fm.push(`    width: ${item.width}`);
      if (item.height) fm.push(`    height: ${item.height}`);
      if (item.poster) fm.push(`    poster: ${yamlString(item.poster)}`);
      if (item.display) {
        fm.push(`    display:`);
        item.display.forEach(d => fm.push(`      - ${d}`));
      }
    }
  }

  if (socialPosts.length > 0) {
    fm.push(`socialPosts:`);
    for (const sp of socialPosts) {
      fm.push(`  - platform: ${sp.platform}`);
      fm.push(`    postText: ${yamlString(sp.postText)}`);
    }
  }

  // WP metadata for reference
  fm.push(`# WordPress migration metadata`);
  fm.push(`wpId: ${post.id}`);
  fm.push(`wpPermalink: ${yamlString(post.permalink || '')}`);

  fm.push('---');

  // --- Body content ---
  const body = htmlToMarkdown(post.content_raw || post.content_html || '');

  return {
    slug,
    content: fm.join('\n') + '\n\n' + body + '\n',
  };
}

// --- Entry point ---

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node scripts/convert-to-astro.mjs <export.json>');
  console.error('');
  console.error('Steps:');
  console.error('  1. Upload wp-export-stream-posts.php to your WP root');
  console.error('  2. Visit https://whiteport.com/wp-export-stream-posts.php (logged in as admin)');
  console.error('  3. Save the JSON to scripts/stream-posts-export.json');
  console.error('  4. Run: node scripts/convert-to-astro.mjs scripts/stream-posts-export.json');
  process.exit(1);
}

const raw = readFileSync(inputFile, 'utf-8');
const data = JSON.parse(raw);

const posts = data.posts || (Array.isArray(data) ? data : [data]);
const outputDir = join(projectRoot, 'src', 'content', 'stream');

mkdirSync(outputDir, { recursive: true });

let converted = 0;
let skipped = 0;

for (const post of posts) {
  // Skip posts with no meaningful content and no gallery
  const hasContent = post.content_raw && post.content_raw.trim().length > 10;
  const hasGallery = post.gallery && post.gallery.length > 0;
  const hasSocialPosts = post.social_posts && post.social_posts.some(sp => sp.post_text);

  if (!hasContent && !hasGallery && !hasSocialPosts) {
    console.log(`  SKIP: ${post.slug || post.id} (no content, gallery, or social posts)`);
    skipped++;
    continue;
  }

  const { slug, content } = convertPost(post, data.taxonomies || {});
  const filePath = join(outputDir, `${slug}.md`);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`  OK: ${slug}.md`);
  converted++;
}

console.log('');
console.log(`Done! Converted ${converted} posts, skipped ${skipped}`);
console.log(`Output: ${outputDir}`);

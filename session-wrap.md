## Learned
- WP-migrated media files live at `/media/gdrive/wp-{filename}.jpg` — `.jpg` always, never `.webp`. The WebP pipeline only converts GDrive images (by `gdriveId`), not WP-origin files.
- GDrive video poster thumbnails are `.jpg` (downloaded alongside `.mp4`), not `.webp`. Only still images from GDrive use `.webp`.
- `frilansfinans-valjer-whiteport.md` had no `publishDate` — posts without it are filtered out of the stream by `getPublishedPosts()` and never built as indexable pages.
- `excerpt` field exists in the blog schema but was not passed from `[...slug].astro` to `SocialStreamPost.astro`, so it never reached the meta description. Now wired up as `creativeNote || excerpt || title`.

## Context
Working on whiteport.com (Astro 5 static site, `c:/dev/WDS/whiteport-astro`).

All 86 blog cards now have images — fixed a `.webp`/`.jpg` URL mismatch from the WebP migration merge, and added gallery entries to 7 previously image-less posts using existing static images already on the server.

Two SEO quick fixes deployed: `excerpt` fallback for meta descriptions, and `frilansfinans` publishDate.

Production and staging are both up to date. 165 pages built.

## Plan
SEO pass on whiteport.com blog. End goal: every post has a real meta description (not just the post title) so Google has something to show in search results.

Done:
- All 86 cards have images ✅
- Meta description uses `creativeNote || excerpt || title` ✅
- 11 posts already have `excerpt` (good descriptions now active)
- 5 posts have `creativeNote`

Remaining:
- 74 posts have no `excerpt` and no `creativeNote` — Google sees just the post title as meta description

## Next
MODEL:Sonnet — For each of the 74 blog posts in `c:/dev/WDS/whiteport-astro/src/content/blog/` that have no `excerpt` and no `creativeNote`, read the post content and add a 1–2 sentence `excerpt` (120–155 chars) in the post's language (Swedish or English). Then do one `GDRIVE_STRICT=false npm run build` + `node deploy.cjs`. Start with posts that have `wpId` (migrated WP content, most substantial) then newer posts.

## Spec Sync
None

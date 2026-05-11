# whiteport-astro — Claude Instructions

## Branch Strategy

**Always work on `master`. Never commit to `preview`.**

`master` = production (whiteport.com). What lands on master goes live.

For content not ready to publish: set `draft: true` in frontmatter. Drafts are hidden from `/blog` but visible at `/blog/drafts`.

**Never cherry-pick between branches. Never create feature branches for content.** If you are on `preview`, switch to `master` before making changes.

## Publishing Content

- New article ready to go live → `draft: false` (or omit draft), commit to master, push
- Article in progress → `draft: true`, commit to master, push
- Never use a branch to "stage" content — use `draft: true` instead

## Commit Convention

```
fix: short description
feat: short description
ivo: action description (for Ivonne-driven commits)
```

## Image Paths

Blog images live in `public/images/blog/<slug>/`. Use `src: /images/blog/<slug>/filename.webp` in frontmatter. Never use `gdriveId` for new content — local files only.

## Drafts Page

`/blog/drafts` — shows all drafts at top, then the full published list below. Only Mårten needs to know this URL exists.

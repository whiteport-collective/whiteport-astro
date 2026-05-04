# Design Log

**Project:** whiteport-astro
**Started:** 2025-02-22
**Method:** Whiteport Design Studio (WDS)

---

## Backlog

### Done
- [x] Product brief — Phase 1
- [x] Trigger map + personas — Phase 2
- [x] Homepage — hero, agency, projects, services, stream, solutions, trusted by, CTA
- [x] About page — company story, beliefs, manifesto, team, JSON-LD
- [x] Contact page — details, maps, social, team cards, hire CTA
- [x] WDS product page — hero, value props, method, agents, specs, deliverables, JSON-LD
- [x] Services page — 6 service cards
- [x] Projects — 7 case studies with individual pages
- [x] Stream — CSS columns masonry, 84 posts with galleries
- [x] Blog — 7 posts, prev/next nav, latest articles on homepage
- [x] Tags — cloud index + individual tag pages (cross-collection)
- [x] 404 page
- [x] Header + Footer — nav, social icons, company info
- [x] SEO — canonical URLs, OG tags, Twitter cards, robots, JSON-LD
- [x] Redirects — 100 rules (WP→Astro URL migration)
- [x] RSS feed — stream + blog combined
- [x] Google Drive media pipeline — 98/98 items, service account, staleness check
- [x] Blog post enhancements — 2-column layout, sidebar offers, published-also with platform images, related posts masonry, YouTube video support
- [x] WO-001 M1 — Audio + alignment generation pipeline
- [x] WO-001 M2 — Article word wrapping for audio sync
- [x] WO-001 M3 — Audio player shell with waveform/menu
- [x] WO-001 M4 — Highlight current word during audio playback
- [x] R1 Go Live — whiteport.com deployed to Hostup via SFTP

### In Progress
- [ ] WO-001 M5 — Smooth auto-scroll during audio playback

### Roadmap

**R1: Go Live** (done)
- [x] SFTP deploy verified for `whiteport` and `astrowhi` Hostup accounts
- [x] HTTP smoke test on whiteport.com
- [ ] Fix 3 broken WP project images (fyndiqsvajpen, indoor-energy, skargardspartner)
- [ ] WP logo SVG (currently text "WHITEPORT")
- [ ] Delete old `aiwhitep` cPanel account via WHM
- [ ] Clean up one-off scripts (hostup-nav.cjs, deploy-cpanel.cjs, whm-*.cjs)

**R2: Social Publishing** (agent-driven cross-posting)
- [ ] Research API requirements per platform (auth flows, rate limits, content format)
- [ ] LinkedIn — personal (Mårten) + Whiteport org page
- [ ] Facebook — personal + Whiteport page
- [ ] Instagram — personal + Whiteport page
- [ ] YouTube — Whiteport channel
- [ ] TikTok — account TBD
- [ ] Commenting — engage on posts across platforms via agent
- [ ] Stories — manual for now (Instagram/Facebook/LinkedIn)

**R3: Edit Mode** (post-release)
- [ ] GitHub Device Flow OAuth (no server needed)
- [ ] In-browser frontmatter + body editing
- [ ] Direct commit to main via GitHub Contents API

**R4: Design System** (WDS Phase 7)
- [ ] Initialize design system structure (tokens, components, naming conventions)
- [ ] Extract tokens from existing site (colors, typography, spacing, shadows, radii)
- [ ] Define component specs from built pages (buttons, cards, pills, gallery, nav, footer)
- [ ] Duplicate detection for near-match components
- [ ] Generate component catalog (localhost browsable)
- [ ] Photoshop MCP for image asset processing (crop, resize, unsharp mask)
- [ ] Design Space parametric captures (visual measurements of every component)

**R5: Content & Growth**
- [ ] New blog content (beyond 7 migrated posts)
- [ ] Case study updates (new projects)
- [ ] Performance optimization (image formats, lazy loading audit)
- [ ] Analytics integration

---

## Current

| Task | Started | Agent | Status |
|------|---------|-------|--------|
| R1: Go Live | 2026-05-03 | Codex | Done — whiteport.com deploy verified on Hostup |

---

## Design Loop Status

> Per-page design progress. Updated by agents at every design transition.

| Scenario | Step | Page | Status | Updated |
|----------|------|------|--------|---------|
| WP→Astro migration | Brownfield migration | Homepage | built | 2025-03 |
| WP→Astro migration | Brownfield migration | About | built | 2025-03 |
| WP→Astro migration | Brownfield migration | Contact | built | 2025-03 |
| WP→Astro migration | Brownfield migration | WDS | built | 2025-03 |
| WP→Astro migration | Brownfield migration | Services | built | 2025-03 |
| WP→Astro migration | Brownfield migration | Projects (7) | built | 2025-03 |
| WP→Astro migration | Brownfield migration | Stream (84) | built | 2025-03 |
| Content expansion | New feature | Blog (7) | built | 2026-03-06 |
| Content expansion | New feature | Tags (15+) | built | 2026-03-06 |
| WP→Astro migration | New feature | 404 | built | 2025-03 |
| Media pipeline | Infrastructure | GDrive pipeline | built | 2026-03-06 |
| Media pipeline | Infrastructure | Service Account | built | 2026-03-06 |
| SEO & routing | Infrastructure | SEO + Redirects | built | 2026-03-06 |
| Content expansion | Infrastructure | RSS feed | built | 2026-03-06 |
| In-browser editing | Planned (post-release) | Edit Mode | discussed | 2026-03-06 |
| Social publishing | Infrastructure | LinkedIn integration | discussed | 2026-03-06 |
| Social publishing | Infrastructure | Facebook integration | discussed | 2026-03-06 |
| Social publishing | Infrastructure | Instagram integration | discussed | 2026-03-06 |
| Social publishing | Infrastructure | YouTube integration | discussed | 2026-03-06 |
| Social publishing | Infrastructure | TikTok integration | discussed | 2026-03-06 |
| Social publishing | Infrastructure | Commenting engine | discussed | 2026-03-06 |
| Blog enhancements | New feature | Blog post 2-col layout | built | 2026-03-06 |
| Blog enhancements | New feature | Sidebar offers (tag-matched) | built | 2026-03-06 |
| Blog enhancements | New feature | Published-also platform images | built | 2026-03-06 |
| Blog enhancements | New feature | Related posts masonry grid | built | 2026-03-06 |
| Blog enhancements | New feature | YouTube video support | built | 2026-03-06 |
| Deployment | Infrastructure | Hostup (whiteport.com) | built | 2026-05-03 |

**Status values:** `discussed` → `wireframed` → `specified` → `explored` → `building` → `built` → `approved` | `removed`

**How to use:**
- **Append a row** when a page reaches a new status (do not overwrite — latest row per page is current status)
- **Read on startup** to see where the project stands and what to suggest next

---

## Log

### 2025-02-22 — Project initialized (Phase 0)
- Type: brownfield (WordPress migration)
- Complexity: medium
- Tech stack: Astro 5.x, Tailwind CSS v4, MDX, static output
- WDS v0.3.3 installed with Freya (UX) and Saga (Analyst) agents

### 2025-02 — Product Brief + Trigger Map (Phases 1-2)
- Product brief created in `A-Product-Brief/`
- Trigger map with 3 personas (Alex AI Designer, Niklas Business Owner, Lisa Loyal Client)
- Business goals and feature impact analysis in `B-Trigger-Map/`
- Brownfield approach: skip UX scenarios, go straight to building

### 2025-03 — Core site build
- All major pages built: homepage, about, contact, WDS, services, projects, stream
- Content collections: stream (84 posts), projects (7 case studies)
- Google Drive media pipeline: `astro-gdrive.ts` integration
- 96/98 media items working (2 private videos deferred)
- Header, footer, navigation, social icons
- SEO: BaseHead with full meta, JSON-LD on key pages
- WP→Astro URL redirects (100 rules)

### 2026-03-06 — Blog + GDrive + RSS
- Created 7 blog posts from best long-form stream content
- Updated blog listing, added prev/next navigation
- Added "Latest articles" section to homepage
- Integrated blog into tag system (tags index + individual tag pages)
- Added blog posts to RSS feed
- Updated redirects: 7 blog URLs now point to /blog/
- **Google Service Account setup** (via Puppeteer-assisted Chrome session):
  - GCP project: `whiteport-media` under whiteport.se org
  - Service account: `whiteport-gdrive@whiteport-media.iam.gserviceaccount.com`
  - Drive API enabled, JSON key downloaded
  - `.env` + `.env` loader added to `astro-gdrive.ts`
  - **98/98 media items now downloading** (including 2 previously failing videos)
- **Staleness check** added to `astro-gdrive.ts`:
  - HEAD requests compare file sizes on each build (~5s)
  - Re-downloads changed files automatically
  - Manifest tracks `modifiedTime` for future metadata-based checks
- **Edit Mode planned** (post-release):
  - GitHub Device Flow OAuth (no server needed)
  - In-browser frontmatter + body editing
  - Direct commit to main via GitHub Contents API
  - Plan saved in `plans/sprightly-swimming-sparkle.md`

### 2026-03-06 — Deployed to Hostup (ai.whiteport.com)
- cPanel account created via Puppeteer/WHM automation (`aiwhitep@mu.hostup.se`)
- Server IP: `185.113.11.48`, package: `websespr_Whiteport`
- Converted `_redirects` (Netlify format) to `.htaccess` (LiteSpeed/Apache) — 90 RewriteRules
- Made `site` URL env-configurable in `astro.config.mjs`: `process.env.SITE_URL || 'https://whiteport.com'`
- Built 143 pages with `SITE_URL=https://ai.whiteport.com`
- Deploying 906MB dist/ via SFTP (ssh2-sftp-client)
- DNS: whiteport.com uses Cloudflare nameservers — A record for `ai` subdomain added to GTD inbox
- Pending: DNS propagation + AutoSSL certificate

### 2026-03-06 — Blog post enhancements (5 features)
- **2-column layout**: Desktop article (max-w-4xl) + 280px sticky sidebar, single column mobile
- **Sidebar offers**: Auto-matched by post tags against SERVICES array (6 services with tag arrays), manual override via frontmatter `offers` field, WDS promo fallback
- **Published-also with platform images**: `<details>/<summary>` toggles with platform icon pills, shows gallery image matched via `display[]` field + "View on {platform}" link
- **Related posts masonry**: Full Social Wall grid below article, pre-filtered to current post's primary category, same filter buttons + CSS columns + IntersectionObserver stagger as blog index. New component: `RelatedPostsGrid.astro`
- **YouTube video support**: `youtubeId` in gallery frontmatter → YouTube thumbnail as card image (red play overlay) → click-to-play iframe embed in gallery. `resolveMediaSrc()` + `resolveMediaPoster()` updated in content-helpers.ts
- Build: 135 pages, 20.8s, clean

### 2026-03-06 — Hosting: SSH shell blocked, ticket submitted
- cPanel account `astrowhi` on mu.hostup.se — SSH key authorized but shell is `/usr/local/cpanel/bin/noshell`
- Reseller `websespr` lacks `modifyacct` permission to change shell
- Hostup support ticket **#126273** submitted via Puppeteer automation of cloud.hostup.se
- Deploy skill created: `.claude/commands/deploy.md`
- Deploy blocked until shell enabled; alternative path: `deploy-cpanel.cjs` (WHM Fileman API, slow)

### 2026-03-06 — Design Space captures (9 semantic entries)
- Architecture, blog layout, published-also, related posts masonry, YouTube, hosting/deploy, SEO, GDrive pipeline, CSS columns masonry, content schema, page inventory
- All under project tag `whiteport`, searchable by meaning

### 2026-03-06 — Roadmap defined (R1-R4)
- R1: Go Live (blocked on SSH) — deploy, smoke test, fix broken images, logo SVG, cleanup
- R2: Social Publishing — agent-driven cross-posting to 5 platforms + commenting
- R3: Edit Mode — in-browser editing via GitHub Device Flow OAuth
- R4: Content & Growth — new blog posts, case studies, performance, analytics

### 2026-03-06 — Social publishing roadmap added
- Agent-driven social media cross-posting planned for all platforms
- Accounts: LinkedIn (personal + org), Facebook (personal + page), Instagram (personal + page), YouTube (Whiteport channel), TikTok
- Commenting via agent included — engage on posts across platforms
- Stories remain manual (Instagram/Facebook/LinkedIn) for now
- Existing infrastructure ready: `socialPosts` schema in content.config.ts, `SOCIAL_PLATFORMS` type in consts.ts, "Also posted on" display in stream posts
- Next: research API requirements per platform, auth flows, rate limits

### 2026-05-03 — WO-001 M2-M4 + Hostup live deploy
- Re-enabled article word wrapping via rehype so blog output includes `.word[data-word-index]` spans.
- Added the audio player shell with Wavesurfer and optional podcast/download menu; it renders only when matching MP3 + alignment JSON exist.
- Added M4 current-word highlighting from alignment JSON during playback.
- Deployed `dist/` to both Hostup roots: `/home/whiteport/public_html` for `whiteport.com` and `/home/astrowhi/public_html` for `astro.whiteport.com`.
- Verified `https://whiteport.com/blog/mcp-sucks-i-deleted-them-all/`: HTTP 200 and 644 `class="word"` matches.
- Audio player is absent on that article until ElevenLabs credentials and article-specific MP3/JSON assets are present.

---

## About This Folder

- **This file** — Single source of truth for project progress
- **agent-experiences/** — Compressed insights from design discussions

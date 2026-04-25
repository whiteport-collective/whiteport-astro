# Project Brief: Whiteport Astro

> Simplified Brief — Brownfield migration from WordPress to static Astro site

**Created:** 2026-03-04
**Author:** Mårten Angner
**Brief Type:** Simplified (Brownfield)

---

## Project Scope

Rebuild whiteport.com as a 100% static Astro site. Migrate the Social Stream WordPress plugin into a reusable Astro content pattern. This is both Whiteport's own site and a reference implementation for client offerings.

**What we're building:**
- Static Astro website replacing WordPress
- Social Stream as Astro content collection pattern
- Agent-as-CMS workflow (AI agents author markdown via Git)
- Client-accessible content editing through ChatGPT + GitHub
- Bilingual capability (English first, Swedish as Phase 2)

**What we're NOT building:**
- Server-side rendering or dynamic backend
- Database or CMS admin panel
- WordPress migration tool (manual content transfer)

---

## Challenge / Opportunity

**Challenge:** The current WordPress site is expensive to host, hard for AI agents to interact with, and doesn't showcase Whiteport's modern methodology. Clients can't easily manage their own content without WordPress training.

**Opportunity:** By rebuilding in Astro with Git-based content, Whiteport can:
1. Demonstrate the AI-first workflow to prospective clients
2. Offer a repeatable "Astro + AI agent" package to SMB clients
3. Let existing clients manage content through ChatGPT conversations
4. Position Mårten as a thought leader in AI-powered design methodology

---

## Design Goals

1. **Convert visitors to booked meetings** — clear path from landing to contact/booking
2. **Establish thought leadership** — blog and stream content showcasing WDS methodology
3. **Demonstrate capability** — the site itself is the portfolio piece (static, fast, AI-managed)
4. **Enable client self-service** — content patterns that clients can replicate via ChatGPT

---

## Platform Requirements

### Google Drive Media Pipeline

Media files (images and video, ~50/50 split) live in Google Drive as the source of truth. The Astro build pipeline downloads and processes media at build time using a Google Drive service account.

**Workflow (mirrors current WP Social Stream):**
1. Organize media in Google Drive folders (unchanged from current workflow)
2. AI agent writes markdown frontmatter referencing GD file IDs
3. Build pipeline downloads referenced files via GD API (service account auth)
4. Images are optimized (resize, WebP/AVIF via Astro Image)
5. Video posters are generated; short clips bundled, long videos linked via GD embed
6. Processed media outputs to static build — no runtime GD dependency

**Frontmatter pattern:**
```yaml
gallery:
  - gdriveId: "1ABC123..."
    alt: "Description"
    type: image
  - gdriveId: "1DEF456..."
    alt: "Video title"
    type: video
    poster: "1GHI789..."
```

**Key decisions:**
- GD files do NOT need to be publicly shared (service account has read access)
- Images: downloaded + optimized at build time, served from static CDN
- Video: short clips (<50MB) bundled in build; longer videos use GD embed/streaming URL
- Build cache prevents re-downloading unchanged files (keyed on GD file ID + modified date)
- CI/CD environment needs `GOOGLE_SERVICE_ACCOUNT_KEY` secret

**Astro integration:** Custom `astro-gdrive` integration that:
- Scans content collections for `gdriveId` references
- Downloads and caches media in `.cache/gdrive/`
- Rewrites frontmatter references to local paths during build
- Exposes `getGdriveImage()` helper for use in components

### Staging and Public Hosting

The site runs on two separate Hostup cPanel accounts on `mu.hostup.se` (LiteSpeed/cPanel, reseller `websespr`).

**Staging — `astro.whiteport.com`**
- cPanel account: `astrowhi`
- Document root: `/home/astrowhi/public_html`
- DNS: Cloudflare A-record `astro` → `185.113.11.48` (proxied)
- Deploy: `node deploy-astro.cjs` (SFTP, credentials in `.env`)
- Purpose: pre-production verification before going public

**Production — `whiteport.com`**
- cPanel account: TBD (to be created by Web247 on same server)
- Document root: `/home/<user>/public_html`
- DNS: Cloudflare A-record `@` → `185.113.11.48` (proxied), update when account is ready
- Deploy: `node deploy.cjs` (SFTP, set `DEPLOY_USER` / `DEPLOY_PASS` in `.env`)
- Purpose: live public site

**Email — `hello@whiteport.com`**
- Currently: Google Workspace (to be cancelled)
- Target: cPanel email box on production account, `hello@whiteport.com`
- Migration: export/forward existing mail, set up new MX records pointing to Hostup

**Key decisions:**
- No Netlify/Cloudflare Pages — Hostup matches existing Web247 client infrastructure
- Static files only — no server-side runtime on Hostup
- Media (`media/gdrive/`) deployed separately via `node deploy-media.cjs`
- SSL: Cloudflare edge (proxy mode) — no cert management on Hostup needed

### Content Architecture

- **Git-based content** — all content as markdown files in `src/content/`
- **Agent-as-CMS** — AI agents author content, commit to Git, GitHub Actions builds
- **Content collections** — Stream posts, blog posts, pages, gallery items

---

## Constraints

- **100% static output** — no server, no database (except GD build-time fetch)
- **Free hosting tier** — Netlify/Cloudflare Pages
- **Git-based content** — all content as markdown files
- **Astro + Tailwind CSS v4** — tech stack locked in
- **Brownfield** — existing content and brand assets to migrate
- **i18n-ready** — English first, architecture supports Swedish from day one
- **Google Drive as media source** — service account auth, build-time processing

---

## Product Backlog

### Must Have (MVP)

| # | Item | Design AC | Dev AC |
|---|------|-----------|--------|
| 1 | Homepage with hero + featured stream posts | Responsive hero, stream grid, clear CTA to book meeting | Lighthouse 95+, static build, content from collections |
| 2 | Social Stream content collection | Card layout preserves current visual language | Zod schema validates, gallery/social fields work |
| 3 | Blog content collection | Clean reading experience, author info | MDX support, frontmatter schema, RSS feed |
| 4 | Stream archive page with grid view | Filterable grid, pagination, responsive | Static pages per filter, tag/category routes |
| 5 | Single stream post page | Gallery, social links, prev/next nav, breadcrumbs | Dynamic routing, all media types render |
| 6 | Tag and category filter pages | Tag cloud, filtered results layout | Static pages generated for each tag, cross-collection |
| 7 | Contact/booking CTA | Prominent, accessible, above fold on key pages | Works without JS, links to booking tool |
| 8 | Base layout + navigation | Responsive nav, footer with stream strip | Shared layout, mobile hamburger, footer component |
| 9 | About page | Professional, shows methodology and team | MDX page, responsive |
| 10 | Services page | Clear service offerings, path to booking | MDX page, structured content |
| 11 | Google Drive media pipeline | Gallery renders images/video from GD source | Build-time GD fetch, image optimization, video embed, cache by file ID |

### Should Have

| # | Item | Design AC | Dev AC |
|---|------|-----------|--------|
| 12 | Locked/preview content | Unlock UX flow, password prompt | Client-side unlock via query param, no server |
| 13 | Swedish language support | Language switcher, translated UI | i18n routing, content collections per locale |
| 14 | Stream slider component | Carousel of featured posts | Embla/Splide, responsive, touch-friendly |
| 15 | SEO optimization | Open Graph, structured data, meta tags | Astro SEO component, sitemap, robots.txt |
| 16 | RSS/Atom feeds | — | Feed generation for blog + stream |

### Could Have (Defer)

| # | Item | Design AC | Dev AC |
|---|------|-----------|--------|
| 17 | Calendar view for stream | Monthly view of posts | FullCalendar or custom, static data |
| 18 | Search functionality | Search UI, results page | Client-side search (Pagefind/Fuse.js) |
| 19 | Dark mode | Toggle, respects system preference | CSS variables, Tailwind dark mode |
| 20 | Analytics dashboard | — | Privacy-friendly analytics (Plausible/Umami) |

---

## Next Steps

- [x] Phase 1: Project scaffold (Astro + Tailwind + WDS)
- [ ] Phase 2: Trigger Map (business goals, personas, driving forces)
- [ ] Phase 4: UX Design (skip Phase 3 scenarios — brownfield)
- [ ] Phase 7: Design System (tokens, components)

---

_Generated by Whiteport Design Studio_

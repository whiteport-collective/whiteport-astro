# Whiteport Publishing Platform — Requirements & Build Plan

**Status:** Draft for work-order generation
**Last updated:** 2026-05-02
**Companion doc:** [`publishing-pipeline.md`](publishing-pipeline.md) (vision, principles, content model)
**Owner:** Mårten Angner

---

## Purpose of this document

This is the **buildable spec** for the Whiteport Publishing Platform. It describes:

1. Functional requirements — what the platform must do
2. Non-functional requirements — performance, accessibility, reliability
3. Data model and API surface
4. UI requirements
5. External integrations and costs
6. Phase-by-phase build plan
7. Work-order seeds for each phase

A developer (human or AI agent) should be able to pick up any phase below and implement it from this document plus its referenced sources.

---

## 1. Functional requirements

### 1.1 Article authoring

| Req ID | Requirement |
|--------|-------------|
| ART-01 | Create new article via admin UI (title, slug, language, body, excerpt, categories, tags) |
| ART-02 | Edit article body in Markdown editor (mobile-friendly, autosave) |
| ART-03 | Articles support EN and SV (linked by canonical slug, separate body per language) |
| ART-04 | Save article in DRAFT state — no public URL |
| ART-05 | Promote DRAFT to STAGED — generates `astro.whiteport.com/<slug>/` URL with `noindex` |
| ART-06 | Promote STAGED to PUBLISHED — removes `noindex`, adds to sitemap, becomes Google-indexable |
| ART-07 | Article URL is permanent through state transitions |
| ART-08 | Delete article — pulls URL behind 410 Gone, archives engagement, queue cancels remaining derivatives |
| ART-09 | Translate article EN ↔ SV via agent call (LLM does the work, user reviews + approves) |

### 1.2 Audio (voice-clone TTS)

| Req ID | Requirement |
|--------|-------------|
| AUD-01 | Generate MP3 audio from article body using ElevenLabs voice clone |
| AUD-02 | Cache by content hash — re-generate only when body changes |
| AUD-03 | Embed `<audio>` player at top of every blog post |
| AUD-04 | Audio plays via standard HTML — works on Safari/iOS, CarPlay, Bluetooth, lock screen |
| AUD-05 | Track audio events (play, pause, ended, scrub) for engagement analytics |
| AUD-06 | Backfill audio for existing 87 posts on rollout (~$8 one-time API cost) |
| AUD-07 | Per-language audio (EN body → EN voice clone, SV body → SV voice clone using same model) |

### 1.3 Video (NotebookLM companion)

| Req ID | Requirement |
|--------|-------------|
| VID-01 | Manual upload of NotebookLM-generated MP4 (no API yet for that service) |
| VID-02 | Each article can have a "video companion" entry: video URL + cover image + summary |
| VID-03 | Video appears as a separate blog post type (`postType: video`) linking back to the source article |
| VID-04 | Hosted on YouTube by default (embedded iframe), self-hosted optional |

### 1.4 Derivatives (social posts)

| Req ID | Requirement |
|--------|-------------|
| DER-01 | Each article supports 5 derivatives per language (10 total) |
| DER-02 | Each derivative has: angle, target audience, visual type (photo/graphic), image asset, copy per platform |
| DER-03 | Per platform: LinkedIn personal text + LinkedIn first comment + Facebook text + Instagram text |
| DER-04 | Status: QUEUED → EXECUTING → PUBLISHED |
| DER-05 | Per derivative: track manual steps with `estimatedMinutes` |
| DER-06 | Engagement tracked back per derivative per platform (likes, comments, shares, reach) |

### 1.5 Scheduling engine

| Req ID | Requirement |
|--------|-------------|
| SCH-01 | Constraint solver — given current queue + new addition, propose valid slots |
| SCH-02 | Hard constraints: cadence (≥5 posts/week), no 2 in 4h, alternate visuals, bilingual flip ~+14d |
| SCH-03 | Soft constraints: prefer 09:00–11:00 weekdays for LI (configurable per platform) |
| SCH-04 | Drag-to-reschedule: validates against constraints, surfaces violations |
| SCH-05 | "Publish now" — moves chosen derivative to top of queue, reflows downstream |
| SCH-06 | Scheduled trigger via cron (Supabase pg_cron) at the assigned time |
| SCH-07 | Google Calendar mirror — every scheduled article + derivative becomes an event in a dedicated "Whiteport Publishing" calendar |
| SCH-08 | Calendar events update automatically when system reschedules (write-through) |
| SCH-09 | Two-way sync (v2): user-initiated drag in Google Calendar syncs back to system, validates against constraints |
| SCH-10 | Each Calendar event includes: article title, derivative #, target platforms, manual time estimate, link back to admin URL |

### 1.6 Social distribution

| Req ID | Requirement |
|--------|-------------|
| DST-01 | Trigger sends instructions to desktop session via Agent Space queue |
| DST-02 | Desktop Claude-in-Chrome reads queue, executes steps in real browser |
| DST-03 | LinkedIn personal: post text + image, then post first comment with link + hashtags |
| DST-04 | LinkedIn Whiteport page: repost from personal (one-click in real browser) |
| DST-05 | Facebook Whiteport page: post text + image, invite Mårten personal as collaborator |
| DST-06 | Instagram @whiteport: post text + image, invite @martenangner as collaborator |
| DST-07 | Manual steps surfaced to Mårten with time estimate ("~1 min, do it now or schedule reminder?") |
| DST-08 | Result URLs and post IDs written back to system per derivative per platform |

### 1.7 Statistics & engagement

| Req ID | Requirement |
|--------|-------------|
| STA-01 | Page views, time-on-page, scroll depth — via Cloudflare Web Analytics |
| STA-02 | Audio engagement — custom JS events stored in Supabase |
| STA-03 | Social engagement — Edge Functions poll FB Graph API and IG Insights API hourly |
| STA-04 | LinkedIn — copy-paste from dashboard, OR Claude-in-Chrome reads the Analytics page |
| STA-05 | Engagement chips on public articles — query Supabase, refresh every 60s |
| STA-06 | Per-derivative analytics in admin UI |
| STA-07 | Per-article aggregate (all derivatives, all platforms, all engagement) |

### 1.8 Agent integration (Ivonne)

| Req ID | Requirement |
|--------|-------------|
| AGT-01 | All system functionality exposed via REST API |
| AGT-02 | Agent reads queue state, derives "what's next," surfaces in /morning |
| AGT-03 | Agent reports outcomes in /evening (engagement, publishing status) |
| AGT-04 | Agent enforces cadence rules — flags missed days with ballet teacher voice |
| AGT-05 | Agent calculates total manual time required for any derivative trigger |
| AGT-06 | Agent proposes slot rebalancing with impact preview |
| AGT-07 | Agent drafts comment replies for Mårten approval |
| AGT-08 | Agent works from any AI runtime (Claude Code desktop, Claude app, Codex, etc.) |

### 1.9 Public site

| Req ID | Requirement |
|--------|-------------|
| PUB-01 | `whiteport.com/blog/<slug>/` — published articles only, indexable |
| PUB-02 | `astro.whiteport.com/<slug>/` — staged + draft articles, `noindex`, basic auth or token-protected |
| PUB-03 | Article template includes: title, body, audio player, gallery, "Also posted on" engagement chips |
| PUB-04 | RSS feed at `/rss.xml` (existing) + podcast feed at `/podcast.xml` (new) |
| PUB-05 | Sitemap auto-updates on publish |

---

## 2. Non-functional requirements

| Req ID | Requirement |
|--------|-------------|
| NFR-01 | Public site: static HTML, served from Hostup, sub-second TTFB |
| NFR-02 | Admin UI: works on iOS Safari, Chrome, Firefox; responsive mobile-first |
| NFR-03 | Build + deploy: from publish action to live URL ≤ 90 sec p95 |
| NFR-04 | Zero AI dependency in critical publishing path (system runs without LLMs) |
| NFR-05 | All content versioned in Supabase with timestamp audit trail |
| NFR-06 | Auth on admin UI: Supabase Auth with magic link or password |
| NFR-07 | Accessibility: WCAG AA on public site; audio player keyboard-navigable |
| NFR-08 | Privacy: no user tracking on public site beyond Cloudflare Web Analytics (cookieless) |
| NFR-09 | Backup: Supabase PITR enabled + weekly DB exports to Drive |

---

## 3. Data model (Supabase schema sketch)

### Tables

```sql
articles
  id uuid pk
  slug text unique
  language enum('en','sv')
  canonical_slug text  -- shared across language pair
  title text
  body markdown
  excerpt text
  categories text[]
  tags text[]
  status enum('DRAFT','STAGED','PUBLISHED','ARCHIVED')
  staged_at timestamptz
  published_at timestamptz
  audio_url text
  audio_hash text
  notebooklm_video_url text
  notebooklm_video_cover text
  created_at, updated_at

derivatives
  id uuid pk
  article_id uuid fk → articles
  language enum('en','sv')
  position int (1..5)
  angle text
  audience text
  visual_type enum('photo','graphic')
  image_url text
  copy_linkedin text
  copy_linkedin_first_comment text
  copy_facebook text
  copy_instagram text
  schedule_at timestamptz
  status enum('QUEUED','EXECUTING','PUBLISHED','FAILED')
  triggered_at timestamptz
  completed_at timestamptz

social_posts
  id uuid pk
  derivative_id uuid fk → derivatives  -- nullable: hero article posts also tracked here
  article_id uuid fk → articles  -- always set, points to canonical article
  platform enum('linkedin_personal','linkedin_page','facebook_page','facebook_personal','instagram_page','instagram_personal')
  account text
  post_url text
  posted_at timestamptz
  manual_steps jsonb  -- [{name, estimatedMinutes, completed_at}]

engagement_snapshots
  id uuid pk
  social_post_id uuid fk → social_posts
  fetched_at timestamptz
  likes int
  comments int
  shares int
  impressions int
  reach int

audio_events
  id uuid pk
  article_id uuid fk → articles
  event_type enum('play','pause','ended','scrub')
  position_seconds float
  session_id text
  created_at timestamptz

publish_jobs
  id uuid pk
  derivative_id uuid fk → derivatives
  scheduled_for timestamptz
  status enum('PENDING','PICKED_UP','RUNNING','COMPLETED','FAILED')
  picked_up_by text  -- desktop session identifier
  result jsonb
```

### Key views

- `calendar_view` — joins articles + derivatives + social_posts with status colors and visual types for UI
- `engagement_per_article` — sums engagement across all social posts per article per platform
- `next_in_queue` — derivatives where status=QUEUED ordered by schedule_at + priority
- `cadence_status` — last 7 days of published posts vs cadence target

---

## 4. API surface (system API)

All endpoints under `https://api.whiteport.com/v1/` (or Supabase Edge Function routes).

### Articles
- `POST /articles` — create
- `GET /articles?status=…&language=…` — list
- `GET /articles/:id` — read
- `PATCH /articles/:id` — update
- `POST /articles/:id/transition` — body: `{to: 'STAGED'|'PUBLISHED'}`
- `POST /articles/:id/translate` — body: `{from_lang, to_lang}` → returns translated body for review
- `POST /articles/:id/audio/regenerate` — force re-render audio
- `DELETE /articles/:id` — soft delete (ARCHIVED)

### Derivatives
- `POST /articles/:id/derivatives` — create derivative (body includes copy + visual + schedule)
- `GET /derivatives?status=QUEUED&limit=10` — list queue
- `PATCH /derivatives/:id` — update copy / schedule / visual
- `POST /derivatives/:id/trigger` — push to EXECUTING (also publishes article if STAGED)

### Scheduling
- `GET /calendar?from=…&to=…` — calendar view, all articles overlaid
- `POST /calendar/impact` — body: `{article_id, publish: 'now'|date}` → returns rebalance preview
- `POST /calendar/rebalance` — apply suggested rebalance
- `GET /calendar/conflicts` — list current constraint violations

### Stats
- `GET /articles/:id/engagement` — aggregated engagement across all derivatives + platforms
- `GET /derivatives/:id/engagement` — single derivative engagement
- `POST /audio_events` — public endpoint, JS calls when audio plays/pauses

### Agent helpers
- `GET /agent/morning_brief` — what Ivonne reports in /morning
- `GET /agent/evening_report` — what Ivonne reports in /evening
- `GET /agent/cadence_status` — for ballet-teacher escalations
- `POST /agent/comment_reply_draft` — body: `{comment_text, post_id}` → returns drafted reply

### Auth
- All write endpoints require Supabase Auth JWT (Mårten's user)
- Public read endpoints (engagement_per_article for chips) are anonymous + rate-limited

---

## 5. UI requirements

### 5.1 Admin UI (admin.whiteport.com or /admin route)

| Component | Description |
|-----------|-------------|
| **Dashboard** | Today's queue, this week's calendar, cadence status (colored), recent engagement |
| **Article editor** | Markdown editor, frontmatter as form fields, language switcher (EN ↔ SV), preview pane |
| **Derivative composer** | One panel per derivative (5 per language): copy editors per platform, image upload, schedule, preview |
| **Calendar view** | Multi-article overlay, drag-to-reschedule, color by article, icon by visual type, status colors |
| **Article timeline view** | Per-article 19-day fan-out, status icons, engagement overlays |
| **Visual post dashboard (relationship graph)** | Graph view of all articles + derivatives showing relationships. Drag-and-drop reorders publishing sequence. Click any node → opens that item's editor in a new tab. Color/status/visual-type icons match calendar conventions. Built with React Flow or similar. |
| **Queue inspector** | Live list of QUEUED derivatives, manual steps, total time estimate per item |
| **Stats dashboard** | Per-article aggregate, top performers, cadence trends, audio finish-rate trends |

### 5.2 Public site (whiteport.com)

| Component | Description |
|-----------|-------------|
| **Article page** | Existing template + audio player at top + engagement chips at bottom (live data) |
| **Audio player** | Standard `<audio>` controls, auto-loaded MP3, JS event tracking |
| **Engagement chips** | Live numbers, expandable to per-post breakdown with links |
| **Podcast feed** | Static `/podcast.xml` updated on each publish |

---

## 6. External integrations

| Service | Role | Cost | Setup notes |
|---------|------|------|-------------|
| **Supabase** | Database, Edge Functions, Auth, Storage, pg_cron | Free tier likely sufficient | Project already exists for Agent Space |
| **Cloudflare** | DNS, Web Analytics, Pages (for branch previews) | Free | Already in stack |
| **Cloudflare Pages** | Branch preview deployments | Free | New: link to GitHub repo |
| **Hostup** | Production static hosting | Existing | New: GitHub Actions deploy via SFTP |
| **Google Calendar API** | Mirror publishing schedule to Mårten's real calendar | Free | OAuth or service account; dedicated "Whiteport Publishing" calendar |
| **GitHub Actions** | Build pipeline, scheduled stats polling | Free for personal | New: workflow files in `.github/workflows/` |
| **ElevenLabs** | Voice clone TTS, speech-to-text, video gen | ~$22/mo Creator plan | New: account + voice training (3 min sample) |
| **NotebookLM** | Video discussion generation | Free | Manual workflow, no API |
| **Meta Graph API** | FB + IG engagement reads only (not posting) | Free | Marketing app + page tokens |
| **LinkedIn** | Engagement reads via dashboard | Existing | Manual or Claude-in-Chrome |
| **Image generation (NanoBanana / DALL-E / similar)** | Chalkboard graphics, AI photos | Pay-per-use, ~$0.04/image | Configurable |

**Total recurring spend beyond existing:** ~$22/mo (ElevenLabs).

---

## 7. Phased build plan

Each phase delivers something usable. Earlier phases gate later ones (see dependencies). Each phase is 1 work order.

### Phase 1 — Foundation: deploy pipeline (1–2 days)

**Goal:** push to master → whiteport.com is live in ~90 sec.

- WO-1.1: Configure Hostup SFTP credentials, store as GitHub repo secrets
- WO-1.2: Write `.github/workflows/deploy.yml` — build Astro, SFTP `dist/` to Hostup web root
- WO-1.3: Test deploy with a small change to master — verify whiteport.com updates
- WO-1.4: Document deploy in README

**Done = production deploy works on push to master.**

### Phase 2 — Supabase foundation (1 day)

**Goal:** schema in place, basic CRUD via Supabase Studio.

- WO-2.1: Create Supabase project (or use existing Agent Space project)
- WO-2.2: Apply schema (articles, derivatives, social_posts, engagement_snapshots, audio_events, publish_jobs)
- WO-2.3: Apply RLS policies (Mårten user can write, public can read engagement_per_article view)
- WO-2.4: Seed test data: one article in DRAFT, one in PUBLISHED

### Phase 3 — Astro reads from Supabase (2 days)

**Goal:** static site builds from DB, not from markdown files.

- WO-3.1: Astro content loader for articles from Supabase
- WO-3.2: Migration script: move existing 87 markdown posts → DB rows
- WO-3.3: Update blog list + article pages to render from DB
- WO-3.4: Webhook from Supabase → triggers GitHub Actions rebuild on publish

### Phase 4 — Cloudflare Pages branch previews (½ day)

**Goal:** every branch gets a preview URL.

- WO-4.1: Connect Cloudflare Pages project to GitHub repo
- WO-4.2: Configure subdomain `astro.whiteport.com` (or use auto-generated)
- WO-4.3: Verify branch push → preview URL builds

### Phase 5 — Audio pipeline (2 days)

**Goal:** every article has Mårten's voice-clone audio.

- WO-5.1: ElevenLabs Creator subscription + voice clone setup (3-min sample)
- WO-5.2: Build script: hash article body, call ElevenLabs API, save MP3 to Supabase Storage
- WO-5.3: Cache layer — skip generation if hash unchanged
- WO-5.4: Update article template with `<audio>` player + Listen button
- WO-5.5: Backfill audio for existing 87 posts
- WO-5.6: Audio events JS tracking to Supabase

### Phase 6 — Admin UI v1: article CRUD (3 days)

**Goal:** create + edit + publish articles via web UI on phone or desktop.

- WO-6.1: Auth (Supabase Auth, magic link)
- WO-6.2: Article list view (filter by status, language)
- WO-6.3: Article editor (Markdown, autosave, language switch)
- WO-6.4: State transition controls (DRAFT → STAGED → PUBLISHED)
- WO-6.5: Mobile-responsive

### Phase 7 — Derivative system (3 days)

**Goal:** plan 5 derivatives per article in admin UI.

- WO-7.1: Derivative composer UI (5 panels per language)
- WO-7.2: Per-platform copy editors (LI / FB / IG)
- WO-7.3: Image upload + visual type tagging (photo/graphic)
- WO-7.4: Schedule field with constraint validation
- WO-7.5: Save + edit + delete derivative endpoints

### Phase 8 — Scheduling engine + calendar UI (4 days)

**Goal:** dynamic queue with constraint solver.

- WO-8.1: Constraint rules engine (Edge Function)
- WO-8.2: `/calendar/impact` endpoint — preview reschedule effects
- WO-8.3: Calendar view UI (multi-article overlay)
- WO-8.4: Drag-to-reschedule with constraint feedback
- WO-8.5: pg_cron job: fire scheduled trigger at correct time

### Phase 8b — Google Calendar mirror (1 day)

**Goal:** Mårten sees the publishing schedule in his actual Google Calendar.

- WO-8b.1: Create dedicated "Whiteport Publishing" Google Calendar via API
- WO-8b.2: Edge Function: on derivative schedule write/update, push event to Google Calendar
- WO-8b.3: Event metadata: article title, derivative #, platforms, manual time estimate, admin URL
- WO-8b.4: Color-code events per article (match admin UI palette)
- WO-8b.5: (v2) Two-way sync via Calendar push notifications + constraint validation

### Phase 8c — Visual post dashboard (2–3 days)

**Goal:** see the whole content engine as a relationship graph; drag to reorder.

- WO-8c.1: Choose graph library (React Flow recommended)
- WO-8c.2: Build dashboard component: nodes for articles + derivatives, edges for relationships
- WO-8c.3: Status / visual-type / color icons per node (match calendar conventions)
- WO-8c.4: Drag-and-drop reordering → calls scheduler with constraint validation
- WO-8c.5: Click node → opens corresponding editor in new browser tab
- WO-8c.6: Filter controls (by language, status, article)

### Phase 9 — Social distribution (5 days)

**Goal:** trigger derivative → 6 accounts posted via Claude-in-Chrome.

- WO-9.1: Publish queue table + Edge Function picker
- WO-9.2: Desktop session daemon (Claude Code skill or similar) polls queue
- WO-9.3: Claude-in-Chrome flows for each platform (LI personal, LI page, FB, IG)
- WO-9.4: Manual step orchestration UI in admin
- WO-9.5: Result URL writeback per derivative + platform
- WO-9.6: Failure retry + escalation to user

### Phase 10 — Statistics & engagement chips (3 days)

**Goal:** engagement flows back, chips display live data.

- WO-10.1: Edge Functions to poll FB Graph API + IG Insights API hourly
- WO-10.2: LinkedIn engagement via Claude-in-Chrome read of Analytics page (or manual paste)
- WO-10.3: Cloudflare Web Analytics integration
- WO-10.4: Engagement chips component on article template
- WO-10.5: Stats dashboard in admin UI

### Phase 11 — Bilingual + 14-day flip (2 days)

**Goal:** SV cycle automatically scheduled 14 days after EN.

- WO-11.1: Translation endpoint (LLM-driven, user reviews)
- WO-11.2: Bilingual flip logic in scheduler
- WO-11.3: Image reuse default (SV cycle reuses EN images)
- WO-11.4: Per-language content rendering on public site

### Phase 11b — Voice authoring layer ★ HIGH PRIORITY (parallel from Phase 7 onward)

**Goal:** dictate articles in car, listen back, iterate. **This is a primary use case, not optional** — Mårten's in-car window is a multi-hour daily authoring opportunity that would otherwise be wasted.

Build as soon as Phase 5 (audio) and Phase 6 (admin UI) are complete. Can run in parallel with Phases 7–10.

- WO-11b.1: iOS Shortcut: voice → ElevenLabs Scribe (or Whisper) → transcript
- WO-11b.2: Edge Function: transcript → LLM cleanup → article draft → save to system as DRAFT
- WO-11b.3: Shortcut returns staging URL with audio (uses Phase 5 audio pipeline)
- WO-11b.4: Iteration loop via voice command — "rewrite paragraph 3" → re-renders draft + audio
- WO-11b.5: Voice-triggered publish — "Ivonne, publish this now" → goes through Phase 9 distribution

### Phase 12 — NotebookLM video companion (1 day)

**Goal:** support video posts.

- WO-12.1: Video post type in DB + template
- WO-12.2: Admin UI for adding video URL + cover image to existing article
- WO-12.3: Video appears as separate blog post linking back

### Phase 13 — Podcast feed (½ day)

**Goal:** RSS feed for Apple Podcasts + Spotify.

- WO-13.1: Astro generates `/podcast.xml` from articles with audio
- WO-13.2: Podcast metadata in site config (cover art, description, categories)
- WO-13.3: Submit to Apple Podcasts + Spotify + Pocket Casts

### Phase 14 — Agent integration (Ivonne) (3 days)

**Goal:** Ivonne reads + writes the system; ballet teacher voice in /morning, /evening.

- WO-14.1: System API documentation for agent consumers
- WO-14.2: Agent helper endpoints (`/agent/morning_brief` etc.)
- WO-14.3: Update Ivonne workflows (morning, evening, week, content) to use system APIs
- WO-14.4: Ballet teacher voice patterns in workflow files

---

## 8. Dependencies and sequencing

```
Phase 1 (deploy)
   ↓
Phase 2 (Supabase)
   ↓
Phase 3 (Astro from DB) ─────┬─────────────────┐
   ↓                         ↓                 ↓
Phase 4 (CF Pages)       Phase 5 (Audio)   Phase 6 (Admin v1)
                             ↓                 ↓
                             ↓             Phase 7 (Derivatives)
                             ↓                 ↓
                             ├─────→ Phase 11b (Voice authoring) ★ HIGH PRIORITY
                             ↓                 ↓
                             └─────→ Phase 8 (Scheduling)
                                         │
                              ┌──────────┼──────────┐
                              ↓          ↓          ↓
                        Phase 8b    Phase 8c    Phase 9 (Social distribution)
                        (Google     (Visual          ↓
                        Calendar)    dashboard)  Phase 10 (Stats)
                                         ↓
                              ┌──────────┼──────────┐
                              ↓          ↓          ↓
                        Phase 11    Phase 12    Phase 13
                        (bilingual) (video)     (podcast)
                              ↓
                        Phase 14 (Ivonne integration)
```

Critical path: 1 → 2 → 3 → 6 → 7 → 8 → 9 = first end-to-end publishing system. ~3 weeks of focused work.

---

## 9. Open decisions still to make

| Decision | Options | Default |
|----------|---------|---------|
| Hostup auth | SSH key / password | TBD — Mårten to confirm |
| Admin UI subdomain | `admin.whiteport.com` / `astro.whiteport.com/admin` | `astro.whiteport.com/admin` |
| Image generation primary tool | NanoBanana / DALL-E / Midjourney | NanoBanana (chalkboard already established) |
| Voice clone language coverage | EN only first / both EN+SV from day 1 | Both — ElevenLabs supports SV well |
| Staging URL auth | Public + noindex / token-protected / IP-allowlist | Public + noindex (no secrets in drafts) |
| LinkedIn engagement source | Manual paste / Claude-in-Chrome scrape | Claude-in-Chrome scrape weekly |

These are not blockers — defaults work. Mårten can revisit during build.

---

## 10. Work-order generation guidance

For each phase, a work order should specify:

1. **Goal** — one-line outcome
2. **Acceptance criteria** — testable conditions for "done"
3. **Files affected** — which folders/files in `whiteport-astro` and Supabase
4. **External dependencies** — services, credentials, secrets needed
5. **Estimated effort** — half-day, day, or multi-day
6. **Test approach** — how to verify it works
7. **Rollback plan** — how to undo if it breaks something

Phase numbers above are good seed identifiers. Each WO under a phase should be small enough for a single agent session to complete (~2–6 hours of focused work).

---

## 11. Success metrics

The platform is "working" when:

- Mårten can write an article on phone, hit publish, see it live on whiteport.com within 90 seconds
- Audio plays in his voice clone, he can listen via CarPlay
- Ivonne can describe the queue state and time-to-tasks accurately in /morning
- A new derivative scheduled today is posted to all 6 social accounts at the right time, with manual steps surfaced to Mårten with accurate time estimates
- Engagement chips on the article reflect real numbers within 1 hour of posting
- The system survives a missed day with cadence escalation but not a missed week
- Mårten's first reaction to using the system: "This doesn't get in my way."

---

## See also

- [`project-brief.md`](project-brief.md) — original whiteport.com migration brief (this is the next phase)
- [`publishing-pipeline.md`](publishing-pipeline.md) — vision, principles, content strategy
- `martens-documents/Planning/Projects/publishing-pipeline-roadmap.md` — earlier exploratory roadmap (superseded by this doc)
- Memory notes on Ivonne's voice and Mårten's accessibility needs in `~/.claude/projects/C--dev/memory/`

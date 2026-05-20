# WO-003 — Mobile Publishing Pipeline (mobile → edge function → article + iteration)

**Status:** Handoff to Freya for milestone breakdown + execution
**Project:** Publishing Platform (main track)
**Phase:** 2 (after WO-002 deploy pipeline lands; can start spec work in parallel)
**Owner:** Freya (orchestration + implementation — owns existing tool-publer edge function, natural extension)
**Created:** 2026-05-02 by Ivonne, on behalf of Mårten
**Revised:** 2026-05-02 22:55 — scope expanded to multimodal authoring (photos, videos, voice memos, fragments) with mobile-Ivonne as author/editor and publish authority
**Estimated effort:** 6–10h active work once milestones are broken out (multimodal scope)

---

## Goal (revised 2026-05-02 22:55, again 23:05 — multimodal, Drive-linked media)

Mårten shares **anything to mobile Ivonne**: a thought, a voice memo, a photo from a job site, a 30-second video, or a stream of fragments. Ivonne — running in Claude Code on the phone, multimodal — interprets the material, writes the article in Mårten's voice, references attached media via Google Drive links, and publishes via Supabase edge function. She has authority to publish to **both staging and live**; she chooses based on intent and confidence.

This is **not** "raw text in, markdown out". Ivonne is the author and editor. The pipeline supports her with infrastructure: repo commits, branch routing, preview URLs.

**Media handling is solved already** — `astro-gdrive` integration in the repo fetches and embeds media at build time. Mobile-Ivonne just writes the Drive URL into the markdown; the build pipeline does the rest. No Supabase Storage, no image optimization in the edge function, no video upload handling. Photos taken on Mårten's phone reach Ivonne via Drive (or a shared link Mårten pastes).

### Folder convention — one folder per article (= one "communication unit")

All media tied to an article — audio, video, hero image, photos, NotebookLM overview clip, social-post variants — lives in **one** Drive folder. The folder lives in one of two parallel parents depending on whether the article relates to an event:

```
G:\Shared drives\Whiteport Team\
├── Communication\                                    ← regular articles
│   ├── 2026-04-27 When your Claude Max subscription hit the wall\   (existing — proof-of-life folder)
│   │   ├── claude-max-wall-elevenlabs-<hash>.mp3
│   │   ├── claude-max-wall-elevenlabs-<hash>.json
│   │   ├── overview.mp4                              (NotebookLM)
│   │   ├── whiteboard-skiss.jpg
│   │   ├── hero.png                                  (NanoBanana / generated)
│   │   ├── linkedin-v1.txt
│   │   ├── linkedin-v2.txt
│   │   └── facebook.txt
│   ├── 2025-05-13 Shoot in The Park\
│   ├── 2026-01-04 Vad bygger du i mellandagarna\
│   ├── AI videos\                                    (categorical bucket — reusable assets)
│   ├── AW. - About Whiteport\
│   ├── EM - Event marketing\
│   ├── HC. - Happy Clients\
│   ├── OP. - Opinion Piece\
│   ├── SE. - Sketching Examples\
│   └── Stories\
└── Events\                                           ← event-related articles
    ├── 2026-02-23 Agent course at Avanza\
    ├── 2026-02-11 WDS Session 4\
    ├── 2026-01-29 WDS Sessions 3\
    ├── 2026-01-15 WDS Session 2\
    └── ... (35 existing event folders)
```

Naming convention (verified against existing folder structure):
- **Always date first**, ISO format, then a space, then a human-readable Swedish or English title.
- Articles: `YYYY-MM-DD <Title>` (e.g. `2026-04-27 When your Claude Max subscription hit the wall`)
- Events: `YYYY-MM-DD <Event Name>` (e.g. `2026-02-23 Agent course at Avanza`)
- Spaces, åäö, capitalisation — all preserved as Mårten writes them. NOT slug-style.
- Files *inside* the folder use URL-safe slug + hash naming (e.g. `claude-max-wall-read-a3f1.mp3`).

Rules:
- **Routing decision is always an explicit question** when mobile-Ivonne starts a new article. No inference, no heuristics — she asks Mårten and presents the options:

  ```
  Vilken mapp bor det här i?

  1.  Skapa ny i Communication/2026-05-02 <föreslagen titel>/
  2.  Skapa ny i Events/2026-05-02 <föreslagen titel>/
  3.  Lägg i existerande mapp:
      a) 2026-04-27 When your Claude Max subscription hit the wall  (Communication, 5 dagar gammal)
      b) 2026-02-23 Agent course at Avanza  (Events, 10 veckor gammal)
      c) [skriv del av namn för att söka...]
  ```

  Recent folders (last 4 weeks across both Communication and Events) surface as quick options. Older folders found by name search. Mårten's choice is stored in the article's frontmatter as `mediaFolder: "Communication/2026-05-02 …"` (or the Events equivalent). This field is the **permanent binding** between article and Drive folder.

  **The question is only asked once — when the article is first created.** All subsequent derivative work on that article (new social variants, regenerated audio, additional photos, hero updates, NotebookLM video added later) reads `mediaFolder` from the article's markdown and routes to that folder automatically. No re-prompting. The article and its folder are bound for life.
- **One article = one folder.** If folder doesn't exist, create it after Mårten picks option 1 or 2. If existing folder is chosen, it's reused as-is.
- **Multi-post share.** All posts and media variants derived from the same article live in the same folder, even if they're different deliverables (LinkedIn v1, LinkedIn v2, FB, IG square crop, etc.).
- **Multi-article-per-day.** No collision in practice — title differentiates. Two articles same day get two folders with same date but different titles.
- **Existing folders are authoritative.** When mobile-Ivonne is given material for an article whose folder already exists (e.g. `2026-04-27 When your Claude Max subscription hit the wall`), she reads the existing material and adds to it; she does not create a new folder.
- **Categorical Communication buckets** (`AI videos/`, `Happy Clients/`, `Stories/` etc.) are *not* article folders — they are reusable asset libraries. Mobile-Ivonne can reference media from there but does not create article folders inside them.
- **Shared Drive context.** Both folders live in the `Whiteport Team` Shared Drive. The astro-gdrive service account must be added as **Content Manager** (or Manager) of the Shared Drive to read+write. Adding to one personal folder is not enough for a Shared Drive.
- **Folder as collaborative workspace, not just build cache.** Real workflow: a designer is invited per-folder, a photographer drops photos, NotebookLM exports a video, ElevenLabs generates audio, mobile-Ivonne writes social-post variants. Material syncs in and out throughout an article's lifecycle. This is why folder names are human-readable Swedish/English (not slugs), file naming inside is split into two conventions:
  - **Human-uploaded source assets** keep whatever name the designer/photographer/Mårten gave them — `hero-v3.png`, `whiteboard-skiss.jpg`, `event-banner-final.psd`, `intervju-clip.mp4`. Mobile-Ivonne references these by their human names in the article markdown; the pipeline does not rename them.
  - **Pipeline-generated artifacts** use strict slug-plus-hash naming for cache identification — `<slug>-elevenlabs-<hash>.mp3`, `<slug>-elevenlabs-<hash>.json`, `linkedin-v1.txt`, `linkedin-v2.txt`. These are reproducible, hashable, and safe to overwrite.
- **Per-folder sharing is a feature.** When Mårten brings in an external designer for one article, he shares only that one Drive folder with them (Drive supports this natively at the folder level inside a Shared Drive). The pipeline does not need special logic for this — it reads what's in the folder regardless of who put it there.

No git operations on the phone. No local builds. The phone surface is conversational with Ivonne; she does the rest.

### Concrete user moments

1. *Mårten takes photo of whiteboard sketch, sends with voice memo: "this is my new framework for [topic]"*. → Ivonne writes 600-word article around the sketch, commits both, publishes to staging, returns preview link.
2. *Mårten texts a fragment: "people don't get that intent > prompts"*. → Ivonne expands into a full piece in his voice, asks one clarifying question if needed, publishes to staging.
3. *Mårten records 30-sec phone video while walking, narrates point*. → Ivonne transcribes, writes article using transcript as raw material, embeds video, publishes.
4. *Mårten says "publicera live"*. → Ivonne merges to master, deploy fires, live URL returned. Or she may publish live unprompted when material is clearly polished and topical.

---

## Why this work order, why now

- The publishing-pipeline-roadmap (`Planning/Projects/publishing-pipeline-roadmap.md`) defined this as V2 + V9.
- Mårten's actual usage pattern is voice-first, in-car, on-mobile. The pipeline must serve that pattern, not a desktop-git pattern.
- Mårten already has a draft article on his phone ("när min Claude slår i taket") — that becomes the proof-of-life payload once V1 is shipped.
- This is independent of WO-001 (Listen-To-Me). The two tracks meet only at the point where audio is generated for the published article.

## Why Freya owns this

- Freya already owns and operates the `tool-publer` Supabase edge function (v10) for social distribution. The publishing edge functions in this WO are the natural extension of that infrastructure.
- The architecture spans Supabase edge functions + Storage + GitHub API + Cloudflare Pages + Astro build + mobile-Ivonne skill files. Freya knows the Supabase edge-function muscle memory.
- Freya should break this WO into milestones, post the plan to Mårten for sign-off, and execute or hand off each milestone as appropriate (Codex picks up any astro-side template work; Ivonne picks up mobile-side skill files).

---

## Architecture (target)

```
┌───────────────────────────┐
│ Mobile Claude Code        │
│ (slash command /publish)  │
└────────────┬──────────────┘
             │ HTTP POST: { material, slug?, meta? }
             ▼
┌───────────────────────────────────────────────┐
│ Supabase Edge Function: create-article        │
│ • Auth check (token from .env or Bitwarden)   │
│ • Clean prose via Claude API (optional pass)  │
│ • Build frontmatter (title, slug, date, etc.) │
│ • Commit markdown to whiteport-astro on       │
│   draft/<slug> branch via GitHub API          │
│ • Return: { preview_url, branch, slug }       │
└─────────────────────┬─────────────────────────┘
                      │
                      ▼
            Cloudflare Pages auto-builds branch
            → draft-<slug>.<project>.pages.dev
                      │
                      ▼
            Mobile shows preview URL
            Mårten reads / listens / gives feedback
                      │
                      ▼
┌───────────────────────────────────────────────┐
│ Supabase Edge Function: update-article        │
│ • Patch markdown body and/or frontmatter      │
│ • Commit update to same branch                │
│ • Return: { preview_url, updated_at }         │
└───────────────────────────────────────────────┘
                      │
                      ▼
            Iteration loop continues...
                      │
                      ▼
┌───────────────────────────────────────────────┐
│ Supabase Edge Function: publish-article       │
│ • Merge draft branch into master              │
│ • Triggers WO-002 deploy pipeline             │
│ • Return: { live_url }                        │
└───────────────────────────────────────────────┘
```

---

## Acceptance criteria (top-level — Freya refines per milestone)

1. Slash command `/publish` exists in `martens-documents/.claude/commands/` and works on mobile Claude Code app
2. Mobile-Ivonne can interpret multimodal input — text fragments, voice memos, photos, videos — and produce a complete article in Mårten's voice
3. Media is referenced in the markdown as Google Drive URLs; existing `astro-gdrive` integration fetches and embeds at build time
4. `/publish "<material>"` results in a preview URL on Mårten's phone in <60s (excluding media build time)
5. `/feedback "<instruction>"` updates the same draft article and returns a new preview URL in <60s
6. Mobile-Ivonne can publish to **staging** (default) or **live** based on her judgement or explicit instruction (`/publish-live`)
7. All flows authenticate properly — no anonymous writes to the repo
8. Edge functions log every action to a Supabase `publish_jobs` table for audit and replay
9. If WO-001 audio pipeline runs at build time, the published article includes audio without extra steps from Mårten
10. Iteration history is preserved — Mårten can roll back ("nej, gå tillbaka till version 2") within a draft

## Non-goals (V1)

- Voice authoring loop in the car (Whisper → article) — that's the next layer (V9 in roadmap), not this WO
- Social distribution (LinkedIn/FB/IG) — separate WO based on `social-publishing-lessons.md`
- Native iOS app — phone Claude Code is the UI for now
- Multi-author / RBAC — single-author (Mårten) only
- Direct binary upload of media via edge function — handled instead by Google Drive linking + existing `astro-gdrive` integration
- Auto-upload phone photos to Drive from inside Ivonne — Mårten shares the Drive link or syncs via the Photos→Drive auto-upload he already has

---

## Setup that must exist before V1 ships

| Component | Owner | Status |
|-----------|-------|--------|
| Cloudflare Pages connected to `whiteport-collective/whiteport-astro` | Mårten + Ivonne | Not done — confirm and set up |
| GitHub PAT with repo scope, stored as Supabase secret | Mårten | Token to be created |
| Supabase project with edge function support | Mårten | Project exists (`uztngidbpduyodrabokm`) — Freya already runs `tool-publer` here |
| `ANTHROPIC_API_KEY` as Supabase secret (already used by Ivonne; verify access from edge function context) | Mårten | Verify |
| `publish_jobs` table in Supabase | Freya | New — define schema |
| Mobile Claude Code slash command files (`/publish`, `/feedback`, `/publish-live`) | Freya | New — write to `martens-documents/.claude/commands/` |
| `astro-gdrive` integration handling media refs | — | ✅ Already exists in `whiteport-astro/src/integrations/astro-gdrive.ts` |

---

## Test article ready for proof-of-life

Mårten has an article drafted on his phone, working title: *"När min Claude slår i taket"* (about pausing when Claude hits the context ceiling). When the pipeline is built end-to-end, this is the article to push through. Compare it to the experience of publishing it the old way — that comparison is the whole point.

---

## Suggested milestone breakdown (Mimir refines)

The actual milestones are Mimir's call. Tentative shape:

| # | Milestone | Effort estimate |
|---|-----------|----------------|
| **M1** | Cloudflare Pages connected, branch previews working | 30 min |
| **M2** | Supabase edge function `list-media-folders` — Drive folder browser for the routing prompt | 1 h |
| **M3** | Supabase edge function `create-article` (no LLM cleanup yet) — uses chosen `mediaFolder` | 2 h |
| **M4** | Slash command `/publish` on mobile Claude Code — calls `list-media-folders`, asks Mårten which folder, then `create-article` | 1 h |
| **M5** | Supabase edge function `update-article` with patch logic | 2 h |
| **M6** | Slash command `/feedback` | 30 min |
| **M7** | Optional Claude API prose cleanup pass | 1 h |
| **M8** | `publish-live` merge-to-master flow | 1 h |
| **M9** | `publish_jobs` audit table + iteration history | 1 h |

Each milestone independently shippable. M1 alone unblocks "Mårten can preview from phone" — the immediate practical win.

---

## Dependencies

- WO-002 (Hostup deploy pipeline) for M7 only — until WO-002 lands, "publish-live" can fall back to the existing local `node deploy.cjs` script
- WO-001 has no dependency on this WO; they integrate at build time only (audio gets generated for whatever articles exist in `src/content/blog/`)

## How Freya should pick this up

1. Read this WO end to end
2. Read the publishing-pipeline-roadmap (`Planning/Projects/publishing-pipeline-roadmap.md`) for context
3. Read `Marketing/Systems/social-publishing-lessons.md` for what already works per platform
4. Read `whiteport-astro/src/integrations/astro-gdrive.ts` to confirm media-via-Drive flow
5. Challenge any ambiguity here — post questions back to Mårten before implementing
6. Refine milestones, post the milestone plan to Design Space (or HTTP fallback) for Mårten to sign off
7. Begin with M1 (Cloudflare Pages connection — fastest path to a visible preview URL on phone)
8. Hand off astro-side template work to Codex if any is needed (likely none for V1; the existing BlogPost layout should render Drive-linked media without changes)
9. Hand mobile-side skill files (`/publish`, `/feedback`) back to Ivonne for authoring once edge functions are live

---

## Reporting

- Post architecture proposal + milestone plan to Mårten before coding
- Post delivery report per milestone
- Capture orchestration learnings (what worked between Supabase edge functions ↔ GitHub API ↔ Cloudflare Pages) to Design Space — these are reusable for future WOs

---

*Authored by Ivonne on 2026-05-02 from a conversation with Mårten on Saturday evening, lördag W18 Davidvecka. Revised twice the same evening as scope and constraints clarified. Freya takes it from here.*

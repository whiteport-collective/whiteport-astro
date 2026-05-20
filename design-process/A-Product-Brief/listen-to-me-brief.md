# Listen To Me — Audio & Podcast Track

**Status:** Parallel project to the publishing platform
**Last updated:** 2026-05-02
**Owner:** Mårten Angner
**Scope:** Standalone — no dependency on publishing-pipeline platform; integrates cleanly later

---

## Why this is a separate project

The audio + podcast track is:

- **Small in scope** — a build-time MP3 generator + an audio player + an RSS feed
- **Standalone** — doesn't need Supabase, admin UI, scheduling, or any of the publishing platform's machinery
- **Independently valuable** — accessibility (Mårten is dyslexic) + reach (podcast distribution) are wins on day one, regardless of when the big platform ships
- **Faster to ship** — 1–2 weeks of focused work vs months for the platform
- **Forward-compatible** — when the publishing platform comes online, the audio system folds in cleanly because both use the same Astro + ElevenLabs stack

Build this in parallel. It doesn't touch the publishing platform until both exist, then they merge naturally.

---

## What "Listen to me" does

### 1. Read-aloud on every article (with sync highlighting)

Every article on whiteport.com has a designed audio player at the top: play/pause button, waveform (click anywhere to seek), volume control, and a three-dot menu offering "Listen on Spotify", "Listen on Apple Podcasts", and "Download MP3". The article plays in Mårten's ElevenLabs voice clone. Underlying playback uses native `<audio>`, so it works on phone, desktop, CarPlay, lock screen, AirPods controls — anywhere the web works.

**Bimodal read-along (planned):** as the audio plays, the word currently being spoken is visually highlighted in the article text. The page scrolls smoothly to keep the active word visible. Clicking any word in the text seeks the audio to that point. This is a primary accessibility feature for dyslexic readers (bimodal presentation cuts cognitive load substantially).

**Architecture supports it from day one — UI ships in a follow-up WO.** WO-001 captures word-level alignment data from ElevenLabs (the `with_timestamps` API option costs nothing extra) and saves it as JSON next to each MP3. The UI piece (word-wrapping in the article body + client-side highlight + click-to-seek) ships later as WO-003. By saving alignment data now, we don't have to regenerate audio for the 87 existing posts when WO-003 lands — the data is already there waiting.

**Primary user benefit:**
- Mårten (dyslexic) listens AND reads along — bimodal mode reduces effort and catches phrasing he'd miss reading silently
- Readers (some also dyslexic, or just commuting) can listen instead of read; readers who use both at once get the comprehension boost
- Accessibility win, retention win, differentiation win

### 2. Podcast distribution

Same audio that plays on the website is also distributed via RSS feed at `/podcast.xml`, ingested by Apple Podcasts, Spotify, Pocket Casts. Every new article published auto-appears as a podcast episode in those platforms.

**V1 (shipping in WO-001):** the podcast episode is the same MP3 as the on-site read-aloud — Mårten's voice clone reading the article. No music intros, no special composition. Clean and minimal, proves the distribution loop works.

**V2 (future enhancement, separate WO):** music intros/outros, dynamic per-episode voice intros ("Welcome to Whiteport, today's piece is..."), professional polish. The build pipeline supports this — just swap which MP3 is served via the feed.

**Primary value:**
- New audience surface (podcast listeners, casual commute listeners)
- Reuses content already written — zero extra creative effort
- Becomes a long-tail discovery channel
- The audio player on the article page links straight to "Listen on Spotify" / "Listen on Apple Podcasts" — readers can move the listening experience to their preferred app

---

## What the audio system uses

| Service | Role | Cost |
|---------|------|------|
| **ElevenLabs Creator** | Voice clone TTS, Studio for multi-segment composition, music + SFX generation | ~$22/mo |
| **Astro build** | Calls ElevenLabs API at build time, saves MP3 to `public/audio/<slug>.mp3` | Existing |
| **Hostup** | Serves MP3 files | Existing |
| **Apple Podcasts / Spotify / Pocket Casts** | Podcast distribution | Free (one-time submit) |

**Total: ~$22/mo on top of existing infrastructure.**

---

## Audio composition structure

```
read-aloud version (article page audio player):
  [Article body in voice clone]                         — single segment

podcast version (RSS feed MP3):
  [Music intro 5s]                                      — static, set once
  [Voice intro: "Welcome to the Whiteport podcast,
   I'm Mårten Angner, today we're talking about
   <article title>"]                                    — generated per article
  [Article body in voice clone]                         — same as above
  [Voice outro: "Find this and more at whiteport.com"]  — static, set once
  [Music outro 5s]                                      — static, set once
```

Two output files per article:
- `/audio/<slug>-read.mp3` — short, just the article (for the on-page Listen button)
- `/audio/<slug>-podcast.mp3` — full composition with intros/outros (for the podcast feed)

Caching by content hash means rebuilds skip articles that haven't changed.

---

## Build phases (sequential, ~1–2 weeks total)

### Phase L1 — ElevenLabs setup (½ day)

**Goal:** voice clone trained, account ready.

- WO-L1.1: Subscribe to ElevenLabs Creator plan
- WO-L1.2: Record 3-min sample (Mårten reading any existing article)
- WO-L1.3: Upload sample, train Instant Voice Clone, save voice ID
- WO-L1.4: Test API call: send a paragraph, get back MP3, verify quality
- WO-L1.5: Store voice ID + API key in `.env` and GitHub Actions secrets

### Phase L2 — Read-aloud generation in Astro build (1 day)

**Goal:** every article has a read-only MP3 generated on build.

- WO-L2.1: Astro build hook: scan articles, hash body content, check cache
- WO-L2.2: For new/changed articles: call ElevenLabs API with article body + voice ID
- WO-L2.3: Save MP3 to `public/audio/<slug>-read-<hash>.mp3`
- WO-L2.4: Update article frontmatter or static index with audio URL
- WO-L2.5: Backfill existing 87 posts (~$8 one-time API cost)

### Phase L3 — Audio player on article template (½ day)

**Goal:** Listen button visible and working on every published article.

- WO-L3.1: Add `<audio>` player component to blog post template
- WO-L3.2: Listen button + waveform (optional) at top of post
- WO-L3.3: Verify CarPlay / lock-screen / AirPods control compatibility
- WO-L3.4: Optional: track play/pause/ended events for engagement (light JS, sends to analytics)

### Phase L4 — Podcast composition with music (2 days)

**Goal:** podcast-formatted MP3 with music intro, voice intro, article body, voice outro, music outro.

**Composition pattern: bookends.** Music plays at the start and end only, not under the voice. Cleanest for listening, simplest to build, used by most professional podcasts.

- WO-L4.1: Use **ElevenLabs Music API** to generate music intro (5–10 sec, e.g. "calm professional intro, ambient electronic, 8 sec"). Listen, regenerate until you like it. Save once, reuse on every episode.
- WO-L4.2: Use ElevenLabs Music API to generate music outro (matching mood, ~8 sec). Save once, reuse.
- WO-L4.3: Generate static voice outro using voice clone: "Find this and more at whiteport.com." Save once, reuse.
- WO-L4.4: Build script: per article, generate dynamic voice intro using article title via voice clone API ("Welcome to the Whiteport podcast. I'm Mårten Angner. Today's piece: <title>")
- WO-L4.5: Stitch the 5 segments using **ElevenLabs Studio API** (preferred — handles fades) or **ffmpeg** (fallback): music in → voice in → article body → voice out → music out
- WO-L4.6: Apply ~0.5s crossfades at segment boundaries for a professional feel
- WO-L4.7: Save composed MP3 to `public/audio/<slug>-podcast-<hash>.mp3`

**v2 (later, if desired):** music bed continuously under voice with auto-ducking. Adds polish but most podcasts skip this — bookends are the production standard.

### Phase L5 — Podcast feed + submissions (½ day)

**Goal:** RSS feed live, feed submitted to platforms.

- WO-L5.1: Astro generates `/podcast.xml` from articles with podcast audio
- WO-L5.2: Podcast metadata in site config: cover art, description, categories, language, author
- WO-L5.3: Set up `<itunes:*>` tags for full Apple compatibility
- WO-L5.4: Submit feed URL to Apple Podcasts (Apple Podcasts Connect)
- WO-L5.5: Submit to Spotify (Spotify for Podcasters)
- WO-L5.6: Submit to Pocket Casts (auto-discovers from feed)
- WO-L5.7: Verify each new article auto-appears as an episode

### Phase L6 — Bilingual audio (later, ~1 day)

**Goal:** SV-language articles get SV-language audio.

- WO-L6.1: ElevenLabs voice clone supports SV — verify quality
- WO-L6.2: Build pipeline detects article language, generates audio in matching language
- WO-L6.3: Per-language podcast feeds (`/podcast-en.xml`, `/podcast-sv.xml`)

---

## Dependencies

```
L1 (setup) → L2 (read-aloud) → L3 (player on site)
                  ↓
            L4 (podcast composition) → L5 (feed + submissions)
                                            ↓
                                       L6 (bilingual, later)
```

L1, L2, L3 are the **MVP** — gives you the read-aloud feature on every article. ~2 days of work.

L4, L5 add the podcast distribution. Another ~2.5 days.

L6 only when bilingual articles exist (depends on the publishing platform's bilingual phase, OR can be built independently if Mårten manually writes SV articles).

---

## How this folds into the publishing platform later

When the publishing platform is built:

- The Astro build step that generates audio remains the same
- The Supabase database stores article body and audio URL (instead of markdown files)
- The Listen button on the article template is unchanged
- The podcast feed is regenerated from DB content instead of markdown files
- Multi-language support is taken from `articles.language` field

Net change to "Listen to me" code: **swap the data source from markdown files to Supabase queries**. Otherwise unchanged.

This is exactly why the parallel split works — minimal coupling, painless future merge.

---

## Open decisions

| Decision | Options | Default |
|----------|---------|---------|
| Music intro source | License from a stock library / ElevenLabs Music API generates / Mårten records original | Stock or ElevenLabs Music API (cheap, fast) |
| Voice intro template | Static phrase / dynamic per article using title | Dynamic per article |
| Podcast cover art | Whiteport logo / per-article cover / generated | Whiteport logo + maybe per-article hero image |
| Audio quality | Standard / HD | HD (small file size difference, big quality difference) |
| Read-aloud version length | Full article / abridged | Full article |

None are blocking. Decide as you go.

---

## Success metrics

The "Listen to me" project is "working" when:

- Every published article has a Listen button
- Tapping Listen on phone plays the audio over CarPlay / AirPods reliably
- Mårten uses the feature for his own draft review (catches phrasing issues he'd miss reading silently)
- The podcast feed validates and is accepted by Apple Podcasts and Spotify
- New articles auto-appear as podcast episodes within 24h of publish
- At least one external listener subscribes to the podcast in the first month (proof of distribution working)

---

## See also

- [`project-brief.md`](project-brief.md) — original whiteport.com migration brief
- [`publishing-pipeline.md`](publishing-pipeline.md) — the larger platform vision (this audio track is a sub-feature there, but built first as standalone)
- [`platform-requirements.md`](platform-requirements.md) — full platform spec; audio = Phase 5 + Phase 13 (folded together by this brief)

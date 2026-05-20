# WO-001 — Listen To Me: Voice-Clone Audio with Bimodal Read-Along

**Status:** Ready for Codex
**Project:** Listen To Me (parallel track)
**Owner:** Codex
**Created:** 2026-05-02
**Estimated effort:** ~4.5 days total across eight milestones
**Related brief:** [`../A-Product-Brief/listen-to-me-brief.md`](../A-Product-Brief/listen-to-me-brief.md)

---

## Goal

Add a complete read-aloud feature to every blog post on whiteport.com:

- Audio generated at build time using Mårten's ElevenLabs voice clone
- Standard `<audio>` player on every article ("▶ Listen" button)
- Word-level sync highlighting as the audio plays — bimodal read-along for accessibility (Mårten is dyslexic)
- Click any word to seek the audio to that point

The work is structured as **eight milestones**, each independently shippable in 2–4 hours. Each milestone delivers a clear gate; Codex completes them sequentially, deploying and validating between.

---

## Milestones at a glance

| # | Milestone | Effort | What ships |
|---|-----------|--------|------------|
| **M1** | Audio + alignment generation pipeline | 1 day | MP3 + alignment JSON files exist for every article. No UI change. |
| **M2** | Custom audio player (waveform + menu) | 1 day | Users see a designed player on every article — play/pause, waveform with click-to-seek, volume, and a menu with Listen-on-Spotify / Listen-on-Apple / Download MP3. |
| **M3** | Word-wrapping prep | 3 h | Article body words are wrapped in `<span>`s. No visible change. |
| **M4** | Highlight current word | 2 h | As audio plays, current word visually highlights. No scroll, no click yet. |
| **M5** | Smooth auto-scroll | 3 h | Page follows the highlight, keeping it visible. Yields to manual scroll. |
| **M6** | Click-to-seek | 2 h | Clicking any word seeks audio to that point. |
| **M7** | Podcast feed + platform distribution | ½ day | Whiteport podcast appears in Spotify, Apple Podcasts, Pocket Casts. Every published article auto-appears as an episode. Menu items in M2 player become real links. |
| **M8** | Release build media blocker cleanup | 3 h | Missing GDrive/WP media is triaged so production builds stay strict, while audio backfills are not blocked by unrelated media debt. |

Each milestone has its own acceptance criteria + done gate below.

---

## Context — why now

- Mårten is dyslexic; audio + bimodal highlighting are genuine accessibility tools, not polish
- The "listen to me" track is parallelizable from the larger publishing platform — no shared infrastructure
- Eight-milestone structure means the feature ships in small atomic increments, each independently testable

---

## Split of work — Mårten vs Codex

### Mårten's tasks (parallel to Codex's coding)

| # | Task | Time | Required by Codex at... |
|---|------|------|------------------------|
| Mt1 | Subscribe to **ElevenLabs Creator plan** (~$22/mo) at https://elevenlabs.io | 5 min | M1 integration test |
| Mt2 | Generate API key from ElevenLabs dashboard → Profile → API Keys | 2 min | M1 integration test |
| Mt3 | Add API key as GitHub Secret `ELEVENLABS_API_KEY` (or paste into local `.env`) | 2 min | M1 integration test |
| Mt4 | Record 3-min voice sample (read any existing article into phone voice memo) | 5 min | M1 production deploy |
| Mt5 | Upload sample to ElevenLabs → Voices → Add Voice → Instant Voice Cloning | 5 min | M1 production deploy |
| Mt6 | Copy voice ID from ElevenLabs dashboard | 1 min | M1 production deploy |
| Mt7 | Add voice ID as GitHub Secret `ELEVENLABS_VOICE_ID` | 2 min | M1 production deploy |
| Mt8 | Provide podcast cover art (1400×1400 or 3000×3000 JPG/PNG) | 5 min | M7 |
| Mt9 | Provide podcast metadata (show description, primary category, secondary category, author name, language) | 5 min | M7 |
| Mt10 | Submit feed URL `https://whiteport.com/podcast.xml` to **Apple Podcasts Connect** at https://podcastsconnect.apple.com | 15 min | M7 (after Codex ships feed) |
| Mt11 | Submit feed URL to **Spotify for Podcasters** at https://podcasters.spotify.com | 5 min | M7 (after Codex ships feed) |
| Mt12 | Optional: Submit feed URL to **Pocket Casts** at https://pocketcasts.com/submit (auto-discovery is also possible) | 2 min | M7 (optional) |
| Mt13 | After Apple/Spotify ingest the show, copy the show URL from each platform; paste into site config so M2 menu items work | 5 min | After Mt10/Mt11 (24-48h after submission) |

Total Mårten time: **~30 minutes for M1**, **~15-25 minutes for M7** (mostly waiting for platform approval, not active work). Active work ~45 min total across all milestones.

### Codex's tasks

Codex starts M1 immediately. Initial work uses mocked API for unit tests. Live integration tests need Mt3 done. Production deploy of M1 needs Mt7 done. M2–M6 only need Mt7 if not already provided.

---

# Milestone 1 — Audio + alignment generation pipeline

**Effort:** 1 day · **Validation:** files exist on disk, MP3 plays when opened directly, JSON has well-formed alignment data

## Goal

Build-time pipeline that generates MP3 + word-level alignment JSON for every article. Pure backend infrastructure; no UI in this milestone.

## Acceptance criteria

1. `npm run build` runs an Astro integration that scans `src/content/blog/*.md`, hashes each article body, and calls ElevenLabs `/v1/text-to-speech/<voice_id>/with-timestamps` for new or changed articles
2. Generated MP3 saved to `public/audio/<slug>-read-<contentHash>.mp3`
3. Alignment data is **aggregated character-level → word-level at build time** and saved to `public/audio/<slug>-read-<contentHash>.json`
4. Cache hit on hash match — unchanged articles skip the API call
5. Long articles (>5000 chars) are chunked at paragraph boundaries; per-chunk alignments are time-shifted and merged into one JSON; MP3s concatenated via ffmpeg with 0.3s silence between chunks
6. Env vars: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `MAX_AUDIO_PER_BUILD` (default 10 — runaway cost guard)
7. Missing API key → build skips audio generation gracefully with warning, doesn't fail
8. Backfill script `npm run audio:backfill` generates audio + alignment for all 87 existing posts (idempotent)
9. README documents setup steps for Mårten

## Files affected

**New:** `src/integrations/astro-elevenlabs.ts`, `scripts/audio-backfill.mjs`, `.env.example`
**Modified:** `astro.config.mjs`, `package.json`, `README.md`

## Implementation notes

### API surface

```
POST /v1/text-to-speech/<voice_id>/with-timestamps
  body: { text: "...", model_id: "eleven_multilingual_v2" }
  response: { audio_base64, alignment: { characters[], character_start_times_seconds[], character_end_times_seconds[] } }
```

### Word aggregation

Walk characters; non-whitespace accumulates into the current word; whitespace/punctuation flushes the word with its start (first char start time) and end (last char end time). Save:

```json
{ "words": [{"text": "...", "start": 0.05, "end": 0.42}, ...] }
```

### Body extraction

Strip Markdown via `remark-strip-markdown` before sending to TTS. Convert headings to natural prose breaks (extra `.`).

### Cache

Hash plain stripped text via SHA-256. Filenames include short hash. Skip API call if both MP3 and JSON files exist.

## Done gate

✅ Codex deploys this milestone. Site continues to work normally; audio files exist but are not yet linked from UI. Mårten verifies by opening `https://whiteport.com/audio/<slug>-read-<hash>.mp3` directly in browser.

---

# Milestone 2 — Custom audio player with waveform + menu

**Effort:** 1 day · **Validation:** open any blog post, see the designed player at the top with waveform; click play, audio plays; click anywhere on the waveform, audio seeks there; click the three-dot menu, see Spotify / Apple / Download options

## Goal

A purpose-built audio player visible at the top of every article. Reflects the design Mårten sketched: play button, waveform display, volume control, three-dot menu with platform links and download. Replaces the basic HTML audio approach with a designed component while keeping all the platform integrations (CarPlay, lock screen, AirPods).

## Player layout

```
[ ⏵ ]  ‖▏▕‖▏▕‖▎▏‖▏▕‖▏▕‖▏▕‖▎▏‖▏▕‖    🔊 ━━●━━   ⋯
 play     waveform (visible progress, click to seek)   vol  slider   menu
```

Three-dot menu opens upward with three items:
- **Listen on Spotify** (link to the article's Spotify episode — hidden if URL not yet known)
- **Listen on Apple Podcasts** (link — hidden if URL not yet known)
- **Download MP3** (always available — direct link to the MP3 file)

## Acceptance criteria

1. New `src/components/AudioPlayer.astro` component implements the full layout above
2. Uses a lightweight waveform library — recommended: **wavesurfer.js** (~40 KB minified). Sets `responsive: true`, computes peaks on the fly from the MP3 (no precomputed peaks needed for v1)
3. Play/pause button toggles audio playback; icon swaps between ⏵ and ⏸
4. Waveform shows the full duration; played portion is visually distinct from unplayed (e.g., color contrast)
5. Click anywhere on the waveform seeks audio to that point
6. Volume control: speaker icon + slider (or speaker icon that opens a slider on hover/tap). Mute toggle on icon click.
7. Three-dot menu (`⋯`) opens a dropdown with: Listen on Spotify, Listen on Apple Podcasts, Download MP3
8. Menu items conditionally render based on article frontmatter:
   - `frontmatter.podcast?.spotify_url` → show Spotify link
   - `frontmatter.podcast?.apple_url` → show Apple link
   - Download MP3 always shown — links to `/audio/<slug>-read-<hash>.mp3`
9. If neither Spotify nor Apple URL exists yet (typical for V1), only Download appears in menu — no empty section, no placeholders
10. Player loads `/audio/<slug>-read-<hash>.mp3` based on article slug + body hash
11. If no MP3 exists for the article, player area is hidden — no broken state
12. Audio does NOT auto-play (accessibility)
13. Audio respects `prefers-reduced-motion` — waveform animation reduces or disables
14. **Underlying playback uses native `<audio>` element** (wavesurfer.js wraps it). This preserves CarPlay/Bluetooth/lock-screen/AirPods integration — non-negotiable.
15. Works on iOS Safari, Chrome, Firefox
16. Player is keyboard navigable: Tab moves focus across controls, Space plays/pauses, Arrow keys for waveform scrub, Enter activates menu items
17. Screen-reader friendly: ARIA labels on play button, waveform, volume, menu

## Files affected

**New:**
- `src/components/AudioPlayer.astro` — the player component
- `src/scripts/audio-player.client.ts` — wavesurfer init + menu logic
- `src/styles/audio-player.css` (or section in global.css) — player styling

**Modified:**
- `src/layouts/BlogPost.astro` — embed `<AudioPlayer />`
- `package.json` — add wavesurfer.js dependency

## Implementation notes

### wavesurfer.js setup

```typescript
import WaveSurfer from 'wavesurfer.js';

const ws = WaveSurfer.create({
  container: '#waveform-' + slug,
  waveColor: 'rgba(120, 120, 120, 0.6)',
  progressColor: 'rgba(40, 40, 40, 0.9)',
  height: 32,
  cursorWidth: 1,
  responsive: true,
  // Use a hidden native <audio> element so iOS lock-screen + CarPlay still work:
  media: document.querySelector('audio#audio-' + slug),
});
```

The `media` option tells wavesurfer to wrap an existing `<audio>` element instead of creating its own. Critical: keeps the native element in the DOM, so iOS picks it up for lock-screen / CarPlay / Bluetooth controls.

### Menu component

Standard dropdown pattern. Click outside closes menu; Escape closes menu. Keep menu items as simple anchor links (`<a href>`) so they work without JS too.

### Conditional menu items (from frontmatter)

```yaml
# Article frontmatter — populated later by podcast WO; absent for now
podcast:
  spotify_url: https://open.spotify.com/episode/...
  apple_url: https://podcasts.apple.com/...
```

In Astro template:
```astro
{frontmatter.podcast?.spotify_url && <a href={frontmatter.podcast.spotify_url}>Listen on Spotify</a>}
{frontmatter.podcast?.apple_url && <a href={frontmatter.podcast.apple_url}>Listen on Apple Podcasts</a>}
<a href={`/audio/${slug}-read-${hash}.mp3`} download>Download MP3</a>
```

### Styling

Match the design system. Pill-shaped player container, subtle rounded corners. Suggested base colors: light gray background, charcoal play button, accent color (Whiteport brand) for the played-portion of waveform. Final palette per Mårten.

## Done gate

✅ Users see the designed player on every article. Audio plays via native `<audio>`, so CarPlay etc. work. Sync features still missing — those are M3–M6.

---

# Milestone 3 — Word-wrapping at build time

**Effort:** 3 h · **Validation:** view source on a blog post, see every word wrapped in `<span class="word" data-word-index="N">`. Visually unchanged for users.

## Goal

Prepare the article HTML for sync highlighting by wrapping every word in a span. **No client-side behavior in this milestone** — pure structural prep.

## Acceptance criteria

1. New rehype plugin (or Astro post-processor) wraps every word in article body in `<span class="word" data-word-index="N">`
2. Word index is sequential, matching the order words appear (and matching the order in alignment JSON)
3. Word-wrapping preserves all Markdown formatting — `<span>`s sit *inside* `<strong>`, `<em>`, `<a>`, `<h1-h6>`, etc.
4. Code blocks (`<pre>`, `<code>`), embedded images, scripts, styles are NOT word-wrapped
5. CSS rule `.word { /* invisible by default */ }` exists but does not change visual appearance
6. View-source on existing blog posts shows the spans correctly placed

## Files affected

**New:** `src/utils/word-wrap.ts` (rehype plugin or post-processor)
**Modified:** `src/layouts/BlogPost.astro` (pipe rendered HTML through plugin), `src/styles/global.css` (add `.word` no-op rule)

## Implementation notes

Use `unified` / `rehype` ecosystem — already in Astro stack. Walk text nodes; skip if parent is `pre`/`code`/`style`/`script`. Replace each text node with sequence of text + `<span>` elements per word.

## Done gate

✅ Article HTML is structurally ready for highlighting. No visible change to readers. M4 wires the behavior.

---

# Milestone 4 — Highlight current word

**Effort:** 2 h · **Validation:** play audio on a blog post, see current word highlighted; highlight moves through text as voice progresses

## Goal

Light up the current word as audio plays. No scroll, no click — just the visual highlight.

## Acceptance criteria

1. New `src/scripts/audio-sync.client.ts` (Astro client script) loads the alignment JSON for the playing article
2. On audio `timeupdate` event, JS finds the current word index via binary search on alignment timestamps
3. Adds `.speaking` class to current word's span; removes from previous
4. CSS for `.speaking` highlights subtly (suggest `background-color: rgba(254, 240, 138, 0.6)` — yellow-200 with alpha; final styling per Mårten's taste)
5. Transitions smoothly (~100ms) between words; respects `prefers-reduced-motion` (no transition)
6. If alignment JSON fails to load, audio still plays normally — no errors thrown

## Files affected

**New:** `src/scripts/audio-sync.client.ts`
**Modified:** `src/components/AudioPlayer.astro` (extend or create `SyncedAudioPlayer.astro` that loads the script and exposes alignment URL), `src/styles/global.css` (add `.word.speaking` rule)

## Implementation notes

```typescript
const audio = document.querySelector('audio');
const alignment = await fetch(audio.dataset.alignmentUrl).then(r => r.json());
const words = document.querySelectorAll('.word');
let lastIndex = -1;

audio.addEventListener('timeupdate', () => {
  const i = findWordIndex(alignment.words, audio.currentTime);
  if (i !== lastIndex) {
    words[lastIndex]?.classList.remove('speaking');
    words[i]?.classList.add('speaking');
    lastIndex = i;
  }
});
```

Keep client script under 2 KB minified.

## Done gate

✅ Bimodal highlighting works. Page does not yet scroll to follow. Click-to-seek not yet wired.

---

# Milestone 5 — Smooth auto-scroll to follow highlight

**Effort:** 3 h · **Validation:** play a long article, page smoothly scrolls to keep current word in upper third of viewport; manual scroll pauses auto-scroll for ~3 sec

## Goal

Page automatically scrolls so the current word stays visible. Yields cleanly to user manual scroll.

## Acceptance criteria

1. When highlight moves to a word that is outside the comfortable viewing area (above viewport, or in lower half), page smoothly scrolls so the word lands in upper third
2. Smooth scroll uses `scrollIntoView({ behavior: 'smooth', block: 'center' })` or equivalent
3. If user manually scrolls (wheel, touchmove), auto-scroll pauses for 3 seconds before resuming
4. Respects `prefers-reduced-motion` — disables `behavior: 'smooth'`, uses instant scroll instead (or no scroll if word already in viewport)
5. No jank on long articles (10k+ words) — scroll calls don't fire on every `timeupdate`, only on word-change events

## Files affected

**Modified:** `src/scripts/audio-sync.client.ts`

## Implementation notes

```typescript
let manualScrollUntil = 0;
window.addEventListener('wheel', () => { manualScrollUntil = Date.now() + 3000; }, { passive: true });
window.addEventListener('touchmove', () => { manualScrollUntil = Date.now() + 3000; }, { passive: true });

function scrollWordIntoView(word) {
  if (!word || Date.now() < manualScrollUntil) return;
  const rect = word.getBoundingClientRect();
  const targetTop = window.innerHeight / 3;
  if (rect.top < 0 || rect.top > targetTop * 2) {
    word.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
```

## Done gate

✅ Long articles work pleasantly — current word always visible, page doesn't fight your manual scroll.

---

# Milestone 6 — Click-to-seek

**Effort:** 2 h · **Validation:** click any word in the article, audio jumps to that word and starts playing

## Goal

Tapping any word in the article seeks the audio to that word and plays.

## Acceptance criteria

1. Clicking any `.word` span seeks `audio.currentTime` to `alignment.words[wordIndex].start`
2. Audio plays after seek (calls `audio.play()`)
3. Cursor on `.word` becomes `pointer` to indicate clickability
4. Subtle hover state on `.word` (optional, e.g. slight underline or background change) so words look interactive
5. Works on touch devices — tap counts as click
6. Doesn't interfere with text selection (e.g. holding click + drag still selects text)

## Files affected

**Modified:** `src/scripts/audio-sync.client.ts`, `src/styles/global.css` (cursor + optional hover)

## Implementation notes

```typescript
words.forEach((w, i) => {
  w.addEventListener('click', (e) => {
    // Don't seek if user is selecting text
    if (window.getSelection().toString().length > 0) return;
    audio.currentTime = alignment.words[i].start;
    audio.play();
  });
});
```

## Done gate

✅ On-site bimodal read-along complete: highlight + scroll + click-to-seek all working. M7 still ahead — distribute via podcast platforms.

---

# Milestone 7 — Podcast feed + platform distribution

**Effort:** ½ day · **Validation:** open Spotify or Apple Podcasts, search "Whiteport", see the show; latest article appears as an episode within 24–48h of publishing

## Goal

The same MP3 that plays on the website is also distributed as a podcast. Whiteport's podcast appears in Spotify, Apple Podcasts, Pocket Casts, and any other podcast app. Every new article published automatically appears as an episode — no manual upload per article.

This makes the M2 menu items real: clicking "Listen on Spotify" or "Listen on Apple Podcasts" actually opens the show in those apps.

## Acceptance criteria

1. Astro generates `/podcast.xml` (RSS feed) from blog articles that have audio in `public/audio/`
2. Feed includes proper iTunes/Apple namespace tags: `<itunes:author>`, `<itunes:summary>`, `<itunes:image>`, `<itunes:category>`, `<itunes:explicit>`, `<itunes:duration>` per episode, etc.
3. Each episode element includes:
   - `<title>` — article title
   - `<description>` / `<itunes:summary>` — article excerpt
   - `<pubDate>` — article publishDate
   - `<enclosure url="..." type="audio/mpeg" length="..." />` — direct MP3 URL + byte length
   - `<guid>` — stable per article (use slug)
   - `<itunes:duration>` — duration in MM:SS or HH:MM:SS
4. Podcast-level metadata configured in site config or new `podcast.config.ts`:
   - Title (e.g., "Whiteport — Designed for the AI era")
   - Description (3–5 sentences)
   - Author (Mårten Angner)
   - Language (initially `en`, adapt for SV later)
   - Categories (`Technology` primary, `Business` secondary suggested)
   - Cover art URL (provided by Mårten via Mt8)
   - Owner email (Mårten's email)
   - Explicit flag: false
   - Copyright
5. Feed validates clean with **Castfeedvalidator** (https://castfeedvalidator.com) or **Podbase Validator**
6. Feed served at `https://whiteport.com/podcast.xml` with correct `Content-Type: application/rss+xml`
7. Sitemap and RSS index updated to include podcast feed link
8. After Mårten submits to platforms (Mt10–Mt12) and platforms ingest, Mårten copies show URLs into site config:
   ```yaml
   # podcast.config.ts or similar
   podcast:
     spotify_show_url: "https://open.spotify.com/show/<id>"
     apple_show_url: "https://podcasts.apple.com/.../id<id>"
     pocketcasts_show_url: "https://pca.st/<slug>"  # optional
   ```
9. M2 menu items now use these URLs:
   - "Listen on Spotify" → `podcast.spotify_show_url` (opens the show; users find the episode they want)
   - "Listen on Apple Podcasts" → `podcast.apple_show_url`
10. Documentation in README explains the submission process for future reference

## Files affected

**New:**
- `src/pages/podcast.xml.ts` — Astro endpoint that renders the RSS feed
- `podcast.config.ts` (or section in existing config) — podcast-level metadata

**Modified:**
- `src/components/AudioPlayer.astro` — pull menu URLs from podcast config (replacing the per-article frontmatter assumption from M2; per-article URLs can come later when we have them per-episode)
- `README.md` — document submission process

## Implementation notes

### Per-episode duration

`<itunes:duration>` is required for proper Apple ingestion. Compute at build time using `ffprobe` (already available with ffmpeg) or `music-metadata` Node package. Cache duration per content hash so we don't recompute on every build.

### Per-episode artwork (optional v2)

Apple supports per-episode artwork. For v1, all episodes inherit the show-level cover art. Per-episode artwork can come later when articles have heroes worth featuring.

### Show URLs vs episode URLs

For v1, the menu items link to the **show** URL — listener opens Spotify, sees the show, finds the episode. Direct per-episode URLs would require either:
- Fetching from Spotify/Apple APIs after ingestion (adds complexity)
- Hand-curating per article (defeats automation)

Show-level links are the standard pattern for podcast site embeds. Defer per-episode linking to a future enhancement.

### Music intros/outros

**Out of scope for this milestone.** Currently the podcast episodes are the same audio as the on-site read-aloud — no music intros, no voice intros, no outros. This is a clean v1.

A future enhancement (separate WO later) can add: per-episode voice intro using article title, music bookends, professional polish. The architecture supports this without disrupting M1–M7 — the build can swap in the composed audio file once that work happens.

### Submission timing

After Codex ships M7 and the feed validates, Mårten submits to platforms (Mt10–Mt12). Apple typically takes 24–48h to approve and ingest. Spotify is usually <12h. Pocket Casts auto-discovers once one of the others has the feed.

Mårten can preview the feed locally with `npm run dev` and validate before submitting.

## Done gate

✅ Whiteport podcast is live in Spotify, Apple Podcasts, Pocket Casts. New articles auto-appear as episodes. M2 menu items in the player work end-to-end. The "people can view my podcast in their environments" experience is real.

---

# Milestone 8 — Release build media blocker cleanup

**Effort:** 3 h · **Validation:** production builds stay strict by default, audio backfills can run without being blocked by unrelated missing GDrive/WP media, and all known missing media references are triaged.

## Goal

Resolve the existing `astro-gdrive` media gate that blocks full builds when legacy Google Drive or WordPress media cannot be downloaded. This is release hygiene for the Listen To Me track: audio generation should not be blocked by unrelated media debt, but production builds should still fail when required media is genuinely broken.

## Acceptance criteria

1. `scripts/audio-backfill.mjs` defaults `GDRIVE_STRICT=false` so `npm run audio:backfill` can generate audio even when unrelated media references are unavailable
2. Normal production builds keep `astro-gdrive` strict by default
3. Failed media from the current build is triaged into:
   - Google Drive access/share failures
   - WordPress 404 migration failures
   - intentionally removed or obsolete content references
4. Google Drive failures are fixed by sharing files with the service account, correcting IDs, or removing stale references
5. WordPress 404 failures are fixed by replacing the source asset, updating the content reference, or intentionally marking the item as accepted missing content
6. If WordPress migration debt remains, `astro-gdrive` supports a separate opt-out such as `WP_MEDIA_STRICT=false` so legacy WP 404s do not mask true Google Drive access failures
7. README documents the difference between:
   - `GDRIVE_STRICT=false` for intentionally bypassing all media strictness
   - `WP_MEDIA_STRICT=false` for legacy WP migration debt only, if implemented
8. `npm run build` succeeds in the intended production mode once triage/fixes are complete

## Files affected

**Likely modified:** `scripts/audio-backfill.mjs`, `src/integrations/astro-gdrive.ts`, `README.md`

**Content cleanup:** affected `src/content/blog/*.md` files with broken media references, only where the triage confirms the reference is stale or replaceable

## Implementation notes

- Keep this milestone separate from M1–M7. It is a build/release blocker, not an audio feature dependency.
- Do not weaken production media validation globally unless the missing media is explicitly accepted.
- Prefer a narrow `WP_MEDIA_STRICT=false` escape hatch over making all GDrive failures non-strict.
- The first pass should produce a concise list of failed media IDs/URLs and the chosen action for each one.

## Done gate

✅ Audio backfill is unblocked from unrelated media failures. Production builds remain strict for real media regressions. Known GDrive/WP failures are either fixed or explicitly documented as accepted legacy debt.

---

## External dependencies — overall

| Dependency | Required at... |
|------------|----------------|
| `ELEVENLABS_API_KEY` (Mt3) | M1 integration test |
| `ELEVENLABS_VOICE_ID` (Mt7) | M1 production deploy |
| Sharp (already installed) | M1 |
| `unified` / `rehype` (already in Astro stack) | M3 |
| wavesurfer.js (~40 KB) — new dependency | M2 |
| ffprobe (bundled with ffmpeg) — already used by M1 chunking | M7 |
| Cover art + podcast metadata (Mt8, Mt9) | M7 |
| Apple Podcasts Connect, Spotify for Podcasters submissions (Mt10–Mt12) | M7 |

Codex is NOT blocked from starting. Begin M1 immediately with mocked tests.

---

## Out of scope (explicit — do NOT do these)

- **Music intros/outros and dynamic per-episode voice intros** — these are a future enhancement (separate WO). M7 ships the same audio as the on-site read-aloud, no music. Enough for V1.
- **Per-episode direct links** (Spotify episode URL, Apple episode URL) — show-level links cover V1; per-episode requires platform API integration, defer.
- Bilingual audio (handled when SV articles exist) — separate language podcast feed comes when SV articles exist
- Custom waveform visualizations beyond what wavesurfer provides
- Sentence-level highlighting alternative
- Karaoke-style "trail" highlighting (current word + previous N words highlighted)
- Engagement tracking (audio play/pause events to analytics) — later WO
- Backfill of stream posts collection — only blog posts here

---

## Rollback plan — per milestone

| Milestone | Rollback |
|-----------|----------|
| M1 | Remove `astro-elevenlabs` from `astro.config.mjs`. Build still works, no audio generated. |
| M2 | Remove `<AudioPlayer />` from blog template. Audio files still exist, not visible. |
| M3 | Remove word-wrap rehype plugin from build. HTML reverts to original. |
| M4 | Disable `audio-sync.client.ts` via removing script tag. Audio plays normally, no highlight. |
| M5 | Remove the `scrollWordIntoView` call from sync script. Highlight works, no auto-scroll. |
| M6 | Remove the click handler from sync script. Everything else still works. |
| M7 | Remove `/podcast.xml` route. Existing platform listings keep working but stop receiving new episodes. To fully unpublish: contact Apple/Spotify support for show removal. |
| M8 | Revert `astro-gdrive` strictness changes and `audio-backfill` env defaults. Restore any intentionally changed content media references from git if needed. |

All rollbacks <5 min except content cleanup in M8, which depends on the number of media references changed. M1–M6 are purely additive — fully reversible. M7 is harder to fully reverse once a podcast is on Apple/Spotify (removal goes through their support process).

---

## Notes for Codex

- **Ship each milestone individually.** Don't bundle them. Deploy M1, validate, then start M2.
- Native `<audio controls>`, not a custom player — gives free CarPlay/lockscreen/AirPods integration
- Player should NOT auto-play (accessibility)
- Respect `prefers-reduced-motion` everywhere applicable
- Match existing code style in `src/integrations/astro-gdrive.ts` (precedent for build-time integrations)
- Reuse `unified`/`rehype` ecosystem — don't add new HTML parsers
- Keep client-side JS in M4–M6 minimal — total <5 KB minified
- Commit MP3s + JSONs to repo only if total <50 MB; else gitignore + rely on CI regen
- Use `node-fetch` or native `fetch` (Node 18+); avoid heavy SDK deps unless ElevenLabs's official SDK is markedly cleaner

After each milestone, update `design-process/_progress/design-log.md`:
- `[x] WO-001 M1 — Audio + alignment generation pipeline`
- `[x] WO-001 M2 — Custom audio player with waveform + menu`
- `[x] WO-001 M3 — Word-wrapping at build time`
- `[x] WO-001 M4 — Highlight current word`
- `[x] WO-001 M5 — Smooth auto-scroll`
- `[x] WO-001 M6 — Click-to-seek`
- `[x] WO-001 M7 — Podcast feed + platform distribution`
- `[x] WO-001 M8 — Release build media blocker cleanup`

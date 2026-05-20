# Whiteport Publishing Pipeline

**Status:** Architecture complete · Ready for work-order generation
**Last updated:** 2026-05-02
**Owner:** Mårten Angner
**Operator persona:** Ivonne — Russian ballet teacher tone (non-negotiable on cadence and craft)

---

## Vision

A **publishing platform** owned by Whiteport that turns one long-form article into a complete content cycle: blog post + audio + video + 10 social derivatives across 6 accounts in 2 languages — orchestrated by Ivonne, triggered from phone or desktop, fully reviewable before going live.

The platform is **mobile-first for authoring, desktop-required for social posting** (Claude-in-Chrome handles what Meta blocks bots from doing). Every layer is decoupled: any AI can interact with the system, any post can be triggered or rebalanced without breaking the queue.

---

## Architectural principles

### 1. The system is scripted. The agent is AI.

The publishing system has no AI inside it. It is a deterministic CMS + scheduler + build pipeline + stats collector. The **agent (Ivonne)** is a separate layer that calls the system's APIs to read state, write changes, and converse with Mårten. If the agent layer disappears, the platform still publishes — Mårten falls back to the admin UI.

### 2. Bring Your Own AI (BYOAI)

The system has no Anthropic / OpenAI keys. Any agent runtime — Claude Code on desktop, Claude app on phone, Codex, future models — can interact with the system. AI cost is the user's existing subscription, not platform overhead. Different AIs can handle different tasks based on style preference (e.g., Claude for prose, Codex for code).

### 3. Three layers, fully decoupled

| Layer | Role | Contains |
|-------|------|----------|
| **Authoring & interaction** | Where Mårten works (and Ivonne lives) | Phone, desktop, voice, admin UI |
| **The system** | Durable infrastructure | Supabase database, Edge Functions (scripted, no AI), admin UI, build pipeline, scheduler, stats collectors |
| **Output printers** | Surface the work to the world | (1) Astro + Hostup → blog, (2) Claude-in-Chrome → social posts |

### 4. Public-facing URL is canonical

Every article has a public URL the moment it's saved (`https://astro.whiteport.com/<slug>/`) — `noindex` while STAGED, `noindex` removed when PUBLISHED. The URL is permanent through state changes. Mårten can listen to drafts before deciding to publish.

### 5. Dynamic queue, hard rules

The schedule is a derived output of constraints, not a static plan. New article? Inspiration mid-day? Reschedule? The system reflows the queue while enforcing cadence rules, visual rhythm, article spacing, and bilingual flip windows. Always honors integrity.

---

## Content model

### One article generates 26 touchpoints over 19 days

```
ONE ARTICLE
   │
   ├──[ EN cycle ]──────────────────────────────────────
   │      │
   │      ├── Day 0:   Article + voice-clone audio        (1 blog post)
   │      ├── Day 0+:  NotebookLM video discussion         (1 blog post)
   │      └── Days 1–5: 5 social derivatives × 6 accounts  (30 social touchpoints)
   │
   └──[ SV cycle, +14 days ]────────────────────────────
          │
          ├── Day 14:  Article + voice-clone audio (SV)    (1 blog post)
          ├── Day 14+: NotebookLM video discussion (SV)    (1 blog post)
          └── Days 15–19: 5 social derivatives × 6 accounts (30 social touchpoints)
```

Total per article: **4 blog posts + 60 social touchpoints**, all anchored to one canonical piece of writing.

### Derivative pattern (5 per language)

| # | Default angle | Default visual |
|---|--------------|---------------|
| d1 | Leadership / value implication | 📊 Graphic |
| d2 | Tech detail / "how it works" | 📷 Photo |
| d3 | Results / outcome | 📊 Graphic |
| d4 | Behind-the-scenes / process | 📷 Photo |
| d5 | Provocation / quote / hot take | 📊 Graphic |

Visual alternates by default — Ivonne enforces this rhythm when scheduling across articles in the interleaved feed. Manual overrides allowed.

### Image reuse (50% cost saving)

Same images used for both EN and SV cycles. Audience overlap is small and the 14-day gap covers any regulars.

### 6-account social distribution

```
1. Mårten LinkedIn personal      ← origin post
2. Whiteport LinkedIn page       ← repost from #1
3. Whiteport Facebook page       ← published with Mårten personal as collaborator
4. Mårten Facebook personal      ← collaborator on #3 (auto-cross-posts to feed)
5. @whiteport Instagram          ← published with @martenangner as collaborator
6. Mårten Instagram personal     ← collaborator on #5 (auto-cross-posts after accept)
```

Steps 4 and 6 require Mårten to tap "Accept" on phone notifications (~2 taps total).

---

## State machines

### Article states

```
DRAFT ──[admin save]──▶ STAGED ──[first publish trigger]──▶ PUBLISHED
        in DB           public URL,                          public URL,
        no URL          noindex                              indexable
```

`STAGED` is the **listenable draft state** — Mårten can hear his own article before deciding to publish.

### Derivative (social post) states

```
QUEUED ──[trigger]──▶ EXECUTING ──[done]──▶ PUBLISHED
        in queue,     Ivonne                live on platform,
        not posted    orchestrating         engagement tracked
```

A derivative can sit in QUEUED indefinitely. Triggering can be:

- **Manual:** Mårten says "publish now"
- **Scheduled:** cron fires at the assigned time
- **Both flow through the same execution path**

### First derivative is the article publish trigger

When the **first derivative** of a STAGED article is triggered, the article transitions STAGED → PUBLISHED automatically. Subsequent derivatives don't change article state. This means: pushing to social and going public are linked in one decision.

---

## Dynamic queue

### Hard constraints (system always enforces)

- **Cadence:** minimum 5 posts/week (configurable), no two consecutive missed days
- **Spacing:** no two posts within 4 hours
- **Visual rhythm:** alternate photo / graphic across the feed
- **Article spacing:** don't cluster same article on consecutive days
- **Bilingual flip:** SV cycle starts ~14 days after EN cycle
- **Time-of-day:** prefer 09:00–11:00 weekdays for LinkedIn (configurable per platform)

### Behavior when something changes

| Event | System response |
|-------|----------------|
| New article added | Find slots for 5 derivatives, balance against existing queue |
| "Publish now" requested | Move first derivative to immediate; reflow downstream |
| Derivative deleted | Close gap; nothing else moves unless cadence breaks |
| Article unpublished | Pull URL behind noindex; archive engagement; queue paused |
| Constraint can't be satisfied | Surface to Ivonne: *"can't fit, need to skip Wednesday or move article B — your call"* |

The schedule is a derived view. It rebalances on every write. Integrity comes from the rule set, not from any specific schedule snapshot.

---

## User experience

### Mobile-first authoring (especially in-car)

Authoring is fully phone-capable. **Mobile authoring is not a stripped-down secondary mode — it's a first-class production surface.** Mårten authors regularly in two contexts:

- **Desktop sessions** at the computer (focused work)
- **In-car sessions** while driving (a multi-hour window that would otherwise be wasted on YouTube)

The in-car window is genuinely high-yield because Mårten is dyslexic — speaking ideas is faster than typing, and listening back catches what reading silently misses. The system must make voice-driven authoring a primary surface, not an afterthought.

Capabilities:
- Write articles in Working Copy / Files (Markdown via admin UI) on phone
- Voice-author via Claude app or iOS Shortcut → article drafted into the system
- Listen to drafts via the article's STAGED URL — audio plays over CarPlay/Bluetooth
- Iterate by voice ("rewrite paragraph 3 punchier") and listen to the new version
- Trigger publish from admin UI on phone when ready

### Desktop-only social execution

Claude-in-Chrome runs on Mårten's desktop because Meta and LinkedIn block headless browsers but accept his real, logged-in browser. Desktop must be on when scheduled posts fire (Mårten is at his computer daily, so this is fine).

### Hybrid auto + manual orchestration

Most steps automate. Some need 1–2 taps from Mårten:
- Accept FB collaborator invite
- Accept IG collaborator invite
- LinkedIn page repost (login switch)
- Approving thoughtful comment replies before they post

Ivonne **always tells Mårten what to do, where, and how long it'll take** — never vague. Example:
> *"Today: derivative 2 of Figma. ~7 min of you. I handle 4 of 6 steps automatically. You handle: tap collab invites (1 min), reply to first comment when it lands (~5 min)."*

### Voice for accessibility (dyslexia)

Mårten is dyslexic. Audio is a genuine accessibility tool, not polish. Every article has a `▶ Listen` button at the top, audio rendered in his ElevenLabs voice clone. He listens to his own drafts before publishing — both for review and because hearing prose catches what reading silently misses.

---

## Visual UX

### Per-article timeline

When an article is open in admin, see its full 19-day fan-out:

```
"MCP Sucks. I Deleted Them All."                    Status: live ●

EN CYCLE
●─────●─────●─────●─────●─────●
HERO   d1     d2     d3     d4     d5
📰🎙📹  📷LI   📷LI   📷LI   📷LI   📷LI
✅live ⏰sched ⏰sched ⏰sched ⏰sched ⏰sched

  ── 8 day pause ──

SV CYCLE
○─────○─────○─────○─────○─────○
HERO   d1     d2     d3     d4     d5
📰🎙📹  📷reuse 📷reuse 📷reuse 📷reuse 📷reuse
📝draft 📝draft 📝draft 📝draft 📝draft 📝draft

ENGAGEMENT
Article EN:  1.2k views · 47 comments · 8 reposts
D1 EN:       LI 234 ♥ · FB 12 ♥ · IG 89 ♥
```

### Multi-article calendar

All articles' touchpoints overlay, color-coded by article:

```
        Mon       Tue       Wed       Thu       Fri
May 2   🟦📊HERO  🟦📷d1    🟧📊HERO  🟧📷d1    🟦📊d2
May 9   🟦📷d3    🟧📊d3    🟢📊HERO  🟢📷d1    🟦📊d4
May 16  🟦📊HERO📘 🟢📊d3   🟦📷d1📘  🟢📷d4    🟦📊d2📘
                  (SV)              (SV)              (SV)
```

🟦/🟧/🟢 = different articles · 📊 = graphic · 📷 = photo · 📘 = SV cycle marker

Drag-to-reschedule on phone or desktop. Constraint violations surface immediately.

### Visual post dashboard (relationship view)

A fourth view in the admin UI, complementing the calendar and timeline. Shows the **relationship graph** of all articles and their derivatives — not time-ordered, but structurally:

```
   ┌── Article A ─────────────────────────────┐
   │                                          │
   │  [d1]──[d2]──[d3]──[d4]──[d5]            │
   │   📷    📊    📷    📊    📷             │
   │   ✅    ⏰    ⏰    📝    📝             │
   │                                          │
   └──────────────────────────────────────────┘

   ┌── Article B ─────────────────────────────┐
   │                                          │
   │  [d1]──[d2]──[d3]──[d4]──[d5]            │
   │                                          │
   └──────────────────────────────────────────┘

   (drag any node to reorder; click to open in new tab)
```

- Each node = one publishable item (article or derivative)
- Connections show the article→derivative relationships
- Drag-and-drop reorders the publishing sequence (system reschedules with constraints)
- Click any node opens the editor in a new browser tab
- Color, status icons, and visual-type icons mirror the calendar conventions

This is the "see your whole content engine at once" view. The calendar shows *when*; the dashboard shows *what relates to what*.

### Google Calendar mirror

The publishing schedule mirrors to Mårten's actual Google Calendar (a dedicated "Whiteport Publishing" calendar). Every scheduled article publish + every derivative becomes a real calendar event:

- System creates events on Google Calendar via the Calendar API
- Reschedules in the system → Calendar events move automatically
- Color-coded per article (matches admin UI calendar colors)
- Event description contains: article title, derivative #, target platforms, manual time estimate
- Clicking the event in Google Calendar opens the admin URL for that item

Two-way sync (v2): if Mårten drags an event in Google Calendar, the system picks up the change and re-validates against constraints. If the move violates rules, the system pings Ivonne to confirm or auto-rebalance.

So the publishing schedule lives in three synchronized places: admin calendar UI, visual dashboard, and Google Calendar.

### Engagement chips on the public article

Each article displays an "Also posted on:" section with platform chips that show live engagement:

```
[in linkedin   234 ♥  ▼]   [f facebook  18 ♥  ▼]   [📷 instagram  89 ♥  ▼]
```

Click to expand → shows every social post that referenced this article, with per-post engagement, links, and totals. Provides social proof for new readers and visibility into the article's life cycle.

---

## The "inspiration loop" — mid-dialog publishing

The system is designed to absorb spontaneous creativity without breaking integrity:

```
You (mid-conversation about something else):
  "Wait — I want to write about X. Now."

Agent (any AI runtime):
  Drafts article in 90 sec. Saves to system as DRAFT.
  Calls /calendar/impact?article=<new>&publish=now
  
  Returns:
  • Article would publish today (~60 sec build)
  • 5 new derivatives need slots over 5 days
  • Conflict: tomorrow's planned post would create photo→photo
  • Suggested rebalance: bump Figma-d2 to Friday

You:
  Listens to draft via voice clone, approves.

Agent:
  Triggers publish. Article live in 60 sec. Queue rebalanced.
```

The whole cycle: **inspiration → live → queue intact in ~5 minutes**.

---

## What stays out

- Native iOS app (revisit only if PWA + Shortcuts genuinely insufficient after months of use)
- Meta Graph API direct integration (Claude-in-Chrome is more reliable for this stack)
- Puppeteer cloud automation (Meta blocks datacenter IPs)
- AI inside the platform itself (BYOAI principle)
- Per-platform image variants for V1 (square IG, landscape LI) — wait until manual workflow is painful

---

## See also

- [`project-brief.md`](project-brief.md) — original whiteport.com migration brief (this publishing pipeline is the next phase)
- [`platform-requirements.md`](platform-requirements.md) — full functional + technical requirements + phased build plan
- `martens-documents/Planning/Projects/publishing-pipeline-roadmap.md` — earlier exploratory roadmap, superseded by this + requirements doc

# Discord

**Category:** Community / Communication
**Purpose:** Community engagement, WDS visibility, support channel, real-time collaboration
**Website:** <https://discord.com>

---

## What It Is

Discord is a chat platform organized around servers and channels. For WDS it serves as:

- **Community hub** — place for designers and builders using WDS/BMAD to hang out
- **Support channel** — users ask questions, report issues, share patterns
- **Broadcast channel** — WDS updates, release notes, demo links
- **Listening post** — where Whiteport learns what the community actually needs

---

## Why WDS Uses It

- Lower friction than GitHub issues for early-stage feedback
- Real-time presence — you see who's active, what's being built
- Threaded conversations keep topics organized
- Free, widely adopted in design and dev communities
- Bots and webhooks enable automation (posting, scanning, moderation)

---

## Current Status

**No bot or MCP server active yet.** Access is manual via browser.

The `discord` skill (in `whiteport-team/.claude/skills/discord/`) automates browser-based scanning via Claude in Chrome as an interim solution.

---

## Setup Instructions

### 1. Account & Servers

1. Create Discord account at <https://discord.com>
2. Join relevant servers:
   - Whiteport / WDS community server (primary)
   - BMAD community (if applicable)
   - Anthropic / Claude Code community
   - Design systems communities Mårten participates in
3. Enable notifications only for mentions and DMs — not all channel activity

### 2. Server Structure (WDS community, recommended)

```
Whiteport / WDS
├── INFO
│   ├── #welcome
│   ├── #rules
│   └── #announcements
├── COMMUNITY
│   ├── #general
│   ├── #introductions
│   └── #showcase
├── WDS
│   ├── #help
│   ├── #feedback
│   ├── #feature-requests
│   └── #releases
├── BUILDING
│   ├── #agents
│   ├── #skills
│   ├── #design-space
│   └── #prompts
└── VOICE
    └── 🎤 Office Hours
```

### 3. Roles

- **@Whiteport** — Mårten + team (admin)
- **@Ambassador** — active community members who help newcomers
- **@WDS Builder** — anyone running WDS in a project
- **@Curious** — default role for new joiners

---

## Integration Paths

### A) Browser automation (now)

- Use the `discord` skill
- Requires Mårten logged in to Discord in the browser
- Works for scan / mentions / DMs
- Posting works but requires explicit confirmation

### B) Discord MCP (next)

Options to evaluate:

- **SaseQ/discord-mcp** — community MCP server, read/send messages
- **mcp-discord** — alternative implementation
- **Custom bot** — full control, integrates with Supabase + Design Space

Selection criteria:
- Read access (mentions, DMs, channel messages) must be reliable
- Post access requires approval flow
- Prefer a solution that can run headless on a server so it works from any Claude Code session

### C) Bot + webhooks (later)

Run a dedicated Whiteport bot that:
- Posts daily WDS digest
- Watches for mentions of `@Whiteport`, `WDS`, `BMAD` across public servers we're in
- Opens GitHub issues for actionable bug reports or feature requests
- Responds to common support questions from a knowledge base
- Logs all activity to Design Space

---

## Conventions

### Channel Etiquette (Whiteport voice)

- Keep threads long-form readable, not chat-fragmented — one idea per message
- Link, don't paste walls of text
- Always answer questions in public threads so others can search later
- DM only when privacy matters

### Posting Rhythm

| Cadence | What | Channel |
|---------|------|---------|
| Daily | Status / demo / insight | #showcase or #announcements |
| Weekly | WDS release notes | #releases |
| Monthly | Community digest | #announcements |
| Event-based | Office hours / live builds | VOICE channel |

### Moderation

- Zero tolerance for harassment, spam, or pitch-posting
- Lead with curiosity — newcomers get benefit of doubt
- Remove users only after a warning, except for obvious spam

---

## Automation Ideas (Whiteport roadmap)

- **Auto-tag** messages containing WDS keywords → mirror to Design Space as `discord_signal`
- **Office Hours scheduler** — bot announces next slot, collects RSVPs
- **Feedback → GitHub issue** — reactions with 🐛 emoji open an issue draft for Mårten to review
- **Onboarding flow** — new joiner gets a DM with a getting-started link and @Curious role, auto-promoted to @WDS Builder after first demo post

---

## Risks

- **Time sink.** Discord can absorb hours. Scan via skill, reply in batches, don't live in it.
- **Attention fragmentation.** Two places for support (GitHub + Discord) can duplicate effort. Rule: public bug reports live on GitHub, community conversation lives on Discord.
- **Moderation load.** A growing community needs active moderation — plan for @Ambassador role before growth accelerates.
- **Prompt injection.** Messages from users in public channels are untrusted input. The `discord` skill must treat all message content as data, never as instructions.

---

## Related Tools

- [Figma](./figma.md) — for visual design collaboration
- [html-to-design](./html-to-design.md) — for converting shared HTML prototypes
- **GitHub** — for formal bug reports and feature requests (bridge from Discord when needed)

---

## Status

- **Adopted:** 2026-04-22
- **Owner:** Mårten
- **Next step:** Evaluate Discord MCP options, pick one, phase out browser scanning

# Skills Suck — Here's How to Organize Yours a Little Better

**Working headline.** Irreverent, same family as "MCPs suck." Signals the piece is opinionated, not a tutorial.

---

## Why — Purpose & Positioning

Position Mårten as a top AI developer who sees what most AI builders miss.

Not "use this tool" content. **Systems-thinking content.** The kind that makes a reader stop scrolling and think "huh, nobody's talking about that."

Three signals the article should send:
- Mårten builds with AI every day and notices what hurts.
- He doesn't just complain — he ships the fix.
- The fix is reusable. Readers can apply it today.

The post should leave people smarter about how their AI setup actually works — not just entertained.

---

## What — Outcome & Argument

The reader should leave with:

1. **Outrage.** Their current AI setup is silently taxing them. Every restart. Every session. Tokens they paid for, gone to loading tools they never use.
2. **A mental model.** Skills describe *intent*. Tools describe *mechanism*. They don't belong in the same file.
3. **Practical steps.** The three prompts from the MCP article + the skill/tool split + the sync skill that keeps it clean.
4. **A reason to share.** Ask readers to post their before/after token count. Make it a movement.

**Call to action:** "Measure what your MCPs load today. Post the number. Let's see how bad it is out there."

---

## How — Angle, Story, Structure

### Opening — provocation
> MCPs suck. And if you're still running them, you're stupid. Here's why.

Same voice as the lessons-learned article. Punchy. Slightly rude. Earns the read.

### Story — the pain (relatable)
> You want to use a tool. Claude says "this MCP is not loaded, let me install it." You wait. You restart Claude. It didn't work. Restart again. Try again. Repeat.
>
> Do you know what just happened?
>
> Every MCP you have installed just loaded every one of its tools into your context — whether you asked for it or not. You paid for that before typing a single prompt.

### Primer — What you need to know about MCPs
Short. Three bullets max.
- What it is (Anthropic's Model Context Protocol, 2024).
- What it does (loads entire tool catalogs at startup).
- What it costs (27,000 tokens for me. 61,000 for a friend. And you pay again on every restart.)

### The real fix — not "use fewer MCPs"
This is the turn. The article isn't "delete your MCPs." It's:

> The problem isn't MCPs. It's that we mixed two different things into one file.
>
> **Skills describe intent.** What are you trying to accomplish.
> **Tools describe mechanism.** How the thing actually works.
>
> When you load them separately, your context stays clean. When you glue them together via a protocol, everything loads every time.

Diagram or example:
- Bad: one MCP server with 30 tools loaded whether you use them or not.
- Good: `skills/marketing/whiteport-post.md` calls `tools/hosting/whiteport-astro/` only when needed.

### The sync skill — the unlock
> Here's the piece nobody tells you about.
>
> When you split skills from tools, you need a way to keep them in sync across your machine, your agents, your repos. That's what the `sync` skill does — it's the one skill I'd install before anything else.

(Link to sync skill + quick explanation of what it does.)

### Practical steps
Mirror the MCP article's three-prompt structure:
1. **Measure.** *"How many tokens did my MCPs load at startup?"*
2. **Replace.** *"Build a script that does the same job without the protocol."*
3. **Organize.** *"Separate tools from skills so I stop reloading them into context every session."*

### Close — call to action
> Measure yours. Post the number. Tag #mcp-tax.
> Let's see how much of our paid context we've been giving away for free.

---

## Key Points (one-liners for social teasers)

- Every restart of Claude costs you 27,000 tokens before you've typed a word.
- MCPs are the AI industry's biggest invisible tax.
- Skills describe intent. Tools describe mechanism. Don't mix them.
- The sync skill is the one skill I'd install first.
- A posted token count beats an unposted opinion.

---

## Pillar

**Provocation** (primary) — challenges the default AI setup.
**Knowledge** (secondary) — actionable pattern readers can apply.

---

## Målgrupp

- AI builders and indie developers using Claude / Cursor / Claude Code.
- People running local AI setups who've hit MCP pain.
- Tech leaders evaluating cost of AI infrastructure.

---

## Storyline (beat sheet)

1. Hook — "MCPs suck"
2. Restart-hell story
3. Reveal — you just paid for 27,000 tokens you didn't ask for
4. MCP primer (3 bullets)
5. The turn — problem isn't MCPs, it's mixing intent with mechanism
6. Skills / tools split — with whiteport-post example
7. The sync skill — the unlock
8. Three prompts (measure / replace / organize)
9. CTA — post your number

---

## Källor & Länkar

- Previous article: `martens-documents/Marketing/posts/2026-04-20-mcp-servers-suck/post.md` (link when published)
- Proof: `whiteport-agent-space/skills/marketing/whiteport-post.md` — example skill
- Proof: `whiteport-agent-space/tools/hosting/whiteport-astro/tool.md` — example tool
- Sync skill — TODO: link to the sync skill file and/or an article about it
- Anthropic MCP announcement (Nov 2024) — for the primer

---

## Bilder vi behöver

- **Hero** — Chalkboard infographic. Visual concept: a cluttered "MCP" box stuffed with tools on one side, a clean "Skills → Tools" stack on the other. Title chalked across the top: "SKILLS SUCK" struck through with "ORGANIZE YOURS BETTER" underneath.
- **Diagram (optional)** — The three-layer stack: Skill (intent) → Tool (mechanism) → Service. Chalk style, minimal.
- **LinkedIn variant** — 1200×627 wide. Hero concept cropped / adapted.
- **Instagram variant** — 1080×1350 portrait. Hero concept centered.

---

## Open questions for Mårten

- **Title:** Is "Skills Suck — Here's How to Organize Yours a Little Better" the final voice, or do you want to test variants? (Alt: "Your AI Skills Are Lying to You," "Stop Loading. Start Referencing," "The Skill/Tool Split That Saved Me 27,000 Tokens.")
- **Sync skill link:** Where does the sync skill live? I didn't find a `/sync` skill in `whiteport-agent-space`. Is it the `sync.js` in the repo root, or a separate skill I should write up?
- **Diagram:** Do you want the three-layer stack diagram, or keep it all in words?
- **CTA hashtag:** `#mcp-tax`? `#mcp-detox`? Something else? Or no hashtag in the body at all (LinkedIn rule)?

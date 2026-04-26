---
title: "MCP Sucks. I Deleted Them All. So Should You."
publishDate: 2026-04-25T00:00:00.000Z
author: Marten Angner
categories:
  - ai
  - wds
  - engineering
tags:
  - mcp
  - claude-code
  - ai-agents
  - tokens
  - scripts
  - tooling
excerpt: "MCP servers load every tool into your context before you type a single prompt. Mine cost 27,000 tokens per session — here's what I did instead."
offers:
  - title: "Building with AI and hitting the same walls?"
    label: "For AI builders & engineering leads"
    description: "I help teams design AI workflows that don't bleed tokens or break on every restart. Book a free 30-min call and I'll show you how I run mine."
    cta: "Book a free consultation →"
    href: https://cal.com/whiteport
featuredImage:
  src: /images/blog/mcp-sucks/hero-portrait.webp
gallery:
  - src: /images/blog/mcp-sucks/hero-portrait.webp
    alt: "MCP Sucks graffiti on a concrete skatepark wall, stencil figure in shock, with the tag 'I deleted all of mine — and so should you'"
    type: image
    width: 1080
    height: 1350
    display:
      - gallery
      - share_image
      - archive
      - thumbnail
      - instagram
      - facebook
      - linkedin
---

I deleted every MCP server I had installed. Not because I gave up on AI tools. Because I found out what they were costing me — and nobody had told me.

You've been here. You ask your agent to do something and it says: *"This MCP is not loaded. Let me install it."* You wait. You restart Claude. It doesn't work. You restart again, edit a JSON file, fix a missing comma, restart once more. Twenty minutes later you've done nothing except fight your own setup.

😤 *That's annoying. But it's not the real problem.*

### What nobody tells you

Here's what was actually happening every time you restarted.

Every MCP server you had installed loaded its entire tool catalog into your conversation context at startup — every tool, every schema, every function description, whether you called them or not. I asked my agent to break it down. The answer came as a shock.

💸 *27,000 tokens. Gone before I typed a single word.*

I had been paying for that on every session, every restart, for months. A colleague ran the same check. His number was 61,000 tokens.

😠 You were not informed. You were taxed.

### What MCP actually is

MCP stands for Model Context Protocol. Anthropic released it in late 2024 as an open standard for connecting AI agents to external tools — databases, APIs, file systems, browsers. The promise was beautiful: one protocol, every tool, plug and play.

📄 The fine print: you pay through the nose, for nothing.

The problem is not which protocol you use. The problem is where your integrations live. Integrations that load themselves into your context every session will always tax you. MCP does this by design. The protocol is not the enemy — the architecture is.

💡 What if there was a really easy fix for this?

**All integrations should be called. Not loaded. Called.**

🙌 Does it sound complicated? Don't worry — three simple prompts and we have you sorted.

### Three steps to fix it today

#### Step 1 — See the damage

Before we dive into the solution, let's first make an assessment of how bad the situation is for you.

Open your agent and ask:

> *"How many tokens did my MCP servers load into this conversation at startup? Break it down per server and per tool."*

Look at the number. That's what you've been paying per session, per restart, for as long as you've had those MCPs installed.

#### Step 2 — Wrap every integration in a script

For each MCP you have, ask your agent to build a replacement:

> *"Please build a script that makes it possible for me to use the [name] MCP server without loading it at startup."*

That's usually enough. Your agent knows what to do. One file, no config, no restart, no context cost — and it works for MCPs, CLIs, and direct API integrations alike.

#### Step 3 — Lock it in

Once your integrations are scripts, go one step further. Extract each tool call into its own separate skill file, and link to it from your main skill when it's needed. Ask your agent:

> *"Extract each tool call into a separate tool file. Include the script in that tool file. Then link to each tool file from the main skill where it's used."*

Now when something changes — better API, different endpoint, upgraded tool — you update one file. The skills that use it don't notice. Your context stays clean, and every tool is only ever called when it's actually needed.

### After

Faster boot. Leaner context. Tools that work every time without a restart. My token cost at startup went from 27,000 to zero. The three prompts took less than an hour. The savings run every session.

### Your turn

Run the first prompt. Find your number. Then come back and post it — I want to know how bad it is out there.

How many tokens were your MCPs loading before you typed a word?

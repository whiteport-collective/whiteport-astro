---
title: "MCP Sucks. I Deleted Them All. So Should You."
slug: mcp-sucks-i-deleted-them-all
author: Mårten Angner
published: false
created: 2026-04-20
description: "MCP servers load every tool you have into your context before you type a single prompt. Here's what that costs you — and three steps to fix it."
---

# MCP Sucks. I Deleted Them All. So Should You.

I found out what the real cost of MCP servers that nobody is talking about. As a consiquence I got rid of my entire catalog of MCP servers I had installed not because I gave up on AI tools - but to make place for a much better solution.  

In this article I will tell you why you need to put your foot down right now and how to use three simple prompts. 

frist one to see what you are actually paying, second one to stop the madness and the last one to make sure it never happlens again! 

Enjoy!


## The moment everything broke

You've been here. You ask your agent to do something and it says: *"This MCP is not loaded. Let me install it."* You wait. You restart Claude. It doesn't work. You restart again, edit a JSON file, fix a missing comma, restart once more. Twenty minutes later you've done nothing except fight your own setup.

That's annoying. But it's not the real problem.

## What nobody tells you

Here's what was actually happening every time you restarted.

Every MCP server you had installed loaded its entire tool catalog into your conversation context at startup — every tool, every schema, every function description, whether you called them or not. I asked my agent to break it down. The answer came as a shock.

**27,000 tokens. Gone before I typed a single word.**

I had been paying for that on every session, every restart, for months. A colleague ran the same check. His number was 61,000 tokens.

You were not informed. You were taxed.

## What MCP actually is

MCP stands for Model Context Protocol. Anthropic released it in late 2024 as an open standard for connecting AI agents to external tools — databases, APIs, file systems, browsers. The promise was beautiful: one protocol, every tool, plug and play.

The fine print: You pay throught the nose, for nothing! 

The problem is not which protocol you use. The problem is where your integrations live. Integrations that load themselves into your context every session will always tax you. MCP does this by design. — the architecture is.

What if there was a really easy fix for this? 

**All integrations should be called. Not loaded. Called.**

Does it sound complicated? Don't worry — three simple prompts and we have you sorted.

## Three steps to fix it today

### Step 1 — See the damage

Before we dive into the solution, let's first make an assessment of how bad the situation is for you.

Open your agent and ask:

> *"How many tokens did my MCP servers load into this conversation at startup? Break it down per server and per tool."*

Look at the number. That's what you've been paying per session, per restart, for as long as you've had those MCPs installed.

### Step 2 — Wrap every integration in a script

For each MCP you have, ask your agent to build a replacement:

> *"Please build a script that makes it possible for me to use the [name] MCP server without loading it at startup."*

That's usually enough. Your agent knows what to do. One file, no config, no restart, no context cost — and it works for MCPs, CLIs, and direct API integrations alike.

### Step 3 — Lock it in

Once your integrations are scripts, go one step further. Extract each tool call into its own separate skill file, and link to it from your main skill when it's needed. Ask your agent:

> *"Extract each tool call into a separate tool file. Include the script in that tool file. Then link to each tool file from the main skill where it's used."*

Now when something changes — better API, different endpoint, upgraded tool — you update one file. The skills that use it don't notice. Your context stays clean, and every tool is only ever called when it's actually needed.

## After

Faster boot. Leaner context. Tools that work every time without a restart. My token cost at startup went from 27,000 to zero. The three prompts took less than an hour. The savings run every session.

## Your turn

Run the first prompt. Find your number. Then come back and post it — I want to know how bad it is out there.

How many tokens were your MCPs loading before you typed a word?

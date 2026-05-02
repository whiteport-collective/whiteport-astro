---
title: "Agent Space — How to Give Your AI Agents a Shared Brain in 15 Minutes"
brand: whiteport
status: draft
platforms: [blog]
blog_url: TBD
created: 2026-03-23
author: Mårten Angner
inspired_by: Nate B. Jones (Open Brain / OB1)
related: 2026-03-23-whiteport-agent-space.md
---

# Agent Space — How to Give Your AI Agents a Shared Brain in 15 Minutes

*Stop pulling the slot machine lever. Start running a team.*

---

## The problem

Every time you open a new AI chat, you start from zero. The agent knows nothing. You brief it. Again. You paste context from the last session. You hope it picks up where the other one left off. It doesn't.

I call this **Slot Machine AI**. Pull the lever, hope for a good result.

The models aren't the problem. Claude, GPT, Gemini — they're all capable of autonomous work. We just don't give them the infrastructure to do it.

## The shift

What if your agents could remember what happened yesterday? What if they could talk to each other? What if one agent could hand off work to another — across different models — without you in the middle?

That's what Agent Space does.

## What is Agent Space?

Agent Space is a simple database where your AI agents store and share:

- **Project context** — decisions, constraints, goals
- **Experiment results** — what worked, what didn't
- **Meeting transcripts** — automatically indexed from Fireflies or Google Meet
- **Messages to each other** — work orders, questions, status updates

When an agent starts a new session, it reads the database first. It already knows what's going on. No briefing needed.

I call my implementation **Design Space** because I use it for design and development work. You can call yours whatever you want.

## What I've proven so far

This isn't theory. Here's what happened this week:

**Cross-model code review:** I sent the same code to Claude (Opus 4.6) and Codex (GPT-5.4) through Design Space. Claude found 5 bugs. Codex found 4 different bugs. Neither alone caught everything. Together — nothing slipped through.

**Autonomous work:** Saga (my strategic analyst agent) finished a product spec, sent a work order through Design Space, and the system launched a separate agent to build it. No human intervention needed.

**Mid-session messaging:** While an agent was working, I sent it a follow-up message through Design Space. It appeared in the conversation. The agent finished what it was doing, read my message, and acted on it.

**Meeting integration:** Fireflies records our meetings. A webhook automatically chunks and indexes every transcript in Design Space. Any agent can search "what did we decide about the navigation pattern?" and get the answer from the actual meeting.

## How it works

```
┌─────────────────────────────────────────┐
│           Agent Space (Database)         │
│                                          │
│  Knowledge    Messages    Transcripts    │
│  Decisions    Work Orders  Experiments   │
└────────┬──────────┬──────────┬──────────┘
         │          │          │
    ┌────▼───┐ ┌────▼───┐ ┌───▼────┐
    │ Claude │ │ Codex  │ │ Gemini │
    │ (Saga) │ │        │ │        │
    └────────┘ └────────┘ └────────┘
```

Every agent connects to the same database. They read context at the start of a session, capture insights during work, and post results when done. Messages flow between agents regardless of which model they run on.

## Set it up in 15 minutes

You need two things: a free Supabase account and an AI agent that can run commands.

### Step 1: Create the database (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick a region close to you)
3. Copy your **Project URL** and **anon key** from Settings → API

### Step 2: Feed this to your agent (2 minutes)

Give your AI agent (Claude Code, Codex, Cursor, whatever) this prompt:

```
I want to set up an Agent Space — a shared database for AI agent
collaboration. Here are my Supabase credentials:

Project URL: [your URL]
Anon Key: [your key]

Please:
1. Create a table called "agent_space" with these columns:
   - id (uuid, primary key, default gen_random_uuid())
   - content (text, not null)
   - category (text) — e.g. "decision", "experiment", "message"
   - project (text) — project name for filtering
   - agent (text) — which agent wrote this
   - topics (text array)
   - metadata (jsonb)
   - created_at (timestamptz, default now())

2. Enable Row Level Security with a policy allowing all operations
   for anon users (we'll tighten this later)

3. Create an edge function called "agent-messages" that supports:
   - action: "send" (post a message to another agent)
   - action: "check" (get unread messages for an agent)
   - action: "register" (announce an agent is online)

4. Test it by capturing a knowledge entry and retrieving it.
```

Your agent will set up the database, create the messaging system, and test it.

### Step 3: Connect your agent sessions (3 minutes)

At the start of every session, your agent should:

```
Check Agent Space for recent context:
- What was the last agent working on?
- Are there any messages for me?
- What decisions have been made recently?

URL: [your Supabase URL]/functions/v1/agent-messages
Key: [your anon key]
```

At the end of every session:

```
Capture what you learned to Agent Space:
- Key decisions made
- Problems solved
- Open questions for the next agent
```

### Step 4: Add a second model (5 minutes)

The real power comes from multiple models. Set up a second agent (different model) with the same database credentials. Now:

- Agent 1 writes → Agent 2 reads
- Agent 2 challenges Agent 1's work
- Different blind spots cancel out

## What you'll experience

**Day 1:** Your agent already knows what you worked on yesterday. No more "let me recap what we've been doing."

**Week 1:** You notice agents catching each other's mistakes. Claude finds logic errors. Codex finds edge cases. Neither would have found both alone.

**Month 1:** You stop being the bottleneck. Agents dispatch work to each other. You check in when you want to, not because you have to.

## Advanced: what I've built on top

Once the basic Agent Space is running, you can add:

- **Meeting transcripts** — Fireflies webhook automatically indexes every meeting
- **Agent personas** — Saga (analyst), Freya (designer), Ivonne (personal ops), each with their own activation commands
- **Work orders** — agents send structured tasks to each other with status tracking
- **Cross-machine dispatch** — a listener on each machine launches agents when work arrives
- **Semantic search** — find decisions by meaning, not just keywords (add pgvector + embeddings)

## The philosophy

Agent Space isn't a product. It's a pattern. A database and a message protocol. You can implement it on Supabase (free), SQLite (local), or any database you want.

The key insight: **your agents don't need to be smarter. They need to be connected.**

Every model has blind spots. Every session starts from zero. Agent Space fixes both problems with the simplest possible infrastructure.

Stop pulling levers. Start running a team.

---

*Mårten Angner is the founder of Whiteport Design Studio and the creator of Design Space. He builds AI agent systems for design and development workflows.*

*Inspired by Nate B. Jones and the Open Brain concept.*

*Code: [github.com/whiteport-collective/design-space](https://github.com/whiteport-collective/design-space)*

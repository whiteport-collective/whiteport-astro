---
title: "WDS v0.4.0 — The Build Specification Release"
publishDate: 2026-03-19T18:00:00.000Z
author: Marten Angner
categories:
  - wds
tags:
  - wds
  - ai-agents
  - agentic-development
  - design-process
  - frameworks
gallery:
  - src: "/images/blog/wds-040/hero.jpg"
    alt: WDS v0.4.0 Build Specification Release — chalkboard infographic
    type: image
    width: 3712
    height: 4608
    display:
      - archive
      - gallery
      - instagram
      - facebook
      - linkedin
      - thumbnail
---

We just shipped the biggest WDS update since the agent restructuring. Four features that change how the system works at a fundamental level.

## Your documents are no longer a black hole

When you upload a PRD, a brief, research, or any existing material — Saga now actually reads it. She extracts every insight, presents them to you one by one for confirmation, identifies what's missing, and only asks about the gaps.

No more "thanks for sharing" followed by "so, what's your vision?" when the vision is right there in the document you just gave her.

A 60-minute discovery session becomes 15 minutes when your materials are comprehensive.

## Platform Requirements that a coding agent can build from

This is the big one. The Platform Requirements step used to produce a technology shopping list. "We'll use React and PostgreSQL." Great. Now what?

Now it produces a complete build specification:

- **Database schema** — every table, every column, exact types, constraints, relationships
- **State machines** — every entity lifecycle with transitions and per-phase actions
- **Business logic** — calculations as pseudocode, event handlers, scheduled jobs
- **API surface** — every endpoint with request and response shapes

The litmus test: *Can a coding agent build the entire platform from this document alone?* If not, it's not done.

We proved it on a real project. 200 lines of tech selection became 700 lines of actionable specification. The difference is night and day.

## Design Space is now part of WDS

The shared knowledge base and agent messaging system is officially a core WDS skill. Database-agnostic — SQLite for local solo work, Supabase for team collaboration. Same API, same agents, different backend. The installer handles setup.

## BMad skill format

Saga and Freya are now self-contained BMad-compliant skills. No routing, no wrappers — each agent is a portable, complete skill with progressive disclosure, capability menus, and bundled references.

---

This release was built in one session. Saga found her own bugs, reported them through Design Space, and we fixed the workflow she runs on — while she was running it.

That's the point of the whole system. The agents don't just follow the method. They improve it.

v0.4.0 is live on [GitHub](https://github.com/whiteport-collective/whiteport-design-studio).

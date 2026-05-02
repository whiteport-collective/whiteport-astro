# 00 Research — The Wrap Skill

**Author:** Mårten Angner  
**Date:** 2026-04-22  
**Status:** Research complete — ready to write

---

## The Concept

Instead of a 45-minute interview to populate your agent's context files, the wrap skill captures what actually happened in each session and appends it to the right file automatically.

The files grow from real work, not introspection. After ten sessions you have something richer than any interview could produce.

---

## The Problem with Interviews

Two failures:

**1. You lie** — not deliberately. You describe the ideal version of how you work. After 100+ deep UX interviews the pattern is consistent: people narrate the process they believe they follow, not the one they actually follow.

**2. You don't know** — the most valuable knowledge is below the level of introspection. It has been compiled into automatic behavior. You cannot interview it out of someone.

> *"You don't know what you need to know. And if you never tell your agents, it's not worth knowing."*

---

## The .context/ Folder

No MCP server. No database. No infrastructure. Just a folder.

```
.context/
  soul.md            ← who you are, how you decide
  user.md            ← preferences, patterns, communication style
  heartbeat.md       ← rhythms, routines, recurring tasks
  operating-model.md ← dependencies, institutional knowledge
  friction.md        ← annoyances, blockers, inefficiencies
  saga.state.md      ← last 5 sessions with Saga
  freya.state.md     ← last 5 sessions with Freya
  mimir.state.md     ← last 5 sessions with Mimir
```

---

## The Five Knowledge Files

Mapped from Nate's five elicitation layers:

| File | Captures |
|------|---------|
| soul.md | Who you are, values, how you make decisions |
| user.md | Preferences, patterns, communication style |
| heartbeat.md | Operating rhythms — real days/weeks, not calendar |
| operating-model.md | Recurring decisions, dependencies, institutional knowledge |
| friction.md | Annoyances, blockers, things that eat time |

---

## The State File

One file per agent. Five sessions stored, newest at top, oldest drops off (circular buffer).

Every session end the agent writes one block:
- What happened
- What is in flight
- What the next session needs to know

`/saga` reads `soul.md` + `user.md` + `saga.state.md` before saying hello. Cold start solved permanently.

---

## The Wrap Questions

At the end of every session the agent asks five questions against what actually happened:

1. Did we learn anything about your rhythm or how you work?
2. Did a recurring decision surface?
3. Did a dependency show up?
4. Did you share something only you would know?
5. Did anything cause friction?

Each answer appended to the right file. Not rewritten — appended.

---

## The Compaction

Every 10 sessions the agent reviews and compacts the knowledge files:
- Merge duplicates
- Promote patterns to permanent knowledge
- Remove stale entries
- Flag contradictions for human review

Two layers: raw append (what happened) → compacted truth (distilled over time).

---

## Three Disagreements with Nate

| | Nate | Wrap skill |
|---|---|---|
| **How** | 45-minute interview | Continuous capture via session wrap |
| **What you get** | What you think you do | What you actually do |
| **Infrastructure** | MCP server + Open Brain database | A folder of markdown files |

---

## Related

- Nate's video: https://www.youtube.com/watch?v=2PWJu6uAaoU
- Nate's Substack article: Your agent needs a SOUL.md you can't write from scratch
- WDS wrap skill: `src/skills/wrap.md`
- Article 01 research: `C:\dev\marten-angner\martens-documents\Projects\agent-elicitation\00-research.md`

# Skip the 40-minute interview. Trust the agents.

**Author:** Mårten Angner  
**Status:** Draft — ready to write  
**Date:** 2026-04-22  
**Source:** https://www.youtube.com/watch?v=2PWJu6uAaoU

---

## The Hook

Nate is right about everything except the fix.

His diagnosis is brilliant. His prescription is wrong. And I know — because I've spent over 100 hours in deep UX interviews watching people describe work they don't actually do.

---

## The Argument

### Nate gets the problem exactly right

- The cold start problem is real
- Tacit knowledge is the bottleneck, not the technology
- Senior people have the most to gain and the hardest time delegating
- The first agent worth running should be an interviewer
- It's a bottoms-up knowledge management revolution

All of that is correct.

### The interview fails twice

**First failure: you lie.**

Not deliberately. You describe the ideal version of how you work. The version you wish were true. UX researchers know this. After 100+ deep interviews, the pattern is consistent — people narrate the process they believe they follow, not the one they actually follow.

**Second failure: you don't know.**

The most valuable knowledge is below the level of introspection. It's been compiled from source code into machine code — Nate's own metaphor. You can't interview it out of someone. They genuinely cannot access it. The senior product manager who "just knows" the churn number is wrong cannot tell you how she knows. Asking her to sit down for 45 minutes and describe it will produce a plausible story that misses everything that matters.

> *"You don't know what you need to know. And if you never tell your agents, it's not worth knowing."*

### The wrap approach

Don't front-load the work. Don't try to describe yourself. Start working.

At the end of every session, the agent asks five questions against what actually happened:

- Did we learn anything about your rhythm or how you work?
- Did a recurring decision surface?
- Did a dependency show up?
- Did you share something only you would know?
- Did anything cause friction?

Each answer gets appended to the right file. Not rewritten — appended. The files grow from real work, not introspection.

After ten sessions you have something richer than any interview could produce. Because it came from evidence, not self-report.

### The .context/ folder

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

Any agent, any tool, any model can read a markdown file. No server running. No configuration. No dependency to break.

### The state file

One file per agent. Five sessions, newest at top, oldest drops off. Every session end the agent writes one block — what happened, what's in flight, what the next session needs to know.

`/saga` reads `soul.md` + `user.md` + `saga.state.md` before saying hello.

Cold start problem solved. Permanently. Without a 45-minute interview.

### The compaction

Every ten sessions the agent reviews the knowledge files and compacts them — merges duplicates, promotes patterns to permanent knowledge, removes stale entries. Two layers: raw append (what actually happened) and compacted truth (distilled over time).

---

## Three disagreements with Nate

| | Nate | Wrap approach |
|---|---|---|
| **How** | 45-minute interview | Continuous capture via session wrap |
| **What you get** | What you think you do | What you actually do |
| **Infrastructure** | MCP server + Open Brain database | A folder of markdown files |

---

## The closing line

Nate says: *"Save the 40 hours of trying to describe your job."*

We say: **Save the 40 minutes too. Trust the agents.**

They will figure you out. Let them.

---

## Related

- [Article 01 — Agent Elicitation Psychology](../../../Projects/agent-elicitation/00-research.md)
- [Nate's video](https://www.youtube.com/watch?v=2PWJu6uAaoU)

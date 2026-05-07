# WDS-E — Apply Digital Presentation Script
**Meeting:** Follow-up call with Chris Woodill, Apply Digital  
**Date:** April 22, 2026, 15:00 Stockholm  
**Previous meeting:** March 26, 2026 — 44 min, WDS & Design Space intro  
**Style:** Dark mode, dark gray (#06060b), Inter + JetBrains Mono, gradient accents — same as BMad interview deck

---

## VISUAL LANGUAGE

Base system inherited from the BMad interview deck. Claude should treat this as the floor, not the ceiling — push it further.

### Tokens (BMad baseline)
```
--bg-deep:        #06060b
--bg-card:        #12121e
--bg-card-hover:  #1a1a2e
--border:         #1e1e32
--text-primary:   #e8e8f0
--text-secondary: #8888a8
--text-muted:     #555570
--accent-blue:    #4e8eff
--accent-purple:  #9b6dff
--accent-green:   #00e88f
--accent-orange:  #ff8c42
--accent-rose:    #ff6b9d
--gradient:       linear-gradient(135deg, #4e8eff, #9b6dff)
--gradient-warm:  linear-gradient(135deg, #ff8c42, #ff6b9d)
```

### Type scale
```
Cover headline:  clamp(52px, 7vw, 96px)  fw:800  ls:-0.035em  Inter
Section title:   clamp(30px, 3.5vw, 52px)  fw:700  ls:-0.02em
Contrast lines:  clamp(28px, 3.8vw, 54px)  fw:700  ls:-0.025em
Body text:       18px  fw:400  lh:1.7  color:text-secondary
Section label:   12px JetBrains Mono  ls:3px  UPPERCASE  color:accent-blue
Phase pill:      11px JetBrains Mono  ls:2px  UPPERCASE  pill with blue border+tint
```

### Cards
```
border-radius: 14px
padding:       28px 32px
border:        1px solid #1e1e32
bg:            #12121e
```

### Transitions
```
Enter:  scale(0.88) translateY(16px) → scale(1) translateY(0)
Exit:   scale(1) → scale(1.06) translateY(-12px)
Easing: cubic-bezier(0.16, 1, 0.3, 1)  duration: 0.6s
Stagger delays: 0.05 / 0.15 / 0.25 / 0.35 / 0.45 / 0.55s
```

### Chrome
```
Progress bar:   3px top edge, gradient-primary
Slide counter:  bottom-right, JetBrains Mono 13px, text-muted
```

### Diagram elements
```
Connector lines: 2px solid #1e1e32
Fork nodes:      bg-card, border rgba(155,109,255,0.35), br:12px
SVG icons:       20×20px, stroke currentColor, sw:1.75, no fill
```

### Push further — design direction for Claude
The BMad deck is clean and credible. The Apply Digital deck should feel like a generation ahead — this is the enterprise pitch, not the community video.

**Suggestions (not constraints — Claude should find better ones):**
- Glows and ambient light: soft radial gradients behind key slides (purple/blue, 20–30% opacity) — the BMad deck has them but uses them sparingly. Lean in.
- Richer card hierarchy: two depths of card (bg-card + bg-card-hover) used intentionally — feature cards elevated, supporting text recessed.
- Diagram expressiveness: the pipeline diagrams (slide 4, slide 6) deserve real SVG polish — icons, weight, spacing — not ASCII art.
- Cinematic category transitions: the CATEGORY slides (SETUP, UNIVERSAL MEMORY, etc.) should feel like chapter cards — full-bleed, large type, gradient fill, not just a label line.
- Accent use: the warm gradient (orange → rose) is unused in BMad. This deck has more emotional moments (slide 23 lock-in, slide 25 close) — those slides earn a warmer tone.
- Quote treatment: slide 2 Chris quotes and slide 9 selective ignorance should be typographically dominant — large, gradient, centered, full presence.

The goal: someone watching this on a screen share should notice it looks different from every other deck they've seen today.

---

## CONTEXT FROM MARCH 26 MEETING

Chris's exact pain points (his own words):
- *"Design team tends to think in Figma, the strategy team tends to think in Miro boards and documents. Both of which are not AI enabled."*
- *"Very meeting heavy."*
- *"You expect me to use an IDE and check stuff into GitHub? Are you nuts?"* — strategists resisting change
- Design team took an AI prototype and went back to Figma — old habits
- Role overlap between UX and PM, "a lot of gold plating and excess specking on both sides"
- Expensive and slow for enterprise — good for big clients, bad for nimble
- He wants to find **champions** within his design team to try WDS
- He mentioned **EMEA partnership** — 40-50 people in London, European clients
- He connected with the **scarcity mindset** approach: "apply for the elite team"

**This is a follow-up** He's already seen WDS. Today is about WDS-E, Agent Space, and the partnership opportunity.

---

## SLIDE 1 — Title

**Visual:** Dark background, gradient headline

> **WDS-E & Agent Space**  
> *The universal memory layer that makes agents scale*  
> Mårten Angner · April 22, 2026

---

## SLIDE 2 — Where We Left Off

**Visual:** Two quote blocks side by side, reveal line below

> *"Design team tends to think in Figma, strategy team tends to think in Miro boards. Both of which are not AI enabled."*  
> — Chris Woodill, March 26

> *"Very meeting heavy."*  
> — Chris Woodill, March 26

**Your teams adopted AI. The coordination problem got worse**

**Three tools, zero connection** Claude, GPT, Copilot — each brilliant alone. Together, three silos with no shared memory.

**Every session starts from zero** Decisions made Tuesday are unknown to the agent on Wednesday. Your people carry the context.

**You pay humans to be the connective tissue** That's the bottleneck — and adding more AI tools makes it worse.

---

## SLIDE 3 — BMad at Scale

**Visual:** Solo builder → growing team → coordination chaos

**BMad is a game-changer for the solo builder. Scale breaks it**

**Agents live in repos, not in sync** Every team member has their own version. Different prompts, different behaviors, no shared state.

**No framework for your own agents** BMad ships its standard agents. Building something custom means starting from scratch every time.

**Not for scale** Clone repos, copy files, manual setup per machine. Not something you roll out to 40 people across London and EMEA.

That's not a criticism — it's an architecture decision built for solo use. WDS-E is the layer that makes it work at scale.

---

## SLIDE 4 — The Problem at Scale

**Visual:** Three-card row, dark cards, headline above

**The more AI you adopt, the more coordination overhead you generate**

**The Figma Trap** Design sees AI output, takes it to Figma, spends weeks on pixel perfection. The code is already there. The habit wins.

**The Miro Trap** Strategy thinks in boards and documents. Smart people, great thinking — in formats no agent can act on.

**The Meeting Trap** Every handoff between strategy, UX, and development is a meeting, a summary, a Confluence page nobody reads.

Three teams, three tools, no connection. Add more AI tools, add more coordination overhead. Unless you install a layer that handles it.

---

## SLIDE 5 — What Agent Space Is

**Visual:** Hub-and-spoke architecture diagram, Agent Space at center

**Agent Space is the missing piece between teams, tools, and agents**

**Not a tool. A layer** Agent Space sits below your tools and agents, holding everything they produce.

**Work flows without meetings** Saga posts a brief. Freya picks it up. Mimir builds. No one emails anyone.

**Memory is organizational, not personal** Every decision is available to every agent in every future session.

---

## SLIDE 6 — What This Looks Like for Apply Digital

**Visual:** Client engagement pipeline

```
Client kickoff call
    ↓ [structured brief → meeting saved in agent-space]
Strategy agent (Saga): product brief + trigger map
    ↓ [work order → repo → session handoffs agent-space]
UX agent (Freya): scenarios, wireframes, specs
    ↓ [work order → repo → sessions saved in agent-space]
Dev agent (Mimir): tech audit, build 
    ↓ [status: done → repo]
─────────────────────────────────────────
New team member joins 6 weeks in:
/start → reads the repo.

Everything decided. Everything documented. Full history available. 

Zero onboarding meeting.

```

**Every asset you deliver — Agent Space knows how it got there**

**The deliverable** Product briefs. UX scenarios. Architecture decisions. In the repo, available to every agent.

**The reasoning** Why that direction. What was rejected. What the client said that changed it. Stored alongside the output, not lost in a Slack thread.

**The payoff** Six months later, a new strategist picks up the client. They don't just see what was built — they understand why. Every choice traceable. Every shortcut visible. No one starts from zero.

The work is yours. The history is too.

---

---

## CATEGORY: SETUP

---

## SLIDE 7 — AI Governance & Compliance

**Visual:** Boardroom table fades into policies document fades into agents activating

**It needs to start with a management decision**

**AI is an opportunity shaped like a problem** ChatGPT doesn't have governance. Copilot doesn't either. They have terms of service — that's not what your compliance officer is asking for.

**Compliance officers want a different answer** What is the AI allowed to do, what data can it touch, and who approved it.

**WDS-E starts here** The governance document is the first thing built — and the thing that builds everything else.

---

## SLIDE 8 — Policies Document

**Visual:** Idun activating → 13 templates flowing together → one Policies Document

**The policy documents — the complete specification for the system**

**13 templates. One conversation** Idun walks through data classification, authority model, compliance framework, audit requirements — all of it.

**The output is uniquely yours** Not a generic AI policy. A document that reflects the exact shape of your organization.

**It's the build spec, not documentation** Every agent, every skill, every access boundary is generated from it.

---

## SLIDE 9 — Implementation

**Visual:** Policies Document → implementation engine → live agent space (database-agnostic layer shown)

**Your policies become the implementation specs — just like in BMad**

**Database-agnostic** Oracle, Postgres, SQL Server — whatever your IT already approves.

**Reference implementation ready** Supabase (eu-north-1, Stockholm): schema, edge functions, row-level security, GDPR by architecture.

**Bespoke by design** Apply Digital's Agent Space couldn't be sold to another company. It was generated from a document that couldn't be copied.

---

## SLIDE 10 — User Systems Management

**Visual:** Repo icon → user entries → soul files → agents adapting per person

**Agent Space is managed as a repo. Each person gets their own context — and it grows with them**

**Every user gets a soul file** How they work, what they care about, what they've been hired to do. Agents read it before the first message.

**The AI stops feeling alien** Your design team went back to Figma because the AI didn't know them. This fixes that.

**Effectiveness compounds** Every session deposits small observations. Over time, the AI gets measurably better at working with that specific person.

You don't onboard to the AI. The AI onboards to you.

---

---

## CATEGORY: UNIVERSAL MEMORY

---

## SLIDE 11 — Universal Memory

**Visual:** Brain icon → persistent storage → model layer swapping overhead

**Your memory outlasts every LLM generation**

**Every other tool starts from zero** ChatGPT, Claude, Copilot — each session forgets the last. Your team re-briefs the AI every time.

**Agent Space remembers everything** Every decision, every client, every project — searchable semantically, available to every agent.

**You own it** When GPT-5 is 30% better, you swap the model. The memory stays in your infrastructure. You are not a tenant.

---

## SLIDE 12 — Wrap & Handoff

**Visual:** Terminal showing `/wrap` → structured memory entry → Agent Space + handoff to next agent

**Every session builds on the last**

**`/wrap` takes 30 seconds** Decisions, outputs, blockers, context for next time — structured, tagged, stored.

**Without it, the context evaporates** Tomorrow starts from a blank page. Again.

**With it, continuity is structural** The next strategist opens Saga. She already knows what was decided — and why the three alternatives were rejected.

---

## SLIDE 13 — Start

**Visual:** Terminal showing `/start` → full context loads → agent ready

**The agent arrives briefed**

**`/start` loads everything** Project, decisions, meeting transcripts, the person's own context — before the first message.

**Zero onboarding meeting** A new developer joins week 6. `/start`. Mimir knows the tech stack, the constraints, what's been built.

**This kills the meeting-heavy problem** Briefings exist because humans carry context between sessions. Remove that — meetings collapse back to decisions.

---

---

## CATEGORY: COORDINATION

---

## SLIDE 14 — Agent Messaging

**Visual:** Agent icons → structured message → Agent Space → next agent

**People meet to decide. AI handles the transmission**

**No coordination meetings** Saga finishes a brief, posts a structured handoff to Agent Space. Freya picks it up next session.

**No Confluence pages** Every handoff is structured, tagged, findable — not a Slack thread buried on Thursday.

**12 weeks. Three disciplines. Zero information meetings** Strategy (wk 1–3) → UX (4–7) → Dev (8–12). Every phase knows what the last one decided.

---

## SLIDE 15 — Work Orders

**Visual:** Kanban-style status flow: ready → in-progress → done / blocked

**Visibility at the work level — across every agent in flight**

**Every task has a status** `ready → in-progress → done / blocked`. Nothing falls through the cracks.

**A project lead sees everything** Three simultaneous engagements. All active work orders. No status meeting needed.

**Right now you have zero visibility** 10 people using AI tools across an engagement — you don't know what any of them are doing until they report in.

---

---

## CATEGORY: MEETING INTELLIGENCE

---

## SLIDE 16 — Meeting Transcripts & Semantic Search

**Visual:** Timeline — call → transcript → semantic index → connected to people + projects

**Every meeting becomes a permanent, searchable asset — and your AI attends every one**

**When a call ends, Agent Space receives it** Chunked, semantically indexed, connected to people, projects, and clients.

**This is how I prepared for today** March 26 — 44 minutes. Your exact words. I didn't re-read notes. I asked Agent Space.

**Six months from now** A new strategist takes over an Apply Digital client. They ask the agent. The agent knows.

---

---

## CATEGORY: SKILLS

---

## SLIDE 17 — Skill Library & Central Management

**Visual:** Grid of skill cards → Idun audits versions → pushed to all agents

**The difference between AI adoption and AI capability**

**40 people, 40 approaches** Individuals figure out their own workflows. None shared. None improving. That's adoption.

**One skill, every agent** Written once, reviewed by Idun, versioned, pushed to everyone. That's organizational capability.

**Apply Digital's research lead writes one skill** Every strategist — London, EMEA, pilot — runs it identically. Update centrally. Done.

---

---

## CATEGORY: TOOLS

---

## SLIDE 18 — The MCP Tax

**Visual:** Token counter ticking up → 27,000 tokens → daily cost indicator

**5.4 million tokens per day in overhead — before your team does a single thing**

**Every MCP server loads at startup** 27,000 tokens of tool definitions — before the agent does anything useful.

**40 people × 5 sessions × 27,000 = 5.4M tokens/day** Pure overhead. You pay before your team helps a single client.

**WDS-E loads only what's needed** A Freya UX session: ~3,000 tokens instead of 27,000. Cost discipline built in.

---

## SLIDE 19 — Central Credential Management

**Visual:** Vault icon → centralized credentials → agents access

**40 people, 40 API keys, 40 breach points. Or one credential store**

**One vault. Every tool** Fortnox, Stripe, Google Workspace, LinkedIn — configured once, centrally, in Bitwarden.

**No passwords in prompts** Agents access credentials through the store. No secrets in code.

**One revocation cleans everything** A strategist leaves — credentials revoked in one place, 15 integrations updated simultaneously.

---

## SLIDE 20 — Secure Layer

**Visual:** Shield icon with layers — org → project → user

**GDPR compliance by architecture — the review starts green**

**Three security levels** Org (agents and tools), Project (client data access), User (row-level memory security).

**Data stays in eu-north-1** You own the database. Anthropic processes — doesn't retain. Sessions ephemeral.

**Financial services client?** Isolated at project level. No bleed-through to other engagements. Passes the compliance review.

---

---

## CATEGORY: PLATFORM

---

## SLIDE 21 — Central Access Management

**Visual:** Single key icon → expands to all tools and agents

**One credential in. One revocation out**

**One key, everything it unlocks** Which agents, which skills, which tools, which client data — configured through Idun in conversation.

**Join: one setup. Leave: one revocation** A contractor gets access to two projects and two skill sets. Engagement ends — one operation removes all of it.

**IT overhead on AI tooling: eliminated** No more managing access across a fragmented tool stack.

---

## SLIDE 22 — Rights Management

**Visual:** Role hierarchy — admin → lead → contributor → viewer

**Invite your clients in. Keep your methodology yours**

**Four roles** Admin configures. Lead directs. Contributor produces. Viewer observes.

**Clients get viewer access to their own project** Work orders, outputs, decisions — visible. Other clients, your methodology, internal deliberations — not.

**That's a commercial advantage** You show clients the work in a way that builds trust, without exposing your process.

---

---

## SLIDE 23 — The Lock-In Argument

**Visual:** Model logos (OpenAI, Anthropic, Google) → vault locked to each → contrast: your infrastructure, open

**The model makers don't want you to do this**

**ChatGPT memory. Claude Projects** Your data should be portable, in their infrastructure. You can't take it with you. You can't share it across vendors. That's not an oversight — that's the business model.

**They profit from the lock-in** The more your organizational knowledge lives inside their systems, the harder it is to leave. Every insight you generate makes you more dependent. That's good for them. Not for you.

**WDS-E is the only architecture where this is provably solved** Your database. Your infrastructure. Your memory. Any model can read it — today Claude, tomorrow GPT-5, next year whatever wins. The insights are yours because the data is yours.

This problem will never be solved by the people who benefit from it not being solved.

---

## CATEGORY: BMAD

---

## SLIDE 24 — BMad Compatible

**Visual:** BMad module grid overlaid on Agent Space architecture

**BMad and WDS-E run on the same coordination layer**

**BMad is for development. WDS is for strategy and design** Agent Space is underneath both.

**Same memory. Same work orders** BMad agents read from and write to Agent Space. Skills from WDS-E run inside BMad sessions.

**Apply Digital doesn't have to pick sides** Strategy with Saga. UX with Freya. Dev with BMad. All three write to the same Agent Space.

---

## SLIDE 25 — Next Step

**Visual:** Minimal closing slide — three numbered options, dark background

> **Three options — you pick**

1. **Pilot engagement** One Apply Digital client project, WDS-E full stack, Mårten embedded for the first sprint. You see the outputs before you commit to anything larger.

2. **EMEA intro** Connect me with your European lead. Partnership conversation, not a vendor pitch. Apply Digital has the client relationships; WDS-E has the coordination layer.

3. **Champion program** Five people from your design team, exclusive access, one intensive. The results make the case internally better than any slide deck.

The meeting we had on March 26 — everything we discussed is already in Agent Space. Saga knows it. Freya knows it. If we start a pilot today, the agents won't need to be briefed on Apply Digital. They already know.

I don't need a commitment today. I need to know which of these three is the right first step.

What do you think?

---

## PRESENTATION NOTES

**Tone:** Peer to peer. He's been in digital transformation for 20 years. He's smart, he's seen the hype cycles, he's skeptical of AI slop. Don't pitch — show. Don't explain — reference what he already said.

**Key references to use (his own words):**
- "Both of which are not AI enabled" — for Figma and Miro
- "Very meeting heavy" — on coordination overhead
- "Are you nuts?" — on asking strategists to use GitHub
- "Champions within our design team" — his own plan, reinforce it

**Time split for 60 min:**
- 5 min — warm-up, did you try it?
- 15 min — slides (he'll interrupt, let him)
- 20 min — live Agent Space demo
- 20 min — partnership conversation + next steps

**Live demo to prepare:**
1. Start a session — show Agent Space loading context automatically
2. Show a work order being posted from one agent and picked up by another
3. Pull the March 26 meeting from Design Space — show that agents already know what was discussed
4. Show Idun onboarding — "this is the entire install process"

**The closer:**  
*"The meeting we had on March 26 — everything we discussed is already in Agent Space. Saga knows it. Freya knows it. If we start a pilot engagement today, the agents won't need to be briefed on Apply Digital. They already know."*

---

## OPEN QUESTIONS

- **Nate's file list (slide 9):** In your Ivonne chat you mentioned each user gets soul.md plus the full personal context file set Nate outlined in a video. Which video? What's the full file list? Slide 9 currently mentions only the soul file that evolves — happy to expand once we know the full set.

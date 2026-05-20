# Research — WDS v0.4: AI Agents That Know Their Job

## Tes
Most agentic design setups fail not because the AI is too dumb — but because nothing stops one agent from doing another's job. WDS v0.4 adds the governance layer that makes multi-agent design work reliable: locked terminology, domain contracts, and agents that sync their own skills.

## Varför nu
AI-assisted design is mainstream, but teams are now hitting the next wall: agents that drift, duplicate each other's work, or produce output no downstream agent can use. WDS v0.4 shipped three governance files (Glossary, Agent Contracts, Shared Activation) that lock this down — and added Mimir, the builder, completing the Saga → Freya → Mimir trio. This is the first version of WDS designed to work in teams rather than just solo sessions.

## Argument
1. **Terminology drift kills multi-agent workflows.** When Saga calls it a "brief" and Freya calls it a "spec" and Mimir calls it a "requirement", nothing connects. The WDS Glossary locks every term — phases 0–8, artifact names, folder paths. One definition per term. Loaded at activation. Non-negotiable.

2. **Agents without domain contracts do each other's jobs.** Without explicit boundaries, a strategy agent starts sketching UX, a design agent starts writing code. The Agent Contracts file defines what each agent owns, what they explicitly do not own, and what happens at handoff. If asked to stray, they name the right agent and offer to hand off — never attempt the work themselves.

3. **Designers don't want to manage agent updates.** The auto-sync means WDS agents running in any BMad project detect their own skill updates and apply them silently. First activation asks permission once. After that: always current, no manual steps, no version mismatch.

4. **Brownfield design is the real world.** Most design work happens on existing products. WDS v0.4 formalises the brownfield path: Freya runs a Gap Map (what's designed vs built vs has a Work Order) before starting anything new. Mimir requires a Tech Audit before writing a PRD. Redesigning a live product is a first-class workflow.

5. **Clean module boundaries matter for teams using BMad.** The previous version of WDS had Whiteport's private infrastructure hardcoded in public-facing files. v0.4.1 removes it entirely — handoffs are file-based, memory is local, nothing depends on external services. Teams that install WDS via BMad get a fully self-contained module. This also reflects WDS's agent-agnostic design: the framework has no dependency on any specific provider's infrastructure.

## Läsarens invändningar
- *"I already use AI for design — why do I need a framework?"* — Because you're probably one agent in one session. The moment you hand off to another agent, session, or team member, you need shared contracts or you're rebuilding context from scratch every time.
- *"Agents figure out context themselves."* — They do, but inconsistently. Locked terminology and domain contracts eliminate the need to re-establish what "phase" means, what "trigger map" means, what Freya owns vs Mimir. It's not about capability — it's about reliability.
- *"This looks complex."* — Install is one command. The governance files load automatically. You don't configure them.

## Bevis / exempel
- The Discord release announcement went out to the BMad community today with clear response from practitioners (wexxwuther asked specifically about brownfield — proves people are evaluating this for real projects)
- WDS is the official UX module in the BMad method — already used across WDS projects
- Three releases in one day (v0.4.0, v0.4.1, v0.4.2) shows velocity and maturity of the system
- The Saga → Freya → Mimir handoff chain mirrors how design studios actually work: strategist, designer, developer — now all three are AI-native

## Basics — vad är WDS och BMad (för läsare som inte vet)

**BMad** is an open-source AI development methodology — a structured way to build products with AI agents instead of just prompts. It gives agents roles, workflows, and output templates. Tens of thousands of developers and designers use it via the BMad community.

**WDS (Whiteport Design Studio)** is the official UX module for BMad. It is a **design studio operating model for AI agents** — an LLM-agnostic framework that gives agents the structure to work like a real design studio:

- **Identity** — Saga (strategist), Freya (UX designer), Mimir (builder). Each is a distinct agent with a specific domain.
- **Domain contracts** — what each agent owns, what they explicitly do not own, and how they hand off to each other
- **Locked terminology** — one glossary, loaded at activation, shared by all agents
- **Memory** — session state saved per agent, per project, resumable across sessions
- **Auto-sync** — agents update their own skills when the module is updated

**Agent-agnostic by design.** WDS is built on markdown files and file operations — no provider-specific APIs, no hardcoded model calls. The methodology runs wherever an agent can read files and follow instructions. The framework itself makes no assumptions about what's running it.

Without WDS, an AI agent doing design work is a generalist with no memory, no role, and no handoff protocol. With WDS, you have a three-agent studio that behaves consistently across sessions, projects, and teams — regardless of which model is running it.

Install: `npx bmad-method@latest install` — WDS is included as a module.

## WDS-kopplingen
This article IS about WDS. The angle: WDS isn't just a process for solo AI designers — it's governance infrastructure for design teams using multiple agents. v0.4 is the release that makes it production-ready for teams. Positions Mårten and Whiteport as the people solving the multi-agent design governance problem before anyone else named it.

## Hooks
1. "Most AI design setups break the moment a second agent joins. WDS v0.4 fixes that."
2. "Your AI agents are probably doing each other's jobs. Here's what a contract looks like."
3. "Three releases. One complete trio. The first agentic design framework with governance built in."
4. "The WDS Glossary has one rule: one definition per term. It sounds obvious until you watch two agents disagree about what a brief is."
5. "Mimir is now officially part of WDS. Strategy, design, implementation — three agents, three domains, zero overlap."

## Artikelstruktur
1. **Hook** — The moment two agents disagree about what a "brief" is, everything downstream breaks
2. **What is WDS / BMad** — brief orientation for new readers: BMad is the methodology, WDS is the agent harness for design
3. **Symptom** — What actually goes wrong in multi-agent design without governance (drift, duplication, broken handoffs)
4. **Root cause** — No locked terminology + no domain boundaries = agents that improvise at the worst moment
5. **The release** — What v0.4 added and why each piece matters for designers and design teams
6. **The complete trio** — Saga (strategy) + Freya (design) + Mimir (implementation): how the handoff chain mirrors a real design studio
7. **Brownfield** — Why existing-product design is a first-class workflow, not an edge case
8. **Who this is for** — Solo designers using BMad, design teams scaling agentic workflows, anyone who wants reliable multi-agent output
9. **CTA** — Install / try it / talk to us

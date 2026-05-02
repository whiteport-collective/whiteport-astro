# WDS — Practitioner Presentation Script
**Audience:** Designers, developers, and design leaders who want to start using WDS  
**Date:** April 2026  
**Style:** Same visual system as Apply Digital deck — dark mode (#06060b), Inter + JetBrains Mono, gradient accents. Practitioner tone: peer-to-peer, instructional, not cinematic.

---

## VISUAL LANGUAGE

Same tokens, type scale, cards, transitions, and chrome as `apply-digital-2026-04-22.md`.

### Tokens
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

### Design direction
Pipeline diagrams — clean sequence, emphasize order not spectacle.  
Phase slides — lead line + WHY / WHAT / HOW three-row rhythm.  
Terminal/code moments — monospace on dark, literal.  
Warm gradient (orange → rose) — payoff slides only.  
Category cards — full-bleed type, quieter than the enterprise deck.

---

## SLIDE 1 — Title

**Visual:** Dark background. Gradient headline. Subtitle in text-secondary.

> **Whiteport Design Studio**  
> *How to design with agents — from first brief to working product*  
> Mårten Angner · 2026

---

## CATEGORY: THE PROBLEM

---

## SLIDE 2 — You've Already Hit This Wall

**Visual:** Four cards, 2×2 grid.

**"I described it. The agent built the wrong thing."**  
Technically correct. Completely wrong. Started over.

**"The design looked great. The code didn't match."**  
Figma and implementation diverged. Neither was wrong — they just weren't talking.

**"Three weeks in, the user didn't need it."**  
Built what was asked. Nobody validated the ask.

**"It looked horrible. The more I prompted, the worse it got."**  
One fix broke two things. Started over from a blank file.

> AI doesn't fix ambiguity. It amplifies it.

---

## SLIDE 3 — What WDS Is

**Visual:** Two columns. Left: "25 years of professional UX practice." Right: "Rebuilt for the agentic age." Connected by a single line.

**WDS is a professional UX methodology — proven over 25 years, rebuilt for the agentic age.**

**Conceptual understanding** — What is this product, really?  
**Business reasoning** — Why are we building it, and for whom?  
**User driving forces** — The actual motivations that bring someone here. Not personas.

---

## SLIDE 4 — How WDS Works

**Visual:** Two principles, side by side. Left: dialog arrow between [You] and [Agent]. Right: document chain ending in code.

**Two principles that separate WDS from solo prompting.**

**Design through dialog** — You and the agent follow the user through the experience together. Page by page, decision by decision. The design emerges from the conversation — not from a single session.

**Specifications before code** — Agents build specifications. Specifications become the build input. Code is the last step. Ambiguity is resolved in writing before anyone touches the codebase.

---

## CATEGORY: SETUP

---

## SLIDE 5 — Getting Started

**Visual:** Three requirements listed, then a terminal card below with two commands.

**Git + GitHub** — Version control for design decisions, not just code.  
**An IDE** — VS Code, Cursor, or Windsurf. Pick the one your team already uses.  
**Any agent** — Claude Code recommended. Sonnet 4 for most work, Opus 4 for strategy.

[BMad install command] — Agent infrastructure, the scaffolding every WDS skill builds on.  
[WDS install command] — Adds Saga (strategy), Freya (UX/design), Mimir (implementation).

---

## CATEGORY: THE WDS PROCESS

---

## SLIDE 6 — The Pipeline

**Visual:** Horizontal pipeline. Seven nodes. Phase pills per agent.

```
Product Brief  →  Trigger Map  →  Scenarios  →  Page Specs  →  Storyboard  →  Design System  →  Build
   [SAGA]            [SAGA]         [FREYA]       [FREYA]        [FREYA]         [FREYA]         [MIMIR]
```

Each stage is a specification. Each specification is the input to the next step.

You don't run every phase for every project — a small feature starts at Page Specs, a full product starts at the Brief. The sequence is the logic: strategy before design, design before build.

---

## SLIDE 7 — Product Brief

**Visual:** Phase card. Label [SAGA]. Bold line: "The foundation everything builds on."

The first document in a WDS project — problem, user, goals, constraints, design principles — in writing, before any design or development starts. Saga interviews you and drafts it. You review and sign off.

**WHY** Teams spend weeks in execution and discover at demo that everyone held a different mental model. Nobody put it in writing.

**WHAT** Problem statement, user definition, goals, constraints, design principles. One document — everyone reads it and holds the same picture.

**HOW** Saga interviews you and drafts the brief. You review, push back, sign off. Platform requirements defined here unlock infrastructure work in parallel — you don't wait for the full UX pipeline before building the platform.

---

## SLIDE 8 — Trigger Map

**Visual:** Phase card. Label [SAGA]. Bold line: "Who acts. Why they act. What they fear."

Connects business goals to user psychology. Four layers: Business Goals → Product → Target Groups → Driving Forces. The map becomes the filter every design decision is tested against.

**WHY** Teams design from metrics and build for outcomes instead of people. Nobody ever mapped the actual motivation.

**WHAT** 3–4 target groups ranked by impact. Positive drivers (what they want) and negative drivers (what they fear). Negative drivers trigger action faster.

**HOW** Saga facilitates a structured conversation. Output: visual map, persona files, feature impact analysis — each feature scored against driving forces.

---

## SLIDE 9 — Scenarios

**Visual:** Phase card. Label [FREYA]. Bold line: "The experience, before it's designed."

Narrative walkthroughs of the most important user flows. Each follows a user through decisions, transitions, and moments that define the experience. Each is a specification written as a story.

**WHY** Users get lost not because a feature is missing — but because the flow assumes context they don't have, or puts the critical decision at the wrong moment.

**WHAT** 6–10 narrative walkthroughs of the highest-priority flows. Each reads like someone using the product.

**HOW** Freya selects the most important flows from the trigger map and writes them as stories. You review: "this flow assumes something the user can't know."

---

## SLIDE 10 — Page Specifications

**Visual:** Phase card. Label [FREYA]. Bold line: "The contract for every screen."

One specification per page — actual content (headlines, body copy, labels, error messages), hierarchy, interactions, error states, navigation triggers. Each spec is a build contract. Approved specs go directly to Mimir.

**WHY** "A clean onboarding screen" means five different things to five people. Everyone builds from what they remember being decided in a meeting.

**WHAT** Page name, purpose, actual content, hierarchy, interactions, error states, navigation triggers. Complete enough to build from without asking questions.

**HOW** Freya reads the scenarios and writes a spec per page. You review. One note per issue — not a redesign.

---

## SLIDE 11 — Storyboarding

**Visual:** Phase card. Label [FREYA]. Bold line: "Make the interaction visible before it's built."

Comic book strips for each logical view. An object is pulled from its context and the step-by-step interaction plays out in sequential panels — tap, response, state change, next step.

**WHY** A spec describes what is on a page. It can't show what happens when someone touches it, or where the sequence breaks down. Those errors are invisible in writing.

**WHAT** Sequential strips, one per logical view. Objects extracted from their context, interaction shown panel by panel.

**HOW** Freya produces interaction strips from the specs. You review each sequence: what step is missing, what happens on error. One note per break — not a redesign.

---

## SLIDE 12 — Design System

**Visual:** Phase card. Label [FREYA]. Bold line: "The shared vocabulary of the product."

Tokens, components, and patterns built for this product. Built alongside storyboarding — used by every agent on every page. When it exists, Mimir composes. It doesn't improvise.

**WHY** Without shared vocabulary, design quality fragments. Every new screen is a fresh decision. The product stops feeling designed and starts feeling assembled.

**WHAT** Tokens (color, spacing, typography), components (buttons, inputs, cards, modals), patterns (forms, navigation, empty states, error handling).

**HOW** Freya identifies every component the storyboards require and generates them. You add what's missing, adjust what's wrong.

---

## CATEGORY: BUILDING

---

## SLIDE 13 — Spec + Content + Design System + Platform = Working Product The code is just the projection!

**Visual:** Warm gradient background (orange → rose). Equation: [Page Spec + Content] + [Design System] + [Platform Requirements] → [Working Page].

**Mimir gets a spec with content, a design system, and platform requirements. Mimir builds the page.**

The output is predictable. The review is fast. Iteration is surgical — you fix what doesn't match the spec, not what doesn't match a vague idea.

**Three phases of specification. One phase of build.** Work shifts from "explain what you want" to "review what was built."

---

## SLIDE 14 — When the Design Changes

**Visual:** Two-path diagram. Left: minor change. Right: significant change.

**The spec is always the source of truth. Code and spec must stay in sync.**

**Minor change** — Make it in code, then update the spec to match. Fast, surgical, reversible.

**Significant change** — Update the spec first, then execute. The spec defines the intention before the agent touches anything.

> If code and spec disagree, one of them is wrong.

---

## CATEGORY: WDS FOR SCALE in TEAMS

---

## SLIDE 15 — From Solo Power to team and Enterprise Capability

**Visual:** Three upgrade cards. Each: BMad gives you X — WDS-E gives the team Y.

**WDS-E extends the methodology to the whole team.**

**Persistent memory** — Agent Space stores every decision. Sessions connect. New team members onboard from the same shared record.

**Shared skills** — Same agents, same skills, same protocols across the org. One update reaches every practitioner. Organizational capability — not personal capability.

**Structured handoffs** — Work orders let Freya hand off to Mimir, Mimir surface blockers to Saga. Coordination happens in writing — stored and traceable.

---

## SLIDE 16 — From Business Problem to Live System

**Visual:** Single clean timeline. Left: [Business Problem]. Center: WDS process. Right: [Live System on Real Users]. One small group — no intermediate gates.

**Three to five people. Shared methodology. Shared memory. Delegated strategy and execution.**

They take the brief, run discovery, design the product, build it, test it on users. You see the result — not every artifact along the way.

**Shared methodology** — Everyone runs the same WDS phases, the same agents, the same skills.

**Shared memory** — A decision made Monday is available Thursday, to the new team member, to the next agent picking up a work order.

**Delegated execution** — You don't review the brief, the trigger map, the scenarios, and the spec one by one. You review the system.

> A small autonomous team owns a product from initial problem to live tested system — inside a larger organization, without the coordination overhead.

---

## SLIDE 17 — Where to Start

**Visual:** Numbered list. Warm gradient numbers.

> **Five steps to your first WDS project**

1. Install BMad + WDS
2. Open a real project — something you're actually building, not a toy
3. Run Saga. Write the first Product Brief.
4. Read the brief. Notice what you didn't know you needed to decide.
5. Hand it to Freya. Write the trigger map.

---

The first brief is the hardest. The resistance is real — it's faster to just start building. That's the trap.

When working with a team, add Agent Space at step 1.

---

## SLIDE 18 — The Promise of AI, Materialized

**Visual:** Full-bleed warm gradient (orange → rose). Single large statement, centered.

> **When a designer can run strategy, design the product, and ship the code — that is when the promise of AI is materialized.**

---

WDS removes the translation. The same person who interviewed the stakeholder writes the brief. The brief becomes the trigger map. The trigger map becomes the scenarios. The scenarios become the specification. The specification becomes the code.

The designer didn't become a developer. The scope of what one person can own — and deliver — just expanded.

---

## PRESENTATION NOTES

**Tone:** Peer to peer. The audience knows how to work — they're here for a better process, not to be convinced AI is useful. Don't pitch, demonstrate.

**Time split for 60 min:**
- 5 min — intro, framing the problem
- 15 min — setup + mental model (live install + first Saga session)
- 25 min — WDS phases (real brief, real trigger map, real scenario — show on your computer)
- 15 min — build payoff, team scale, where to start

**Live demos (your computer, not slides):**
1. Install — run it in the terminal
2. Saga interview — start a Product Brief for a real project, let the audience see the questions
3. A real trigger map — show the density (each driving force a real decision)
4. Finished page spec → Mimir output side by side — that's the payoff moment

**Slide to linger on:** Slide 13 (Spec + Content + Design System + Platform = Working Product). This is the moment the audience understands why the specification phases exist. Don't rush it.

**The phrase to land:**  
*"The brief catches the wrong assumptions before they're in code. Finding a wrong assumption in a specification takes minutes. Finding it in code takes days. Every specification phase is time you're buying back."*

**Questions to expect:**
- "Can I skip phases?" → Yes. Small features start at Page Specs. The pipeline is a recommendation, not a rule.
- "What if I don't use Claude?" → BMad and WDS are Claude-native. Other models work but calibration varies.
- "How does Figma fit in?" → Code is the deliverable, Figma is the annotation layer. The loop is: design in code → export to Figma → adjust → merge back.
- "How is this different from just writing a good spec?" → The agent writes the spec. You review it. The structure is consistent every time.

---

## OPEN QUESTIONS

- **Install commands:** Slide 5 has placeholders — fill in actual BMad and WDS install commands before building
- **Storyboard tooling:** Pencil is the WDS storyboard tool — confirm whether to demo it live or keep it abstract for this audience
- **Design system generation:** Confirm whether Freya generates the design system from storyboard or if it's a separate step
- **Agent Space install for individuals:** Is there a solo/personal install path, or is it team-only?

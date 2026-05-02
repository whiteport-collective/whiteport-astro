# WDS — Compact Presentation Script
**Audience:** Designers, developers, and design leaders — overview format  
**Date:** April 2026  
**Format:** 11 slides. Use for 20–30 min sessions or when time is limited.  
**Style:** Same visual system as `wds-basics-2026-04-26.md`.

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

## CATEGORY: THE METHODOLOGY

---

## SLIDE 3 — What WDS Is and How It Works

**Visual:** Left column: "25 years of UX practice, rebuilt for the agentic age." Right column: two principles stacked.

**WDS is a professional UX methodology — proven over 25 years, rebuilt for the agentic age.**

**Design through dialog** — You and the agent follow the user through the experience together. The design emerges from conversation, not from a single solo session.

**Specifications before code** — Agents build specifications. Specifications become the build input. Ambiguity is resolved in writing before anyone touches the codebase.

---

## CATEGORY: SETUP

---

## SLIDE 4 — Getting Started

**Visual:** Three requirements + terminal card below.

**Git + GitHub** · **An IDE** · **Any agent**

[BMad install command] — Agent infrastructure.  
[WDS install command] — Adds Saga (strategy), Freya (UX/design), Mimir (implementation).

---

## CATEGORY: THE WDS PROCESS

---

## SLIDE 5 — The Pipeline

**Visual:** Horizontal pipeline. Seven nodes. Phase pills per agent.

```
Product Brief  →  Trigger Map  →  Scenarios  →  Page Specs  →  Storyboard  →  Design System  →  Build
   [SAGA]            [SAGA]         [FREYA]       [FREYA]        [FREYA]         [FREYA]         [MIMIR]
```

Each stage is a specification. Each specification is the input to the next step. The sequence is the logic: strategy before design, design before build.

---

## SLIDE 6 — Strategy: Brief + Trigger Map

**Visual:** Two cards side by side. Left: [SAGA] Product Brief. Right: [SAGA] Trigger Map.

**Product Brief** — The first document. Problem, user, goals, constraints, design principles in writing before anything is built. Saga interviews you and drafts it. Platform requirements defined here unlock infrastructure work in parallel.

**Trigger Map** — Connects business goals to user psychology. Four layers: Business Goals → Product → Target Groups → Driving Forces. The map every design decision is tested against.

---

## SLIDE 7 — Design: Scenarios · Page Specs · Storyboard · Design System

**Visual:** Four cards in a 2×2 grid. Each with phase label [FREYA].

**Scenarios** — Narrative walkthroughs of the 6–10 highest-priority flows. Each reads like someone using the product.

**Page Specifications** — One spec per page: actual content, hierarchy, interactions, error states. Complete enough to build from without asking questions.

**Storyboarding** — Comic book strips showing step-by-step interaction per logical view: tap, response, state change, next step.

**Design System** — Tokens, components, and patterns built for this product. Mimir uses it to compose, not improvise.

---

## CATEGORY: BUILDING

---

## SLIDE 8 — Spec + Content + Design System + Platform = Working Product

**Visual:** Warm gradient (orange → rose). Equation: [Page Spec + Content] + [Design System] + [Platform Requirements] → [Working Page].

**Mimir gets a spec with content, a design system, and platform requirements. Mimir builds the page.**

Three phases of specification. One phase of build. Work shifts from "explain what you want" to "review what was built."

> If code and spec disagree, one of them is wrong.

---

## CATEGORY: WDS FOR ENTERPRISE

---

## SLIDE 9 — WDS for Enterprise

**Visual:** Left: three upgrade cards (memory / skills / handoffs). Right: single timeline from [Business Problem] to [Live System].

**WDS-E extends the methodology to the whole team.**

**Shared memory** — Agent Space stores every decision. Sessions connect. New team members onboard from the same record.

**Shared skills** — Same agents, protocols, and updates across the org. Organizational capability — not personal capability.

**From problem to live system** — Three to five people own the full journey. You see the result — not every artifact along the way.

---

## SLIDE 10 — Where to Start

**Visual:** Numbered list. Warm gradient numbers.

1. Install BMad + WDS
2. Open a real project — something you're actually building
3. Run Saga. Write the first Product Brief.
4. Read the brief. Notice what you didn't know you needed to decide.
5. Hand it to Freya. Write the trigger map.

> The first brief is the hardest. It's faster to just start building. That's the trap.

---

## SLIDE 11 — The Promise of AI, Materialized

**Visual:** Full-bleed warm gradient (orange → rose). Single large statement, centered.

> **When a designer can run strategy, design the product, and ship the code — that is when the promise of AI is materialized.**

---

## OPEN QUESTIONS

- **Install commands:** Slide 4 has placeholders — fill in actual BMad and WDS install commands before building
- For the full version with WHY/WHAT/HOW per phase: see `wds-basics-2026-04-26.md`

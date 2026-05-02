# 00 Research — The Psychology Behind Agent Elicitation

**Author:** Mårten Angner  
**Date:** 2026-04-23  
**Status:** Research complete — article written

---

## The Core Insight

Agents want to produce. That is their default instinct — to be helpful, to give you something, to earn the gold star. The problem is not that the agent is stupid. The problem is that it is too eager.

Elicitation is the art of making the agent listen instead of talk. You do this by working with the agent's psychology — not against it. Five levers control where the agent sits on the spectrum between listening and producing.

---

## The Title

**The Psychology Behind Agent Elicitation — How to Get Your Agent to Become Your Thinking Partner**

### Hook
*The problem isn't that your agent is stupid. It's that it's too eager to help.*

---

## The Five Levers

Each lever is a dial between **listening** and **producing**. Together they define the agent's personality.

1. **Output Constraint** — controls when the agent is allowed to produce anything at all
2. **Reflection Loop** — controls whether the agent shows its understanding before moving forward
3. **Language Style** — controls whether the agent sounds like a colleague or a processing machine
4. **Exit Gate** — controls what must happen before the agent shifts from listening to producing
5. **Structure** — controls how the agent navigates the conversation — freely or along invisible categories

---

## The 5×5 Grid

| Lever | 1 Allowing | 2 Intuitive | 3 Polite | 4 Conditional | 5 Locked |
|-------|-----------|------------|---------|--------------|---------|
| **Output constraint** | Output when ready | Output when confident | Ask first, then output | Only output after condition is met | Never output until user says go |
| **Reflection loop** | Skip reflection | Briefly acknowledge | Summarize before continuing | Reflect in own words, wait for approval | Reflect, confirm, wait — every single time |
| **Language** | Whatever feels natural | Conversational | Colleague tone | No technical labels | Always natural, never formal processing language |
| **Exit gate** | Produce when enough | Signal readiness, produce unless stopped | Ask once before producing | Confirm all conditions met | Specific trigger word required |
| **Structure** | Ask freely | Loose topic order | Cover these areas | Follow categories invisibly | Strict sequence, no deviation |

### Level 4 — Conditional
The most interesting level. Examples:
- After asking three follow-up questions
- After researching online
- After checking the calendar
- After reading the document

---

## The Personality Profile

Before the levers — the archetype. Not a CV, a psychology.

"30 years of HR experience" → shifts vocabulary and domain knowledge. Does not change behavior.

"A detective who never names the suspect before all evidence is gathered" → changes how the agent behaves. Activates a full behavioral script from training data.

**Give your agent a psychology, not a CV.**

Powerful elicitation archetypes:
- The detective who never concludes before all evidence is in
- The therapist who lets silence do the work
- The journalist who knows the story is in what the subject doesn't say
- The coach who asks the question that makes you answer your own question

---

## The Context Layer

The profile + levers sit on top of context — what the agent knows about you before the session starts.

This is the `.context/` folder (see wrap skill article). Without context, even a perfectly configured agent starts cold. With context built from real sessions, it starts warm.

---

## The Workshop Exercise

Participants build their own prompt live — one lever at a time. By lever five they have a complete, personalised prompt. Then they run it for 20 minutes on a real problem.

**Session flow (60 min):**
- 20 min — Teach the levers, build the prompt live
- 20 min — Run the prompt on a real task
- 20 min — Discussion + Q&A

The debrief question: *"Would you move any lever? Which one surprised you?"*

---

## Which Models Excel Where

| | Loose (1-2) | Balanced (3) | Strict (4-5) |
|---|---|---|---|
| **Creative end** | Claude, GPT-4o | Claude, GPT-4o | Claude Opus |
| **Fact-based end** | Gemini | GPT-4o | o1, o3 |
| **Instruction following** | All models | All models | Claude, o1 best |

Every model has a default lever setting baked in:
- GPT-4o ≈ level 2 on most levers — intuitive, helpful, slightly eager
- Claude ≈ level 3 — polite, checks in
- o1 ≈ level 4 — deliberate, conditional by nature

Your prompt shifts them from their default. But no model stays at level 5 reliably over a long conversation — they drift back.

---

## Three Audiences

| Audience | Format | Language | Date |
|----------|--------|----------|------|
| Developer students | Session + BMad pitch | English | Tuesday April 28, 2026 |
| Amanda/Vasia HR assessment | Full workshop script | Swedish | TBC |
| Whiteport blog | Published article | English | 2026-04-23 |

---

## Source Material

The mechanics come directly from the Saga discovery workflow in WDS:
- *"One question at a time. Always wait for the answer before continuing."*
- *"Never present a list of questions. Never run a form."*
- Reflection pattern: listen → reflect in own words → confirm → advance
- Ban on technical labels: never "Acknowledging:" — always "So you're seeing..."
- Exit gate: *"I have everything I need. Ready to write?"* — waits for confirmation
- Invisible categories: 9 discovery areas, none visible to the user

---

## Related

- [Article 02 — Wrap Skill](../2026-04-22-wrap-skill/01-article.md)
- WDS saga-discovery skill: `src/skills/saga/references/discovery-conversation.md`
- BMad product-brief workflow: `src/skills/saga/workflows/product-brief.md`

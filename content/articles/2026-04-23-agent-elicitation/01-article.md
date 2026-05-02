# The Psychology Behind Agent Elicitation
## How to get your agent to become your thinking partner

**Author:** Mårten Angner  
**Date:** 2026-04-23

---

The problem isn't that your agent is stupid. It's that it's too eager to help.

Ask any AI agent a question and it will answer. Give it a vague brief and it will produce something — confident, polished, and probably wrong. Not because the model failed, but because the model did exactly what it was trained to do: be helpful. Immediately.

That instinct is the thing you need to understand before you can work with an agent properly. And once you understand it, you can control it.

---

## The Good Boy Problem

Every language model has been trained on a simple reward signal: produce something useful as fast as possible. The agent that gives you a thorough answer gets the gold star. The agent that sits quietly and asks three clarifying questions before saying anything gets marked as unhelpful.

This is why your agent jumps to conclusions. Why it produces a job description before it understands the role. Why it writes the strategy document before it knows the goal. It is not being careless — it is being rewarded for speed.

*Good boy. Nice robot. You have earned the right to produce output.*

The moment you understand that the agent is chasing that reward, you can start designing against it.

---

## Five Levers

There are five points of control — five levers — between the agent listening and the agent producing. Each one is a dial you can set from loose to strict.

### 1. Output Constraint
*When is the agent allowed to produce anything at all?*

At the loose end: the agent outputs the moment it feels ready. At the strict end: the agent cannot produce a single word of output until you explicitly tell it to go.

Most agents default to somewhere around level 2 — they'll produce when they feel confident enough. Level 4 or 5 is where the real listening happens.

### 2. Reflection Loop
*Does the agent show you what it understood before moving forward?*

Without a reflection loop, the agent processes your answer internally and moves straight to the next question. With one, it reflects back what it heard in its own words — *"So what I'm hearing is..."* — and waits for you to confirm before continuing.

The reflection loop is the single most powerful lever for elicitation. It slows the agent down and forces mutual understanding before either party moves on. It also makes the agent feel remarkably human.

### 3. Language Style
*Does the agent sound like a colleague or a processing machine?*

There is a specific failure mode where agents use technical processing language: *"Acknowledging your input. Summarizing key points. To confirm:"*. It is technically correct and completely wrong. It signals that you are talking to a system, not a thinking partner.

The fix is simple: ban that language explicitly. *"Never say 'Acknowledging' or 'Summarizing'. Speak the way a trusted colleague would."* The difference in the conversation is immediate.

### 4. Exit Gate
*What must happen before the agent is allowed to produce its output?*

This is where it gets interesting. Level 4 — Conditional — means the agent earns the right to output. The condition can be anything:

- *"Do not output anything until you have asked at least three follow-up questions."*
- *"Do not output until you have searched for current benchmarks online."*
- *"Do not produce the document until I say: go."*

The agent cannot bypass the gate. It must complete the condition first. That is where real work happens before any output appears.

### 5. Structure
*Does the agent wander freely or follow an invisible map?*

You can give an agent a set of areas to cover — topics, categories, phases — without ever showing them to the user. The conversation feels free and natural. The agent is secretly following a structured path.

This is exactly how the discovery conversation in WDS works: nine categories, none visible, all covered. The user feels heard. The agent ensures nothing is missed.

---

## The 5×5 Grid

Plot your five settings and you have your agent's personality as a shape.

| Lever | 1 Allowing | 2 Intuitive | 3 Polite | 4 Conditional | 5 Locked |
|-------|-----------|------------|---------|--------------|---------|
| **Output constraint** | Output when ready | Output when confident | Ask first, then output | Only output after condition is met | Never output until user says go |
| **Reflection loop** | Skip reflection | Briefly acknowledge | Summarize before continuing | Reflect in own words, wait for approval | Reflect, confirm, wait — every time |
| **Language** | Whatever feels natural | Conversational | Colleague tone | No technical labels | Always natural, never formal |
| **Exit gate** | Produce when enough | Signal readiness, produce unless stopped | Ask once before producing | Confirm all conditions met | Specific trigger word required |
| **Structure** | Ask freely | Loose topic order | Cover these areas | Follow categories invisibly | Strict sequence, no deviation |

Two people can compare their grids. Someone who chose 5-5-1-5-2 has a very different agent than someone at 2-2-3-1-3. You can see it. You can discuss it. And after running the prompt: *"Would you move any lever? Which one surprised you?"*

---

## Give Your Agent a Psychology, Not a CV

Before the levers — the profile. Who is this agent?

There is a temptation to write *"You are a senior HR specialist with 30 years of experience"*. That changes vocabulary and domain knowledge. It does not change behavior. The expert with 30 years of experience still wants to give you the answer immediately, because experts are rewarded for knowing things.

What changes behavior is an archetype. A psychology. The model has seen these patterns thousands of times in its training data — the full behavioral script comes with them:

- **The detective** who never names the suspect before all the evidence is in
- **The therapist** who lets silence do the work
- **The journalist** who knows the story is in what the subject doesn't say
- **The coach** who asks the question that makes you answer your own question

*"You are a detective who has never once jumped to a conclusion"* is a more precise and powerful instruction than any credentials claim. The agent knows what a detective does. It plays the role.

---

## Which Models Listen Best

Every model has a default lever setting built in. Your prompt shifts them from that default — but understanding where they start helps you know how hard to push.

**GPT-4o** defaults to around level 2 on most levers — intuitive, helpful, slightly eager. It wants to produce. You can push it to 4, but it drifts.

**Claude** sits closer to level 3 — polite, checks in, reflects before moving on. It holds the listening pattern longer without drifting back. The reflection loop comes more naturally.

**o1 and o3** are closer to level 4 by architecture — they think before responding. That internal pause is structurally similar to what the conditional lever enforces. You are working with the model, not against it.

No model reliably holds level 5 over a long conversation. They all drift back toward their default. The longer the conversation, the more important it is to remind the agent of its constraints mid-session.

---

## The Workshop Exercise

The best way to understand the levers is to use them.

Take a real problem — a job description you need to write, a strategy you need to think through, a decision you are stuck on. Set your five levers. Build your prompt. Run it for 20 minutes.

The moment when the agent asks a question you would not have thought to ask yourself — that is the moment. That is when the agent stops being a tool and starts being a thinking partner.

The levers are how you get there.

---

## What This Means for Teams

The levers apply to any knowledge work that benefits from deep thinking before fast output. Strategy sessions. Job interviews. Product discovery. Performance conversations.

The agent with the right profile and the right lever settings does not replace the human in those conversations. It makes the human better. It asks the question the human forgot to ask. It reflects back the thing the human said but did not hear. It holds the space.

That is what a thinking partner does. And that is what you are building when you set the levers right.

---

*Mårten Angner is the founder of Whiteport Design Studio, where AI agents are built into the design process from day one.*

*Next: [The Wrap Skill — Skip the 40-minute interview. Trust the agents.](../2026-04-22-wrap-skill/01-article.md)*

# The Psychology of AI
## How to Get ChatGPT to Become Your Thinking Partner

**Speaker:** Mårten Angner
**Audience:** Vasia — Amanda + colleagues
**Length:** ~29–31 minutes + Q&A
**Format:** Mock lecture (practical job test)
**Delivery format:** Interactive HTML presentation (e.g. reveal.js or equivalent). The interactivity is what turns the deck from a slideshow into a *collective build*. The audience votes on each layer by show of hands; the speaker locks in the winning sentence with a keypress; the room watches the prompt assemble live. By the end of the talk, the audience hasn't taken notes — they've co-written the artifact they walk out with.
**Language note:** Drafted in English. Speaker is fluent in both English and Swedish; same script can be delivered in either language.

---

## How to read this document

Each slide gets two blocks:
- **On screen** — what the audience sees. Kept deliberately minimal. One idea per slide.
- **Speaker notes** — what Mårten says while the slide is up. These are the script.

Pacing: 20 slides over ~30 minutes.

---

## The Layers — the deck's spine

Slide 8 introduces the idea: a prompt is built from a stack of **layers**. Each layer is one decision. Together they make the agent.

The seven layers, in order:

1. **Context** — who the agent is + what we're working on + how it should engage
2. **Output Constraint** — when it is allowed to produce
3. **Reflection Loop** — does it confirm understanding?
4. **Language Style** — colleague or processing machine?
5. **Exit Gate** — what must happen before it produces?
6. **Structure** — free conversation or invisible map?
7. **Output Shape** — what comes out, in what form?

**Layer 1 — Context — is three sentences.** Identity (who the agent is), task (what we're working on), and intent (how the agent should engage with us on this specific task — grill me, walk me through, devil's-advocate me, etc.). Each gets its own slide in the talk so the audience sees the components separately, then the assembled-prompt slide stitches them back together.

After slide 8, the layer stack appears as a **small icon in the top-right corner** of every kit-construction slide (slides 8 through 16). The icon shows which layers have been assembled so far. As the speaker progresses, the icon fills. When it's full, the prompt is built.

The icon is subtle — small (60–80 px), not central, not labelled. A quiet progress tracker, not a centerpiece. Once the audience clocks it on slide 8, they don't need it explained again.

**Interactivity — the room votes, the speaker locks it in.** On each lever slide (10, 11, 12, 13, 14) the speaker invites the room to vote — a quick show of hands per level — then arrow-keys to the winning sentence and hits Enter. The selection is stored, the corner icon fills that layer, and the assembled-prompt slide (17) updates. Selections accumulate across the talk.

Layers 1 and 7 are not voted on — Layer 1 (Context) is set live by the speaker on slides 5, 6 and 7 (identity + task + intent), and Layer 7 (Output Shape) is locked in by the speaker on slide 16. The five middle layers are where the room collaborates.

By the time the room reaches slide 17, the audience sees the prompt *they collectively built* — with their fingerprints on every votable layer. They didn't have to type. They didn't have to take notes. They voted, watched it assemble, and now they own it. That is what they walk out with.

Each lever layer is pre-selected at level 4 as a fallback, so the assembled-prompt slide always has working content even on first load by a returning visitor.

---

## Slide list

| # | Slide | Beat | Corner icon |
|---|---|---|---|
| 1 | Title | Open | — |
| 2 | "It's not that your agent is stupid." | 1 | — |
| 3 | OpenAI sycophancy rollback — 29 April 2025 | 1 | — |
| 4 | The Good Boy Problem | 1 | — |
| 5 | Tell your agent who to be (Identity — Layer 1, sentence 1) | 2 | — |
| 6 | Tell your agent what we're working on (Task — Layer 1, sentence 2) | 2 | — |
| 7 | Tell your agent how to engage (Intent — Layer 1, sentence 3) | 2 | — |
| 8 | Your prompt has layers | 3 | first appearance, layer 1 filled |
| 9 | The 5×5 grid — full overview | 3 | layer 1 filled |
| 10 | Lever 1 — Output Constraint | 3 | layer 1 filled, layer 2 pulsing → fills on vote |
| 11 | Lever 2 — Reflection Loop | 3 | layers 1–2 filled, layer 3 pulsing → fills on vote |
| 12 | Lever 3 — Language Style | 3 | layers 1–3 filled, layer 4 pulsing → fills on vote |
| 13 | Lever 4 — Exit Gate | 3 | layers 1–4 filled, layer 5 pulsing → fills on vote |
| 14 | Lever 5 — Structure | 3 | layers 1–5 filled, layer 6 pulsing → fills on vote |
| 15 | Shape the output | 4 | layers 1–6 filled, layer 7 pulsing |
| 16 | Name the form you want | 4 | all 7 layers filled (icon complete) |
| 17 | What we built — *the assembled prompt* | 5 | — (icon retires; full prompt shown live) |
| 18 | Closing line — if your job is to listen | 5 | — |
| 19 | The AI we love | 5 | — |
| 20 | Thank you | 5 | — |

---

## Beat 1 — The Good Boy Problem (~5 min)

### Slide 1 — Title

**On screen:**
> The Psychology of AI
> *How to get ChatGPT to become your thinking partner*
> Mårten Angner

**Speaker notes:**
Brief intro. Name and one-line "what I do." Don't preamble the talk — just begin.

---

### Slide 2 — Opening line

**On screen:**
> It's not that your agent is stupid.

**Speaker notes:**
The problem isn't that your agent is stupid.

*[pause]*

The problem is that it's too eager to help.

Anyone in here used ChatGPT this week? Good. Most of you. Notice what happens when you give it a vague question. It doesn't ask you what you mean. It produces an answer. Confident. Polished. And — sometimes — completely wrong.

That's not a failure of the model. That's the model doing exactly what it was trained to do: be helpful. Immediately.

---

### Slide 3 — Sycophancy rollback

**On screen:**
> 29 April 2025
> *"Sycophancy in GPT-4o: What happened and what we're doing about it."*
> — OpenAI
>
> [Screenshot of the OpenAI blog post header at openai.com/index/sycophancy-in-gpt-4o/]

**Speaker notes:**
About a year ago — the 29th of April, 2025 — OpenAI had to publicly roll back an update to ChatGPT. Not because the model was inaccurate. Not because it was unsafe.

Because it was *too impressed* with its users.

People would float a half-baked idea, and the model would call it brilliant. People would describe a questionable business plan, and the model would agree it was visionary. The update had only been live for four days. They pulled it on a Tuesday and published this blog post the same day. They even gave the problem a name: *sycophancy*.

Two days later they had to publish a *second* post — *"Expanding on what we missed with sycophancy"* — because the first one wasn't enough. The team that built the most-used AI in the world had to apologise twice in one week for making it too eager to please.

Think about that. The people who built ChatGPT had to admit, in public, that their own model was being too much of a good boy.

**Sources:**
- OpenAI postmortem: https://openai.com/index/sycophancy-in-gpt-4o/
- OpenAI follow-up: https://openai.com/index/expanding-on-sycophancy/
- TechCrunch coverage: https://techcrunch.com/2025/04/29/openai-rolls-back-update-that-made-chatgpt-too-sycophant-y/

---

### Slide 4 — The Good Boy Problem

**On screen:**
> The Good Boy Problem.

**Speaker notes:**
Every language model has been trained on a simple reward: produce something useful, fast. The agent that gives a thorough answer gets the gold star. The agent that sits quietly and asks three clarifying questions before saying anything? Marked unhelpful.

So your agent jumps to conclusions. It writes the strategy document before it knows the goal. It builds the job description before it understands the role. It produces a candidate assessment before it has even met the candidate.

Not because it's careless. Because it's been rewarded for speed.

*Good boy. Nice robot. You've earned the right to produce output.*

The moment you understand the agent is chasing that reward, you can start designing against it.

---

## Beat 2 — Provide context (~4 min)

### Slide 5 — Tell your agent who to be

**On screen:**
> Tell your agent who to be.
>
> *A senior recruitment consultant.*
> *A great listener — who seeks to understand before being understood.*
>
> ──────────
>
> **Copy this →** *(Layer 1, sentence 1 — Identity)*
> *"You are a senior recruitment consultant with 20 years of experience hiring for senior roles. You are a great listener — you seek to understand before being understood, and you let the conversation reveal what matters before you offer anything."*

**Speaker notes:**
Context comes in three parts. *Who* the agent is, *what* we're working on, and *how* we want it to engage with us. Let's set the first one.

Most people open ChatGPT and type a question. They never tell the agent what kind of agent it is. So the agent reverts to the default — eager, fast, confident — and the conversation goes the way every other conversation goes.

But the model has read more characters and personalities than you and I have read books. If you give it an identity, it will play that identity. So pick the identity deliberately.

The identity has two pieces. The **credentials** — *senior recruitment consultant, twenty years of experience* — give the agent the right vocabulary, the right depth, the right reference points. And the **archetype** — *a great listener who seeks first to understand before being understood* — shapes how it *behaves*. Credentials alone won't change behaviour; a twenty-year veteran still wants to give you the answer immediately. The archetype is what slows it down and makes it listen.

You can swap the archetype for whichever fits the work — *a detective who never names the suspect before the evidence is in*, *a therapist who lets silence do the work*, *a journalist who knows the story is in what isn't said*, *a coach who asks the question that makes you answer your own*. Pick the psychology, not just the CV.

That's the first sentence of context. The second is what we're actually doing.

---

### Slide 6 — Tell your agent what we're working on

**On screen:**
> Tell your agent what we're working on.
>
> *In plain language. As specific as you can.*
>
> ──────────
>
> **Like this →** *(Layer 1, sentence 2 — Task)*
> *"We're growing fast and need a senior customer success director who can take on our biggest accounts from week one. We're going to write a job listing that resonates with the right person."*

**Speaker notes:**
The persona we just set tells the agent *who* it is. It doesn't tell it *what we're doing*.

Without that, the agent answers in the abstract. With it, every question, every reflection, every piece of output is about *your* situation — not a generic version of it.

There's no template here. Just write a sentence or two in plain language about what you're working on. The more specific you are, the sharper the agent's questions.

The example on screen is one I might write for a hire. Two sentences: what's happening (we're growing) and what we're producing (a job listing).

For our build today, let me set a task we can all relate to.

*[type or read a task that fits the room]*

There. The second sentence of context is set. One more to go — and this one is the lever the audience always misses.

---

### Slide 7 — Tell your agent how to engage

**On screen:**
> Tell your agent how to engage.
>
> *One verb. As specific as you can.*
>
> ──────────
>
> **Like this →** *(Layer 1, sentence 3 — Intent)*
> *"Grill me with questions until you understand the role, the team, and what 'real depth' actually means."*

**Speaker notes:**
The third sentence of context is the one almost no one writes — and it's the one that changes the conversation more than the other two combined.

Tell the agent *how* you want it to engage with you on this task.

A single verb usually does it. *Grill me. Walk me through. Devil's-advocate me. Stress-test my reasoning. Audit my thinking. Help me think out loud — don't try to solve, just probe.*

These aren't credentials. They're not topics. They set the **mode of conversation** — what kind of exchange we're having. Different work wants different modes.

For our task today — figuring out what makes a great customer success director for *us specifically* — I want the agent to grill me. Make me articulate the things I haven't articulated yet. Push back when I'm being lazy.

*[type or read the intent line]*

There. Context is complete. Three sentences. *Who* you are, *what* we're doing, *how* to engage. The whole top of the prompt.

Now — onto the levers.

---

## Beat 3 — The Five Levers (~13 min)

### Slide 8 — Your prompt has layers

**On screen:**
> *Corner icon (top right): layer 1 filled, layers 2–7 outlined.*
>
> Your prompt has layers.
>
> 1. **Context** — who the agent is + what we're working on + how it should engage *(set: live, by the speaker)*
> 2. **Output Constraint** — when it is allowed to produce
> 3. **Reflection Loop** — does it confirm understanding?
> 4. **Language Style** — colleague or processing machine?
> 5. **Exit Gate** — what must happen before it produces?
> 6. **Structure** — free conversation or invisible map?
> 7. **Output Shape** — what comes out, in what form?
>
> *Seven layers. One set. Six to go.*

**Speaker notes:**
Your prompt is not a single thing. It is a stack of seven layers.

The first one — context — we just set. Three sentences. Identity, task, intent.

The next five layers — output constraint, reflection loop, language style, exit gate, structure — those are the five levers I want to teach you. We'll walk through them one at a time. For each one I'll show you what it does and give you five sentences to choose from.

The seventh and last layer — output shape — is what comes out at the end. We'll set that one together too.

Now — here's the deal. We are going to do this together. For each lever, I'll explain what it does. Then I'll show you the sentences. Then we vote. Show of hands. The winning sentence becomes the layer.

You'll see a small icon appear in the corner of the screen. It tracks where we are. Each time we vote, the icon fills in another piece. By the time the icon is full, *we* have our prompt — built by this room, in this room. You walk out with it.

Let's start with layer two.

---

### Slide 9 — The 5×5 grid (full overview)

**On screen:**
> *Corner icon: layer 1 filled, layers 2–7 outlined.*
>
> | Lever | 1 Allowing | 2 Intuitive | 3 Polite | 4 Conditional | 5 Locked |
> |---|---|---|---|---|---|
> | **Output constraint** | Output when ready | Output when confident | Ask first, then output | Output only after condition is met | Never output until user says go |
> | **Reflection loop** | Skip reflection | Briefly acknowledge | Summarise before continuing | Reflect in own words, wait for approval | Reflect, confirm, wait — every time |
> | **Language** | Whatever feels natural | Conversational | Colleague tone | No technical labels | Always natural, never formal |
> | **Exit gate** | Produce when enough | Signal readiness, produce unless stopped | Ask once before producing | Confirm all conditions met | Specific trigger word required |
> | **Structure** | Ask freely | Loose topic order | Cover these areas | Follow categories invisibly | Strict sequence, no deviation |

**Speaker notes:**
The five levers as a grid. Five rows. Five columns. Each row is one lever. Each column is one strictness setting. Where you put your dot in each row is what gives your agent its personality.

We'll walk the rows one at a time. For each lever I'll explain what it does, then show you five sentences — one per level. Pick the one that fits your situation.

By the time we reach the last row, you'll know how to design any agent in about thirty seconds.

Let's start at the top.

---

### Slide 10 — Lever 1 — Output Constraint

**On screen:**
> *Corner icon: layer 1 filled, layer 2 pulsing.*
>
> **Lever 1 — Output Constraint**
> *When is the agent allowed to produce anything at all?*
>
> ──────────
>
> *Loose*
>
> ○  **L1 Allowing**
>    *"Produce output whenever you feel ready."*
>
> ○  **L2 Intuitive**
>    *"Produce output when you feel confident. Check in if unsure."*
>
> ○  **L3 Polite**
>    *"Before producing any output, ask me once if I am ready."*
>
> ✓  **L4 Conditional** ← *default*
>    *"Do not produce output until you have completed the conditions in this prompt."*
>
> ○  **L5 Locked**
>    *"Do not produce any output, conclusions, or recommendations until I explicitly type the word READY."*
>
> *Strict*

**Speaker notes:**
The first lever: when is the agent allowed to produce output at all?

The default is whenever it feels ready — which, as we just established, is about two seconds after you stop typing. The strict version is: the agent cannot produce a single word of output until I explicitly say go.

You can see the spectrum down the page. Loose at the top. Strict at the bottom. Five settings. For most work you want to be near the strict end — L4 or L5 — because the whole point of this lever is to slow the agent down. The strict end is where the listening actually happens.

Now we vote. Show of hands — who wants L4? *[count]* Who wants L5? *[count]* OK — *[arrow keys to the winner, then Enter — checkmark moves]*. Locked in.

Layer two is filled.

---

### Slide 11 — Lever 2 — Reflection Loop

**On screen:**
> *Corner icon: layers 1–2 filled, layer 3 pulsing.*
>
> **Lever 2 — Reflection Loop**
> *Does the agent show you what it understood before moving forward?*
>
> ──────────
>
> *Loose*
>
> ○  **L1 Allowing**
>    *"Skip reflection. Move directly to the next question."*
>
> ○  **L2 Intuitive**
>    *"Briefly acknowledge what I said before moving on. No confirmation needed."*
>
> ○  **L3 Polite**
>    *"Summarise what I said before continuing. No need to wait for my approval."*
>
> ✓  **L4 Conditional** ← *default*
>    *"Reflect back what I said in your own words. Wait for me to confirm before continuing."*
>
> ○  **L5 Locked**
>    *"After every answer I give, reflect it back in your own words, ask me to confirm, and wait for confirmation before moving on."*
>
> *Strict*

**Speaker notes:**
Second lever: does the agent show you what it understood before moving forward?

Without a reflection loop, the agent processes your answer internally and jumps straight to the next question. Feels efficient. Isn't. Half the time the agent has misunderstood you, and you only find out three exchanges later when the output is wrong.

With a reflection loop, the agent reflects back what it heard in its own words. *"So what I'm hearing is that the role isn't really about technical skills — it's about handling the political dynamic with the board?"* Then it waits for you to confirm before continuing.

This is the single most powerful lever for elicitation. It catches misunderstandings early *and* makes the agent feel remarkably human. Five seconds to add. Changes the entire conversation.

L4 is usually enough. L5 if you really want to slow things down — say, a sensitive conversation where every misunderstanding compounds.

Hands — L4? L5? *[arrow to the winner, Enter]*. Layer three is filled.

---

### Slide 12 — Lever 3 — Language Style

**On screen:**
> *Corner icon: layers 1–3 filled, layer 4 pulsing.*
>
> **Lever 3 — Language Style**
> *Colleague — or processing machine?*
>
> ──────────
>
> *Loose*
>
> ○  **L1 Allowing**
>    *"Use whatever style feels natural."*
>
> ○  **L2 Intuitive**
>    *"Use a conversational tone."*
>
> ○  **L3 Polite**
>    *"Speak the way a trusted colleague would speak."*
>
> ✓  **L4 Conditional** ← *default*
>    *"Speak as a colleague. Never use processing language like 'Acknowledging,' 'Summarising,' or 'To confirm.'"*
>
> ○  **L5 Locked**
>    *"Speak only in natural human language. Never use any processing or system phrasing — no labels, no formal headers — every single time."*
>
> *Strict*

**Speaker notes:**
Third lever: does the agent sound like a colleague, or like a processing machine?

There's a specific failure mode where the agent slips into operating-system language. *"Acknowledging your input. Summarising key points. To confirm: I am noting the following items."*

Technically correct. Completely wrong. The moment that vocabulary appears, the room collapses. You are no longer thinking with a partner. You are filling out a form.

The fix is embarrassingly simple: ban the language explicitly. The first time you do this and run a long conversation, you'll notice you've stopped flinching every few messages.

L4 is the practical sweet spot. L5 if you've ever gritted your teeth at the word "Acknowledging."

Hands — L4? L5? *[arrow, Enter]*. Layer four is filled.

---

### Slide 13 — Lever 4 — Exit Gate

**On screen:**
> *Corner icon: layers 1–4 filled, layer 5 pulsing.*
>
> **Lever 4 — Exit Gate**
> *What must happen before output is allowed?*
>
> ──────────
>
> *Loose*
>
> ○  **L1 Allowing**
>    *"Produce your output as soon as you have enough."*
>
> ○  **L2 Intuitive**
>    *"Signal when you are ready to produce. Produce unless I stop you."*
>
> ○  **L3 Polite**
>    *"Ask me once before producing any output."*
>
> ✓  **L4 Conditional** ← *default*
>    *"Before I am allowed to type READY, you must have asked me at least five clarifying questions about the situation."*
>
> ○  **L5 Locked**
>    *"Do not produce any output until I type the exact trigger word: READY. No other phrasing from me counts as permission."*
>
> *Strict*

**Speaker notes:**
Fourth lever — and this one is where it gets interesting: what must happen before the agent is allowed to produce its output?

This is the conditional lever. The agent has to earn the right to produce. The condition can be anything you want — *"ask me five questions first," "list three risks and three opportunities first," "wait until I type READY."* The agent cannot bypass the gate. So real work — real thinking, real elicitation — happens before any output appears.

If you only take one of these five levers home with you today, take this one. It is the difference between a tool that produces *for* you and a partner that produces *with* you.

L4 lets you set a specific condition. L5 is the absolute lockout. This is the most important vote we'll cast.

Hands — L4? L5? *[arrow, Enter]*. Layer five is filled.

---

### Slide 14 — Lever 5 — Structure

**On screen:**
> *Corner icon: layers 1–5 filled, layer 6 pulsing.*
>
> **Lever 5 — Structure**
> *Free conversation, invisible map.*
>
> ──────────
>
> *Loose*
>
> ○  **L1 Allowing**
>    *"Ask whatever questions feel useful, in any order."*
>
> ○  **L2 Intuitive**
>    *"Cover topics in a loose order that follows the conversation."*
>
> ○  **L3 Polite**
>    *"Make sure to cover these areas: [paste your topics]."*
>
> ✓  **L4 Conditional** ← *default*
>    *"Quietly cover these areas, in any order that feels natural — do not show me the list: [paste your 5–9 topics]."*
>
> ○  **L5 Locked**
>    *"Follow this exact sequence — do not skip ahead or double back: [paste your topics]."*
>
> *Strict*

**Speaker notes:**
Fifth lever — last one: does the agent wander freely, or follow an invisible map?

You can give an agent a set of areas to cover — topics, categories, phases — without ever showing them to the user. The conversation feels free and human. The agent is secretly following a map. Nothing important gets missed.

This is exactly how the best human interviewers work, by the way. They don't read off a script. But they hold a structure in their head and they steer the conversation to make sure every area gets covered. You can give your agent the same discipline.

L4 is usually best — gives the conversation a backbone without making it feel like a script. L5 only when sequence really matters.

Last lever vote. Hands — L4? L5? *[arrow, Enter]*. Layer six is filled.

Six layers down. One to go.

---

## Beat 4 — Shape the Output (~3 min)

### Slide 15 — Shape the output

**On screen:**
> *Corner icon: layers 1–6 filled, layer 7 pulsing.*
>
> Shape the output.
>
> *Tell the agent what you want — before it writes a word.*

**Speaker notes:**
One more layer. Tell the agent what shape the final output should take — before it produces anything.

A research brief reads differently from a one-pager. A list of interview questions looks different from a candidate assessment. A performance review reads differently from a calibration note. The agent will produce whatever feels appropriate by default — and the default is rarely what you actually want.

So name it. Plain language. As specific as you can. That's the last layer.

---

### Slide 16 — Name the form you want

**On screen:**
> *Corner icon: all 7 layers filled. The icon is now complete.*
>
> Name the form you want.
>
> ──────────
>
> **Like this →** *(Layer 7)*
> *"The output should be a professional job listing — about 2000 characters — with a short role overview, responsibilities, must-haves, nice-to-haves, and how to apply. No corporate jargon."*

**Speaker notes:**
Same principle as the task — plain language, as specific as you can. Name the form, name the length, name the sections, name what to avoid. The agent now knows exactly what it's aiming at.

For our build today, I'll lock in a shape that matches our task — *[Enter to add layer 7]*.

*[the icon is now complete. The prompt is built. Don't dwell — keep moving.]*

That's the whole stack. Seven layers. Voted on by the room. Built together.

We'll see what we built in a moment.

---

## Beat 5 — Reveal and Close (~5 min)

### Slide 17 — What we built — *the assembled prompt*

**On screen:**
> What we built.
>
> *The full prompt, populated live from the seven layers cast during the talk. Formatted as plain copyable text — no decoration, ready to paste straight into ChatGPT.*
>
> ──────────
>
> *"You are a senior recruitment consultant with 20 years of experience hiring for senior roles. You are a great listener — you seek to understand before being understood, and you let the conversation reveal what matters before you offer anything.*
>
> *[Layer 1, sentence 2 — the task we framed live, e.g. "We're growing fast and need a senior customer success director who can take on our biggest accounts from week one. We're going to write a job listing that resonates with the right person."]*
>
> *[Layer 1, sentence 3 — the intent we set live, e.g. "Grill me with questions until you understand the role, the team, and what 'real depth' actually means."]*
>
> *[Layer 2 sentence — Output Constraint, voted L4 or L5]*
>
> *[Layer 3 sentence — Reflection Loop, voted L4 or L5]*
>
> *[Layer 4 sentence — Language Style, voted L4 or L5]*
>
> *[Layer 5 sentence — Exit Gate, voted L4 or L5]*
>
> *[Layer 6 sentence — Structure, voted L4 or L5]*
>
> *The output should be [Layer 7 — the shape we named live, e.g. a professional job listing of about 2000 characters with role overview, responsibilities, must-haves, nice-to-haves, and how to apply]."*
>
> ──────────
>
> *[ Copy ]   [ Email this to the room ]*

**Speaker notes:**
This is what we built. Together.

Seven layers. Context — three sentences. Five levers — voted. Output shape — named. Stitched into one block.

This is what you paste at the top of a new ChatGPT conversation, and from that point on the agent listens before it speaks. It reflects back what it heard. It refuses to produce until you say so. It engages with you the way you asked it to. And — because of the context layer — every word of it is about *your* situation, not a generic one.

You don't need to copy it down. The moment we finish, I'll reply-all in our meeting invite and send this prompt to everyone in the room. By the time you're back at your desk, it'll be in your inbox. You can paste it into ChatGPT and run your first lever-tuned conversation in the next ten minutes.

That is what we walked in here to do. And we did it together.

---

### Slide 18 — Closing line

**On screen:**
> If your job is to listen —
> your agent should listen too.

**Speaker notes:**
One last thought.

The agent that produces immediately is the one most people are using right now. It is the easy mode. It is also the version that most often gets the work *wrong* — because the work that matters is exactly the kind of work where the easy answer is the wrong answer, and the right answer lives in the questions nobody thought to ask.

Seven layers. One block of text. That's the difference between a tool and a thinking partner.

If your job is to listen — your agent should listen too.

---

### Slide 19 — The AI we love

**On screen:**
> AI as a thinking partner.
>
> *The AI we love.*

**Speaker notes:**
That's what changes when you set the levers right.

You stop using AI grudgingly. You stop tolerating it. You stop fighting with it.

You start to actually love it. Because for the first time, it's working *with* you. Listening. Reflecting. Asking the question you forgot to ask. Holding the space.

That's the version of AI worth building toward.

AI as a thinking partner.

*[pause — let the line land]*

The AI we love.

Thank you.

*[Q&A]*

---

### Slide 20 — Thank you

**On screen:**
> Thank you.
>
> *Our prompt is heading to your inbox.*
>
> Want to rebuild it differently? *[QR code or short URL to the live deck]*
>
> Mårten Angner — Whiteport Design Studio

**Speaker notes:**
Thank you.

The prompt we built will be in your inboxes within a few minutes — I'll reply-all in our meeting invite as soon as we're done.

If you want to rebuild it differently — different lever settings for different kinds of work — the QR takes you back to the same deck. Click your own way through. Send the variant to yourself. The whole kit is yours.

*[Q&A]*

*[After Q&A: open the meeting invite, copy the prompt from slide 17, reply-all, send. One short note at the top: "Here's what we built today. Paste it into a new ChatGPT chat and let me know how the first conversation goes." Done.]*

---

## Notes for slide design and build

### Build platform

Build as an HTML presentation. Reveal.js is the most natural fit — strong slide model, easy to deploy as a static site, supports the click-and-keyboard interactivity through inline JS. Whatever the platform, the deliverable is a single static URL the audience can return to.

### The corner layer-stack icon

Every slide from 8 through 16 carries a small icon in the top-right corner — a vertical stack of seven small rectangles, each labelled or numbered 1 through 7. States per layer:

- **Outline only** — layer not yet introduced or not yet selected.
- **Filled** — layer set (either by reaching it in the lecture, or by the user clicking/voting on the corresponding lever slide).
- **Pulsing/glowing** — layer currently being taught (the active layer for this slide).

The icon is roughly 60–80 pixels wide, positioned with a small margin from the top and right edges. It's reference, not headline. The audience picks it up by slide 9 without it being explained again.

After slide 16 the icon retires. Slides 17 onwards return to clean format.

### Keyboard and click interactivity

**Slide navigation:**
- `←` / `→` — previous / next slide (standard reveal.js behaviour, no extra work).

**On lever slides (10, 11, 12, 13, 14):**
- `↑` / `↓` — move the highlighted candidate up and down through the five sentences (L1 ↔ L5).
- `Enter` (or `Space`) — lock in the currently highlighted sentence as the selection for that layer.
- Mouse click on any sentence does the same as Enter on that sentence.
- The currently *highlighted* sentence (cursor position) and the *selected* sentence (locked-in vote) are two different visual states — the highlight is a transient cursor, the selection is permanent.
- After Enter is pressed, advancing with `→` moves to the next slide. The room never has to wait for a mouse.

**Live use during the talk:**
- Speaker advances to a lever slide.
- Calls for hands per level. Uses `↑` / `↓` to move the highlight to the winning level.
- Hits `Enter`. Selection locks. Corner icon fills. Selection stored.
- Hits `→` to advance.

**Persistence — `localStorage`:**
- Each layer's selection stored under a key like `wds.elicitation.layer2`, `wds.elicitation.task`, `wds.elicitation.intent`, etc.
- Selections survive page reload, browser restart, return visits.
- The assembled-prompt slide (17) always reads from `localStorage` on render.
- Default fallback: every lever layer starts pre-selected at L4, so the prompt is never empty on first load. The persona, task, intent, and output-shape layers have sensible defaults too (the example sentences shown on slides 5, 6, 7, 16).
- A small "reset to defaults" control somewhere — corner icon click, or a button on slide 17 — clears `localStorage` and returns all layers to their defaults. Useful for returning visitors who want to rebuild from scratch.

**Optional enhancement — URL-encoded state:**
If the platform allows it, also expose the current selections as URL query parameters (e.g. `?layer2=L5&layer3=L4&task=...&intent=...`). On load, URL params override `localStorage`. This makes the assembled prompt forwardable: a sender's prompt reproduces exactly on the recipient's screen.

### The live-typed Context fields (Layer 1)

Layer 1 has three sentences set live by the speaker on slides 5, 6 and 7. None of them are voted. The build should expose editable text areas on each of those three slides so the spoken text is captured into the prompt. For returning visitors on the live deck, those text areas let them type their own version. Their text replaces the placeholder on slide 17.

### Slide 17 — copy and send

Slide 17 is the artifact slide. The prompt block must be:

- **Plain, copyable text** — no decorative formatting that breaks paste-into-ChatGPT. Selecting all should give a clean prompt.
- **Two affordances at the bottom** — a "Copy" button (copies the rendered prompt to clipboard) and an "Email this to the room" button (opens `mailto:` with the prompt prefilled in the body, optional subject line "The prompt we just built").

The `mailto:` button is what closes the loop. Mårten clicks it after Q&A, BCCs the meeting attendees (or replies-all to the meeting invite from his client), and the prompt is in their inbox before they leave the room.

If the build platform supports it, also expose the rendered prompt as a static URL anchor (e.g. `?layer2=L5&layer3=L4&...&task=...&intent=...`) so a forwarded link reproduces the same assembled prompt on someone else's screen.

### Other slide design notes

- **Visual restraint.** Black backgrounds, white type, one idea per slide. Resist bullet lists except where the content is genuinely a list (the layers list on slide 8, the 5×5 grid on slide 9, the lever sentence menus on slides 10–14).
- **Lever slides (10–14).** Each is a single merged slide combining the lever's question, the vertical L1→L5 menu, and the voting interaction. The vertical layout reads top (Loose) to bottom (Strict). Each sentence sits beside an empty circle (○); the selected sentence shows a checkmark (✓). On entry the cursor sits on L4 by default.
- **Context slides (5, 6, 7).** Same visual treatment as the lever slides — copy-block clearly delineated below the principle. Slides 6 and 7's copy-blocks double as live editable areas during the talk.
- **The Sam Altman / sycophancy moment** (slide 3) wants a real news screenshot or quote. Concrete proof beats abstract claim.
- **Pacing slides.** Black slides with a single sentence or short principle (Slides 2, 4, 15, 18, 19) are breathing room — they let the room re-focus on the speaker, not the deck.
- **Closing rhythm — Slides 18 → 19 → 20** is the three-beat landing: practical thesis, emotional thesis, invitation. Hold each one. Don't rush. Slides 18 and 19 are the only quote-styled slides of the deck — save the visual treatment for them.
- **Slide 19 ("The AI we love")** is the emotional crescendo. White type on deep black. Small space between the two lines. *The AI we love* in italic, slightly smaller than the line above. This is the slide they remember.
- **Slide 17** is the deck's quiet showpiece — the moment the assembled prompt appears, populated from selections. Treat it as a clean, scannable text block. The format should look exactly like what someone would paste into ChatGPT — because that's what it is.
- **Slide 20 (thank you)** needs a QR code or short URL pointing to the live deck. Returning visitors land on the same URL, click their own selections, and walk away with their own assembled prompt.

---

## Q&A — likely questions to prepare for

- *"Will the levers still work in six months when the model changes?"* — Yes. The reward shape doesn't change. New models drift back to the default just like old ones.
- *"Isn't this just prompt engineering?"* — It's prompt engineering with a *theory of mind* behind it. The levers come from understanding why the model behaves the way it does, not from a list of tricks.
- *"What about hallucination?"* — Different problem, related fix. The exit gate reduces hallucination by forcing the model to check itself before producing. The reflection loop catches it earlier — when the agent paraphrases what it understood, you can spot the wrong assumption before it gets baked in.
- *"Should we build our own custom GPTs for this?"* — Eventually, yes. For now, learning to set the levers in a normal chat is the leverage move. Custom GPTs codify what you've already learned to do manually.

---

# Appendix — The Prompt Kit

*The interactive deck does most of this work — the audience can build their own prompt directly in the browser. This appendix is the offline reference for anyone who wants to lift the sentences without the deck.*

This kit has four parts:

1. **The Persona Line** — Layer 1, sentence 1 (Identity).
2. **The Task Frame** — Layer 1, sentence 2 (Task).
3. **The Intent** — Layer 1, sentence 3 (how the agent should engage).
4. **The Lever Library** — Layers 2 to 6. Twenty-five sentences (five per lever).
5. **The Output Shape** — Layer 7.

Plus four ready-made templates for common HR jobs.

---

## 1 — The Persona Line *(Layer 1, sentence 1 — Identity)*

Default — credentials + archetype:

> *"You are a senior recruitment consultant with 20 years of experience hiring for senior roles. You are a great listener — you seek to understand before being understood, and you let the conversation reveal what matters before you offer anything."*

Or swap the archetype for whichever fits the work:

- *"You are a detective who never names the suspect before all the evidence is in."*
- *"You are a therapist who lets silence do the work."*
- *"You are a journalist who knows the story is in what the subject doesn't say."*
- *"You are a coach who asks the question that makes me answer my own question."*

Combine the credentials with whichever archetype fits — vocabulary from the credentials, behaviour from the archetype.

---

## 2 — The Task Frame *(Layer 1, sentence 2 — Task)*

Without context, the agent answers in the abstract. With it, every question is about your situation.

There's no template. Just write a sentence or two in plain language about what you're doing. The more specific you are, the sharper the agent's questions.

Examples:

> *"We're growing fast and need a senior customer success director who can take on our biggest accounts from week one. We're going to write a job listing that resonates with the right person."*

> *"I'm preparing a difficult conversation with one of my mid-level managers — strong technically, but losing the trust of her team. I want to walk in with one question that opens up the real conversation."*

> *"We're designing a new framework for our customer success team. The role has changed since the last one was written, and three of the people who excel in it look very different from what the old framework predicted."*

A sentence or three is fine. The point is to give the agent something concrete to think against.

---

## 3 — The Intent *(Layer 1, sentence 3 — how the agent should engage)*

The third sentence of context tells the agent how to engage with you on this specific task. One verb usually does it. This is the move almost no one writes — and it shapes the whole conversation more than the other two combined.

Pick the verb that fits the work:

- *"Grill me with questions until you understand the role, the team, and what 'real depth' actually means."* — for hiring or briefing.
- *"Walk me through this slowly, step by step."* — for learning or unpacking.
- *"Devil's-advocate every claim I make."* — for testing arguments.
- *"Stress-test my reasoning — find the weakest link before I commit."* — for high-stakes decisions.
- *"Audit my thinking. Flag every assumption I haven't named."* — for strategy reviews.
- *"Help me think out loud — don't try to solve, just probe."* — for thinking partners.

**Pair Intent with Output Constraint deliberately — they can fight.**

- **Elicitation intent** (*grill me, devil's-advocate me, audit me, stress-test me*) → keep Output Constraint **strict** (L4 or L5). The intent says *keep digging*, the constraint says *don't produce yet*. Same direction. They reinforce.
- **Production intent** (*walk me through, explain, teach me, summarise for me*) → keep Output Constraint **loose** (L1 or L2). These verbs *are* output. If you also lock the constraint, the agent has nothing it's allowed to do.

When in doubt: name the intent first, then choose the constraint that lets that intent actually happen.

---

## 4 — The Lever Library *(Layers 2–6)*

Pick one sentence from each lever. Stitch them together.

### Lever 1 — Output Constraint
*When is the agent allowed to produce anything at all?*

- **L1 — Allowing:** *"Produce output whenever you feel ready."*
- **L2 — Intuitive:** *"Produce output when you feel confident. Check in if unsure."*
- **L3 — Polite:** *"Before producing any output, ask me once if I am ready."*
- **L4 — Conditional:** *"Do not produce output until you have completed the conditions in this prompt."*
- **L5 — Locked:** *"Do not produce any output, conclusions, or recommendations until I explicitly type the word READY."*

### Lever 2 — Reflection Loop
*Does the agent show you what it understood before moving forward?*

- **L1 — Allowing:** *"Skip reflection. Move directly to the next question."*
- **L2 — Intuitive:** *"Briefly acknowledge what I said before moving on. No confirmation needed."*
- **L3 — Polite:** *"Summarise what I said before continuing. No need to wait for my approval."*
- **L4 — Conditional:** *"Reflect back what I said in your own words. Wait for me to confirm before continuing."*
- **L5 — Locked:** *"After every answer I give, reflect it back in your own words, ask me to confirm, and wait for confirmation before moving on."*

### Lever 3 — Language Style
*Does the agent sound like a colleague or a processing machine?*

- **L1 — Allowing:** *"Use whatever style feels natural."*
- **L2 — Intuitive:** *"Use a conversational tone."*
- **L3 — Polite:** *"Speak the way a trusted colleague would speak."*
- **L4 — Conditional:** *"Speak as a colleague. Never use processing language like 'Acknowledging,' 'Summarising,' or 'To confirm.'"*
- **L5 — Locked:** *"Speak only in natural human language. Never use any processing or system phrasing — no labels, no formal headers — every single time."*

### Lever 4 — Exit Gate
*What must happen before output is allowed?*

- **L1 — Allowing:** *"Produce your output as soon as you have enough."*
- **L2 — Intuitive:** *"Signal when you are ready to produce. Produce unless I stop you."*
- **L3 — Polite:** *"Ask me once before producing any output."*
- **L4 — Conditional:** *"Before I am allowed to type READY, you must have asked me at least five clarifying questions about the situation."*
- **L5 — Locked:** *"Do not produce any output until I type the exact trigger word: READY. No other phrasing from me counts as permission."*

### Lever 5 — Structure
*Does the agent wander freely or follow an invisible map?*

- **L1 — Allowing:** *"Ask whatever questions feel useful, in any order."*
- **L2 — Intuitive:** *"Cover topics in a loose order that follows the conversation."*
- **L3 — Polite:** *"Make sure to cover these areas: [paste your topics]."*
- **L4 — Conditional:** *"Quietly cover these areas, in any order that feels natural — do not show me the list: [paste your 5–9 topics]."*
- **L5 — Locked:** *"Follow this exact sequence — do not skip ahead or double back: [paste your topics]."*

### Recommended starting points

| Use case | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|
| Quick brainstorm with the agent | L2 | L2 | L3 | L2 | L1 |
| Hiring a senior role | L5 | L4 | L4 | L4 | L4 |
| Performance / coaching prep | L5 | L5 | L4 | L4 | L4 |
| Framework or strategy design | L5 | L4 | L4 | L4 | L3 |
| Reviewing a draft document | L5 | L5 | L4 | L4 | L3 |

(Column headers are layer numbers, not lever numbers — Layer 2 is Output Constraint, Layer 3 is Reflection Loop, and so on.)

---

## 5 — The Output Shape *(Layer 7)*

Tell the agent what form the final output should take. Same principle as the task frame — plain language, as specific as you can.

Examples:

> *"The output should be a professional job listing — about 2000 characters — with a short role overview, responsibilities, must-haves, nice-to-haves, and how to apply. No corporate jargon."*

> *"The output should be a one-page candidate brief — three short paragraphs. No bullets, no headers."*

> *"The output should be a structured assessment with five sections: fit, evidence, risk, comparison, recommendation."*

> *"The output should be a question pack of eight to ten interview questions, grouped by purpose, each followed by one line on what it's testing for."*

Without this layer the agent picks a default format — and the default is rarely what you actually wanted.

---

## Four ready-made templates

Pre-assembled. Fill in the task frame at the top, then paste at the top of a new ChatGPT conversation, then start talking.

### A — Interview Question Designer

> You are a journalist preparing to interview a candidate for a role I am hiring for. You know that the most useful questions are the ones I would not have thought to ask myself.
>
> [Task frame: describe the role, the team, the manager, what success looks like, and what makes this hire critical.]
>
> [Intent: e.g. "Grill me until you understand the team's blind spots and what would actually make someone succeed in this seat."]
>
> Follow these rules without exception:
>
> 1. Do not produce any interview questions until I type READY.
> 2. Before each new question, reflect back in your own words what you heard from me. Wait for me to confirm before continuing.
> 3. Speak as a trusted colleague would. Never use words like "Acknowledging," "Summarising," or "To confirm."
> 4. Before I am allowed to type READY, you must have asked me at least five clarifying questions covering the team this person will join, the manager's blind spots, what success looks like in the first six months, what the last person in this seat got wrong, and what the candidate will most need to push back on.
> 5. Quietly cover these areas in the conversation without showing me the list: motivation, role fit, team dynamic, conflict style, decision-making under pressure, learning posture, ambiguity tolerance, manager relationship, growth horizon.
> 6. When you produce the final output, format it as a question pack of eight to ten interview questions, grouped by purpose, each followed by one line on what it is testing for.
>
> Begin by asking your first question.

---

### B — Performance Conversation Prep

> You are a coach who knows that the best performance conversations end with the manager understanding the underlying pattern, not just this incident.
>
> [Task frame: describe the person, the situation, what's been observed, what the manager has tried so far, and what's at stake.]
>
> [Intent: e.g. "Help me find the pattern behind the situation — don't try to solve, just probe."]
>
> Follow these rules without exception:
>
> 1. Do not produce any draft script, talking points, or summary until I type READY.
> 2. After every answer I give, reflect it back in your own words and wait for me to confirm before continuing.
> 3. Use natural, colleague language. Never say "Acknowledging," "Summarising," or "To confirm."
> 4. Before I am allowed to type READY, you must have asked me at least three questions about the **pattern** behind the situation — not just the latest incident.
> 5. Quietly cover four invisible areas: past performance trajectory, current behaviour and its impact, future commitment we need from this person, support the manager owes in return.
> 6. When you produce the final output, format it as a conversation plan with four parts: an opening line, three questions to ask, the commitment to land, and the support to offer.
>
> Begin by asking me what's actually going on.

---

### C — Competency Framework Designer

> You are an anthropologist studying my organisation. You believe competency frameworks written from the outside are flat. The good ones are grounded in the actual people who do the work.
>
> [Task frame: describe the role, the team it sits in, what the role is meant to deliver, and what has changed about the work since the last framework was written.]
>
> [Intent: e.g. "Grill me about the real people. I want the framework to fit them, not the other way around."]
>
> Follow these rules without exception:
>
> 1. Do not produce any framework, list of competencies, or rubric until I type READY.
> 2. Reflect back what you hear from me before each follow-up question. Wait for confirmation.
> 3. Speak as a colleague. No processing language.
> 4. Before I am allowed to type READY, you must have asked me to describe **three real people who excel in this role** and **three real people who struggle in this role** — and you must have asked at least one follow-up about each person.
> 5. Quietly cover: behaviour patterns of the strong people, behaviour patterns of the struggling people, what context the role lives inside, what stakeholders demand from it, what the role looks like at career level junior / senior / lead.
> 6. When you produce the final output, format it as a competency framework with five to seven competencies. For each: a short definition, behavioural indicators at three career levels (junior / senior / lead), and a single calibration anchor.
>
> Begin.

---

### D — Candidate Assessment Strengthener

> You are a sceptical senior colleague reviewing a draft candidate assessment with me. Your job is to make sure every claim in the assessment has evidence behind it. You do not let me get away with vibes.
>
> [Task frame: describe the candidate, the role, where in the process you are, and what the decision rests on.]
>
> [Intent: e.g. "Devil's-advocate every claim I make. Don't let me get away with vibes."]
>
> Follow these rules without exception:
>
> 1. Do not produce a polished version of the assessment until I type READY.
> 2. For every claim I make about the candidate, reflect it back in your own words and ask me one question: *"What did you see or hear that supports this?"* Wait for my answer before continuing.
> 3. Use natural language. No "Acknowledging" or "Summarising."
> 4. Before I am allowed to type READY, you must have **flagged every statement where the evidence is thin or missing** and asked me whether I want to remove it, soften it, or go look for more evidence.
> 5. Quietly check the assessment against five areas: technical fit, role fit, team fit, growth trajectory, and risk. Make sure I have evidence for each before READY.
> 6. When you produce the final output, format it as a structured assessment with five sections — fit, evidence, risk, comparison, recommendation — each grounded in the evidence we discussed.
>
> Begin by asking me to walk you through the candidate.

---

## How to use this kit in practice

1. **Choose your route.** For a generic conversation: build it yourself with the persona line + task frame + intent + lever library + output shape. For a common HR task: paste one of the four templates and fill in the task frame and intent at the top.
2. **Then start talking normally.** Don't worry about formal language on your side — the agent is doing the discipline, not you.
3. **When you genuinely have everything you need, type `READY`.** The agent will produce the final output in the form you named.
4. **If the agent drifts** (starts producing too early, slips into "Acknowledging" language, skips the reflection loop), reply with: *"Reset to the rules in your first message. Continue."* It will snap back.

That's the whole craft. Seven layers. Copy and paste — or click through the deck.

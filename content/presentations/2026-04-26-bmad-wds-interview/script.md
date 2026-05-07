# WDS × BMad — Video Script
**Thesis:** Everyone does UX backwards. Here's the right order.
**Format:** Brian interviews Mårten · 15–20 min
**Audience:** BMAD community, designers, design-curious developers
**Date:** 2026-04-11 · v3
**Status:** Draft — cold open corrected to reflect Brian as developer, Mårten's actual background

---

## GUEST INTRODUCTION

> *Brian reads this on camera to introduce Mårten before or at the start of the interview.*

**Brian:** My guest today is Mårten Angner. He's a UX designer and digital product manager from Stockholm, Sweden. He started out as a UX designer in the early days of the web in 1999 — an impressive 26 years in the field. Founded Whiteport in 2003 — so we're talking a massive experience in designing sites, apps, and products for clients across many industries.

But what he's probably most known for in this community right now is WDS — the Whiteport Design Studio method. It's a full AI-agent assisted design workflow that runs inside the Bmad method, with specialist agents for strategy, UX, and Design. Mårten built it, uses it with his clients, and now other people — like me — are using it to add stunning designs to their agent built software. 

Here are just a few words from our BMad users on the BMad Discord — link in the description:

dracic writes
I tried stitch without wds, and then using Freya and stitch MCP and I was blown away with the difference. Well, I’m not a designer, and a professional might find plenty of issues with it. But I liked it, and it didn't look like a generic AI product.

Welcome, Mårten.

---

## COLD OPEN [0:00–1:30]

**Brian:** Mårten, I want to start somewhere that I think is going to surprise people. You've built a method that lives in a code repo, runs inside a developer tool, has AI agents passing work between them. And you did this — as a designer. Someone who, when this started, knew Git existed roughly the way most people know that engines exist. You'd seen the word. You weren't under the hood.

**Mårten:** That's accurate. I knew Git was something developers used. I had the most rudimentary coding experience you can imagine. And I thought: I'm a designer, I understand products and people — that's where my value is. The technical side was someone else's job.

**Brian:** And then AI came along and suddenly the technical side was also your job.

**Mårten:** Suddenly I could touch it. Because the barrier wasn't skill anymore — it was thinking. And thinking about products is exactly what I'd spent twenty years doing. So I went in. I built the method inside Claude Code. I built the agents. And somewhere along the way I realised this wasn't just a workflow — it was the clearest expression of something I'd believed for a long time about how design should work.

**Brian:** Which is what?

**Mårten:** That almost everyone does UX backwards.

**Brian:** Talk to me.

**Mårten:** They start with the interface. They sketch, wireframe, prototype — they want it to look good before they know what it's supposed to do. Going from pixels to purpose is putting the cart before the horse. The art form is to start with strategy. Figure out everything you need to know about the business and the users. Then design in scenarios — putting yourself in the user's actual situation. That used to take a long time. But with AI, strategy is enabled tenfold — just like code is. That's what I built the module to capture: the absolute best practices from twenty years of doing this work.

---

## BLOCK 1 — The Backwards Problem [0:45–3:30]

**Brian:** Walk me through what backwards looks like. What does the typical process look like today?

**Mårten:** Someone has an idea. They open Figma. They start placing components. They build something that looks like an app. Then they show it to stakeholders. Stakeholders have opinions. The design changes. Then it goes to developers who have questions that nobody thought about. Back to design. Back to stakeholders. Six weeks later, everyone's exhausted and nobody's sure if they're building the right thing.

**Brian:** Sound familiar to anyone watching?

**Mårten:** And here's the thing — the strategic questions that should have been answered on day one are still unanswered. Who is this actually for? What problem does it solve? Why would someone choose this over doing nothing? Those questions are still floating around as the developers are writing code.

**Brian:** So what's the right order?

**Mårten:** Clarity first. Psychology second. Interaction third. Visual design fourth. Code fifth.

That's WDS. That's the whole method in one sentence. And it sounds obvious when you say it out loud — but almost nobody does it in that order.

---

## BLOCK 2 — Clarity First: The Product Brief [3:30–6:30]

**Brian:** Clarity first. What does that mean in practice?

**Mårten:** It means you don't open a design tool until you can answer three questions. What is this product? Who is it for — and I mean really for, psychologically, not just demographically. And what does the business need it to do?

That's the Product Brief. It's the first phase of WDS. And it sounds almost too simple — but the discipline of committing to those answers before you draw a single screen changes everything downstream.

**Brian:** How does AI change this phase?

**Mårten:** The agent becomes your thinking partner. You don't write the brief alone — you're in a conversation. The agent asks you questions you haven't thought to ask yourself. It pushes back when your answer is too vague. "What do you mean by 'easy to use'? Easy for who? In what situation?"

It's like having a senior strategist in the room who never lets you get away with fuzzy thinking.

**Brian:** And there's a practical output from this that I don't think people expect.

**Mårten:** Yes — and this is one of my favourite things about the method. One output of the Product Brief process is a platform requirements document. Technical requirements. Which means the moment you have clarity on what the product is, you can hand something to developers. The tech team doesn't have to wait for design to finish. They start in parallel.

That's not how most teams work. Most teams are sequential — strategy, then design, then development. WDS collapses that. Strategy produces something developers can act on immediately.

---

## BLOCK 3 — Psychology Second: The Trigger Map [6:30–10:00]

**Brian:** Phase two. You've got your brief. What's next?

**Mårten:** Now you go deep on the people. The Trigger Map.

And this is where the method diverges most sharply from how UX is usually taught. Most UX processes have you create user personas — a name, a photo, a job title, some demographics. That's not psychology. That's a costume.

**Brian:** So what is psychology in this context?

**Mårten:** Two things. What people are moving *toward* — their desires, the future state they want to be in. And what they're moving *away from* — their fears, the pain they're currently in that makes them willing to change.

On the left side of the Trigger Map: the business goals. What does this product need to achieve?
In the centre: the product.
On the right: the users — and for each user, their desires and their fears.

The product sits in the middle because it is the meeting point. Every feature, every screen, every piece of copy has to connect a business goal on the left to a human driving force on the right. If it doesn't do both, it doesn't belong.

**Brian:** And the AI runs this as a conversation?

**Mårten:** The agent interviews you about each persona. It asks you to go deeper. It scores each driving force — how frequently does this come up, how intensely do they feel it, how well can the product actually address it? You end up with a ranked list. Not gut feel. Not a persona poster on the wall. Scored, prioritised psychology you can make design decisions from.

**Brian:** This is the part that most designers skip entirely.

**Mårten:** They skip it because it feels like it belongs to the strategy phase — and they think strategy is someone else's job. But here's what's changed: strategy is now everyone's job. The decision-making process has collapsed. Meetings are too expensive. Designers who can think strategically are worth ten times what they were five years ago. And WDS is the method that gets you there.

---

## BLOCK 4 — Interaction Third: Scenarios [10:00–14:00]

**Brian:** Okay, clarity, psychology — now we get to interaction. Scenarios.

**Mårten:** Scenarios. One user, one moment, one goal. What's the shortest path between where they are and where they want to be?

I call the principle behind this *selective ignorance*. And I think it's one of the most important ideas in the method. You choose, deliberately, not to design for everything. Most products fail not because they do too little — but because they try to do too much. Every extra option is friction for the person who just wants the one thing they came for.

**Brian:** Focus.

**Mårten:** Radical focus. For each scenario, you define one user — from your Trigger Map, so you know their psychology already. One situation — what just happened in their life that brings them to this product right now. One goal — what they need to accomplish.

And then you explore it step by step. What do they see first? What's the first thing they need to understand? What's the first action? What happens next?

**Brian:** And then the agent wireframes it.

**Mårten:** You describe the scenario, the steps, the constraints — and the agent produces a wireframe. Not a polished design. A thinking tool. Something to react to.

Some people prefer to sketch first — by hand, or rough in Figma — and then have the agent respond to their sketch. Others let the agent go first. Both work. What matters is you're not starting from a blank canvas. You're in a conversation that already knows the user's psychology, the business goals, and the interaction flow.

Then you specify. You add components. You connect to your design system. The wireframe becomes a real design — and because you've been explicit about the scenario from the beginning, every component earns its place. Selective ignorance keeps you from adding things that feel nice but serve nobody.

---

## BLOCK 5 — Visual and Code: Forward, Not Backward [14:00–17:00]

**Brian:** Now we're in design and code. What does this look like?

**Mårten:** You take the specified design and you build the page. And this is where the direction matters — you're going *forward*. You're not noodling in Figma and then trying to figure out what it means. You know exactly what it means because you did the thinking first.

You open in Figma — or whatever your tool — and you refine visually. The interaction is already defined. You're making it beautiful and precise. And as you refine, the changes go in two directions: into the code, and back into the design system.

**Brian:** And the backend has been running in parallel this whole time.

**Mårten:** The whole time. The Product Brief gave developers something to work from on day one. By the time the UI is ready, the backend is ready. You wire them together. Then you test on real users.

**Brian:** And the test feeds back into the scenario.

**Mårten:** Exactly. The Trigger Map told you what you thought users wanted. The test tells you if you were right. And what you learn from users goes back into the psychology layer — refining the driving forces, updating the scenarios, sharpening the next iteration.

That loop — psychology to scenario to build to test and back — that's what forwards looks like. Not backwards from pixels. Forwards from purpose.

---

## CLOSE [17:00–18:30]

**Brian:** For the designer watching this who's thinking "I want to work this way" — what's the one shift they need to make?

**Mårten:** Stop starting with the interface.

The interface is the last thing you design, not the first. It's the output of a thinking process — brief, triggers, scenarios. If you start there, you're guessing. You're making it up and hoping it lands.

Start with clarity. Start with the business goal and the human psychology. Let the design emerge from that. Let the AI help you think — not just help you produce.

The designers who figure this out in the next two years are going to be in a completely different league. Because they'll be doing in a week what used to take a quarter — and doing it with the strategic depth that used to require a whole agency.

**Brian:** WDS. Whiteport Design Studio method.

**Mårten:** The right order. Finally.

**Brian:** Links in the description. Let's go.

---

## Production Notes

**YouTube chapters:**
- 0:00 — Everyone does UX backwards
- 0:45 — What backwards looks like
- 3:30 — Phase 1: Clarity — the Product Brief
- 6:30 — Phase 2: Psychology — the Trigger Map
- 10:00 — Phase 3: Interaction — Scenarios
- 14:00 — Phase 4: Visual and code — forward, not backward
- 17:00 — The one shift

**Thumbnail options:**
- "You're doing UX backwards"
- "The wrong order is killing your product"
- "Design starts here. Not in Figma."

**B-roll suggestions:**
- Trigger map poster
- Live Idun/Saga conversation on screen
- Wireframe being generated by agent
- Figma side-by-side with code
- Product Brief document appearing line by line

**Key phrases to land (for editing):**
- "They do UX backwards."
- "Clarity first. Psychology second. Interaction third. Visual design fourth. Code fifth."
- "That's not psychology. That's a costume."
- "Selective ignorance."
- "Forwards from purpose. Not backwards from pixels."

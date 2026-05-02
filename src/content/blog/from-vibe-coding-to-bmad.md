---
title: "Everyone Does UX Backwards. Here's the Right Order."
seoTitle: "Everyone Does UX Backwards — WDS and the Right Order"
publishDate: 2026-04-26T00:00:00.000Z
author: Marten Angner
categories:
  - ai
  - wds
  - design
tags:
  - bmad
  - wds
  - agentic-design
  - ux-design
  - trigger-map
  - design-process
excerpt: "A few days ago I recorded a podcast with Brian Madisson about WDS, agentic design, and what the right design process actually looks like. The thesis we kept coming back to: almost everyone does UX backwards."
featuredImage:
  src: /images/blog/mcp-sucks/bmad-recording.webp
gallery:
  - src: /images/blog/mcp-sucks/bmad-recording.webp
    alt: "Mårten at his desk recording the podcast with BMad — monitor showing the live call, iPad running the presentation"
    type: image
    width: 1080
    height: 1440
    display:
      - gallery
      - share_image
      - archive
      - thumbnail
      - linkedin
offers:
  - title: "Try WDS"
    label: "Free and open source"
    description: "Install WDS, activate Saga, and start designing in the right order. Works inside Claude Code, Cursor, Windsurf, and 16 more AI tools."
    cta: "Get WDS on GitHub →"
    href: https://github.com/whiteport-collective/whiteport-design-studio
---

A few days ago I sat down with Brian Madisson to record a podcast. We talked about WDS — my design module for the BMad method — about agentic development, and about the opportunities and challenges coming for everyone building with AI in the next few months.

Somewhere in the middle, Brian asked me how I got here. The honest answer involves August 2025, a complete career reinvention, and a YouTube video that changed how I think about what I do.

I had spent over twenty years as a UX designer. I understood products. I understood people. The technical side was always someone else's job. Then AI came along and suddenly the barrier to the technical side wasn't skill anymore — it was thinking. And thinking about products is exactly what I'd spent two decades doing.

So I went in. Started in August 2025, full time, learning an entirely new craft from scratch. I knew git existed the way most people know that engines exist — roughly, theoretically, not from under the hood. I started with vibe coding like everyone does. Describe what you want, the AI writes code, keep going.

😤 *Prompting to code is not development. It is a faster way to get into trouble.*

Every new feature broke something old. Context disappeared between sessions. I needed a method — not just a tool. Then I found the BMad method through a video on YouTube. I watched it, downloaded it, ran it the same day, and became a believer before the first session was over.

Many months later, WDS was accepted as the first official community module for BMad — and the official UX approach for the method. But the reason it works is not because of the AI. It is because of the order.

### Everyone does UX backwards

Here is what the typical process looks like. Someone has an idea. They open Figma. They start placing components, building something that looks like an app. They show it to stakeholders. Stakeholders have opinions. Design changes. Then it goes to developers who have questions nobody thought about. Back to design. Back to stakeholders. Six weeks later, everyone is exhausted and nobody is sure they are building the right thing.

The strategic questions that should have been answered on day one are still unanswered. Who is this actually for? What problem does it solve? Why would someone choose this over doing nothing?

Those questions are floating around while developers are writing code.

> Clarity first. Psychology second. Interaction third. Visual design fourth. Code fifth.

That is WDS. That is the whole method in one sentence. It sounds obvious — but almost nobody does it in that order.

### Phase 1 — Clarity: the Product Brief

You do not open a design tool until you can answer three questions. What is this product? Who is it really for — psychologically, not just demographically. And what does the business need it to do?

That is the Product Brief. The AI agent becomes your thinking partner. You are not writing the brief alone — you are in a conversation. The agent asks questions you have not thought to ask yourself. It pushes back when your answer is too vague. *"What do you mean by 'easy to use'? Easy for who? In what situation?"*

It is like having a senior strategist in the room who never lets you get away with fuzzy thinking.

One output of the Product Brief process that people do not expect: a platform requirements document. Technical requirements. Which means the moment you have clarity on what the product is, you can hand something to developers. The tech team does not have to wait for design to finish. They start in parallel. Strategy, design, and development run at the same time — not in sequence.

### Phase 2 — Psychology: the Trigger Map

Most UX processes have you create user personas. A name, a photo, a job title, some demographics.

> That is not psychology. That is a costume.

Psychology is two things. What people are moving *toward* — their desires, the future state they want to be in. And what they are moving *away from* — their fears, the pain they are currently in that makes them willing to change.

The Trigger Map puts the business goals on the left. The product in the centre. The users on the right — and for each user, their desires and their fears. Every feature, every screen, every piece of copy has to connect a business goal on the left to a human driving force on the right. If it does not do both, it does not belong.

The AI agent interviews you about each persona. It asks you to go deeper. It scores each driving force — how frequently does this come up, how intensely do they feel it, how well can the product actually address it. You end up with a ranked list. Not gut feel. Not a poster on the wall. Scored, prioritised psychology you can make design decisions from.

### Phase 3 — Interaction: Scenarios

One user. One moment. One goal. What is the shortest path between where they are and where they want to be?

I call the principle behind this *selective ignorance*. You choose, deliberately, not to design for everything. Most products fail not because they do too little — but because they try to do too much. Every extra option is friction for the person who just wants the one thing they came for.

For each scenario you define one user from your Trigger Map — so you already know their psychology. One situation — what just happened in their life that brings them to this product right now. One goal — what they need to accomplish. Then you explore it step by step. What do they see first? What is the first thing they need to understand? What is the first action?

Describe the scenario and the agent produces a wireframe. Not a polished design — a thinking tool, something to react to. Then you specify. You add components. You connect to your design system. Because you have been explicit about the scenario from the beginning, every component earns its place. Selective ignorance keeps you from adding things that feel nice but serve nobody.

### Phase 4 — Forward, not backward

Now you take the specified design and you build the page. And this is where the direction matters. You are going *forward*. You know exactly what the design means because you did the thinking first.

The backend has been running in parallel since Phase 1. By the time the UI is ready, the backend is ready. You wire them together, test on real users, and what you learn goes back into the psychology layer — refining the driving forces, updating the scenarios, sharpening the next iteration.

> Forwards from purpose. Not backwards from pixels.

### The shift

The designers who figure this out in the next two years are going to be in a completely different league. Because they will be doing in a week what used to take a quarter — and doing it with the strategic depth that used to require a whole agency.

Stop starting with the interface. The interface is the last thing you design, not the first. It is the output of a thinking process: brief, triggers, scenarios. If you start there, you are guessing.

Start with clarity. Let the design emerge from that. Let the AI help you *think* — not just help you produce.

WDS is free, open source, and runs inside your existing AI tools. [The GitHub repo](https://github.com/whiteport-collective/whiteport-design-studio) has the installer. [The Discord](https://discord.gg/gk8jAdXWmj) has the community. And [Brian's channel](https://youtube.com/@BMadCode) has the full conversation if you want to see it in action.

Start with Saga. Tell her what you are building. See what happens.

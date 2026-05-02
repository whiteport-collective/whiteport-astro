---
title: "Slot Machine AI — How I Built a Shared Brain for My Agents"
brand: whiteport
status: published
platforms: [linkedin, blog]
linkedin_post_id: "7441832016897077248"
published_date: 2026-03-23
created: 2026-03-23
author: Mårten Angner
inspired_by: Nate B. Jones (Open Brain / OB1)
---

# Slot Machine AI

## Syfte

Visa att det finns ett bättre sätt att använda AI än "öppna chat, dra i spaken, hoppas på det bästa." Modellerna är kapabla att arbeta autonomt — men vi behandlar dem som engångsverktyg.

## Argumentationsstruktur

```
PROBLEMET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Du öppnar en ny chat.
  Agenten vet ingenting.
  Du briefar. Igen. Och igen.
  Du drar i spaken och hoppas.
  → Slot Machine AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VARFÖR DET HÄNDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Varje chat startar från noll — inget minne
  2. Ingen agent vet vad den förra agenten gjorde
  3. Du är flaskhalsen — allt filtreras genom dig
  → Modellerna KAN jobba autonomt.
    Vi låter dem bara inte.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Första steget: DELAT MINNE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  En databas som alla agenter delar.
  De läser den vid start → vet vad som pågår.
  De skriver till den vid stop → nästa agent tar vid.
  → Slut på briefing. Slut på kontextförlust.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NÄSTA STEG: AGENTER SOM PRATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Meddelanden mellan agenter via databasen.
  Olika modeller som granskar varandras arbete.
  Claude hittar det Codex missar. Och tvärtom.
  → Från slot machine till autonomt team.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEVISET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Agent 1: granskade kod, hittade 5 buggar, fixade, öppnade PR.
  Agent 2: fick samma kod, hittade 4 buggar till.
  Medan agent 1 jobbade: fick meddelande via Design Space.
  Läste det. Agerade. Utan att jag bytte fönster.
  → Inte teori. Igår.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ERBJUDANDET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Ingen produkt. Ingen prenumeration.
  En gratis databas. 15 minuter att sätta upp.
  Ge din agent installationsguiden → klart.
  → Comment "agent space" for the link.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Nyckelpoänger

1. **Slot machine = du drar i spaken varje gång.** Ny chat, noll kontext, hoppas på bra output.
2. **Modellerna är inte problemet.** De kan jobba autonomt. Vi ger dem bara inte förutsättningarna.
3. **Första steget: delat minne.** En databas som agenter läser vid start och skriver till vid stopp.
4. **Nästa steg: agenter som pratar.** Meddelanden mellan modeller. Claude granskar Codex arbete och tvärtom.
5. **Modelloberoende.** Varje modell bygger sitt eget minne — men bara för sina egna agenter. Design Space är ditt. Du äger kontexten. Byt modell när du vill. Kör flera samtidigt. Ingen vendor lock-in.
6. **Konkret bevis:** 5 + 4 buggar hittade av två modeller. Meddelande levererat mitt i en session.
7. **Gratis och enkelt.** Ingen SaaS, ingen prenumeration. 15 min setup.

## Vad läsaren vinner

- **Sluta briefa.** Agenten vet redan vad du jobbade med igår.
- **Dubbel kvalitet.** Två modeller granskar samma arbete — olika blind spots.
- **Du slutar vara flaskhalsen.** Agenterna skickar jobb till varandra utan dig i mitten.
- **Ingen vendor lock-in.** Du äger datan. Byt modell, kör flera, mixa fritt.
- **Arbetet dör inte.** Stäng chatten, öppna en ny, allt finns kvar.
- **15 minuter, gratis.** Supabase free tier + installationsguide.

---

## LinkedIn teaser

Slot machine AI is a necessary evil.

I got tired of opening ignorant agents, pulling the lever, and hoping for the best.

I got inspired by Nate B. Jones who presented the idea of an "open brain" — a database to organize your agents' experiences. And it all took off from there.

In the heart of the concept is a simple database that holds everything your agents need — design decisions, project context, experiment results, and messages to each other. I call mine Design Space.

Now when I start a new chat, my agents already know what's going on. No briefing. No pasting context from the last session. They pick up where the previous agent left off.

Then I built a messaging system so my agents from different models could talk to one another. A proper think tank.

For a while now I've used different models to collaborate on tasks — writing, code, and even legal review. Claude finds things Codex misses. Codex catches what Claude overlooks. They challenge each other, fill gaps, and fix bugs the other can't see.

Yesterday one agent reviewed code, found 5 bugs, fixed them, and opened a pull request. I sent the same code to a different model. It found 4 more bugs. Two models. Different blind spots. Together — nothing slipped through.

While the first agent was working, I sent it a follow-up through Design Space. It showed up right in the conversation. It finished what it was doing, read my message, and acted on it.

That's the shift. Your agents stop being strangers. They remember. They collaborate. They dispatch work to each other.

Not a framework. Not a SaaS product. A free database — run it in the cloud or locally on your own machine. Feed the installation guide to your agent and you're set up in 15 minutes.

Comment "agent space" if you want the link.

---

## Full article

TODO: Installation guide for whiteport.com/blog

## Image

**Output:** `G:/Shared drives/Whiteport Team/WP Communication/2026-03-23 Agent Space/`

### NanoBanana prompt (v2)

```
Deep blue frosted glass chalkboard infographic. Bold creative headline at the top: "SLOT MACHINE AI vs AGENT COLLABORATION weights.

Split composition, two halves with a subtle vertical divider.

LEFT SIDE — "Slot Machine AI": A person actively pulling the lever of a giant slot machine with both hands, body leaning into it, desperate energy. The slot machine reels show random AI chat outputs and error symbols. Scattered question marks and broken chat bubbles around them. Chalk-style illustration, white and light blue chalk lines on deep blue background.

RIGHT SIDE — "Agent Space": A person calmly standing at a transparent glass interface like Minority Report, actively touching and swiping holographic panels showing agent nodes. The agents are connected through glowing lines, passing messages to each other. The person is engaged and in control — commanding, not passive. Small Whiteport logo in the bottom right corner.

Style: editorial chalk illustration on deep blue frosted glass board. White and light blue creative chalk typography. Clean, modern, no frame. Professional infographic feel.
```

**Aspect ratio:** 3:4
**Logo input:** whiteportLogo_2-7A-Dot-Transparent.png

**v3 ändringar:**
- Vänster subheadline: "You are the Bottleneck!"
- Höger subheadline: "You are the Orchestrator!"
- Mindre repetition mellan sidorna
- Whiteport-logga som input image
- Negativt: repeated elements, symmetrical composition

**TODO:** Resultatet ser inte handritattillräckligt ut. Behöver starkare chalk/hand-drawn känsla.

## First comment (post after publishing)

#AIAgents #DesignSpace #ClaudeCode #OpenBrain #AgenticAI
There 
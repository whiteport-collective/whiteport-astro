---
title: "MCP Sucks. I Deleted Them All. So Should You."
brand: whiteport
status: draft
platforms: [blog, linkedin]
sequence: blog-first
author: Mårten Angner
created: 2026-04-20
---

# MCP Servers Suck

## Syfte

Positionera Mårten som en AI-utvecklare som ser vad andra missar — och tar hand om läsaren.

**Ton: Provocera → Empati → Befria.**

Rubriken slår till. Artikeln tar emot läsaren med öppna armar. Tre steg och de är fria.

Tre signaler artikeln ska sända:
- Det här är inte ditt fel — du blev inte informerad.
- Det är fixbart. Idag. Tre steg.
- Mårten har gjort det, det fungerar, du kan göra samma sak.

**Resultat:** Läsaren går från förvirrad och taxerad → informerad och i kontroll.

---

## Argumentationsstruktur

```
PROBLEMET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Du vill använda ett verktyg.
  "This MCP is not loaded, let me install it."
  Du väntar. Startar om Claude.
  Det fungerade inte. Starta om igen.
  → Restart-helvetet
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AVSLÖJANDET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Vet du vad som precis hände?
  Alla dina MCPs laddade ALLA sina funktioner
  in i din kontext — innan du skrivit ett ord.
  27 000 tokens. Betalt. Borta.
  → Du betalar för verktyg du aldrig anropade
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VAD INGEN BERÄTTAR FÖR DIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCP = Model Context Protocol (Anthropic, 2024).
  De sålde dig idén: ett protokoll, alla verktyg, plug and play.
  Det de inte sa: hela verktygskataloger laddas vid varje start.
  Varje MCP. Varje schema. Varje funktion. Varje restart.
  Betalt av dig. Utan att du frågade.
  → Du blev inte informerad. Du blev taxerad.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIXEN — TRE STEG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Oavsett om du använder MCP, CLI eller API —
  alla integrationer ska anropas via scripts.
  Scripts laddas inte in i din kontext.
  De anropas när du behöver dem. Inte annars.

  1. SE   → Mät hur många tokens dina MCPs bränner vid start.
  2. FIXA → Slå in varje integration i ett script. MCP, CLI, API — alla.
  3. LÅS  → Låt dina skills referera till scripts, inte till protokoll.
  → Funkar varje gång. Kostar bara när du använder det.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEVISET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mitt antal: 27 000 tokens per session.
  En väns antal: 61 000 tokens.
  Tre prompter senare: noll protokoll. Noll startavgift.
  → Inte teori. Gjort.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RÖRELSEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mät ditt antal idag.
  Posta det.
  Vi ser hur illa det är därute.
  → Ingen hashtag. Frågan räcker.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Nyckelpoänger

1. **Varje omstart kostar dig.** MCPs laddar allt vid start — igen, och igen.
2. **Idén är bra. Skatten är dold.** MCP är inte fel i sig, men ingen pratar om kostnaden.
3. **27 000 tokens innan första prompten.** Konkret, chockerande, delbart.
4. **Scripts vinner.** Inte för att MCPs är dåliga — för att scripts inte laddar in sig själva i din kontext.
5. **Det är inte en åsikt. Det är ett mätetal.** Mät ditt antal, posta det.

---

## Vad läsaren vinner

- **Ögonöppnaren.** De förstår att de betalat för context de aldrig bett om.
- **En mätmetod.** Tre prompter de kan använda idag.
- **En fix.** Scripts istället för protokoll.
- **En röst.** "Posta ditt antal" — de blir en del av en rörelse.

---

## Öppna frågor för Mårten

- **Titel:** "MCP Servers Suck" (och du är dum om du kör dem) — eller mildare?
- **Ton:** Hur hårt ska "MCPs suck and you're stupid for using them"? Provokativt rubrikhook och sedan mjuknar i brödtexten?
- **Artikel på whiteport.com:** Ja eller nej? Längre version eller håller vi det till LinkedIn + Instagram?
- **Hashtag i CTA:** `#mcp-tax`, `#mcp-detox`, eller inget hashtag i brödtexten?

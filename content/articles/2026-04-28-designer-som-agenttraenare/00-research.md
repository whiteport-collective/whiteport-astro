# 00 Research — Från pixelputtare till agentdirigerare

**Author:** Mårten Angner  
**Date:** 2026-04-28  
**Status:** Research — redo att skriva

---

## Artikelns poäng

Designerns kontrollbehov — varje pixel, varje hörn, varje vy i Figma — är inte ett karaktärsfel. Det är ett yrkeskunnande inbyggt under år. Men det yrkeskunnandet, applicerat på AI-arbetsflöden, blir organisationens flaskhals.

Designern som håller ett prydligt Figma-dokument med järnhand är inte längre en tillgång. De är ett blysänke.

Den nya rollen är agentdirigerare. Inte att rita — att träna, rikta och bedöma.

---

## Argument-kedjan

1. Designers är tränade att kontrollera varje detalj — det är ett hantverk och det har ett värde
2. Men den instinkten, applicerad på AI, skapar en flaskhals ingen annan kan lösa
3. Figma-first är symptomet: alla vyer, alla states, alla annotationer — veckor av arbete innan kod rört användarens device
4. Grundsanningen: pixlar i designprogrammet har noll affärsvärde. Värdet finns först när designen möter användarens enhet
5. AI tänker inte i bilder — att tvinga det att rita i Figma är att kämpa mot verktyget
6. Den erfarne designern behövs mer än någonsin — men i en annan roll
7. "We know what good looks like" — det är expertisens verkliga värde, men det måste appliceras annorlunda

---

## Det skadliga mönstret

**Vad designers gör idag med AI:**
Tittar på när Claude CLI långsamt, objekt för objekt, ritar i Figma som en agentteater med litet värde — medan organisationen väntar på leverans.

**Varför det är fel:**
- Agenten är inte optimerad för att rita i designprogram
- Organisationen väntar på pixlar som inte är leveransvärde
- Designern använder sin tid till att bevaka ett verktyg istället för att tänka

---

## Förr vs Nu

| Förr | Nu |
|------|-----|
| Alla vyer i Figma innan kod | Grov skiss → kod → iteration |
| Design reviews i konferensrum | Designbeslut i dialog med agenten |
| Veckor av polish innan handoff | Fullt och fungerande, snyggt senare |
| Designern ritar varje pixel | Designern sätter principer, agenten itererar |
| Kontroll via dokument | Kontroll via designsystem och guardrails |
| Handoff till utveckling | Kontinuerligt flöde Saga→Freya→Mimir |

---

## Den nya rollen: agenttränarens fyra uppgifter

1. **Definiera mål och riktning** — inte lösningen, målet. Vad ska det uppnå? För vem? Hur vet vi att det lyckades?
2. **Sätta upp förutsättningar** — designprinciper, designsystem, wireframes som grund. Det är agentens "smak".
3. **Bedöma output** — "we know what good looks like". Det är expertisens verkliga värde. Inte att rita, utan att döma.
4. **Släppa taget** — låta agenten iterera självständigt, gå in och korrigera riktning, inte varje pixel

---

## Till kod så fort som möjligt

AI tänker inte i bilder om vi inte tvingar det att jobba på våra villkor.

Logiken: låt AI drömma fram lösningen i dialog, testa principer tidigt i kod, stå ut med att det är fult i början, iterera snabbt, lägg på den visuella touchen sent — inte tidigt.

En design visas i sin rätta miljö: användarens device. Inte i designprogrammet.

Därför: grov skiss → kod → test → iteration → polish. Inte skiss → wireframe → mockup → prototyp → handoff → kod.

---

## Designsystemet som superkraft

Designers som bygger ett ordentligt designsystem gör agenten bättre på att rita snygga skärmar från start.

Det är den smartaste investeringen: istället för att rita varje skärm — definiera systemet som gör alla skärmar bra.

Agenten arbetar inom systemet. Designern uppgraderar systemet.

---

## Riskbilden

Designers som inte adapterar riskerar att:
- Bli flaskhalsen i en process som annars rör sig snabbt
- Se sitt arbete värderas lägre (de ritar vad agenten kunde rita)
- Missa att deras verkliga kompetens — omdöme, smak, förståelse för användaren — är mer värdefull än någonsin, bara i en annan form

---

## WDS-kopplingen

WDS är byggt för det här arbetsättet:
- Saga kör discovery och skapar briefen — ingen Figma-fil behövs ännu
- Freya tar vid med scenarios och wireframes som grund för kod, inte för presentation
- Mimir bygger, verifierar, itererar
- Designsystemet lever i repot, inte i ett designprograms molnfil
- Checkpoints är beslutspunkter, inte presentationer

Designerns roll i WDS: sätta riktning, bedöma output, träna agenterna att bli bättre.

---

## Hooks

1. *"Pixlar i ditt designprogram har noll affärsvärde."*
2. *"Medan du tittar på när Claude ritar i Figma — väntar organisationen på leverans."*
3. *"Du ska inte rita varje hörn. Du ska träna agenten att veta vad bra ser ut."*
4. *"Vi måste gå från kontrollbehov till ledarskap. Det är inte en mjuk förändring."*

---

## Artikelstruktur

1. Hook — agenteatern (Claude ritar i Figma, ingen levererar)
2. Grundsanningen — pixlar har noll affärsvärde
3. Varför Figma-first är skadligt nu
4. Den nya rollen — agentdirigerare, inte pixelputtare
5. De fyra uppgifterna
6. Till kod så fort som möjligt — hur det fungerar i praktiken
7. Designsystemet som superkraft
8. WDS — ramverket för det nya sättet att jobba
9. CTA

---

## Relaterat

- [Idag möten, imorgon mandat](../2026-04-17-avanza-ai-byggdag/01-article.md)
- [Agent Elicitation](../2026-04-23-agent-elicitation/01-article.md)
- WDS Freya-agent och designflödet

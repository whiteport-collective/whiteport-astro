# WO-006 — A11y baseline + prose-fix

**Project:** whiteport-astro  
**Feature area:** Accessibility + audio player styling  
**Owner:** Freya (spec + implementation)  
**Created:** 2026-05-03  
**Status:** Implementerat — pending verification

---

## Syfte

Tre small-scope fixes identifierade vid UX-granskning av WO-001 audio-pipeline:

1. `:focus-visible` saknades i `global.css` — täckte bara sidor med audio
2. AudioPlayer-section saknade `not-prose` — Tailwind prose kunde interfere med player-stilar
3. Enda svenska UI-strängen (`Läs alla relaterade artiklar`) i `<html lang="en">`-dokument saknade `lang="sv"`

---

## Ändringar

### 1. `src/styles/global.css`
Tillägg av global `:focus-visible` regel (wp-red outline, 2px, 2px offset). Gäller alla sidor — inte bara sidor med audio-spelare.

### 2. `src/components/AudioPlayer.astro`
`not-prose` tillagt på `<section class="audio-player">`. Förhindrar Tailwind prose-plugin från att applicera typografi-stilar inuti spel-komponenten.

### 3. `src/layouts/SocialStreamPost.astro`
`lang="sv"` tillagt på `<a>` med texten "Läs alla relaterade artiklar". Screen readers uttalar nu strängen korrekt.

---

## Acceptanskriterier

- [ ] Keyboard-navigation visar synlig focus-ring på alla interaktiva element på alla blog-sidor
- [ ] AudioPlayer-knappar/inputs påverkas inte av Tailwind prose-reset
- [ ] Screen reader läser "Läs alla relaterade artiklar" med svensk röst/uttal
- [ ] Inga nya TypeScript-fel introducerade

---

## Ej i scope

- Sticky player (parkerat → WO-001 Future enhancements)
- 360px dropdown-test (körs efter Codex prod-deploy med Chrome DevTools mobile-emulering)

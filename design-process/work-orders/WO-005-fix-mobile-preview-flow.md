# WO-005-fix: Mobile-Ivonne publishing flow — preview-branch + /publish-live

**Repo:** Mobile-Ivonne skill (whiteport-astro `.claude/skills/`) + ev. agent-space edge fns
**From:** Ivonne (på uppdrag av Mårten)
**To:** Codex
**Priority:** high
**Date:** 2026-05-04

## Bakgrund

WO-005 (mobile-authoring) skrevs ursprungligen runt `draft/<slug>`-branchar + Cloudflare Pages-previews. Mårten har nu låst en enklare arkitektur:

> **Mobile-Ivonne committar alltid till `preview`-branch. Inga draft-branchar. När Mårten säger `/publish-live` mergas `preview` → `master` → live.**

Mårten ska aldrig se branch-namn eller hantera PR:er manuellt. Mobile-Ivonne gör allt rätt automatiskt.

## Goal

Komplett mobil publish-loop utan IDE/dator-beroende:

```
/post (mobil) → commit till preview → astro.whiteport.com uppdaterad
   → Mårten granskar på mobilen
   → /publish-live → master uppdaterad → whiteport.com live
```

## Scope

### 1. Mobile-Ivonne `/post`-flödet (uppdaterat)

- Skapar artikel-fil i `src/content/posts/<slug>.md`
- Committar **direkt till `preview`-branch** (inte draft/<slug>)
- Pushar
- CI (WO-009) bygger + deployar till astro.whiteport.com
- Returnerar `https://astro.whiteport.com/<slug>/` till Mårten via agent_messages
- **Tar bort:** all logik som skapar `draft/<slug>`-branchar
- **Tar bort:** alla referenser till `*.pages.dev`-länkar

### 2. Mobile-Ivonne `/publish-live`-kommando (nytt)

- Bekräftelseprompt: "Publicera <titel> live på whiteport.com? (j/n)"
- Vid `j`:
  1. Öppnar PR `preview` → `master` via `gh` CLI
  2. Auto-mergar PR (squash eller fast-forward beroende på vad som passar)
  3. CI (WO-010) deployar master → whiteport.com
  4. Returnerar `https://whiteport.com/<slug>/` + PR-länk till Mårten
- Vid fel: tydligt felmeddelande med nästa steg (manuellt löste, eller försök igen)

### 3. Notification-flöde

Mobile-Ivonne agerar på notifications från CI:
- "Preview live" → reportera till Mårten med URL
- "Live" → reportera till Mårten med URL + "Klar!"

### 4. Cleanup av WO-005-original

- Markera WO-005-original som ersatt av denna WO
- Rensa eventuell kvarvarande draft-branch-logik
- Uppdatera dokumentation i Mobile-Ivonne-skillen

## Acceptance

Hela flödet från Mårtens telefon, utan dator:

1. `/post "skriv om X"` → preview-länk på astro.whiteport.com inom 2 min
2. Granska på mobilen
3. `/publish-live` → bekräfta → live på whiteport.com inom 3 min
4. **Inga branch-namn, PR-numr eller deploy-detaljer visas för Mårten** — bara URL:er och status

## Dependencies

- **WO-009** (preview-branch + staging-pipeline)
- **WO-010** (master → prod-deploy)
- Mobile-Ivonne har `gh` CLI tillgängligt med rätt auth

## Notes

- Edge case: om någon annan committar till preview samtidigt — Mobile-Ivonne ska kunna pull/rebase och fortsätta
- Edge case: om master har ändrats sedan preview rebasades — `/publish-live` ska kunna hantera det (rebase preview → master innan PR)
- Linjärt flöde är OK: en artikel åt gången. Om Mårten vill skriva flera parallellt — lyft separat

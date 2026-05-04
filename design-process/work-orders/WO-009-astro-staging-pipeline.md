# WO-009: astro.whiteport.com staging-pipeline + Cloudflare Pages cleanup

**Repo:** `whiteport-astro`
**From:** Ivonne (på uppdrag av Mårten)
**To:** Codex
**Priority:** high
**Date:** 2026-05-04

## Bakgrund

Cloudflare Pages sattes upp i WO-003 som preview-CI-mekanism, men har växt till en parallell hosting. **Detta var aldrig sanktionerat som hosting av Mårten.** Fortfarande gäller: hostingen är Hostup. Cloudflare Pages ska bort.

`astro.whiteport.com` finns redan som DNS + Hostup-mapp `/home/astrowhi/public_html` (bekräftat av dig i WO-007-svaret).

## Goal

Etablera ren staging-pipeline:

```
preview-branch → push → CI build → rsync till Hostup astro.whiteport.com
```

Riv all Cloudflare Pages-relaterad infrastruktur.

## Scope

### 1. Skapa `preview`-branch

- Long-lived branch på `whiteport-collective/whiteport-astro`
- Initialt rebased på `master`
- Default-branch förblir `master` (production)

### 2. CI workflow `deploy-staging.yml`

- Trigger: push till `preview`-branch
- Steg:
  1. Bygg Astro-sajten (`npm run build`)
  2. rsync `dist/` till Hostup `/home/astrowhi/public_html/` via SSH
  3. Återanvänd `HOSTUP_SSH_KEY` från WO-002
  4. Notify-meddelande till Mårten via agent_messages när deploy är klar (subject: "Preview live: <commit msg>")

### 3. Riv Cloudflare Pages

- Ta bort Cloudflare Pages-projektet `whiteport-astro`
- Ta bort workflow `cloudflare-pages-preview.yml` från `.github/workflows/`
- Ta bort eventuella `*.pages.dev`-relaterade DNS-poster i Cloudflare
- Ta bort GitHub Actions secrets relaterade till Cloudflare Pages (om inga andra workflows behöver dem)

## Acceptance

- Push till `preview` → astro.whiteport.com uppdateras inom 2 min
- Cloudflare Pages-projekt är borta från Cloudflare-kontot
- `cloudflare-pages-preview.yml` är borttagen från repo:t
- Inga `*.pages.dev`-länkar finns kvar i repo eller dokumentation
- Mobile-Ivonne får notification i agent_messages när staging är deployad

## Dependencies

- WO-002 PR #1 mergad (HOSTUP_SSH_KEY tillgänglig)
- DNS för astro.whiteport.com pekar på Hostup (✅ redan klart)

## Notes

- Astro `output: 'static'` antas — det är vad Hostup-deploy bygger på
- Om någonting i Cloudflare Pages-setupet visar sig vara nödvändigt för annat (t.ex. branch-previews vid PR-review): lyft till Mårten innan rivning

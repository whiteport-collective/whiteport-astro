# WO-010: Production deploy — master → whiteport.com

**Repo:** `whiteport-astro`
**From:** Ivonne (på uppdrag av Mårten)
**To:** Codex
**Priority:** high
**Date:** 2026-05-04

## Goal

Mergad PR till `master` → auto-deploy till whiteport.com (Hostup prod-mapp `/home/whiteport/public_html/`).

Detta är "live"-grinden — när artikeln är godkänd och PR mergad, ska den live på whiteport.com utan manuella steg.

## Scope

### CI workflow `deploy-prod.yml`

- Trigger: push till `master`
- Steg:
  1. Bygg Astro-sajten (`npm run build`)
  2. rsync `dist/` till Hostup `/home/whiteport/public_html/` via SSH (samma SSH-key som WO-009/WO-002)
  3. Auto-rebase `preview`-branchen på `master` efter deploy:
     - `git fetch origin master`
     - `git checkout preview && git rebase master && git push --force-with-lease origin preview`
  4. Notify Mårten via agent_messages: "Live: <commit msg>"

### Edge case-hantering

- Om rebase av `preview` failar (konflikter): notify Mårten, lämna preview orörd. Hen löser manuellt.
- Om rsync failar: rollback inte automatiskt — notify Mårten, behåll föregående prod state via Hostup-versionering om möjligt.

## Acceptance

- Merge PR till `master` → whiteport.com uppdaterad inom 3 min
- `preview`-branchen är auto-rebasad på master efter deploy
- Mobile-Ivonne får notification att live-deploy är klar
- Deploy-loggen visar tydligt vilket commit som deployades

## Dependencies

- **WO-009** (staging-pipeline + HOSTUP_SSH_KEY i miljön)
- **WO-002 PR #1** mergad (om den inte redan är det)

## Notes

- Återanvänd så mycket som möjligt från `deploy-staging.yml` (WO-009) — gemensam helper-action eller composite action om det är trivialt
- Prod-deploys ska aldrig utlösas av annan action än merge till master

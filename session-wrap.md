## Learned
- `astro.whiteport.com` A-record already existed in Cloudflare (proxied) — nslookup via system DNS failed but 1.1.1.1 resolved correctly. Always test with explicit DNS server before assuming record is missing.
- Deploy script (`deploy-astro.cjs`) needs `.env` with `DEPLOY_ASTRO_USER` / `DEPLOY_ASTRO_PASS` — fetch from Bitwarden ("Hostup cPanel — astro.whiteport.com"). `.env` is gitignored, must be created each fresh clone.
- Cloudflare bot protection shows "please wait" to headless browsers (Puppeteer) — real users pass through fine. Not a site issue.
- web247 Agent Space uses a separate Supabase project (`acwnjsdtfwoflndvzabq`) — messages to Wera must go there, not to WDS/Whiteport Agent Space.

## Context
- Visual staging check: user confirmed astro.whiteport.com looks correct in real browser.
- Platform Requirements section added to `design-process/A-Product-Brief/project-brief.md` — documents staging (astrowhi), production (TBD), and email migration plan.
- WO sent to Wera in web247 Agent Space (id: eb60c20c) to create cPanel account for whiteport.com + hello@whiteport.com mailbox.
- `deploy.cjs` is the correct deploy script for production (uses `DEPLOY_USER` / `DEPLOY_PASS`).
- `.env` currently missing `DEPLOY_USER` / `DEPLOY_PASS` — waiting for Wera to return credentials.

## Plan
Deploy whiteport.com as the live public site replacing the old WordPress installation. Remaining: 1) Wera creates cPanel account + returns credentials, 2) fill `.env` with DEPLOY_USER/DEPLOY_PASS, 3) update Cloudflare A-record `@` → 185.113.11.48, 4) run `node deploy.cjs`, 5) update MX records for hello@whiteport.com, 6) cancel Google Workspace.

## Next
When Wera responds with cPanel credentials: fill `DEPLOY_USER` and `DEPLOY_PASS` in `c:/dev/WDS/whiteport-astro/.env`, then run `node deploy.cjs` to deploy to whiteport.com.

## Spec Sync
None

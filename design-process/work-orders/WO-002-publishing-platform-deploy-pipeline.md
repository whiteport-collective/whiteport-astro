# WO-002 — Publishing Platform: Deploy Pipeline (GitHub Actions → Hostup)

**Status:** Ready for Codex (with one input pending from Mårten)
**Project:** Publishing Platform (main track)
**Phase:** 1 (Foundation: deploy pipeline)
**Owner:** Codex
**Created:** 2026-05-02
**Estimated effort:** ½ day
**Related brief:** [`../A-Product-Brief/publishing-pipeline.md`](../A-Product-Brief/publishing-pipeline.md), [`../A-Product-Brief/platform-requirements.md`](../A-Product-Brief/platform-requirements.md)

---

## Goal

Set up GitHub Actions to automatically build the Astro site and deploy it to Hostup whenever code is pushed to `master`. From `git push` to `https://whiteport.com` updated, in under 90 seconds.

This is the **foundation work order** for the publishing platform. Every subsequent feature (Supabase integration, admin UI, audio pipeline, social posting) depends on having an automated production deploy. Without it, every change requires manual build + manual upload — friction that kills mobile-first publishing.

After this ships, Mårten can publish from his phone by editing markdown in Working Copy and pushing to master, and the site updates automatically. That's the **real use case** Mårten described: publish the MCP Sucks article through the new system, prove the loop works, then layer features on top.

---

## Context — why this is the right first task

- The new publishing platform's vision (admin UI, Supabase-driven content, scheduling) all assumes that pushing changes results in a production deploy. Without auto-deploy, none of those features ship value.
- Hostup is already configured and serving whiteport.com; we're not changing the host, just the deploy mechanism.
- The first concrete win Mårten wants: **publish the MCP Sucks article via the new pipeline as proof-of-life.** This WO is the minimal infrastructure to make that possible.
- Compared to starting with Supabase or admin UI: those add complexity. Deploy automation is a single, atomic capability with a clear acceptance test.

---

## Split of work — Mårten vs Codex

### Mårten's tasks (parallel to Codex's coding)

These are setup steps only Mårten can do (find Hostup credentials, choose auth method, add GitHub Secrets). Estimated time: ~15 min total.

| # | Task | Time | When to do it |
|---|------|------|---------------|
| M1 | Log into Hostup control panel | 1 min | Anytime |
| M2 | Find SFTP/SSH section. Determine: does Hostup support **SSH key** auth, or **password-only**? | 3 min | After M1 |
| M3a | **If SSH key supported:** generate an SSH keypair locally (`ssh-keygen -t ed25519 -C "github-deploy-whiteport-astro"`). Upload the **public** key to Hostup (often: SSH Access → Authorized Keys, or similar). | 5 min | After M2 (only if SSH path) |
| M3b | **If password-only:** note the SFTP host, username, and password. Optionally rotate to a new strong password just for deploys. | 2 min | After M2 (only if password path) |
| M4 | Find the absolute path to the web root on Hostup (where whiteport.com is served from — typically `/home/<user>/public_html/` or `/var/www/whiteport.com/`). | 2 min | After M2 |
| M5 | Add GitHub repo Secrets at `https://github.com/whiteport-collective/whiteport-astro/settings/secrets/actions`. **For SSH path:** `HOSTUP_SSH_HOST`, `HOSTUP_SSH_USER`, `HOSTUP_SSH_KEY` (private key, multi-line), `HOSTUP_REMOTE_PATH`. **For password path:** `HOSTUP_SFTP_HOST`, `HOSTUP_SFTP_USER`, `HOSTUP_SFTP_PASSWORD`, `HOSTUP_REMOTE_PATH`. | 3 min | After M3a or M3b + M4 |

### Codex's tasks (no Mårten input needed to start)

Codex starts immediately. The workflow can be written, syntax-validated, and committed without any of Mårten's credentials. The first real test deploy needs M5 done.

### Handoff points

| Codex reaches… | Needs from Mårten | Blocks if missing? |
|----------------|-------------------|-------------------|
| Writing workflow YAML | Nothing | No |
| Linting + syntax validation | Nothing | No |
| Documentation (README, docs/deploy.md) | Nothing | No |
| First test deploy | M5 (GitHub Secrets set) | Yes |
| Verifying whiteport.com updated | M5 + a small test commit on master | Yes — Mårten or Codex pushes; deploy verifies |

If Mårten finishes M1–M5 before Codex finishes coding: zero waiting. If Mårten lags: Codex's work merges into a branch, waits for secrets, then runs the integration test on first push to master after secrets land.

---

## Acceptance criteria

The work order is **done** when all of the following are true:

1. A new file `.github/workflows/deploy.yml` exists in the repo
2. The workflow triggers on push to `master`
3. The workflow runs `npm ci` and `npm run build` successfully on a clean GitHub-hosted runner
4. The built `dist/` directory is uploaded to Hostup via SFTP (or rsync over SSH)
5. The upload targets the correct web root path on Hostup (provided by Mårten)
6. After successful upload, `https://whiteport.com/` serves the freshly built content
7. Total time from push to live: ≤ 90 seconds in p95 (verify with timing logs)
8. Workflow surfaces failures clearly — failed builds and failed uploads both produce actionable error messages in the GitHub Actions UI
9. README updated with: how the deploy works, what triggers it, how to add a new GitHub secret, how to roll back a deploy
10. A successful test deploy is verified by Codex: push a small change (e.g. update a comment in `astro.config.mjs`), watch the Action run, confirm whiteport.com reflects the change

---

## Files affected

### New files
- `.github/workflows/deploy.yml` — the workflow definition
- `docs/deploy.md` (or expand README.md) — operator-facing deploy documentation

### Modified files
- `README.md` — add a "Deployment" section linking to docs/deploy.md
- `.gitignore` — ensure no Hostup-specific files leak into repo (e.g., a `.deploy-temp/` if used)

### Untouched (deliberately)
- The Astro source code itself — the build is already correct; this WO only automates running it
- Hostup server configuration — we use what's there, we don't reconfigure the server
- DNS records — whiteport.com already points to Hostup, no change needed

---

## External dependencies

(See "Split of work" section above for detailed timing of Mårten's tasks. This table summarizes resources.)

| Dependency | Status | Provided by | Required by Codex at... |
|------------|--------|-------------|------------------------|
| Hostup credentials chosen (SSH key or password) | Pending (Mårten task M2) | Mårten | Integration test stage |
| `HOSTUP_*` GitHub Secrets set | Pending (Mårten task M5) | Mårten → GitHub Secrets | Integration test stage |
| Astro build itself works | ✅ confirmed | Already working | n/a |
| GitHub repo admin access (to add Secrets) | Available | Mårten | Mårten task M5 |

**Codex is NOT blocked from starting.** Write the workflow to handle both auth options (use whichever secret is set — branch on `secrets.HOSTUP_SSH_KEY` presence). Mårten provides the actual credentials when ready, before the final integration test step.

---

## Implementation notes

### Workflow structure (sketch)

```yaml
name: Deploy to Hostup
on:
  push:
    branches: [master]
  workflow_dispatch:  # allow manual trigger for testing/rollback

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          # Forward env vars needed by build (e.g. ElevenLabs key from WO-001)
          ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
          ELEVENLABS_VOICE_ID: ${{ secrets.ELEVENLABS_VOICE_ID }}
      - name: Deploy via SSH (if SSH key set)
        if: ${{ secrets.HOSTUP_SSH_KEY != '' }}
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.HOSTUP_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.HOSTUP_SSH_HOST }}
          REMOTE_USER: ${{ secrets.HOSTUP_SSH_USER }}
          TARGET: ${{ secrets.HOSTUP_REMOTE_PATH }}
          SOURCE: dist/
          ARGS: '-rltgoDzvO --delete'
      - name: Deploy via SFTP password (fallback)
        if: ${{ secrets.HOSTUP_SSH_KEY == '' && secrets.HOSTUP_SFTP_PASSWORD != '' }}
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.HOSTUP_SFTP_HOST }}
          username: ${{ secrets.HOSTUP_SFTP_USER }}
          password: ${{ secrets.HOSTUP_SFTP_PASSWORD }}
          local-dir: dist/
          server-dir: ${{ secrets.HOSTUP_REMOTE_PATH }}
          protocol: ftps  # or sftp depending on Hostup support
```

(Codex: refine this — exact action versions, parameters, error handling. Above is a sketch.)

### What about WO-001's audio generation in CI?

Forward `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` as env vars to the build step. If they're not set, WO-001's integration must skip audio generation gracefully (already specified in WO-001 acceptance criterion #6). So this WO doesn't depend on WO-001 being merged first; they integrate cleanly.

### Build output verification

Add a verification step after build:

```yaml
- run: |
    test -f dist/index.html || (echo "Build did not produce index.html" && exit 1)
    test -d dist/blog || (echo "Build did not produce blog directory" && exit 1)
    du -sh dist/
```

Catches the obvious "build appeared to succeed but produced empty output" failure mode.

### Caching for fast builds

Use `actions/setup-node@v4`'s built-in npm cache (already in sketch above). Astro's content cache (`node_modules/.astro`) can also be cached:

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules/.astro
    key: astro-cache-${{ hashFiles('src/content/**') }}
```

Should bring 2nd+ builds from ~90s to ~40s.

### What if the deploy fails halfway?

Hostup serves whatever files are present. A partial upload could leave the site in a broken state. Mitigations:

- Use rsync with `--delete` so removed files are cleaned (not orphaned)
- Use `--delete-after` so deletion happens after successful transfer (not during)
- Optional v2: deploy to a temp dir, then atomic rename. Skip for now — rsync ordering is good enough.

If a deploy genuinely breaks production: rollback by reverting the offending commit on master, push, deploy fires again with previous state.

---

## Test approach

### Pre-merge (Codex can do alone, no Hostup creds yet)

1. Validate workflow YAML syntax: `actionlint .github/workflows/deploy.yml`
2. Run the build job locally: `act -j build-and-deploy --secret-file .secrets.example` (or skip if `act` not installed; just verify yaml is parseable)
3. Inspect: does the workflow handle missing secrets gracefully?

### Post-merge integration test (requires Mårten's secrets)

1. Mårten adds the Hostup secrets to GitHub repo settings
2. Push a small, safe change to master (e.g., update README)
3. Watch the Actions tab: build succeeds, deploy step runs, completes in <90s
4. Verify whiteport.com shows the change (clear cache if needed)
5. Push another change to confirm cache hit on second run is faster
6. Test rollback: revert the test commit, push, confirm site rolls back

### Negative tests

7. Push a syntax-broken Astro file → workflow fails at build step, deploy doesn't run
8. Set a bogus `HOSTUP_SSH_KEY` temporarily → workflow fails at deploy step with clear error

---

## Rollback plan

If the deploy pipeline causes problems:

1. **Soft rollback:** disable the workflow by renaming `.github/workflows/deploy.yml` to `.github/workflows/deploy.yml.disabled` and pushing. No more deploys fire. Site stays as last-deployed state.
2. **Hard rollback:** revert the commit that added `deploy.yml`. Repo back to no-CI state. Mårten can resume manual builds + manual uploads as before.
3. **Roll back a bad deploy specifically:** revert the commit that broke things, push, deploy fires with previous content.

All rollbacks <5 min. No data loss — the workflow only modifies `dist/` on Hostup, which is build output (regeneratable).

---

## Out of scope (explicit — do NOT do these)

- Cloudflare Pages branch previews (separate WO later — Phase 4 in platform requirements)
- Supabase setup or any database work (WO-003+)
- Admin UI (WO-005+)
- Build-step audio generation (WO-001 — separate parallel track)
- DNS or domain configuration changes
- SSL certificate management (Hostup handles this)
- Backup or disaster recovery automation (separate WO later)
- Notifications on deploy success/failure (Slack, email, etc.) — nice-to-have, later

---

## Notes for Codex

- Use the **most stable** GitHub Actions versions available — pinned by major version (e.g. `@v4`, not `@v4.1.2` which can break). Avoid `@latest` or `@main`.
- The deploy step should be **idempotent**: rerunning it with the same dist/ should produce the same site state (rsync semantics).
- Don't include `node_modules/` in the deploy upload (rsync should source from `dist/` only).
- If you discover the Astro build needs additional env vars to succeed in CI (anything from `astro-gdrive.ts` for instance), document them in WO comments and add to the workflow as needed.
- Sanity-check the build size before deploying: if `dist/` is suspiciously small (<1MB), abort the deploy (this is a guard against successful-but-empty builds).
- After completion, update `design-process/_progress/design-log.md` Backlog with `[x] WO-002 — Publishing Platform: deploy pipeline (GitHub Actions → Hostup)`.

---

## What unblocks downstream WOs after this ships

- WO-003 (Supabase schema + Astro content loader) can now ship and be deployed automatically
- WO-004 (Cloudflare Pages branch previews for drafts) can be added in parallel
- All future code work touching Astro can be deployed by `git push` instead of by hand
- Mårten can publish his next article (MCP Sucks or any other) by writing markdown on phone, pushing, and watching it go live in 90 seconds — the **real-use-case proof Mårten requested**

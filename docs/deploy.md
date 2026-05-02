# Deploying Whiteport Astro

Production deploys are handled by GitHub Actions in `.github/workflows/deploy.yml`.
Every push to `master` builds the Astro site and uploads `dist/` to the Hostup
web root for `https://whiteport.com`.

## What Triggers A Deploy

- `push` to `master`: production deploy.
- Manual run from GitHub Actions: useful for rerunning a failed deploy after fixing
  a Hostup credential or for redeploying the current `master` state.

The workflow uses a single concurrency group, so deploys run in order. A newer
push does not cancel an upload already in progress.

## Required GitHub Secrets

All deploy methods require:

```text
HOSTUP_REMOTE_PATH
```

Set one of the two credential groups below.

### SSH Key Deploy

Use this when Hostup supports SSH keys:

```text
HOSTUP_SSH_HOST
HOSTUP_SSH_USER
HOSTUP_SSH_KEY
HOSTUP_REMOTE_PATH
```

`HOSTUP_SSH_KEY` is the private key. Store the public key in Hostup's authorized
keys area.

### SFTP Password Deploy

Use this when Hostup only supports password authentication:

```text
HOSTUP_SFTP_HOST
HOSTUP_SFTP_USER
HOSTUP_SFTP_PASSWORD
HOSTUP_REMOTE_PATH
```

The workflow prefers SSH key deploys when `HOSTUP_SSH_KEY` is present. If it is
missing, it falls back to SFTP password deploy when `HOSTUP_SFTP_PASSWORD` is
present.

## Optional GitHub Variables

The workflow defaults `GDRIVE_STRICT` to `false` so legacy WordPress media 404s
do not block a deploy. Set this repository variable to `true` when the migrated
media set is complete and production builds should fail on missing media.

The build also forwards these optional audio secrets when present:

```text
ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID
```

## Adding Or Updating A Secret

1. Open the repository on GitHub.
2. Go to `Settings` -> `Secrets and variables` -> `Actions`.
3. Select `New repository secret`.
4. Enter the exact secret name and value.
5. Rerun the failed workflow or push a new commit to `master`.

Do not commit Hostup credentials, private keys, `.env` files, or temporary
deploy artifacts to the repo.

## Build Verification

Before upload, the workflow verifies that:

- `npm ci` succeeds on a clean runner.
- `npm run build` succeeds.
- `dist/index.html` exists.
- `dist/blog/` exists.
- `dist/` is at least 1 MB.

The 1 MB guard stops a deploy when the build technically succeeded but produced
an obviously incomplete site.

## Rollback

To roll back a bad deploy, revert the bad commit on `master` and push the revert.
The workflow deploys the reverted site state.

To pause automated deploys, disable the workflow from the GitHub Actions UI or
rename `.github/workflows/deploy.yml` in a follow-up commit.

## Local Checks

Run the site build locally before merging deployment changes:

```sh
npm ci
npm run build
```

If `actionlint` is installed, validate the workflow syntax with:

```sh
actionlint .github/workflows/deploy.yml
```

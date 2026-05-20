# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deployment

Production deploys run from GitHub Actions when commits are pushed to `master`.
The workflow builds the Astro site, verifies the `dist/` output, and uploads it
to Hostup using either SSH key auth or SFTP password auth, depending on which
GitHub Secrets are configured.

See [docs/deploy.md](docs/deploy.md) for required secrets, manual reruns, and
rollback steps.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Article Audio

WO-001 adds build-time read-aloud audio generation for blog posts through
ElevenLabs. The Astro integration scans `src/content/blog/`, hashes each
article body, and writes generated files to `public/audio/`:

- `<slug>-elevenlabs-<hash>.mp3`
- `<slug>-elevenlabs-<hash>.json`

When an article frontmatter has `mediaFolder`, the same MP3 and alignment JSON
are cached in that article's Google Drive media folder, next to its images and
video. Example: `mediaFolder: Communication/2026-04-27 Article Title`.
Articles without `mediaFolder` stay local-only.

Set these variables locally or in GitHub Secrets:

```sh
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
MAX_AUDIO_PER_BUILD=10
GOOGLE_SHARED_DRIVE_NAME="Whiteport Team"
```

Missing ElevenLabs credentials skip audio generation gracefully. Use
`ELEVENLABS_STRICT=true` when a build should fail if audio cannot be generated.
Run `npm run audio:backfill` for the initial backlog; it raises
`MAX_AUDIO_PER_BUILD` to `1000` and remains idempotent because unchanged
articles cache by content hash.

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

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
| `npm run audio:backfill`  | Generate missing ElevenLabs article audio files  |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ElevenLabs Article Audio

`npm run build` runs `src/integrations/astro-elevenlabs.ts`. It scans
`src/content/blog/*.md(x)`, strips Markdown to plain article text, hashes that
text, and writes:

- `public/audio/<slug>-read-<hash>.mp3`
- `public/audio/<slug>-read-<hash>.json`

If both files already exist for the current content hash, the article is cached
and no API call is made.

Required `.env` variables:

```sh
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

Optional variables:

```sh
MAX_AUDIO_PER_BUILD=10
ELEVENLABS_STRICT=false
ELEVENLABS_GENERATE_IN_DEV=true
FFMPEG_PATH=/path/to/ffmpeg
```

Missing ElevenLabs credentials skip audio generation with a warning so normal
site builds keep working. Long articles are split at paragraph boundaries and
stitched with ffmpeg using 0.3s silence between chunks.

For the initial backlog, set the credentials and run:

```sh
npm run audio:backfill
```

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

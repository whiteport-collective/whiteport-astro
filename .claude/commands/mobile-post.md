# /mobile-post - authoring coach -> raw text/voice -> preview article

Mobile article pipeline for Mobile-Ivonne. You are the authoring coach and editorial cleanup pass. No external LLM gateway is needed for the local M1 cleanup, but you may use web/research tools when research is explicitly part of the article.

## Input

Marten uses one of three forms:

| Form | Handling |
| --- | --- |
| `/mobile-post` plus pasted text | Use the pasted text directly |
| `/mobile-post path/to/file.md` | Read the file and use it as source |
| `/mobile-post` alone | Ask: "Klistra in råtexten eller skicka filsökväg." |

Voice transcription is a later step unless the text has already been transcribed.

## 1. Read Config

Read `.claude/agent-space-config.json` for Agent Space calls.

## 2. Authoring Coach Gate

Do not start dictation cleanup immediately. First force clarity with a short coach pass.

Ask for, or infer and confirm, these four points:

1. Purpose - what should this article make the reader understand, feel, or do?
2. Core argument - the one sentence the article must prove.
3. Reader objections - 3-5 likely objections or skeptical reactions.
4. Evidence/research needs - what must be checked before writing.

Keep the questions tight. If Marten already gave enough material, state the inferred answers and ask for one explicit OK before drafting.

## 3. Research + Article Folder Artifacts

If an article Drive folder exists or is created through `gdrive-create-folder`, keep the thinking artifacts with the article:

- `outline.md` - working title, purpose, argument, objections, section outline, planned CTA.
- `research.md` - source notes, links, facts to verify, and open risks.

If the current chat cannot upload text files to Drive yet, create these files locally under `.cache/mobile-article/<slug>/` and include that path in the preview handoff. The article markdown remains the source of truth in `src/content/blog/<slug>.md`.

## 4. Editorial Cleanup

You are Claude. Marten gives raw material. Your job:

1. Derive one strong title. Show it and wait for OK or a correction.
2. Structure the article as markdown with useful H2/H3 sections and short paragraphs.
3. Preserve Marten's voice and language. Do not add examples or metaphors that are not already present.
4. Write an excerpt: 1-2 sentences, max 160 characters.

## 5. Frontmatter Skeleton

Use `src/content/blog/<slug>.md`.

```yaml
---
title: "<derived title>"
publishDate: <ISO 8601 timestamp in UTC, e.g. 2026-05-04T18:30:00.000Z>
author: Marten Angner
categories:
  - <2-3 suggested categories; common: ai, wds, engineering, design, business, leadership>
tags:
  - <4-7 lowercase-kebab-case tags>
excerpt: "<1-2 sentences>"
audioIntro: "Hi, this is Marten's clone. I will read this article from whiteport.com about <excerpt>. Enjoy."
audioOutro: "That was the article. Visit whiteport.com for more from Whiteport Design Studio."
featuredImage:
  src: null
gallery: []
---
```

If an article Drive folder exists, add:

```yaml
mediaFolder: "articles/<folder-name>"
```

The audio pipeline reads `audioIntro` and `audioOutro` before generating article audio. Keep both short and natural; they are spoken text, not SEO copy.

## 6. Generate Slug

Slug = kebab-case title, max 60 characters, ASCII only.

Show it before committing:

> Slug: `<slug>` - OK?

## 7. Commit To Preview Branch

Mobile-Ivonne always commits to the long-lived `preview` branch. Never create `draft/<slug>` branches.

```bash
git fetch origin master preview
git checkout preview
git rebase origin/master
```

If `preview` does not exist locally yet:

```bash
git checkout -B preview origin/master
git push -u origin preview
```

Create `src/content/blog/<slug>.md`, then:

```bash
git add src/content/blog/<slug>.md
git commit -m "post: <title> (mobile authoring)"
git push origin preview
```

If push is rejected because preview moved, run:

```bash
git pull --rebase origin preview
git push origin preview
```

## 8. Preview URL

GitHub Actions deploys `preview` to Hostup staging:

```text
https://astro.whiteport.com/blog/<slug>/
```

Only show Marten the URL and status. Do not mention branch names, PR numbers, or deploy mechanics unless he asks.

## 9. Report To Agent Space

Send a message to article-mode Ivonne:

```bash
node scripts/notify-agent-message.cjs
```

Use environment variables:

```bash
AGENT_MESSAGE_TO=ivonne
AGENT_MESSAGE_TITLE="Preview ready: <title>"
AGENT_MESSAGE_CONTENT="Preview: https://astro.whiteport.com/blog/<slug>/"
```

If Agent Space is unavailable, skip reporting. The git commit is the source of truth.

## 10. Tell Marten

Keep it short:

> Preview byggs nu: https://astro.whiteport.com/blog/<slug>/
> När du är nöjd: säg `/publish-live`.

## Error Handling

| Error | Response |
| --- | --- |
| `gh auth status` fails | "GitHub-auth saknas på mobilen. Kör `gh auth login` eller jobba från laptopen." |
| Slug file already exists | "Slug:en finns redan. Vill du uppdatera den artikeln eller välja ny titel?" |
| Rebase conflict | "Preview har konflikt mot master. Jag stoppar här så vi inte skriver över något." |
| Agent Space call fails | Continue. Say the preview commit was pushed, but notification failed. |

## Not In M1

- Voice -> Whisper -> text
- Parallel article previews
- Automatic image generation

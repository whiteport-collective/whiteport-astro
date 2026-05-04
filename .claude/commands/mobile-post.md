# /mobile-post - raw text/voice -> preview article

Mobile article pipeline for Mobile-Ivonne. You are the editorial cleanup pass. No external LLM gateway is needed for M1.

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

## 2. Editorial Cleanup

You are Claude. Marten gives raw material. Your job:

1. Derive one strong title. Show it and wait for OK or a correction.
2. Structure the article as markdown with useful H2/H3 sections and short paragraphs.
3. Preserve Marten's voice and language. Do not add examples or metaphors that are not already present.
4. Write an excerpt: 1-2 sentences, max 160 characters.

## 3. Frontmatter Skeleton

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
featuredImage:
  src: null
gallery: []
---
```

If an article Drive folder exists, add:

```yaml
mediaFolder: "articles/<folder-name>"
```

## 4. Generate Slug

Slug = kebab-case title, max 60 characters, ASCII only.

Show it before committing:

> Slug: `<slug>` - OK?

## 5. Commit To Preview Branch

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

## 6. Preview URL

GitHub Actions deploys `preview` to Hostup staging:

```text
https://astro.whiteport.com/blog/<slug>/
```

Only show Marten the URL and status. Do not mention branch names, PR numbers, or deploy mechanics unless he asks.

## 7. Report To Agent Space

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

## 8. Tell Marten

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

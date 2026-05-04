# WO-011 - Authoring Coach Flow

**Project:** whiteport-astro  
**Feature area:** Publishing pipeline - V9 Article Authoring Coach  
**Owner:** Freya (requested spec) / Codex (M1 implementation)  
**Created:** 2026-05-04  
**Status:** M1 implemented

---

## Purpose

Before Mobile-Ivonne turns raw dictation into an article, she should force the article to earn its shape:

- purpose
- core argument
- reader objections
- research needs

The result is less "cleaned transcript", more deliberate article.

---

## M1 Implementation

M1 is implemented in `.claude/commands/mobile-post.md`:

1. `/mobile-post` starts with an Authoring Coach gate before cleanup.
2. It requires or infers purpose, core argument, objections, and research needs.
3. It defines two companion artifacts for the article folder:
   - `outline.md`
   - `research.md`
4. If Drive text upload is not available, artifacts are written locally under `.cache/mobile-article/<slug>/`.
5. The frontmatter skeleton now includes `audioIntro` and `audioOutro`.

The build-time audio pipeline reads `audioIntro` and `audioOutro` from article frontmatter and includes them in the generated ElevenLabs speech text.

---

## Acceptance Criteria

- [x] `/mobile-post` no longer starts directly with cleanup.
- [x] Coach pass covers purpose, argument, objections, and research needs.
- [x] `outline.md` and `research.md` are part of the article handoff contract.
- [x] `audioIntro` and `audioOutro` are accepted by the blog content schema.
- [x] ElevenLabs audio generation includes optional intro/outro text in the spoken article hash.

---

## Later

- Upload `outline.md` and `research.md` directly into the Drive article folder when `gdrive-upload-text` exists.
- Add an article-mode command dedicated to research-only preparation.
- Let the audio pipeline fall back to a generated default intro/outro when frontmatter omits them.

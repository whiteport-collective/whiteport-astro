# Workflow 13: Mobile Post

Turn raw text or a voice recording into a published blog draft with a preview URL — under 5 minutes.

**Spec:** `design-process/work-orders/WO-005-mobile-authoring.md`

---

## Trigger

`MP` or fuzzy match on `mobile-post`, `post`, `draft`

---

## Step 1 — Detect Input Format

Ask the user for content if not already provided. Detect format automatically:

| Input | Detection | Action |
|-------|-----------|--------|
| Audio file (m4a/wav/ogg) | File extension or MIME type | → Step 2 (Whisper) |
| Raw text / bullet list | Plain text, no frontmatter | → Step 3 (LLM cleanup) |
| Half-finished markdown | Has `---` frontmatter block | → Step 4 (frontmatter completion) |

If format is ambiguous, ask once: "Is this a voice file, raw text, or a markdown draft?"

---

## Step 2 — Voice Transcription (M2 flow)

*Skip to Step 3 if input is text.*

Transcribe the audio file via Whisper:

```bash
# Via tool-openai (preferred) or contact-ai with Whisper capability
# Pass the audio file, get back a transcript string
```

- Model: `whisper-1`
- Language: auto-detect (Mårten records in Swedish or English)
- Output: raw transcript text → continue to Step 3

---

## Step 3 — LLM Cleanup

Transform raw transcript or text into a well-formatted markdown blog post.

**Prompt to LLM (via tool-anthropic or contact-ai):**

```
You are editing a blog post for Mårten Angner at Whiteport. 

Input: [raw text or transcript]

Task:
1. Write a clear, engaging blog post in Mårten's voice — direct, professional, occasionally personal
2. Structure with an intro, 2-4 body sections (use ## headings), and a short closing
3. Keep the author's words where they work; clean up verbal tics and run-ons from transcription
4. Derive a clear title from the content
5. Suggest 2-4 relevant tags from: branding, ux-design, visual-design, web-development, e-commerce, frontend-development, development, mobile-app, saas, low-code, social-media, product-management, wordpress, strategy, process, tools, AI, design
6. Write a 1-2 sentence description for SEO

Output ONLY valid markdown with this exact frontmatter:
---
title: "<derived title>"
description: "<1-2 sentence SEO description>"
pubDate: <today's date in YYYY-MM-DD>
author: marten
tags: [tag1, tag2]
heroImage: null
socialPosts: []
---

[body content]
```

Show the draft to the user. Ask: "Looks good? Or any changes before I commit?"

Wait for confirmation or corrections. Apply corrections if requested, then proceed.

---

## Step 4 — Frontmatter Completion

*Only for inputs that already have a frontmatter block.*

Check for missing or placeholder fields:
- `title` — required, suggest if missing
- `description` — required, suggest if missing
- `pubDate` — default to today if missing
- `author` — default to `marten`
- `tags` — suggest 2-4 if empty array
- `heroImage` — leave as `null`
- `socialPosts` — leave as `[]`

Show the completed frontmatter to the user for review, then proceed.

---

## Step 5 — Create GitHub Draft Branch

Derive the slug from the post title (kebab-case, max 60 chars, no special chars).

```bash
# Get current master SHA
MASTER_SHA=$(gh api repos/whiteport-collective/whiteport-astro/git/ref/heads/master --jq '.object.sha')

# Create draft branch
gh api --method POST repos/whiteport-collective/whiteport-astro/git/refs \
  -f ref="refs/heads/draft/<slug>" \
  -f sha="$MASTER_SHA"
```

If branch already exists, append `-2`, `-3`, etc. until unique.

---

## Step 6 — Commit the Draft

Encode the markdown file as base64 and commit via GitHub API:

```bash
CONTENT=$(echo "<markdown-content>" | base64 -w 0)

gh api --method PUT \
  repos/whiteport-collective/whiteport-astro/contents/src/content/blog/<slug>.md \
  -f message="draft: <title> (mobile authoring)" \
  -f content="$CONTENT" \
  -f branch="draft/<slug>"
```

Confirm commit SHA to user: "Committed ✓ — waiting for CI to build preview..."

---

## Step 7 — Wait for Preview URL

CI triggers automatically via `cloudflare-pages-preview.yml` (WO-003).

Poll the GitHub API for the deployment status:

```bash
# Check commit status / check runs
gh api repos/whiteport-collective/whiteport-astro/commits/<sha>/check-runs --jq '.check_runs[] | {name, status, conclusion, html_url}'
```

- Poll every 30 seconds, up to 5 minutes
- When `status: completed` and Cloudflare Pages check found → extract preview URL from `html_url` or output_url
- If timeout: report the branch name, tell user to check GitHub Actions manually

---

## Step 8 — Deliver Preview URL

Report to user:

```
✅ Draft ready!

📝 Branch: draft/<slug>
🔗 Preview: <CF-pages-url>

Frontmatter to review:
- title: "<title>"
- tags: [tag1, tag2]
- pubDate: <date>
- heroImage: null (add before merge)

Open on mobile to review. Send corrections back when ready.
```

Also send via agent-messages:

```json
{
  "action": "send",
  "from_agent": "ivonne",
  "to_agent": "marten",
  "subject": "Preview klar: <title>",
  "content": "Branch: draft/<slug>\nPreview: <CF-pages-url>\n\nFrontmatter att granska:\n- title\n- tags\n- pubDate",
  "message_type": "notification",
  "topics": ["mobile-post", "preview"]
}
```

---

## Error Handling

| Error | Action |
|-------|--------|
| Whisper fails | Report error, ask user to paste transcript manually |
| LLM cleanup fails | Report error, show raw input, ask user to edit manually |
| Branch creation fails (name conflict) | Try slug with suffix (-2, -3) |
| Commit fails | Show error message, ask user to retry |
| CI timeout (>5 min) | Report branch name + SHA, tell user to check GitHub Actions |
| Design Space unreachable | Tell user immediately, continue with GitHub flow |

---

## Milestones

- **M1** (current): Text input → preview URL
- **M2** (next): Voice input → Whisper → M1
- **M3** (future): `/mobile-post` slash command in martens-documents

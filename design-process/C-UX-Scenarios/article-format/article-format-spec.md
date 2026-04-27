# Page Specification: Article Format

**Page:** Blog Post / Article
**Layout:** SocialStreamPost (existing)
**Scope:** Content area only — hero, sidebar, nav, and footer unchanged
**Designer:** Freya
**Date:** 2026-03-27
**Status:** Draft specification

---

## Problem Statement

The current article body renders markdown as a single undifferentiated column of text. For short posts this is fine. For long-form articles with distinct sections (like the "Lessons Learned" piece with 8 lessons), the format falls apart:

- Sections run together with no visual separation
- Key insights (blockquotes) look like regular indented text
- No way to navigate between sections in a long article
- No breathing room — the eye has nowhere to rest

The article *content* is strong. The *format* doesn't serve it.

---

## Design Principles

1. **Sections are the unit of reading.** Each h3 section becomes a visually distinct content block. Readers scan, pick one, read deep.
2. **Insights earn visual weight.** Blockquotes are the article's money quotes — they need to look like it.
3. **White space is structure.** Generous spacing between sections replaces the need for decorative dividers.
4. **The format serves all articles.** This isn't a one-off layout for lessons-learned. It's how every long-form article renders.
5. **Progressive enhancement.** Short posts (no h3 sections) render as clean prose. Long posts get section cards and TOC automatically.

---

## Page Structure

```
1. Breadcrumbs
2. Article main image
3. Tags, date, author
4. Article teaser
5. Article body          ← content blocks + next/prev article live here
6. Related articles      (2 rows, most similar, like homepage stream)
```

## Wireframe A: Landscape image — Desktop (1280px+)

Standard article with a landscape hero (16:9, 3:2). Two columns on large screens only.

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER / NAV                                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. BREADCRUMBS                                              │
│  Home / Blog / Article Title                                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  2. ARTICLE MAIN IMAGE (landscape, full width)               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                                                      │    │
│  │              (hero image / gallery)                   │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  3. TAGS, DATE, AUTHOR                                       │
│  [strategy] [ai]  ·  26 March 2026  ·  Marten Angner        │
│                                                              │
├──────────────────────────────────────────────┬───────────────┤
│                                              │               │
│  4. ARTICLE TEASER                           │  SIDEBAR      │
│  Large intro text (22px, weight 400).        │  (sticky)     │
│  First paragraphs before any h3.             │               │
│                                              │  ┌─────────┐  │
├──────────────────────────────────────────────┤  │ WDS     │  │
│                                              │  │ TEASER  │  │
│  5. ARTICLE BODY                             │  │         │  │
│                                              │  │ Value   │  │
│  ┌────────────────────────────────────────┐  │  │ prop    │  │
│  │  CONTENT BLOCK                        │  │  │         │  │
│  │                                       │  │  │ → Repo  │  │
│  │  ### Section heading                  │  │  │ → Learn │  │
│  │                                       │  │  │ → Docs  │  │
│  │  Body text, paragraphs, lists...      │  │  │         │  │
│  │                                       │  │  └─────────┘  │
│  │  ┌─────────────────────────────────┐  │  │               │
│  │  │  INSIGHT CALLOUT (blockquote)   │  │  │               │
│  │  │  "Key insight from section."    │  │  │               │
│  │  └─────────────────────────────────┘  │  │               │
│  │                                       │  │               │
│  └────────────────────────────────────────┘  │               │
│                                              │               │
│                   48px gap                   │               │
│                                              │               │
│  ┌────────────────────────────────────────┐  │               │
│  │  CONTENT BLOCK                        │  │               │
│  │  ### Next section heading             │  │               │
│  │  ...                                  │  │               │
│  └────────────────────────────────────────┘  │               │
│                                              │               │
│  ...repeats for each h3 section...           │               │
│                                              │               │
│  ← Older post title    Newer post title →    │               │
│                                              │               │
├──────────────────────────────────────────────┴───────────────┤
│                                                              │
│  6. RELATED ARTICLES (2 rows, most similar)                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │      │ │      │ │      │ │      │  row 1                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │      │ │      │ │      │ │      │  row 2                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Wireframe B: Portrait image — Desktop (1280px+)

When the article has a portrait image (3:4 or 9:16), the layout becomes three columns.
The image stays visible as you scroll — sticky in the left column.

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER / NAV                                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. BREADCRUMBS                                                      │
│  Home / Blog / Article Title                                         │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  3. TAGS, DATE, AUTHOR                                               │
│  [strategy] [ai]  ·  26 March 2026  ·  Marten Angner                │
│                                                                      │
├─────────────┬────────────────────────────────────────┬───────────────┤
│             │                                        │               │
│  2. IMAGE   │  4. ARTICLE TEASER                     │  SIDEBAR      │
│  (sticky)   │  Large intro text (22px, weight 400).  │  (sticky)     │
│             │  First paragraphs before any h3.       │               │
│  ┌───────┐  │                                        │  ┌─────────┐  │
│  │       │  ├────────────────────────────────────────┤  │ WDS     │  │
│  │       │  │                                        │  │ TEASER  │  │
│  │ 3:4   │  │  5. ARTICLE BODY                       │  │         │  │
│  │  or   │  │                                        │  │ Value   │  │
│  │ 9:16  │  │  ┌────────────────────────────────┐    │  │ prop    │  │
│  │       │  │  │  CONTENT BLOCK                 │    │  │         │  │
│  │       │  │  │  ### Section heading            │    │  │ → Repo  │  │
│  │       │  │  │  Body text...                   │    │  │ → Learn │  │
│  │       │  │  │                                 │    │  │ → Docs  │  │
│  │       │  │  │  ┌───────────────────────────┐  │    │  │         │  │
│  │       │  │  │  │  INSIGHT CALLOUT          │  │    │  └─────────┘  │
│  │       │  │  │  │  "Key insight."           │  │    │               │
│  │       │  │  │  └───────────────────────────┘  │    │               │
│  │       │  │  │                                 │    │               │
│  │       │  │  └────────────────────────────────┘    │               │
│  │       │  │                                        │               │
│  │       │  │                48px gap                 │               │
│  │       │  │                                        │               │
│  └───────┘  │  ┌────────────────────────────────┐    │               │
│             │  │  CONTENT BLOCK                 │    │               │
│             │  │  ### Next section               │    │               │
│             │  │  ...                            │    │               │
│             │  └────────────────────────────────┘    │               │
│             │                                        │               │
│             │  ← Older post       Newer post →       │               │
│             │                                        │               │
├─────────────┴────────────────────────────────────────┴───────────────┤
│                                                                      │
│  6. RELATED ARTICLES (2 rows)                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                │
│  │      │ │      │ │      │ │      │  row 1                          │
│  └──────┘ └──────┘ └──────┘ └──────┘                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                │
│  │      │ │      │ │      │ │      │  row 2                          │
│  └──────┘ └──────┘ └──────┘ └──────┘                                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                              │
└──────────────────────────────────────────────────────────────────────┘
```

## Wireframe: Tablet & Mobile (< 1280px)

No sidebar. No sticky image column. Single column layout for all image types.

```
┌───────────────────────┐
│ HEADER / NAV          │
├───────────────────────┤
│                       │
│ 1. BREADCRUMBS        │
│ Home / Blog / Title   │
│                       │
│ 2. ARTICLE IMAGE      │
│ ┌───────────────────┐ │
│ │                   │ │
│ │  (hero image,     │ │
│ │   any ratio)      │ │
│ │                   │ │
│ └───────────────────┘ │
│                       │
│ 3. TAGS, DATE, AUTHOR │
│ [strategy] [ai]      │
│ 26 Mar 2026 · Marten │
│                       │
│ 4. TEASER             │
│ Large intro text...   │
│                       │
│ 5. ARTICLE BODY       │
│                       │
│ ┌───────────────────┐ │
│ │ CONTENT BLOCK     │ │
│ │                   │ │
│ │ ### Heading       │ │
│ │ Body text...      │ │
│ │                   │ │
│ │ ┌───────────────┐ │ │
│ │ │ INSIGHT       │ │ │
│ │ │ CALLOUT       │ │ │
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
│                       │
│       32px gap        │
│                       │
│ ┌───────────────────┐ │
│ │ CONTENT BLOCK     │ │
│ │ ### Next heading  │ │
│ │ ...               │ │
│ └───────────────────┘ │
│                       │
│ ← Older  /  Newer →  │
│                       │
│ 6. RELATED ARTICLES   │
│ ┌────┐ ┌────┐        │
│ │    │ │    │ row 1   │
│ └────┘ └────┘        │
│ ┌────┐ ┌────┐        │
│ │    │ │    │ row 2   │
│ └────┘ └────┘        │
│                       │
│ FOOTER                │
└───────────────────────┘
```

---

## Component Specifications

### 1. Content Block

**What it wraps:** Each h3 heading and all content until the next h3
**Visual:**
- Background: `#FFFFFF`
- Border: 1px solid `#E8ECF0`
- Border-radius: 12px
- Padding: 40px 44px (desktop), 28px 24px (mobile)
- Box-shadow: `0 1px 3px rgba(0,0,0,0.04)`
- Margin-bottom: 48px (desktop), 32px (mobile)

**Section heading (h3 inside block):**
- Font: 26px, weight 400, line-height 32px, color `#2e2e2e` (wp-base)
- Margin-bottom: 20px after heading
- Heading text rendered as-is from markdown (emoji, numbering, etc. are content — the author decides)

**Body content inside block:**
- Standard prose styles (16px, weight 300, line-height 1.7)
- Paragraphs: margin-bottom 1.25em
- Lists: existing styles preserved

### 2. Insight Callout (blockquote upgrade)

**What it replaces:** Standard blockquote styling inside section cards
**Visual:**
- Background: `#F6F8FA` (wp-section-bg)
- Border-left: 4px solid `#D74560` (wp-red) — keep existing
- Border-radius: 0 8px 8px 0
- Padding: 24px 28px
- Margin: 28px 0
- Font: 18px, weight 400, line-height 1.6, color `#2e2e2e`
- Font-style: normal (not italic — the content is a statement, not a quote)
- No quotation marks

**Distinction from regular blockquotes:** All blockquotes inside `.prose` section cards get this treatment. If we later need "plain" blockquotes, add a `.plain` class — but for articles, every blockquote is an insight.

### 3. Article Teaser (intro)

**What it is:** All content before the first h3 heading
**Visual:**
- No card wrapping — sits directly in the prose flow
- Existing first-2-paragraph styling applies (22px, weight 400, 34px line-height)
- Remaining intro paragraphs: standard prose (16px)
- Margin-bottom: 40px before TOC

### 4. Sidebar (large screens only)

**When shown:** 1280px+ only. Hidden on tablet and mobile.
**Position:** Right column, sticky (top offset 80px for header)
**Width:** 280px
**Gap:** 40px between article body and sidebar

**Content is per-article** — each post can define what goes in the sidebar via frontmatter or tag matching. The layout provides the column; the content is flexible.

### 5. Sticky Portrait Image (large screens only, portrait images)

**When shown:** 1280px+ AND article image is portrait (3:4 or 9:16 aspect ratio)
**Position:** Left column, sticky (top offset 80px for header)
**Width:** ~280px (proportional to aspect ratio)
**Behavior:** Image moves from position 2 (full-width above content) into left column. Stays visible as reader scrolls through article body.
**Below 1280px:** Falls back to normal full-width image at position 2.

### 6. WDS Teaser (sidebar component for this article)

**Purpose:** Promote WDS to readers who just learned what it does. Convert article interest into repo visits and course signups.

**Visual:**
- Background: `#043F76` (wp-blue)
- Border-radius: 12px
- Padding: 28px 24px
- Color: white

**Content:**
- **Icon/logo:** WDS mark or simple icon (optional)
- **Headline:** "Whiteport Design Studio" — 16px, weight 500, white
- **Value prop:** 1-2 sentences — 14px, weight 300, white/80% opacity, line-height 1.6
  - e.g. "The open-source AI agent framework for design teams. Strategy to production in one process."
- **Links:** Styled as a list with arrow or icon prefix
  - → GitHub repo (whiteport-collective/whiteport-design-studio)
  - → Learn WDS (link to /wds/ page or learn section)
  - → Get started (link to getting started guide)
- **Link style:** 14px, weight 400, white, underline on hover, 8px gap between items

**Mobile:** Full-width card below article body, before Next Article.

### 7. Related Articles (2 rows)

**What it is:** Most similar articles shown in a grid, like the homepage stream
**Layout:** 2 rows, same card component as homepage/blog index
**Similarity:** Matched by shared tags/categories
**Responsive:** 4 columns desktop, 2 columns mobile

---

## Responsive Behavior

| Breakpoint   | Columns                  | Block padding | Block gap | Related cols |
|-------------|--------------------------|---------------|-----------|--------------|
| < 640px     | 1 (single)               | 28px 24px     | 32px      | 2 |
| 640-1279px  | 1 (single)               | 36px 36px     | 40px      | 3 |
| 1280px+     | 2 (body + sidebar)       | 40px 44px     | 48px      | 4 |
| 1280px+ portrait | 3 (image + body + sidebar) | 40px 44px | 48px   | 4 |

Sidebar behavior unchanged — collapses below content on mobile (existing lg: breakpoint).

---

## Implementation Notes

### Where to implement

This is a **CSS-only enhancement** to the existing `.prose` class in `global.css`, plus a small client-side script for:
1. Wrapping h3 sections in content block divs
2. Upgrading blockquotes to insight callouts

The script runs after content renders — no changes to the markdown content files or the Astro layout needed.

### Progressive enhancement

- **Short posts (< 3 h3s):** No content blocks. Standard prose rendering.
- **Long posts (3+ h3s):** Sections wrapped in content blocks, blockquotes upgraded.
- **No-JS fallback:** Content renders as standard prose (current behavior). Content blocks are enhancement only.

### What NOT to change

- Hero image/gallery rendering
- Article header (title, date, author, tags)
- Sidebar (offers, WDS promo, contact CTA)
- Related posts grid
- Social sharing buttons
- Footer
- Any existing SocialStreamPost layout structure

---

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `--color-wp-blue` | `#043F76` | Links |
| `--color-wp-red` | `#D74560` | Callout border, link hover |
| `--color-wp-base` | `#2e2e2e` | Body text, headings |
| `--color-wp-grey` | `#3C3B3B` | Secondary text |
| `--color-wp-section-bg` | `#F6F8FA` | Callout background |
| `font-family` | Rubik | Everything |
| Card border | `#E8ECF0` | Section card border |
| Card shadow | `0 1px 3px rgba(0,0,0,0.04)` | Section card shadow |
| Card radius | `12px` | Section card corners |

---

## Acceptance Criteria

1. Articles with 3+ h3 headings automatically get content blocks
2. Articles with fewer h3s render as standard prose (no visual regression)
3. Blockquotes inside content blocks render as insight callouts
4. Content blocks have consistent spacing and visual rhythm
5. Related articles show 2 rows of most similar posts (like homepage stream)
6. No changes to existing markdown content files required
7. No changes to SocialStreamPost layout file required
8. Works with current Tailwind CSS v4 setup
9. Page weight increase < 2KB (script + styles)

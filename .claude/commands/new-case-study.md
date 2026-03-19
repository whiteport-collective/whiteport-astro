# New Case Study Workflow

Create a new project/case study page for the Whiteport portfolio following the WP block-based template pattern.

## Prerequisites

- Project name, client, and description
- Gallery images (laptop mockup, screen overview, tablet/mobile, device mockups, plus any extras)
- Client testimonial (quote, name, role, avatar photo)
- Services list ("What we did")

## Step 1: Gather Information

Ask the user for:
1. **Project title** and **client name**
2. **One-line description** (for SEO/cards)
3. **Tags** (from existing: branding, ux-design, visual-design, web-development, e-commerce, frontend-development, development, mobile-app, saas, low-code, social-media, product-management, wordpress)
4. **Project URL** (if live)
5. **Gallery images** — ideally 4-6 images:
   - `laptop-screen` (1024x624) — featured/intro image
   - `screens` (1920x840) — full-width banner overview
   - `tab-mob` (~1024x990) — tablet + mobile views
   - `mockups` (1920x763) — device mockup composition
   - Optional: rollups, sketches, identity/brand guidelines
6. **About the project** — 2-4 paragraphs explaining the challenge and solution
7. **What we did** — bullet list of services
8. **Results** (optional) — bullet list of outcomes
9. **Client testimonial** — quote, name, role/title, company, avatar photo URL

## Step 2: Create the Content File

Create `src/content/projects/{slug}.md` following this block structure:

```yaml
---
title: "Project Name"
description: "One-line description for cards and SEO"
client: "Client Name"
tags: ["tag1", "tag2"]
featuredImage:
  src: "URL to laptop-screen image"
  alt: "Project Name overview"
url: "https://project-url.com"  # optional
blocks:
  # Block 1: Intro (highlighted) — title + intro text | featured image
  # Use highlighted: true for the first block (renders h1)
  # Use reverse: true to put image on left (alternates per project)
  - type: content-image
    highlighted: true
    heading: "Project Name"
    text: |
      Intro paragraph(s) about the project...
    image:
      src: "laptop-screen image URL"
      alt: "Description"
      size: large

  # Block 2: Full-width banner
  - type: poster
    full: true
    image:
      src: "screens overview image URL (1920px wide)"
      alt: "Description"
      size: banner

  # Block 3: About the project — text | device mockup
  - type: content-image
    heading: "About the project"
    text: |
      Detailed description...
    list:  # optional bullet points
      - "Feature 1"
      - "Feature 2"
    image:
      src: "tab-mob image URL"
      alt: "Description"
      size: large

  # Block 4: Mockups banner (page-width)
  - type: poster
    full: false
    image:
      src: "mockups image URL (1920px wide)"
      alt: "Description"
      size: banner

  # Block 5: What we did (reversed)
  - type: content-image
    reverse: true
    heading: "What we did:"
    text: |
      Summary of approach and methodology...
    list:
      - "Service 1"
      - "Service 2"
    image:
      src: "extra image URL (rollups, mobile screen, etc.)"
      alt: "Description"
      size: large

  # Block 6 (optional): Extra poster
  - type: poster
    full: false
    image:
      src: "additional banner image URL"
      alt: "Description"
      size: banner

  # Final block: Testimonial
  - type: testimonial
    heading: "What our client say"
    quote: "Full testimonial text..."
    name: "Person Name"
    role: "Title & Role"
    company: "Company Name"
    avatar: "Avatar image URL (150x150 ideal)"
---

Fallback markdown content (1-2 sentences for SEO/RSS).
```

## Block Types Reference

### content-image
Two-column layout: text + image (50/50 flex, 50px gap)
- `highlighted: true` — first block, renders h1 instead of h2
- `reverse: true` — image on left, text on right
- `text` — markdown-flavored (supports **bold** and *italic*)
- `list` — optional bullet points
- `image.size` — `large` (half-width) or `banner` (full-width)

### poster
Full-width or page-width image banner
- `full: true` — edge-to-edge (1920px wide images)
- `full: false` — constrained to page-width (1200px max)

### testimonial
Client quote with avatar
- `avatar` — 150x150px circular photo
- `role` — displayed as uppercase below the name

## Step 3: Add to Projects Index

The project will automatically appear on `/projects/` if not `draft: true`.
Update the image mapping in `src/pages/index.astro` if a homepage card image is needed.

## Step 4: Verify

1. Check `http://localhost:4321/projects/{slug}/` in browser
2. Compare block sequence visually against the pattern
3. Verify breadcrumb, prev/next navigation, and testimonial display
4. Test mobile responsive (768px breakpoint collapses to single column)

## CSS Values Reference (WP-matched)

- **Headings (h1/h2):** 36px, weight 300, color rgb(60,59,59), Rubik
- **Body text:** 18px, weight 300, color rgb(46,46,46), line-height 30px
- **Content blocks:** margin 56px 0, flex gap 50px, 50/50 split
- **Page width:** max-width 1940px, padding 0 30px
- **Breadcrumb:** 13px, centered, grey
- **Testimonial avatar:** 145px circle
- **Quote icon:** green (#8BC34A) curly quote
- **Name:** 16px weight 500, Role: 16px weight 300 uppercase

## Typical Block Sequence

Most Whiteport projects follow this pattern:
1. BREADCRUMB
2. CIB-HIGHLIGHTED (or reversed) — intro
3. POSTER-FULL — banner overview
4. CIB — "About the project"
5. POSTER — mockups
6. CIB-REVERSED — "What we did"
7. POSTER (optional) — extra images
8. TESTIMONIAL — client quote

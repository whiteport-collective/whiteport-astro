# /publish-blog — Publicera innehåll på whiteport.com

**Trigger:** Används av `/post` och `/article` — inte direkt av användaren.
**Syfte:** Skapa `src/content/blog/[slug].md` med rätt frontmatter och publicera till staging.

---

## Bildformat: portrait vs landscape

Sajten har EN layout (`SocialStreamPost.astro`) med två lägen:

| Bildtyp | Villkor | Resultat |
|---------|---------|---------|
| **Portrait** (stående) | `height > width` i gallery-item | Bild på sidan, text bredvid |
| **Landscape** (liggande) | `width >= height` eller inga dimensioner | Bild i toppen, text under |

**`width` och `height` krävs i gallery-item för att portrait-läget ska aktiveras.**

Mät bildens dimensioner:
```powershell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("public/images/blog/[slug]/hero.jpg")
"Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
```

---

## Frontmatter-mall

```yaml
---
title: "[titel]"
seoTitle: "[SEO-variant, max 60 tecken]"
publishDate: [ISO 8601, t.ex. 2026-05-09T00:00:00.000Z]
author: Marten Angner
categories:
  - ai         # välj bland: ai, wds, leadership, design, engineering, business
tags:
  - [kebab-case-tags]
excerpt: "[1–2 meningar, max 160 tecken]"
featuredImage:
  src: /images/blog/[slug]/hero.jpg
gallery:
  - src: /images/blog/[slug]/hero.jpg
    alt: "[bildbeskrivning]"
    type: image
    width: [bildbredd i px]    # krävs för portrait-läge
    height: [bildhöjd i px]   # krävs för portrait-läge
    display:
      - gallery
      - thumbnail
      - archive
      - linkedin
offers:
  - title: "Känner du igen dig?"
    label: "För design- och produktledare"
    description: "Jag erbjuder en kostnadsfri session där vi går igenom er situation och tittar på vad som faktiskt krävs."
    cta: "Boka ett kostnadsfritt samtal →"
    href: mailto:marten@whiteport.com
---
[innehållstext — utan Unicode-bold, utan frontmatter-duplikat]
```

**Om posten pekar på en artikel**, lägg till längst ner:
```markdown
[Läs artikeln: [titel] →](/blog/[artikel-slug]/)
```

---

## Bild

1. Kolla Drive: `G:\Shared drives\Whiteport Team\Communication\[date-slug]\`
2. Kopiera till `public/images/blog/[slug]/hero.jpg`
3. Mät dimensioner och sätt `width`/`height` i gallery-item

---

## Publicera till staging

```bash
cd c:/dev/Whiteport/whiteport-astro
git checkout preview
git add src/content/blog/[slug].md public/images/blog/[slug]/
git commit -m "ivo: publicera [slug] på hemsidan"
git push origin preview
```

Staging: **https://astro.whiteport.com/blog/[slug]/**

**Produktion (master):** Kräver explicit "publicera" från Mårten.
```bash
git checkout master
git merge preview
git push origin master
```

---

## Undantag: teaser-poster

Om posten är en ren teaser till en artikel som redan har sin egen blogsida — skapa **inte** ett separat bloginlägg. Artikeln är hemsidans inlägg.

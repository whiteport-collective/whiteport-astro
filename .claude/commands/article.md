# /article — Skriv och publicera en artikel

**Trigger:** `/article`
**Princip:** Research → Argument → Artikel. Aldrig tvärtom.
**Skillnad mot `/post`:** En artikel är ett längre thought piece (500–1 500 ord) som publiceras på hemsidan. En post är social-first och pekar på artikeln.

---

## Filstruktur

Alla artiklar lever i `whiteport-astro/content/articles/[date-slug]/`:

```
content/articles/2026-04-24-agentisk-design-ledarskap/
├── 00-research.md      ← research, tes, struktur, hooks
├── 01-article.md       ← färdig artikel
├── 02-linkedin.md      ← social post som pekar på artikeln (via /post)
```

---

## Steg 1: Research — `00-research.md` (10 min)

Fyll i innan ett ord skrivs i artikeln. Mallen:

```markdown
# Research — [artikeltitel]

## Tes
[En mening. Vad artikeln bevisar.]

## Varför nu
[Vad gör ämnet aktuellt just nu?]

## Argument
[3–5 punkter som stöder tesen]

## Läsarens invändningar
[Vad tänker en skeptisk läsare? Bemöt dem.]

## Bevis / exempel
[Konkreta fall, data, citat, egna erfarenheter]

## WDS-kopplingen
[Hur kopplar artikeln till WDS, governance, eller Mårtens positionering?]

## Hooks
[3–5 kandidater till öppningsmening]

## Artikelstruktur
[Rubriker och vad varje sektion bevisar]
```

Bekräfta research med Mårten innan du går vidare. **Ingen artikel utan godkänd research.**

---

## Steg 2: Skriv artikeln — `01-article.md` (20 min)

**Struktur:**
```
Hook — stoppar läsaren
Symptom/problem — vad ser folk i verkligheten
Orsak — varför det händer (den djupare sanningen)
Lösning — vad som faktiskt krävs
Konkret exempel — Dan, Avanza, Fortnox, etc.
WDS — ramverket som möjliggör det
Vinsten — vad som händer när det fungerar
CTA — boka samtal / kommentera
```

**Röst:**
- Direkt, inga floskler
- Korta meningar, luftigt
- Konkreta exempel från verkligheten
- Aldrig "vi behöver prata om X" — säg direkt vad X är

**Längd:** 600–1 200 ord för LinkedIn-vänlig läsning.

---

## Steg 3: Publicera på hemsidan

Artikeln är hemsidans bloginlägg. Varje artikel går alltid till `src/content/blog/[slug].md`. Om du skriver en LinkedIn-teaser till artikeln — den behöver **inte** en separat blogsida, artikeln är redan där.

Kör `/publish-blog` för frontmatter-mall, bildmätning (portrait vs landscape) och deploy till staging.

---

## Steg 4: Social post

Kör `/post` för att skriva LinkedIn/Instagram-teasern som pekar på artikeln.

---

## Steg 5: Staging → Produktion

**Staging (preview-branch):** Alltid OK — används för att granska innan publicering.
```bash
git checkout preview
git add content/articles/[date-slug]/ src/content/blog/[slug].md public/images/blog/[slug]/
git commit -m "ivo: artikel — [slug] till staging"
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

## Steg 6: Logga

Logga i veckofilen:
```markdown
**Content:**
- [x] Artikel: "[titel]" — live [datum]
```

---

## Filplatser

| Vad | Var |
|-----|-----|
| Research | `whiteport-astro/content/articles/[date-slug]/00-research.md` |
| Artikel (working) | `whiteport-astro/content/articles/[date-slug]/01-article.md` |
| Blogginlägg (hemsidan) | `whiteport-astro/src/content/blog/[slug].md` |
| Bild (Drive) | `G:\Shared drives\Whiteport Team\Communication\[date-slug]\` |
| Bild (hemsida) | `whiteport-astro/public/images/blog/[slug]/hero.webp` |

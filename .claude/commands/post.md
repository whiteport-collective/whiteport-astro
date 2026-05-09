# /post — Skriv och publicera en social post

**Trigger:** `/post`
**Princip:** Research först. Skriv sedan. En publicerad 6/10 slår en opublicerad 10/10.
**Skillnad mot `/article`:** En post är kort, social-first. En artikel är ett längre thought piece som publiceras på hemsidan.

---

## Filstruktur

Alla poster lever i `whiteport-astro/content/articles/[date-slug]/`:

```
content/articles/2026-05-09-fortnox-ai/
├── 00-research.md          ← gemensam research för hela mappen
├── 05-Post-[topic].md      ← denna post (research + LinkedIn + Instagram)
```

Varje post-fil börjar med ett `## Research`-block:

```markdown
## Research

**Syfte**
[Vad ska posten åstadkomma? Brand-association, leads, trovärdighet?]

**Story**
[Fakta och händelser. Vad hände, vem träffades, vad sades?]

**Constraint**
[Vad får inte overclaimas? Vad är linjen?]
```

---

## Steg 1: Research (2 min)

Fyll i `## Research`-blocket. Om det redan finns — bekräfta att syfte och constraint stämmer.

Om research saknas, ställ EN fråga: "Vad är syftet och vad är känsliga gränser att hålla?"

---

## Steg 2: Skriv posten (5 min)

**LinkedIn-struktur:**
```
Hook — en rad som stoppar scrollet
Story/insikt — 3–5 korta stycken, konversationellt
Poäng — vad ska läsaren tänka eller göra annorlunda?
CTA — fråga eller "kommentera X för länken"
```

**Regler:**
- Max ~1 300 tecken för LinkedIn
- Inga externa länkar i posttexten (algoritmstraff)
- Inga hashtags i posttexten (lägg dem i första kommentaren)
- Tagga personer med fullständigt namn
- Om det finns en artikel: teaser på social, full artikel på whiteport.com/blog

**Bold-formatering:**
Markera `**ord**` och `*kursiv*`, kör sedan:
```
python C:\Users\marte\.claude\scripts\linkedin-unicode.py <path-to-post.md>
```
Scriptet konverterar `**...**` → Unicode bold som överlever copy-paste till LinkedIn.
OBS: scriptet kräver ett ` ``` `-block under `## LinkedIn (primary post)`. Om filen inte har det formatet, kör konverteringen inline med Python direkt på sektionen.

---

## Steg 3: Bild (3 min)

**Kolla Drive-mappen först:** `G:\Shared drives\Whiteport Team\Communication\[date-slug]\`

Om bild finns: kopiera till `public/images/blog/[slug]/hero.jpg`.

Om ingen bild finns: generera med NanoBanana i chalkboard-stil:
> A deep blue frosted glass chalkboard with chalk-style typography and editorial illustrations showing [TOPIC]. Modern, no frame. White and light blue chalk lines on dark blue background.

Referensbilder: `G:\Shared drives\Whiteport Team\WP Communication\2026-03-20 Chalkboard Infographic Style\`

---

## Steg 4: Instagram-version (2 min)

Kortare. Visuell-first. Story-vänlig. Samma constraint som LinkedIn.

---

## Steg 5: Publicera på hemsidan

Varje **fristående post** (observation, insikt, besöksberättelse) ska också leva på whiteport.com som bloginlägg.

**Undantag:** Om posten är en ren teaser till en artikel som redan har sin egen blogsida — publicera inte posten separat. Artikeln är hemsidans inlägg.

Kör `/publish-blog` för frontmatter-mall, bildmätning (portrait vs landscape) och deploy till staging.

---

## Steg 6: Staging → Produktion

**Staging (preview-branch):** Alltid OK att pusha dit.
```bash
git checkout preview
git add [filer]
git commit -m "ivo: [topic] post"
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

## Steg 7: Logga

Logga i veckofilen:
```markdown
**Content:**
- [x] LinkedIn: "[ämne]" — klar [tid]
```

---

## Filplatser

| Vad | Var |
|-----|-----|
| Post-fil (working) | `whiteport-astro/content/articles/[date-slug]/0X-Post-[topic].md` |
| Blogginlägg (hemsidan) | `whiteport-astro/src/content/blog/[slug].md` |
| Bild (Drive) | `G:\Shared drives\Whiteport Team\Communication\[date-slug]\` |
| Bild (hemsida) | `whiteport-astro/public/images/blog/[slug]/hero.jpg` |
| Unicode-script | `C:\Users\marte\.claude\scripts\linkedin-unicode.py` |

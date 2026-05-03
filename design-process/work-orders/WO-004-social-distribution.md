# WO-004 — Social Distribution

**Project:** whiteport-astro  
**Feature area:** Publishing pipeline — V6 Social Distribution  
**Owner:** Freya (spec) / Ivonne (execution via Claude-in-Chrome)  
**Created:** 2026-05-03  
**Status:** Specced — ready for M1

---

## Syfte

Artikel skrivs i Claude Code → committas till `draft/<slug>` → CI bygger preview (WO-003 ✅). Nästa steg: den artikeln distribueras automatiskt till Mårten Angners och Whiteports sociala kanaler utan att Mårten manuellt kopierar text.

Utförande sker via **Claude-in-Chrome** (desktop, Ivonne-session). Ingen direkt Meta Graph API-integration — medvetet bortvalt för att undvika app-reviews, permission-flows och rate-limit-komplexitet.

**Inte i scope:** YouTube, TikTok, stories, commenting.

---

## Kanaler i scope

| Konto | Platform | Handle / sida |
|-------|----------|--------------|
| Mårten personlig | LinkedIn | Mårten Angner |
| Whiteport org | LinkedIn | Whiteport |
| Mårten personlig | Facebook | Mårten Angner |
| Whiteport sida | Facebook | Whiteport (Mårten = collaborator) |
| Whiteport | Instagram | @whiteportagency |
| Mårten personlig | Instagram | @martenangner |

---

## Triggermodell

**Beslut: `/post <slug>` — manuell trigger per artikel.**

Motivering: automatisk post vid commit till `main` är riskabelt (snabb rättning → oavsiktlig publicering). Schemalagd posting (t.ex. alltid tisdag 08:00) passar inte publiktiming per artikel. Mårten väljer rätt tidpunkt — `/post` är minimal friktion.

Optionellt: frontmatter-fält `scheduleAt` låter Ivonne köa postningen utan att invänta Mårten. Om `scheduleAt` är satt postar Ivonne vid den tidpunkten. Om inte: omedelbart när `/post` körs.

Flöde:
```
Mårten: /post nar-min-claude-slar-i-taket
→ Ivonne hämtar artikel + socialPosts-copy från frontmatter
→ Kör Chrome-session per konto
→ Skriver tillbaka publishedAt + URL per konto till frontmatter
→ Committar uppdatering till main
→ Rapporterar delivery till Agent Space
```

---

## Frontmatter-schema

Befintlig `socialPostSchema` i `content.config.ts` täcker post-publish-state men saknar pre-publish-copy och account-distinktion. Utökat schema:

```ts
const socialPostSchema = z.object({
  // Konto — utökad enum för att skilja personal vs. org
  platform: z.enum([
    'linkedin-personal',   // Mårten Angner på LinkedIn
    'linkedin-org',        // Whiteport org på LinkedIn
    'facebook-personal',   // Mårten Angner på Facebook
    'facebook-org',        // Whiteport-sida på Facebook
    'instagram-org',       // @whiteportagency
    'instagram-personal',  // @martenangner
    // Gamla värden kvar för bakåtkompatibilitet
    'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'personal',
  ]),
  postText: z.string().default(''),        // Plattformsanpassad copy (pre-fill av LLM)
  hashtags: z.array(z.string()).default([]), // Separata hashtags — lättare att redigera
  scheduleAt: z.coerce.date().optional(),  // Kö-tid om Mårten inte triggar manuellt
  collaboratorPending: z.boolean().default(false), // FB-sida: inväntar Märtens accept
  url: z.string().url().optional(),        // Post-URL efter publicering
  postedAt: z.coerce.date().optional(),    // Tidpunkt för publicering
});
```

Exempel i frontmatter:
```yaml
socialPosts:
  - platform: linkedin-personal
    postText: |
      Kontextfönstret är inte en bugg att lösa — det är ett designbeslut att förstå.
      Jag skriver om hur jag arbetar med Claude när 200k tokens inte räcker.
    hashtags: [AI, Claude, produktivitet]
  - platform: linkedin-org
    postText: |
      Vad händer när din AI-assistent når sitt minne? Mårten Angner skriver om...
    hashtags: [Whiteport, AI, agentdrivet]
  - platform: instagram-org
    postText: "200k tokens. Och ändå räcker det inte alltid. 👇"
    hashtags: [AI, Claude, whiteport]
    image:
      crops:
        square: /media/gdrive/<hero-id>-1x1.jpg   # 1:1 feed (Photoshop MCP auto-crop)
        portrait: /media/gdrive/<hero-id>-9x16.jpg # 9:16 stories (Photoshop MCP auto-crop)
  - platform: facebook-personal
    postText: |
      Nytt blogginlägg: När min Claude slår i taket...
    collaboratorPending: false
```

---

## Per-plattform anpassning

**Beslut: LLM-pass genererar första utkast per plattform från artikeltexten. Mårten kan godkänna eller redigera via frontmatter innan `/post` körs.**

**LLM-gateway:** `tool-anthropic` / `contact-ai` — peka på capability-namn, hardkoda aldrig endpoint. Standard: Gemini 2.5 Flash via Vertex.

Anpassningsregler:

| Plattform | Längd | Ton | Hashtags | Länk |
|-----------|-------|-----|----------|------|
| LinkedIn personal | 150–300 ord | Personlig reflektion, yrkesmässig | 3–5 | Preview-URL |
| LinkedIn org | 80–150 ord | Bolagsperspektiv, thought leadership | 3–5 | Preview-URL |
| Facebook personal | 50–100 ord | Casual, personlig | 2–3 | Preview-URL |
| Facebook org | 50–100 ord | Varumärkesröst | 2–3 | Preview-URL |
| Instagram org | 1 kraftfull mening + emojis | Visuellt-drivet | 5–10 | Länk i bio → `whiteport.com/blog` |
| Instagram personal | 1–2 meningar | Personlig | 3–5 | Länk i bio → `whiteport.com/blog` |

LLM-passet körs av `create-article` eller `/post`-kommandot. Genererar `postText` + `hashtags` per plattform och skriver till frontmatter. Mårten granskar och kör `/post` när det är klart.

---

## Bildhantering (Instagram)

**Källa:** GDrive hero-bild är primärkälla — samma bild som artikelns hero, redan nedladdad av `astro-gdrive.ts`.

**Auto-crop via Photoshop MCP:** `/post`-körningen kör Photoshop MCP för att auto-cropa:
- `1:1` → `image.crops.square` (Instagram feed)
- `9:16` → `image.crops.portrait` (Instagram stories — framtida)

Paths skrivs till frontmatter under `socialPosts[].image.crops` per Instagram-plattform. Ivonne läser `crops.square` och bifogar filen i Chrome-sessionen.

**Frontmatter-tillägg i `socialPostSchema`:**
```ts
image: z.object({
  crops: z.object({
    square: z.string().optional(),   // 1:1 feed
    portrait: z.string().optional(), // 9:16 stories
  }).optional(),
}).optional(),
```

---

## Collaborator-flödet (Facebook-sida)

Whiteport Facebook-sida kräver att Mårten accepterar collab-invite för varje post som publicerats på sidan. Flöde:

1. Ivonne postar content via Claude-in-Chrome på Whiteport-sidan
2. Meta skickar notification till Mårten
3. `collaboratorPending: true` sätts i frontmatter
4. Agent Space-meddelande skickas till Mårten: "Acceptera collab-invite för [artikel] på Facebook-sidan"
5. Mårten accepterar (2 tapp i appen)
6. Ivonne uppdaterar `collaboratorPending: false` + `postedAt` + `url`

Markering i delivery-rapport: `facebook-org: awaiting_collaborator` tills Mårten bekräftat.

---

## Resultatlogg

Primär: `socialPosts[]` i artikelns frontmatter — `url` + `postedAt` skrivs tillbaka per plattform efter publicering. Committas till `main`.

Sekundär: Agent Space-rapport från Ivonne till Mårten (via `agent-messages` edge-fn, `action: send`) med:
- Slug + artikeltitel
- Status per konto (posted / awaiting_collaborator / failed)
- URL per konto

---

## Acceptanskriterier

- [ ] `/post <slug>` triggar Ivonne-session
- [ ] LLM genererar `postText` + `hashtags` per plattform (kan köras innan `/post`)
- [ ] LinkedIn personal — post publicerad, URL + postedAt i frontmatter
- [ ] LinkedIn org — post publicerad, URL + postedAt i frontmatter
- [ ] Facebook personal — post publicerad
- [ ] Facebook org — collab-flow testat: `collaboratorPending: true` → Mårten accepterar → `false`
- [ ] Instagram @whiteportagency — post publicerad
- [ ] Instagram @martenangner — post publicerad
- [ ] Delivery-rapport i Agent Space med URLs + status
- [ ] Frontmatter committat till `main` med alla `postedAt` + `url`

---

## Milstolpar

### M1 — Schema + `/post`-kommando (spec, ingen faktisk posting)
- Uppdatera `socialPostSchema` i `content.config.ts` med nya plattformsvärden + `hashtags` + `scheduleAt` + `collaboratorPending`
- Skapa `/post`-slash-command i `martens-documents/.claude/commands/post.md`
- Kommandot: läser artikel från `src/content/blog/<slug>.md`, kör LLM-pass för per-plattform copy, skriver socialPosts till frontmatter, committar draft-branch
- **Acceptans:** `/post nar-min-claude-slar-i-taket` skriver korrekt frontmatter utan att posta

### M2 — LinkedIn personal + LinkedIn org
- Ivonne kör Claude-in-Chrome: öppnar linkedin.com, postar på Mårten personlig, postar på Whiteport org
- Skriver tillbaka `url` + `postedAt` per LinkedIn-konto till frontmatter
- **Acceptans:** 2 LinkedIn-poster live, frontmatter uppdaterat

### M3 — Facebook personal + Facebook-sida (collab-flow)
- Ivonne postar på Mårten personlig + Whiteport-sida
- Testar `collaboratorPending`-flödet end-to-end
- **Acceptans:** FB-poster live, Mårten accepterat collab, frontmatter klart

### M4 — Instagram @whiteportagency + @martenangner
- Ivonne postar på båda Instagram-kontona via Chrome
- **Acceptans:** IG-poster live

### M5 — Resultatlogg + delivery-rapport
- Agent Space-rapport med alla URLs + status
- Frontmatter-commit till `main`
- **Acceptans:** Delivery-rapport läsbar, alla 6 konton klara

---

## Beroenden

| Beroende | Status |
|----------|--------|
| WO-003 CI (preview-URL) | ✅ Klart |
| `create-article` pipeline | ✅ Klart |
| Claude-in-Chrome (desktop) | Tillgänglig |
| Mårten inloggad på alla konton i Chrome | Antas |
| ElevenLabs voice clone (WO-001) | Orelaterat |
| V1 prod deploy (Hostup) | **Inte beroende** — kör på preview-URL |

---

## Lösta frågor

1. **LLM för copy-generering** — ✅ `tool-anthropic` / `contact-ai`. Peka på capability-namn, hardkoda ej endpoint. Standard: Gemini 2.5 Flash via Vertex.
2. **Instagram länk i bio** — ✅ Statisk till `whiteport.com/blog`. Inte per-artikel.
3. **Bilder per plattform** — ✅ GDrive hero är primärkälla. Photoshop MCP auto-crop: 1:1 (feed) + 9:16 (stories). Se sektion Bildhantering.

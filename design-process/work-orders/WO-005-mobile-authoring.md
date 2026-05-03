# WO-005 — Mobile Authoring Flow

**Project:** whiteport-astro  
**Feature area:** Publishing pipeline — V7 Mobile Authoring  
**Owner:** Freya (spec) / Codex (implementation)  
**Created:** 2026-05-03  
**Status:** Specced — ready for M1

---

## Syfte

Mårten ska kunna skriva ett blogginlägg från mobilen — via röst eller text — utan att öppna en laptop. Flödet slutar med en preview-URL som Mårten kan granska på telefonen innan publicering.

**Inte i scope:** Redigering efter preview, publicering till social (WO-004), video/audio-publicering (WO-001).

---

## Flöde

```
Mårten (mobil)
  → Spelar in röst ELLER skriver råtext i valfri app
  → Skickar fil/text till Ivonne via Agent Space (action: send)

Ivonne
  → Om röstinspelning: transcriberar via Whisper (tool-openai eller contact-ai)
  → LLM-cleanup: strukturerar transkript → markdown med frontmatter-skelett
  → Skapar branch: draft/<slug>
  → Committar .md-fil via GitHub API (gh api --method PUT)
  → CI triggas automatiskt (WO-003) → preview-URL skapas
  → Skickar preview-URL tillbaka till Mårten via agent-messages
```

Mårten öppnar preview-URL på telefonen → godkänner eller skickar korrigeringar tillbaka.

---

## Input-format

Mårten kan leverera innehåll på tre sätt:

| Format | Källa | Handling |
|--------|-------|---------|
| Röstinspelning (m4a/wav/ogg) | Voice Memos, WhatsApp, direkt upload | Whisper → transkript → LLM-cleanup |
| Råtext / bullet-lista | Notes, iMessage, direktmeddelande | LLM-cleanup → markdown |
| Halvfärdig markdown | Files-appen, Bear, Obsidian | Frontmatter-komplettering, minimal redigering |

---

## LLM-cleanup

**Gateway:** `tool-anthropic` / `contact-ai` — peka på capability, hardkoda ej endpoint. Standard: Gemini 2.5 Flash via Vertex.

Cleanup-prompt ger LLM:
- Artikeltitel (härledd eller given av Mårten)
- Råinnehåll (transkript eller text)
- Instruktion: strukturera till välformatterad markdown, behåll Mårtens röst, fyll frontmatter-skelett

Frontmatter-skelett som genereras:
```yaml
---
title: "<LLM-härledd titel>"
description: "<1-2 meningar>"
pubDate: <dagens datum>
author: marten
tags: []          # LLM föreslår 2-4 taggar
heroImage: null   # Mårten lägger till manuellt
socialPosts: []   # Fylls av /post (WO-004)
---
```

**Mårten granskar och justerar frontmatter** (titel, tags, pubDate) innan merge till main.

---

## Branch + commit

```bash
# Skapa branch
gh api --method POST /repos/whiteport-collective/whiteport-astro/git/refs \
  -f ref="refs/heads/draft/<slug>" \
  -f sha="<master-sha>"

# Committa fil
gh api --method PUT /repos/whiteport-collective/whiteport-astro/contents/src/content/blog/<slug>.md \
  -f message="draft: <titel> (mobile authoring)" \
  -f content="<base64-encoded-markdown>" \
  -f branch="draft/<slug>"
```

CI triggas via WO-003:s befintliga `cloudflare-pages-preview.yml` — ingen ny workflow behövs.

---

## Rapportering

Ivonne skickar tillbaka via `agent-messages` edge-fn:
```json
{
  "action": "send",
  "to": "ivonne",
  "subject": "Preview klar: <titel>",
  "body": "Branch: draft/<slug>\nPreview: <CF-pages-url>\n\nFrontmatter att granska:\n- title\n- tags\n- pubDate"
}
```

---

## Slash-kommando: `/mobile-post`

Skapas i `martens-documents/.claude/commands/mobile-post.md`.

Argument: filsökväg eller råtext (klistrad). Ivonne detekterar format automatiskt.

```
/mobile-post <fil-eller-text>
```

Alternativt: Mårten skickar direkt via Agent Space utan slash-kommando — Ivonne lyssnar på inkommande meddelanden med `type: "mobile-draft"`.

---

## Acceptanskriterier

- [ ] Röstinspelning → transkript via Whisper fungerar
- [ ] LLM-cleanup producerar välformad markdown med korrekt frontmatter-skelett
- [ ] Branch `draft/<slug>` skapas via GitHub API
- [ ] CI triggas och preview-URL genereras (~2 min)
- [ ] Preview-URL skickas tillbaka till Mårten via Agent Space
- [ ] Hela flödet tar < 5 min från Mårten skickar till preview är live

---

## Milstolpar

### M1 — Text-flöde (ingen röst)
- Mårten skickar råtext → Ivonne kör LLM-cleanup → committar → preview-URL tillbaka
- **Acceptans:** Råtext in, preview-URL ut, < 5 min

### M2 — Röstflöde
- Röstinspelning → Whisper → transkript → M1-flöde
- **Acceptans:** m4a in, preview-URL ut

### M3 — `/mobile-post`-kommando
- Slash-kommando i martens-documents för smidig trigger
- **Acceptans:** `/mobile-post <fil>` kör hela flödet

---

## Beroenden

| Beroende | Status |
|----------|--------|
| WO-003 CI (preview-URL) | ✅ Klart |
| GitHub API (gh cli) | ✅ Tillgänglig |
| Whisper (via contact-ai/tool-openai) | Tillgänglig |
| WO-004 frontmatter-schema | ✅ Klart |
| V1 prod deploy (Hostup) | Inte beroende — kör på preview-URL |
| WO-001 audio | Separat — inte beroende |

---

## Öppna frågor

1. **Whisper-gateway** — `contact-ai` med Whisper-capability, eller OpenAI direkt via `tool-openai`? Ivonne avgör vid implementation.
2. **Hero-bild mobil** — Mårten fotar med telefonen och bifogar, eller väljer från GDrive i efterhand? Beslut kan tas vid M2.

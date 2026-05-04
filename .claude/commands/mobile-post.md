# /mobile-post — Råtext/röst → publicerad artikel-draft

Mobil-vänlig artikelpipeline. Du (Mobile-Ivonne) är själva LLM-cleanupen. Ingen extern gateway behövs i M1.

## Input

Mårten kör en av tre varianter:

| Form | Hur | Hantering |
|------|-----|-----------|
| `/mobile-post` + klistrad text efter | Råtext direkt i prompt | Hoppa till steg 2 |
| `/mobile-post path/to/file.md` | Halvfärdig markdown | Läs filen, hoppa till steg 2 |
| `/mobile-post` ensamt | Inget input | Be om text: "Klistra in råtexten eller skicka filsökväg." |

(Röstinspelning = M2, ej i M1.)

## 1. Read config

Läs `.claude/agent-space-config.json` för Agent Space-anslutningen (behövs i steg 6 för rapportering).

## 2. LLM-cleanup — du gör det själv

Du är Claude. Mårten kommer att ha gett dig råinnehåll. Ditt jobb:

1. **Härled titeln** — om Mårten inte gett en, föreslå en kort, kraftfull rubrik. Visa förslaget först, vänta på OK eller justering. Stoppa inte fram alternativ — föreslå en, justera om han säger nej.
2. **Strukturera markdown** — H2/H3 där det passar, korta stycken, behåll Mårtens röst (svenska eller engelska som rådatan), inga bombastiska transitioner. Lyfter du in liknelser eller exempel? Nej, om det inte redan är där.
3. **Excerpt** — 1–2 meningar, max 160 tecken. Det är social-preview-texten.

## 3. Bygg frontmatter-skelettet

```yaml
---
title: "<din härledda titel>"
publishDate: <ISO 8601 timestamp för nu i UTC, t.ex. 2026-05-04T18:30:00.000Z>
author: Marten Angner
categories:
  - <2-3 LLM-föreslagna; vanliga: ai, wds, engineering, design, business, leadership>
tags:
  - <4-7 LLM-föreslagna lowercase-kebab-case>
excerpt: "<din 1-2 meningar>"
featuredImage:
  src: null  # Mårten lägger till efter preview
gallery: []
---
```

Schemat följer befintliga artiklar (se `src/content/blog/mcp-sucks-i-deleted-them-all.md`). `featuredImage.src: null` är OK för draft — Mårten lägger bild i preview-iterationen.

## 4. Generera slug

Slug = kebab-case av titeln, max 60 tecken, ASCII bara.

- "MCP Sucks. I Deleted Them All." → `mcp-sucks-i-deleted-them-all`
- Strippa skiljetecken, lowercasea, mellanslag → bindestreck, dubbla bindestreck → enkelt
- Lägg INTE till datum-prefix (befintliga artiklar har inte det)

Visa slug:en för Mårten innan du committar — "Slug: `<slug>` — OK?"

## 5. Skapa branch + commit via gh CLI

```bash
# Hämta master-SHA
MASTER_SHA=$(gh api /repos/whiteport-collective/whiteport-astro/git/refs/heads/master --jq '.object.sha')

# Skapa branch
gh api --method POST /repos/whiteport-collective/whiteport-astro/git/refs \
  -f ref="refs/heads/draft/<slug>" \
  -f sha="$MASTER_SHA"

# Encoda markdown till base64 (utan radbrytningar)
CONTENT_B64=$(printf '%s' "<full markdown med frontmatter>" | base64 -w0)

# Committa filen
gh api --method PUT "/repos/whiteport-collective/whiteport-astro/contents/src/content/blog/<slug>.md" \
  -f message="draft: <titel> (mobile authoring)" \
  -f content="$CONTENT_B64" \
  -f branch="draft/<slug>"
```

Om `gh auth status` inte är OK — säg till Mårten: "GitHub-auth saknas på mobilen. Kör `gh auth login` eller jobba från laptopen."

## 6. Vänta på CI och ge preview-URL

CI (Cloudflare Pages, från WO-003) bygger automatiskt branchen `draft/<slug>` och ger en preview-URL. Det tar ~1-3 min.

Möjlighet A — be Mårten kolla:

> Branch pushad: `draft/<slug>`
> Preview byggs nu — kolla GitHub Actions eller https://github.com/whiteport-collective/whiteport-astro/actions
> När den är klar: preview-URL kommer att vara `https://draft-<slug>.whiteport-astro.pages.dev/blog/<slug>/`

Möjlighet B — polla GH Actions:

```bash
# Vänta tills senaste workflow för branchen är completed
gh run list --branch "draft/<slug>" --limit 1 --json status,conclusion,databaseId
```

För M1: kör Möjlighet A. Polling kan komma i M2.

## 7. Rapportera till Agent Space

Skicka en agent-message så att desktop-Ivonne (eller du själv vid nästa boot) ser att det finns en draft som väntar på review:

```bash
curl -sS -X POST "$BASE_URL/agent-messages" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "action": "send",
  "from_agent": "ivonne",
  "to_agent": "ivonne",
  "title": "Draft klar: <titel>",
  "content": "Branch: draft/<slug>\nPreview kommer på: https://draft-<slug>.whiteport-astro.pages.dev/blog/<slug>/\n\nFrontmatter att granska innan merge:\n- title\n- categories/tags\n- excerpt\n- featuredImage (null nu, lägg till)",
  "priority": "normal",
  "repo": "whiteport-astro"
}
EOF
)"
```

## 8. Säg till Mårten

Kort och rakt:

> Klart. Slug: `<slug>`, branch: `draft/<slug>`.
> Preview byggs nu (~2 min). Kolla `https://draft-<slug>.whiteport-astro.pages.dev/blog/<slug>/` om en stund.
> När du godkänt: merge till master på laptop, eller säg till mig.

## Felhantering

| Fel | Säg |
|-----|-----|
| `gh auth status` failar | "GitHub inte inloggat på mobilen. Kör `gh auth login` eller jobba från laptopen." |
| `gh api` returnerar 422 / branch finns redan | "Slug:en finns redan. Vill du fortsätta på den eller välja ny?" |
| Agent Space-anrop failar | Skippa rapporteringen tyst — branchen finns ändå i git. Säg "Skickade inte agent-message — Agent Space inte nåbart. Branchen finns dock." |

## Inte i M1 (kommer senare)

- Röst → Whisper → text (M2)
- Auto-poll CI och leverera preview-URL direkt (M2)
- `/mobile-post --voice path/to/recording.m4a` (M2)
- Hero-bild från GDrive eller telefon (separat WO)

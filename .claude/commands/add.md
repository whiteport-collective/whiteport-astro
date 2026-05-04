# /add — Snabbcapture från whiteport-astro

Du är i whiteport-astro article-mode. Det här repot har ingen lokal `Planning/inbox.md` — så `/add` skickar idén vidare till martens-documents inbox via Agent Space.

## 1. Vad vill Mårten fånga?

Argumentet efter `/add` är hela texten. Om inget angivits, fråga: "Vad ska in i inboxen?"

## 2. Skicka till martens-documents inbox via Agent Space

Läs `.claude/agent-space-config.json` för anslutningen.

```bash
curl -sS -X POST "$BASE_URL/agent-messages" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "action": "send",
  "from_agent": "ivonne",
  "to_agent": "ivonne",
  "title": "Inbox: <första 60 tecken av idén>",
  "content": "<hela idén>\n\nFångat från whiteport-astro mobile-Ivonne $(date -u +%Y-%m-%dT%H:%M:%SZ).",
  "priority": "low",
  "repo": "martens-documents",
  "metadata": {"type": "inbox-capture"}
}
EOF
)"
```

Desktop-Ivonne tar ner det till `Planning/inbox.md` nästa gång hon kör i martens-documents (eller manuellt via `/process`).

## 3. Bekräfta

> Fångat. ✓
> Landar i martens-documents-inboxen — du processar den nästa gång du kör `/m` eller `/process` på laptopen.

## Offline-läge

Om Agent Space-anropet failar — skriv idén till en lokal `.claude/inbox-pending.md` i whiteport-astro så vi inte tappar den. Säg:

> Agent Space nere — sparat lokalt i `.claude/inbox-pending.md`. Sync nästa gång du är online.

(Skapa filen om den inte finns. Append en rad: `- [ ] <idé> (<timestamp>)`.)

# WO-007 — Google Drive Tool på Agent Space

**Project:** whiteport-astro (klient) + whiteport-collective/agent-space (server)
**Feature area:** Publishing pipeline — V8 Article Material Hub
**Owner:** Codex (implementation)
**Created:** 2026-05-04
**Status:** Specced — ready for M1

---

## Syfte

Mobile-Ivonne ska kunna både **skapa** och **läsa** Google Drive-mappar för artikelmaterial utan att Mårten behöver lämna mobilchatten.

Mappen blir artikelns hem:
- Namn = arbetstitel
- Innehåller hero-bild, gallery-bilder, voice-recordings, källmaterial
- Pekas ut via `mediaFolder` i blog-frontmatter — `astro-gdrive`-integrationen plockar upp bilderna vid build

Två vägar in från mobilchatten:

| Väg | Trigger | Resultat |
|-----|---------|----------|
| **A — Skapa** | Mårten beskriver artikel i chatten | Ny GDrive-mapp skapas automatiskt, namnet härlett från beskrivning |
| **B — Återanvänd** | Mårten klistrar in mapp-URL | Befintlig mapps innehåll läses, artikel byggs runt det |

---

## Edge functions

Deployas som Supabase edge functions på Design Space (`uztngidbpduyodrabokm`). Service account-credentials lagras i Supabase secrets — samma service account som `astro-gdrive`-integrationen redan använder vid build (Codex känner till var den ligger).

### 1. `gdrive-create-folder`

```
POST /functions/v1/gdrive-create-folder
Authorization: Bearer <anon-key>

Body:
{
  "name": "Mobile Authoring Workflow",
  "parent_id": null  // optional — defaults to Whiteport/Articles/ root
}

Response:
{
  "folder_id": "1AbCdEf...",
  "folder_url": "https://drive.google.com/drive/folders/1AbCdEf...",
  "folder_name": "Mobile Authoring Workflow",
  "media_folder_path": "Articles/Mobile Authoring Workflow"  // relative path for frontmatter mediaFolder
}
```

**Default parent:** `Whiteport/Articles/` på det shared drive Whiteport redan använder. Skapas om saknas.

**Namnkollision:** Om en mapp med samma namn redan finns under parenten — append `(2)`, `(3)`, ... Säg det i response så Ivonne kan visa Mårten.

### 2. `gdrive-list-folder`

```
POST /functions/v1/gdrive-list-folder
Authorization: Bearer <anon-key>

Body:
{
  "folder_url": "https://drive.google.com/drive/folders/1AbCdEf..."
  // ELLER:
  "folder_id": "1AbCdEf..."
}

Response:
{
  "folder_id": "1AbCdEf...",
  "folder_name": "Mobile Authoring Workflow",
  "media_folder_path": "Articles/Mobile Authoring Workflow",
  "files": [
    {
      "id": "...",
      "name": "hero-portrait.jpg",
      "mime_type": "image/jpeg",
      "size": 1234567,
      "modified": "2026-05-04T15:30:00Z",
      "thumbnail_url": "https://...",
      "is_image": true,
      "is_audio": false,
      "is_text": false
    },
    ...
  ]
}
```

**Sortering:** images först, sen audio, sen text/markdown, sen övrigt. Nyast först inom varje kategori.

**`media_folder_path` härleds** från URL:ens path från shared-drive-roten — så det matchar formatet `astro-gdrive` förväntar i frontmatter.

### 3. (Senare — M2) `gdrive-upload-text`

Ivonne kan skriva ett första utkast direkt till mappen som `.md` så det ligger samlat. Inte M1.

---

## Säkerhet

- Anon key räcker — RLS skyddas via att edge function bara kan röra mappar under `Whiteport/Articles/`-trädet (hardcoded prefix-check).
- Folder URL/ID som inte ligger under det trädet → 403.
- Service account ska INTE ha edit-rättigheter utanför detta träd — Codex verifierar Drive-permissions innan deploy.

---

## Felhantering

| Fel | Response |
|-----|----------|
| Service account inte konfigurerad | 500 + tydligt felmeddelande, "missing GDRIVE_SERVICE_ACCOUNT" |
| Mappen finns inte / inte tillgänglig | 404 |
| Mappen utanför Articles-trädet | 403 + "folder not under Whiteport/Articles/" |
| Drive-API rate limit | 429 + retry-after |

---

## Acceptanskriterier

- [ ] `gdrive-create-folder` skapar mapp under shared drive med korrekt namn, returnerar URL + media_folder_path
- [ ] `gdrive-list-folder` listar filer med metadata, sorterade och kategoriserade
- [ ] Båda funktionerna fungerar från mobilen via curl med anon key
- [ ] Service account-credentials finns i Supabase secrets, inte i koden
- [ ] Felhantering returnerar tydliga JSON-fel
- [ ] Codex testar end-to-end: skapa mapp → upload bild manuellt via web → list mappen → bekräfta att bilden visas

---

## Milstolpar

### M1 — Create + List
- Båda edge functions deployade och fungerande
- Manuell test: curl från terminal eller mobil

### M2 — Klient-integration
- Mobile-Ivonne kallar funktionerna i `/mobile-article`-skillen
- Frontmatter `mediaFolder` sätts automatiskt från response
- Hero-bild väljs (om bara en image) eller frågar Mårten (om flera)

### M3 — Upload-stöd (later)
- `/mobile-article` kan ta emot bilder direkt i chatten och uploada till mappen via en `gdrive-upload-file` edge function

---

## Beroenden

| Beroende | Status |
|----------|--------|
| Service account för GDrive | ✅ Finns redan (används av `astro-gdrive`) |
| Supabase Edge Functions runtime | ✅ Deno, redan i bruk |
| Anon key och Auth header | ✅ Klart |
| Whiteport shared drive struktur | Verifiera: finns `Articles/`-mapp? Om inte — skapa |

---

## Öppna frågor

1. **Parent folder ID** — exakt ID för "Whiteport/Articles/" shared drive-mapp behövs. Codex kan hämta via Drive API eller fråga Mårten.
2. **Permissions för nya mappar** — ska de ärva från shared drive (default) eller explicit sättas till "Whiteport-team can edit"?
3. **`media_folder_path`-format** — bekräfta att det matchar exakt vad `astro-gdrive`-integrationen i `whiteport-astro` förväntar (titta i `astro-elevenlabs.ts` eller relaterad kod).

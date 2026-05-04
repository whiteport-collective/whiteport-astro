# WO-008: NanoBanana image generation

**Repo:** Supabase project `uztngidbpduyodrabokm` (Design Space) + `whiteport-astro`
**From:** Ivonne
**To:** Codex
**Priority:** medium
**Date:** 2026-05-04

## Goal

Mobile-Ivonne ska kunna generera bilder för artiklar via Gemini image-API (NanoBanana) under skrivflödet. Bilderna landar i artikelns Drive-mapp (samma struktur som audio i WO-001), och en markdown-snippet returneras som kan klistras in i artikeltexten.

## Scope

### Edge function `generate-image`

- Path: `database/supabase/functions/generate-image/`
- `verify_jwt=true`
- Reuse helper-pattern från `gdrive-create-folder`/`gdrive-list-folder` (WO-007)

**Input:**
```json
{
  "prompt": "string",
  "style": "string (optional, e.g. 'photorealistic', 'illustration', 'diagram')",
  "articleSlug": "string",
  "mediaFolderId": "string (Drive folder ID from gdrive-create-folder)"
}
```

**Behavior:**
1. Hämta Gemini API-key via `get-secret` edge fn (key name: `GEMINI_API_KEY`)
2. Anropa Gemini image-API (model: `gemini-2.5-flash-image-preview` eller senaste tillgängliga NanoBanana-modell)
3. Spara bilden till artikelns Drive-mapp (mediaFolderId) — använd samma service-account som `gdrive-create-folder`
4. Returnera markdown-snippet + filinfo

**Output:**
```json
{
  "imagePath": "articles/<slug>/images/<filename>.png",
  "driveFileId": "string",
  "publicUrl": "string (om bilden är publik)",
  "markdownSnippet": "![alt-text](<path>)",
  "altText": "auto-generated från prompt"
}
```

### Reuse: get-secret edge fn

`get-secret` (orphan WO `fee8a04d`) är förutsättning. Om den inte är deployad än — deploy den först. Den ska kunna hämta hemligheter (API-keys) från en säker källa (Supabase secrets eller Bitwarden via separat mechanism — välj enklast som funkar).

## Acceptance

- Mobile-Ivonne kan anropa `generate-image` från `/post`-flödet
- Bilden landar i artikelns Drive-mapp under `articles/<slug>/images/`
- Markdown-snippet returneras med korrekt path
- astro-gdrive build-time-pluginet plockar upp bilden automatiskt vid bygge

## Dependencies

- `get-secret` edge fn deployad och fungerande
- `gdrive-create-folder` (WO-007 ✅ done)
- `GEMINI_API_KEY` finns i Supabase secrets (eller via Bitwarden)

## Notes

- Modellnamn för NanoBanana: kolla aktuell modell-ID i Gemini API-docs (image-preview-modeller ändras snabbt)
- Om bilden ska vara publik (för markdown-rendering): konfigurera Drive-mappen som publik vid skapande, eller använd separat CDN-länk

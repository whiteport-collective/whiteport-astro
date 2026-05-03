# WO-001 — Listen to Me (ElevenLabs Audio Integration)

**Project:** whiteport-astro  
**Feature area:** Publishing pipeline — V5 Audio  
**Owner:** Codex (implementation) / Freya (UX sign-off)  
**Created:** 2026-05-03 (retroaktivt dokumenterad)  
**Status:** M3 delivered — M4 pending deploy verification

---

## Syfte

Varje bloggartikel ska kunna lyssnas på. Mårten läser upp artikeln via ElevenLabs voice clone → MP3 + word-alignment JSON genereras vid build → AudioPlayer-komponent inbäddad i blogg-template.

---

## Milstolpar

| M | Namn | Status |
|---|------|--------|
| M1 | ElevenLabs API + Drive-cache | ✅ Klart |
| M1.5 | mediaFolder-arkitektur + Drive-cache fix | ✅ Klart |
| M2 | AudioPlayer-komponent (WaveSurfer, play/mute/volym/meny) | ✅ Klart |
| M3 | Word-wrap rehype-plugin (`data-word-index` spans) | ✅ Levererat, deploy pending |
| M4 | Highlight current word vid uppspelning | ⏳ Blockerad av M3-deploy |

---

## Arkitektur

- **Audio-pipeline:** `src/integrations/astro-elevenlabs.ts` — genererar MP3 + alignment-JSON vid build
- **Drive-cache:** `mediaFolder` i frontmatter → GDrive-mapp → `.cache/gdrive/` + `public/audio/`
- **Player:** `src/components/AudioPlayer.astro` + `src/scripts/audio-player.client.ts`
- **Word-wrap:** `src/utils/word-wrap.ts` — rehype-plugin, körs vid Markdown-rendering
- **Template-integration:** `src/pages/blog/[...slug].astro` — `hasAudio` bool styr om spelaren renderas

## Word-wrap-detaljer (M3)

Plugin: `rehypeWrapWords()` — wrappas in i `astro.config.mjs` rehype-pipeline.

- `SKIP_TAGS`: `code, kbd, pre, samp, script, style` — inte wrappade
- Skiljetecken bevaras som textnoder utanför spans
- Globalt sekventiellt `data-word-index` via closure — fortsätter över paragraf-gränser
- Unicode-aware regex `\p{L}\p{N}` — hanterar svenska tecken och apostrofer

---

## Future enhancements

- **Sticky audio player** — när användaren scrollar förbi spelaren (placerad överst i artikelkolumnen) försvinner den. För långa artiklar (3000+ ord): sticky bottom-bar som dyker upp vid scroll. Designbeslut: bör inte störa footer-CTAn. Implementeras som eget WO.
- **Waveform loading skeleton** — visuell placeholder innan WaveSurfer initialiserat canvasen
- **Synkroniserad textmarkering (M4)** — highlight current word under uppspelning (beroer av M3-deploy)

---

## Beroenden

| Beroende | Status |
|----------|--------|
| ElevenLabs API-nyckel | ✅ Konfigurerad |
| GDrive service account | ✅ Konfigurerad |
| WO-003 CI (preview-URL) | ✅ Klart |

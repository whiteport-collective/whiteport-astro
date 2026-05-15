---
title: "Jag raderade alla mina MCP-servrar. Det borde du också göra."
publishDate: 2026-05-13T00:00:00.000Z
author: Marten Angner
categories:
  - ai
  - engineering
tags:
  - mcp
  - claude-code
  - ai-agents
  - tokens
excerpt: "27 000 tokens — borta bara från att ladda dem. Verktyg jag aldrig ens anropade. Tre promptar ersatte dem alla."
gallery:
  - gdriveId: 1V8NfXxMnfUHF-A2FgOcxoo1RDyqE2_0a
    alt: "Mårten Angner på strandpromenad i rosa skjorta med armar utsträckta, badge: STOPPA MCP SLÖSERIET · 3 Promptar · 1000-tals tokens att spara"
    type: image
    width: 1080
    height: 1350
    display:
      - gallery
      - thumbnail
      - archive
      - share_image
      - linkedin
socialPosts:
  - platform: linkedin
    url: https://www.linkedin.com/feed/update/urn:li:activity:7460199669839802368/
    postedAt: 2026-05-13T00:00:00.000Z
---

𝗝𝗮𝗴 𝗿𝗮𝗱𝗲𝗿𝗮𝗱𝗲 𝗮𝗹𝗹𝗮 𝗺𝗶𝗻𝗮 𝗠𝗖𝗣-𝘀𝗲𝗿𝘃𝗿𝗮𝗿. Slapp en massa huvudvärk och sparade tiotusentals tokens. Det borde du också göra!

Inte för att jag gav upp på AI-verktyg. Utan för att jag fick reda på vad de faktiskt kostade mig — och ingen hade berättat det.

Varje MCP-server laddar hela sitt verktygskatalog i ditt kontext vid start. Varje verktyg. Varje schema. Varje beskrivning. Oavsett om du anropar dem eller inte.

Jag bad min agent räkna.

𝟮𝟳 𝟬𝟬𝟬 𝘁𝗼𝗸𝗲𝗻𝘀. Borta — innan jag skrivit ett enda ord.

En kollega körde samma koll. Hans siffra var 61 000.

𝗗𝘂 𝗶𝗻𝗳𝗼𝗿𝗺𝗲𝗿𝗮𝗱𝗲𝘀 𝗶𝗻𝘁𝗲. 𝗗𝘂 𝗯𝗲𝘀𝗸𝗮𝘁𝘁𝗮𝗱𝗲𝘀.

Fixet tog mindre än en timme. 𝗧𝗿𝗲 𝗽𝗿𝗼𝗺𝗽𝘁𝗮𝗿:

→ "Hur många tokens laddade mina MCP-servrar vid start? Bryt ner det per server och per verktyg."

→ "Bygg ett skript som låter mig använda mina MCP-verktyg när jag vill, utan att ladda dem vid start."

→ "Bryt ut varje verktygsamtal till en separat skill-fil och länka till den från huvud-skill:en där den används."

Protokollet är inte fienden — arkitekturen är. Alla integrationer bör anropas. 𝗜𝗻𝘁𝗲 𝗹𝗮𝗱𝗱𝗮𝘀.

[Läs artikeln: MCP Sucks. I Deleted Them All. So Should You. →](/blog/mcp-sucks-i-deleted-them-all/)

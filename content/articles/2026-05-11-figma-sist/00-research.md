# Research — Figma sist, inte först

## Tes
Att öppna Figma först när du arbetar med AI-agenter är ett strategiskt misstag. Design-teamets gamla arbetsordning är nu ett direkt hinder för att lyckas.

## Varför nu
Figma MCP finns. Cursor + agenter ritar i Figma. Alla designers testar det — och blir besvikna. Det är rätt timing att namnge exakt varför det inte fungerar och vad som gör det.

## Argument
1. Agenter är dåliga på att rita i Figma — de är utmärkta på att skriva kod
2. Att låta agenter generera Figmaskisser är token-slöseri utan proportionellt värde
3. Figma → kod via MCP är snårigt och fungerar inte självständigt
4. En Figmabild i kontext ger agenten för lite strukturerad information för att komma någonstans
5. Figma-först gör dig till flaskhals i din egen AI-implementation

## Läsarens invändningar
- "Men jag måste se designen visuellt innan vi bygger" → Wireframes finns av en anledning. Det är mycket bättre att slänga in snabba skisser och låta agenten sätta upp alla objekt än att göra det i Figma.
- "Figma MCP förbättras hela tiden" → Det strukturella problemet kvarstår: agenten behöver kunna identifiera alla objekt. Det är svårt om lager heter "Lager 23" men lätt om de heter "hero-image" och kan lokaliseras i koden.
- "Kunden förväntar sig Figmamockups" → Kunden förväntar sig en fungerande produkt. Figma är ett kommunikationsverktyg, inte ett produktionskrav.

## Bevis / exempel
- Figma MCP finns men kräver manuell handpåläggning för varje steg — det är inte autonomt
- Agenter som skriver komponentkod mot ett design-system producerar genast körbar output
- Object IDs och semantiska lagernamn är det som faktiskt hjälper agenten — men det är specen och designsystemet som genererar dem, inte Figmabilden i sig

## WDS-kopplingen
Wireframes + storyboards + spec är den magiska kombinationen. Låt agenter hjälpa dig att brainstorma, men spara det som var bra i en skiss och spec. Sedan bygger agenten mot det. Figma kommer in sist — som kommunikationsyta mot klient eller handoff till utvecklare, inte som startpunkt.

## Hooks (kandidater)
1. *"Vi designers är emotionellt beroende av Figma. Det kostar oss tid vi inte har."*
2. *"Din agent kan rita i Figma. Den är bara förfärlig på det."*
3. *"Figma är inte din fiende. Men du behandlar den som om den vore din startpunkt."*
4. *"Problemet med AI i designteam handlar inte om agenternas förmåga. Det handlar om ordningsföljden."*

## Artikelstruktur
1. Hook — designers emotionella förhållande till Figma
2. Symptom — vi öppnar Figma instinktivt, direkt
3. Orsak — agenter är byggda för kod, inte bilder; Figma MCP löftet vs verkligheten (lagernamn, autonomi)
4. Wireframes är inte fel — de ska bara inte vara i Figma
5. Lösningen — wireframe + storyboard + spec → agenten bygger → Figma sist
6. Designsystemet som enabler: semantiska namn, object IDs, komponentbibliotek
7. Vinsten — agenter som arbetar autonomt, designers som fokuserar på beslut

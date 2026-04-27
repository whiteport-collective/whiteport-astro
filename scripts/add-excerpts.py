#!/usr/bin/env python3
"""Add excerpt: fields to 74 blog posts missing meta descriptions."""

import os
import re
import sys

BLOG_DIR = r"c:/dev/WDS/whiteport-astro/src/content/blog"

EXCERPTS = {
    "%f0%9f%8e%ac-behind-the-scenes-when-lines-of-thinking-gets-a-little-too-reel.md":
        "Outtakes from the Lines of Thinking filming — bloopers, brain freezes, and unscripted magic captured by SoMe Agency during a memorable day.",
    "%f0%9f%98%a9-ar-du-missnojd-med-din-hemsida-web-app-eller-e-handel.md":
        "Du är inte ensam om att ursäkta sin hemsida. De flesta vill bättre — Whiteport hjälper dig ta nästa steg med UX och digital design.",
    "10-mannifesto.md":
        "Tio principer som vägleder allt vi gör på Whiteport — från systemdesign till långsiktiga kundrelationer och en digital framtid du äger själv.",
    "2555.md":
        "AI reveals design thinking rather than replacing it. In WDS Session 1 we explored what happens when you explain your ideas component by component.",
    "3-set-om-8-och-den-heliga-cardio.md":
        "Tre set om åtta, lång vila och scrollande mellan seten. Mycket i träningsvärlden är gamla hjulspår — inte ny kunskap. Dags att ifrågasätta.",
    "a-happy-client-2.md":
        "Nowwhere trusted Whiteport and we're proud of the results. Get in touch to see how we can help your business grow with digital solutions.",
    "a-happy-client-3.md":
        "Fyndicsvajpen trusted Whiteport to optimize their client experience and we're delighted to have been chosen. Is it your business's turn next?",
    "a-happy-client-4.md":
        "Byt Hjul is now a happy Whiteport client. We help any business go online — from wheel-changing services to digital experiences that work.",
    "a-happy-client-5.md":
        "Tickin is a happy Whiteport client. Our time reporting system makes it easy to track working hours so you can focus on what actually matters.",
    "a-happy-client-6.md":
        "Ubermeds chose Whiteport to bring their unique idea to life. We love helping companies with bold visions turn them into digital products.",
    "a-happy-client-7.md":
        "Västtrafik Calculator is a happy Whiteport client. Put your trust in us and enjoy the results — get in touch and let's discuss your needs.",
    "a-happy-client-8.md":
        "Träningpartner is a happy Whiteport client — another step forward in our mission to build digital products that make a real difference.",
    "a-happy-client.md":
        "Indoor Energy is a happy Whiteport client. We love seeing our clients grow — send us a message to discuss how we can help your business too.",
    "ai-for-design-teams-ska-vara-roligt.md":
        "Att implementera AI på designavdelningen ska vara kul, inte ett projekt med 14 styrgrupper. Whiteport visar hur designteam går från ord till handling.",
    "birdie-gold-tours-is-a-happy-client.md":
        "Birdie Gold Tours trusted Whiteport and we're proud of the results. Join our growing list of happy clients — let's talk about your vision.",
    "choosing-your-path-in-the-ai-era-why-whiteport-design-studio-matters-for-designers.md":
        "Whiteport Design Studio Module 00: how designers get started using AI agents to stay indispensable and thrive in the age of artificial intelligence.",
    "content-calendars.md":
        "Letar du efter en bra mall för content-kalender till sociala medier? Social Stream gör det lättare att planera och publicera som ett team.",
    "dear-desginers-now-it-is-not-the-time-to-despare.md":
        "Feeling overwhelmed by AI noise? Mårten Angner introduces Whiteport Design Studio — a framework that makes designers indispensable, not replaceable.",
    "designers-know-how-to-make-product-people-love.md":
        "Designers know how to make products people love. In WDS Session 1 we showed how design thinking is exactly what AI needs to build the right thing.",
    "did-you-attend-martens-sketching-courses.md":
        "Attended one of Mårten's sketching courses? Share your story to win a new kit and a free spot in the updated Lines of Thinking course.",
    "din-dag-utan-social-stream.md":
        "En dag utan Social Stream: stressig, ostrukturerad och reaktiv. En dag med det: fokuserad, kreativ och proaktiv. Skillnaden är faktiskt stor.",
    "do-you-know-how-to-sketch-i-think-you-do.md":
        "You already know how to sketch — it's about communication, not art. Simple shapes externalize your thinking in ways both people and AI understand.",
    "fanga-uppmarksamhet-med-olika-typsnitt.md":
        "Fet stil, kursiv och varierade typsnitt fångar användarens öga direkt. Med Social Stream är det enkelt att formatera text som verkligen sticker ut.",
    "first-think-then-you-vibe.md":
        "AI builds fast — but what if you're building the wrong thing faster? Think before you vibe: strategy and design thinking matter more than ever with AI.",
    "frilansfinans-valjer-whiteport.md":
        "Frilansfinans väljer Whiteport som sin digitala partner. Vi är stolta över förtroendet och ser fram emot ett givande och långsiktigt samarbete.",
    "from-strategy-to-product-in-8-ai-powered-phases.md":
        "WDS connects every step from business strategy to living product through AI agents — no more copying context between tools or re-briefing agents.",
    "gor-din-hemsida-levande-med-social-wall.md":
        "Social Wall låter dig visa sociala inlägg direkt på hemsidan — innehållet försvinner inte i flödet utan får en permanent, sökbar plats på din site.",
    "gymzombies.md":
        "Gymmet håller på att bli ett väntrum. Skärmar, hörlurar och doomscrollande mitt i träningen — för vad? Lämna mobilen i skåpet och ge allt du har.",
    "har-du-svart-att-hinna-med-sociala-medier-har-google-drive-kor-wordpress-da-har-vi-en-cool-grej-till-dig.md":
        "Tycker du att sociala medier tar för mycket tid? Social Stream kopplar ihop Google Drive med WordPress så du kan planera, samarbeta och publicera smartare.",
    "integration-med-google-drive-smidigare-an-nagonsin.md":
        "Trött på att jaga bilder och filer för sociala medier? Social Streams Google Drive-integration samlar allt på ett ställe för smidig hantering.",
    "lets-gather-as-designers-less-talk-more-action.md":
        "CX/UX/UI designers and AI: less talk, more action. Whiteport created WDS Sessions to give designers a practical space to test and grow together.",
    "lines-of-thinking-seminar-2.md":
        "Awaken your creative artist at Lines of Thinking — a 3-hour sketching seminar at The Park Forskaren on 4 June 2025, also available online.",
    "lines-of-thinking-seminar.md":
        "Lines of Thinking teaches you to sketch in minutes — then goes further, combining conceptual thinking and AI to amplify your design process.",
    "manifesto-1.md":
        "How many systems do you juggle daily? Whiteport's manifesto starts here: break out of the SAAS spiral and build one system for your whole business.",
    "manifesto-2.md":
        "Standard business systems are designed for everyone — which means they're really designed for no one. Whiteport believes your system should be truly yours.",
    "manifesto-3.md":
        "A proper business system must support your full customer lifecycle — from getting attention to closing sales and building long-term relationships.",
    "manifesto-4.md":
        "Every company is unique. Forcing rigid new systems onto your business without respecting its culture is tone-deaf — and Whiteport refuses to do it.",
    "manifesto-5.md":
        "Companies that own their platforms have a superpower: they can adapt instantly when the market shifts. Whiteport helps you get there step by step.",
    "manifesto-6.md":
        "Innovation is a learnable skill. Using open source as a base, Whiteport helps companies master their own digital destiny without ongoing licence fees.",
    "manifesto-7.md":
        "Whiteport's goal: make every client fully self-sufficient in their development journey. We're evangelists for taking back control of your digital tools.",
    "manifesto-8.md":
        "Open source e-commerce can transform your entire business — beyond sales. Automate invoices and integrate custom workflows with flexible, scalable tech.",
    "manifesto-9.md":
        "Getting started is easier than you think — Whiteport identifies your vision and finds the smallest change that makes the biggest difference first.",
    "need-smarter-solutions.md":
        "Stop copy-pasting between systems. Whiteport builds integrated platforms under the motto 'one business, one system' — starting with what matters most.",
    "ny-utmaning.md":
        "Mårten Angner söker sitt nästa drömuppdrag — ett bolag med ambitioner större än resurserna. Startup, familjeföretag eller etablerat varumärke i förändring.",
    "nytt-samarbete.md":
        "Det började med frågan: varför gör vi det så komplicerat? Social Stream och vårt samarbete föddes ur frustrationen med sociala mediers eviga loop.",
    "our-vision.md":
        "Whiteport's vision: a world where every organisation builds nurturing relationships with customers, employees, and partners through brilliantly designed technology.",
    "post-2761.md":
        "A short reflection on agent psychology and how AI agents approach problems differently than human designers.",
    "presentation-of-social-stream-plugin.md":
        "Social Stream samlar ditt sociala innehåll på hemsidan, gör det sökbart på Google och effektiviserar publiceringen — ett verktyg som täcker hela flödet.",
    "redo-att-bygga-din-webb-app-med-ai.md":
        "Nu kan du programmera appar med AI — men hur börjar du? Whiteport erbjuder stöd i rätt nivå, från din första idé hela vägen till en färdig lösning.",
    "seminar-feedback.md":
        "Deltagarna älskar Lines of Thinking. Läs omdömena och se vad som händer när du vågar skissa och uttrycka din kreativitet — nästa grupp är din.",
    "seminar-lines-of-thinking-at-the-park-forskaren.md":
        "Lines of Thinking at The Park Forskaren — a hands-on sketching seminar where visual thinking transforms how you communicate and generate ideas.",
    "should-designers-draw-by-hand-in-2025.md":
        "Sketching in 2025 is a superpower. Hand-drawn intent is the clearest input for AI — turning rough concepts into running code faster than any prompt.",
    "some-stockholm-is-a-happy-client.md":
        "SoMe Agency Stockholm automated their invoicing and client handling with Whiteport's system — no more jumping between tools, just streamlined results.",
    "test.md":
        "What is digital design that makes business sense? Design that drives conversions, improves engagement, and aligns with your goals — not just aesthetics.",
    "thank-you-for-the-book.md":
        "A book that genuinely shaped the WDS. Whiteport Design Studio — the free, open source AI agent framework for designers — is now available for everyone.",
    "things-are-happening-fast.md":
        "Designers must embrace AI in 2026 — but on our own terms. WDS, Whiteport Design Studio, amplifies your existing design process instead of replacing it.",
    "trottnat-pa-vibe-coding-gor-detta-istallet.md":
        "Tröttnat på vibe coding? Mårten gick från magisk känsla till evighetsloopar — och hittade att välstrukturerade skisser är det bästa AI-underlaget.",
    "user-case-skargardspartner.md":
        "Skärgårdspartner's electricians needed tools that worked in the field. Whiteport built a human-centered service management system that actually delivered.",
    "vad-bygger-du-i-mellandagarna.md":
        "Mellandagarna är en frizon för utforskning. Mårten bygger AI-agenter för designers — inte för att ersätta kreativiteten, utan för att ampliera den.",
    "visuell-introduktion.md":
        "Med Social Stream som content-kalender ser du arkiverade inlägg, planerar framåt och har full kontroll — video, bild, text och hashtags på ett ställe.",
    "want-to-create-an-app.md":
        "Got an app idea? Whiteport sketches it out at a whiteboard, then coordinates designers and developers to turn your vision into a real product.",
    "wds-040-build-specification-release.md":
        "WDS 0.4.0 ships build specifications: complete database schemas, state machines, and API surfaces that a coding agent can build from without questions.",
    "wds-jam-1.md":
        "WDS Jam 1 is an online event exploring the role of designers in the age of AI — join us December 22 for a practical hands-on session.",
    "wds-session-2-strategy-in-practise.md":
        "WDS Session 2 puts digital strategy into practice. Join Mårten Angner online January 15th and learn how to build things worth building with AI.",
    "wds-session-3-lets-get-going.md":
        "WDS Session 3 is for designers who want to build the right thing before building it fast. Turn vague goals into executable strategy with AI.",
    "wds-session-4-ai-agents-teams.md":
        "WDS Session 4 explores AI agents and design teams. Join Mårten Angner on February 11 and discover how to work with AI as a true design partner.",
    "wds-sessions-2-digital-strategy.md":
        "Speed without strategy produces expensive mistakes. WDS Sessions 2 brings design strategy back — because a bad idea is still a bad idea, even with AI.",
    "wds-sessions-3-lets-get-going.md":
        "WDS Session 3 goes from white panic to first commit. Join Mårten online January 29th to install WDS and start building with AI-driven design agents.",
    "we-just-created-ai-agents-that-make-designers-indispensable-free-open-source.md":
        "WPS2C is here: AI agents that move designers into the development environment, delivering complete product documentation as build-ready code artifacts.",
    "we-just-wrapped-up-the-first-wds-session-and-the-feedback-has-been-incredible.md":
        "WDS Session 1 delivered a paradigm shift: specs fed directly into the IDE, BMAD-trained agents, and a production-ready workflow available today.",
    "welcome-to-whiteport.md":
        "Whiteport is a Stockholm-based digital agency specialising in UX design and custom open source business systems. Curious how we can help your business?",
    "what-are-we-going-to-post-today-%f0%9f%98%b5.md":
        "Vad ska vi posta idag? Den eviga frågan för entreprenörer. Vi tröttnade och byggde Social Stream — ett verktyg som planerar hela din närvaro i förväg.",
    "whiteport-manifesto.md":
        "Whiteport's manifesto: One Business, One System. We believe companies should take back power over their digital tools and build systems that fit perfectly.",
    "wps2c-is-here-ai-agents-for-every-digital-creative.md":
        "WPS2C launches AI agents for every digital creative — designers can now deliver complete product documentation as build-ready artifacts inside the IDE.",
}


def add_excerpt(filepath: str, excerpt: str) -> bool:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Already has excerpt or creativeNote
    if "excerpt:" in content or "creativeNote:" in content:
        return False

    # Find frontmatter closing ---
    # Frontmatter: starts at char 0 with ---, ends with second ---
    match = re.match(r"^(---\n)(.*?)(^---\n)", content, re.DOTALL | re.MULTILINE)
    if not match:
        print(f"  SKIP (no frontmatter): {os.path.basename(filepath)}")
        return False

    front_open = match.group(1)
    front_body = match.group(2)
    front_close = match.group(3)
    rest = content[match.end():]

    # Escape any double quotes in the excerpt
    safe_excerpt = excerpt.replace('"', '\\"')
    excerpt_line = f'excerpt: "{safe_excerpt}"\n'

    new_content = front_open + front_body + excerpt_line + front_close + rest

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def main():
    updated = 0
    skipped = 0
    for filename, excerpt in EXCERPTS.items():
        filepath = os.path.join(BLOG_DIR, filename)
        if not os.path.exists(filepath):
            print(f"  NOT FOUND: {filename}")
            skipped += 1
            continue
        if add_excerpt(filepath, excerpt):
            print(f"  + {filename}")
            updated += 1
        else:
            print(f"  ~ already has excerpt: {filename}")
            skipped += 1

    print(f"\nDone: {updated} updated, {skipped} skipped")


if __name__ == "__main__":
    main()

-- Pending inserts for Ivonne Soul (uztngidbpduyodrabokm)
-- Run when Supabase MCP is available again

-- Key architecture decisions → thoughts table
INSERT INTO public.thoughts (id, content, thought_type, topics, source, created_at, updated_at) VALUES
(gen_random_uuid(),
 'ARCHITECTURE DECISION: whiteport-astro — 100% static Astro site replacing WordPress. AI agent is the CMS: content authored as markdown files in Git, GitHub Actions builds, static hosting serves. No database, no Supabase, no server-side rendering. Clients interact with their sites through ChatGPT via GitHub editing. Social Stream WordPress plugin converted to Astro Content Collections pattern with Zod schemas. Tags and filter pages for topic/keyword filtering. Locked content via client-side query parameter unlock. This becomes both the Whiteport reference site and a repeatable offering for clients.',
 'decision',
 ARRAY['whiteport-astro', 'architecture', 'static site', 'Astro', 'agent-as-CMS', 'Social Stream', 'content collections', 'WordPress migration'],
 'claude-code',
 now(), now()),

(gen_random_uuid(),
 'TECH STACK DECISION: whiteport-astro uses Astro + Tailwind CSS v4 + MDX + Sitemap. Content as markdown/MDX files in Git repo. Zod schemas validate content collections (stream posts, blog posts). Social media data from WP plugin maps to: Custom Post Types → Content Collections, Taxonomies → frontmatter tags/categories/locations/mentions, ACF fields → Zod schema, Shortcodes → Astro components (StreamCard, StreamGallery, StreamSlider, StreamList, StreamFooter). Deploy to Netlify/Cloudflare Pages. Staging at ai.whiteport.com.',
 'decision',
 ARRAY['whiteport-astro', 'tech stack', 'Astro', 'Tailwind', 'MDX', 'Zod', 'content collections'],
 'claude-code',
 now(), now()),

(gen_random_uuid(),
 'BROWNFIELD APPROACH: whiteport-astro is a brownfield migration from WordPress — skip UX scenarios, go straight to Product Backlog + Trigger Map. PB items include design acceptance criteria (visual/UX) AND development acceptance criteria (technical). Trigger Map maps WP features to Astro equivalents, surfaces what to keep vs drop. WDS v0.3.3 installed with Freya and Saga agents.',
 'decision',
 ARRAY['whiteport-astro', 'brownfield', 'WDS methodology', 'product backlog', 'trigger map'],
 'claude-code',
 now(), now());

-- Project design context → design_space table
INSERT INTO public.design_space (id, content, category, project, designer, client, topics, components, source, source_file, created_at, updated_at) VALUES
(gen_random_uuid(),
 'Social Stream content collection schema: title, publishDate, draft, locked, unlockKey, tags, categories, locations, mentions, featuredImage, gallery (image/video array), socialPosts (platform, url, postText, postedAt), creativeNote, excerpt, hideFromStream. Mapped from WP ACF fields and custom post type.',
 'content-architecture',
 'whiteport-astro',
 'Mårten Angner',
 'Whiteport',
 ARRAY['content collections', 'Zod schema', 'Social Stream', 'migration mapping'],
 ARRAY['StreamCard', 'StreamGallery', 'StreamSlider', 'StreamList', 'StreamFooter', 'TagCloud', 'FilterBar'],
 'claude-code',
 'design-process/B-Trigger-Map/',
 now(), now()),

(gen_random_uuid(),
 'Page routing: Home (/), About (/about), Services (/services), Blog listing (/blog), Blog post (/blog/[slug]), Stream listing (/stream), Stream post (/stream/[slug]), Tag page (/tags/[tag]), Tags index (/tags), Category page (/category/[cat]). All static, built at build time. Tags collected across all collections.',
 'information-architecture',
 'whiteport-astro',
 'Mårten Angner',
 'Whiteport',
 ARRAY['routing', 'pages', 'tags', 'filtering', 'information architecture'],
 ARRAY['TagCloud', 'TagList', 'FilterBar'],
 'claude-code',
 'design-process/B-Trigger-Map/',
 now(), now());

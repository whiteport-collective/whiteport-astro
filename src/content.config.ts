import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// --- Shared schemas ---

const galleryItemSchema = z.object({
  // Media source — one of these is required
  gdriveId: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().default(''),
  type: z.enum(['image', 'video']).default('image'),
  width: z.number().optional(),
  height: z.number().optional(),
  // Video-specific
  poster: z.string().optional(),        // GDrive ID or URL for video poster
  youtubeId: z.string().optional(),     // If set, embed YouTube instead of self-hosting
  // Display contexts (from WP Social Stream)
  display: z.array(z.string()).optional(),
});

const socialPostSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'personal']),
  postText: z.string().default(''),
  url: z.string().url().optional(),     // Link to published post
  postedAt: z.coerce.date().optional(),
});

// --- Blog collection (unified stream + articles) ---

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    locked: z.boolean().default(false),
    unlockKey: z.string().optional(),
    author: z.string().default('Whiteport'),

    // Taxonomies
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    locations: z.array(z.string()).default([]),
    mentions: z.array(z.string()).default([]),

    // Media
    featuredImage: z.object({
      gdriveId: z.string().optional(),
      src: z.string().optional(),
    }).optional(),
    gallery: z.array(galleryItemSchema).default([]),

    // Social media posts
    socialPosts: z.array(socialPostSchema).default([]),

    // Sidebar offers (manual override for auto-matched services)
    offers: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      href: z.string(),
      cta: z.string().optional(),
      label: z.string().optional(),
    })).optional(),

    // Content metadata
    creativeNote: z.string().optional(),
    excerpt: z.string().optional(),
    hideFromStream: z.boolean().default(false),
    gdriveLink: z.string().optional(),

    // WP migration reference
    wpId: z.number().optional(),
    wpPermalink: z.string().optional(),
  }),
});

// --- Project block schemas (WP-style visual layout) ---

const projectImageSchema = z.object({
  src: z.string(),
  alt: z.string().default(''),
  size: z.enum(['large', 'banner']).default('large'),
});

const contentImageBlockSchema = z.object({
  type: z.literal('content-image'),
  reverse: z.boolean().default(false),
  highlighted: z.boolean().default(false),
  heading: z.string().optional(),
  text: z.string(),                    // Markdown-flavored text
  list: z.array(z.string()).optional(), // Bullet points (e.g. "What we did")
  image: projectImageSchema,
});

const posterBlockSchema = z.object({
  type: z.literal('poster'),
  image: projectImageSchema,
  full: z.boolean().default(false),    // true = edge-to-edge, false = page-width
});

const testimonialBlockSchema = z.object({
  type: z.literal('testimonial'),
  heading: z.string().default('What our client say'),
  quote: z.string(),
  name: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  avatar: z.string().optional(),       // URL to avatar image
});

const projectBlockSchema = z.discriminatedUnion('type', [
  contentImageBlockSchema,
  posterBlockSchema,
  testimonialBlockSchema,
]);

// --- Projects collection (portfolio/case studies) ---

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    client: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.object({
      gdriveId: z.string().optional(),
      src: z.string().optional(),
      alt: z.string().default(''),
    }).optional(),
    gallery: z.array(galleryItemSchema).default([]),
    blocks: z.array(projectBlockSchema).default([]),
    url: z.string().url().optional(),
  }),
});

export const collections = { blog, projects };

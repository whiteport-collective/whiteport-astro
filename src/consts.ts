// Whiteport site configuration
// Brand tokens from the WP theme (assets/src/scss/abstracts/_variables.scss)

export const SITE_TITLE = 'Whiteport';
export const SITE_DESCRIPTION = 'Whiteport is a charming digital agency passionate about saving the world, one digital design project at a time. Our methods unify strategic thinking, UX, visual design and AI technology.';
export const SITE_URL = 'https://whiteport.com';

export const BRAND = {
  blue: '#043F76',
  red: '#D74560',
  buttonBg: '#4879A7',
  buttonHover: '#5386B5',
  redCta: '#EA345D',
  redCtaHover: '#EC4B6F',
  base: '#2e2e2e',
  grey: '#3C3B3B',
  footerBg: '#222',
  footerColor: '#EEE',
  sectionBg: '#F6F8FA',
} as const;

export const COMPANY = {
  name: 'Whiteport',
  email: 'hello@whiteport.com',
  founderEmail: 'marten@angner.se',
  founder: 'Mårten Angner',
  founderTitle: 'Digital Product Manager & UX Designer',
  founderPhone: '+46707770579',
  location: 'Stockholm, Sweden',
  address: 'Klubbacken 49, 129 39 Hägersten',
  mapsUrl: 'https://www.google.com/maps/dir//Klubbacken+49,+129+39+H%C3%A4gersten',
  team: [
    {
      name: 'Mårten Angner',
      title: 'Digital Product Manager & UX Designer',
      email: 'marten@angner.se',
      phone: '+46707770579',
    },
    {
      name: 'Anna Jois',
      title: 'Project Manager',
      email: 'anna@joynation.se',
      phone: '+46735110064',
    },
  ],
} as const;

export const NAV_ITEMS = [
  { label: 'Start', href: '/' },
  { label: 'Agency', href: '/#agency' },
  { label: 'Projects', href: '/projects/' },
  { label: 'WDS', href: '/wds/' },
  { label: 'Services', href: '/services/' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Manifesto', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const SOCIAL_LINKS = {
  linkedin: 'https://se.linkedin.com/company/whiteport-agency',
  facebook: 'https://www.facebook.com/WhiteportCollective',
  instagram: 'https://www.instagram.com/martenangner/',
} as const;

export const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'] as const;

export const SERVICES = [
  {
    title: 'Digital strategy',
    description: 'Define a clear digital strategy aligned with your business goals.',
    href: '/services/',
    tags: ['strategy', 'digital-strategy', 'strategic-thinking', 'digital-marketing', 'seo', 'ai-search', 'visibility', 'marketing'],
  },
  {
    title: 'UX & Interaction design',
    description: 'Create comfortable and conversion-focused digital experiences.',
    href: '/services/',
    tags: ['ux-design', 'product-design', 'prototyping', 'product-management'],
  },
  {
    title: 'Visual design',
    description: 'Craft the visual experience with attention to every detail.',
    href: '/services/',
    tags: ['visual-design', 'branding', 'design-process', 'digital-design'],
  },
  {
    title: 'Requirement engineering',
    description: 'Clear requirements lead to better products and fewer surprises.',
    href: '/services/',
    tags: ['lean-startup', 'saas'],
  },
  {
    title: 'Frontend development',
    description: 'Modern, responsive frontend built with the latest technology.',
    href: '/services/',
    tags: ['frontend-development', 'web-development', 'development', 'low-code', 'wordpress'],
  },
  {
    title: 'AI-driven development',
    description: 'Leverage AI to build faster, smarter digital products.',
    href: '/wds/',
    tags: ['ai', 'ai-workflow', 'ai-coding', 'bmad', 'wds', 'prompt-burn'],
  },
] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

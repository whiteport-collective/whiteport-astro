// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import astroGdrive from './src/integrations/astro-gdrive';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://whiteport.com',
  integrations: [astroGdrive(), mdx(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
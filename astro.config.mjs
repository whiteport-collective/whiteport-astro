// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import astroGdrive from './src/integrations/astro-gdrive';
import astroElevenLabs from './src/integrations/astro-elevenlabs';
import rehypeWrapWords from './src/utils/word-wrap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://whiteport.com',
  integrations: [
    astroElevenLabs(),
    astroGdrive(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/tags/') && !page.includes('/presentations'),
    }),
    react(),
  ],
  markdown: {
    remarkRehype: {
      allowDangerousHtml: true,
    },
    rehypePlugins: [rehypeWrapWords],
  },

  vite: {
    plugins: [
      tailwindcss(),
      // Vite 6 compat: some plugins register transform: { handler: undefined }
      // which crashes EnvironmentPluginContainer.transform. Strip those hooks.
      {
        name: 'fix-undefined-transform-handlers',
        enforce: 'pre',
        configResolved(config) {
          for (const plugin of config.plugins) {
            if (plugin.transform !== null && typeof plugin.transform === 'object'
                && !plugin.transform.handler) {
              delete plugin.transform;
            }
          }
        },
      },
    ],
    ssr: {
      external: ['sharp'],
    },
    build: {
      rollupOptions: {
        // agentation is a local dev-only annotation overlay, gated behind {isDev && ...}
        // in BaseLayout. Mark external so Rollup skips bundling when CI lacks the local package.
        external: ['agentation'],
      },
    },
  },
});

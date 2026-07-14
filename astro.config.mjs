// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NOTE: `site` is a PLACEHOLDER canonical origin — replace before launch.
export default defineConfig({
  site: 'https://dastur.example',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  image: { responsiveStyles: true },
  vite: {
    ssr: { noExternal: ['gsap'] },
  },
});

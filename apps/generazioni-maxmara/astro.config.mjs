import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://agargiulo-adbe.github.io',
  base: '/experience-design-factory',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@edf/core': new URL('../../packages/core/src', import.meta.url).pathname,
      },
    },
  },
});

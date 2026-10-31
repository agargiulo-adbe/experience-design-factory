import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  site: 'https://agargiulo-adbe.github.io',
  base: '/experience-design-factory/bper-sopra-quello-che-avete',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@edf/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      },
    },
  },
});

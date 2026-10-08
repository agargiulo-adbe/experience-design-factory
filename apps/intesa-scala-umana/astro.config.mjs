import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// L'app contiene DUE cose: la pagina dossier (orfana, gated, noindex) e — dall'8
// ottobre 2026 — la Prospettiva per l'incontro del 22. Resta NON registrata in
// hub, showcase e deploy pubblico: la decisione della §33.3 dell'handover vale
// ancora, una pagina col nome del cliente su URL indovinabile prima
// dell'incontro non serve a niente. In `deck-audit.ts` sì: e' utensile locale.
export default defineConfig({
  site: 'https://agargiulo-adbe.github.io',
  base: '/experience-design-factory/intesa-scala-umana',
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

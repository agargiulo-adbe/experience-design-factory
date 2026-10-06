import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// App MINIMALE, di proposito: oggi contiene SOLO la pagina dossier (orfana,
// gated, noindex). Nessun deck, nessun tailwind, nessun @edf/core — quindi
// niente card sulla hub, niente voce nello showcase, niente ROUTE_SETS in
// deck-audit. Si registrerà altrove quando l'experience esisterà davvero.
export default defineConfig({
  site: 'https://agargiulo-adbe.github.io',
  base: '/experience-design-factory/intesa-dopo-la-firma',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    resolve: {
      alias: {
        '@edf/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      },
    },
  },
});

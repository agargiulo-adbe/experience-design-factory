import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// L'app contiene UNA sola pagina: il dossier interno sul Dipartimento della
// Giustizia Tributaria (orfana, gated, noindex). Non c'è un'experience, non c'è
// un deck, non c'è tailwind.
//
// NON è registrata in hub, showcase e deploy pubblico, e non deve esserlo: una
// pagina con il nome di un cliente su un URL indovinabile, prima che l'incontro
// sia avvenuto, non serve a niente e può solo nuocere. Vale la stessa decisione
// presa per `intesa-scala-umana`.
export default defineConfig({
  site: 'https://agargiulo-adbe.github.io',
  base: '/experience-design-factory/mef-giustizia-tributaria',
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

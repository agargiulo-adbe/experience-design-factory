import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { edizioneIntegration } from '../../packages/core/src/integrations/edizione.ts';

/* Due edizioni dallo stesso sorgente (spec 2026-11-19-edizione-lettura):
   `sala` è il deck proiettato, `lettura` (PUBLIC_EDF_EDIZIONE=lettura) è il
   link da distribuire, su un percorso suo e senza le pagine di chi presenta. */
const LETTURA = (process.env.PUBLIC_EDF_EDIZIONE ?? '').trim().toLowerCase() === 'lettura';
/* La versione B («Da costruire insieme», PUBLIC_EDF_VERSIONE=insieme): la lettura
   più il modulo anonimo e il riepilogo per la banca, a un percorso suo, così l'AE
   e il referente confrontano le due versioni dal vivo. */
const INSIEME = LETTURA && (process.env.PUBLIC_EDF_VERSIONE ?? '').trim().toLowerCase() === 'insieme';

/* Una copia ospitata altrove (25 nov 2026): la rete di Deloitte, e la stessa
   AdobeCorp, bloccano *.github.io a livello DNS. EDF_SITE / EDF_BASE / EDF_OUT
   spostano dominio, percorso e cartella senza toccare le tre build di sempre;
   vuote, non cambiano niente. Vedi `scripts/awesome-pack.sh`. */
const SITE_ALTROVE = (process.env.EDF_SITE ?? '').trim();
const BASE_ALTROVE = (process.env.EDF_BASE ?? '').trim();
const OUT_ALTROVE = (process.env.EDF_OUT ?? '').trim();

export default defineConfig({
  site: SITE_ALTROVE || 'https://agargiulo-adbe.github.io',
  base: BASE_ALTROVE || (INSIEME ? '/experience-design-factory/intesa-storia-insieme'
    : LETTURA ? '/experience-design-factory/intesa-storia' : '/experience-design-factory/intesa-esperienza-cliente'),
  outDir: OUT_ALTROVE || (INSIEME ? './dist-insieme' : LETTURA ? './dist-lettura' : './dist'),
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    edizioneIntegration({
      soloSala: ['relatore', 'presentatore', 'admin', 'analytics', 'circolo', 'risultati-old', 'dieci-minuti', 'prossimi-passi'],
      soloLettura: ['parliamone', 'breve'],
      soloInsieme: ['riepilogo'],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@edf/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      },
    },
  },
});

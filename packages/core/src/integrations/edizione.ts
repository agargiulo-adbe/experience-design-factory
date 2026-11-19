/**
 * Integrazione Astro dell'edizione: dopo la build toglie da `dist` le rotte
 * che non appartengono all'edizione corrente. In «lettura» spariscono le
 * pagine di chi presenta (relatore, presentatore, admin…), in «sala» quelle
 * fatte per chi legge da solo. Cancella cartelle: per questo ogni rotta deve
 * essere un nome semplice, mai un percorso.
 */
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseEdizione, type Edizione } from '../utils/edizione';

export interface CfgEdizione { soloSala: string[]; soloLettura: string[] }

function sicura(r: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(r)) throw new Error(`rotta d'edizione non valida: «${r}»`);
  return r;
}

export function rotteDaTogliere(ed: Edizione, cfg: CfgEdizione): string[] {
  return (ed === 'lettura' ? cfg.soloSala : cfg.soloLettura).map(sicura);
}

export function edizioneIntegration(cfg: CfgEdizione) {
  const ed = parseEdizione(process.env.PUBLIC_EDF_EDIZIONE);
  return {
    name: 'edf-edizione',
    hooks: {
      'astro:build:done': async ({ dir }: { dir: URL }) => {
        const root = fileURLToPath(dir);
        for (const r of rotteDaTogliere(ed, cfg)) await rm(join(root, r), { recursive: true, force: true });
      },
    },
  };
}

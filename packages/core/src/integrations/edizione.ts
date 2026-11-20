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
import { parseEdizione, parseVersione, type Edizione, type Versione } from '../utils/edizione';

/** `soloInsieme`: le pagine della versione B (es. il riepilogo per la banca),
 *  che escono dalla sala e dalla versione A. */
export interface CfgEdizione { soloSala: string[]; soloLettura: string[]; soloInsieme?: string[] }

function sicura(r: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(r)) throw new Error(`rotta d'edizione non valida: «${r}»`);
  return r;
}

export function rotteDaTogliere(ed: Edizione, cfg: CfgEdizione, ver: Versione = 'leggere'): string[] {
  const base = ed === 'lettura' ? cfg.soloSala : cfg.soloLettura;
  const extra = ed === 'lettura' && ver === 'insieme' ? [] : (cfg.soloInsieme ?? []);
  return [...base, ...extra].map(sicura);
}

export function edizioneIntegration(cfg: CfgEdizione) {
  const ed = parseEdizione(process.env.PUBLIC_EDF_EDIZIONE);
  const ver = parseVersione(process.env.PUBLIC_EDF_VERSIONE, ed);
  return {
    name: 'edf-edizione',
    hooks: {
      'astro:build:done': async ({ dir }: { dir: URL }) => {
        const root = fileURLToPath(dir);
        for (const r of rotteDaTogliere(ed, cfg, ver)) await rm(join(root, r), { recursive: true, force: true });
      },
    },
  };
}

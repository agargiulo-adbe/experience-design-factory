/**
 * Il registro dei tagli «In dieci minuti».
 *
 * Un'experience che ha due percorsi — quello intero e il taglio da dieci minuti —
 * si dichiara qui. Senza una riga qui il taglio non viene verificato da nessuno,
 * e un taglio non verificato diverge: è successo su Intesa, dove la correzione
 * arrivata sul percorso lungo non era arrivata sul corto (vedi la memoria
 * `taglio-corto-stessa-fonte`).
 *
 * - `taglio`  — il nome della rotta del taglio, come sta in `deck-routes.ts`.
 *               Convenzione per le experience nuove: `dieci-minuti`. Intesa usa
 *               `exec` perché è nata prima della convenzione e il suo link è già
 *               stato condiviso: un indirizzo pubblicato non si cambia per gusto.
 * - `fonti`   — i file che contengono la FONTE UNICA dei blocchi condivisi,
 *               relativi alla cartella dell'app. Il gate ci legge le stringhe e
 *               verifica che la pagina del taglio non le riscriva a mano.
 * - `slideMax`— quante slide può avere il taglio: cinque o sei di contenuto, più
 *               la copertina e la slide-firma dove il contratto del co-brand le
 *               richiede. Oltre, non è più un taglio.
 * - `numeriSoloNelTaglio` — le eccezioni dichiarate: un numero che vive solo nel
 *               taglio (una data in copertina, il numero di pagine) e che quindi
 *               non va cercato nel percorso lungo. Ogni voce è una deroga, e si
 *               scrive qui perché si veda.
 */
export interface CutSpec {
  taglio: string;
  fonti: string[];
  slideMax: number;
  numeriSoloNelTaglio?: string[];
}

export const CUT_SETS: Record<string, CutSpec> = {
  'intesa-scala-umana': {
    taglio: 'exec',
    fonti: ['src/data/contenuti.ts', 'src/data/sources.ts'],
    slideMax: 6,
    numeriSoloNelTaglio: ['22', '2026', '5'],
  },
  'intesa-esperienza-cliente': {
    taglio: 'dieci-minuti',
    fonti: ['src/data/momenti.ts', 'src/data/referenze.ts'],
    slideMax: 6,
    numeriSoloNelTaglio: ['10'],
  },
  'trenitalia-prospettiva-sales': {
    taglio: 'dieci-minuti',
    fonti: ['src/data/contenuti.ts', 'src/data/sources.ts'],
    slideMax: 7,
    numeriSoloNelTaglio: ['10'],
  },
};

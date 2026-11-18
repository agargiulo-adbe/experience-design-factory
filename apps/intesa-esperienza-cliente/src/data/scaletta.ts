/**
 * LA SCALETTA DEL 19 NOVEMBRE: 55 minuti, sei voci, chi parla e quando.
 *
 * Fonte: la suddivisione proposta dal team nella chat Teams «Intesa» il 17 nov
 * 2026 (01 6', 02 8', 03 20' diviso 9' + 11', 04 8', 05 5', 06 8'). La legge la
 * finestra presentatore (`pages/presentatore.astro`): il blocco in corso si ricava
 * dalla slide in onda, e il conto alla rovescia è sul suo tempo.
 *
 * Nomi del team Adobe (quelli della slide «Il team»), mai del cliente: il repo è
 * pubblico. Una slide fuori da ogni blocco (gli approfondimenti) non cambia
 * blocco: il tempo resta su quello che l'ha aperta.
 */
export interface Blocco {
  id: string;
  n: string;
  titolo: string;
  chi: string;
  /** minuto di inizio e di fine nella scaletta */
  da: number;
  a: number;
  /** le pagine del blocco; `slide` restringe a quelle slide (il capitolo 03 è diviso in due) */
  pagine: { slug: string; slide?: string[] }[];
}

export const DURATA_MIN = 55;

export const SCALETTA: Blocco[] = [
  { id: '01', n: '01', titolo: 'Adobe, chi siamo', chi: 'Alex e Francesca', da: 0, a: 6,
    pagine: [{ slug: 'index' }, { slug: 'adobe' }] },
  { id: '02', n: '02', titolo: 'Giulia', chi: 'Antonio', da: 6, a: 14,
    pagine: [{ slug: 'scenario' }, { slug: 'persona' }, { slug: 'momenti' }] },
  { id: '03a', n: '03', titolo: 'Dove ci innestiamo · innesto e «Come funziona»', chi: 'Antonio', da: 14, a: 23,
    pagine: [{ slug: 'messa-a-terra', slide: ['slide-cover', 'slide-innesto'] }] },
  { id: '03b', n: '03', titolo: 'Dove ci innestiamo · le quattro domande di CJA, fino al ritorno', chi: 'Matteo', da: 23, a: 34,
    pagine: [{ slug: 'messa-a-terra' }] },
  { id: '04', n: '04', titolo: 'CX Enterprise Coworker', chi: 'Giacomo', da: 34, a: 42,
    pagine: [{ slug: 'coworker' }] },
  { id: '05', n: '05', titolo: 'Referenze', chi: 'Francesca e Alex', da: 42, a: 47,
    pagine: [{ slug: 'risultati' }] },
  { id: '06', n: '06', titolo: 'I prossimi passi', chi: 'Alex e Francesca', da: 47, a: 55,
    pagine: [{ slug: 'prossimi-passi' }] },
];

/** Il blocco di una slide: il primo che la contiene (per questo 03a sta prima di 03b). */
export function bloccoDi(slug: string, id: string): Blocco | null {
  return SCALETTA.find((b) => b.pagine.some((p) => p.slug === slug && (!p.slide || p.slide.includes(id)))) ?? null;
}

/* L'ATTRIBUZIONE DELLE FIRME, UNA FONTE SOLA (14 nov 2026).
   La leggono il pannello di `slide-attribuzione` (messa-a-terra) e il mock
   del momento 07 (`MockAdobe.astro`), che prima teneva le sue quote a mano:
   due slide dello stesso deck non devono dare due divisioni diverse della
   stessa firma.

   Cifre di ESEMPIO, dichiarate in slide. Quote in percento delle richieste
   firmate, somma 100 per modello. Il dato è lo stesso nei due modelli: cambia
   solo come si divide il credito, ed è quello che la slide fa vedere.
   - `ultimo`: ultimo clic. La firma va all'ultimo passo, che per un mutuo è
     quasi sempre la filiale.
   - `algo`: modello algoritmico di Customer Journey Analytics. Le quote sono
     quelle che il mock del momento 07 mostrava già. */
export interface CanaleAttr {
  k: 'annunci' | 'ricerca' | 'sito' | 'email' | 'filiale';
  l: { it: string; en: string };
  ultimo: number;
  algo: number;
  filiale?: boolean;
}

export const ATTRIBUZIONE: readonly CanaleAttr[] = [
  { k: 'annunci', l: { it: 'Annunci social', en: 'Social ads' }, ultimo: 2, algo: 14 },
  { k: 'ricerca', l: { it: 'Ricerca a pagamento', en: 'Paid search' }, ultimo: 3, algo: 12 },
  { k: 'sito', l: { it: 'Sito e app', en: 'Website and app' }, ultimo: 6, algo: 24 },
  { k: 'email', l: { it: 'Email', en: 'Email' }, ultimo: 9, algo: 16 },
  { k: 'filiale', l: { it: 'Filiale', en: 'Branch' }, ultimo: 80, algo: 34, filiale: true },
];

/** Quota dei canali digitali sul totale, per modello. */
export const DIGITALE = {
  ultimo: ATTRIBUZIONE.filter((c) => !c.filiale).reduce((s, c) => s + c.ultimo, 0),
  algo: ATTRIBUZIONE.filter((c) => !c.filiale).reduce((s, c) => s + c.algo, 0),
};

/** Quota algoritmica per chiave, per chi la legge da fuori (il mock 07). */
export const QUOTA_ALGO = Object.fromEntries(ATTRIBUZIONE.map((c) => [c.k, c.algo])) as Record<CanaleAttr['k'], number>;

/* IL FLUSSO FRA I PUNTI DI CONTATTO (call interna, 16 nov 2026).
   Lo ha chiesto il referente analytics l'11 novembre: un comportamento seguito
   su proprietà digitali e fisiche, «disegnato in una sorta di Sankey», per
   vedere che quella email ha generato quella vendita in filiale. Un collega
   Adobe ha proposto lo stesso giorno la visualizzazione Flow di Customer
   Journey Analytics fra due dimensioni (canale di marketing → canale di
   interazione → conversione). Qui è ridisegnata nel linguaggio del deck.
   ⚠️ I valori sono LARGHEZZE DI ESEMPIO, non dati: la slide lo dice. Le
   conversioni sono di clienti e non‑clienti insieme, perché è la capability,
   non la storia di Giulia. */
export interface Nodo { k: string; it: string; en: string }
export const CONTATTO: Nodo[] = [
  { k: 'email', it: 'Email', en: 'Email' },
  { k: 'social', it: 'Annunci social', en: 'Social ads' },
  { k: 'ricerca', it: 'Ricerca a pagamento', en: 'Paid search' },
  { k: 'notifiche', it: 'Notifiche app', en: 'App notifications' },
  { k: 'diretto', it: 'Diretto', en: 'Direct' },
];
export const INTERAZIONE: Nodo[] = [
  { k: 'sito', it: 'Sito', en: 'Website' },
  { k: 'app', it: 'App', en: 'App' },
  { k: 'fd', it: 'Filiale Digitale', en: 'Filiale Digitale' },
  { k: 'filiale', it: 'Filiale', en: 'Branch' },
];
export const ESITO: Nodo[] = [
  { k: 'nuovo', it: 'Nuovo cliente', en: 'New customer' },
  { k: 'cliente', it: 'Cliente, nuovo prodotto', en: 'Customer, new product' },
];
/* Righe = contatto, colonne = interazione (sito, app, fd, filiale). */
export const A: number[][] = [
  [10, 4, 3, 5],
  [11, 2, 1, 4],
  [10, 1, 2, 3],
  [1, 9, 1, 1],
  [6, 6, 7, 13],
];
/* Righe = interazione, colonne = esito (nuovo, cliente). */
export const B: number[][] = [
  [22, 16],
  [5, 17],
  [6, 8],
  [12, 14],
];
/* LA STESSA VISTA, UN'ALTRA DOMANDA (owner, 17 nov 2026). Al terzo passo si
   trascina la dimensione «Prodotto» sulla colonna di mezzo, come in Customer
   Journey Analytics: nella visualizzazione Flow «ogni colonna può mostrare una
   dimensione diversa; si trascina una dimensione in una zona di rilascio»
   (Experience League, Inter-dimensional flows). ⚠️ Non «istantaneo»: la pagina
   del Flow dice che il tempo di resa cresce con colonne ed elementi. E non si
   RIORDINANO le colonne: nel Flow seguono il tempo, quindi «Esito» non va prima
   del contatto.
   I numeri sono costruiti perché le colonne ai lati restino IDENTICHE (righe di
   P = righe di A, colonne di Q = colonne di B): cambia solo quella di mezzo, che
   è la cosa che chi guarda deve vedere cambiare. Prodotti d'esempio. */
export const PRODOTTO: Nodo[] = [
  { k: 'mutuo', it: 'Mutuo', en: 'Mortgage' },
  { k: 'conto', it: 'Conto', en: 'Account' },
  { k: 'carta', it: 'Carta', en: 'Card' },
  { k: 'prestito', it: 'Prestito', en: 'Personal loan' },
];
/* Righe = contatto, colonne = prodotto (mutuo, conto, carta, prestito). */
export const P: number[][] = [
  [9, 6, 3, 4],
  [3, 8, 4, 3],
  [6, 5, 2, 3],
  [1, 3, 6, 2],
  [8, 10, 6, 8],
];
/* Righe = prodotto, colonne = esito (nuovo, cliente). */
export const Q: number[][] = [
  [15, 12],
  [20, 12],
  [3, 18],
  [7, 13],
];
/* Il percorso che si accende al secondo passo: la email che chiude allo sportello. */
export const EVIDENZA = { contatto: 'email', interazione: 'filiale', esito: 'nuovo' };

/* La geometria, calcolata una volta: nodi come barre, flussi come nastri. */
const W = 1000, H = 400, NW = 12, K = 2.64;
const X = [210, 494, 778];
const somma = (v: number[]) => v.reduce((s, x) => s + x, 0);
function colonna(valori: number[], x: number, gap: number, y0 = 0) {
  let y = y0;
  return valori.map((v) => { const n = { x, y, h: v * K }; y += v * K + gap; return n; });
}
const vL = A.map(somma);
const vR = ESITO.map((_, j) => somma(B.map((r) => r[j])));
const gL = (H - 100 * K) / (CONTATTO.length - 1);
const gR = 64;
export const NL = colonna(vL, X[0], gL);
export const NR = colonna(vR, X[2], gR, (H - 100 * K - gR) / 2);

function nastro(x0: number, y0: number, x1: number, y1: number, h: number) {
  const m = (x0 + x1) / 2;
  return `M${x0},${y0}C${m},${y0} ${m},${y1} ${x1},${y1}L${x1},${y1 + h}C${m},${y1 + h} ${m},${y0 + h} ${x0},${y0 + h}Z`;
}
export interface Flusso { d: string; da: string; a: string; on: boolean; tratto: 1 | 2 }
/* La colonna di mezzo e i suoi nastri, per una dimensione qualunque: stessi
   nodi ai lati, stesso ordine dei nastri (riga per riga), così che il passaggio
   da una dimensione all'altra si possa animare nastro per nastro. */
function vista(medio: Nodo[], a: number[][], b: number[][], evidenza: { interazione: string } | null) {
  const vM = medio.map((_, j) => somma(a.map((r) => r[j])));
  const gM = (H - 100 * K) / (medio.length - 1);
  const NM = colonna(vM, X[1], gM);
  const flussi: Flusso[] = [];
  {
    const uscita = NL.map((n) => n.y), entrata = NM.map((n) => n.y);
    a.forEach((r, i) => r.forEach((v, j) => {
      const h = v * K;
      flussi.push({ d: nastro(X[0] + NW, uscita[i], X[1], entrata[j], h), da: CONTATTO[i].k, a: medio[j].k, tratto: 1,
        on: !!evidenza && CONTATTO[i].k === EVIDENZA.contatto && medio[j].k === evidenza.interazione });
      uscita[i] += h; entrata[j] += h;
    }));
  }
  {
    const uscita = NM.map((n) => n.y), entrata = NR.map((n) => n.y);
    b.forEach((r, i) => r.forEach((v, j) => {
      const h = v * K;
      flussi.push({ d: nastro(X[1] + NW, uscita[i], X[2], entrata[j], h), da: medio[i].k, a: ESITO[j].k, tratto: 2,
        on: !!evidenza && medio[i].k === evidenza.interazione && ESITO[j].k === EVIDENZA.esito });
      uscita[i] += h; entrata[j] += h;
    }));
  }
  return { NM, flussi };
}
const vI = vista(INTERAZIONE, A, B, EVIDENZA);
const vP = vista(PRODOTTO, P, Q, null);
export const NM = vI.NM;
export const FLUSSI: Flusso[] = vI.flussi;
export const NM_P = vP.NM;
export const FLUSSI_P: Flusso[] = vP.flussi;
export const GEO = { W, H, NW, X };

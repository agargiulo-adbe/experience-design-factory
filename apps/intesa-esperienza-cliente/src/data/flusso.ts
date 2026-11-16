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
const vM = INTERAZIONE.map((_, j) => somma(A.map((r) => r[j])));
const vR = ESITO.map((_, j) => somma(B.map((r) => r[j])));
const gL = (H - 100 * K) / (CONTATTO.length - 1);
const gM = (H - 100 * K) / (INTERAZIONE.length - 1);
const gR = 64;
export const NL = colonna(vL, X[0], gL);
export const NM = colonna(vM, X[1], gM);
export const NR = colonna(vR, X[2], gR, (H - 100 * K - gR) / 2);

function nastro(x0: number, y0: number, x1: number, y1: number, h: number) {
  const m = (x0 + x1) / 2;
  return `M${x0},${y0}C${m},${y0} ${m},${y1} ${x1},${y1}L${x1},${y1 + h}C${m},${y1 + h} ${m},${y0 + h} ${x0},${y0 + h}Z`;
}
export interface Flusso { d: string; da: string; a: string; on: boolean; tratto: 1 | 2 }
export const FLUSSI: Flusso[] = [];
{
  const uscita = NL.map((n) => n.y), entrata = NM.map((n) => n.y);
  A.forEach((r, i) => r.forEach((v, j) => {
    if (!v) return;
    const h = v * K;
    FLUSSI.push({ d: nastro(X[0] + NW, uscita[i], X[1], entrata[j], h), da: CONTATTO[i].k, a: INTERAZIONE[j].k, tratto: 1,
      on: CONTATTO[i].k === EVIDENZA.contatto && INTERAZIONE[j].k === EVIDENZA.interazione });
    uscita[i] += h; entrata[j] += h;
  }));
}
{
  const uscita = NM.map((n) => n.y), entrata = NR.map((n) => n.y);
  B.forEach((r, i) => r.forEach((v, j) => {
    const h = v * K;
    FLUSSI.push({ d: nastro(X[1] + NW, uscita[i], X[2], entrata[j], h), da: INTERAZIONE[i].k, a: ESITO[j].k, tratto: 2,
      on: INTERAZIONE[i].k === EVIDENZA.interazione && ESITO[j].k === EVIDENZA.esito });
    uscita[i] += h; entrata[j] += h;
  }));
}
export const GEO = { W, H, NW, X };

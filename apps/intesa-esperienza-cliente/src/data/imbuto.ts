/**
 * L'IMBUTO DI ACQUISIZIONE — fonte unica, e numeri che reggono.
 *
 * Lo rendono due slide: lo Scenario (quattro righe, la forma della
 * perdita) e il mock di Customer Journey Analytics nel momento 07
 * (cinque righe, con la filiale dentro). Erano due copie a mano, e il
 * panel del 30 ott 2026 ha trovato quello che due copie producono:
 * nello Scenario l'imbuto era dichiarato illustrativo, nel mock lo
 * stesso imbuto era intestato «ultimi 30 giorni» come un cruscotto
 * vero; e la forma non era quella di un mutuo (31% da consenso a
 * erogazione, 48.000 visite al mese per il sito del Gruppo «da filiale
 * di provincia» — parole del seggio tecnico).
 *
 * I numeri sono ILLUSTRATIVI, e lo dicono entrambe le slide. Ma anche
 * un ordine di grandezza illustrativo deve avere la forma giusta: visite
 * in milioni, consensi a una cifra percentuale delle visite, richieste
 * firmate a una cifra percentuale dei consensi.
 *
 * `v` è la larghezza della barra, e NON è lineare: con numeri plausibili
 * la barra delle firme sarebbe alta un pixel. Dice la forma, i numeri
 * dicono il vero.
 */
export interface RigaImbuto {
  n: string;
  v: number;
  l: { it: string; en: string };
  /** La riga della filiale: sta dentro l'imbuto, non accanto. */
  offline?: boolean;
}

export const IMBUTO: RigaImbuto[] = [
  { n: '1,4 mln', v: 100, l: { it: 'visite alle pagine dei mutui', en: 'visits to the mortgage pages' } },
  { n: '96.000', v: 44, l: { it: 'simulano la rata', en: 'simulate the repayment' } },
  { n: '22.000', v: 26, l: { it: 'lasciano nome e consenso', en: 'leave a name and consent' } },
  { n: '6.400', v: 15, l: { it: 'appuntamenti in filiale', en: 'branch appointments' }, offline: true },
  { n: '1.900', v: 8, l: { it: 'firmano la richiesta', en: 'sign the application' } },
];

export const IMBUTO_NOTA = {
  it: 'Ordini di grandezza illustrativi, non i vostri dati.',
  en: 'Illustrative orders of magnitude, not your data.',
};

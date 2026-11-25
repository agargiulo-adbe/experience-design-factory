/**
 * La «Vista unica del funnel» — i dati delle figure del capitolo.
 *
 * NASCE IL 25 NOV 2026, dalla call interna sui casi d'uso: prima di ogni legame
 * fra le persone esiste una fase 0 che porta in Customer Journey Analytics, così
 * come sono, gli Analytics di trenitalia.com e quelli di Le Frecce (app compresa)
 * e li legge su una linea del tempo sola. Il nome viene dalle parole usate con il
 * responsabile dei canali digitali a ottobre: «una vista unica sul funnel».
 *
 * TRE REGOLE, decise prima di disegnare:
 *  · nessuna cifra assoluta plausibile. Le curve e le barre sono indici d'ipotesi
 *    senza scala: in sala un numero diventa «il loro», e questo non lo è;
 *  · la fase 0 NON lega le persone. Ogni figura che mette insieme i due siti lo fa
 *    per giorno e per tratta, e lo dice;
 *  · i campi dei due tag sono quelli VISTI nei beacon di produzione il 25 nov 2026
 *    (Chromium, ricerca Roma Termini → Milano Centrale dalla home): su
 *    trenitalia.com il «Cerca» manda partenza, arrivo, data e ora in eVar51/52/53/55;
 *    Le Frecce, all'arrivo, le riscrive in eVar36/37/38/39 e mette la provenienza in
 *    eVar44. Sullo stesso numero i due tag scrivono cose diverse (eVar51 è la
 *    partenza su trenitalia.com, su Le Frecce porta un altro valore): è la ragione
 *    concreta della rimappatura.
 *  · l'app sta nella report suite di Le Frecce: negli estratti d'uso quella report
 *    suite riceve sia chiamate del browser sia dell'SDK mobile (ott-nov 2026). Le
 *    chiamate non sono visite, quindi non se ne ricava una quota.
 */

/* ── Che cosa entra ──────────────────────────────────────────────────── */
export const FONTI = {
  gruppo: {
    nome: 'La report suite di Gruppo',
    sotto: 'trenitalia.com, nella vostra organizzazione',
    fonti: [{ nome: 'trenitalia.com', dettaglio: 'la ricerca, le pagine, le campagne' }],
    freccia: 'connettore Analytics',
  },
  frecce: {
    nome: 'La report suite di Le Frecce',
    sotto: 'nell’organizzazione di Le Frecce',
    fonti: [
      { nome: 'Le Frecce, sul web', dettaglio: 'i risultati, la scelta, la conferma' },
      { nome: 'L’app', dettaglio: 'la stessa report suite, dall’SDK mobile' },
    ],
    freccia: 'connettore Analytics, con la mappatura fra organizzazioni',
  },
  cja: {
    nome: 'Customer Journey Analytics',
    sotto: 'una connessione, due dataset, un data view',
    funzioni: ['campi derivati', 'metriche fra i due siti', 'previsione e anomalie', 'Coworker'],
  },
  resta: 'Nessun tag cambia. Nessuna persona si lega: si leggono giorni e tratte.',
};

/* L'ipotesi sui tempi: è nostra e lo dice. La mappatura fra organizzazioni si
   chiede ad Adobe; il connettore porta indietro fino a 13 mesi (Experience League,
   «Connect Adobe Analytics to Experience Platform»). */
export const TEMPI = [
  { n: '0', nome: 'Prima del via', durata: 'contratto', esito: 'Customer Journey Analytics ed Experience Platform attivi' },
  { n: '1', nome: 'Le due fonti', durata: '1–2 settimane', esito: 'mappatura fra organizzazioni, connettori, 13 mesi di storico' },
  { n: '2', nome: 'La rimappatura', durata: '2 settimane', esito: 'campi resi uguali, data view, controlli sui numeri' },
  { n: '3', nome: 'Le prime letture', durata: '2 settimane', esito: 'le analisi di questo capitolo, con il vostro team' },
];

/* ── La stessa tratta, scritta due volte ─────────────────────────────── */
export const CAMPI = {
  tcom: {
    dove: 'Su trenitalia.com, al «Cerca»',
    righe: [
      { k: 'Partenza', v: 'eVar51', es: 'Roma Termini' },
      { k: 'Arrivo', v: 'eVar52', es: 'Milano Centrale' },
      { k: 'Data', v: 'eVar53', es: 'il giorno scelto' },
      { k: 'Ora', v: 'eVar55', es: 'l’ora scelta' },
    ],
  },
  frecce: {
    dove: 'Su Le Frecce, all’arrivo',
    righe: [
      { k: 'Partenza', v: 'eVar36', es: 'Roma Termini' },
      { k: 'Arrivo', v: 'eVar37', es: 'Milano Centrale' },
      { k: 'Data', v: 'eVar38', es: 'il giorno scelto' },
      { k: 'Ora', v: 'eVar39', es: 'l’ora scelta' },
      { k: 'Da dove arriva', v: 'eVar44', es: 'www.trenitalia.com' },
    ],
  },
  derivato: { nome: 'Tratta', es: 'Roma Termini → Milano Centrale', nota: 'un campo derivato, che vale anche sui mesi passati' },
  attenzione: 'Sullo stesso numero i due tag scrivono cose diverse: eVar51 è la partenza su trenitalia.com, su Le Frecce porta un altro valore. Per questo si rimappa prima di leggere.',
};

/* ── Una linea del tempo sola ────────────────────────────────────────── */
/* Ventotto giorni d'ipotesi, indice senza scala. Il venerdì e la domenica
   salgono, come in un calendario ferroviario; il giorno 19 le conferme cedono
   mentre ricerche e arrivi tengono: è «il giorno che non torna», l'esempio del
   rilevamento delle anomalie. Gli ultimi sette sono la previsione. */
const ritmo = [0.92, 0.88, 0.9, 0.95, 1.18, 0.98, 1.12];
const giorno = (i: number, base: number, ampiezza: number) =>
  +(base * (1 + (ritmo[i % 7] - 1) * ampiezza) * (1 + i * 0.004)).toFixed(2);

export const SERIE = (() => {
  const n = 28;
  const ricerche = Array.from({ length: n }, (_, i) => giorno(i, 100, 1));
  const arrivi = ricerche.map((v, i) => +(v * (0.62 + 0.02 * Math.sin(i / 3))).toFixed(2));
  const conferme = arrivi.map((v, i) => +(v * (i === 18 ? 0.18 : 0.52 + 0.015 * Math.cos(i / 2))).toFixed(2));
  const previsione = Array.from({ length: 7 }, (_, j) => giorno(n + j, 100, 1) * 0.62 * 0.52);
  return { n, ricerche, arrivi, conferme, previsione: previsione.map((v) => +v.toFixed(2)), anomalia: 18 };
})();

export const LINEE = [
  { id: 'ricerche', nome: 'Ricerche su trenitalia.com', p: 'a' },
  { id: 'arrivi', nome: 'Arrivi su Le Frecce da trenitalia.com', p: 'b' },
  { id: 'conferme', nome: 'Conferme d’acquisto su Le Frecce', p: 'c' },
] as const;

/* ── Dove si perde, tratta per tratta ────────────────────────────────── */
/* Indici: le ricerche della tratta valgono 100. Le tratte sono vere, i valori
   no. Due righe portano la lettura che decide a chi parlarne. */
export const TRATTE = [
  { tratta: 'Roma Termini → Milano Centrale', ricerche: 100, arrivi: 64, conferme: 35 },
  { tratta: 'Napoli Centrale → Roma Termini', ricerche: 100, arrivi: 38, conferme: 21,
    lettura: 'si perde nel passaggio fra i due siti', chi: 'Customer Operations' },
  { tratta: 'Milano Centrale → Venezia Santa Lucia', ricerche: 100, arrivi: 66, conferme: 17,
    lettura: 'arriva, vede il prezzo, si ferma', chi: 'Marketing e Revenue Management' },
  { tratta: 'Firenze S.M.N. → Roma Termini', ricerche: 100, arrivi: 61, conferme: 33 },
];

/* ── Le analisi del primo giorno: oggi, e con la vista unica ─────────── */
export const ANALISI = [
  { nome: 'La domanda prima del prezzo',
    domanda: 'Quali tratte e quali date si cercano su trenitalia.com, e con quanto anticipo?',
    oggi: 'Si legge nel solo Analytics di Gruppo, senza sapere che cosa succede dopo.',
    con: 'Accanto, quanti arrivano su Le Frecce e confermano, per la stessa tratta e lo stesso giorno.',
    funzione: 'campi derivati' },
  { nome: 'Il giorno che non torna',
    domanda: 'Un giorno le conferme calano e le ricerche no: dove è successo?',
    oggi: 'Due report da affiancare a mano, quando qualcuno se ne accorge.',
    con: 'Una metrica sola fra i due siti, con il rilevamento delle anomalie sopra.',
    funzione: 'anomalie' },
  { nome: 'Il web o l’app, per tratta',
    domanda: 'Su quali tratte la conferma passa di più dall’app?',
    oggi: 'Sta in un’altra report suite, che si apre a parte.',
    con: 'Web e app nello stesso data view, divisi per tratta e per giorno.',
    funzione: 'una connessione' },
  { nome: 'Le settimane che arrivano',
    domanda: 'Quali settimane, su quali tratte, porteranno più ricerche?',
    oggi: 'Si ragiona sullo storico, a mano.',
    con: 'La previsione disegnata sulla curva, tratta per tratta.',
    funzione: 'previsione' },
  { nome: 'La domanda a parole',
    domanda: '«Perché la settimana scorsa Napoli–Roma ha confermato meno?»',
    oggi: 'Si chiede a un analista.',
    con: 'Coworker risponde sui due siti insieme, con il grafico.',
    funzione: 'Coworker' },
];

/* ── A chi serve, oltre al digitale ──────────────────────────────────── */
/* Le direzioni si nominano per la leva che governano, e la leva resta loro: la
   lettura la porta il digitale. Decisione del 25 nov 2026. */
export const DESTINATARI = [
  { chi: 'Marketing e Revenue Management', legge: 'la domanda cercata per tratta e anticipo, prima che si veda un prezzo', leva: 'il prezzo e i tempi delle promozioni', p: 'a' },
  { chi: 'Customer Operations', legge: 'dove il percorso cala fra il passaggio e la conferma, sul web e sull’app', leva: 'il percorso d’acquisto', p: 'a' },
  { chi: 'Sales', legge: 'la domanda dall’estero, per paese e per lingua', leva: 'i mercati e i canali', p: 'a' },
  { chi: 'Chi gestisce l’app', legge: 'su quali tratte l’app conta di più', leva: 'i contenuti e le card della home', p: 'b' },
  { chi: 'Chi manda SMS e notifiche', legge: 'in che giorni e su quali tratte si cerca di più', leva: 'il momento delle offerte, come l’upgrade', p: 'b' },
  { chi: 'Media e campagne', legge: 'quali campagne portano ricerche che arrivano alla conferma', leva: 'il budget, tratta per tratta', p: 'b' },
];

/* ── Dalla lettura al test ───────────────────────────────────────────── */
export const CICLO = [
  { nome: 'Si legge', cosa: 'Napoli–Roma: molte ricerche il venerdì sera, pochi arrivi su Le Frecce.' },
  { nome: 'Si fa un’ipotesi', cosa: 'Chi cerca il venerdì vuole il ritorno della domenica, e non lo trova subito.' },
  { nome: 'Si prova su Target', cosa: 'Un test A/B in home: la variante propone anche il ritorno.' },
  { nome: 'Si misura', cosa: 'Subito sul «Cerca»; sull’acquisto, nella vista unica, per tratta e per giorno.' },
];

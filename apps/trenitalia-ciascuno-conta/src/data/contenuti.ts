/**
 * «Ciascuno conta» — la copia del LIVELLO PUBBLICO del deck, una volta sola.
 *
 * Regola di questo file: ogni riga deve poter essere letta dal cliente senza danno.
 * È la base della versione che andrà alla Direzione Sales. Quello che è solo nostro
 * (persone per nome, strategia, GNARR, giornate, costi, leva commerciale) NON sta qui:
 * sta nello strato interno in Supabase (`restricted_docs.content.deck`), che il runtime
 * `Riservato.astro` carica con il link a token. Seed git-ignorato in docs/Ferrovie/.
 *
 * Riscritta il 17 nov 2026 (decisioni in docs/Ferrovie/strato-deck/DECISIONI-2026-11-17.md):
 * tre verbi — misurare, conoscere, personalizzare — con il consenso trasversale; l'MVP
 * con i servizi professionali Adobe e Accenture; la riconciliazione degli ECID come
 * condizione, senza piano B sull'aggregato; il lab di marzo diviso fra dati veri e demo.
 *
 * Voce: frasi intere e corte, un fatto per riga. Niente occhielli sopra i titoli,
 * niente antitesi, niente motti. Il titolo dice il punto della slide.
 */

export const COVER = {
  occhiello: 'Una proposta di lavoro · novembre 2026',
  sub: 'Dimostrare sui vostri dati che parlare a ciascun viaggiatore fa vendere di più, e farne il lavoro di ogni giorno.',
  firma: 'Ciascuno conta',
};

/* ── L'idea ────────────────────────────────────────────────────────────── */
export const MATTINA = {
  titolo: 'Alle nove e un minuto si sa perché il venduto di ieri è sceso',
  sub: 'Oggi per la stessa risposta servono giorni.',
  domanda: 'Ieri il venduto da app è sceso rispetto a martedì scorso. Perché?',
  risposta: [
    'Il calo si concentra sulle prenotazioni serali da app, sulle tratte Milano–Roma.',
    'Da lunedì la proposta per i titolari CartaFreccia raggiunge solo una parte del pubblico: il segmento è cambiato.',
  ],
  azione: 'Ripristinare il segmento e provare due messaggi sulla fascia serale.',
  nota: 'Schermata d’esempio con dati illustrativi.',
};

/** I tre verbi dell'iniziativa (proposta della SC Data, 16 nov 2026). Il consenso non
 *  è un quarto obiettivo: tiene insieme gli altri tre, e sta nella chiusa. */
export const FOLLA = {
  titolo: 'L’iniziativa serve a misurare, conoscere e personalizzare',
  ancore: [
    { k: 'misurare', t: 'Misurare', b: 'Il percorso intero, dalla ricerca su trenitalia.com all’acquisto su LeFrecce e sull’app' },
    { k: 'conoscere', t: 'Conoscere', b: 'Dove e perché si perde la vendita, viaggiatore per viaggiatore' },
    { k: 'personalizzare', t: 'Personalizzare', b: 'La proposta giusta su trenitalia.com, misurata sul venduto' },
  ],
  variabili: ['trenitalia.com', 'LeFrecce', 'app'],
  chiusa: 'Il consenso li tiene insieme, dalla Direzione Sales ad Accenture.',
};

/* ── Il programma ──────────────────────────────────────────────────────── */
export const DIRETTRICI: Record<string, string> = { misurare: 'Misurare', conoscere: 'Conoscere', personalizzare: 'Personalizzare', consenso: 'Il consenso' };

export const ATTI = {
  titolo: 'L’iniziativa commerciale in quattro momenti',
  mesi: ['dic', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu'],
  atti: [
    { n: '1', v: 'Scegliere', q: 'entro l’11 dicembre', serve: ['consenso'], da: 0, a: 0.5,
      esce: 'I casi d’uso e il verdetto sulla riconciliazione' },
    { n: '2', v: 'L’MVP', q: 'dic – feb · in produzione', serve: ['misurare', 'conoscere', 'personalizzare'], da: 0.5, a: 3,
      esce: 'Casi d’uso in produzione, misurati sul venduto' },
    { n: '3', v: 'Decidere', q: 'marzo · la giornata', serve: ['consenso'], da: 3, a: 4,
      esce: 'I risultati dell’MVP, poi le mani sugli strumenti' },
    { n: '4', v: 'Portare a contratto', q: 'apr – giu', serve: ['consenso'], da: 4, a: 7,
      esce: 'La proposta dai risultati, la firma a giugno' },
  ],
  segni: [
    { t: 'Anteprima alla Direzione', a: 2.75 },
  ],
};

/** L'MVP in sequenza, con la condizione IN TESTA (17 nov 2026): la riconciliazione degli
 *  ECID fra trenitalia.com e LeFrecce è preliminare, non un cancello a metà. Senza, il
 *  racconto di CJA non sta in piedi e l'iniziativa non parte; «conoscere» lavora su dati
 *  già riconciliati. Non c'è un piano B sul dato aggregato. «Misurato», mai «comprovato». */
export const SEQUENZA = {
  titolo: 'Senza riconciliare i due siti non si parte',
  passi: [
    { q: 'nov – dic', l: 'La condizione', d: 'I due siti letti come un viaggiatore\u00a0solo', cancello: true },
    { q: 'gennaio', l: 'Conoscere', d: 'Su tre mesi riconciliati, dove\u00a0si perde la\u00a0vendita' },
    { q: 'febbraio', l: 'Personalizzare', d: 'Target su trenitalia.com, con il criterio scritto\u00a0prima' },
    { q: 'marzo', l: 'La giornata', d: 'I risultati dell’MVP, poi il perimetro\u00a0condiviso', forte: true },
  ],
  /** Il retro della condizione: perché lo è, e chi ci lavora. */
  retro: [
    { k: 'Perché:', b: 'senza, il percorso fra i due siti non\u00a0si\u00a0legge.' },
    { k: 'Chi:', b: 'Accenture e l’engineering Adobe.' },
  ],
  retroChiusa: 'Se non si può fare, l’iniziativa non\u00a0parte.',
};

/** Il circuito dei dati: da dove arrivano, dove diventano un pubblico, dove si
 *  prova la proposta, dove torna il risultato. */
export const CIRCUITO = {
  titolo: 'Un solo circuito, dai dati al risultato del test',
  fonti: [
    { t: 'Analytics di trenitalia.com' },
    { t: 'Analytics di LeFrecce e dell’app' },
    { t: 'CartaFreccia', n: 'ipotesi, non bloccante' },
  ],
  cuore: { t: 'Customer Journey Analytics', n: 'Il pubblico di ogni caso d’uso' },
  azione: { t: 'Adobe Target su trenitalia.com', n: 'La proposta, messa in opera da Accenture' },
  ritorno: 'Il risultato torna in CJA e si legge accanto alla misura',
};

/* ── Scegliere, misurare, attivare ─────────────────────────────────────── */
export const SCEGLIERE = {
  titolo: 'Entro l’11 dicembre si scelgono due casi d’uso',
  passi: [
    { q: 'Fine novembre', l: 'La lista', d: 'Quattro o cinque idee, discusse con la Direzione Sales' },
    { q: 'Inizio dicembre', l: 'La verifica', d: 'Accenture conferma che cosa si può fare su Target' },
    { q: 'Inizio dicembre', l: 'La riconciliazione', d: 'Il verdetto, con Accenture e l’engineering Adobe' },
    { q: 'Metà dicembre', l: 'I criteri', d: 'Misure e durata dei test, scritte prima di partire' },
  ],
};

export const CRITERI = {
  titolo: 'Che cosa vuol dire riuscire si scrive prima di partire',
  voci: [
    { k: 'Venduto', b: 'Quanto vende chi riceve la proposta rispetto a chi non la riceve' },
    { k: 'Durata', b: 'Quanto deve girare un test perché il risultato si possa leggere' },
    { k: 'Percorso', b: 'Che cosa succede fra trenitalia.com e LeFrecce prima dell’acquisto' },
    { k: 'Tempo', b: 'Quanto ci vuole dal dato a una prova in produzione' },
  ],
};

type Blocco = { da: number; a: number; t: string; forte?: boolean };

export const MISURARE = {
  titolo: 'Prima la riconciliazione, poi la risposta, poi il test',
  scala: ['dicembre', 'gennaio', 'febbraio'],
  inizio: 0, fine: 3,
  corsie: [
    { k: 'CJA', blocchi: [
      { da: 0, a: 1, t: 'La riconciliazione', forte: true },
      { da: 1, a: 2, t: 'Conoscere, su dati riconciliati', forte: true },
      { da: 2, a: 3, t: 'La lettura del test' },
    ] as Blocco[] },
    { k: 'Target', blocchi: [
      { da: 1.4, a: 2, t: 'Si prepara' },
      { da: 2, a: 3, t: 'Il test gira', forte: true },
    ] as Blocco[] },
  ],
};

/* ── Decidere: la giornata ─────────────────────────────────────────────── */
export const GIORNO = {
  titolo: 'La Direzione c’è quando si vede il risultato e quando si decide',
  sub: 'Roma, marzo, una ventina di persone. I dirigenti ci sono per meno di tre ore.',
  scala: ['9:30', '11:00', '12:30', '14:00', '15:30', '17:00'],
  inizio: 9.5, fine: 17.5,
  pausa: { da: 13.5, a: 14.5, t: 'Pranzo' },
  corsie: [
    { k: 'La Direzione', blocchi: [
      { da: 9.5, a: 11.25, t: 'Apertura e risultati', forte: true },
      { da: 16.75, a: 17.5, t: 'Rotta', forte: true },
    ] as Blocco[] },
    { k: 'I team', blocchi: [
      { da: 9.5, a: 11.25, t: 'Apertura e risultati' },
      { da: 11.5, a: 13.5, t: 'Mani sugli strumenti' },
      { da: 14.5, a: 16.75, t: 'Esempi, priorità, squadra' },
      { da: 16.75, a: 17.5, t: 'Rotta' },
    ] as Blocco[] },
  ],
};

export const SCALETTA = {
  titolo: 'La mattina i risultati, il pomeriggio le scelte',
  voci: [
    { o: '09:30', t: 'Apertura', d: 'La Direzione Sales accoglie la sala', dir: true },
    { o: '10:00', t: 'I risultati', d: 'Dove si perde la vendita, il test, le domande', dir: true },
    { o: '11:30', t: 'Le mani sugli strumenti', d: 'Quattro postazioni a rotazione' },
    { o: '14:30', t: 'Chi l’ha già fatto', d: 'Un’azienda di viaggio e il suo modello' },
    { o: '15:15', t: 'Le priorità', d: 'Dieci casi d’uso, ne restano tre' },
    { o: '16:00', t: 'La squadra', d: 'I servizi Adobe e Accenture: chi fa che cosa dopo la firma' },
    { o: '16:45', t: 'La rotta', d: 'Le tappe a 3, 6 e 9 mesi', dir: true },
    { o: '17:15', t: 'Chiusura', d: 'Le domande della sala' },
  ],
};

/** Le mani sugli strumenti: sui dati veri solo quello che l'MVP ha costruito, tutto
 *  il resto in ambiente demo, e lo si dice prima (decisione del 16–17 nov 2026). Dal
 *  18 nov le salette sono quattro: l'offerta Creativity & Productivity ha la sua
 *  (decisione dell'owner dopo la sessione con il leadership team del 17 nov). */
export const POSTAZIONI = {
  titolo: 'Due ore, quattro salette: una sui vostri dati, tre in demo',
  sub: 'Cinque persone per gruppo, un cambio ogni mezz’ora.',
  stanze: [
    { k: 'Sui vostri dati', t: 'CJA e Target', b: 'I percorsi e l’attività che l’MVP ha messo in produzione' },
    { k: 'In demo', t: 'Analisi e decisione', b: 'Coworker su CJA, Content Analytics, Decisioning di Journey Optimizer' },
    { k: 'In demo', t: 'Contenuti su scala', b: 'GenStudio for Performance Marketing, Firefly Services, Express su AEM Assets' },
    { k: 'In demo', t: 'Visibilità nelle risposte', b: 'Brand Visibility e Brand Concierge' },
  ],
};

/** I prodotti nel percorso principale (18 nov 2026): il leadership team non capiva
 *  «a cerchi concentrici». Il cuore va sui dati del cliente; attorno, tutto in demo
 *  alla giornata, e si sceglie dopo la firma. */
export const CERCHI = {
  titolo: 'Il cuore sui vostri dati, il resto in demo',
  cuore: { k: 'Il cuore · nell’MVP', t: 'CJA e Adobe Target', b: 'Real\u2011Time CDP solo per portare i pubblici da CJA a Target' },
  attorno: { k: 'Attorno · alla giornata, in demo', gruppi: [
    { t: 'Contenuti su scala', b: 'GenStudio for Performance Marketing, Firefly Services, Express su AEM Assets' },
    { t: 'Analisi e decisione', b: 'Coworker su CJA, Content Analytics, Decisioning di Journey Optimizer' },
    { t: 'Visibilità nelle risposte', b: 'Brand Visibility e Brand Concierge' },
  ] },
  chiusa: 'Personalizzare vuol dire anche produrre le varianti. Il resto si sceglie dopo la firma.',
};

/** La giornata in una pagina, nel percorso principale (18 nov 2026): il dettaglio
 *  ora per ora resta nell'annex. */
export const MARZO = {
  titolo: 'A marzo, prima i risultati e poi le mani sugli strumenti',
  passi: [
    { q: 'La mattina', l: 'I risultati dell’MVP', d: 'Dove si perde la vendita e che cosa ha detto il test, davanti alla Direzione' },
    { q: 'Due ore', l: 'Le mani sugli strumenti', d: 'CJA e Target sui vostri dati, il resto in demo in tre salette', forte: true },
    { q: 'Il pomeriggio', l: 'Chi l’ha già fatto', d: 'Un’azienda di viaggio racconta il suo modello; dieci casi d’uso, ne restano tre' },
    { q: 'La chiusura', l: 'Squadra e rotta', d: 'Chi fa che cosa dopo la firma, e le tappe a 3, 6 e 9 mesi' },
  ],
};

export const INTORNO = {
  titolo: 'La giornata comincia sei settimane prima',
  passi: [
    { q: '6 settimane prima', l: 'L’invito', d: 'Firmato dalla Direzione Sales, a mano' },
    { q: '1 settimana prima', l: 'L’anteprima', d: 'I risultati alla Direzione, prima della sala' },
    { q: 'Il giorno', l: 'La giornata', d: 'Risultati, strumenti, scelte' },
    { q: '2 settimane dopo', l: 'Una pagina', d: 'Priorità e rotta per chi non c’era' },
  ],
};

export const INVITO = {
  titolo: 'Un invito di carta, firmato a mano',
  sub: 'Arriva sulla scrivania sei settimane prima.',
  specifiche: [
    { k: 'Formato', v: '148 × 210 mm, in busta' },
    { k: 'Carta', v: 'Cotone 600 g' },
    { k: 'Firma', v: 'Del Responsabile Canali Digitali' },
  ],
  card: {
    occhiello: 'Trenitalia · Direzione Sales',
    titolo: 'Ciascuno conta',
    testo: 'Una giornata di lavoro sui nostri dati: che cosa fa vendere, e come lo facciamo diventare il lavoro di ogni giorno.',
    quando: 'Roma · marzo 2027 · dalle 9:30 alle 17:30',
    firma: 'Responsabile Canali Digitali',
  },
};

/* ── Scalare ───────────────────────────────────────────────────────────── */
export const ROTTA = {
  titolo: 'Dopo la firma, tre tappe',
  passi: [
    { l: '3 mesi', d: 'I tre casi d’uso scelti, in produzione e misurati sul venduto' },
    { l: '6 mesi', d: 'La lettura dei percorsi su tutti i canali digitali' },
    { l: '9 mesi', d: 'Idea, prova e misura ogni settimana, come lavoro ordinario' },
  ],
};

export const RUOLI = {
  titolo: 'Chi fa che cosa',
  colonne: [
    { k: 'Trenitalia', t: 'Decide e vende', b: 'La Direzione Sales sceglie i casi d’uso e guida il programma' },
    { k: 'Accenture e FS Technology', t: 'Mettono in opera', b: 'Le attività su Target, l’accesso ai dati, i rilasci' },
    { k: 'Adobe', t: 'Porta prodotto e metodo', b: 'I servizi professionali sull’MVP, il prodotto e la regia della giornata' },
  ],
};

export const PASSO = {
  titolo: 'Il prossimo passo: un’ora per scegliere i casi d’uso',
  sub: 'Con il vostro team e con Accenture, entro fine novembre.',
  /** La prima stazione della linea: l'ora apre il percorso, gli atti seguono da ATTI. */
  ora: { q: 'fine novembre', v: 'Un’ora', d: 'Si scelgono i casi d’uso da provare' },
};

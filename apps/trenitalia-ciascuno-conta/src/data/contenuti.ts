/**
 * «Ciascuno conta» — la copia del LIVELLO PUBBLICO del deck, una volta sola.
 *
 * Regola di questo file: ogni riga deve poter essere letta dal cliente senza danno.
 * È la base della versione che andrà alla Direzione Sales. Quello che è solo nostro
 * (persone per nome, strategia, GNARR, giornate, costi, leva commerciale) NON sta qui:
 * sta nello strato interno in Supabase (`restricted_docs.content.deck`), che il runtime
 * `Riservato.astro` carica con il link a token. Seed git-ignorato in docs/Ferrovie/.
 *
 * Riscritta il 12 nov 2026 sera, dopo la call con l'AE: la prova non è più solo una
 * misura. Due binari: la misura su CJA, completa alla giornata, e uno o due test veri
 * su Target, messi in opera da Accenture, con i primi dati alla giornata e il
 * risultato ad aprile.
 *
 * Voce: frasi intere e corte, un fatto per riga. Niente occhielli sopra i titoli,
 * niente antitesi, niente motti. Il titolo dice il punto della slide.
 */

export const COVER = {
  occhiello: 'Una proposta di lavoro · novembre 2026',
  sub: 'Una prova sui dati di trenitalia.com e LeFrecce, due test dal vivo su Target, poi una giornata in cui si sceglie che cosa portare a scala.',
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

export const FOLLA = {
  titolo: 'A ogni viaggiatore la sua proposta, e ogni vendita contata',
  ancore: [
    { k: 'Vendere', t: 'Che cosa fa vendere di più' },
    { k: 'Capire', t: 'Il perché di un calo in un minuto' },
    { k: 'Scegliere', t: 'Le priorità decise insieme' },
  ],
};

/* ── Il programma ──────────────────────────────────────────────────────── */
export const ATTI = {
  titolo: 'Quattro atti, da dicembre a giugno',
  mesi: ['dic', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu'],
  atti: [
    { n: '1', v: 'Scegliere', q: 'dicembre', da: 0, a: 1,
      esce: 'Due casi d’uso, validati con Accenture' },
    { n: '2', v: 'Misurare e attivare', q: 'gen – feb · 8 settimane', da: 1, a: 3,
      esce: 'La misura in CJA, due test su Target' },
    { n: '3', v: 'Decidere', q: 'marzo', da: 3, a: 4,
      esce: 'La giornata: risultati e priorità' },
    { n: '4', v: 'Scalare', q: 'apr – giu', da: 4, a: 7,
      esce: 'I primi casi d’uso in produzione' },
  ],
  segni: [
    { t: 'Anteprima alla Direzione', a: 2.75 },
  ],
};

/** I due binari della prova: la misura arriva completa alla giornata, i test
 *  arrivano con i primi dati e chiudono ad aprile. Mesi da dicembre (0) a giugno (7). */
export const BINARI = {
  titolo: 'La giornata si apre con la misura completa e con i primi dati dei test',
  mesi: ['dic', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu'],
  corsie: [
    { k: 'La misura', b: 'CJA su trenitalia.com e LeFrecce', da: 1, a: 3, alla: 'completa' },
    { k: 'I test', b: 'Due attività su Target, messe in opera da Accenture', da: 1.6, a: 4.6, alla: 'primi dati' },
  ],
  giornata: 3.25,
};

/** Il circuito dei dati: da dove arrivano, dove diventano un pubblico, dove si
 *  prova la proposta, dove torna il risultato. */
export const CIRCUITO = {
  titolo: 'Un solo circuito, dai dati al risultato del test',
  fonti: [
    { t: 'Analytics di trenitalia.com' },
    { t: 'Analytics di LeFrecce' },
    { t: 'CartaFreccia', n: 'in un secondo tempo' },
  ],
  cuore: { t: 'Customer Journey Analytics', n: 'Il pubblico di ogni caso d’uso' },
  azione: { t: 'Adobe Target su trenitalia.com', n: 'La proposta, messa in opera da Accenture' },
  ritorno: 'Il risultato torna in CJA e si legge accanto alla misura',
};

/* ── Scegliere, misurare, attivare ─────────────────────────────────────── */
export const SCEGLIERE = {
  titolo: 'A dicembre si scelgono due casi d’uso',
  passi: [
    { q: 'Fine novembre', l: 'La lista', d: 'Quattro o cinque idee, discusse con la Direzione Sales' },
    { q: 'Inizio dicembre', l: 'La verifica', d: 'Accenture conferma che cosa si può fare su Target' },
    { q: 'Inizio dicembre', l: 'I dati', d: 'Gli accessi, con FS Technology e chi gestisce LeFrecce' },
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
  titolo: 'Otto settimane: in CJA la misura, su Target i test',
  scala: ['sett. 1', '2', '3', '4', '5', '6', '7', '8'],
  inizio: 0, fine: 8,
  corsie: [
    { k: 'CJA', blocchi: [
      { da: 0, a: 1, t: 'Accessi' },
      { da: 1, a: 3, t: 'I dati in CJA' },
      { da: 3, a: 6, t: 'Misura e pubblici' },
      { da: 6, a: 7, t: 'Anteprima', forte: true },
      { da: 7, a: 8, t: 'Giornata' },
    ] as Blocco[] },
    { k: 'Target', blocchi: [
      { da: 2, a: 4, t: 'Si preparano' },
      { da: 4, a: 8, t: 'I test girano', forte: true },
    ] as Blocco[] },
  ],
};

/* ── Decidere: la giornata ─────────────────────────────────────────────── */
export const GIORNO = {
  titolo: 'La Direzione c’è quando si vede il risultato e quando si decide',
  sub: 'Roma, marzo, una ventina di persone. Ai dirigenti chiediamo meno di tre ore.',
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
    { o: '10:00', t: 'I risultati', d: 'La misura, i primi dati dei test, le domande', dir: true },
    { o: '11:30', t: 'Le mani sugli strumenti', d: 'Tre postazioni a rotazione' },
    { o: '14:30', t: 'Chi l’ha già fatto', d: 'Un’azienda di viaggio e il suo modello' },
    { o: '15:15', t: 'Le priorità', d: 'Dieci casi d’uso, ne restano tre' },
    { o: '16:00', t: 'La squadra', d: 'Chi fa che cosa fra Trenitalia, Accenture e Adobe' },
    { o: '16:45', t: 'La rotta', d: 'Le tappe a 3, 6 e 9 mesi', dir: true },
    { o: '17:15', t: 'Chiusura', d: 'Le domande della sala' },
  ],
};

export const POSTAZIONI = {
  titolo: 'Due ore, tre salette, gruppi misti',
  sub: 'Sei o sette persone per gruppo, un cambio ogni quaranta minuti.',
  stanze: [
    { k: 'Leggere', t: 'I percorsi in CJA', b: 'Sui dati della prova' },
    { k: 'Proporre', t: 'Un’attività su Target', b: 'Con Accenture, su un vostro pubblico' },
    { k: 'Produrre', t: 'Le varianti', b: 'Con GenStudio for Performance Marketing' },
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
  titolo: 'Dopo la giornata, tre tappe',
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
    { k: 'Adobe', t: 'Porta prodotto e metodo', b: 'La misura in CJA e la regia della giornata' },
  ],
};

export const PASSO = {
  titolo: 'Il prossimo passo: un’ora per scegliere i casi d’uso',
  sub: 'Con il vostro team e con Accenture, entro fine novembre.',
};

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

export const FOLLA = {
  titolo: 'Il programma serve a tre cose',
  ancore: [
    { k: 'prova', t: 'La prova', b: 'Quale proposta fa vendere di più, misurato sul venduto' },
    { k: 'risposta', t: 'La risposta in un minuto', b: 'Perché il venduto cala, guardando tutte le variabili' },
    { k: 'consenso', t: 'Il consenso', b: 'Direzione Sales, FS Technology e Accenture scelgono insieme' },
  ],
  variabili: ['sito e app', 'biglietterie', 'agenzie e OTA', 'prezzo e offerta', 'concorrenza', 'calendario', 'perturbazioni'],
  chiusa: 'Ogni passo del programma serve ad almeno una delle tre.',
};

/* ── Il programma ──────────────────────────────────────────────────────── */
export const DIRETTRICI: Record<string, string> = { prova: 'La prova', risposta: 'La risposta', consenso: 'Il consenso' };

export const ATTI = {
  titolo: 'Quattro atti, da dicembre a giugno',
  mesi: ['dic', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu'],
  atti: [
    { n: '1', v: 'Scegliere', q: 'dicembre', serve: ['consenso'], da: 0, a: 1,
      esce: 'I casi d’uso, validati con Accenture' },
    { n: '2', v: 'Capire e provare', q: 'dic – feb · cancello a fine gennaio', serve: ['risposta', 'prova'], da: 0.5, a: 3,
      esce: 'Dove si perde la vendita, e un test sul venduto' },
    { n: '3', v: 'Decidere', q: 'marzo', serve: ['prova', 'consenso'], da: 3, a: 4,
      esce: 'La giornata: dai risultati al consenso' },
    { n: '4', v: 'Scalare', q: 'apr – giu', serve: ['risposta', 'consenso'], da: 4, a: 7,
      esce: 'I primi casi d’uso in produzione' },
  ],
  segni: [
    { t: 'Anteprima alla Direzione', a: 2.75 },
  ],
};

/** La prova in sequenza, con un cancello a metà: prima la risposta sui dati
 *  storici, poi il test dal vivo, e la giornata solo quando la prova è chiusa.
 *  «Misurato sul venduto», mai «comprovato»: in quattro settimane si osserva
 *  l'effetto con il suo margine, anche nullo, e per una prova basta. */
export const SEQUENZA = {
  titolo: 'La prova si chiude prima della giornata, in due stadi',
  passi: [
    { q: 'dic – gen', l: 'La risposta', d: 'Sui dati storici, dove\u00a0si perde la vendita fra trenitalia.com e\u00a0LeFrecce' },
    { q: 'fine gennaio', l: 'Il cancello', d: 'Il passaggio fra i due siti si legge per viaggiatore, o\u00a0in\u00a0aggregato', cancello: true },
    { q: 'febbraio', l: 'La prova', d: 'Un test su Target su trenitalia.com, con il criterio scritto\u00a0prima' },
    { q: 'marzo', l: 'La giornata', d: 'Si parte dai risultati per costruire il\u00a0consenso', forte: true },
  ],
};

/** Il circuito dei dati: da dove arrivano, dove diventano un pubblico, dove si
 *  prova la proposta, dove torna il risultato. */
export const CIRCUITO = {
  titolo: 'Un solo circuito, dai dati al risultato del test',
  fonti: [
    { t: 'Analytics di trenitalia.com' },
    { t: 'Analytics di LeFrecce' },
    { t: 'CartaFreccia', n: 'ipotesi, non bloccante' },
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
  titolo: 'In CJA la risposta da dicembre, su Target il test a febbraio',
  scala: ['dicembre', 'gennaio', 'febbraio'],
  inizio: 0, fine: 3,
  corsie: [
    { k: 'CJA', blocchi: [
      { da: 0.4, a: 1, t: 'Accessi e dati' },
      { da: 1, a: 2, t: 'La risposta sullo storico', forte: true },
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
    { o: '10:00', t: 'I risultati', d: 'Dove si perde la vendita, il test, le domande', dir: true },
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

/**
 * «Ciascuno conta» — la copia del LIVELLO PUBBLICO del deck, una volta sola.
 *
 * Regola di questo file: ogni riga deve poter essere letta dal cliente senza danno.
 * È la base della versione che andrà alla Direzione\u00a0Sales. Quello che è solo nostro
 * (persone per nome, strategia, GNARR, giornate, costi, compliance) NON sta qui: sta
 * nello strato interno in Supabase (`restricted_docs.content.deck`), che il runtime
 * `Riservato.astro` carica con il link a token. Seed git-ignorato in docs/Ferrovie/.
 *
 * Voce: plurale istituzionale, ancore e non prosa. Ogni slot `r` è una chiave dello
 * strato interno: nel livello pubblico resta vuoto e non occupa spazio.
 */

export const COVER = {
  occhiello: 'Una proposta di lavoro · novembre 2026',
  sub: 'Dimostrare sui vostri dati che parlare a ciascun viaggiatore fa vendere di\u00a0più, e farne il lavoro di ogni giorno.',
  firma: 'Ciascuno conta. E si conta, uno per uno.',
};

/* ── L'idea ────────────────────────────────────────────────────────────── */
export const MATTINA = {
  eyebrow: 'Fra un anno, alle nove',
  titolo: 'Il venduto di ieri è sceso, e alle\u00a0nove e\u00a0un\u00a0minuto si sa perché',
  sub: 'Oggi quella risposta arriva in giorni. Il programma serve ad\u00a0averla subito, con l’azione da fare accanto.',
  domanda: 'Ieri il venduto da app è sceso rispetto a martedì scorso. Perché?',
  risposta: [
    'Il calo si concentra sulle prenotazioni serali da app, sulle\u00a0tratte\u00a0Milano–Roma.',
    'Da lunedì la proposta per i titolari CartaFreccia non arriva a\u00a0una parte del pubblico: il\u00a0segmento è cambiato.',
  ],
  azione: 'Ripristinare il segmento e provare due messaggi sulla fascia serale.',
  nota: 'Schermata d’esempio con dati illustrativi: è la forma della risposta, non\u00a0un\u00a0risultato.',
};

export const FOLLA = {
  eyebrow: 'Ciascuno conta',
  titolo: 'Ogni viaggiatore riceve la proposta giusta, e ogni vendita si conta',
  sub: 'Il nome dice le due cose insieme: ogni persona è importante, e il risultato si misura una\u00a0persona alla volta.',
  ancore: [
    { k: 'La prova', t: 'Che cosa fa vendere', b: 'Una proposta su misura, valutata sul\u00a0vostro venduto.' },
    { k: 'La risposta', t: 'Il perché in un minuto', b: 'Un calo spiegato su richiesta, con il\u00a0dato sotto.' },
    { k: 'Il consenso', t: 'Le priorità scelte insieme', b: 'Vendite, tecnologia e partner allo\u00a0stesso tavolo.' },
  ],
  chiusa: 'Ogni passo del programma serve ad almeno una delle tre. Quello che non serve resta fuori.',
};

/* ── Il programma ──────────────────────────────────────────────────────── */
export const ATTI = {
  eyebrow: 'Il programma in una figura',
  titolo: 'Scegliere, misurare, decidere, scalare',
  sub: 'Un percorso di sei mesi, non un evento. Ogni atto chiude con una decisione, e la decisione apre il successivo.',
  mesi: ['dic', 'gen', 'feb', 'mar', 'apr', 'mag', 'giu'],
  atti: [
    { n: '1', v: 'Scegliere', q: 'dicembre', da: 0, a: 1,
      fa: 'Casi d’uso, criteri di successo, perimetro dei dati.',
      esce: 'Un perimetro scritto, concordato con\u00a0FS Technology.' },
    { n: '2', v: 'Misurare', q: 'gen – feb · 6-8 settimane', da: 1, a: 3,
      fa: 'La prova sui vostri dati, con un punto ogni settimana.',
      esce: 'Un risultato misurato sul venduto.' },
    { n: '3', v: 'Decidere', q: 'fine feb – mar', da: 2.75, a: 4,
      fa: 'La giornata: il risultato, le mani sugli\u00a0strumenti, le priorità.',
      esce: 'Tre casi d’uso scelti e una rotta.' },
    { n: '4', v: 'Scalare', q: 'apr – giu', da: 4, a: 7,
      fa: 'I primi test della rotta, poi tutti i canali.',
      esce: 'Un modo di lavorare stabile.' },
  ],
  segni: [
    { t: 'L’anteprima alla Direzione', a: 2.6 },
  ],
};

export const DATI = {
  eyebrow: 'Sui vostri dati',
  titolo: 'Si parte da quello che già usate',
  sub: 'Analytics e Target sono già al lavoro su trenitalia.com e sull’app. Si aggiunge la lettura\u00a0dei\u00a0percorsi.',
  cifre: [
    { k: '6–8', v: 'settimane di lavoro congiunto prima della giornata' },
    { k: '2–3', v: 'casi d’uso nel primo giro, scelti con voi' },
    { k: '2', v: 'fonti di dati nel primo perimetro, dichiarato in partenza' },
    { k: '1', v: 'giornata in cui il risultato si vede e\u00a0si decide' },
  ],
  chiusa: 'Il primo caso è già in produzione: la proposta legata alla posizione di chi cerca un viaggio.',
};

/* ── Scegliere e misurare ──────────────────────────────────────────────── */
export const SCEGLIERE = {
  eyebrow: 'Atto 1 · Scegliere · dicembre',
  titolo: 'Tre scelte prima di toccare un dato',
  sub: 'Si decide che cosa provare, come si giudica e su quali dati. Tutto per\u00a0iscritto, prima\u00a0di\u00a0cominciare.',
  passi: [
    { q: 'Fine novembre', l: 'I casi d’uso', d: 'Una prima lista, discussa con\u00a0la\u00a0Direzione\u00a0Sales. Ne restano due o tre.' },
    { q: 'Inizio dicembre', l: 'Il perimetro dei dati', d: 'Le fonti e gli accessi, concordati con\u00a0FS Technology.' },
    { q: 'Settimana 1', l: 'I criteri di successo', d: 'Che cosa vuol dire riuscire, scritto il\u00a0primo giorno.' },
  ],
};

export const CRITERI = {
  eyebrow: 'I criteri di successo',
  titolo: 'Alla giornata si guardano queste quattro misure',
  sub: 'Concordate con voi nella prima settimana. Non se ne aggiungono altre a risultato visto.',
  ancore: [
    { k: 'Venduto', t: 'Quanto fa vendere la proposta', b: 'Rispetto a chi non l’ha ricevuta.' },
    { k: 'Tempo', t: 'Dal dato all’azione', b: 'Quanto ci vuole per passare da\u00a0un’evidenza a una prova.' },
    { k: 'Canali', t: 'Che cosa si vede in più', b: 'Il percorso fra app, sito e\u00a0gli\u00a0altri canali.' },
    { k: 'Scala', t: 'Quanto costa allargare', b: 'Che cosa serve perché diventi ordinario.' },
  ],
};

export const MISURARE = {
  eyebrow: 'Atto 2 · Misurare · gennaio – febbraio',
  titolo: 'Otto settimane, un gruppo di lavoro solo',
  sub: 'Il vostro team digitale e il nostro, sullo stesso ambiente, con un punto fisso ogni settimana.',
  settimane: [
    { s: '1', t: 'Si parte', d: 'Avvio, accessi, criteri scritti' },
    { s: '2–5', t: 'Si lavora sui dati', d: 'Analisi dei percorsi e test sulla proposta' },
    { s: '6', t: 'Si legge il\u00a0risultato', d: 'Che cosa ha fatto vendere, e perché' },
    { s: '7', t: 'L’anteprima', d: 'Il risultato alla Direzione\u00a0Sales, prima della sala' },
    { s: '8', t: 'Si prepara la\u00a0giornata', d: 'Gli ambienti per le postazioni, i dieci casi d’uso' },
  ],
  chiusa: 'I test li lancia il vostro team, come quello sulla posizione già in produzione. La prova li legge e li misura.',
};

/* ── Decidere: la giornata ─────────────────────────────────────────────── */
export const GIORNO = {
  eyebrow: 'La giornata in una figura',
  titolo: 'La Direzione c’è quando si vede il risultato e quando si decide',
  sub: 'Una giornata intera a Roma, per una ventina di persone. Ai dirigenti chiediamo meno di\u00a0tre\u00a0ore.',
  ore: ['9:30', '11:00', '12:30', '14:00', '15:30', '17:00'],
  inizio: 9.5, fine: 17.5,
  corsie: [
    { k: 'La Direzione', blocchi: [
      { da: 9.5, a: 11.25, t: 'Apertura e prova', forte: true },
      { da: 16.75, a: 17.5, t: 'Rotta', forte: true },
    ] },
    { k: 'I team', blocchi: [
      { da: 9.5, a: 11.25, t: 'Apertura e prova' },
      { da: 11.5, a: 13.5, t: 'Mani sugli strumenti' },
      { da: 14.5, a: 16.75, t: 'Esempio, priorità, squadra' },
      { da: 16.75, a: 17.5, t: 'Rotta' },
    ] },
  ],
};

export const SCALETTA = {
  eyebrow: 'Ora per ora',
  titolo: 'La mattina il risultato, il pomeriggio le scelte',
  sub: 'Otto blocchi. Ognuno lascia qualcosa sul tavolo, e la rotta raccoglie tutto.',
  voci: [
    { o: '09:30', t: 'Apertura', d: 'Padrone di casa la Direzione\u00a0Sales', dir: true },
    { o: '10:00', t: 'La prova', d: 'Il risultato sui vostri dati, poi le domande della sala con la risposta dal vivo', dir: true },
    { o: '11:30', t: 'Le mani sugli strumenti', d: 'Tre postazioni a rotazione: leggere, proporre, produrre' },
    { o: '14:30', t: 'Chi l’ha fatto', d: 'Un’azienda di viaggio racconta come si è organizzata' },
    { o: '15:15', t: 'Le priorità, scelte insieme', d: 'Dieci casi d’uso, ne restano tre' },
    { o: '16:00', t: 'La squadra che serve', d: 'Chi fa che cosa, fra interni, partner e Adobe' },
    { o: '16:45', t: 'La rotta', d: 'Le tappe a 3, 6 e 9 mesi', dir: true },
    { o: '17:15', t: 'Il vostro giudizio', d: 'Domande in sala, e la chiusura' },
  ],
};

export const PROVA_SALA = {
  eyebrow: '10:00 · La prova',
  titolo: 'Il risultato lo presenta chi l’ha costruito, insieme',
  sub: 'Il gruppo di lavoro comune, non il fornitore. Poi la sala fa le sue domande e le risposte arrivano dal vivo.',
  passi: [
    { q: '20 minuti', l: 'Che cosa ha fatto vendere', d: 'I casi d’uso, le misure scelte a\u00a0dicembre, il\u00a0risultato.' },
    { q: '30 minuti', l: 'La sala chiede, i dati rispondono', d: 'Domande libere sui dati della prova, con\u00a0Coworker su\u00a0Customer Journey Analytics.' },
    { q: '25 minuti', l: 'Che cosa c’è oggi, che cosa arriva', d: 'Le domande difficili, con chi conosce il prodotto.' },
  ],
  chiusa: 'Alle 11:15 la Direzione esce sapendo che cosa funziona. Tutto il resto della giornata parte da lì.',
};

export const POSTAZIONI = {
  eyebrow: '11:30 · Le mani sugli strumenti',
  titolo: 'Due ore, tre postazioni, gruppi misti',
  sub: 'Tre gruppi da sei o sette persone ruotano ogni quaranta minuti. Ogni gruppo mescola vendite, tecnologia e partner.',
  stanze: [
    { k: 'Leggere', t: 'Che cosa dicono i percorsi', b: 'Customer Journey Analytics sui dati della prova.' },
    { k: 'Proporre', t: 'Una proposta per un pubblico vero', b: 'Un’attività di Adobe Target su un vostro segmento.' },
    { k: 'Produrre', t: 'Le varianti per ogni pubblico', b: 'Da una campagna approvata, con GenStudio for Performance Marketing.' },
  ],
  chiusa: 'Le varianti prodotte al tavolo diventano il primo test dopo la giornata.',
};

export const POMERIGGIO = {
  eyebrow: '14:30 · Il pomeriggio',
  titolo: 'Dall’esempio di altri alle vostre priorità',
  sub: 'Tre blocchi, ognuno prepara il successivo. Alla rotta delle 16:45 si arriva con\u00a0le\u00a0scelte già\u00a0fatte.',
  passi: [
    { q: '14:30 · 45 minuti', l: 'Chi l’ha fatto', d: 'Un’azienda di viaggio racconta come si è organizzata, da\u00a0Analytics alla lettura\u00a0dei\u00a0percorsi.' },
    { q: '15:15 · 45 minuti', l: 'Le priorità, scelte insieme', d: 'Dieci casi d’uso preparati prima. Gruppi misti, un budget e\u00a0un tempo dati: ne restano tre.' },
    { q: '16:00 · 45 minuti', l: 'La squadra che serve', d: 'Chi fa che cosa fra i vostri team, il\u00a0partner che mette in\u00a0opera e Adobe.' },
  ],
  chiusa: 'Dalla sessione sulle priorità esce un elenco firmato da chi poi lo porterà a terra.',
};

export const INTORNO = {
  eyebrow: 'Prima e dopo',
  titolo: 'La giornata comincia sei settimane prima e finisce due settimane dopo',
  sub: 'Quattro momenti, e ognuno ha un responsabile.',
  passi: [
    { q: 'Sei settimane prima', l: 'L’invito', d: 'Lo firma la Direzione\u00a0Sales, e\u00a0arriva\u00a0a\u00a0mano.' },
    { q: 'Una settimana prima', l: 'L’anteprima', d: 'Il risultato alla Direzione, perché in sala non sorprenda nessuno.' },
    { q: 'Il giorno', l: 'La giornata', d: 'Il risultato, le mani sugli\u00a0strumenti, le\u00a0scelte.' },
    { q: 'Due settimane dopo', l: 'Una pagina', d: 'Risultato, priorità e rotta, per\u00a0chi non\u00a0c’era il\u00a0pomeriggio.' },
  ],
};

export const INVITO = {
  eyebrow: 'L’invito',
  titolo: 'Un oggetto da tenere sulla scrivania',
  sub: 'Lo firma il padrone di casa e arriva a mano. Un invito di carta dice che la giornata è importante prima ancora di aprirlo.',
  specifiche: [
    { k: 'Formato', v: 'Cartoncino 148 × 210 mm, in busta' },
    { k: 'Carta', v: 'Cotone 600 g, bianco naturale' },
    { k: 'Lavorazioni', v: 'Stampa a rilievo dei punti, rosso a caldo' },
    { k: 'Firma', v: 'A mano, del Responsabile Canali Digitali' },
  ],
  card: {
    occhiello: 'Trenitalia · Direzione\u00a0Sales',
    titolo: 'Ciascuno conta',
      testo: 'Una giornata di lavoro sui nostri dati: che cosa fa vendere, e come lo facciamo diventare il lavoro di ogni giorno.',
    quando: 'Roma · marzo 2027 · dalle 9:30 alle 17:30',
    firma: 'Responsabile Canali Digitali',
  },
};

/* ── Scalare ───────────────────────────────────────────────────────────── */
export const ROTTA = {
  eyebrow: 'Atto 4 · Scalare · aprile – giugno',
  titolo: 'Tre tappe, un responsabile per ciascuna',
  sub: 'La giornata chiude con una rotta scritta insieme. Queste tappe sono il punto di partenza.',
  passi: [
    { l: '3 mesi', d: 'I primi tre casi d’uso in produzione, misurati sul venduto' },
    { l: '6 mesi', d: 'La lettura dei percorsi su tutti i\u00a0canali digitali' },
    { l: '9 mesi', d: 'Un modo di lavorare stabile: idea, prova, misura, ogni settimana' },
  ],
};

export const RUOLI = {
  eyebrow: 'Al tavolo',
  titolo: 'Ognuno porta il pezzo che gli spetta',
  sub: 'Il programma lo guida la Direzione\u00a0Sales. Adobe organizza e porta il lavoro sui dati.',
  colonne: [
    { k: 'Trenitalia', t: 'Chi vende', b: 'La Direzione\u00a0Sales sceglie, e i suoi team digitali lavorano\u00a0alla\u00a0prova.' },
    { k: 'FS Technology e partner', t: 'Chi porta a terra', b: 'L’accesso ai dati, l’integrazione, la messa in opera.' },
    { k: 'Adobe', t: 'Chi porta il metodo', b: 'Il lavoro sui dati, il prodotto, il\u00a0modello organizzativo.' },
  ],
};

export const PASSO = {
  eyebrow: 'Il prossimo passo',
  titolo: 'Scegliere insieme i casi d’uso della prova',
  sub: 'Un’ora con il vostro team, entro fine novembre. Da lì parte il primo atto.',
};

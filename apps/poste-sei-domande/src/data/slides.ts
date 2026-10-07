/**
 * La mappa del deck: ogni rotta, ogni slide, con il titolo che la slide porta
 * davvero in pagina.
 *
 * Una sola lista, due usi: il tab «Capitoli e slide» della Console la legge per
 * accendere e spegnere, e l'anteprima rapida la legge per far scorrere il deck
 * a chi non l'ha mai visto. Prima stavano in due posti e avevano già divergito
 * — tre titoli erano fermi a una versione precedente.
 *
 * REGOLA: quando cambia il titolo di una slide, cambia qui. Il controllo è in
 * `scripts/check-slide-map.mjs`, che confronta questi id con i `<Slide id>` reali
 * e fallisce se qualcuno è stato aggiunto o tolto senza passare da qui.
 */
export interface SlideRef {
  id: string;
  /** Il titolo che si legge sulla slide. Per le cover di capitolo è la domanda. */
  t: { it: string; en: string };
  /** Parole con cui qualcuno cercherebbe questa slide senza conoscerne il titolo. */
  k: string;
}
export interface PageRef {
  slug: string;
  /** Etichetta per la Console: nome del capitolo con il suo numero. */
  adminLabel: string;
  slides: SlideRef[];
}

export const SLIDE_MAP: PageRef[] = [
  {
    slug: 'index',
    adminLabel: 'Sei domande (00)',
    slides: [
      { id: 'slide-cover',    t: { it: 'Sei domande',                          en: 'Six questions' }, k: 'introduzione copertina coworker adobe analytics crediti prova ottobre' },
      { id: 'slide-numeri',   t: { it: 'Un’app che è diventata il canale',      en: 'An app that became the channel' }, k: 'superapp utenti report suite mobile volumi server call tracciamento numeri' },
      { id: 'slide-pain',     t: { it: 'Due criteri del 2024, ancora aperti',   en: 'Two criteria from 2024, still open' }, k: 'criteri poc 2024 tempo insight dashboard interfaccia coda problemi' },
      { id: 'slide-percorso', t: { it: 'Sei capitoli, sei domande',             en: 'Six chapters, six questions' }, k: 'indice capitoli percorso mappa struttura' },
    ],
  },
  {
    slug: 'accendere',
    adminLabel: 'Accendere (01)',
    slides: [
      { id: 'slide-cover', t: { it: 'Come lo accendo, e per chi?',                               en: 'How do I switch it on, and for whom?' }, k: 'accendere attivazione rollout ga disponibilita quando' },
      { id: 'slide-cosa',  t: { it: 'Un assistente che legge Adobe Analytics',                   en: 'An assistant that reads Adobe Analytics' }, k: 'che cosa e chat linguaggio naturale mcp skill memoria approvazioni lingua inglese italiano' },
      { id: 'slide-passi', t: { it: 'Quattro passi, nessun rilascio',                            en: 'Four steps, no release' }, k: 'attivazione ims org admin console mcp access permesso accesso primi passi come' },
      { id: 'slide-chi',   t: { it: 'Gli stessi dati di Workspace. Un permesso in più per entrare', en: 'The same data as Workspace. One extra permission to get in' }, k: 'permessi lettura scrittura segmenti metriche calcolate profilo chi inizia authoring' },
      { id: 'slide-take',  t: { it: 'Lato vostro è un pomeriggio, senza toccare l’app',          en: 'On your side it is an afternoon, without touching the app' }, k: 'costo crediti report request 500000 select tempo controllo nessun rilascio tags launch' },
    ],
  },
  {
    slug: 'rispondere',
    adminLabel: 'Rispondere (02)',
    slides: [
      { id: 'slide-cover',     t: { it: 'Cos’è successo ieri sulla SuperApp?',          en: 'What happened on the SuperApp yesterday?' }, k: 'domanda frequente variante pomeriggio semplice' },
      { id: 'slide-oggi',      t: { it: 'Cinque passaggi per una risposta',             en: 'Five steps for one answer' }, k: 'workspace passaggi segmento export slide tempo manuale oggi' },
      { id: 'slide-chat',      t: { it: 'La stessa domanda, chiesta a parole',          en: 'The same question, asked in plain words' }, k: 'chat demo tabella sezioni visite confronto esempio' },
      { id: 'slide-settimana', t: { it: 'Il riepilogo del lunedì, scritto una volta',   en: 'The Monday summary, written once' }, k: 'skill riepilogo lunedi ricorrente automatico settimanale' },
      { id: 'slide-take',      t: { it: 'La domanda semplice smette di passare dal team', en: 'The simple question stops going through the team' }, k: 'tempo coda business autonomia' },
    ],
  },
  {
    slug: 'capire',
    adminLabel: 'Capire (03)',
    slides: [
      { id: 'slide-cover',  t: { it: 'Perché le Operazioni Veloci sono calate lunedì?',   en: 'Why did “Operazioni Veloci” drop on Monday?' }, k: 'root cause calo perche anomalia causa' },
      { id: 'slide-oggi',   t: { it: 'Il perché si trova per esclusione',                 en: 'The why is found by elimination' }, k: 'esclusione ipotesi tempo manuale oggi' },
      { id: 'slide-chat',   t: { it: 'Prima il peso, poi il sospetto',                    en: 'First the weight, then the suspicion' }, k: 'root cause contribuzione peso sospetto anomalia analisi' },
      { id: 'slide-canali', t: { it: 'Quanto del servizio passa dal sito e quanto dall’app?', en: 'How much of the service goes through the site and how much through the app?' }, k: 'sito app piattaforma quota canali web mobile' },
      { id: 'slide-take',   t: { it: 'Il perché arriva in mattinata, non due giorni dopo', en: 'The why arrives in the morning, not two days later' }, k: 'tempo mattinata perche velocita' },
    ],
  },
  {
    slug: 'governare',
    adminLabel: 'Governare (04)',
    slides: [
      { id: 'slide-cover',     t: { it: 'Quali segmenti e suite non usa più nessuno?',            en: 'Which segments and suites does nobody use any more?' }, k: 'governance segmenti suite inutilizzati pulizia' },
      { id: 'slide-oggi',      t: { it: 'Sedici report suite, una che conta, dieci con volumi residui', en: 'Sixteen report suites, one that counts, ten with residual volumes' }, k: 'report suite sedici residuali dormienti volumi inventario' },
      { id: 'slide-chat',      t: { it: 'Chi usa cosa, e cosa somiglia a cosa',                   en: 'Who uses what, and what looks like what' }, k: 'uso duplicati componenti somiglianza pulizia' },
      { id: 'slide-workspace', t: { it: 'Costruiscimi il Workspace del lunedì',                   en: 'Build me the Monday Workspace' }, k: 'workspace progetto scrittura skill lunedi costruire' },
      { id: 'slide-rilasci',   t: { it: 'Questo rilascio traccia quello che avevamo chiesto?',    en: 'Does this release track what we asked for?' }, k: 'rilascio requisiti tracciamento validazione qualita skill junior senior patrimonio verifica' },
      { id: 'slide-take',      t: { it: 'La governance diventa una domanda al mese',              en: 'Governance becomes one question a month' }, k: 'governance manutenzione mensile' },
    ],
  },
  {
    slug: 'proteggere',
    adminLabel: 'Proteggere (05)',
    slides: [
      { id: 'slide-cover',  t: { it: 'Dove finiscono i dati?',                              en: 'Where does the data go?' }, k: 'privacy sicurezza dati dove finiscono riservatezza' },
      { id: 'slide-arch',   t: { it: 'Tre pezzi, e che cosa tocca ciascuno',                 en: 'Three pieces, and what each one touches' }, k: 'architettura mcp permessi analytics conservazione termini ia generativa retention gdpr' },
      { id: 'slide-nonfa',  t: { it: 'Quattro cose che Coworker non fa',                     en: 'Four things Coworker does not do' }, k: 'non raccoglie non profila non decide non sorveglia profilazione limiti' },
      { id: 'slide-regole', t: { it: 'Quattro regole, prima di accendere e durante la prova', en: 'Four rules, before switching on and during the trial' }, k: 'regole profilo suite di prova validazione accessi apri tutto skill gradi governance' },
      { id: 'slide-take',   t: { it: 'Una risposta che potete dare voi, in una riga',        en: 'An answer you can give yourselves, in one line' }, k: 'risposta sintesi governance' },
    ],
  },
  {
    slug: 'in-azione',
    adminLabel: 'In azione (06)',
    slides: [
      { id: 'slide-cover',          t: { it: 'Una demo, in tre tratti',                      en: 'One demo, in three parts' }, k: 'video clip demo dimostrazione filmato registrazione' },
      { id: 'slide-prima',          t: { it: 'Tre cose, dette prima e non dopo',             en: 'Three things, said before and not after' }, k: 'cautele demo sandbox cja rollout avvertenze premesse' },
      { id: 'slide-clip-contesto',  t: { it: 'Prima di rispondere, che cosa sa di voi',      en: 'Before it answers, what it knows about you' }, k: 'clip video contesto skill utente organizzazione memoria spenta brand guidelines tassonomia regole estratte lessico vocabolario pdf' },
      { id: 'slide-clip-riepilogo', t: { it: 'Quattro domande, in italiano',                 en: 'Four questions, in Italian' }, k: 'clip video anomalie trend superapp sezioni app sito italiano limite dichiarato ora di picco demo' },
      { id: 'slide-clip-documento', t: { it: 'Una richiesta, un documento finito',           en: 'One request, a finished document' }, k: 'clip video documento pdf management marchio executive summary luglio demo' },
      { id: 'slide-take',           t: { it: 'Una demo intera vale più di tre slide di benefici', en: 'A whole demo is worth more than three slides of benefits' }, k: 'forma prova demo' },
    ],
  },
  {
    slug: 'evolvere',
    adminLabel: 'Evolvere (07)',
    slides: [
      { id: 'slide-cover',     t: { it: 'E domani?',                                         en: 'And tomorrow?' }, k: 'domani futuro prossimi passi' },
      { id: 'slide-avvio',     t: { it: 'Si parte piccolo, su una suite di prova, e si misura', en: 'Start small, on a test suite, and measure' }, k: 'partire pilota prova attivazione ims org admin console crediti misurare baseline piano' },
      { id: 'slide-chi',       t: { it: 'Cinque ruoli, nell’ordine in cui entrano',           en: 'Five roles, in the order they join' }, k: 'ruoli chi coinvolgere admin business senior team adobe persone' },
      { id: 'slide-noi',       t: { it: 'Un affiancamento, non una licenza in più',           en: 'A programme alongside you, not another licence' }, k: 'costo crediti prezzo itouch affiancamento programma due mesi licenza commerciale benzina' },
      { id: 'slide-evolutive', t: { it: 'Quattro evolutive, ognuna con chi decide',           en: 'Four next steps, each with who decides' }, k: 'mcp aem target workfront perimetro integrazioni tracciamento web sdk business futuro' },
      { id: 'slide-chiusura',  t: { it: 'Le risposte erano già lì. Cambia chi le può chiedere.', en: 'The answers were already there. What changes is who can ask.' }, k: 'chiusura criteri ruolo del team prossimo passo' },
      { id: 'slide-signature', t: { it: 'Adobe × Poste Italiane',                             en: 'Adobe × Poste Italiane' }, k: 'firma fine contatti' },
    ],
  },
];

/** Forma attesa dal tab «Capitoli e slide» della Console. */
export const PAGE_REGISTRY = SLIDE_MAP.map((p) => ({
  slug: p.slug,
  label: p.adminLabel,
  slides: p.slides.map((s) => ({ id: s.id, label: s.t.it })),
}));

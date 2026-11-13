/**
 * L'INNESTO — fonte unica per la slide dell'innesto (messa-a-terra) e per la
 * slide «Accanto» del taglio «In dieci minuti».
 *
 * ⚠️ PERCHÉ È UN FILE A SÉ (panel dell'11 nov 2026). Il taglio corto deve
 * rispondere a «e il nostro motore?» con le STESSE parole del percorso
 * intero: due copie a mano della riga di confine divergono, e `audit:taglio`
 * (c1) le boccia. Il file sta fra le fonti in `scripts/lib/cut-routes.ts`.
 *
 * ⚠️ LE DECISIONI DEL PROPRIETARIO (11 nov 2026), vincolanti:
 * · in slide si proietta solo la posizione «Accanto»: il riquadro Campagne
 *   resta a tinta piena, niente «→ Journey Optimizer»;
 * · le altre posizioni stanno nel dettaglio a richiesta, come OPZIONI che la
 *   banca decide dopo la misura della fase 1, senza numeri (i numeri di fase
 *   sono del piano: 0 Il disegno · 1 Il mutuo · 2 Dopo il trimestre);
 * · SAS non è confermato dal cliente: il sistema si chiama «motore di
 *   targeting» ovunque, anche nel riquadro (feedback del team, 11 nov: i
 *   sistemi della banca non si nominano, come lo strumento di campagna);
 * · lo strumento di campagna di oggi non si nomina.
 */
type Testo = { it: string; en: string };

/** Il titolo dell'innesto (revisione del capitolo 03, 12 nov 2026: la versione
    con l'elenco dei tre componenti andava su tre righe e usciva dall'area
    sicura a 1440 e 1280; l'elenco sta già nei riquadri dello schema).
    Prima: (feedback del team, 11 nov 2026): dice che cosa
    aggiunge Adobe, e non nomina i sistemi della banca. Fonte unica per il
    percorso intero e per il taglio corto. */
export const TITOLO: Testo = {
  it: 'Tre componenti in più per riconoscere, ingaggiare e misurare chi non è ancora cliente',
  en: 'Three added components to recognise, engage and measure people who are not yet customers',
};

/** La riga di confine sul motore. Frase canonica: identica ovunque compaia. */
export const CONFINE: Testo = {
  it: 'Per i clienti la Next Best Experience resta del vostro motore; Adobe si aggiunge per chi non è ancora cliente.',
  en: 'For customers the Next Best Experience stays with your engine; Adobe adds what is needed for people who are not customers yet.',
};

/** L'architettura di oggi, a grandi blocchi: un'ipotesi, e la slide lo dichiara. */
export const OGGI: { t: Testo; s?: Testo; d: Testo; forte?: boolean; canali?: { k: 'online' | 'offline'; t: Testo; d: Testo }[] }[] = [
  { t: { it: 'Data lake', en: 'Data lake' }, d: { it: 'i dati dei clienti', en: 'customer data' } },
  { t: { it: 'Motore di targeting', en: 'Targeting engine' },
    d: { it: 'target e modelli di propensione', en: 'targets and propensity models' }, forte: true },
  { t: { it: 'Iniziative commerciali', en: 'Commercial initiatives' }, d: { it: 'a calendario, con invii massivi', en: 'calendar-based, with bulk sends' } },
  /* Online e offline separati, con un segno ciascuno (call del 13 nov 2026):
     è la distinzione che Customer Journey Analytics tiene insieme. La filiale
     resta DENTRO il perimetro: verso la filiale la banca lavora già. */
  { t: { it: 'Canali', en: 'Channels' }, d: { it: 'filiale, Filiale Digitale, app, sito, aree self-service, media a pagamento', en: 'branch, Filiale Digitale, app, site, self-service areas, paid media' },
    canali: [
      { k: 'online', t: { it: 'Online', en: 'Online' }, d: { it: 'sito, app, annunci', en: 'site, app, ads' } },
      { k: 'offline', t: { it: 'Offline', en: 'Offline' }, d: { it: 'filiale, Filiale Digitale, self-service', en: 'branch, Filiale Digitale, self-service' } },
    ] },
];

/** La posizione che si proietta: è quella su cui si decide il 19. */
export const ACCANTO = {
  k: { it: 'Si parte da qui', en: 'Where we start' },
  t: { it: 'Percorsi nuovi su Journey Optimizer', en: 'New journeys on Journey Optimizer' },
  d: { it: 'le iniziative a calendario restano sullo strumento di oggi', en: 'calendar-based initiatives stay on today’s tool' },
};

/** Come possono evolvere le campagne: tre tappe in ordine, nel dettaglio a
    richiesta. Si parte dalla prima; le altre due le decide la banca, dopo la
    misura della fase 1. Non sono i numeri di fase del piano (0 · 1 · 2), quindi
    la tappa non porta un numero: porta chi la decide. */
export const EVOLUZIONE: { segno: string; k: Testo; t: Testo; d: Testo; ora?: boolean }[] = [
  { segno: 'canali', ora: true, k: { it: 'Si parte da qui', en: 'Where we start' }, t: { it: 'Percorsi nuovi', en: 'New journeys' },
    d: { it: 'I nuovi percorsi automatici nascono su Journey Optimizer; le iniziative a calendario restano sullo strumento di oggi.', en: 'New automated journeys are built on Journey Optimizer; calendar-based initiatives stay on today’s tool.' } },
  { segno: 'flusso', k: { it: 'Opzione, a scelta della banca', en: 'Option, the bank’s choice' }, t: { it: 'Migrazione graduale', en: 'Gradual migration' },
    d: { it: 'Le iniziative a calendario passano su Journey Optimizer una famiglia alla volta.', en: 'Calendar-based initiatives move to Journey Optimizer one family at a time.' } },
  { segno: 'archivio', k: { it: 'Opzione, a scelta della banca', en: 'Option, the bank’s choice' }, t: { it: 'Un solo strumento', en: 'One tool' },
    d: { it: 'Percorsi e iniziative a calendario gestiti in Journey Optimizer.', en: 'Journeys and calendar-based initiatives managed in Journey Optimizer.' } },
];

/** Una cosa da decidere SUBITO, qualunque tappa si scelga: non è una tappa. */
export const FREQUENZA: Testo = {
  it: 'Nella fase 1 due strumenti possono inviare messaggi alla stessa persona. In fase 0 si decide quale dei due applica il tetto massimo di contatti.',
  en: 'In phase 1 two tools can send messages to the same person. Phase 0 decides which of the two applies the contact cap.',
};

/** La riga della decisione, sotto le tappe. */
export const DECIDETE: Testo = {
  it: 'La banca decide se e quando spostare le iniziative dopo i risultati della fase 1; costi e tempi si stimano in quel momento.',
  en: 'The bank decides whether and when to move initiatives after the phase 1 results; cost and timing are estimated then.',
};

/** La nota sotto lo schema («non toccare» del panel): le stesse parole nei due percorsi. */
export const IPOTESI: Testo = {
  it: 'L’architettura attuale è una nostra ipotesi, da correggere con voi.',
  en: 'The current architecture is our assumption, to correct with you.',
};

/** La Web Analytics nel taglio corto: l'invito la chiede (panel, 11 nov 2026,
    giro 2). Dice in una riga quello che slide-passaggio dice per esteso. */
export const WEB_ANALYTICS: Testo = {
  it: 'Web Analytics: Customer Journey Analytics legge quello che Adobe Analytics raccoglie già; Workspace e segmenti restano; la convivenza delle licenze si decide in fase 0.',
  en: 'Web analytics: Customer Journey Analytics reads what Adobe Analytics already collects; Workspace and segments stay; licence overlap is decided in phase 0.',
};

/** Chi si siede al tavolo della fase 0: la riga dell'ask nel taglio corto. */
export const TAVOLO: Testo = {
  it: 'Fase 0: Targeting, CRM, Group Technology, Canali.',
  en: 'Phase 0: Targeting, CRM, Group Technology, Channels.',
};

/* IL MOMENTO DI GIULIA DIETRO OGNI PILLOLA (owner, 13 nov 2026). Cliccando
   «momento 03», «momenti 04–06» o «momento 07» si apre a destra una colonna
   che RICHIAMA il momento, non lo ripete: che cosa fa lei, che cosa fa la
   banca, che cosa cambia. Fatti presi da `momenti.ts` (titoli e corpi già
   passati dal panel); le etichette brevi della striscia vengono da lì. */
export const MOMENTO_SCHEMA: Record<'03' | '04-06' | '07', {
  quando: Testo; attivi: number[]; lei: Testo; banca: Testo; cambia: Testo;
}> = {
  '03': {
    quando: { it: 'La sera stessa', en: 'That same evening' },
    attivi: [2],
    lei: { it: 'Simula la rata e, per salvare il risultato, lascia l’email.', en: 'She simulates the payment and, to save the result, leaves her email.' },
    banca: { it: 'Le visite delle sere prima, sotto pseudonimo e col consenso, si uniscono al suo profilo.', en: 'The visits from earlier evenings, pseudonymous and under consent, merge into her profile.' },
    cambia: { it: 'Prima dell’email era un comportamento senza nome; dopo, una persona con una storia.', en: 'Before the email she was behaviour without a name; after it, a person with a history.' },
  },
  '04-06': {
    quando: { it: 'I tre giorni dopo', en: 'The next three days' },
    attivi: [3, 4, 5],
    lei: { it: 'Si ferma per un documento, riprende il mattino dopo, il mercoledì va in filiale.', en: 'She stops for a document, resumes the next morning, and on Wednesday goes to the branch.' },
    banca: { it: 'Fra le proposte possibili mostra il promemoria con l’appuntamento, dentro le regole di contatto.', en: 'Among the possible offers it shows the reminder with the appointment, within the contact rules.' },
    cambia: { it: 'In filiale il gestore ha già aperta la sua simulazione.', en: 'In the branch the adviser already has her simulation open.' },
  },
  '07': {
    quando: { it: 'Tre settimane dopo', en: 'Three weeks later' },
    attivi: [6],
    lei: { it: 'Firma e apre il conto: da quel giorno la pratica è nell’app.', en: 'She signs and opens an account: from that day the file is in the app.' },
    banca: { it: 'Legge sulla stessa persona sito, app e filiale, dal primo clic alla firma.', en: 'It reads site, app and branch on the same person, from the first click to the signature.' },
    cambia: { it: 'Si vede dove si perdono i non‑clienti, filiale compresa.', en: 'You can see where non-customers are lost, branch included.' },
  },
};

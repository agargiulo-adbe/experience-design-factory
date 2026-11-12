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

/** Il titolo dell'innesto (feedback del team, 11 nov 2026): dice che cosa
    aggiunge Adobe, e non nomina i sistemi della banca. Fonte unica per il
    percorso intero e per il taglio corto. */
export const TITOLO: Testo = {
  it: 'Adobe si aggiunge con tempo reale, decisione e analisi multicanale',
  en: 'Adobe adds real time, decisioning and cross-channel analysis',
};

/** La riga di confine sul motore. Frase canonica: identica ovunque compaia. */
export const CONFINE: Testo = {
  it: 'Sui clienti la next best action resta del vostro motore; il pilota lavora su chi non è ancora cliente.',
  en: 'For customers the next best action stays with your engine; the pilot works on people who are not customers yet.',
};

/** L'architettura di oggi, a grandi blocchi: un'ipotesi, e la slide lo dichiara. */
export const OGGI: { t: Testo; s?: Testo; d: Testo; forte?: boolean }[] = [
  { t: { it: 'Data lake', en: 'Data lake' }, d: { it: 'i dati dei clienti', en: 'customer data' } },
  { t: { it: 'Motore di targeting', en: 'Targeting engine' },
    d: { it: 'target, propensione', en: 'targets, propensity' }, forte: true },
  { t: { it: 'Iniziative commerciali', en: 'Commercial initiatives' }, d: { it: 'pianificate e invii massivi', en: 'scheduled and bulk sends' } },
  { t: { it: 'Canali', en: 'Channels' }, d: { it: 'filiale, Filiale Digitale, app, sito, self, media pagato', en: 'branch, Filiale Digitale, app, site, self-service, paid media' } },
];

/** La posizione che si proietta: è quella su cui si decide il 19. */
export const ACCANTO = {
  k: { it: 'Si parte da qui', en: 'Where we start' },
  t: { it: 'Percorsi nuovi su Journey Optimizer', en: 'New journeys on Journey Optimizer' },
  d: { it: 'le iniziative restano come oggi', en: 'initiatives stay as they are' },
};

/** Come possono evolvere le campagne: tre tappe in ordine, nel dettaglio a
    richiesta. Si parte dalla prima; le altre due le decide la banca, dopo la
    misura della fase 1. Non sono i numeri di fase del piano (0 · 1 · 2), quindi
    la tappa non porta un numero: porta chi la decide. */
export const EVOLUZIONE: { segno: string; k: Testo; t: Testo; d: Testo; ora?: boolean }[] = [
  { segno: 'canali', ora: true, k: { it: 'Si parte da qui', en: 'Where we start' }, t: { it: 'Percorsi nuovi', en: 'New journeys' },
    d: { it: 'Su Journey Optimizer partono i percorsi nuovi. Le iniziative pianificate restano dove sono.', en: 'New journeys start on Journey Optimizer. Scheduled initiatives stay where they are.' } },
  { segno: 'flusso', k: { it: 'Se lo decidete voi', en: 'If you decide so' }, t: { it: 'Una famiglia alla volta', en: 'One family at a time' },
    d: { it: 'Le iniziative pianificate passano su Journey Optimizer, un gruppo per volta.', en: 'Scheduled initiatives move to Journey Optimizer, one group at a time.' } },
  { segno: 'archivio', k: { it: 'Se lo decidete voi', en: 'If you decide so' }, t: { it: 'Tutto in un posto', en: 'All in one place' },
    d: { it: 'Percorsi e iniziative pianificate nello stesso strumento.', en: 'Journeys and scheduled initiatives in the same tool.' } },
];

/** Una cosa da decidere SUBITO, qualunque tappa si scelga: non è una tappa. */
export const FREQUENZA: Testo = {
  it: 'Nella fase 1 due strumenti possono scrivere alla stessa persona. Chi fissa il numero massimo di messaggi si decide in fase 0.',
  en: 'In phase 1 two tools can write to the same person. Who sets the maximum number of messages gets decided in phase 0.',
};

/** La riga della decisione, sotto le tappe. */
export const DECIDETE: Testo = {
  it: 'Se e quando spostare le iniziative lo decidete voi, dopo i risultati della fase 1. Costi e tempi si stimano allora.',
  en: 'Whether and when to move the initiatives is your call, after the phase 1 results. Cost and timing get estimated then.',
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

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
 *   targeting», e solo nel riquadro compare «SAS (da confermare)»;
 * · lo strumento di campagna di oggi non si nomina.
 */
type Testo = { it: string; en: string };

/** La riga di confine sul motore. Frase canonica: identica ovunque compaia. */
export const CONFINE: Testo = {
  it: 'Sui clienti la next best action resta del vostro motore; il pilota lavora su chi non è ancora cliente.',
  en: 'For customers the next best action stays with your engine; the pilot works on people who are not customers yet.',
};

/** L'architettura di oggi, a grandi blocchi: un'ipotesi, e la slide lo dichiara. */
export const OGGI: { t: Testo; s?: Testo; d: Testo; forte?: boolean }[] = [
  { t: { it: 'Data warehouse', en: 'Data warehouse' }, d: { it: 'i dati dei clienti', en: 'customer data' } },
  { t: { it: 'Motore di targeting', en: 'Targeting engine' }, s: { it: 'SAS (da confermare)', en: 'SAS (to be confirmed)' },
    d: { it: 'target, propensione', en: 'targets, propensity' }, forte: true },
  { t: { it: 'Campagne', en: 'Campaigns' }, d: { it: 'campagne pianificate e invii massivi, come oggi', en: 'scheduled campaigns and bulk sends, as today' } },
  { t: { it: 'Canali', en: 'Channels' }, d: { it: 'filiale, Filiale Digitale, app, sito, self, media pagato', en: 'branch, Filiale Digitale, app, site, self-service, paid media' } },
];

/** La posizione che si proietta: è quella su cui si decide il 19. */
export const ACCANTO = {
  k: { it: 'Si parte da qui', en: 'Where we start' },
  t: { it: 'Accanto', en: 'Alongside' },
  d: { it: 'percorsi a evento su Journey Optimizer, le campagne come oggi', en: 'event journeys on Journey Optimizer, campaigns as today' },
};

/** Le posizioni possibili, nel dettaglio a richiesta. Opzioni, non tappe: senza numeri. */
export const OPZIONI: { segno: string; t: Testo; d: Testo }[] = [
  { segno: 'canali', t: { it: 'Accanto', en: 'Alongside' },
    d: { it: 'Percorsi a evento su Journey Optimizer, campagne pianificate dove sono.', en: 'Event journeys on Journey Optimizer, scheduled campaigns where they are.' } },
  { segno: 'flusso', t: { it: 'Per famiglia', en: 'By family' },
    d: { it: 'Una famiglia di campagne pianificate alla volta passa su Journey Optimizer.', en: 'One family of scheduled campaigns at a time moves to Journey Optimizer.' } },
  { segno: 'archivio', t: { it: 'Tutto insieme', en: 'All together' },
    d: { it: 'Percorsi e campagne pianificate nello stesso strumento.', en: 'Journeys and scheduled campaigns in the same tool.' } },
  { segno: 'misura', t: { it: 'In fase 1, la frequenza', en: 'In phase 1, frequency' },
    d: { it: 'Due strumenti parlano alla stessa persona: chi governa il tetto si decide in fase 0.', en: 'Two tools reach the same person: who owns the cap gets decided in phase 0.' } },
];

/** La riga della decisione, sotto le opzioni. Parole del proprietario. */
export const DECIDETE: Testo = {
  it: 'Se e quando spostare le campagne pianificate lo decidete voi, dopo la misura della fase 1. Costo, tempi e prerequisiti si stimano allora.',
  en: 'Whether and when to move scheduled campaigns is your call, after the phase 1 measurement. Cost, timing and prerequisites get estimated then.',
};

/** La nota sotto lo schema («non toccare» del panel): le stesse parole nei due percorsi. */
export const IPOTESI: Testo = {
  it: 'L’architettura attuale è una nostra ipotesi, da correggere con voi.',
  en: 'The current architecture is our assumption, to correct with you.',
};

/** Chi si siede al tavolo della fase 0: la riga dell'ask nel taglio corto. */
export const TAVOLO: Testo = {
  it: 'Fase 0: Targeting, CRM, Group Technology, Canali.',
  en: 'Phase 0: Targeting, CRM, Group Technology, Channels.',
};

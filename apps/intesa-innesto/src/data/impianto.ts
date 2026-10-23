/**
 * «Dove ci innestiamo» — i blocchi condivisi del deck, definiti UNA volta.
 *
 * Qui dentro c'è quello che più di una pagina usa: l'impianto del cliente, le
 * cifre pubbliche, i tre strati dell'architettura. Dove servirà una versione
 * corta (il taglio «in dieci minuti», se nascerà) si aggiunge un campo ACCANTO
 * a quello lungo — `tBreve`, `bBreve` — e mai una seconda voce: due copie a
 * mano degli stessi blocchi divergono sempre, e diverge il taglio corto.
 *
 * ⚠️ Gli STRATI sono la bozza da far validare all'architetto prima dell'incontro.
 * Animare o presentare un'architettura non concordata la rende solo più
 * memorabile quando è sbagliata.
 */

export interface Testo { it: string; en: string }

// ── L'impianto come lo leggiamo da fuori ────────────────────────────────────
// Fonte: incontro del 22 ott 2026 + confronto interno col team che segue
// l'account. È una LETTURA nostra, dichiarata come tale in slide.
export const IMPIANTO: Array<{ k: Testo; t: Testo; b: Testo }> = [
  {
    k: { it: 'Il dato', en: 'The data' },
    t: { it: 'Adobe Analytics, sul digitale', en: 'Adobe Analytics, on digital' },
    b: {
      it: 'Il comportamento su web e app è tracciato in profondità e da anni. Quello che succede in filiale, al telefono e sui contatti assistiti resta in altri sistemi, e oggi non si somma allo stesso cliente.',
      en: 'Web and app behaviour has been tracked in depth for years. What happens in branch, over the phone and in assisted contacts stays in other systems, and today it does not add up to the same customer.',
    },
  },
  {
    k: { it: 'La decisione', en: 'The decision' },
    t: { it: 'I target nel CRM, i journey nei workflow', en: 'Targets in the CRM, journeys in workflows' },
    b: {
      it: 'Le audience si costruiscono a monte, con modelli di propensione vostri. I percorsi girano nei workflow di Salesforce Marketing Cloud: chi entra in un workflow riceve la comunicazione prevista per quel ramo.',
      en: 'Audiences are built upstream, with your own propensity models. Journeys run inside Salesforce Marketing Cloud workflows: whoever enters a workflow gets the message that branch prescribes.',
    },
  },
  {
    k: { it: 'Il canale', en: 'The channel' },
    t: { it: 'Un solo percorso, da ogni porta', en: 'One journey, from every door' },
    b: {
      it: 'Il passaggio dalla multicanalità all’omnicanalità è fatto: lo stesso percorso identico dalla filiale, dall’app e dal sito. Web e form girano su Adobe Experience Manager, oggi installato in casa.',
      en: 'The move from multichannel to omnichannel is done: the very same journey from the branch, the app and the site. Web and forms run on Adobe Experience Manager, today installed on premise.',
    },
  },
];

// ── Le quattro cifre pubbliche ──────────────────────────────────────────────
// Fonte: piano d'impresa 2026-2029. Nessuna è nostra, e si dice in slide.
export const CIFRE: Array<{ n: string; l: Testo }> = [
  { n: '95%', l: { it: 'dei prodotti già disponibili in digitale', en: 'of products already available digitally' } },
  { n: '~70%', l: { it: 'dei percorsi cliente già omnicanale', en: 'of customer journeys already omnichannel' } },
  { n: '64%', l: { it: 'dell’infrastruttura già in cloud', en: 'of the infrastructure already in the cloud' } },
  { n: '~150', l: { it: 'casi d’uso di AI dichiarati in produzione', en: 'AI use cases declared in production' } },
];

// ── I tre strati dell'architettura ──────────────────────────────────────────
// La sequenza è l'argomento: prima tutto il loro, intero; poi il punto dove si
// ferma; poi i nostri componenti, che si appoggiano sopra senza spegnere nulla.
export interface Strato {
  id: string;
  k: Testo;
  t: Testo;
  /** I componenti dello strato. `nostro` solo dove il pezzo è Adobe e nuovo. */
  pezzi: Array<{ nome: string; nota: Testo; nostro?: boolean }>;
}

export const STRATI: Strato[] = [
  {
    id: 'dato',
    k: { it: 'Strato 1 · quello che avete', en: 'Layer 1 · what you have' },
    t: { it: 'Il dato e i modelli', en: 'Data and models' },
    pezzi: [
      { nome: 'Adobe Analytics', nota: { it: 'il comportamento digitale', en: 'digital behaviour' } },
      { nome: 'CRM', nota: { it: 'anagrafica, propensione, audience', en: 'customer base, propensity, audiences' } },
      { nome: 'Adobe Experience Manager', nota: { it: 'web e form, in casa', en: 'web and forms, on premise' } },
    ],
  },
  {
    id: 'vuoto',
    k: { it: 'Strato 2 · dove si ferma', en: 'Layer 2 · where it stops' },
    t: { it: 'La scelta dell’ultimo metro', en: 'The last-metre choice' },
    pezzi: [
      { nome: 'Salesforce Marketing Cloud', nota: { it: 'esegue il percorso deciso a monte', en: 'runs the journey decided upstream' } },
      { nome: 'Il ramo è già scritto', nota: { it: 'chi entra nel workflow riceve quel messaggio', en: 'whoever enters the workflow gets that message' } },
      { nome: 'Manca', nota: { it: 'che cosa esce adesso, per questa persona, su questo canale', en: 'what goes out now, for this person, on this channel' } },
    ],
  },
  {
    id: 'innesto',
    k: { it: 'Strato 3 · dove ci innestiamo', en: 'Layer 3 · where we graft on' },
    t: { it: 'Tre componenti, non tre idee', en: 'Three components, not three ideas' },
    pezzi: [
      { nome: 'Customer Journey Analytics', nota: { it: 'cuce digitale e offline sullo stesso cliente', en: 'stitches digital and offline onto the same customer' }, nostro: true },
      { nome: 'AI Decisioning', nota: { it: 'l’anello che sceglie che cosa esce adesso', en: 'the link that picks what goes out now' }, nostro: true },
      { nome: 'CX Enterprise Coworker', nota: { it: 'chi interroga i dati senza aprire Workspace', en: 'asking the data without opening Workspace' }, nostro: true },
    ],
  },
];

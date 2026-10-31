/**
 * L’ECOSISTEMA CRM DI BPER, E I DUE BLOCCHI CHE CAMBIANO.
 *
 * FONTE: lo schema «Architettura Ecosistema CRM» che il referente IT ha
 * condiviso il 26 ottobre 2026 (screenshot in `docs/BPER/`). Non è una nostra
 * ricostruzione né una deduzione dal sito: è il loro disegno, e per questo la
 * slide può dire «questo è quello che avete» senza il condizionale.
 *
 * ⚠️ QUELLO CHE LO SCHEMA DICE, E QUELLO CHE NON DICE. Lo schema nomina
 * «CDP ORACLE» come un blocco. Non dice se sia un data warehouse interrogabile
 * o una CDP applicativa, e la differenza decide se la federazione del dato è
 * possibile come la raccontiamo: è la prima delle domande aperte del capitolo
 * «Il dato resta dov’è», e non si risolve indovinando.
 *
 * I TRE VERSI, e il colore li distingue senza leggenda:
 *   resta  — roba loro, non la tocchiamo
 *   esce   — i due blocchi che Adobe sostituisce
 *   entra  — quello che prende il loro posto
 */
export type Verso = 'resta' | 'esce' | 'entra';

export interface Blocco {
  k: { it: string; en: string };
  d: { it: string; en: string };
  verso: Verso;
  /** Il nome del prodotto: presente, ma non è il titolo del blocco. */
  pro?: string;
}

/** La fascia alta: il dato, che resta loro. */
export const DATO: Blocco[] = [
  {
    k: { it: 'BPER Data Platform', en: 'BPER Data Platform' },
    d: { it: 'La piattaforma dati di gruppo, sopra tutto il resto', en: 'The group data platform, above everything else' },
    verso: 'resta',
  },
  {
    k: { it: 'CDP Oracle', en: 'Oracle CDP' },
    d: { it: 'Rinnovata fino al 2030: nessuno la sostituisce', en: 'Renewed to 2030: nobody replaces it' },
    verso: 'resta',
  },
  {
    k: { it: 'Tableau e analisi', en: 'Tableau and analysis' },
    d: { it: 'La reportistica che il business già usa', en: 'The reporting the business already uses' },
    verso: 'resta',
  },
];

/** La fascia di mezzo: dove si decide che cosa dire. È qui che si cambia. */
export const REGIA: Blocco[] = [
  {
    k: { it: 'La regia dei percorsi', en: 'Journey orchestration' },
    d: { it: 'Oggi Marketing Cloud. Il percorso parte dall’evento, non dalla lista', en: 'Marketing Cloud today. The journey starts from the event, not the list' },
    verso: 'esce', pro: 'Salesforce Marketing Cloud',
  },
  {
    k: { it: 'La personalizzazione', en: 'Personalisation' },
    d: { it: 'Oggi Personalization. Stessa regola su sito, app e area riservata', en: 'Personalization today. One rule across site, app and logged-in area' },
    verso: 'esce', pro: 'Salesforce Personalization',
  },
  {
    k: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    d: { it: 'Oggi non c’è: a parità di cliente decide l’ordine delle campagne', en: 'Missing today: for the same customer, campaign order decides' },
    verso: 'entra', pro: 'AJO Decisioning',
  },
];

/** La fascia bassa: il CRM e i canali, che non si toccano. */
export const CANALI: Blocco[] = [
  {
    k: { it: 'Salesforce FSC', en: 'Salesforce FSC' },
    d: { it: 'Portafogliazione, CRM operativo, CIB, FOL, Data Cloud', en: 'Portfolio, operational CRM, CIB, FOL, Data Cloud' },
    verso: 'resta',
  },
  {
    k: { it: 'Genesys e Unblu', en: 'Genesys and Unblu' },
    d: { it: 'Telefono, videocall, cobrowsing: il canale assistito', en: 'Phone, video call, cobrowsing: the assisted channel' },
    verso: 'resta',
  },
  {
    k: { it: 'I dieci canali digitali', en: 'The ten digital channels' },
    d: { it: 'Internet e mobile banking, mail, sms, push, banner, chat', en: 'Internet and mobile banking, mail, SMS, push, banner, chat' },
    verso: 'resta',
  },
];

/** Che cosa prende il posto di che cosa — la tavola del capitolo 03. */
export interface Scambio {
  oggi: { it: string; en: string };
  poi: { it: string; en: string };
  pro: string;
  /** Che cosa cambia davvero, in una riga. */
  d: { it: string; en: string };
}

export const SCAMBI: Scambio[] = [
  {
    oggi: { it: 'Salesforce Marketing Cloud', en: 'Salesforce Marketing Cloud' },
    poi: { it: 'La regia dei percorsi', en: 'Journey orchestration' },
    pro: 'Adobe Journey Optimizer',
    d: {
      it: 'Il percorso parte da un evento e si corregge mentre gira, invece di essere una campagna costruita e lanciata.',
      en: 'The journey starts from an event and corrects itself as it runs, instead of being a campaign built and launched.',
    },
  },
  {
    oggi: { it: 'Salesforce Personalization', en: 'Salesforce Personalization' },
    poi: { it: 'La personalizzazione dei canali', en: 'Channel personalisation' },
    pro: 'Adobe Target',
    d: {
      it: 'Una regola sola vale su sito, app e area riservata, e si misura dove si applica.',
      en: 'One rule holds across site, app and the logged-in area, and is measured where it applies.',
    },
  },
  {
    oggi: { it: 'Niente di equivalente', en: 'Nothing equivalent' },
    poi: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    pro: 'AJO Decisioning',
    d: {
      it: 'Per lo stesso cliente arrivano quattro proposte, e a sceglierle è una regola invece dell’ordine in cui sono nate.',
      en: 'Four offers compete for the same customer, and a rule picks the winner instead of the order they were built in.',
    },
  },
  {
    oggi: { it: 'La misura, per canale', en: 'Measurement, channel by channel' },
    poi: { it: 'La misura, sul percorso intero', en: 'Measurement, across the whole journey' },
    pro: 'Customer Journey Analytics',
    d: {
      it: 'Lo stesso cliente visto su filiale, app e sito in un unico conteggio, senza spostare il dato dalla vostra piattaforma.',
      en: 'The same customer across branch, app and site in one count, without moving data off your platform.',
    },
  },
];

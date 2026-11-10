/**
 * I DUE MOCKUP A PASSI: come funzionano Customer Journey Analytics e AI Decisioning
 * nel contesto di Intesa Sanpaolo, con SAS a monte. Ogni freccia giù scopre un pezzo.
 *
 * FONTI LETTE il 10 nov 2026 (Experience League e Field Readiness, via Fluffy):
 * · CJA collega online e offline se l'identificativo della persona è lo stesso (FAQ).
 * · Ranking formula di Decisioning: combina punteggi di modelli AI, attributi del
 *   profilo, attributi dell'offerta e contesto.
 * · Finché convivono, Analytics e CJA si licenziano entrambi (pagina di upgrade).
 * · SAS in Intesa Sanpaolo è pubblico: storie cliente su sas.com. La catena completa
 *   dei sistemi è un'ipotesi nostra, da confermare: la nota lo dichiara.
 */
export type ScenaId = 'cja' | 'decisioning';
export interface Scena { prodotto: string; cosa: string; passi: string[]; nota: string; fonti: { label: string; url: string }[]; }
const EL = 'https://experienceleague.adobe.com/en/docs';
export const SCENE: Record<ScenaId, Scena> = {
  cja: {
    prodotto: 'Customer Journey Analytics',
    cosa: 'Uno strato di lettura sopra i canali: si parte da quello che Adobe Analytics raccoglie già.',
    passi: [
      'Oggi sito e app si leggono in Adobe Analytics. Filiale e contact center stanno altrove.',
      'Customer Journey Analytics si appoggia sopra e legge quello che Analytics raccoglie già.',
      'Entrano il CRM di filiale e il contact center, una fonte alla volta.',
      'I segmenti e gli score di SAS entrano come attributi. SAS resta a monte.',
      'Chi si identifica diventa un percorso solo, dalla simulazione alla firma in filiale.',
      'Ogni canale riceve il suo peso sulle firme, filiale compresa.',
    ],
    nota: 'Schema illustrativo. Serve un identificativo comune fra le fonti. Finché convivono, Analytics e Customer Journey Analytics si licenziano entrambi.',
    fonti: [
      { label: 'Online e offline', url: `${EL}/analytics-platform/using/cja-overview/cja-b2c-overview/cja-faq` },
      { label: 'Il passaggio da Analytics', url: `${EL}/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations` },
    ],
  },
  decisioning: {
    prodotto: 'AI Decisioning',
    cosa: 'L’arbitro fra le proposte: usa quello che SAS calcola e sceglie quale esce.',
    passi: [
      'SAS resta a monte: produce target, propensione ed eleggibilità, come oggi.',
      'Questi dati arrivano ad AI Decisioning come attributi del profilo.',
      'Per la stessa persona ci sono quattro proposte candidate.',
      'Regole, consenso e contact policy tolgono quelle non ammesse.',
      'La classifica combina il punteggio di SAS, il modello AI e il contesto del momento.',
      'Ne esce una sola, sul canale giusto. L’orchestrazione può restare dov’è.',
      'Customer Journey Analytics misura l’esito, e il modello impara per la volta dopo.',
    ],
    nota: 'Schema illustrativo, sistemi attuali da confermare con voi. Su chi non è ancora cliente SAS non ha punteggi: valgono le regole scritte insieme.',
    fonti: [
      { label: 'Formule di classifica', url: `${EL}/journey-optimizer/using/decisioning/experience-decisioning/experience-decisioning-rankings/ranking-formulas` },
      { label: 'Decisioning via API', url: `${EL}/journey-optimizer/using/decisioning/offer-decisioning/api-reference/offer-delivery-api/start-offer-delivery-apis` },
    ],
  },
};

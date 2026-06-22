/**
 * roi-metrics.ts — Executive Summary della LP `/maxmara-adobe/`.
 *
 * Numeri REALI estratti dal deck MaxMara_Adobe (niente dati inventati): sono gli
 * stessi insight che il deck dimostra, inquadrati per un CMO che ha 60 secondi.
 * `headline` è la statistica-chiave (mostrata in grande); `grid` è la fila di callout.
 */

export interface RoiMetric {
  value: string;
  label: string;
  source?: string;
}

/** Statistica-chiave: il costo dello status quo. */
export const headlineMetric: RoiMetric = {
  value: '11%',
  label:
    'Di 100 clienti che raggiungiamo, solo 11 completano l’acquisto: l’attenzione c’è, la rilevanza no. Il journey si rompe molto prima del checkout.',
  source: 'Funnel d’acquisto — analisi del deck',
};

/** Callout a griglia: cosa cambia quando Content, Data e People lavorano insieme. */
export const roiMetrics: RoiMetric[] = [
  {
    value: '+64%',
    label: 'di pull dall’immagine giusta sul target 35–45, riconosciuta e misurata dall’AI (auto-tagging).',
    source: 'Content intelligence — deck',
  },
  {
    value: '2.5×',
    label: 'nuovi visitatori (target più giovane) attivati dalla campagna giusta sul canale giusto.',
    source: 'Activation — deck',
  },
  {
    value: '+18%',
    label: 'di ROI previsto riallocando il budget dove genera davvero contribuzione incrementale.',
    source: 'Media mix — deck',
  },
  {
    value: '25%',
    label: 'della spesa media oggi attribuita al canale sbagliato: budget che lavora a vuoto.',
    source: 'Attribution — deck',
  },
];

/**
 * roi-metrics.ts — Executive Summary della LP `/maxmara-adobe/`.
 *
 * Statistiche REALI e con FONTE, estratte dai POV Adobe di settore (Fashion &
 * Luxury POV 2026, Retail Industry Stat Pack 2026) — coerenti col mondo
 * fashion/luxury e mappate sul journey del deck: Content · Data · People + ROI.
 * `headline` è il dato-chiave (il costo dell'irrilevanza); `grid` è la fila di callout.
 */

export interface RoiMetric {
  value: string;
  label: string;
  source?: string;
}

/** Dato-chiave: il costo dell'esperienza che non è rilevante. */
export const headlineMetric: RoiMetric = {
  value: '45%',
  label:
    'dei clienti nel mondo abbandona spesso l’acquisto quando l’esperienza digitale è frustrante. L’attenzione c’è, la rilevanza no: il journey si rompe prima del checkout.',
  source: 'The Business of Fashion & Adobe, 2026',
};

/** Callout a griglia, mappati sul journey: Content · Data · People · ROI. */
export const roiMetrics: RoiMetric[] = [
  {
    value: '5×',
    label:
      'la crescita della domanda di contenuti che i brand affronteranno entro il 2027, attesa dal 71% dei marketer. La creatività on-brand va prodotta a scala.',
    source: 'Adobe, 2025',
  },
  {
    value: '70%',
    label:
      'dei consumatori europei si aspetta esperienze fluide e personalizzate tra online e boutique. Un solo profilo, riconosciuto su ogni canale.',
    source: 'Adobe, 2026',
  },
  {
    value: '62%',
    label:
      'dei consumatori ha un legame emotivo con i brand che ama, e la community ne è il primo driver. La relazione vale più della singola vendita.',
    source: 'BoF–McKinsey, State of Fashion 2026',
  },
  {
    value: '3×',
    label:
      'il ROAS incrementale, con +30% di conversione sui segmenti target, quando contenuti, dati e persone lavorano insieme.',
    source: 'Adobe, casi cliente',
  },
];

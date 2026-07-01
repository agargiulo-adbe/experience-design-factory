export interface RoiMetric {
  id: string;
  value: string;
  label: { it: string; en: string };
  context: { it: string; en: string };
  source: string;
  solution?: string;
  isProjected?: boolean;
}

export const ROI_METRICS: RoiMetric[] = [
  {
    id: 'usbank-conversions',
    value: '19×',
    label: { it: 'Conversioni CDP-driven', en: 'CDP-driven conversions' },
    context: {
      it: 'Rispetto al periodo pre-CDP (U.S. Bank)',
      en: 'vs. pre-CDP period (U.S. Bank)',
    },
    source: 'U.S. Bank × Adobe Real-Time CDP',
    solution: 'rtcdp',
  },
  {
    id: 'usbank-accounts',
    value: '+127%',
    label: { it: 'Conti aperti anno su anno', en: 'New booked accounts YoY' },
    context: {
      it: 'Campagne attivate da Real-Time CDP',
      en: 'CDP-activated marketing campaigns',
    },
    source: 'U.S. Bank × Adobe',
    solution: 'rtcdp',
  },
  {
    id: 'onboarding-speed',
    value: '90%',
    label: { it: 'Riduzione tempo onboarding', en: 'Onboarding time reduction' },
    context: {
      it: "Da giorni a ore per l'apertura conto digitale",
      en: 'From days to hours for digital account opening',
    },
    source: 'Adobe Journey Optimizer · Financial Services',
    solution: 'ajo-b2c',
  },
  {
    id: 'digital-transactions',
    value: '60%+',
    label: { it: 'Transazioni digitali UniCredit', en: 'UniCredit digital transactions' },
    context: {
      it: 'Online e mobile oggi · target 80% entro 2026',
      en: 'Online and mobile today · target 80% by 2026',
    },
    source: 'UniCredit Investor Day 2024',
  },
  {
    id: 'ai-traffic',
    value: '+2700%',
    label: { it: 'Traffico AI-driven nel banking', en: 'AI-driven banking traffic' },
    context: {
      it: 'Lug 2024 – Mag 2025, canale in più rapida crescita',
      en: 'Jul 2024 – May 2025, fastest-growing channel',
    },
    source: 'Adobe Analytics · Financial Services Benchmark',
    solution: 'cja',
  },
  {
    id: 'content-speed',
    value: '10×',
    label: { it: 'Velocità produzione contenuti', en: 'Content production speed' },
    context: {
      it: 'Varianti per segmento create con GenStudio rispetto al flusso tradizionale',
      en: 'Segment variants created with GenStudio vs. traditional workflow',
    },
    source: 'Adobe GenStudio · Performance Marketing',
    solution: 'genstudio',
  },
];

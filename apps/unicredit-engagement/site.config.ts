import type { SiteConfig } from '@agargiulo-adbe/experience-core';

export const siteConfig: SiteConfig = {
  client: 'unicredit-engagement',
  defaultLocale: 'it',
  locales: ['it', 'en'],
  theme: './unicredit.tokens.json',
  cobrand: {
    primary: 'UniCredit',
    secondary: 'Adobe',
  },
  pages: [
    {
      slug: '/',
      title: { it: 'Engagement Unlimited', en: 'Engagement Unlimited' },
      description: {
        it: 'Come Adobe trasforma ogni interazione in una relazione, per UniCredit.',
        en: 'How Adobe turns every interaction into a relationship, for UniCredit.',
      },
      blocks: [
        { id: 'home-cover', type: 'hero', visible: true, order: 1, props: { variant: 'full' } },
        { id: 'home-context', type: 'narrative', visible: true, order: 2, props: {} },
        { id: 'home-metric', type: 'metric', visible: true, order: 3, props: { variant: 'large' } },
      ],
    },
    {
      slug: '/scenario',
      title: { it: 'Il momento del banking', en: 'The Banking Moment' },
      blocks: [
        { id: 'scenario-market', type: 'narrative', visible: true, order: 1, props: {} },
        { id: 'scenario-challenge', type: 'metric', visible: true, order: 2, props: {} },
      ],
    },
    {
      slug: '/conosci',
      title: { it: 'Conosci ogni cliente', en: 'Know Every Customer' },
      blocks: [
        { id: 'conosci-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 1 } },
        { id: 'conosci-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
        { id: 'conosci-gateway', type: 'productGateway', visible: true, order: 3, props: {} },
      ],
    },
    {
      slug: '/acquisisci',
      title: { it: 'Acquisisci digitale', en: 'Digital Acquisition' },
      blocks: [
        { id: 'acq-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 2 } },
        { id: 'acq-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
        { id: 'acq-metric', type: 'metric', visible: true, order: 3, props: {} },
      ],
    },
    {
      slug: '/coinvolgi',
      title: { it: 'Coinvolgi in tempo reale', en: 'Real-Time Engagement' },
      blocks: [
        { id: 'eng-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 3 } },
        { id: 'eng-fbs', type: 'frontBackStage', visible: true, order: 2, props: { reversed: true } },
        { id: 'eng-metric', type: 'metric', visible: true, order: 3, props: {} },
      ],
    },
    {
      slug: '/contenuti',
      title: { it: 'Contenuti senza limiti', en: 'Content at Scale' },
      blocks: [
        { id: 'cont-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 4 } },
        { id: 'cont-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
      ],
    },
    {
      slug: '/analizza',
      title: { it: "L'intelligenza dei dati", en: 'Data Intelligence' },
      blocks: [
        { id: 'anal-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 5 } },
        { id: 'anal-fbs', type: 'frontBackStage', visible: true, order: 2, props: { reversed: true } },
      ],
    },
    {
      slug: '/b2b',
      title: { it: 'Banking per le imprese', en: 'Business Banking' },
      blocks: [
        { id: 'b2b-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 6 } },
        { id: 'b2b-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
      ],
    },
    {
      slug: '/motore-adobe',
      title: { it: 'Il motore Adobe', en: 'The Adobe Engine' },
      blocks: [
        { id: 'adobe-intro', type: 'narrative', visible: true, order: 1, props: {} },
        { id: 'adobe-stack', type: 'adobeStackReveal', visible: true, order: 2, props: {} },
      ],
    },
    {
      slug: '/risultati',
      title: { it: 'I risultati', en: 'The Results' },
      blocks: [
        { id: 'roi-metrics', type: 'metric', visible: true, order: 1, props: { variant: 'large' } },
        { id: 'roi-cta', type: 'hero', visible: true, order: 2, props: { variant: 'centered' } },
      ],
    },
  ],
};

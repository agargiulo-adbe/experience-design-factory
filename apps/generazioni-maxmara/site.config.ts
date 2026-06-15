import type { SiteConfig } from '@agargiulo-adbe/experience-core';

export const siteConfig: SiteConfig = {
  client: 'generazioni-maxmara',
  defaultLocale: 'it',
  locales: ['it', 'en'],
  theme: './generazioni.tokens.json',
  cobrand: {
    primary: 'Max Mara',
    secondary: 'Adobe',
  },
  pages: [
    {
      slug: '/',
      title: { it: 'Generazioni', en: 'Generations' },
      description: { it: 'Ringiovanire il target, allungare il ciclo di vita, accrescere il valore.', en: 'Rejuvenate the target, extend the lifecycle, grow customer value.' },
      blocks: [
        { id: 'home-hero', type: 'hero', visible: true, order: 1, props: { variant: 'full' } },
        { id: 'home-tesi', type: 'narrative', visible: true, order: 2, props: { variant: 'default' } },
        { id: 'home-metric-ltv', type: 'metric', visible: true, order: 3, props: { variant: 'large' } },
        { id: 'home-visione', type: 'narrative', visible: true, order: 4, props: { mediaPosition: 'left' } },
        { id: 'home-timeline', type: 'timeline', visible: true, order: 5, props: {} },
      ],
    },
    {
      slug: '/acquisizione',
      title: { it: 'Acquisizione', en: 'Acquisition' },
      blocks: [
        { id: 'acq-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 1 } },
        { id: 'acq-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
        { id: 'acq-gateway', type: 'productGateway', visible: true, order: 3, props: {} },
        { id: 'acq-metric', type: 'metric', visible: true, order: 4, props: {} },
      ],
    },
    {
      slug: '/engagement',
      title: { it: 'Engagement', en: 'Engagement' },
      blocks: [
        { id: 'eng-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 2 } },
        { id: 'eng-heritage', type: 'narrative', visible: true, order: 2, props: {} },
        { id: 'eng-fbs', type: 'frontBackStage', visible: true, order: 3, props: { reversed: true } },
      ],
    },
    {
      slug: '/conversione',
      title: { it: 'Conversione', en: 'Conversion' },
      blocks: [
        { id: 'conv-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 3 } },
        { id: 'conv-fbs', type: 'frontBackStage', visible: true, order: 2, props: {} },
        { id: 'conv-metric', type: 'metric', visible: true, order: 3, props: {} },
      ],
    },
    {
      slug: '/conversione',
      title: { it: 'Loyalty', en: 'Loyalty' },
      blocks: [
        { id: 'loy-phase', type: 'journeyPhase', visible: true, order: 1, props: { phaseNumber: 4 } },
        { id: 'loy-fbs', type: 'frontBackStage', visible: true, order: 2, props: { reversed: true } },
        { id: 'loy-clienteling', type: 'narrative', visible: true, order: 3, props: {} },
        { id: 'loy-metric', type: 'metric', visible: true, order: 4, props: { variant: 'large' } },
      ],
    },
    {
      slug: '/motore-adobe',
      title: { it: 'Il Motore Adobe', en: 'The Adobe Engine' },
      blocks: [
        { id: 'adobe-intro', type: 'narrative', visible: true, order: 1, props: {} },
        { id: 'adobe-stack', type: 'adobeStackReveal', visible: true, order: 2, props: {} },
      ],
    },
    {
      slug: '/persona',
      title: { it: 'La Persona', en: 'The Persona' },
      blocks: [
        { id: 'persona-intro', type: 'narrative', visible: true, order: 1, props: {} },
        { id: 'persona-giulia', type: 'persona', visible: true, order: 2, props: { variant: 'primary' } },
        { id: 'persona-francesca', type: 'persona', visible: true, order: 3, props: { variant: 'secondary' } },
      ],
    },
    {
      slug: '/chiusura',
      title: { it: 'Il prossimo passo', en: 'Next Steps' },
      blocks: [
        { id: 'cta-hero', type: 'hero', visible: true, order: 1, props: { variant: 'centered' } },
        { id: 'cta-sintesi', type: 'narrative', visible: true, order: 2, props: {} },
        { id: 'cta-metrics', type: 'metric', visible: true, order: 3, props: {} },
      ],
    },
  ],
};

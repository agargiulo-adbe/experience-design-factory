export { BlockTypeSchema, type BlockType } from '../schema/index.js';

// Maps block type to its component filename (used by the page renderer)
export const BLOCK_COMPONENT_MAP: Record<string, string> = {
  hero: 'Hero',
  narrative: 'NarrativeSection',
  frontBackStage: 'FrontBackStageSplit',
  journeyPhase: 'JourneyPhase',
  persona: 'PersonaCard',
  productGateway: 'ProductGateway',
  adobeStackReveal: 'AdobeStackReveal',
  metric: 'MetricCallout',
  timeline: 'Timeline',
};

export { adobeProducts, getProductsByPhase, getProductById } from './adobe-products.js';

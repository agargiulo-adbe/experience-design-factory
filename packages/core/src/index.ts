// Experience Design Factory — Core Engine
// Re-exports for consumers

export * from './schema/index.js';
export * from './registry/index.js';
export * from './i18n/index.js';

// `Locale` is defined identically in both schema (zod-derived) and i18n.
// Re-export the schema one explicitly to resolve the star-export ambiguity.
export type { Locale } from './schema/index.js';

import { z } from 'zod';

// Base types
export const LocaleSchema = z.enum(['it', 'en']);
export type Locale = z.infer<typeof LocaleSchema>;

export const LocalizedStringSchema = z.object({
  it: z.string(),
  en: z.string(),
});
export type LocalizedString = z.infer<typeof LocalizedStringSchema>;

export function localized<T extends z.ZodType>(schema: T) {
  return z.object({ it: schema, en: schema });
}

// Adobe Product Reference
export const AdobeProductRefSchema = z.object({
  id: z.string(),
  note: LocalizedStringSchema.optional(),
});
export type AdobeProductRef = z.infer<typeof AdobeProductRefSchema>;

// Block types
export const BlockTypeSchema = z.enum([
  'hero',
  'narrative',
  'frontBackStage',
  'journeyPhase',
  'persona',
  'productGateway',
  'adobeStackReveal',
  'metric',
  'timeline',
]);
export type BlockType = z.infer<typeof BlockTypeSchema>;

// Block config
export const BlockConfigSchema = z.object({
  id: z.string(),
  type: BlockTypeSchema,
  visible: z.boolean().default(true),
  order: z.number(),
  props: z.record(z.unknown()),
});
export type BlockConfig = z.infer<typeof BlockConfigSchema>;

// Front/Back Stage props
export const FrontBackStagePropsSchema = z.object({
  phaseId: z.string(),
  customerView: z.object({
    title: LocalizedStringSchema,
    body: LocalizedStringSchema,
    media: z.string().optional(),
  }),
  adobeStack: z.array(AdobeProductRefSchema),
});
export type FrontBackStageProps = z.infer<typeof FrontBackStagePropsSchema>;

// Hero props
export const HeroPropsSchema = z.object({
  title: LocalizedStringSchema,
  subtitle: LocalizedStringSchema,
  cta: z.object({
    label: LocalizedStringSchema,
    href: z.string(),
  }).optional(),
  media: z.string().optional(),
  variant: z.enum(['full', 'split', 'centered']).default('full'),
});
export type HeroProps = z.infer<typeof HeroPropsSchema>;

// Narrative props
export const NarrativePropsSchema = z.object({
  title: LocalizedStringSchema,
  body: LocalizedStringSchema,
  media: z.string().optional(),
  mediaPosition: z.enum(['left', 'right', 'above', 'below']).default('right'),
  variant: z.enum(['default', 'wide', 'narrow']).default('default'),
});
export type NarrativeProps = z.infer<typeof NarrativePropsSchema>;

// Journey Phase props
export const JourneyPhasePropsSchema = z.object({
  phaseId: z.string(),
  phaseNumber: z.number(),
  title: LocalizedStringSchema,
  subtitle: LocalizedStringSchema,
  body: LocalizedStringSchema,
  icon: z.string().optional(),
});
export type JourneyPhaseProps = z.infer<typeof JourneyPhasePropsSchema>;

// Persona Card props
export const PersonaCardPropsSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
  location: z.string().optional(),
  title: LocalizedStringSchema,
  story: LocalizedStringSchema,
  avatar: z.string().optional(),
  variant: z.enum(['primary', 'secondary']).default('primary'),
});
export type PersonaCardProps = z.infer<typeof PersonaCardPropsSchema>;

// Product Gateway props
export const ProductGatewayPropsSchema = z.object({
  title: LocalizedStringSchema,
  body: LocalizedStringSchema,
  products: z.array(z.object({
    name: LocalizedStringSchema,
    description: LocalizedStringSchema,
    media: z.string().optional(),
  })),
});
export type ProductGatewayProps = z.infer<typeof ProductGatewayPropsSchema>;

// Adobe Stack Reveal props
export const AdobeStackRevealPropsSchema = z.object({
  title: LocalizedStringSchema,
  body: LocalizedStringSchema,
  phases: z.array(z.object({
    phaseId: z.string(),
    label: LocalizedStringSchema,
    products: z.array(AdobeProductRefSchema),
  })),
});
export type AdobeStackRevealProps = z.infer<typeof AdobeStackRevealPropsSchema>;

// Metric Callout props
export const MetricCalloutPropsSchema = z.object({
  value: z.string(),
  label: LocalizedStringSchema,
  context: LocalizedStringSchema.optional(),
  source: z.string().optional(),
});
export type MetricCalloutProps = z.infer<typeof MetricCalloutPropsSchema>;

// Timeline props
export const TimelineEntrySchema = z.object({
  year: z.string(),
  title: LocalizedStringSchema,
  body: LocalizedStringSchema.optional(),
  highlight: z.boolean().default(false),
});
export const TimelinePropsSchema = z.object({
  title: LocalizedStringSchema,
  entries: z.array(TimelineEntrySchema),
});
export type TimelineProps = z.infer<typeof TimelinePropsSchema>;

// Page config
export const PageConfigSchema = z.object({
  slug: z.string(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  blocks: z.array(BlockConfigSchema),
});
export type PageConfig = z.infer<typeof PageConfigSchema>;

// Site config
export const SiteConfigSchema = z.object({
  client: z.string(),
  defaultLocale: LocaleSchema.default('it'),
  locales: z.array(LocaleSchema).default(['it', 'en']),
  theme: z.string(),
  cobrand: z.object({
    primary: z.string(),
    secondary: z.string(),
  }).optional(),
  pages: z.array(PageConfigSchema),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

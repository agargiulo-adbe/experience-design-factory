# Experience Design Skill

## Method
1. **Brand Research** — Understand the client's brand, values, audience, strategy
2. **Design Tokens** — Define 3-level token system (primitive → semantic → component) from brand guidelines
3. **Block Assembly** — Compose the 9 experience blocks per page, mapping the customer journey
4. **Front/Back-Stage Mapping** — For each journey phase, define what the customer sees AND what Adobe does behind the scenes
5. **Content Creation** — Write original copy in the client's language (IT default), quality editorial tone
6. **Config-Driven Setup** — Define site.config.ts with all pages, blocks, visibility flags
7. **Quality Check** — Responsive, a11y, reduced-motion, performance, content quality

## The 9 Experience Blocks
| Block | Purpose | When to use |
|-------|---------|-------------|
| Hero | Opening statement | Page openers, manifesto |
| NarrativeSection | Storytelling | Heritage, vision, explanations |
| FrontBackStageSplit | Customer↔Adobe split (SIGNATURE) | Every journey phase |
| JourneyPhase | Phase introduction | Start of each journey stage |
| PersonaCard | Character profile | Persona pages |
| ProductGateway | Product showcase | Entry points, accessories |
| AdobeStackReveal | Full tech stack | Architecture page |
| MetricCallout | Key data point | Punctuation between sections |
| Timeline | Chronological story | Brand history |

## Adobe Product Registry
Single source of truth in `registry/adobe-products.ts`. Products mapped by phase:
- **Core:** AEP, RT-CDP, AI Assistant, Agent Orchestrator
- **Acquisizione:** GenStudio, Firefly, Express, CJA, Mix Modeler
- **Engagement:** AEM Sites, Target, Commerce
- **Conversione:** Journey Optimizer, Brand Concierge
- **Loyalty:** Journey Optimizer, RT-CDP, CJA
- **Operations:** Workfront, GenStudio

## New Client Checklist
1. Create `*.tokens.json` with brand colors/fonts
2. Define `site.config.ts` with pages and block composition
3. Write content for each block (original, in target language)
4. Source/create brand-appropriate imagery
5. Update `astro.config.mjs` with site URL and base path
6. Test and deploy

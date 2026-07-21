# Product

## Register

brand

## Platform

web

## Users

The people this is designed for are the **viewers of the experiences**: Adobe leadership and colleagues, and client stakeholders, watching an immersive experience in a boardroom, on a projector at 1920×1080, or in a live demo. Their context is a room and a narrative — they are being walked through a story, not operating a tool, so nothing on screen should ask for effort. The same content auto-adapts from phone to giant TV, so the audience may also be a single reader on a laptop or a crowd in front of a wall display.

A distinct secondary surface, the shared **Admin Console**, serves a different audience: consultants and admins who configure an experience — turning Adobe solutions on or off, attaching demo media to slides, and authoring new deck-coherent slides. They work in a light "admin" theme, task-first, before the viewers ever see the result. Engineers assembling new experiences on the engine are users of the code, not of a screen; the token contract and block API are their surface.

## Product Purpose

`@edf/core` is the shared engine behind the Experience Design Factory: one reusable core — immersive deck, Admin Console, i18n, motion, and a design-token contract — over which each client Experience Design is a **skin** of tokens, content, assets, and config. The purpose is to make a new client experience a new skin rather than a new build, and to make every improvement to the engine propagate to every experience at once. Success is that Max Mara, Ferrari, Agos, UniCredit, and the rest each feel unmistakably their own brand while sharing the same substrate, and that a fix or feature landed in core is inherited everywhere without a per-app rewrite.

## Positioning

One engine, many brands: every client experience is a configurable skin over the same core, so craft and corrections propagate everywhere from a single place. The claim every experience reinforces is consistency of craft across wildly different identities — quiet-luxury and motorsport and finance built from one disciplined foundation.

## Conversion & proof

Conversion lives in each experience, not in the engine. The engine's job is to carry, undamaged, whatever a given skin needs a viewer to believe — that Adobe's capability is real, relevant to this brand, and within reach. The belief arc the core is built to support: this looks like *our* brand, not a template → the story is legible and effortless at projection size → the Adobe capability shown is concrete, not a pitch → we could run this. Proof is supplied per experience (client-appropriate demo material, public Adobe capabilities only); the engine holds no proof assets of its own.

## Brand Personality

A neutral substrate. The engine has no aesthetic of its own and is meant to disappear: it imposes structure, legibility, and motion, and yields every visible choice to the skin's tokens, content, and assets. Its personality is disciplined restraint — precise, deferential, invisible. When the engine is doing its job, a viewer sees only Max Mara or Ferrari, never "the platform."

## Anti-references

No wrong-brand imagery: never a competitor's car or a foreign logo; only the client's own assets or abstract, atmospheric imagery. Only public Adobe capabilities and demo material — no reserved client IP. No AI-slop copy: no em-dash used as a rhetorical crutch, no staccato tricolons, no "not just X, but Y", no buzzword stacking. Never a generic slide-template feel, and never type shrunk below the legibility minimums to make an audit pass. No hardcoded colors or spacing — tokens only, so a skin can fully repaint the engine.

## Design Principles

Improve once, inherit everywhere — a change to a shared block lands in every experience; skins never fork the core. The skin leads and the engine defers — core supplies structure and contracts, brand identity comes entirely from tokens, content, and assets. Legibility is a hard requirement, not an audit score — verified by reading a 1920 screenshot, never by shrinking type; when generous type doesn't fit, cut copy or split the slide. Config over code — every experience is ordered slides with runtime toggles for solutions, media, and custom slides, reconfigurable without a rebuild. Human craft, revealed progressively — copy reads like a sharp person wrote it, Adobe is revealed step by step, and the co-brand stays discreet.

## Accessibility & Inclusion

WCAG 2.2 AA and Lighthouse ≥ 95 are the floor. The deck auto-optimizes from mobile to desktop to giant TV from a single source (safe-area tokens plus scroll on dense phones), so legibility holds at every size. `prefers-reduced-motion` is honored with a real alternative, not a dropped animation. Contrast is measured against explicit `rgba()` on dark chrome and tinted cards, because the audit's parser reads `oklab()`/`color-mix()` as white; body text uses a full-strength readable grey, never opacity-dimmed. Experiences are bilingual where the brand is: both languages render and CSS toggles the active one, with an anti-flash init so neither flashes on load.

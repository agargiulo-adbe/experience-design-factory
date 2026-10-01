-- ── 0016 · Tipo di deliverable (tassonomia del 1 ott 2026) ───────────────
-- Quattro tipi rivolti al cliente, nominati per la domanda a cui rispondono,
-- più «interno». Il tipo compare in copertina, su hub, showcase e console.
-- Fonte di verità del codice: packages/core/src/data/experienceTypes.ts e
-- apps/factory-showcase/src/data/experiences.ts (tenere allineati).
-- Idempotente. Da applicare con: supabase db query --linked (azione umana).

alter table public.experiences
  add column if not exists type text
  check (type in ('prospettiva','storia','blueprint','playbook','interno'));

comment on column public.experiences.type is
  'Tipo di deliverable: prospettiva (Dove potremmo arrivare?) · storia (Come funzionerebbe per un nostro cliente?) · blueprint (Come si collega a quello che abbiamo?) · playbook (Come lo uso da lunedì?) · interno.';

update public.experiences set type = v.type
  from (values
    ('generazioni-maxmara','storia'),
    ('unicredit-engagement','storia'),
    ('ferrari-racing','blueprint'),
    ('trenitalia-connessioni','blueprint'),
    ('agos-trait-dunion','blueprint'),
    ('eni-orbita','prospettiva'),
    ('mim-alfabeti','prospettiva'),
    ('isybank-momento','prospettiva'),
    ('poste-sei-domande','playbook'),
    ('atelier','interno'),
    ('aperture-email','interno')
  ) as v(slug, type)
  where experiences.slug = v.slug;

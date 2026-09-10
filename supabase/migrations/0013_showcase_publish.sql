-- ── 0013 · Pubblicazione nello showcase ──────────────────────────────────
-- Un toggle in Super Admin decide quali Experience Design compaiono su
-- /showcase/. Lo showcase è una pagina PUBBLICA senza login: per leggere lo
-- stato serve una policy per il ruolo anon, e quella policy espone SOLO le
-- righe pubblicate. Una experience depubblicata resta invisibile all'anonimo
-- tanto quanto se non esistesse.

alter table public.experiences
  add column if not exists show_in_showcase boolean not null default false;

comment on column public.experiences.show_in_showcase is
  'Se true, la scheda compare su /showcase/. Letta dal ruolo anon: non metterla a true su experience nate da materiale riservato.';

-- Lettura anonima limitata alle sole righe pubblicate, e ai soli campi che
-- servono allo showcase (nome/cliente/URL sono comunque pubblici sulla pagina).
drop policy if exists experiences_anon_showcase on public.experiences;
create policy experiences_anon_showcase on public.experiences
  for select
  to anon
  using (show_in_showcase = true);

-- Due experience mancavano del tutto dal registry: senza riga non c'è toggle.
-- Agos è già pubblica sulla vetrina; Aperture nasce fuori (ricerca indipendente).
insert into public.experiences (slug, name, client, description, base_url, status)
values
  ('agos-trait-dunion', 'Trait d''Union', 'Agos',
   'Due mondi — digitale e filiale, acquisition e customer base — in un''unica intelligenza del cliente.',
   '/experience-design-factory/agos-trait-dunion/', 'live'),
  ('aperture-email', 'Aperture', 'Osservatorio',
   'Osservatorio sul tracciamento nelle email dei brand. Ricerca indipendente, vendor-neutral.',
   '/experience-design-factory/aperture-email/', 'draft')
on conflict (slug) do nothing;

-- Il set di default dello showcase, allineato a quello del codice
-- (apps/factory-showcase/src/data/experiences.ts → defaultPublished).
update public.experiences
   set show_in_showcase = true
 where slug in (
   'generazioni-maxmara',
   'unicredit-engagement',
   'ferrari-racing',
   'trenitalia-connessioni',
   'agos-trait-dunion'
 );

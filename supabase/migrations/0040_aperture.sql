-- ── 0040 · Il contatore delle aperture (edizione da distribuire) ──────────
-- Spec: docs/superpowers/specs/2026-11-19-edizione-lettura-design.md, revisione
-- del 19 nov sera. Una riga per apertura della copertina o della pagina breve
-- di un'edizione da distribuire: progetto, pagina, giorno. Nient'altro.
-- NESSUNA colonna per ora, IP, user agent, sessione o identificativo: è la
-- ragione per cui il contatore non chiede consenso, e non va allargato senza
-- rifare quella valutazione. anon può solo INSERIRE; legge solo authenticated.

create table if not exists public.aperture (
  id        bigint generated always as identity primary key,
  progetto  text not null,
  pagina    text not null check (pagina in ('copertina', 'breve')),
  giorno    date not null default current_date
);
create index if not exists aperture_progetto_giorno on public.aperture (progetto, giorno);

comment on table public.aperture is
  'Aperture delle edizioni da distribuire: progetto, pagina, giorno. Nessun dato su chi apre.';

alter table public.aperture enable row level security;

drop policy if exists aperture_anon_insert on public.aperture;
create policy aperture_anon_insert on public.aperture
  for insert to anon
  with check (
    -- Solo i progetti che hanno un'edizione da distribuire: con la chiave anon
    -- pubblica, un nome libero permetterebbe a chiunque di riempire la tabella.
    -- Si aggiunge un nome qui quando nasce una nuova edizione.
    progetto in ('intesa-storia')
    and giorno = current_date
  );

drop policy if exists aperture_auth_select on public.aperture;
create policy aperture_auth_select on public.aperture
  for select to authenticated using (true);

-- Il conteggio per giorno, per chi legge da authenticated.
create or replace view public.aperture_per_giorno
  with (security_invoker = true) as
  select progetto, giorno, pagina, count(*)::int as aperture
    from public.aperture
   group by 1, 2, 3;

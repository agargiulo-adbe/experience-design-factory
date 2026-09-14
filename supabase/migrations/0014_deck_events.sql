-- ── 0014 · Telemetria dei deck ─────────────────────────────────────────────
-- Un deck che misura se stesso: ogni attivazione di slide scrive una riga.
-- Niente dati personali: il session_id è casuale per scheda, non c'è cookie,
-- non c'è IP nella tabella. anon può solo INSERIRE; la lettura anonima esiste
-- per il solo progetto 'atelier' (la slide «This deck is watching itself»),
-- via una funzione security definer. Tutto il resto si legge da authenticated.

create table if not exists public.deck_events (
  id          bigint generated always as identity primary key,
  project     text not null,
  route       text not null,
  slide_id    text not null,
  slide_index int  not null default 0,
  cut         text not null default 'full',
  lang        text not null default 'en',
  session_id  text not null,
  dwell_ms    int  not null default 0,
  ts          timestamptz not null default now()
);
create index if not exists deck_events_project_route_slide on public.deck_events (project, route, slide_id);
create index if not exists deck_events_ts on public.deck_events (ts);

comment on table public.deck_events is
  'Attivazioni di slide dei deck. Nessun dato personale: session_id casuale per scheda.';

alter table public.deck_events enable row level security;

drop policy if exists deck_events_anon_insert on public.deck_events;
create policy deck_events_anon_insert on public.deck_events
  for insert to anon
  with check (
    char_length(project) between 1 and 40
    and char_length(route) between 1 and 60
    and char_length(slide_id) between 1 and 80
    and char_length(session_id) between 8 and 64
    and dwell_ms between 0 and 3600000
    and lang in ('en','it','fr')
  );

drop policy if exists deck_events_auth_select on public.deck_events;
create policy deck_events_auth_select on public.deck_events
  for select to authenticated using (true);

-- La view eredita le policy del chiamante (security_invoker): authenticated
-- legge tutto, anon niente.
create or replace view public.deck_slide_stats
  with (security_invoker = true) as
  select project, route, slide_id, cut, lang,
         count(*)::int                                   as views,
         count(distinct session_id)::int                 as sessions,
         percentile_cont(0.5) within group (order by dwell_ms)::int as median_dwell_ms,
         max(ts)                                         as last_seen
    from public.deck_events
   group by 1, 2, 3, 4, 5;

-- L'unica lettura anonima: le statistiche del deck Atelier, per la sua slide.
create or replace function public.atelier_slide_stats()
returns setof public.deck_slide_stats
language sql
security definer
set search_path = public
stable
as $$
  select * from public.deck_slide_stats where project = 'atelier';
$$;

revoke all on function public.atelier_slide_stats() from public;
grant execute on function public.atelier_slide_stats() to anon, authenticated;
grant select on public.deck_slide_stats to authenticated;

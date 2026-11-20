-- ── 0044 · Una funzione in più: «Targeting e CRM commerciale» ──
-- Panel del 20 nov 2026 (P0): chi fa girare il link è il Targeting, e fra le
-- funzioni del modulo e delle card non c'era una porta per chi costruisce i
-- target. La chiave `targeting` è quella di packages/core/src/utils/contributi.ts.
-- Il riepilogo (0041) la tratta come le altre: conta per le tre funzioni e per
-- le soglie. Idempotente.
alter table public.contributi drop constraint if exists contributi_funzione_check;
alter table public.contributi add constraint contributi_funzione_check
  check (funzione in ('direzione','targeting','marketing','dati','tecnologia','digitale','rete','compliance','altro'));

-- ── 0043 · Il contatto esce dal database (annulla 0042) ──
-- Spec: docs/superpowers/specs/2026-11-20-contatto-facoltativo-design.md,
-- «Revisione del 20 nov pomeriggio».
--
-- Le regole privacy interne di Adobe non permettono di conservare contatti di
-- dipendenti dei clienti su sistemi non approvati (qui Supabase) senza una
-- revisione privacy e la valutazione del fornitore. Chi vuole una risposta ci
-- scrive per email dal modulo: l'indirizzo resta nella posta di Adobe.
-- Si toglie la COLONNA, non solo il campo nel modulo: senza colonna nessuno può
-- mandarci un indirizzo nemmeno chiamando l'API a mano.
-- Al momento della migrazione la tabella era vuota: nessun indirizzo è mai stato raccolto.
-- Idempotente: si può rilanciare.

-- I due trigger tornano come in 0041 (prima di togliere le colonne che leggevano).
create or replace function public.contributi_in_ingresso()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.id := gen_random_uuid();
  new.ts := now();
  new.stato := 'nuovo';
  new.area := null; new.testo_curato := null; new.risposta := null; new.curato_il := null;
  if (select count(*) from public.contributi c where c.progetto = new.progetto and c.ts > now() - interval '10 minutes') >= 20
     or (select count(*) from public.contributi c where c.progetto = new.progetto and c.ts > now() - interval '1 day') >= 200 then
    raise exception 'troppi contributi in poco tempo' using errcode = 'P0001';
  end if;
  return new;
end $$;

create or replace function public.contributi_curati()
returns trigger language plpgsql set search_path = public as $$
begin
  new.id := old.id; new.progetto := old.progetto; new.ts := old.ts;
  new.sezione := old.sezione; new.testo := old.testo;
  new.funzione := old.funzione; new.livello := old.livello; new.ok_riepilogo := old.ok_riepilogo;
  if (new.stato, new.area, new.testo_curato, new.risposta)
     is distinct from (old.stato, old.area, old.testo_curato, old.risposta) then
    new.curato_il := now();
  end if;
  return new;
end $$;

drop function if exists public.get_contatti(uuid);
drop function if exists public._contatti_scaduti();
alter table public.contributi drop column if exists contatto;
alter table public.contributi drop column if exists risposto_il;
alter table public.riepiloghi drop column if exists contatti_token;

comment on table public.contributi is
  'Contributi anonimi delle edizioni da distribuire: sezione, testo, funzione e livello facoltativi. Nessun dato su chi scrive (0043: il contatto di 0042 è stato tolto per le regole privacy di Adobe).';

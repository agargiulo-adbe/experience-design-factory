-- ── 0046 · Le domande si cancellano al più tardi 90 giorni dopo l'invio ──
-- Il modulo lo dichiara («si cancellano quando la raccolta si chiude, e comunque
-- entro 90 giorni dall'invio», owner 20 nov 2026): qui diventa vero anche se
-- nessuno apre il sito. Un job notturno di pg_cron, più la stessa pulizia a ogni
-- invio. La cancellazione alla chiusura della raccolta resta un gesto della
-- console. Idempotente.

create extension if not exists pg_cron;

create or replace function public.contributi_scaduti()
returns integer language plpgsql volatile security definer set search_path = public as $$
declare n integer;
begin
  delete from public.contributi where ts < now() - interval '90 days';
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.contributi_scaduti() from public, anon, authenticated;

-- All'invio: come 0043, più la pulizia dei contributi scaduti.
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
  perform public.contributi_scaduti();
  return new;
end $$;

-- Ogni notte alle 03:00 UTC.
select cron.unschedule(jobid) from cron.job where jobname = 'contributi-scaduti';
select cron.schedule('contributi-scaduti', '0 3 * * *', 'select public.contributi_scaduti()');

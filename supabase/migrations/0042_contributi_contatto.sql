-- ── 0042 · Il contatto facoltativo nei contributi (edizione da distribuire, versione B) ──
-- Spec: docs/superpowers/specs/2026-11-20-contatto-facoltativo-design.md.
--
-- Il modulo non è più anonimo per costruzione: chi vuole una risposta lascia
-- un'email, facoltativa. Chi la vede:
--   membri del progetto        → sulla scheda del contributo, in console;
--   il referente della banca   → solo con il link dei contatti (`contatti_token`,
--                                distinto da quello del riepilogo), RPC `get_contatti`.
-- Non entra MAI nel riepilogo: `_riepilogo` (0041) non legge la colonna.
-- Si cancella quando registriamo la risposta, e comunque dopo 90 giorni.
-- Idempotente: si può rilanciare.

alter table public.contributi
  add column if not exists contatto text
    check (contatto is null or (char_length(contatto) <= 200 and contatto ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'));
alter table public.contributi add column if not exists risposto_il timestamptz;

alter table public.riepiloghi add column if not exists contatti_token uuid unique;
update public.riepiloghi set contatti_token = gen_random_uuid() where contatti_token is null;

comment on table public.contributi is
  'Contributi delle edizioni da distribuire: sezione, testo, funzione e livello facoltativi; email facoltativa (contatto), visibile ai membri e al referente col link dei contatti, mai nel riepilogo, cancellata dopo la risposta o a 90 giorni.';

-- La scadenza dei contatti: una funzione sola, chiamata all'invio e alla lettura.
create or replace function public._contatti_scaduti()
returns void language sql volatile security definer set search_path = public as $$
  update public.contributi set contatto = null
   where contatto is not null and ts < now() - interval '90 days';
$$;
revoke all on function public._contatti_scaduti() from public, anon, authenticated;

-- All'inserimento: come 0041, più l'email normalizzata e la data di risposta
-- che non si sceglie da fuori.
create or replace function public.contributi_in_ingresso()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.id := gen_random_uuid();
  new.ts := now();
  new.stato := 'nuovo';
  new.area := null; new.testo_curato := null; new.risposta := null; new.curato_il := null;
  new.risposto_il := null;
  new.contatto := nullif(lower(trim(new.contatto)), '');
  if (select count(*) from public.contributi c where c.progetto = new.progetto and c.ts > now() - interval '10 minutes') >= 20
     or (select count(*) from public.contributi c where c.progetto = new.progetto and c.ts > now() - interval '1 day') >= 200 then
    raise exception 'troppi contributi in poco tempo' using errcode = 'P0001';
  end if;
  perform public._contatti_scaduti();
  return new;
end $$;

-- Alla curatela: come 0041, e l'email si può solo cancellare, mai cambiare.
create or replace function public.contributi_curati()
returns trigger language plpgsql set search_path = public as $$
begin
  new.id := old.id; new.progetto := old.progetto; new.ts := old.ts;
  new.sezione := old.sezione; new.testo := old.testo;
  new.funzione := old.funzione; new.livello := old.livello; new.ok_riepilogo := old.ok_riepilogo;
  if new.contatto is not null then new.contatto := old.contatto; end if;
  if (new.stato, new.area, new.testo_curato, new.risposta)
     is distinct from (old.stato, old.area, old.testo_curato, old.risposta) then
    new.curato_il := now();
  end if;
  return new;
end $$;

-- Il referente, col suo link dei contatti: solo le domande con l'email, non escluse.
create or replace function public.get_contatti(p_token uuid)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  r public.riepiloghi;
begin
  if p_token is null then return null; end if;
  select * into r from public.riepiloghi where contatti_token = p_token;
  if not found then return null; end if;
  perform public._contatti_scaduti();
  return jsonb_build_object(
    'progetto', r.progetto,
    'voci', coalesce((
      select jsonb_agg(jsonb_build_object(
               'ts', c.ts, 'sezione', c.sezione, 'testo', c.testo,
               'funzione', c.funzione, 'livello', c.livello, 'contatto', c.contatto)
             order by c.ts desc)
        from public.contributi c
       where c.progetto = r.progetto and c.contatto is not null and c.stato <> 'escluso'), '[]'::jsonb)
  );
end $$;
revoke all on function public.get_contatti(uuid) from public;
grant execute on function public.get_contatti(uuid) to anon, authenticated;

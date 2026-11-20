-- ── 0041 · I contributi e il riepilogo per la banca (edizione da distribuire, versione B) ──
-- Spec: docs/superpowers/specs/2026-11-19-edizione-lettura-design.md, «Revisione
-- del 19 nov sera» (prevale su §5-§8). Piano: docs/superpowers/plans/
-- 2026-11-19-edizione-lettura-versione-b.md.
--
-- Il modulo è ANONIMO PER COSTRUZIONE: la tabella non ha colonne per nome,
-- contatto, IP, sessione o dispositivo, ed è la ragione per cui non serve
-- un'informativa. Non va allargata senza rifare quella valutazione.
--
-- Chi può che cosa:
--   anon            → inserisce un contributo, solo su un progetto con la raccolta aperta;
--                     legge il riepilogo SOLO col token, già filtrato dalle soglie.
--   membri          → (progetto_membri o super admin) leggono e curano i contributi.
--   chiave d'avviso → legge solo i CONTEGGI dei contributi nuovi (per la notifica).
-- Idempotente: si può rilanciare.

-- ── chi lavora su un progetto ─────────────────────────────────────────
create table if not exists public.progetto_membri (
  progetto  text not null,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  primary key (progetto, user_id)
);
alter table public.progetto_membri enable row level security;

drop policy if exists progetto_membri_select on public.progetto_membri;
create policy progetto_membri_select on public.progetto_membri
  for select to authenticated using (user_id = auth.uid() or public.is_super_admin());
drop policy if exists progetto_membri_super on public.progetto_membri;
create policy progetto_membri_super on public.progetto_membri
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create or replace function public.e_membro(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin()
      or exists (select 1 from public.progetto_membri m where m.progetto = p and m.user_id = auth.uid());
$$;
revoke all on function public.e_membro(text) from public;
grant execute on function public.e_membro(text) to authenticated;

-- ── il riepilogo: una riga per progetto, ed è anche il registro dei progetti
--    che raccolgono contributi ───────────────────────────────────────────
create table if not exists public.riepiloghi (
  progetto      text primary key check (progetto ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  share_token   uuid unique,
  aperto        boolean not null default true,   -- la raccolta accetta contributi
  approvato_il  timestamptz,                     -- il referente l'ha approvato (a voce o per mail)
  creato_il     timestamptz not null default now()
);
alter table public.riepiloghi enable row level security;

drop policy if exists riepiloghi_membri on public.riepiloghi;
create policy riepiloghi_membri on public.riepiloghi
  for select to authenticated using (public.e_membro(progetto));
drop policy if exists riepiloghi_membri_upd on public.riepiloghi;
create policy riepiloghi_membri_upd on public.riepiloghi
  for update to authenticated using (public.e_membro(progetto)) with check (public.e_membro(progetto));
drop policy if exists riepiloghi_super on public.riepiloghi;
create policy riepiloghi_super on public.riepiloghi
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create or replace function public.raccolta_aperta(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.riepiloghi r where r.progetto = p and r.aperto);
$$;
revoke all on function public.raccolta_aperta(text) from public;
grant execute on function public.raccolta_aperta(text) to anon, authenticated;

-- ── i contributi ──────────────────────────────────────────────────────
-- Le chiavi di funzione e livello sono quelle di packages/core/src/utils/contributi.ts.
create table if not exists public.contributi (
  id            uuid primary key default gen_random_uuid(),
  progetto      text not null references public.riepiloghi (progetto) on delete cascade,
  sezione       text not null check (char_length(sezione) between 1 and 160),
  testo         text not null check (char_length(testo) between 3 and 2000),
  funzione      text check (funzione in ('direzione','marketing','dati','tecnologia','digitale','rete','compliance','altro')),
  livello       text check (livello in ('operativo','responsabile','dirigente')),
  ok_riepilogo  boolean not null default false,
  -- curatela (solo membri)
  stato         text not null default 'nuovo' check (stato in ('nuovo','approvato','escluso')),
  area          text check (char_length(area) <= 80),
  testo_curato  text check (char_length(testo_curato) <= 2000),
  risposta      text check (char_length(risposta) <= 3000),
  curato_il     timestamptz,
  ts            timestamptz not null default now()
);
create index if not exists contributi_progetto_ts on public.contributi (progetto, ts desc);

comment on table public.contributi is
  'Contributi anonimi delle edizioni da distribuire: sezione, testo, funzione e livello facoltativi. Nessun dato su chi scrive.';

alter table public.contributi enable row level security;

drop policy if exists contributi_anon_insert on public.contributi;
create policy contributi_anon_insert on public.contributi
  for insert to anon
  with check (public.raccolta_aperta(progetto));

drop policy if exists contributi_membri_select on public.contributi;
create policy contributi_membri_select on public.contributi
  for select to authenticated using (public.e_membro(progetto));
drop policy if exists contributi_membri_update on public.contributi;
create policy contributi_membri_update on public.contributi
  for update to authenticated using (public.e_membro(progetto)) with check (public.e_membro(progetto));
drop policy if exists contributi_membri_delete on public.contributi;
create policy contributi_membri_delete on public.contributi
  for delete to authenticated using (public.e_membro(progetto));

-- All'inserimento: i campi di curatela e l'ora non si scelgono da fuori, e un
-- limite per progetto ferma chi riempie la tabella (senza IP non c'è un limite
-- per mittente: 20 in dieci minuti e 200 al giorno bastano a una banca intera).
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
drop trigger if exists contributi_in_ingresso on public.contributi;
create trigger contributi_in_ingresso before insert on public.contributi
  for each row execute function public.contributi_in_ingresso();

-- Alla curatela: la data serve a sapere se il riepilogo approvato è ancora quello.
-- Il testo di chi ha scritto, la funzione e il livello non si cambiano: si cura
-- in `testo_curato`, così l'originale resta.
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
drop trigger if exists contributi_curati on public.contributi;
create trigger contributi_curati before update on public.contributi
  for each row execute function public.contributi_curati();

-- ── il riepilogo, con le soglie applicate QUI e non nella pagina ──────
-- Regole (spec, revisione del 19 sera):
--  · entra solo ciò che è approvato da noi E che chi ha scritto ha permesso;
--  · accanto a una frase compare solo la funzione, e solo se ha ≥3 contributi
--    nel riepilogo; altrimenti «altre». Senza funzione: «non_indicata»;
--  · il livello non compare MAI accanto a una frase: solo nei conteggi, e un
--    livello sotto 3 si fonde con il vicino;
--  · il riepilogo è «in_preparazione» finché non hanno scritto almeno 3
--    funzioni (non contano «altro» né la funzione non indicata), e allora non
--    restituisce le frasi a chi ha il token;
--  · «approvato» se il referente l'ha approvato e nessun contributo è stato
--    curato dopo; altrimenti «bozza».
create or replace function public._riepilogo(p_progetto text, p_anteprima boolean)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  r public.riepiloghi;
  n_funzioni int;
  stato text;
  liv jsonb := '[]'::jsonb;
  nomi text[];
  conti int[];
  i int;
  j int;
  k int;
  voci jsonb;
  totale int;
begin
  select * into r from public.riepiloghi where progetto = p_progetto;
  if not found then return null; end if;

  create temp table if not exists _rc (funzione text, livello text, area text, testo text, risposta text, sezione text, curato_il timestamptz) on commit drop;
  truncate _rc;
  insert into _rc
    select c.funzione, c.livello, c.area, coalesce(nullif(trim(c.testo_curato), ''), c.testo), c.risposta, c.sezione, c.curato_il
      from public.contributi c
     where c.progetto = p_progetto and c.stato = 'approvato' and c.ok_riepilogo;

  select count(*) into totale from _rc;
  select count(distinct funzione) into n_funzioni from _rc where funzione is not null and funzione <> 'altro';

  if n_funzioni < 3 then stato := 'in_preparazione';
  elsif r.approvato_il is not null and not exists (select 1 from _rc where curato_il > r.approvato_il) then stato := 'approvato';
  else stato := 'bozza';
  end if;

  -- livelli: si parte dai tre, si tolgono i vuoti, e finché un gruppo ha meno
  -- di 3 voci si fonde con il vicino (l'unico ai bordi, il più piccolo in mezzo).
  select array_agg(l order by o), array_agg(n order by o) into nomi, conti
    from (select l, o, (select count(*) from _rc where livello = l)::int as n
            from unnest(array['operativo','responsabile','dirigente']) with ordinality as t(l, o)) s
   where n > 0;
  if conti is not null then
    loop
      exit when array_length(conti, 1) = 1;
      j := null;
      for i in 1 .. array_length(conti, 1) loop
        if conti[i] < 3 and (j is null or conti[i] < conti[j]) then j := i; end if;
      end loop;
      exit when j is null;
      if j = 1 then k := 2;
      elsif j = array_length(conti, 1) then k := j - 1;
      elsif conti[j - 1] <= conti[j + 1] then k := j - 1;
      else k := j + 1;
      end if;
      conti[least(j, k)] := conti[j] + conti[k];
      nomi[least(j, k)] := nomi[least(j, k)] || '+' || nomi[greatest(j, k)];
      conti := conti[1 : greatest(j, k) - 1] || conti[greatest(j, k) + 1 :];
      nomi := nomi[1 : greatest(j, k) - 1] || nomi[greatest(j, k) + 1 :];
    end loop;
    for i in 1 .. array_length(conti, 1) loop
      if conti[i] >= 3 then
        liv := liv || jsonb_build_object('livelli', to_jsonb(string_to_array(nomi[i], '+')), 'n', conti[i]);
      end if;
    end loop;
  end if;

  if stato = 'in_preparazione' and not p_anteprima then
    voci := '[]'::jsonb;
  else
    select coalesce(jsonb_agg(jsonb_build_object(
             'area', coalesce(nullif(trim(x.area), ''), 'Altri spunti'),
             'funzione', x.etichetta,
             'testo', x.testo,
             'risposta', x.risposta,
             'sezione', x.sezione)
             order by coalesce(nullif(trim(x.area), ''), '~'), x.etichetta, x.sezione), '[]'::jsonb)
      into voci
      from (select rc.*,
                   case when rc.funzione is null then 'non_indicata'
                        when rc.funzione <> 'altro' and f.n >= 3 then rc.funzione
                        else 'altre' end as etichetta
              from _rc rc
              left join (select funzione, count(*) n from _rc group by funzione) f using (funzione)) x;
  end if;

  return jsonb_build_object(
    'progetto', r.progetto,
    'stato', stato,
    'aperto', r.aperto,
    'funzioni', n_funzioni,
    'totale', case when stato = 'in_preparazione' and not p_anteprima then null else totale end,
    'funzioni_visibili', case when stato = 'in_preparazione' and not p_anteprima then '[]'::jsonb else
                         (select coalesce(jsonb_agg(funzione order by funzione), '[]'::jsonb)
                            from (select funzione from _rc where funzione is not null and funzione <> 'altro'
                                   group by funzione having count(*) >= 3) v) end,
    'livelli', case when stato = 'in_preparazione' and not p_anteprima then '[]'::jsonb else liv end,
    'voci', voci,
    'approvato_il', r.approvato_il
  );
end $$;
revoke all on function public._riepilogo(text, boolean) from public, anon, authenticated;

-- Chi ha il token (il referente della banca): sola lettura, mai le frasi sotto soglia.
create or replace function public.get_riepilogo(p_token uuid)
returns jsonb language sql volatile security definer set search_path = public as $$
  select public._riepilogo(r.progetto, false)
    from public.riepiloghi r
   where p_token is not null and r.share_token = p_token
   limit 1;
$$;
revoke all on function public.get_riepilogo(uuid) from public;
grant execute on function public.get_riepilogo(uuid) to anon, authenticated;

-- Chi cura (membri): l'anteprima anche sotto soglia, con le stesse etichette.
create or replace function public.riepilogo_anteprima(p_progetto text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
begin
  if not public.e_membro(p_progetto) then raise exception 'non autorizzato' using errcode = '42501'; end if;
  return public._riepilogo(p_progetto, true);
end $$;
revoke all on function public.riepilogo_anteprima(text) from public;
grant execute on function public.riepilogo_anteprima(text) to authenticated;

-- ── l'avviso: solo conteggi, con una chiave dedicata ──────────────────
-- La chiave sta sul Mac dell'owner (~/.config/edf/avviso-contributi), qui
-- solo il suo sha256. Vede quanti contributi nuovi ci sono, non che cosa dicono.
create table if not exists public.chiavi_avviso (
  chiave_sha256 text primary key,
  nota          text,
  creata_il     timestamptz not null default now()
);
alter table public.chiavi_avviso enable row level security;
drop policy if exists chiavi_avviso_super on public.chiavi_avviso;
create policy chiavi_avviso_super on public.chiavi_avviso
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create or replace function public.contributi_avviso(p_chiave text)
returns jsonb language sql stable security definer set search_path = public as $$
  select case when exists (
           select 1 from public.chiavi_avviso k
            where p_chiave is not null and char_length(p_chiave) >= 32
              and k.chiave_sha256 = encode(sha256(convert_to(p_chiave, 'UTF8')), 'hex'))
         then coalesce((select jsonb_agg(jsonb_build_object('progetto', progetto, 'nuovi', n, 'ultimo', ultimo))
                          from (select progetto, count(*)::int n, max(ts) ultimo
                                  from public.contributi where stato = 'nuovo' group by progetto) s), '[]'::jsonb)
         else null end;
$$;
revoke all on function public.contributi_avviso(text) from public;
grant execute on function public.contributi_avviso(text) to anon, authenticated;

-- ── il contatore delle aperture conta anche la versione B ─────────────
drop policy if exists aperture_anon_insert on public.aperture;
create policy aperture_anon_insert on public.aperture
  for insert to anon
  with check (
    progetto in ('intesa-storia', 'intesa-storia-insieme')
    and giorno = current_date
  );
-- I membri leggono le aperture dei loro progetti (prima: ogni authenticated),
-- come i contributi: l'informativa breve dice «il team dell'account».
drop policy if exists aperture_auth_select on public.aperture;
create policy aperture_auth_select on public.aperture
  for select to authenticated using (public.e_membro(progetto));

-- ── la prima istanza: Intesa, versione B ──────────────────────────────
insert into public.riepiloghi (progetto, share_token)
  values ('intesa-storia-insieme', gen_random_uuid())
  on conflict (progetto) do nothing;

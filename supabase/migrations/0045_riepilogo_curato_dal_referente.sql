-- ── 0045 · Il riepilogo lo cura il referente: domande come sono arrivate, e i conteggi ──
-- Panel del 20 nov 2026 (P0) e decisione dell'owner: davanti ai vertici un
-- riepilogo curato dal fornitore si legge come materiale commerciale. Le domande
-- vi entrano come sono arrivate; quella riformulata per non rendere riconoscibile
-- chi l'ha scritta è segnata (`riformulata`). Accanto: quante domande sono
-- arrivate in tutto (escluse quelle scartate come fuori tema) e quante volte il
-- link è stato aperto. La versione finale la approva il referente.
-- Il resto della funzione è identico a 0041 (soglie comprese). Idempotente.

-- La tabella temporanea cambia forma: quella di una sessione precedente va tolta.
drop table if exists pg_temp._rc;

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

  create temp table if not exists _rc (funzione text, livello text, area text, testo text, risposta text, sezione text, curato_il timestamptz, riformulata boolean) on commit drop;
  truncate _rc;
  insert into _rc
    select c.funzione, c.livello, c.area, coalesce(nullif(trim(c.testo_curato), ''), c.testo), c.risposta, c.sezione, c.curato_il,
           nullif(trim(c.testo_curato), '') is not null
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
             'sezione', x.sezione,
             'riformulata', x.riformulata)
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
    'approvato_il', r.approvato_il,
    'arrivate', (select count(*)::int from public.contributi c where c.progetto = p_progetto and c.stato <> 'escluso'),
    'aperture', coalesce((select count(*)::int from public.aperture a where a.progetto = p_progetto), 0)
  );
end $$;
revoke all on function public._riepilogo(text, boolean) from public, anon, authenticated;

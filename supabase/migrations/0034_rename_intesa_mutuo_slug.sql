-- ════════════════════════════════════════════════════════════════════
--  0034 · «intesa-mutuo» diventa «intesa-esperienza-cliente»
--
--  PERCHÉ. Lo slug nasceva quando l'experience raccontava il solo
--  percorso del mutuo. Da quando ha inglobato il deck del 5 novembre
--  copre nove capitoli — posizionamento Adobe, scenario, persona,
--  momenti, circolo, Coworker, referenze, CX Analytics, prossimi passi —
--  e «mutuo» nell'URL faceva sembrare l'intero incontro una storia su un
--  prodotto. Il mutuo resta il filo del racconto di Giulia, che è UNO di
--  quei capitoli.
--
--  PERCHÉ UNA MIGRAZIONE A PARTE e non una modifica alla 0033: la 0033
--  può essere già stata applicata al DB remoto, e in quel caso la riga
--  esiste col vecchio slug. Questa funziona in entrambi i casi — se la
--  0033 gira dopo, inserisce già quello nuovo e qui non c'è niente da
--  rinominare.
--
--  Apply once (human action): supabase db query --linked
-- ════════════════════════════════════════════════════════════════════

update public.experiences
   set slug       = 'intesa-esperienza-cliente',
       name       = 'Adobe × Intesa Sanpaolo',
       base_url   = '/experience-design-factory/intesa-esperienza-cliente/',
       updated_at = now()
 where slug = 'intesa-mutuo'
   and not exists (select 1 from public.experiences where slug = 'intesa-esperienza-cliente');

-- ⚠️ NIENTE DELETE sulla riga vecchia, nemmeno se restasse orfana:
-- `experiences` è referenziata da `user_experience_roles`,
-- `restricted_docs` e `media_configs`. Una migrazione che rinomina non
-- cancella: se per qualche ragione le due righe coesistessero, quella
-- vecchia resta in draft e fuori dallo showcase, e la si toglie a mano
-- dalla Console sapendo che cosa ci pende.

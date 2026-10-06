-- ════════════════════════════════════════════════════════════════════
--  0021 · seed «Dopo la firma» (Intesa Sanpaolo Assicurazioni) nel registry
--
--  Registra la riga `experiences` così che `restricted_docs` possa
--  referenziarla via FK. L'experience NON esiste: oggi `apps/intesa-dopo-la-firma/`
--  pubblica UNA pagina, il dossier interno (orfana, gated, noindex). È quindi
--  seedata come DRAFT e fuori showcase, e deliberatamente assente da hub,
--  showcase e ROUTE_SETS di deck-audit finché non ci sarà un deck da mostrare.
--
--  Entità distinta da `intesa-scala-umana` (0020): quella prepara l'incontro
--  del 22 ottobre con la Divisione Banca dei Territori; questa prepara
--  l'incontro dell'8 ottobre con il COO della capogruppo assicurativa. Stanze
--  diverse, interlocutori diversi, vincoli diversi: non si mescolano.
--
--  `base_url` è il percorso che l'experience AVRÀ. Finché non esiste, quel
--  percorso dà 404 e l'unica pagina viva è `…/intesa-dopo-la-firma/dossier/`.
--
--  Il contenuto del dossier è riservato (persone del cliente, intelligence,
--  dati contrattuali) e vive FUORI da questo repo pubblico:
--  docs/Intesa Sanpaolo/0021_seed_intesa_dopo_la_firma_dossier.sql (git-ignorato).
--  Vedi 0021_intesa_dopo_la_firma_dossier.README.md.
--
--  NOTA su `type`: non impostato di proposito. Il tipo di deliverable è una
--  decisione che segue l'incontro dell'8 ottobre, non da indovinare adesso.
--
--  Idempotente. Da eseguire una volta (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status, show_in_showcase)
values (
  'intesa-dopo-la-firma',
  'Dopo la firma',
  'Intesa Sanpaolo Assicurazioni',
  'Il perimetro che comincia dove finisce la vendita: documenti, sinistri, assistenza. Ridurre il costo di servire senza toccare i sistemi core.',
  '/experience-design-factory/intesa-dopo-la-firma/',
  'draft',
  false
)
on conflict (slug) do update
   set name             = excluded.name,
       client           = excluded.client,
       description      = excluded.description,
       base_url         = excluded.base_url,
       status           = excluded.status,
       show_in_showcase = excluded.show_in_showcase,
       updated_at       = now();

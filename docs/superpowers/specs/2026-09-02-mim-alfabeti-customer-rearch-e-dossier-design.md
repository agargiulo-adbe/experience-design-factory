# Alfabeti (MIM) — customer-facing re-architecture + internal token-gated dossier

**Data:** 2 settembre 2026 · **App:** `apps/mim-alfabeti` · **Base:** `/experience-design-factory/mim-alfabeti/`

## Problema

Il deck live di Alfabeti è, di fatto, il memo go-to-market **interno** di Adobe reso in
slide, non un'esperienza da presentare al cliente. Il contenuto interno è sparso su quasi
tutte le pagine, non solo nella sezione «realtà»:

- `voce` → "Nota onesta — interna: AJO nasce marketing-oriented…"
- `competenze` → chip `INF` nelle fonti ("mappa 1:1 su Priorità 8", "programmi Adobe US-centrici da localizzare")
- `accesso` → framing "riposizionare, non vendere frontalmente", "AEM non vince sul sito base", "ALM mai come erogatore diretto", chip `INF`
- `persone` → "Nota onesta — interna: pledge USA, non auditati"
- `realta` → intera sezione interna (competitor Microsoft/Google, "cose da non dire" con nomi smentiti, chip VER/TBC) — gated da `?s=interno` ma **comunque nel bundle statico pubblico**
- `rotta` → "Quattro mosse" (procurarsi il canale prima di MS/Google), "Chi intercettare" (nomi dirigenti MIM + chip VER/TBC)

## Obiettivo

1. **Ri-architettare** il deck come keynote customer-facing raccontato **al** Ministero: un
   racconto solido, pronto per il cliente, con Adobe rivelata progressivamente e co-brand
   discreto. Nessun contenuto interno residuo.
2. **Creare** `mim-alfabeti/dossier/?t=<TOKEN>` (pattern UniCredit) per uso interno del team
   Adobe, con **tutte** le info utili: la fonte riservata `docs/Ministero dell'Istruzione/
   DOSSIER-MIM-ADOBE.md` + tutto il materiale interno estratto dal deck.
3. **Registrare** `mim-alfabeti` (e `eni-orbita`) nella Super Admin Console.

## A) Deck — nuova architettura (7 route; `realta` eliminata)

Spina dorsale = **B1: la voce del Ministero al suo personale** (idea a minor attrito, già
acquistabile via ACN, spazio non presidiato). Le altre idee la allargano in "un'unica
esperienza istituzionale governata al centro". Ogni slide riscritta dal POV del cliente.

| # | Route | Riscrittura |
|---|---|---|
| 00 | `index` | Il **momento del Ministero** (PNRR/Scuola 4.0/decreto IA/Priorità 8 come opportunità del MIM). Tolta l'allusione ai competitor ("dove altri già corrono"). |
| 01 | `domanda` | Già customer-appropriate; solo polish. Come parla oggi il MIM alle sue persone? 3 processi + 3 domande. |
| 02 | `voce` | Proposta-spina: orchestrare+misurare la comunicazione al personale (AEP/CDP/AJO/CJA), *accanto* a Piattaforma Unica, già acquistabile, esito misurato. **Rimossa** la "Nota onesta — interna". "Perché vince" → "Perché funziona qui" in chiave cliente. |
| 03 | `competenze` | IA sicura (checklist DM 166/2025) + competenze certificate (DigCompEdu/DigComp 3.0) rendicontabili PNRR. **Rimossi** i chip `INF`; fatti verificati preservati. |
| 04 | `accesso` | Riscritta come **valore-per-il-Ministero**: documenti accessibili per obbligo EAA (Acrobat/Sign) + hub centrale governato/DAM/analytics che **completa** gli asset pubblici. **Eliminato** "riposizionare/non vince/mai erogatore diretto" e i chip INF. |
| 05 | `persone` | Adozione (enablement, operating model, certificazione). **Rimossa** la "Nota onesta — interna" sui pledge USA; programmi presentati con misura, senza over-claim. |
| 06 | `rotta` | **Chiusura per il cliente**: un percorso in passi PER il Ministero (parti dove è pronto/acquistabile → costruisci l'evidenza → allarga a IA/competenze, governato al centro) + riga di chiusura. **Eliminata** la slide "Chi intercettare". |

Collaterale: eliminare `realta.astro`; togliere `realta` e la soluzione `interno` da
`AlfabetiNavigation.astro` + `admin.astro` (PAGE_REGISTRY e SOLUTIONS); ricablare il flusso
nav / `prevHref` / `nextHref` (persone → rotta); aggiornare eventuali riferimenti a `realta`
in `deck-audit`/script root.

**Contratto legibilità/audit (BINDING):** type ≥0.95rem body, ink leggibile pieno (no
opacity-dimming), composizione bilanciata; `<T en it>` mantiene SEMPRE entrambe le lingue;
copy 100% umano (no em-dash retorico, no tricolon, no "non solo X ma Y", no value-speak).

## B) Dossier interno — `mim-alfabeti/dossier/?t=<TOKEN>`

- Nuova pagina `apps/mim-alfabeti/src/pages/dossier.astro`, adattata da
  `apps/unicredit-engagement/src/pages/dossier.astro`: stessa logica JS (RLS via login OPPURE
  `?t=<uuid>` senza login via RPC `get_shared_doc`), ristilizzata sulla palette Alfabeti
  (carta/blu/blu-notte, Titillium+Inter), **prefisso classi `.mim-*`** (evita clash; stili
  `is:global` perché il contenuto è iniettato via JS). Pagina **orfana** (non in nav) +
  **noindex**. Bilingue IT/EN + PDF (window.print). Link "Deck →".
- Il contenuto riservato **non entra nel bundle statico**: vive solo in Supabase
  (`restricted_docs`, RLS). `?t=` default lingua EN (colleghi internazionali); `?lang=` vince.
- BaseLayout MIM: aggiungere supporto `noindex` se assente.

### Contenuto (JSON bilingue) — da `DOSSIER-MIM-ADOBE.md` + estratti dal deck
Sezioni: 01 Tesi · 02 Fatti che cambiano la conversazione (PNRR, quadri UE, finestra IA 2026,
procurement art.68/ACN/Consip, precedenti competitivi Microsoft/Google/Modello Scuole/
Unica/SEND/S.O.F.I.A.) · 03 Big idea Blocco A (A1 IA-safe, A2 competenze, A3 Aula 4.0, A4
accessibilità) · 04 Big idea Blocco B (B1 comunicazione personale ⭐, B2 AEM riposizionare,
B3 ALM via indiretta, B4 content factory, B5 identità visiva) · 05 Interlocutori (mappa
persone con ruoli/priorità sugli organi pubblici del MIM — DGSIS, Dip. risorse umane,
Unità di Missione PNRR, Dip. sistema educativo, INDIRE, INVALSI, dirigenza/ANP) · 06 Partner
· 07 Sequenza d'ingaggio · 08 Rischi e cautele · 09 Open question [TBC] · 10 Cose da NON dire
(claim con nomi/ruoli errati da non riusare) · 11 Update 3° ciclo (AEM qualificato ACN,
stack B1 tutto Livello 1, ALM sotto ente qualificato, veicoli Consip) · 12 Fonti.
Caveat estratti dal deck (AJO marketing-born, pledge USA non auditati, riposizionamenti
AEM/LMS) integrati nelle rispettive sezioni.

## C) Supabase / Console

- `supabase/migrations/0010_seed_mim.sql` — insert idempotente in `public.experiences` di
  `mim-alfabeti` (name "Alfabeti", client "Ministero dell'Istruzione e del Merito", status
  live, base_url `/experience-design-factory/mim-alfabeti/`) **e** `eni-orbita` (name
  "Orbita", client "Eni", status live). Sblocca il vincolo FK del dossier e fa comparire le
  card in `/console/`.
- **Seed dossier (RISERVATO, fuori dal repo pubblico):** l'insert del `restricted_doc`
  slug `mim-adobe` (content jsonb bilingue completo) + il conio dello `share_token` vivono
  in `docs/Ministero dell'Istruzione/0011_seed_mim_dossier.sql` — cartella **git-ignored**,
  come `DOSSIER-MIM-ADOBE.md`. **NON** va in `supabase/migrations/` (repo pubblico): quel
  file contiene nomi/telefoni di funzionari, «cose da non dire» e intelligence competitiva.
  Una nota tracciata (`supabase/migrations/0011_mim_dossier.README.md`) spiega dov'è.
- Applicare al DB remoto: `supabase db query --linked -f <file>`; `0010` è tracciato,
  `0011` privato. Recuperare lo `share_token` per l'URL `?t=…`.

## D) Verifica (criteri di fine)

1. `pnpm --filter mim-alfabeti build` verde.
2. `audit:deck` **0 hard** su 1920/1440/1280 contro **preview statico** (build → preview →
   `DECK_URL=… audit:deck`).
3. Screenshot 1920 di ogni slide cambiata → **letto** (type generoso, fill bilanciato).
4. Grep di sicurezza sul bundle deck: nessuna occorrenza di contenuto interno
   (marker `intern`/`non dire`/`intercett`/`riposizion`, caveat prodotto, nomi competitor
   e nomi/ruoli smentiti — la lista completa dei termini vive nella nota privata del seed).
5. Dossier via `?t=<token>` in browser: render IT/EN, tutte le sezioni + estratti presenti,
   PDF, link "Deck →".
6. Commit (conventional) + push su `main`.

## Non-obiettivi (YAGNI)
- Nessun redesign dei token/palette Alfabeti.
- Nessuna modifica al motore Admin condiviso o ad altre experience.
- Nessun dato contrattuale/economico nel bundle statico (né deck né dossier).

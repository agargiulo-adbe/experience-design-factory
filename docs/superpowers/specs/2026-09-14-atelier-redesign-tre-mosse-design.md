# Experience Atelier — redesign sulle tre mosse

**Date:** 2026-09-14 · **App:** `apps/atelier` (`/atelier/`) + `packages/core` + nuovo `packages/mcp-atelier` · **Status:** spec in review

## Goal
Rifare la **tesi** del deck, non le slide: da «una fabbrica di pitch da scalare a cinquanta
venditori» a «ogni opportunità ha la sua esperienza, viva fra i meeting, misurata,
distribuita dove stanno i venditori, conforme per costruzione». Base: la critica con fonti
`docs/superpowers/research/2026-09-14-atelier-ambition-critique.md` (fatti datati; lista
refuted del 17 lug ancora vincolante). Il deck resta trilingue EN/IT/FR, con sponsor cut, sullo
stesso motore e sullo stesso sistema visivo (loom, `.atl-*`), e con **due prove funzionanti**
dentro, così le mosse si leggono «esiste già», non «faremo».

## Decisioni (approvate dall'owner, 14 set)
1. **Boardroom Quest → «La simulazione»**, versione più ambiziosa: non un teaser pixel-art ma
   la superficie d'acquisto che diventa gioco — il funnel reale del cliente come stato del
   tavolo, ogni executive una divisione sul proprio device, un facilitatore AI, i prodotti
   Adobe come strumenti che sbloccano, artefatto finale = roadmap costificata. Dentro la
   Mossa 1, gated (`simulation`), con fasi nel piano; fuori dalle richieste economiche.
2. **Calendario:** decisione **entro il 31 ottobre 2026**; **M1 fine gennaio 2027**
   («Fondamenta», pilota 12 settimane da inizio novembre) · **M2 Adobe Summit, Las Vegas,
   22–25 marzo 2027** (data da fonte aggregatore: confermare su summit.adobe.com prima
   della presentazione) · **M3 fine giugno 2027**. Otto mesi, non nove.
3. **Prove funzionanti nel deck:** (a) **telemetria** dell'Atelier stesso, resa in una slide;
   (b) **MCP server `atelier`** con tre tool, usabile da Claude, con la trascrizione reale
   in una slide. Stima 2–3 giorni oltre al deck.

## Approcci valutati
- **A — Riscrivere la narrativa, tenere lo scheletro** (scelto): stessi 7 capitoli + Overture,
  stesso template di cover e sistema loom; due capitoli cambiano nome e contenuto
  (`multiplication` → `gap`, `frontiers` → `moves`); ~14 slide nuove o riscritte; 2 slide di
  prova. Tiene i capitoli che portano credibilità (metodo, capability).
- B — Ricostruire tutto intorno alle tre mosse (ogni mossa = capitolo problema/prova/piano):
  più radicale, perde la spina «come è stato costruito», 1,5× lo sforzo. Scartato.
- C — Patch minima (fatti + una slide «gap» + una «mosse»): tiene una tesi sbagliata. Scartato.

## 1. Struttura — Overture + 7 capitoli (slug · slide id · gating)
Il taglio sponsor (`?s=asks`) resta: `detail` marca cover e slide di approfondimento; il
taglio pieno è `?s=asks,simulation,detail`. Nav, `SECTION_FLOW`, `ROUTE_SETS`
(`scripts/deck-audit.ts`), `PAGE_REGISTRY` e `SOLUTIONS` di `admin.astro` si aggiornano
insieme. I vecchi slug `multiplication/` e `frontiers/` restano come **pagine di redirect**
(meta refresh + link) per i link già girati.

**0 · Overture** (`/`) — `slide-cover` (invariata: 8 experience, clip Firefly) ·
`slide-wall` (invariata) · `slide-thesis` (`detail`, **riscritta**): «Every opportunity
deserves its own experience: alive between meetings, measured, made with the products it
sells. One person working with AI has shown it eight times in three months. This plan makes
it an Adobe capability.»

**01 · The method** (`/method/`) — cover · genesis · method · compliance: **una riga
cambia** nel pannello «AI as a process rule» → «and AI Act art. 50 in force since 2 Aug
2026: every generated asset carries its record» con stato onesto (oggi credito + provenance;
record esportabile a M1). Niente altro.

**02 · The capability** (`/capability/`) — cover · `slide-anatomy` (**fondazioni**: il
terzo pannello «Build chain» resta, il primo diventa «Agent Skills + MCP: the engine is
callable from Claude, Copilot and ChatGPT» — vero solo dopo la prova (b), altrimenti
«Admin Console») · `slide-adobe-stack` (+ una riga Custom Models: «a private model per
client brand, ~1 h of training» — beta pubblica, dicitura «beta») · `slide-toggle-demo` ·
`slide-console` · **NUOVA `slide-proof-telemetry`** «This deck is watching itself»: numeri
live dell'Atelier (slide più viste, sessioni, tempo mediano, per taglio sponsor/pieno e per
lingua), resi a runtime da una view Supabase, fail-closed («—» senza rete) · **NUOVA
`slide-proof-mcp`** «The engine, from inside Claude»: trascrizione reale di una sessione
(tre tool chiamati, con risposta) resa in un pannello `.uc-shot`-like, più la riga di
installazione. Le due prove portano il kicker «v0 · built in N days», con N vero.

**03 · The gap** (`/gap/`, sostituisce The multiplication) — cover (`detail`) «What buyers
want now» · `slide-buyers`: 67% preferisce senza venditore e 70% self-service (Gartner, mar
2026), rapporto ricerca/contatto 60/40 (6sense, nov 2025), «their demo blew us away» 13→18%
(TrustRadius, lug 2026), **69% valida l'AI con un umano** (Gartner, mag 2026) — quattro
pannelli, fonte con data su ognuno · `slide-market` (`detail`): la categoria è convergita sul
deal workspace con agente e telemetria — Consensus+Peel+Saleo (giu 2026), Seismic–Highspot
(ago 2026), Aligned 60 M$ (lug 2026), Mutiny (apr 2026); «all of them ship engagement
analytics and an AI rep; none ships a bespoke, brand-exact experience» · `slide-adobe`:
la mossa di Adobe — CX Enterprise, Agent Skills Catalog, endpoint MCP, Marketing Agent
dentro Copilot/Claude/ChatGPT/Gemini, connettore «Adobe for creativity» in Claude (con cui la
Factory è costruita); chiusa da «We build in Adobe's grain, and this deck is the proof» ·
`slide-precedent` (`detail`): Moderna 3.000+ GPT (2025), JPMorgan 230.000 con assistenti
configurati (mar 2026), Cisco 90.000, Atos 19.000 agenti; **e** MIT NANDA 95% a ritorno
zero (lug 2025) — «the ones who got value industrialised a pattern; a pilot is not a
programme». Vietati: benchmark BDR/SDR, Walnut, «30% delle interazioni», Accenture
trimestrale.

**04 · The three moves** (`/moves/`, sostituisce New frontiers) — cover (`detail`) «Three
moves» · `slide-move-1` «From pitch to buying surface»: telemetria per slide e stakeholder,
link gated per pubblico (esiste), **agente rivolto al buyer ancorato solo a quella build**
(Brand Concierge / CX Enterprise Coworker: Adobe customer zero), engagement all'account team;
mock UI: la stessa esperienza con il pannello dell'agente e la timeline di engagement ·
`slide-move-2` «An experience per opportunity in 24 hours, where sellers already are»:
`brand:tokens` + intake + Firefly (Custom Model per cliente) + motore = pipeline; Atelier
come **MCP server + Agent Skills**; **MCP Apps**: scoping e configurazione dentro
l'assistente del cliente; media: «images live, video pre-warmed» (mai «video in sala») ·
`slide-move-3` «Provenance as compliance»: C2PA preservato nella pipeline, record art. 50
esportabile, credito per slide; onestà: Adobe firma sull'Interim Trust List · **`slide-
simulation`** (`simulation`) «The simulation»: la superficie d'acquisto diventa gioco — stato
del tavolo = funnel reale del cliente (dal modello di scoping già nel motore), ogni executive
una divisione sul proprio device, facilitatore AI, prodotti Adobe come strumenti che
sbloccano, artefatto = roadmap costificata; precedente SAP citato come formato, con la
frase «the format is SAP's since 2018; what is ours is what the board is made of»; niente
pixel-art, un mock UI del tavolo con dati di esempio etichettati.

**05 · The plan** (`/plan/`) — cover «Eight months, three milestones» (nov 2026 → giu 2027)
· `slide-roadmap` Gantt riscritto, sei corsie: **Trust & compliance** (M1: telemetria, record
art. 50, C2PA preservato, seed riservati fuori dal repo; M3: auth Enterprise-Managed via MCP)
· **Buying surface** (M1: telemetria live su 3 experience; M2: agente buyer su 3 experience;
M3: su tutte) · **Distribution** (M1: MCP server v1 + 3 Agent Skills; M2: nel catalogo Adobe,
MCP Apps per scoping; M3: pipeline «24 h») · **Enablement** (5–10 → 25–40 → 100+, EMEA con
traduzione dal vivo) · **Ecosystem** (M2: 2–3 partner; M3: lighthouse) · **Simulation**
(gated: M1 skeleton multiplayer, M2 beta facilitata, M3 secondo settore) · `slide-m1/m2/m3`
(`detail`) riscritte di conseguenza · `slide-kpi` + `slide-kpi-2`: famiglie **Buying surface**
(pipeline influenzata **misurata**; % esperienze riaperte dal cliente dopo il meeting;
domande gestite dall'agente), **Speed** (brief → esperienza: <1 settimana → <2 giorni → <24
h), **Trust** (incidenti art. 50 = 0; file spediti con C2PA 0% → 100%; auth), **People &
ecosystem** (abilitati, co-firmate, lighthouse). Owner per famiglia.

**06 · What it takes** (`/asks/`, `asks`) — cover · `slide-resources` (4 barre invariate; la
conformità sta in «Sponsored time») · `slide-sponsor` «What we ask you to decide», tre
card: (1) sì al pilota — 5–10 venditori, 12 settimane da novembre, M1 fine gennaio,
dotazione come da Annex A; (2) sponsor a livello leadership — 30'/mese + autorità su coorte e
partner; (3) **allineamento customer-zero con l'organizzazione CX Enterprise** — Brand
Concierge/Coworker sulle esperienze, e un posto nell'Agent Skills Catalog. «Decision
requested by 31 October 2026.»

**07 · Closing** (`/closing/`) — `slide-thesis` recap a quattro righe (01 · 02 · 04 · 05) ·
`slide-next` «Green-light the pilot» + link (pieno / sponsor).

Conteggio: 3 + 4 + 7 + 5 + 5 + 7 + 3 + 2 = **36 slide**; sponsor cut ≈ 16.

## 2. Prova (a) — telemetria del deck
- **Core:** `packages/core/src/blocks/immersive/DeckTelemetry.astro`, montato **una volta** nel
  BaseLayout dell'app che opta (prop `telemetry` con URL/chiave Supabase); ascolta
  `deck:change` e `visibilitychange`, invia `{project, route, slide_id, slide_index, cut,
  lang, session_id, dwell_ms, ts}` con `navigator.sendBeacon` alla REST di Supabase.
  `session_id` casuale per scheda in `sessionStorage`; **nessun dato personale**, nessun
  cookie; disattivato se `?telemetry=0` o `edf:telemetry=off` in localStorage; il presenter
  può escludersi con un flag in Console (fuori scope qui: basta il flag localStorage).
- **DB:** migrazione `0014_deck_events.sql`: tabella `deck_events` (RLS: `anon` INSERT
  only), view `deck_slide_stats` (project, route, slide_id, cut, lang → views, sessioni
  uniche, dwell mediano) esposta in **SELECT ad `anon` solo per `project = 'atelier'`**;
  per le altre experience le statistiche restano leggibili solo da `authenticated`
  (futuro tab della Console, fuori scope).
- **Slide:** `slide-proof-telemetry` legge la view a runtime, fail-closed. Nota di
  copertina: «This deck measures itself, anonymously.»
- **Perché è un fatto e non una promessa:** i numeri sulla slide sono quelli del deck che
  la sala sta guardando.

## 3. Prova (b) — MCP server `atelier`
- **Pacchetto:** `packages/mcp-atelier` (TypeScript, `@modelcontextprotocol/sdk`, trasporto
  stdio; HTTP streamable come opzione futura). Tre tool:
  `list_experiences()` → dal registry generato a build (`experiences.ts` + `PAGE_REGISTRY`
  di ogni app: nome, cliente, lingue, capitoli, URL live);
  `open_experience({slug, cut?, lang?})` → URL con `?s=` e `?lang=` (il core impara
  `?lang=` nell'init anti-flash, un rigo);
  `brand_tokens({url})` → riusa `scripts/brand-tokens.ts` estratto in `scripts/lib/brand-
  tokens.ts` (evidenza: colori per frequenza, custom property, font).
- **Installazione:** `claude mcp add atelier -- node packages/mcp-atelier/dist/index.js`;
  README con i tre esempi. La slide mostra una trascrizione **reale** (testo, non
  screenshot inventato) catturata una volta e versionata in `src/data/mcp-transcript.ts`.
- **Agent Skills:** tre file `SKILL.md` (`experience-brief` esiste; nuovi `brand-tokens` e
  `open-experience`) — il «catalogo» a M2 è una richiesta, non parte della prova.

## 4. Copy e fatti
- Voce umana (regola de-AI), ±10% di lunghezza dove la slide esiste già; **ogni numero con
  fonte e data sulla slide**; lista refuted rispettata; niente cifre € sulle richieste.
- Nomi prodotto 2026: CX Enterprise, CX Enterprise Coworker, Brand Concierge, Agent
  Orchestrator, Agent Skills, Adobe Brand Visibility, GenStudio for Performance Marketing,
  Real-Time CDP Collaboration, Customer Journey Analytics, Firefly Custom Models, Firefly
  Foundry. **Propagazione** «Experience Cloud» → CX Enterprise nei 6 file fuori Atelier
  (UniCredit, Agos, Console) nello stesso ciclo, con build+audit per app.
- Nessuna rivendicazione «file firmato C2PA» finché la pipeline non preserva il manifest;
  nessun «bollino IA» italiano.

## 5. Asset
Cover invariata. Nuovi backdrop Firefly (stesso manifest, slot `art` su carbone+champagne)
per le cover di `gap` e `moves`; mock UI (agente buyer, tavolo della simulazione,
trascrizione MCP) in CSS con i token del deck, mai screenshot finti di prodotto Adobe.
`MadeWith` per slide dove c'è un asset Firefly.

## 6. Verifica (gate obbligatori)
`pnpm build` tutte le app; `typecheck` e `lint` 0 errori; `content-audit` PASS;
`audit:deck` atelier **0 HARD** su 8 rotte × 3 viewport in EN **e** FR (le prove hanno
contenuto dinamico: la slide telemetria si audita con dati mock via `?telemetry=mock`);
screenshot 1920 letti di ogni slide nuova in EN e FR; test end-to-end della telemetria
(evento scritto, view aggiornata) e del MCP server (tre tool da Claude Code); redirect dei
vecchi slug verificati; handover §21 + memoria aggiornati.

## 7. Fuori scope
Agente buyer reale sulle esperienze (M2 del piano); MCP Apps; pipeline C2PA preservata e
record art. 50 (M1 del piano; qui solo la tesi); tab Telemetria nella Console; simulazione
giocabile; pubblicazione nell'Agent Skills Catalog; ridatare gli altri deck.

## 8. Rischi
- Le prove devono restare **v0 oneste**: se la telemetria mostra 40 sessioni, la slide
  dice 40. Niente numeri gonfiati.
- `?lang=` nel core tocca tutte le app: retrocompatibile (solo lettura del parametro).
- Data Summit 2027 da confermare; se cambia, cambiano Gantt, M2, KPI, admin labels.

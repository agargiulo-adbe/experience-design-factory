# Handover — Parte 5 di 15
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 12. Puntatori

- `CLAUDE.md` — guida agente + Quality Bar + contratto deck + aesthetics per esperienza.
- `docs/new-client-in-30-min.md` — creare una nuova esperienza + gotchas (Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, chiavi TS con trattino, translucency in CSS raw).
- `docs/AUDIT.md` — diagnosi (Fase 1) di Max Mara Acquisizione.
- `docs/storyboard.md` — storyboard.
- `skills/experience-brief/` — skill di intake (SKILL.md + INSTALL.md); `skills/experience-design/SKILL.md` — skill di costruzione.
- `.claude/commands/handover.md` (di progetto, versionato) **+ `~/.claude/commands/handover.md` (user-level → tutte le sessioni/progetti)** — comando **`/handover`**: aggiorna questo doc in modalità dettagliata, impone il contratto di dimensione (≤1500 righe / ≤48KB / riga ≤1800 char), splitta per sezione in `HANDOVER-NN.md` con questo file come manifest, e **verifica con una Read completa** che una nuova sessione riesca a leggere tutto. `/handover check` = solo misura+verifica. Frontmatter con stringhe quotate (vedi §17.5). Spec: `docs/superpowers/specs/2026-07-15-handover-command-design.md`.
- Memorie (`~/.claude/projects/.../memory/`): `factory-showcase-site` (la vetrina + gotcha Astro), `unicredit-personas-credibility` (il riferimento più aggiornato per UniCredit), `deck-responsive-fullscreen`, `mockup-navigation-patterns`, `custom-slides-authoring`, `super-admin-console`, `ferrari-racing-experience`, `round-2-status`.

---
## 13. Factory Showcase — sito vetrina (iperdettaglio)

`apps/factory-showcase` · **live**: `https://agargiulo-adbe.github.io/experience-design-factory/showcase/`.
**Scopo**: presentare la Experience Design Factory a **leadership e colleghi Adobe** (valorizzare il lavoro di Antonio + visibilità internazionale). **Pubblico misto** (leadership strategica + practitioner/eng). `<meta robots="noindex">` (uso interno).

### 13.1 Formato & stack
- **Scroll-site, NON un deck** (nessun `DeckContainer`/`audit:deck`). Astro 6 statico, Tailwind v4, `trailingSlash:'always'`, `base = /experience-design-factory/showcase`.
- Riusa dal core **solo** `blocks/i18n/T.astro`, `LangToggle.astro`, `utils/url.ts` (`href`). Nessuna dipendenza da deck/admin/supabase.
- **Token contract proprio** in `src/styles/global.css` (mantiene i nomi semantici del core così `T`/`LangToggle` funzionano): accent = **Adobe red `#EB1000`**, gradiente firma `--grad-adobe` (rosso→magenta `#E1077B`→violet `#6236FF`); font Inter (display+body) + Source Serif 4 (accenti corsivi); mono di sistema.
- **Bilingue EN default + toggle IT** (via `T`/`LangToggle`, anti-flash init in `BaseLayout`). *Tutto* il testo è EN+IT reale.
- **2 pagine**: `src/pages/index.astro` (la narrativa) e `src/pages/blueprint.astro` (deep-dive tecnico). Componenti: `layouts/BaseLayout.astro`, `components/SiteNav.astro`, `components/SiteFooter.astro`.

### 13.2 Struttura `index` (ordine sezioni) + comportamenti
Hero → **what** → **why** → **proof** → **results** (dal 1 ott) → **architecture** → **firefly** → **flow** → **skill** → **maintain** (dal 1 ott) → **dossier** → **grow** (roadmap) → **author**. Nav sticky con anchor + **scrollspy** + **barra di progresso** (gradiente, in `SiteNav`). `blueprint.astro`: TOC sticky + **12 sezioni** + elenco dei **12 check** (`a b c d e g h i j k m` + `exp` — 11 dopo la correzione del 10 set, **12 dal 12 set** con l'aggiunta di `m`).
- **Hero**: gradiente animato (`heroDrift`, reduced-motion off), 4 **KPI** con count-up (`[data-count]`), CTA **primaria "Guardalo dal vivo"** (`#proof`), **secondaria "Ottieni la skill"** (dot verde → `#skill`), link testuale al blueprint.
- **Proof**: 3 card con **screenshot reali** delle esperienze live (badge "LIVE" pulsante) + strip Console.
- **Motion**: reveal-on-scroll (`[data-reveal]` + IntersectionObserver in `BaseLayout`), count-up, progress bar, copy-to-clipboard — **tutti reduced-motion safe**.

### 13.3 Decisioni di contenuto (LOCKED — non regredire)
- **Autore = Antonio Gargiulo** (NON "Argiulo"), titolo **"Solution Sales Specialist · Adobe Italia"** — ⚠️ **corretto il 1 ott dal panel**: era «Senior Product Sales Specialist», ma l'unica fonte pubblica (adobe.com) dice «Solution Sales Specialist», ed è il primo dato che un manager verifica. Contatto = **deep-link Teams** `https://teams.microsoft.com/l/chat/0/0?users=agargiulo@adobe.com` (CTA "Scrivimi su Teams"). Coerente con email `agargiulo@adobe.com`.
- **Reframe tempo (importante)**: il "~1h / < 1h" è **solo lo step di scaffold del motore**, non l'intera esperienza. Headline flusso **"Il pensiero è tuo. L'ora è del motore."**; ogni step del flusso ha un **tag actor** (Adobian ×4 · Il motore ×1 · KB Factory ×1) per **valorizzare il lavoro dell'Adobian** (ricerca/concezione) e l'ottimizzazione a valle. KPI hero = *"dal brief a una build funzionante"*. **Non trivializzare il lavoro umano.**
- ⚠️ **SUPERATA dal panel (1 ott, P0)** — la nota diceva che la KB vive «solo sul computer di Antonio, **mai** su sistemi terzi/cloud». L'assoluto è **falso**: il testo dei dossier sta in Supabase (`restricted_docs`) e il flusso passa per assistenti AI. Formulazione corrente: «non pubblicata né versionata nel repo; oggi è sulla macchina di lavoro dell'autore, **in migrazione** verso uno spazio Adobe con accesso controllato», e per il dossier «servito da Supabase dietro RLS e token, mai indicizzato». **Non reintrodurre «mai su alcun sistema terzo».**
- ⚠️ **SUPERATA dal panel (1 ott, P0)** — il box «Da segnalare» rivendicava «nessuna licenza aggiuntiva» e «né bloccate né precluse»: è un claim di conformità **non firmato da nessuno** (Firefly Services richiede Developer Console, OAuth S2S e crediti; Copilot richiede la licenza della tenant). Sostituito da un elenco secco **«Cosa serve»** + «Revisione Security/Legal Adobe: in attesa». **Non reintrodurre «nessuna licenza aggiuntiva»**, né nello showcase né in `skills/experience-brief/`.
- **KPI "12"** = i check del contratto deck (`a b c d e g h i j k m` + `exp`); etichetta precisa *"controlli di layout e accessibilità, per slide"*, **linkata a `blueprint#deck`** (verificabile, no overselling). Era «12 (a–l)» fino al 10 set — numero giusto, lettere sbagliate → corretto a 11; tornato a **12** il 12 set con `m`, questa volta perché il check esiste davvero.
- **Roadmap**: Firefly (imagery/video) è **"In valutazione"**; la skill di intake è **"Disponibile"**. Griglia **simmetrica 3×2**.
- **Mark distintivo**: chip gradiente + **due piani (core+skin)** — NON la "A" Adobe (leggeva come logo Adobe rotto). In `public/favicon.svg` + SVG inline in `SiteNav`/`SiteFooter` (id gradiente distinti: `edf-fav`/`edf-grad-nav`/`edf-grad-foot`).

### 13.4 La skill di intake (`experience-brief`)
- **Source of truth**: `skills/experience-brief/` → `SKILL.md` (frontmatter + istruzioni: intervista guidata che ricerca il brand e produce il **brief iperdettagliato**) + `INSTALL.md` (Claude / ChatGPT Custom GPT / Microsoft Copilot).
- **Delivery (dall'8 set)**: `SKILL.md` ha una sezione **«Delivery — the brief becomes a live internal dossier, not a doc»**: il brief sorgente semina **due** cose — l'esperienza live **e** il suo **dossier war-room interno** (pagina `noindex`, solo Adobe). Quando l'ask è un **dossier**, il deliverable è **sempre** quella pagina web (convenzione §10, memoria `dossier-as-internal-web-page`). Il fineprint `#skill` del showcase lo cita (IT/EN). Le copie pubblicate sono state rigenerate di conseguenza.
- **Copie servite** per il sito in `apps/factory-showcase/public/skill/`: `experience-brief-SKILL.md`, `experience-brief-INSTALL.md`, `experience-brief-skill.zip`. La sezione **Skill** offre **Download (.zip)**, **Copia istruzioni** (fetch della `SKILL.md` + strip frontmatter → clipboard) e **Vedi su GitHub**.
- ⚠️ **Sync manuale**: se cambi `skills/experience-brief/`, ri-copia in `public/skill/` e rigenera lo zip: `cp skills/experience-brief/*.md apps/factory-showcase/public/skill/` (rinominando con prefisso `experience-brief-`) e `(cd skills && zip -qr ../apps/factory-showcase/public/skill/experience-brief-skill.zip experience-brief)`.

### 13.6 Pubblicazione dal Super Admin + sezioni Firefly/dossier + blueprint riallineato (2026-09-10, `26252df`)
- **Cosa mostrare lo decide un toggle**, non il codice: colonna `experiences.show_in_showcase` (migrazione **`0013_showcase_publish.sql`**, già applicata al DB remoto) e una **policy RLS per il ruolo `anon` che espone SOLO le righe pubblicate** — verificato con la chiave anon: `select` → **5 righe su 10**. Una experience depubblicata è invisibile all'anonimo quanto se non esistesse. Il toggle è in `apps/console/src/pages/index.astro` (solo super admin) e scrive via PATCH.
- **Runtime fail-closed**: `/showcase/` renderizza il set `defaultPublished` di `src/data/experiences.ts` e lo corregge con lo stato remoto. Senza chiavi, senza rete o con risposta vuota **non tocca nulla** → un guasto non può far ricomparire ciò che era stato depubblicato. Provato E2E: accendendo Atelier nel DB la vetrina passa a 6 schede, 6 skin nel diagramma e «Six/Sei» nella prosa; spegnendolo torna a 5. **Nessun rebuild.** Gotcha: il contatore animato marca `data-counted` e riscrive il testo → dopo un aggiornamento remoto va rimosso l'attributo e ri-animato (`window.__edfCountUp`).
- **Registry ampliato a 10** (aggiunte atelier, eni-orbita, mim-alfabeti, isybank-momento, aperture-email; **spente** di default perché nate da materiale di preparazione riservato) con `sections` = **capitoli navigabili contati sulle rotte reali**, non stimati. Corretti dati vecchi: UniCredit aveva ancora `accent:#BE2027` e 11 sezioni (ora 6+chiusura). Screenshot nuovi per le 4 aggiunte e per UniCredit. Mancavano anche le righe di **Agos** e **Aperture** nella tabella `experiences`: aggiunte dalla `0013`.
- **Due sezioni nuove** (anche in `SiteNav`): **Firefly** — le API dette per nome: `POST /v3/images/generate` (Image Model: `contentClass`, negative prompt, seed), `POST /v3/videos/generate` (Video Model, job asincrono con polling), IMS `token/v3` `client_credentials`; sulle Content Credentials si dice che **Firefly le appone**, non che noi le verifichiamo (`contentCredentials:true` è hardcoded nel nostro lib, non letto dalla risposta). **Dossier** — **solo il metodo** (pagina e non PDF, chiusa per costruzione, come raddrizza il brief): nessun link, nessun nome cliente (decisione dell'owner).
- **Blueprint riallineato al reale**: albero del repo (12 app, `factory-hub` = radice, `scripts/`, `skills/`), meccanismi di runtime 3→**4**, delivery reale, governance col toggle, e soprattutto **il numero dei check**: «12 punti, a–l» non è mai esistito → **11** (`a b c d e g h i j k` + `exp`). La stessa correzione è stata portata in `CLAUDE.md` e nell'header di `scripts/deck-audit.ts`, che erano la **sorgente** dell'errore. Gli swatch del blueprint ora derivano da `DEFAULT_PUBLISHED`, così un brand depubblicato non compare su una pagina pubblica.
- ⚠️ La vetrina ora dipende da `PUBLIC_SUPABASE_URL`/`ANON_KEY` **a build time**: negli Actions secrets ci sono, ma una build locale senza `.env` resta (correttamente) sul set di default e il toggle sembrerà inerte.

### 13.5 Asset & gotcha
- **Screenshot proof** in `public/shots/*.webp` (1200×750; dal 10 set anche `eni`, `mim`, `isybank`, `aperture`, e `unicredit` rifatto dopo il cambio di pelle). Rigenerazione: playwright naviga gli URL **live** delle esperienze → sharp `resize(1200,750, fit:cover, top)` → webp q82. (Script usa-e-getta dalla root; `playwright` + `sharp` sono già devDep.)
- **Committare** `public/shots/*` e `public/skill/*` (serviti staticamente; NON gitignored). `dist/` è gitignored.
- **Gotcha Astro (CRITICO, riusabile)**: le classi passate al componente **`<T>`** (child) **NON ricevono gli stili *scoped*** della pagina (l'elemento reso da `T` non ha l'attributo di scope). Fix: usare **`:global(.classe)`** oppure **wrappare `<T>` in un elemento nativo** con la classe. Ha rotto titolo hero + molti paragrafi finché non corretto. Vale per qualunque componente che renda markup proprio.

---
### 13.7 Blocco API, architettura con la catena di build, griglie bilanciate (2026-09-12)

**Le griglie.** Le experience stavano su righe sbilanciate (4+1 desktop, 2+2+1 tablet). La causa
non era la griglia: **quante card sono visibili lo decide la Console a runtime**, quindi qualunque
numero fisso di colonne prima o poi lascia una riga orfana. Ora le colonne le sceglie uno script
sulle card **davvero visibili** — preferisce righe tutte piene e non lascia **mai** una card sola in
ultima riga — e il flex con `justify-content:center` centra comunque il resto. Misurato a sei
viewport: **ogni riga a 0px di scarto dal centro**, mobile compreso. Stesso trattamento alla riga
skin del diagramma di architettura, che aveva lo stesso difetto (4+2 → 3+3).

**Il blocco API.** Elencava **3 API su 9**. Ora è l'inventario completo (Firefly Image, Firefly
Video, Remove Background, Photoshop, Lightroom, Substance 3D, InDesign, Illustrator, IMS) con
**l'uso concreto di ognuna dentro un'experience**, non una descrizione di prodotto. Tolti i chip
«in produzione / credenziale attiva»: dividere in serie A e serie B ciò che è tutto ugualmente
disponibile non valorizza niente. Trattamento visivo distinto dal resto della pagina — aurora nei
colori Adobe (l'unica fascia satura), **striscia a tutta pagina di output veri** presi dai due deck
(scorre con due copie in fila, così il giro è invisibile; si ferma al passaggio del mouse), e le API
come **indice tipografico** invece dell'ennesima griglia di card.

**L'architettura non mostrava le API.** Il diagramma raccontava solo il runtime — console, skin,
motore, deploy — e taceva lo strato che produce metà di quello che si vede. Aggiunta la **catena di
build** fra motore e skin: i quattro comandi e ciò che consegna alle skin (*token + asset +
provenance ↓*). I chip del motore condiviso erano fermi a prima: aggiunti co-brand, credito «creato
con», loop video. Nel **blueprint mancava del tutto** una sezione sulla catena di build: aggiunta
(§05), più la sezione sul design system del cliente (§04). Allineato anche il CTA, che elencava le
sezioni vecchie.

**C2PA — rivendicazione corretta.** La nota diceva che gli asset sono «firmati con Content
Credentials». Verificato: i file spediti sono ri-ritagliati e riconvertiti per il web e **non
portano più il manifest**. La nota ora lo dice e spiega perché la provenance accanto alle immagini è
la garanzia vera. ⚠️ **Nei deck la frase è ancora quella vecchia** → backlog P1 (§10).

**Nessuna citazione di fornitori non Adobe** nello showcase (verificato su Pexels/Unsplash/
Shutterstock/Getty).


### 13.8 Tipo sulle card + primo panel review dello showcase (2026-10-01)
Le card di `#proof` mostrano il **tipo** (`exp-type`, da `EXPERIENCE_TYPES[e.type]`, campo `type` in `experiences.ts`); lo stesso badge è sulla card dell'hub e nella console. Lo showcase è stato il **primo artefatto non-deck** passato dalla skill `panel-review` (giro 1, report-only, 4 personas **derivate** → `⚠️ DERIVED PERSONAS`): 55 claim verificati, **16 confutati**, backlog 10 P0 / 12 P1 / 8 P2 — i P0 sono claim pubblici falsi (Lighthouse ≥95, «interamente di API Adobe», conteggi 6/12/14, link riservati nel DOM, «mai su sistema terzo»). Verdetto in `docs/Factory/PANEL-VERDICT-2026-10-01-round1.md` (git-ignored); **non applicato** (decisione owner, vedi §10). Da riscrivere anche la promessa «scaffoldata in meno di un'ora», ora vera grazie a `pnpm new:experience`.


### 13.9 Panel review giro 2 — personas reali (2026-10-01, sera)
Secondo e **ultimo** giro (la skill si ferma a due). Personas: **cinque persone reali** — Mengoli
(Managing Director), Capuano (AE servizi finanziari), De Silvestri (Data Solutions Consultant),
Oggioni (Manager Enterprise Sales, nuovo), Di Loreto (Partner Manager, nuovo) — più il seggio di chi
guida il Solution Consulting in Italia, che **nessuna fonte pubblica nomina**. Verdetto in
`docs/Factory/PANEL-VERDICT-2026-10-01-round2.md`, JSON in `docs/Factory/panel/2026-10-01-round2/`
(entrambi git-ignorati). 66 claim verificati su 24 unità.

| Asse | Giro 1 | Giro 2 | Δ |
|---|---|---|---|
| credibilità dei fatti | 3,0 | **4,0** | +1,0 |
| rilevanza per me | 3,5 | 3,5 | 0 |
| chiarezza | 3,8 | 3,7 | −0,1 |
| rischio (5 = nessuno percepito) | 2,0 | **2,0** | 0 |
| azionabilità | 2,8 | 3,2 | +0,4 |

**La lezione del giro 2: una correzione può creare un'esposizione peggiore di quella che chiude.**
La sezione «Risultati sul business», nata per rispondere al P1 del giro 1, ha messo **in chiaro la
pipeline italiana** — l'AD di Isybank il 10 set, il CIO di Eni lo stesso giorno, il workshop con
Accenture il 14 — su una pagina che dichiara essa stessa «accesso pubblico, senza login», e su due
conti che nel 2026 hanno preso provvedimenti dal Garante. Tutte e sei le personas la sollevano. Il
**candore** della tabella («esito da registrare» invece di un KPI inventato) resta invece nella lista
«non toccare»: va spostato il contenuto nominativo, non l'ammissione.

**Sette affermazioni confutate alla fonte**, tutte su una pagina pubblica: il `noindex` c'era **solo
su Poste**; Lighthouse non è 74–98 ma **63–96**, cinque experience su sei sotto 90 e Poste a 64 — erano
i numeri del giro 1, mai rimisurati; «ogni slide passa un audit prima di andare online» è falso
(l'audit **non gira in CI**); «le experience più vecchie restano **in parte** su stock» è falso, Max
Mara, Ferrari, Agos e FS sono **100% stock**; «quattro sessioni» sono **tre**; l'eroe diceva «11
controlli», sono **dodici**; e «si aprono solo su invito» era falso due volte — quelle cinque
rispondono 200 senza login e **quattro erano linkate dall'hub pubblico**. Difetto trovato dalle
personas e non dall'audit: il contenuto parte a `opacity:0` e **due sezioni uscivano bianche** negli
screenshot, una era «Chi lo mantiene».

**Applicato la sera stessa**: otto P0 su dieci e la metà meccanica dei P1 — `noindex` sui cinque
BaseLayout mancanti, i quattro link riservati tolti dall'hub, il difetto senza JavaScript invertito
(`html.js-reveal` da script inline + regole per stampa e reduced-motion; verificato a zero elementi
nascosti), Lighthouse sostituita dalla tabella per experience, lo stock dichiarato, i conteggi
corretti, e **la tabella dei risultati ridotta all'aggregato** (via nomi, ruoli, date e il nome del
partner; dettaglio dietro il login della console). **Non applicate** perché sono scelte e non
correzioni: depubblicare o mettere dietro login le experience con consenso «in attesa», e la data
della richiesta a Security/Legal (§10). **Scostamento dichiarato**: il verdetto chiedeva di nominare
Eni, MIM e Isybank nella riga sul perimetro; sono rimasti conteggi **senza nomi**, perché nominarli
in pubblico è la stessa divulgazione che il primo P0 toglie. **Verifica**: build di tutte le app
toccate, `typecheck` 0 errori su 14 app, `lint` 0 errori; ferrari, trenitalia e agos a **0 HARD**;
**maxmara 5 HARD e UniCredit 1**, entrambi preesistenti (riverificati sulla baseline) e ora P0 in §10.

**Resta all'autore**, e nessun giro lo chiuderà: sei marchi cliente portano il lockup «Adobe × Brand»
su un dominio pubblico a nome di una persona, con sei consensi «in attesa» e Legal che non ha ancora
visto niente. La skill si ferma a due giri: se dopo i P0 il rischio non sale almeno a 3/5, il problema
non è più il sito ma **dove vive**.

### 13.10 La tassonomia in vetrina, i due gate separati, la seconda skill (2026-10-03, `6335a33`)
Domanda di partenza dell'autore: la tassonomia e il panel review meritano più risalto?
Risposta data e applicata: **la tassonomia sì, senza riserve** (era una parola dentro una card);
**il panel sì, ma riposizionato**, perché «orchestrazione agentica» è un pattern di dominio
pubblico e ciò che non lo è è la disciplina (ritratti ciechi, fact-check alla fonte, arbitro,
gate che blocca la consegna).
- **`index#deliverables`, nuova fascia scura subito dopo «Cos'è»** — «Quattro domande, quattro
  artefatti». Quattro card: badge del tipo, **la domanda del cliente come titolo**, «in sala»,
  «chiede», e lo scheletro dei capitoli come percorso. Tutto reso da `EXPERIENCE_TYPES`
  (`packages/core/src/data/experienceTypes.ts`): **nessuna stringa a mano**. Sotto, la
  distribuzione del registry calcolata dai dati e la nota su quinto tipo, ibridi e sul fatto
  che le undici ci sono state **classificate dopo**. Voce di nav «Artefatti/Deliverables».
- **`index#why` ristrutturato** — da sei valori a **quattro brevi** in griglia bilanciata (2×2,
  poi 4 in riga da 1240; via «bilingue», già detto in `#what` e `#architecture`), poi i **due
  gate in coppia**: «si vede» (audit DOM, con tutte le riserve già verificate) e «regge» (il
  panel). Erano due muri di testo in una griglia di card brevi: mezza sezione restava vuota.
  Sotto, la nota **«Che cosa ha cambiato»**: «meno di un'ora» marcata non verificabile → è nato
  `pnpm new:experience`; «11 controlli» → erano dodici. Il panel ha cambiato il **prodotto**.
- **Passo 07 del flusso** — diceva «verificato contro la knowledge base», che non è il gate.
  Ora dice le due verifiche e che `/handover` segnala come P0 un'experience senza verdetto.
- **`index#skill` a due skill** — la seconda è il panel review: `skills/panel-review/INSTALL.md`
  nuovo, zip + SKILL.md + INSTALL serviti da `public/skill/`. Dichiara il vincolo vero (serve un
  harness che orchestri agenti; altrove il giro è ridotto **e va dichiarato**).
- **Card remota di `#proof` — bug vero, vedi memoria `astro-scoped-css-runtime-dom`.** Le regole
  `.exp-card`/`.exp-visual`/`.exp-chip`/`.exp-body` erano **scoped** da Astro: la card costruita a
  runtime da `buildCard()` per una experience pubblicata dalla Console nasceva **senza stili**
  (vista su Isybank). Ora sono `:global()`, la card remota riceve `--exp-accent` e il badge del
  tipo (colonna `type`, migrazione 0016; la query ora la chiede). Verificata riproducendo il DOM
  esatto di `buildCard()`.
- **Rimosso il blocco «Dove vive, chi la vede»** (hosting, indicizzazione, accesso, materiale,
  consenso co-brand per cliente, stato Security/Legal) — **decisione dell'autore**, lo giudicava
  allarmistico. Il giro 2 lo teneva fra le cose da **non toccare**. Nel codice resta un commento
  che data e motiva la rimozione; le conseguenze sono nel backlog (§10).
- **Nav**: dodici voci tagliavano «Blueprint» a **ogni** viewport (overflow 48px). Stretta la
  voce (`padding .42rem`, `font .75rem`): 0 di overflow a 1440/1920, e a 1280 va meglio di prima.

### 13.11 Panel review — giro sulla delta (2026-10-03)
Verdetto `docs/Factory/PANEL-VERDICT-2026-10-03-delta.md`, JSON in
`docs/Factory/panel/2026-10-03-delta/` (git-ignorati). Stesse sei personas del giro 2, pacchetto
di evidenza ricostruito (26 unità, testo esatto + schermate a 1440, IT). **Terzo giro**: la skill
si ferma a due **per revisione**, e il contenuto era cambiato in modo sostanziale.

| Asse | Giro 2 (1 ott) | Delta (3 ott) | Δ |
|---|---|---|---|
| credibilità dei fatti | 4,0 | **3,3** | −0,7 |
| rilevanza per me | 3,5 | 3,7 | +0,2 |
| chiarezza | 3,7 | 3,7 | 0,0 |
| rischio (5 = nessuno) | 2,0 | **1,3** | −0,7 |
| azionabilità | 3,2 | 3,3 | +0,2 |

**15 P0 · 20 P1 · 11 P2.** Guadagna dove è cambiata (tassonomia e seconda skill sono nel «non
toccare», sei personas su sei citano la tassonomia), **perde su credibilità e rischio** — 1,3 è il
minimo dei tre giri. La lettura dell'arbitro, da tenere: la rimozione del blocco ha lasciato
**impronte** (un rimando morto, una frase che negava nomi presenti dieci volte nel DOM, e al loro
posto i punteggi interni accanto al nome di un cliente), e chi legge non conclude «è meno
allarmista» ma «il gate si scavalca per gusto, e me lo propongono come standard».
**Applicati 9 P0** (quelli causati dalla delta più le correzioni verificabili sulla pagina):
rimando morto in `#dossier`; contatori dei tipi contro la prosa; «due giri mai tre» allineato alla
pratica; punteggi di panel e numeri dell'account fuori dalla pagina pubblica; riga sui ritratti
allineata al fatto che il repo è pubblico; data del 2 ottobre al passato; la frase «i loro nomi non
stanno nel markup»; la riga sui dati personali chiesta da tre giri; la nav. **I P0 restanti sono
in §10**: sei sono precedenti alla delta, uno è una decisione dell'autore.

---

### 13.12 La verifica generale: lo stesso difetto in altri due posti (2026-10-03, sera → `959d280`)
L'owner segnala che la tile **Isybank** rende male anche in `#architecture`. Non era la card della
prova (corretta la sera prima): è la **skin**, costruita dalla stessa famiglia di codice
(`buildSkin()`), rimasta rotta perché erano state globalizzate le regole della card e non quelle
della skin. Da lì una **ricognizione sistematica su tutto il monorepo** (ogni punto che crea DOM a
runtime × dove vive la regola di ogni classe che assegna): vedi §22 nella Parte 6 per il caso
grosso, che è nel motore condiviso. **Regola generale, da non riscoprire una terza volta: se una
classe può finire su un nodo creato da JavaScript, la sua regola non può stare in un `<style>`
scoped.** Memoria `astro-scoped-css-runtime-dom`.
- **Quattro righe asciutte sul consenso** (`#proof`), decisione dell'owner dopo il verdetto del
  giro delta: dove vive · indicizzazione · consenso al co-brand · Security/Legal. Etichetta → fatto,
  niente prosa — è la forma che il panel stesso aveva proposto. Chiude il P0 unanime; **resta aperto
  ciò che le righe dichiarano** (§10, Parte 2).
- **GA di CX Enterprise Coworker corretta alla fonte** in `experiences.ts` (IT+EN): è un **rollout**
  avviato il 2 ott, con **GA dichiarata TBD** da Adobe. Stessa correzione su hub e deck Poste (§32).
- **Il commento HTML non è un posto privato** (`7589aeb`): i commenti `<!-- -->` finiscono nel
  sorgente servito e si leggono in view-source. Quello che datava e motivava la rimozione del blocco
  è stato convertito in `{/* */}`, che Astro non rende. Gli altri sei commenti serviti sono note di
  design innocue, riletti uno per uno.
- **Gate della verifica**: build + typecheck + lint verdi su tutto il monorepo; **zero overflow
  orizzontale** a 1280/1440/1920 in **entrambe le lingue**; zero errori in console; **tutti i link
  a 200**; **277 tag `<T>`** fra le due pagine, **nessuno monolingue**; conteggi riconciliati col
  registry (11 · 6 pubblicate · 2 interne · 9 clienti). Sul **live**, dopo il deploy: le sette skin
  misurate una per una (bordo 3px, raggio 10px, stesso fondo) e zero card senza stile.

## 14. Ferrari — sezione `/scoping` (calcolatore di licensing)

`apps/ferrari-racing/src/pages/scoping.astro` (gated dalla solution `scoping`). Pagina customer-facing che modella **volumi e costo di licenza** di **RTCDP Collaboration** (Collaboration Credits) e **CJA** (Rows of Data) — due prodotti indipendenti, due metriche. È uno **strumento** (island interattiva full-bleed), NON una slide-keynote: **esente da `audit:deck`** (`/scoping/` non è nel ROUTE_SET di `scripts/deck-audit.ts`). Doc di riferimento del blocco: **`packages/core/src/blocks/scoping/README.md`** (architettura + come estendere).

> **AGGIORNAMENTO 15 lug 2026 — riscrittura del modello Collaboration.** Il motore RTCDP Collaboration ora **replica 1:1 il calcolatore ufficiale Adobe** «Real-Time CDP Collaboration Scoping Calculator» (workbook interno). Sotto il modello aggiornato; il change log dettagliato è in §18. **CJA è invariato** (non fa parte del workbook).
>
> **AGGIORNAMENTO 15 lug 2026 (pomeriggio) — modello v2 (SKU base + entitlement + istanze partner + refresh mode) e nuova sezione «Casi d'uso».** Il motore ora aggiunge, **sopra** la matematica dei crediti (invariata): SKU Base flat, entitlement per pacchetto (crediti inclusi nettati), **1 istanza Ferrari + N istanze partner**, e una **modalità di refresh legata alle campagne**. Aggiunta la nuova sezione deck **Casi d'uso**. Dettaglio in **§14.9**; change log in **§19**. **Stato: committato e pushato** (commit `a3fc86a`, 15 lug 2026).

### 14.1 Architettura (layer separati)
Tutto in `packages/core/src/blocks/scoping/` salvo i contenuti client:
- **`cost-model.ts`** — motore puro, deterministico, framework-free. **Replica 1:1** il workbook Adobe (`Sales Calculator` + sheet nascosta `Drop Downs, Burn, Assump`). Espone `BURN`/`ASSUMPTION_DEFAULTS` (costanti ufficiali), `audienceFunnel`, `collabParts`, `simpleScopingMatrix`, `recommendedCreditPack`, `ceilingTo`, `computeSnapshot`, `computeBreakdown`, `buildWarnings` + la parte CJA invariata.
- **`scenario.ts`** — `DEFAULT_ASSUMPTIONS` (= default del workbook), `DEFAULT_PRICES` (`pricePerCredit = 5`, prezzo di listino H13), preset id/label, serialize/deserialize **forward-compatible**.
- **`scenario-store.ts`** — persistenza localStorage (anon) + Supabase REST **con refresh automatico del token** (proattivo su scadenza, reattivo su 401 + retry singolo). Espone `remoteEnabled`, `clearSession`, `RemoteError`.
- **`ScopingCalculator.astro`** — shell UI + presenter (island TS vanilla).
- **`ScopingField.astro`** — sub-componente riga input; `data-when` supporta **modalità multiple** pipe-separate (es. `simple|detailed`).
- **`apps/ferrari-racing/src/data/scoping.ts`** — contenuti Ferrari: `FIELD_AUDIT`, `SEED_SCENARIOS`, `METRICS`, `ASSUMPTION_META`, `DISCLAIMER`.
- **Fonte di verità del modello Collaboration**: `docs/Ferrari/Real-Time CDP Collaboration Scoping Calculator.xlsx` (materiale Adobe interno, **git-ignorato** — repo pubblico). Il **PDF dossier** in `docs/Ferrari/` documenta il *vecchio* modello ed è **obsoleto**.
- **Test**: **53 Vitest** (41 cost-model + 5 scenario + 7 scenario-store), che **riconciliano cella-per-cella** al foglio (i 13 nuovi coprono party-cost/entitlement, refresh mode campaign-linked, istanze partner — vedi §14.9).

### 14.2 Modello di calcolo — RTCDP Collaboration (fedele al workbook Adobe)
**Costanti ufficiali** (`cost-model.ts`): `BURN` = management **2** · activation ad-hoc **500** · always-on **100** · measurement **50** (credits per 1M); `ASSUMPTION_DEFAULTS` = match **30%** · reach **50%** · frequency **10×** · conversion **5%** · **$5/credit** (H13).
**Funnel** (rate clamp 0–1): `matched = avgAudienceSize × matchRate` → `impressions = matched × frequency × reach` (per campagna) · `conversions = matched × reach × conversion`.
**Tre modalità** (`collabMode`):
- **detailed** (default): `management = (onboardedIds ÷ 1M) × (365 ÷ refreshEveryXDays) × 2` · `activation ad-hoc = (matched × campaigns × audiences/campaign × 500) ÷ 1M` · `always-on = (matched ÷ 1M) × runs × 100` (runs 0 di default, `alwaysOnRunsPerYear`) · `measurement summary = (impressions ÷ 1M) × summaryReports × campaigns × 50` · `attribution = ((conversions + impressions) ÷ 1M) × campaigns × attrReports × 50`.
- **simple**: matrice campagne `1·3·6·12·24·36`, refresh fisso 365/6 (ogni 6 giorni), ogni voce **CEILING a 10** crediti.
- **direct**: `estimated = max(0, directCredits)`.
- **Nessun allotment annuo** (rimosso il vecchio Prime 2.500 / Ultimate 5.000): il deliverable è il **pacchetto crediti consigliato** `recommendedCreditPack` = totale arrotondato a scaglione **100/500/1.000/5.000** (riga 31 del foglio); `cost = pacchetto × pricePerCredit`.
**Riconciliazione**: detailed default → **1.517,04** crediti (C72: mgmt 1.216,67 + activation 150 + summary 75 + attribution 75,375); simple totali `[1450,1900,2580,3930,6630,9340]` (riga 30); pacchetti `[1500,2000,3000,4000,7000,9500]` (riga 31).

### 14.3 Modello di calcolo — CJA (invariato · prodotto indipendente)
`rows = Σ(web, app, social, crm, events)` · `ingestionLimit = rows × cjaIngestionMultiplier` (guardrail ufficiale ×3) · `cost = (rows ÷ 1M) × pricePerMillionRows`. Breakdown per-sorgente con **peso %**. **Non** fa parte del workbook Adobe.

### 14.4 Trasparenza & auditabilità
`computeBreakdown(assumptions, prices)` restituisce, per ogni riga: **formula simbolica + numeri sostituiti + input usati**, le sorgenti CJA con peso%, e i `warnings`. La UI espone 3 livelli: results bar (summary) → drawer "Mostra il calcolo" (breakdown con formule) → tooltip audit per campo. Ogni variabile ha un **dataType semantico** → badge colorato: `official` (verde) · `default-assumption` (grigio) · `customer-assumption` (blu) · `price`/quote-only (giallo). I burn-rate Adobe sono ora rappresentati come **costanti ufficiali** (`BURN`), non come input tunable. Badge resi con `rgba()` esplicito.

### 14.5 UX
Preset chip (Conservativo/Base/Ambizioso/**Custom** = stato modificato); **select "Modalità di stima"** (Dettagliata/Rapida/Diretta) + **select "Casi d'uso measurement"** (Sì/No — boolean, gestito con special-case in `readInput`); results bar = **Credits stimati · Pacchetto consigliato · Costo** (rimossi billable/allotment); strip **warnings**; **breakdown drawer**; disclosure **"Assunzioni avanzate"** (frequency/reach/conversion, audiences/campaign, report, always-on); **visibilità condizionale** (`appliesWhen`, es. campi measurement solo se `measurementEnabled=true`; `mode` multi per campi simple∧detailed); dot **changed-vs-preset**; export **JSON/CSV**; **Confronta**. Tooltip audit **click-only**. Prezzi = *quote-only* ($5 di listino illustrativo).

### 14.6 Estendere (vedi README del blocco)
Nuova variabile: campo in `ScopingAssumptions` + default in `DEFAULT_ASSUMPTIONS` → usarla in `collabParts`/`cjaSourceRows` + `LineItem` in `computeBreakdown` → registrarla in `FIELD_AUDIT` (`dataType`, `category`, `mode` pipe-separato, `appliesWhen`/`advancedOnly`, `source/calc/assumption` bilingui) → test di riconciliazione. Burn-rate/assunzioni ufficiali = costanti in `BURN`/`ASSUMPTION_DEFAULTS` (non input). Select enum: `input:'select'` + `options`; i boolean (es. `measurementEnabled`) vanno special-cased in `readInput`. Nuova sorgente CJA: estendi `CjaSourceRows['id']` + `cjaSourceRows` + formula/substituted + `FIELD_AUDIT`.

### 14.7 Persistenza, resilienza & Admin
Supabase `scenarios` (`0004_scenarios.sql`, RLS **private/link/team**, `created_by default auth.uid()`); condivisione `?scenario=<uuid>`. **Auth resiliente** (fix 15 lug): lo store legge la sessione completa `edf:sb-session` (`access_token`/`refresh_token`/`expires_at`) e **rinnova il token** — proattivo se vicino a scadenza, reattivo su 401 con **retry singolo** (rispecchia `apps/console`); su refresh fallito **pulisce la sessione morta** e lancia `RemoteError(401)`. Il **Save fa SEMPRE fallback su localStorage** (lavoro mai perso) con messaggi accurati bilingui (sessione scaduta / cloud non disponibile / non configurato / anonimo); **Share** degrada allo stesso modo. `remoteEnabled()` evita una fetch a URL relativo verso l'origin quando il backend non è configurato. Admin: tab opt-in "Modello di licensing" (`showScopingTab`, default false) per baseline prezzi.

### 14.8 GOTCHA (dolori appresi)
- **CI typecheck — `tsconfig.json` obbligatorio per ogni app** (fix 15 lug): senza `tsconfig.json` `astro check` non eredita `astro/tsconfigs/strict` → ~2.000 errori fittizi `ts(7026) JSX.IntrinsicElements`, che facevano fallire il workflow **CI** (mentre **Deploy** restava verde → coppia verde/rosso ingannevole per ogni commit). Ogni nuova app DEVE avere `tsconfig.json` (`extends astro/tsconfigs/strict` + alias `@edf/core`). Aggiunto a `agos-trait-dunion` e `trenitalia-connessioni`.
- **Save "check your connection"** (fix 15 lug): causa = **token JWT scaduto non rinnovato** (lo store leggeva `access_token` grezzo). Il `catch` cieco mostrava l'errore generico **senza fallback** → scenario perso. Vedi 14.7.
- **Astro scoping degli stili**: il blocco `.scoping-*` è `<style is:global>` (selettori `.scoping-`-prefissati, solo su `/scoping/`), perché estraendo il markup in `ScopingField.astro` lo scoped non matchava più.
- La slide del calcolatore **non** usa `data-demo-flex` (riserva il 48% destro → fuori viewport); grid/flex children servono `min-width:0`; clic neutralizzati con `data-deck-nochrome`.
- Memoria `ferrari-scoping-calculator` (aggiornata alla riscrittura xlsx). Dump del workbook: unzip → parse `xl/worksheets/*.xml` (`<c>/<f>/<v>`) + `sharedStrings.xml` (nessuna libreria xlsx nel repo).

### 14.9 Modello v2 — SKU base, entitlement, istanze partner, refresh mode (15 lug 2026, commit `a3fc86a`)
> ⚠️ **PARZIALMENTE SUPERATO da §20 (v3, commit `ff03a71`):** SKU Base, entitlement RT-CDP (Prime/Ultimate), `partyCost`, `PACKAGE_ENTITLEMENTS`, `pricePerCredit`/`pricePerMillionRows` e il netting crediti **sono stati RIMOSSI**. Restano validi: istanze partner (1 Ferrari + N), `refreshMode` continuous/campaign-linked, il funnel, la sezione «Casi d'uso». Leggi §20 per il modello in produzione.

Estensione che risponde a 6 dubbi del cliente sul configuratore. **La matematica dei crediti da funnel (`collabParts`, §14.2) è invariata** — i test di riconciliazione Adobe restano verdi; v2 aggiunge layer *sopra*.
- **SKU Base + entitlement per party** (fedele alla slide Adobe «RT-CDP Collaboration SKUs»): tipo `PartyPackage = standalone | rtcdp-prime | rtcdp-ultimate`; costanti `COLLAB_BASE_SKU` ($20k listino / $5k floor) e `PACKAGE_ENTITLEMENTS` (Ultimate: Base inclusa + 5.000 crediti · Prime: Base inclusa + 2.500 · standalone: Base a pagamento + 0). Helper **`partyCost(estimated, pkg, baseSkuPrice, pricePerCredit)`**: `chargeable = max(0, estimated − inclusi)` → pacchetto sul solo surplus; `baseFee = 0` se inclusa. I crediti inclusi si **nettano** (evoluzione del "no allotment" di §14.2, che valeva per il solo Credits SKU).
- **Istanze partner** (1 Ferrari + N partner): profilo **"partner-tipo"** (campi `partner*` in `ScopingAssumptions`: package, onboardedIds, avgAudienceSize, adHocCampaigns) via `partnerAssumptions(a)` (riusa i rate di Ferrari, varia i volumi) × `partnerInstances`. **CJA resta un'unica istanza Ferrari** (aggrega tutti). Totale Collaboration = Ferrari + N × partner-tipo (Base + crediti ciascuno).
- **Refresh mode** (`refreshMode: continuous | campaign-linked` + `refreshesPerCampaign`): `campaign-linked` → refresh/anno = campagne × refresh/campagna (es. 3 invece di 61 → crediti gestione ~20× più bassi). Risolve il dubbio "perché refresh always-on con 3 campagne/anno". `refreshesPerYear(a)` aggiornato; default `continuous` (base fixture → 365/6 invariato).
- **Default v2** (`DEFAULT_ASSUMPTIONS`): Ferrari = **RTCDP Ultimate** (i suoi ~1.517 crediti coperti dai 5.000 inclusi → Collaboration Ferrari **€0**); partner = **standalone** (Base $20k + pacchetto). Il costo incrementale è guidato dalle istanze partner. Preset: Conservativo (1 partner, refresh campaign-linked) · Base (3 partner) · Ambizioso (8 partner).
- **Chiarezza UI**: nuovo campo `hint` (in `FieldAudit`/`ScopingField.astro`, classe `.scoping-hint`) = caption **inline sempre visibile** sotto l'input (non più solo nel tooltip `i`), su Dimensione audience, Match rate, Campagne ad-hoc, Refresh mode, ecc. Nuova sezione form **"Perimetro & istanze"** in cima alla card Collaboration. Results bar Collaboration riorganizzata: *Istanza Ferrari · Istanze partner · Canoni SKU Base · Totale Collaboration* (nuovi output snapshot `collabFerrari*`, `collabPartner*`, `collabBaseFeeTotal`).
- **Nuova slide** `slide-model` in `/scoping/` («Come si compone il costo» — 4 driver + lettura Ferrari worked, dati `COST_DRIVERS`/`COST_MODEL_SUMMARY` in `data/scoping.ts`); metriche di licensing arricchite (funnel + tipi campagna).
- **Nuova sezione deck «Casi d'uso»** (`apps/ferrari-racing/src/pages/casi-duso.astro`, nav tra Il Loop e Scoping, **non gated**): cover + 4 scenari end-to-end sull'intero perimetro prodotti (RT-CDP Collaboration → GenStudio + Express → Attivazione → CJA) + slide mappa prodotti. Dati `USE_CASES` in `data/scoping.ts`. Cross-nav: loop → casi-duso → scoping. Registrata in `admin.astro` (PAGE_REGISTRY, scoping ora "09") e in `FerrariNav.astro`. **Aggiunta a `deck-audit.ts`** (route set ferrari) → `audit:deck` **0 su 3 viewport**; `scoping` resta **fuori** dal route set (slide-calculator = esenzione interattiva).
- **Verifica**: 53/53 test core verdi; build monorepo 0 errori; sweep `audit:deck` ferrari (8 sezioni + casi-duso) **PASS pulito**; screenshot 1920 letti (slide-model, calculator, use-case, mappa) → type generoso, composizione bilanciata. File toccati: `cost-model.ts` (+178) e `.test.ts` (+116), `scenario.ts`, `data/scoping.ts` (+299), `ScopingCalculator.astro`, `ScopingField.astro`, `scoping.astro`, `casi-duso.astro` (nuovo), `FerrariNav.astro`, `admin.astro`, `loop.astro`, `deck-audit.ts`. Memoria `ferrari-scoping-calculator` (da aggiornare a v2 dopo il commit).

---

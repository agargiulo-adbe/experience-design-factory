# Handover — Parte 3 di 4
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 15. Root hub, feature parity & Connessioni Intelligenti (13–14 lug 2026)

### 15.1 Factory Hub (root)
`apps/factory-hub` è la **landing** a `/experience-design-factory/` (prima la root era Max Mara → link "generico"). App Astro minimale, **senza tailwind né `@edf/core`**, stile scoped scuro-neutro (NON un brand cliente). Contiene: 4 card esperienza brand-accented con link diretti + Showcase + Console. Serve anche gli **stub di redirect** (`src/pages/<slug>.astro` via `_redirect.astro`) per i vecchi deep-link maxmara root-level (`/acquisizione/`, `/engagement/`, `/conversione/`, `/loyalty/`, `/motore-adobe/`, `/persona/`, `/chiusura/`, `/maxmara-adobe/`) → redirect a `/generazioni-maxmara/<path>/` preservando `location.search`. Max Mara ha cambiato `base` in `astro.config.mjs`. Deploy.yml: root ← factory-hub, maxmara → sottodir.

### 15.2 Feature parity (uniforme su tutti i deck)
- **Frecce bidirezionali tra sezioni**: ogni pagina-deck ha `nextHref` **e** `prevHref`; il runtime di gating riscrive **sia** `data-deck-next` **sia** `data-deck-prev-href` (`nextEnabledAfter()` / `prevEnabledBefore()`) per saltare le sezioni disattivate. Regola nel Type & legibility contract (`CLAUDE.md`).
- **Max Mara resa config-driven** (predava il sistema): `admin.astro` (PAGE_REGISTRY dai veri slide id, 12 SOLUTIONS dai prodotti presenti), runtimes ferrari-style (media slot + gating + custom slides), `.cs-*` retinted quiet-luxury. Pagine funnel volutamente **non** gated (narrativa persona continua).

### 15.3 Connessioni Intelligenti — stato & lock
> ⚠️ **STRUTTURA SUPERATA il 31 ago 2026 dalla BIFORCAZIONE (vedi §26):** la nav qui sotto e la mappa slide di §15.4 descrivono l'esperienza monolitica pre-biforcazione. Oggi: tronco (cover+scenario+bivio) + rami `/fs-park/*` e `/trenitalia/*`. **I 13 vincoli LOCKED di §15.4 e le fonti restano PIENAMENTE VALIDI** (i contenuti sono migrati nei rami); la mappa slide corrente è in `admin.astro` e in §26.

`apps/trenitalia-connessioni` · IT · cliente **FS Group / Ferrovie** (Trenitalia + FS Park + FS Technology). Nav (storica): SCENARIO · FOUNDATION · CJA (convergenza) · CONNESSIONI (data-collab) · ROADMAP · CASI D'USO.
- **Personas (LOCKED)**: **Davide** (pendolare business Milano–Roma) + **Elena** (business/frequent traveler). **MAI Marco/Sofia** (=UniCredit) né Giulia/Francesca (=Max Mara) né Adriana (=UniCredit B2B). Foto persona rigenerata e **distinta** da UniCredit (era duplicata).
- **Leggibilità (LOCKED)**: type generoso per proiezione (vedi §8 / Type contract). L'ecosistema Foundation va tenuto **impilato full-width** (righe categoria), non a grid — richiesta esplicita cliente. `audit:deck` a **0**.
- **Sezione governance dedicata** (`slide-governance` in connessioni): scudo privacy & security per tutte le app AEP (non solo Data Collaboration).
- **Casi d'uso**: framing unificato "scenari di ispirazione ancorati al mondo FS" — NON "3 provati + 8 da esplorare". Structure 4-col: Scenario · Segnale CJA · Azione · Impatto Atteso — uniforme su core cases E "Da esplorare". Tutti etichettati "da validare sul campo".
- Memorie: `trenitalia-connessioni`, `hub-root-and-parity`.

### 15.4 Connessioni Intelligenti — mappa slide & vincoli contenuto (LOCKED)

**Struttura slide corrente** (da `admin.astro`):

| Sezione | Slide id | Label |
|---|---|---|
| scenario | `slide-cover` | Cover — Il viaggio del cliente oggi |
| scenario | `slide-marco` | Davide — profilo persona |
| scenario | `slide-touchpoints` | I touchpoint isolati |
| scenario | `slide-email-gap` | Oracle Responsys — gap comunicativo |
| scenario | `slide-opportunity` | L'opportunità integrata |
| fondazione | `slide-cover` | Cover — La foundation |
| fondazione | `slide-ecosystem` | Ecosistema a strati |
| fondazione | `slide-salesforce` | Salesforce Foundation Q1 2026 |
| fondazione | `slide-choice` | Non sostituire. Connettere. |
| convergenza | `slide-cover` | Cover — CJA il layer di convergenza |
| convergenza | `slide-convergenza` | Tutte le fonti. Un'unica vista. |
| convergenza | `slide-cja-vs-cdp` | CJA è / non è — disambiguazione (**nuova**, lug 2026) |
| convergenza | `slide-demo-cja` | Demo CJA Workspace — Davide |
| convergenza | `slide-content-analytics` | Content Analytics su AEM |
| convergenza | `slide-fasi` | Le 3 fasi — approccio graduale |
| connessioni | `slide-cover` | Cover — FS Park × Trenitalia |
| connessioni | `slide-gap` | Il gap attuale |
| connessioni | `slide-why-collab` | Perché serve Data Collaboration |
| connessioni | `slide-usecases` | I 3 use case ad impatto |
| connessioni | `slide-data-collab` | Data Collaboration — clean room |
| connessioni | `slide-governance` | AEP — Data Governance & Security |
| connessioni | `slide-value` | Il valore end-to-end |
| roadmap | `slide-cover` | Cover — Roadmap |
| roadmap | `slide-3fasi` | Le 3 fasi evolutive |
| roadmap | `slide-fase1-cja` | Fase 1 deep-dive — CJA + Governance (**nuova**, lug 2026) |
| roadmap | `slide-rtcdp-ajo` | Fase 2 deep-dive — Real-Time CDP + AJO |
| roadmap | `slide-mix-modeler` | Fase 3 — Adobe Mix Modeler |
| roadmap | `slide-mix-usecase` | Fase 3 — Mix Modeler use case FS |
| roadmap | `slide-genstudio` | Fase 3 — GenStudio + Target + Exp. Accelerator |
| casi-duso | `slide-cover` | Cover — recap e da esplorare |
| casi-duso | `slide-recap` | I 3 casi core, in sintesi |
| casi-duso | `slide-explore-retention` | Da esplorare · Retention & Loyalty |
| casi-duso | `slide-explore-loyalty` | Da esplorare · Loyalty & Acquisition |
| casi-duso | `slide-explore-growth` | Da esplorare · Acquisition & Ecosystem |
| casi-duso | `slide-explore-intelligence` | Da esplorare · Intelligence & Optimization |
| casi-duso | `slide-sintesi` | Sintesi + invito |

**Vincoli contenuto (LOCKED — non regredire in nessuna sessione):**

1. **Nessun nome di integratore/consulente** — non nominare mai IBM, Accenture o Pico. Usare "system integrator" se necessario; non attribuire decisioni architetturali interne al cliente.
2. **Nessuna "lottizzazione"** — non riportare mai le decisioni di assegnazione interna tra vendor/team FS. Nell'Experience riportare **solo i benefici e il valore** di un'integrazione con CJA.
3. **Oracle Responsys = CRM B2C che CJA complementa, NON sostituisce.** Trenitalia gestisce l'intera base clienti con Oracle CDP + Eloqua; CJA (e qualsiasi altro componente Adobe) va valorizzato **in combinata** con Oracle, non in sostituzione né in opposizione.
4. **AJO framing locked**: "AJO orchestra SOPRA Oracle Responsys — non lo sostituisce. Responsys rimane il motore di esecuzione email". Usare questo framing esatto in roadmap e in qualsiasi slide che menzioni AJO.
5. **CJA ≠ CDP** (slide `slide-cja-vs-cdp` in convergenza): CJA è un **layer di analytics e convergenza**, non un CDP. La disambiguazione ha una slide dedicata; non rimuoverla.
6. **KPI numerici** — ogni metrica numerica deve recare l'etichetta **"stima illustrativa"** o **"KPI da validare sul campo"**. Nessuna promessa precisa senza una fonte verificabile.
7. **Casi d'uso** — tutti i casi (core 3 + da esplorare 8) sono etichettati **"da validare sul campo"**, mai "dimostrati". La sintesi dice "3 casi core da validare · 8 da esplorare insieme".
8. **GDPR Data Collaboration** — FS Park e Trenitalia sono **entità legali distinte** anche all'interno del Gruppo FS. Il GDPR richiede una clean room (Data Collaboration) anche per condivisione audience intra-gruppo. Questa rationale è inline in `slide-why-collab` e non va mai rimossa.
9. **AEP Governance / breach angle** — il cyberattacco a Trenitalia (giugno 2026, sky.it/cronaca/2026/06/26) è il driver di credibilità per la sezione Data Governance in `slide-governance`. Non rimuoverlo, ma non collegarlo a numeri o danni specifici (dati non pubblici).
10. **Email 611/anno** — fonte: analisi campione email Trenitalia tramite Google Takeout personale (luglio 2026, 1 account cliente). **Solo illustrativa**, non pubblicare come dato ufficiale. Il footnote nella slide va tenuto.
11. **"Le fondamenta"** (NON "La foundation") — titolo della sezione fondazione in italiano corretto. Tenere coerente in header, nav, CTA, meta title.
12. **Nessuna timeline sulle fasi** — le date/mesi per le fasi roadmap erano state rimosse. Le fasi sono etichettate "Fase 1/2/3" senza suffissi temporali. Il disclaimer "Scenario evolutivo a titolo illustrativo — fasi e tempistiche da definire con FS Technology" va mantenuto.
13. **Touchpoint scenario** — 4 touchpoint puliti (trenitalia.com, Frecce booking, App Trenitalia, FS Park app/web). Nessun riferimento a loyalty program esterno, AI-powered, o sistemi di terze parti non Adobe nel touchpoint layer.

**Fonti verificate citate nell'experience:**
- Salesforce Foundation FS Technology: `fsnews.it` — FS Technology + Salesforce Foundation Digitale (mar 2026).
- Oracle Responsys / email count: campione email personale (Google Takeout, luglio 2026, 1 account, solo illustrativo).
- AEM su trenitalia.com: osservazione pubblica.
- Breach Trenitalia: `sky.it/cronaca/2026/06/26` (giugno 2026).

**Solution gating corrente**: `convergenza → cja` · `connessioni → data-collab` · `roadmap → rtcdp + ajo + mix-modeler`.

---
## 16. Trait d'Union — Agos (14 lug 2026)

**App**: `apps/agos-trait-dunion` · live a `/experience-design-factory/agos-trait-dunion/` · slug admin `agos-trait-dunion`.

**Contesto commerciale (da discovery, luglio 2026 — fonti interne al team Adobe, non nel deck):**
- Agos usa **Adobe Campaign v7 on-prem + Adobe Analytics** da anni (impianto Deloitte); contratti fino a mar 2027.
- Programma di trasformazione interno: CRM→Salesforce, data lake→Snowflake, telefonia→AWS, go-live set–ott 2027. L'IT prevede **solo lift & shift** del campaign management; il Marketing vuole "preparare il terreno". Decisione aperta **Campaign v8 vs AJO**.
- Pain point chiave dalle sessioni: overlap open market/customer base non misurabile (attribuzione binaria Internet/"Mailing"), dato di conversione (caricata/liquidata) fuori piattaforma, log tecnico server-side = fonte di verità (100% richieste), DPO ultra-restrittivo, DMP dismessa, Target abbandonato anni fa per discrepanza col log, customer match Google = uplift zero (cultura evidence-based).
- **Riservatezza**: il deck è pubblico → niente nomi di persone Agos, niente citazioni attribuite, niente numeri contrattuali; nomi interni di programma non citati (si dice "la trasformazione"). Dati pubblici citati con fonte (CS FY2024, ACT 2028, Osservatorio Assofin–CRIF–Prometeia).

**Narrativa (7 sezioni)**: scenario (il paradosso dei due mondi: digitale vs filiale/customer base, persona Elisa) → fondamenta (stack attuale + trasformazione + "Non sostituire. Connettere.") → evoluzione (5 use case attuali → evoluti: form abbandonato→AJO journeys, use case→Orchestrated Campaigns+NBO, dato di ritorno→wave in piattaforma, A/B→Target experimentation, DEM→GenStudio con brand score compliance) → trait-dunion (CJA: fonti, è/non è, demo fallout Elisa con MediaDemoSlot `cja-fallout-demo`, overlap risolto, data governance DPO) → orizzonti (playbook FSI: offerta pre-qualificata +120% illustrativo, life events+NBO+payment denial, RT-CDP Collaboration coi partner, prospect anonimi+LLM Optimizer, panorama 12 use case) → valore (metodo evidence-based: ipotesi/controllo/log come giudice; KPI dichiarati illustrativi) → roadmap (2026 Preparare · 2027 Migrare evolvendo · Scalare a **fine 2027**, sequenziata con la trasformazione; 3 next step).

**Design**: palette **petrolio/acqua reale del brand agos.it** (verificata dal CSS live: #05636B, #008590, #06ABB8, #10CAD8) + arancio #F57C00; **Montserrat** display + Inter. Logo/favicon = due cerchi (acqua+arancio) uniti da un tratto — il trait d'union. Dark-dominant (lavagna #121E21).

**Solution gating**: `evoluzione → ajo+target+genstudio` · `trait-dunion → cja` · `orizzonti → rtcdp+data-collab`. 6 soluzioni in 4 pillar (analytics/activation/content/growth). `nextHref`+`prevHref` su tutte le pagine.

**Audit**: registrato in `scripts/deck-audit.ts` (route set `agos`); 0 failure sui 3 viewport. Lezioni: (1) i titoli con blocchi contenuto alti cadono sopra la banda 30% → compattare sotto il titolo, non sopra; (2) `mb-3` (13.5px) tra h2 e lead viola il check g (≥16px) → usare `mb-4`; (3) per gli "inventory" 4 voci, griglia 2×2 con categoria in-card batte le righe impilate quando il titolo cade alto.

**Registrazioni**: deploy.yml (merge + verifica), factory-hub card, showcase `experiences.ts` (+`shots/agos.webp`), migrazione `0006_seed_agos.sql` (**da applicare al DB remoto**: `supabase db query --linked`).

**Pending**: media demo per `trait-dunion:slide-demo-cja` da configurare in admin (video CJA fallout); eventuale bilingue se servisse per il gruppo CA.

**Aggiornamento 2026-09-03 (refresh contenuti + design check)** — commit `eae473b` · `cd37cc8` · `8cd3cf4`:
- **Intro**: nuova slide **`slide-competitori`** "Lo scenario competitivo" (Findomestic vs Compass, mosse 2025–26 verificate via `/deep-research`: HeyLight/Nexi/piano MPS 17→21 mld; findomestic.it rifatta) con **4 fonti linkate**; solo testo, nessun logo concorrente. La home NON è in `PAGE_REGISTRY` → nessuna registrazione admin.
- **Design check — allineamenti**: corretto il testo dei bullet che ereditava `text-align:center` da uno `Slide align="center"` → aggiunto `text-left` su `.evo-item` (Evoluzione, 5 slide), sui `<li>` di `fondamenta/finestra`, `orizzonti/prequalified` (Come funziona) e `roadmap/fase2`. **Bug ricorrente da ricordare**: un elenco puntato dentro un flex/grid child, su slide centrata, eredita il center e "spezza" a metà → serve `text-left` esplicito sull'item.
- **Overflow HARD** risolti: nib connettore `.tdu-source::before` sporgente in `trait-dunion/slide-convergenza` (rimosso; resta la spina centrale a gradiente) e nodo finale timeline in `roadmap/slide-3fasi` (rientrato a `left: calc(100% - 7px)`).
- **Naming**: «Next best offer» → **Next Best Experience** ovunque (orizzonti card+testo, roadmap, valore, admin RT-CDP).
- **Roadmap**: tolto il tag **Assessment** (non è un prodotto), **2027 = solo tag AJO** (rimosso "Orchestrated Campaigns"), fase **Scalare spostata a "2027 · fine anno"** (era 2028), tag prodotto allineati in fondo alla card (`mt-auto`).
- **Orizzonti — nuova slide `slide-agentic` "Orizzonte 5 · L'era agentica"** (coda ispirazionale): **Adobe Firefly** (commercially-safe + Custom Models/Foundry) · **Adobe GenStudio** for Performance Marketing (contenuti on-brand su scala + brand score) · **Agent Orchestrator → CX Enterprise Coworker** (data governance nativa). Prima era il generico "AI Assistant" → sostituito su richiesta con Firefly/GenStudio. Naming/capability verificati via `/deep-research` (fonti newsroom Adobe: MAX 2025 Firefly Foundry, Summit 2025 GenStudio/Agent Orchestrator, GA giu 2026 Coworker). **Caveat in nota (BINDING)**: il «commercially safe» di Adobe = sicurezza **IP/copyright**, **non** compliance regolatoria del credito — non conflarli su un operatore regolato. Cover Orizzonti → "Cinque"; slide registrata in `admin.astro` PAGE_REGISTRY.
- **Immagine persona Elisa** rigenerata via `assets:build` (Pexels, "woman dining outdoors in Rome, Italy") → legge come italiana (prima modello asiatico). Query `persona-elisa` aggiornata in `assets.manifest.ts`.
- `audit:deck` **0 hard** su tutte le route dopo le modifiche (residui solo SOFT `a`/`i`/`g`); slide modificate rilette a 1920.

---
## 17. Adobe Brand Visibility, de-AI copy & comando /handover (15 lug 2026)

### 17.1 Adobe Brand Visibility (consolidamento prodotto)
LLM Optimizer + Semrush **non sono più due prodotti**: sono confluiti in **Adobe Brand Visibility** (piattaforma end-to-end Adobe + Semrush per la AI/GEO visibility). Fonte: `docs/Adobe Brand Visibility Pitch Deck - Long Version.pptx`. Memoria: `brand-visibility-product`.
- 4 pilastri: **Visibilità AI completa** (10 famiglie LLM, agentic traffic da log CDN) · **Intelligence guidata dalla SEO** (289M+ prompt reali dell'offerta Adobe+Semrush — ma **nel deck UniCredit il numero è stato ammorbidito a "milioni di prompt reali"**, §17.6, perché privo di fonte on-slide, query fan-out) · **Ottimizzazioni su ogni superficie** (edge CDN + at-source + off-site) · **Misurazione ad anello chiuso** (Adobe Analytics + CJA). KPI: brand mentions, citations, agentic traffic, referral traffic.
- **UniCredit `visibilita.astro`**: le due slide (`slide-llm-optimizer` + `slide-semrush`) **fuse** in un'unica `slide-brand-visibility` (layout split, gated `data-solution="brand-visibility"`). Edit puntuali: chip persona Marco → *Adobe Brand Visibility: UniCredit GEO*; CTA scenario → *Dalla storia alla tecnologia*; stat *referral traffic*/*bounce rate*; eyebrow+bullet "momento di Marco"; footer EDS (edge/BYO CDN/standard web); AEM Sites Optimizer (titolo non-overselling + SEO/contenuti/accessibilità/performance).
- **Admin**: `PAGE_REGISTRY` aggiornato (slide fusa) + nuova soluzione attivabile `brand-visibility` (pillar «AI Visibility»). `index.astro` journey sub-label aggiornato.
- **Agos `orizzonti.astro`**: rename «Adobe LLM Optimizer» → «Adobe Brand Visibility». Semrush resta citato *dentro* Brand Visibility (motore di intelligence), non come prodotto a sé. Ferrari/Trenitalia/Max Mara non citavano il prodotto.
- Commit `c306f4a`.

### 17.2 Passata de-AI (copy 100% human, IT+EN)
Riscrittura chirurgica del copy su **tutte e 5 le experience** (45 file, 348+/351−) per suonare umano: em-dash retorici → virgole/due-punti, frasi spezzate/tricolon → periodi naturali, `non solo X ma Y` e value-speak vuoto rimossi. **Invariati**: nomi prodotto/persona, numeri, fonti, claim, codice; lunghezze preservate (±10%) per non rompere l'audit. Ferrari: EN e IT resi entrambi idiomatici (i `<T>` mantengono sempre entrambe le lingue). Build completo OK; **nessuna nuova failure d'audit** (maxmara/ferrari/trenitalia/agos restano 0; unicredit invariato). Memoria: `copy-must-be-human`. Commit `e2b3d8c`.

### 17.3 Comando `/handover`
Nuovo slash command di progetto `.claude/commands/handover.md` (vedi §12): aggiorna questo handover, impone il contratto di dimensione file, splitta per sezione e verifica la leggibilità per una nuova sessione con una `Read` completa. **Questo file è stato splittato la prima volta proprio da questo comando** (>48KB). Commit `c489f9b`. Fix frontmatter + install user-level: vedi §17.5.

### 17.4 Bonifica audit UniCredit (hard → 0)
Passata dedicata sui check **HARD** dell'`audit:deck` unicredit (che aveva ~200 fallimenti, mai stato a 0): `c` (overflow orizzontale / box oltre la safe-inset) 22→0, `e` (text-on-text) 1→0, `j` (clipping fuori viewport) 7→0. 14 slide su 8 sezioni (acquisisci/analizza/b2b/coinvolgi/contenuti/coworker/motore-adobe/risultati), fix in worktree paralleli isolati. Pattern ricorrenti: frecce `absolute -right-2` che sporgono dalle card → tenute dentro (`right-1` + `overflow-hidden`); `min-w-0` su flex/grid children; riduzione gap/padding/densità per far rientrare le slide dense a 1440/1280; numerale display che va a capo. **Vincolo rispettato**: nessun body text < 0.95rem, nessuna slide splittata, nessun nome prodotto/numero/fonte rimosso. Restano **solo soft** `a`/`i`/`g` (totale 170), che il Type & legibility contract vieta di forzare. Metodo di lavoro riusabile: worktree isolati per app condivisa (evita race su `dist/`) + audit full con confronto per-check hard/soft.

### 17.5 Regole vincolanti codificate + /handover globale (commit `ab3fb8b`, `5ed9764`, `b900ca7`)
Le lezioni di questa sessione sono state **generalizzate in istruzioni vincolanti** per tutte le experience future:
- **`CLAUDE.md` → nuova sezione «Working rules — codified from production (BINDING, every experience present & future)»** (auto-caricata ogni sessione, quindi seguita da ogni Exp Design): (1) **Copy voice — 100% human, not AI** (tell da evitare, IT+EN, lunghezza ±10%; memoria `copy-must-be-human`); (2) **Audit discipline — hard vs soft** (HARD `b/c/d/e/f/h/j/k` → 0; SOFT `a/i/g` aspirazionali, **mai** forzati rimpicciolendo il type → cut/split; fix ricorrenti; il parser non conta i mock visivi come massa-testo = limite noto); (3) **Cross-experience propagation** (un cambio prodotto/naming o del motore condiviso si propaga a experience + admin `PAGE_REGISTRY`/`SOLUTIONS` + hub/showcase; verifica vs `docs/*.pptx`; memoria `brand-visibility-product`); (4) **Parallel work su app condivisa → worktree isolati** (build/preview concorrenti corrompono lo stesso `dist/`); (5) **Handover docs leggibili a inizio sessione** via `/handover`.
- **`skills/experience-design/SKILL.md`**: le stesse regole come **checklist attiva** — voce copy in *Content rules (substance)*, disciplina hard/soft + worktree in *Visual self-audit*, e 4 nuovi gate nella *New Client Checklist* (8 copy pass · 9 audit gate · 10 register everywhere · 11 /handover).
- **`/handover` reso robusto e globale** (commit `b900ca7`): risolto il bug del frontmatter (`argument-hint: [check]` era una **lista YAML** → il comando veniva scartato, «No commands match»; ora `argument-hint`/`description` sono stringhe quotate) e comando **installato anche a livello utente** in `~/.claude/commands/handover.md` → disponibile in **ogni sessione e ogni progetto** (oltre alla copia di progetto versionata; in questo repo vince quella di progetto). **Nota operativa**: gli slash command si caricano **all'avvio della sessione** → serve una **nuova sessione** perché `/handover` compaia.

### 17.6 UniCredit — passata copy morbido/credibilità (commit `aabd2d1`)
Round di feedback su Engagement Unlimited (7 richieste puntuali su screenshot). Principio: **più morbido e più credibile**, senza toccare struttura/personas/gating. **Solo gli 11 file `apps/unicredit-engagement/src/pages/*` committati** (i file Ferrari/`packages/core` in working tree erano di §19, lasciati fuori).
- **Cifre non verificabili → qualitativo**: rimosso **"14M clienti"** ovunque (scenario, conosci ×3, risultati footnote, motore-adobe) → *"milioni di clienti / i milioni di profili"*; ammorbidita l'affermazione assoluta *"il profilo completo… ancora non esiste"* → *"…spesso resta parziale"*. Rimosso **"289 milioni di prompt"** (visibilita, 2 occorrenze) → *"milioni di prompt reali"*. Conseguenza: **§5.2 (14M) e §17.1 (289M) aggiornati**.
- **Numeri di risultato inventati → direzione (↑/↓)**, mantenendo l'etichetta del KPI («applica i KPI, non i risultati specifici»): convertiti in **tutte** le sezioni (acquisisci −90%/3×/−40% + Experimentation +34%CTR; coinvolgi 5×/–68%/+41%; b2b 3.2×/+58%/–40%; coworker 3×/−72% + campaigns +34%CTR; analizza €2,3M/15–35%/3.4×; risultati proiezione UniCredit +€45M/–55%/–85% + card −68%/+40%/3× + Sofia +34%CTR/NPS78; visibilita EDS +40%). **Tenuti** perché credibili: benchmark di **banche reali citate** (US Bank 19× ecc. in risultati, con footnote), ricerche esterne **linkate** (Gartner −25%, Adobe Analytics +1200%/−33%), **target pubblici** UniCredit (RoTE >20%) e **meccaniche di scenario** (0,3s, 87/100 propensity, 200ms, "3 prodotti in 6 mesi"). Le card KPI ora mostrano una **freccia display (↓/↑)** + etichetta + sub qualitativo.
- **Next-Best-Action → Next-Best-Experience** in tutta l'experience (conosci ×2 + commento, coinvolgi, b2b, admin `PAGE_REGISTRY`). Scelta la forma **inglese** per coerenza col termine tecnico e col precedente "Next-Best-Action"; l'utente potrebbe preferire l'italianizzato *"Next-Best-Esperienza"* — **(da confermare)**.
- **Obiezione «abbiamo già Salesforce Data Cloud, ma solo per i clienti noti, non per l'acquisition»**: rafforzato il copy della slide di Marco (`slide-storia-conosci`) — RT-CDP parte dal **click anonimo**, ricompone l'identità in tempo reale ed è *"lo stesso motore che serve i clienti storici e che, in acquisition, intercetta chi la banca ancora non conosce"*; rinforzata la card "Acquisizione" della slide Collaboration (prospect net-new/sconosciuti). **Nessun competitor nominato** nel deck.
- **Fix doppio `""`** sul sample push-notification di Coinvolgi (le virgolette erano sia nel dato sia nel template che le riaggiungeva).
- **Bullet Visibilità bilanciati** (`slide-marco-moment`): i 3 bullet resi di lunghezza simile (uno era molto più lungo).
- **Verifica**: build OK; `audit:deck` contro **preview statico** → **0 fallimenti hard** su tutto il deck (restano i soft a/i/g pre-esistenti, non forzati); **screenshot 1920 letti** su tutte le slide toccate (frecce KPI leggibili/coerenti, copy obiezione senza overflow, bullet bilanciati).

---
## 18. Ferrari /scoping — modello Adobe-fedele, CI verde & Save resiliente (15 lug 2026)

Tre interventi sequenziali (tutti su `main`, CI verde end-to-end). Riferimento sintetico in §14 (riscritta), memorie `ferrari-scoping-calculator` e `git-push-after-every-commit`.

### 18.1 Riscrittura del motore Collaboration = 1:1 col workbook Adobe (commit `4592c58`, merge `c1184f9`)
Richiesta: replicare in produzione la logica del file **`docs/Ferrari/Real-Time CDP Collaboration Scoping Calculator.xlsx`** (Adobe "Sales Calculator" di dvest@adobe.com; foglio visibile + sheet nascosta `Drop Downs, Burn, Assump`). Il workbook modella **solo** RTCDP Collaboration → **CJA invariato**.
- **Reverse-engineering**: estratte tutte le formule via unzip + parse XML (nessuna lib xlsx). Burn rate (mgmt 2 · activation ad-hoc 500 · always-on 100 · measurement 50 credits/1M), assunzioni (match 30% · reach 50% · freq 10× · conv 5%), prezzo listino $5 (H13), pack-tiering (riga 31), funnel matched→impressions/conversions.
- **Motore riscritto** (`cost-model.ts`): `ScopingAssumptions` Collaboration completamente sostituito (onboardedIds, avgAudienceSize, matchRate, frequencyMultiple, reachPct, conversionRate, measurementEnabled, refreshEveryXDays, adHocCampaignsPerYear, audiencesPerCampaign, measurementCampaignsPerYear, summaryReportsPerCampaign, attributionReportsPerCampaign, alwaysOnRunsPerYear, simpleCampaignsPerYear). Tre modalità **detailed/simple/direct**; **nessun allotment** → `recommendedCreditPack`. Dettaglio formule in §14.2.
- **Propagazione**: `scenario.ts` (default+prezzo $5), `data/scoping.ts` (FIELD_AUDIT/SEED_SCENARIOS/METRICS/ASSUMPTION_META riscritti; burn ora *ufficiali*), presenter (select mode + measurement boolean, results bar con pacchetto, gating `mode` pipe-separato), README del blocco.
- **30→28 test cost-model riscritti** per riconciliare cella-per-cella (1.517,04; matrice simple; pack tiers). Build + typecheck ferrari 0 errori. Verificato live: preset Conservative → **921 crediti / pacchetto 1.000 / €5.000** collab; CJA 508M righe / €1.016; totale €6.016.
- **`.gitignore`**: aggiunta `docs/Ferrari/` (workbook Adobe interno; repo **pubblico** → mai committare). Il **PDF dossier** in quella cartella documenta il vecchio modello ed è ora **obsoleto** (non rigenerato, per scelta).

### 18.2 Fix CI — `tsconfig.json` mancante (commit `6b58b80`, merge `2eb6be7`)
Sintomo: per ogni push comparivano **due workflow** — `Deploy to GitHub Pages` (verde) e `CI` (rosso). Root cause: `agos-trait-dunion` e `trenitalia-connessioni` erano state create **senza `tsconfig.json`** → `pnpm typecheck` (`astro check`) non ereditava `astro/tsconfigs/strict` → ~1.979 errori fittizi `ts(7026) JSX.IntrinsicElements`. Il Deploy non fa typecheck → restava verde (coppia ingannevole). Fix: aggiunto ad entrambe il `tsconfig.json` standard (`extends astro/tsconfigs/strict` + alias `@edf/core`). Ora **8/8 app** typecheck 0 errori; CI verde. **Regola** (vedi §14.8): ogni nuova app DEVE avere `tsconfig.json`.

### 18.3 Fix Save "check your connection" — persistenza resiliente (commit `77e6b3f`, merge `c4ed338`)
Root cause: lo store leggeva `edf:sb-session.access_token` grezzo e **non lo rinnovava mai** → JWT Supabase scaduto (utente loggato in Console tempo prima) → insert **401** → `catch` cieco con messaggio generico **e nessun fallback** → scenario perso. Backend (tabella/RLS 0004) ed env deployato **corretti** (build ha l'URL `spwoeihrrr…`).
- **`scenario-store.ts`**: legge la sessione completa (access/refresh/expires_at); **refresh del token** proattivo (vicino a scadenza) + reattivo su 401 con **retry singolo** (rispecchia `apps/console`); su refresh fallito pulisce la sessione morta. Nuovo `RemoteError` (status HTTP reale), `remoteEnabled()` (niente fetch a URL relativo senza backend), `clearSession()`.
- **`ScopingCalculator.astro`**: Save **sempre** con fallback localStorage (lavoro mai perso) + messaggi bilingui accurati (sessione scaduta / cloud non disponibile / non configurato / anonimo); Share degrada allo stesso modo.
- **+7 test store** (`scenario-store.test.ts`, `fetch`/`localStorage` mockati): save fresco, refresh proattivo, retry reattivo su 401, refresh fallito→clear+401, non-configurato, sessione solo-refresh. Totale blocco scoping = **40 test**.
- **Altre funzioni verificate corrette** e non impattate: Confronta, Esporta JSON/CSV, Reset, preset, load `?scenario=`.

---
## 19. Ferrari /scoping v2 + sezione «Casi d'uso» (15 lug 2026 pomeriggio) — commit `a3fc86a`

Sessione successiva a §18. Su richiesta cliente (6 dubbi sul configuratore + "aggiungi casi d'uso con tutti i prodotti a perimetro"). **Committato e pushato** (`a3fc86a`, deploy live). Dettaglio tecnico in **§14.9**.
- **Chiarezza campi** (dubbi 1–3): hint inline su Dimensione audience × Match rate (= audience matchata), Campagne ad-hoc (one-off vs always-on); non più sepolti nel tooltip.
- **Refresh mode** (dubbio 4): modalità `campaign-linked` (refresh legato alle campagne) oltre a `continuous`.
- **Istanze partner** (dubbio 5): 1 Ferrari + N partner-tipo (profilo leggero × N); CJA singola.
- **SKU Base + entitlement** (dubbio 6): selettore pacchetto per party (standalone/Prime/Ultimate), Base flat $20k, crediti inclusi nettati. Ferrari Ultimate → Collaboration €0; costo guidato dai partner.
- **Slide nuova** `slide-model` («Come si compone il costo») + metriche arricchite.
- **Sezione nuova «Casi d'uso»** (`casi-duso.astro`): 4 scenari E2E su tutto il perimetro (Collaboration → GenStudio + Express → Attivazione → CJA) + mappa prodotti; nav+admin+cross-nav+deck-audit aggiornati.
- **TDD sul motore**: 13 nuovi test (party-cost, entitlement, refresh mode, istanze) → **53/53 core verdi**; build monorepo 0 errori; `audit:deck` ferrari (incl. casi-duso) **0 fallimenti**; screenshot 1920 letti.
- **Metodo**: brainstorming (4 decisioni confermate dall'utente: partner-tipo×N · selettore pacchetto per party · refresh legato alle campagne · sezione dedicata in nav) → TDD → build/audit finale.
- **Fatto**: commit `a3fc86a` (`feat(scoping): base SKU + entitlement, partner instances, campaign-linked refresh + Use Cases section`) + push su `main`; il commit ignora anche `docs/Ferrovie/` (materiale FS riservato, repo pubblico). Memoria `ferrari-scoping-calculator` aggiornata a v2.

---
## 20. Ferrari /scoping v3 — standalone-only, costo per istanza editabile, niente prezzi (15 lug 2026, commit `ff03a71`)

Su richiesta cliente, **rimossa ogni economia Adobe** dal modello (era diventato troppo "prezzato"). **Committato e pushato** (`ff03a71`). Sostituisce la parte commerciale di §14.9/§19; la matematica dei crediti (funnel/`collabParts`) e le istanze partner **restano**.
- **Niente riferimenti economici**: rimossi SKU Base ($20k/$5k), `pricePerCredit` ($5), `pricePerMillionRows`, entitlement (crediti inclusi Prime 2.500 / Ultimate 5.000), netting. Rimossi tipo `PartyPackage`, costanti `COLLAB_BASE_SKU`/`PACKAGE_ENTITLEMENTS`, funzione `partyCost`, campi `ferrariPackage`/`partnerPackage`/`*BaseSkuPrice`.
- **Solo scenario standalone**: nessun selettore pacchetto, nessuna ipotesi RT-CDP.
- **Costo = ipotesi editabile per istanza** (`UnitPrices` ridefinita): `ferrariInstanceCost` (default 100.000, editabile) + `partnerInstances × partnerInstanceCost` (default 0, editabile). `totalCost = Ferrari + N × partner`. **Niente costo CJA**.
- **Volumi come metrica (senza €)**: Collaboration Credits stimati + pacchetto consigliato, CJA Rows of Data + ingestion 3× — mostrati come quantità, nessun prezzo.
- **UI**: results bar = *Collaboration (volumi) · CJA (volumi) · Costo (tua ipotesi: istanza Ferrari + istanze partner)*; sezione form «Perimetro & istanze» = costo istanza Ferrari + n. istanze + costo per istanza partner (volumi partner in advanced). `slide-model` → «Perimetro e costo / Quattro voci, un perimetro» (4 card ridisegnate: istanze · crediti-volume · CJA · costo-lo-imposti-tu). METRICS/ASSUMPTION_META/DISCLAIMER/USE_CASES de-monetizzati. Admin baseline tab → costo istanza Ferrari/partner.
- **Motore**: `computeSnapshot`/`computeBreakdown` riscritti (volumi + costo per istanza). `partyCost`/entitlement eliminati. Test: rimossi i test party-cost/entitlement, aggiornati snapshot → **47 test core verdi** (35 cost-model + 5 scenario + 7 store).
- **Bug rapida↔dettagliata**: verificato che lo switch modalità **ri-gate il form e ricalcola** (es. Est. credits 343→720 passando a Rapida) — funziona; il rework del form ha risolto il sintomo riportato.
- **Verifica**: build monorepo 0 errori, core typecheck 0, `audit:deck` ferrari (8 sez + casi-duso) **0 fallimenti** a 1920/1440/1280, screenshot 1920 letti (calculator detailed+simple, slide-model). Memoria `ferrari-scoping-calculator` aggiornata a v3.
- **Contesto commerciale (perché standalone + partner a €0)** — non nel deck, guida le scelte del modello: l'intento è **1 istanza Ferrari + ~40 istanze partner/sponsor**, offrendo ai partner **licenze Starter a costo 0** (da cui il default `partnerInstanceCost = 0` e il costo Ferrari editabile). Audience **~5M outside-in, NON confermata dal cliente**. Validazione GTM pianificata con **Lory Mishra** (Principal PMM, Media & Advertising Solutions, Adobe — collega interna che approva/nega): validare il caso d'uso, ottenere le licenze Starter partner a costo 0, definire onboarding + enablement leggero per i partner; presentazione al cliente solo dopo le verifiche con lei. **NON reintrodurre prezzi di listino nel modello** (scelta esplicita del cliente/interna, §20).

---

## 21. Experience Atelier — deck trilingue del piano di crescita (17 lug 2026)

**Cos'è.** `apps/atelier` (`/experience-design-factory/atelier/`) — il **piano di crescita
enterprise della Factory stessa**, presentato come Exp Design immersivo. **Primo deck
trilingue EN/IT/FR** (default EN; il lettore primario è una dirigente Adobe con base in
Francia). **Depubblicata dai listing pubblici il 2026-09-01** (`4cca945`): **non più** in hub
né showcase (`experiences.ts`); resta nel Super Admin Console (migration `0007_seed_atelier.sql`,
status **`live`** — non toccata) e la route `/atelier/` è ancora buildata/raggiungibile (solo
unlinked; vedi backlog §10 per l'eventuale rimozione dal deploy). Estetica propria: **dark editorial**, carbone
caldo + champagne, **Fraunces + Inter** (coppia non usata da nessun'altra esperienza).

**Contesto (IMPLICITO, mai nel deck).** L'intento reale è un **pitch di sponsorship**
instradato a una specifica dirigente per un obiettivo di **AI-enablement della workforce
Adobe**. Nel deck questo NON è mai dichiarato: si legge come un piano di crescita neutro.
Vincolo di confidenzialità (repo + URL **pubblici**): **nessun nome di persona/org interna**,
**nessun listino interno**, **nessuna cifra € sulla pagina asks** (solo barre di
"envelope" relative 100/55/35/15; le cifre stanno in un annex privato). Memoria
`experience-atelier-deck`. Spec/piano: `docs/superpowers/specs/2026-07-17-experience-atelier-growth-plan-design.md`
e `docs/superpowers/plans/2026-07-17-experience-atelier-growth-plan.md`.

**Rebranding.** "Experience Atelier" è un nome **solo di presentazione** per QUESTO deck.
Repo, slug delle app, `@edf/core`, URL, chiavi localStorage restano "experience-design-factory".

### 21.1 Struttura — 8 sezioni / 30 slide (slug · slide ids)
1. **Overture** (`/`): `slide-cover` (wall di apertura non testuale) · `slide-wall` (6 card **live**, link ai 5 deck cliente + hub) · `slide-thesis`.
2. **The method** (`/method/`): cover · `slide-genesis` (timeline con **mesi reali dai first-commit git**: Max Mara 15 giu, UniCredit 1 lug, Ferrari 6 lug, FS 13 lug, Agos 14 lug 2026) · `slide-method` (4 step) · `slide-compliance` (tabella claim→prova).
3. **The capability** (`/capability/`): cover · `slide-anatomy` (diagramma CSS engine/skin/foundation) · **`slide-toggle-demo`** (demo interattiva self-contained di solution-gating, opera con tastiera SENZA far avanzare il deck; degrada a mock statico senza JS) · `slide-console`.
4. **The multiplication** (`/multiplication/`): cover · `slide-market` · `slide-precedent` · `slide-model`. **Tutte le cifre dal fact sheet** (§21.3).
5. **New frontiers** (`/frontiers/`): cover · `slide-live-products` · **`slide-quest`** (spotlight Boardroom Quest, teaser pixel-art in CSS, `data-solution="quest"`) · `slide-quest-plan` (`data-solution="quest"`, con gate brand/legal).
6. **The plan** (`/plan/`): cover · **`slide-roadmap`** (Gantt di sintesi: 5 workstream × 3 milestone, celle champagne, cella vuota dove l'Ecosistema parte a M2, riga "key moments" con gate brand/legal + Hackathon + Summit) · `slide-m1`/`slide-m2`/`slide-m3` (milestone a mid-set 2026 / mid-gen 2027 / mid-apr 2027 con **Adobe Summit 2027, Las Vegas 22–25 mar** dentro M3) · **`slide-kpi`** (scorecard 2×2: card numerate + metric-pill a wrap, non più 4 righe di testo).
7. **What it takes** (`/asks/`): **sezione gated** (`pageSolutions={['asks']}`) · cover · `slide-resources` (barre relative, **zero €**) · `slide-moments` · `slide-sponsor`.
8. **Closing** (`/closing/`): `slide-thesis` · `slide-next` (backdrop `bg-stage`: silhouette ballerina sotto spot come immagine di chiusura; `noText="54,38,30,44"`). `nextHref` fa loop → Overture.

Catena nav: ogni pagina ha `prevHref`+`nextHref`; admin `PAGE_REGISTRY` registra tutte le
28 slide non-index (index escluso, come per agos).

### 21.2 Gating come controllo d'audience
Due solution id — **`asks`** (intera sezione sponsorship) e **`quest`** (le 2 slide
Boardroom Quest in frontiers). Servono a **condividere il deck con o senza la richiesta di
sponsorship**. Con `asks` off: visita diretta a `/asks/` redirige, e la freccia da `/plan/`
salta ad `/closing/` (in entrambe le direzioni). Con `quest` off: frontiers mostra 2 slide.
Verificato end-to-end (T16).

### 21.3 Disciplina dei fatti (fact sheet)
`docs/superpowers/research/2026-07-17-atelier-comparables.md` (24 claim verificati in modo
adversarial, lista refuted). Regole vincolanti applicate nel copy:
- **Cifre vendor con attribuzione esplicita** ("Consensus dichiara…", "studio Forrester
  commissionato da Reprise", "Moderna riferisce / dato del vendor"): Consensus $110M da
  Sumeru (2023), acquisizioni Peel+Saleo (2026), cicli −29–68%; Reprise Forrester TEI +60%
  pipeline (feb 2022); Moderna 750 GPT / 40% WAU (OpenAI, apr 2024); SAP serious game
  (S/4HANA board game 2020, BTP Diamond Game) **senza numeri di outcome**.
- **VIETATI** (lista refuted): "Consensus 15 of 30", qualsiasi deal Consensus/**SPI**
  (inesistente), numeri Walnut/Demostack/Klarna/Accenture/Microsoft-copilot, percentuali
  Learning-Pyramid. **Nessun benchmark BDR/SDR esterno** è sopravvissuto alla verifica →
  la storia KPI è **auto-misurata** (ci misuriamo noi), non presa in prestito.

### 21.4 Verifica (T16) — esito
`pnpm build` (tutte le app) verde; `pnpm --filter atelier typecheck` 0 errori. `audit:deck`
full 8 rotte × 3 viewport: **0 fallimenti hard**; gli unici soft `i` (space-usage) sono
sulle slide volutamente ariose e **whitelisted**: home cover+thesis, capability cover, asks
sponsor, closing thesis+next (NON si risolvono restringendo il type — Type & legibility
contract). Visual sweep letto a 1920 (EN + FR/IT sulle slide più dense): type generoso,
composizione bilanciata, nessun overflow, reveal visibile. Nav/gating/i18n verificati via
Playwright. URL deployati (`/`, `/method/`, `/plan/`, `/asks/`) → 200; hub linka atelier.

### 21.5b Pass de-celebrazione + sintesi grafica (20 lug 2026, commit `c49e7db`)
Su richiesta owner ("mai autocelebrativo" + "slide chiare/sintetiche, elementi grafici e
piani in formato Gantt"). **Copy de-celebrato** (EN/IT/FR, meaning-preserving, ±10%): tolti
lo staccato-brag "Weeks per experience. Not quarters." (genesis), "Enterprise-grade… this
deck is one of them" (overture cover), "deepest content model in the family" (UniCredit),
"this demo is real" (toggle), "in Adobe hands" (market), il tricolon "Touching it beats
both" (live-products) e il tetracolon "prove the craft" (closing). I fatti/URL portano la
prova; niente più editorializzazioni. **Sintesi grafica del piano:** nuova `slide-roadmap`
(Gantt 5×3, vedi §21.1) + `slide-kpi` da 4 righe → **scorecard 2×2** con metric-pill. Le
stat del metodo ("5 / 3 lingue / 12 check") restano: evidenza fattuale, non vanto.
**Audit** ancora 0 hard; nuovi soft accettati/whitelisted: `slide-roadmap` (`i` a
1440/1280 = left-weight del layout editoriale + `a` a 1280 = titolo alto perché riempie
l'89% dell'altezza) e `slide-kpi` (`a` a 1440/1280 = titolo ~27–29%, appena sopra banda).
Parità altezza EN/IT/FR a 1280 verificata (nessuno scroll; FR +1px vs EN).

### 21.5 Pending / note
- **Boardroom Quest** è **"in design"** nel deck (teaser concettuale, nessuna schermata
  finta): il gioco vero (motore PixiJS+inkjs, multiplayer) NON è costruito — è un
  workstream del piano. Materiale di ricerca del gioco: `~/Downloads/Boardroom Quest_….md`
  (non nel repo). Gate **brand/legal Adobe** prima di qualsiasi uso in workshop ufficiale.
- Il deck **presenta** il piano M1–M3; **non** implementa le sue feature (pilot, SSO,
  partner access, Quest) — quelle sono fuori scope di questo deliverable.

---

## 22. Modifiche core trasversali introdotte da Atelier (verificate su tutte le esperienze)

Due cambi in `packages/core` fatti per Atelier ma **propagati/verificati su tutte** (regola
di propagazione cross-experience in `CLAUDE.md`).

### 22.1 i18n trilingue (retrocompatibile) — `47bce98`, `2bbd988`, `c9fb186`
- **`blocks/i18n/T.astro`**: prop **`fr` opzionale** (lo span `data-lang-fr` si renderizza
  solo se passato); inoltre **inoltra attributi extra** (`data-reveal`, `aria-*`, `id`) al
  tag wrapper via `...rest` (prima li ingoiava → rompeva silenziosamente le reveal quando
  messe su `<T>`).
- **`blocks/i18n/LangToggle.astro`**: prop **`langs`** guidata (default `['en','it']`,
  tipata `Array<'en'|'it'|'fr'>`). Atelier passa `['en','it','fr']`.
- Le app bilingui esistenti sono **invariate** (nessuna passa `fr`/`langs`). Contratto
  consumer trilingue documentato nel docblock di `T`: un'app FR deve (a) whitelistare `'fr'`
  nell'anti-flash init del suo layout e (b) aggiungere le regole `html[data-lang="fr"]` di
  hide in `global.css` (il core non spedisce CSS di visibilità per `T`).

### 22.2 Fix gating dopo nav SPA — `e4e88ba` (atelier) + `56a7808` (le altre 5)
Il runtime inline di solution-gating in ogni `BaseLayout.astro` (nasconde slide gated,
riscrive `data-deck-next`/`data-deck-prev-href`) **girava solo al full load**: dopo nav
cross-sezione SPA (ClientRouter / `__edfNavigate`) le slide gated riapparivano e le
riscritture nav si perdevano. **Fix**: estratti `readActiveIds()` + `applyGating()`, chiamati
al load **e** su `astro:after-swap`, con guard `window.__edfSolGateBound` contro il
doppio-bind. Il redirect `pageSolutions` resta **solo** nel path di full load (mai dentro
after-swap, altrimenti forzerebbe un reload rompendo la SPA). Applicato a tutte e 6 le
esperienze (atelier, agos, ferrari, unicredit, maxmara, trenitalia); ri-applicazione
idempotente. Memoria `spa-gating-reapply`.


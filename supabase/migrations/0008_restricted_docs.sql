-- ════════════════════════════════════════════════════════════════════
--  0008 · restricted_docs — login-gated confidential documents
--  Backs the "Dossier Attribution" page (apps/unicredit-engagement/dossier).
--  Content lives HERE (RLS-protected), never in the static bundle. Readable
--  only by super admins or users with a role on the doc's experience
--  (granted from /console/users/). Bilingual IT/EN.
--  Idempotent: safe to re-run. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.restricted_docs (
  slug            text primary key,
  experience_slug text not null references public.experiences (slug) on delete cascade,
  content         jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

alter table public.restricted_docs enable row level security;

-- read: super admin, OR any user with a role on the doc's experience
drop policy if exists restricted_docs_select on public.restricted_docs;
create policy restricted_docs_select on public.restricted_docs
  for select using (
    public.is_super_admin()
    or exists (
      select 1 from public.user_experience_roles r
      where r.user_id = auth.uid()
        and r.experience_slug = restricted_docs.experience_slug
    )
  );

-- write: super admin only
drop policy if exists restricted_docs_super_all on public.restricted_docs;
create policy restricted_docs_super_all on public.restricted_docs
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ── seed: Dossier Attribution (UniCredit) ────────────────────────────
insert into public.restricted_docs (slug, experience_slug, content)
values (
  'unicredit-attribution',
  'unicredit-engagement',
  $doc$
{
  "title": { "it": "Dossier Attribution — UniCredit", "en": "Attribution Dossier — UniCredit" },
  "badge": { "it": "Adobe internal · Riservato", "en": "Adobe internal · Confidential" },
  "updated": { "it": "aggiornato 2 settembre 2026", "en": "updated 2 September 2026" },
  "disclaimer": {
    "it": "Documento di lavoro per il team Adobe. Accesso riservato via login (assegnato dal Console). Non far circolare fuori da Adobe. Fonti: meeting Giancarlini (riservato), thread interno e deep-research 2/09.",
    "en": "Working document for the Adobe team. Access restricted via login (granted from the Console). Do not circulate outside Adobe. Sources: Giancarlini meeting (confidential), internal thread and deep-research (Sep 2)."
  },
  "sections": [
    {
      "n": "01",
      "h": { "it": "La tesi", "en": "The thesis" },
      "items": [
        { "it": "<strong>Attribution ufficiale = last-touch, immutabile.</strong> Le vendite sono attribuite dal Group Data Office al canale che le registra a sistema (COR). È governance: non cambia, e Adobe non prova a cambiarla.", "en": "<strong>Official attribution = last-touch, immutable.</strong> Sales are credited by the Group Data Office to the channel that records them in the system (COR). It is governance: it will not change, and Adobe does not try to change it." },
        { "it": "<strong>Il vuoto: il lead-to-sale non è misurato.</strong> Nessuno strumento dice quanto app, filiale, contact center e agenti pesano su una vendita attribuita a un solo canale. Qui entra CJA come vista complementare.", "en": "<strong>The gap: lead-to-sale is not measured.</strong> No tool shows how much app, branch, contact centre and agents weigh on a sale credited to a single channel. This is where CJA fits, as a complementary view." },
        { "it": "<strong>La finestra è aperta.</strong> Un progetto di riconciliazione (in corso) abilita un programma pluriennale di attribution marketing multitouch (MTA+MMM): la scelta tecnologica non è ancora chiusa. È il momento per far pesare Adobe.", "en": "<strong>The window is open.</strong> A reconciliation project (in flight) enables a multi-year multitouch marketing-attribution programme (MTA+MMM): the technology choice is not yet locked. Now is the moment to make Adobe count." },
        { "it": "<strong>La leva commerciale: cost-per-click → cost-per-sale.</strong> Pagare le agenzie media sul risultato reale — sostenibile solo su una base di attribution solida e condivisa.", "en": "<strong>The commercial lever: cost-per-click → cost-per-sale.</strong> Pay media agencies on real outcomes — sustainable only on a solid, shared attribution base." }
      ]
    },
    {
      "n": "02",
      "h": { "it": "Il modello di attribuzione oggi", "en": "The attribution model today" },
      "items": [
        { "it": "<strong>Last-touch di GDO, blindato.</strong> La reportistica ufficiale attribuisce la vendita al canale che la mette in macchina (COR). CJA non la sostituisce: offre viste diverse sulla stessa domanda.", "en": "<strong>GDO last-touch, locked.</strong> Official reporting credits the sale to the channel that books it (COR). CJA does not replace it: it offers different views on the same question." },
        { "it": "<strong>Canali 3+1:</strong> self (app + sito), filiale, UCD (contact center), più gli agenti monomandatari (jolly, solo alcuni prodotti).", "en": "<strong>Channels 3+1:</strong> self (app + web), branch, UCD (contact centre), plus tied agents (a wildcard, only some products)." },
        { "it": "<strong>Piattaforme:</strong> UCX per prestiti e carte di credito (in arrivo set/ott 2026); altri prodotti su piattaforme legacy. Il dato di vendita nasce frammentato tra sistemi.", "en": "<strong>Platforms:</strong> UCX for loans and credit cards (arriving Sep/Oct 2026); other products on legacy platforms. Sales data is born fragmented across systems." },
        { "it": "<strong>Il bisogno reale:</strong> pesare il contributo lead-to-sale per (1) orchestrare gli use case e aumentare le vendite, (2) dare ai team target quantitativi e sistema incentivante. Sul mondo interno non c'è una roadmap: è lavoro di cultura e workshop.", "en": "<strong>The real need:</strong> weigh the lead-to-sale contribution to (1) orchestrate use cases and grow sales, (2) give teams quantitative targets and incentives. There is no roadmap on the internal side: it is culture and workshop work." }
      ]
    },
    {
      "n": "03",
      "h": { "it": "La finestra — le due tracce", "en": "The window — the two tracks" },
      "items": [
        { "it": "<strong>Traccia A — Riconciliazione (si chiude nel 2026).</strong> Ingestion dei dati comportamentali e di marketing channel di Adobe in Palantir Foundry, riconciliati col venduto per abilitare il cost-per-sale (conti, carte prepagate, prestiti; poi carte di credito e mutui).", "en": "<strong>Track A — Reconciliation (closes in 2026).</strong> Ingestion of Adobe behavioural and marketing-channel data into Palantir Foundry, reconciled with sales to enable cost-per-sale (accounts, prepaid cards, loans; then credit cards and mortgages)." },
        { "it": "<strong>Traccia B — Attribution marketing multitouch (pluriennale).</strong> Un modello mixed/multitouch (MTA + MMM), non deterministico, per le campagne media e l'ottimizzazione del budget. Qui la scelta tecnologica è aperta: modello Adobe out-of-the-box vs build custom.", "en": "<strong>Track B — Multitouch marketing attribution (multi-year).</strong> A mixed/multitouch model (MTA + MMM), not deterministic, for media campaigns and budget optimization. Here the technology choice is open: Adobe out-of-the-box vs custom build." },
        { "it": "<strong>Il ponte, «the time is now».</strong> La Traccia A abilita la Traccia B. C'è roadmap di gruppo e budget pluriennale: è la finestra per influenzare la scelta tecnologica prima che si cristallizzi sul build custom. Next step: incontro dedicato con l'owner della Traccia B.", "en": "<strong>The bridge, «the time is now».</strong> Track A enables Track B. There is a group roadmap and multi-year budget: this is the window to influence the tech choice before it crystallises on a custom build. Next step: a dedicated meeting with the Track B owner." }
      ]
    },
    {
      "n": "04",
      "h": { "it": "Mappa organizzativa", "en": "Org map" },
      "note": { "it": "⚠️ Nomi/ruoli da trascrizione AI del meeting: verificare prima di ogni contatto.", "en": "⚠️ Names/roles from an AI transcript of the meeting: verify before any contact." },
      "people": [
        { "name": "Davide Giancarlini", "role": { "it": "UniCredit — owner riconciliazione (Traccia A)", "en": "UniCredit — reconciliation owner (Track A)" }, "note": { "it": "Nostro sponsor tecnico/di processo. Punto d'ingresso al mondo attribution. Riaggiornamento post-ferie.", "en": "Our technical/process sponsor. Entry point to the attribution world. Re-sync after the summer break." } },
        { "name": "Chris Ramler", "role": { "it": "UniCredit — owner attribution marketing MTA+MMM (Traccia B)", "en": "UniCredit — marketing attribution owner, MTA+MMM (Track B)" }, "note": { "it": "Qui è la finestra tecnologica. Da fissare un incontro. Deve restare agnostico rispetto alla tecnologia.", "en": "The tech window sits here. A meeting to be scheduled. He must stay technology-agnostic." } },
        { "name": "Lombardo", "role": { "it": "UniCredit — responsabile asset Foundry", "en": "UniCredit — Foundry asset owner" }, "note": { "it": "Governance, ingestion, data quality. Decide se portare il dato transazionale su un sistema esterno.", "en": "Governance, ingestion, data quality. Decides whether to move transactional data to an external system." } },
        { "name": "Alberto Ricciotti", "role": { "it": "UniCredit — Local Data Office (unità di GDO)", "en": "UniCredit — Local Data Office (a GDO unit)" }, "note": { "it": "Costruisce i modelli di riconciliazione e multitouch attribution (struttura interna, non IT digital).", "en": "Builds the reconciliation and multitouch-attribution models (internal unit, not digital IT)." } },
        { "name": "Loreto del Monte", "role": { "it": "UniCredit — costruzione mondo riconciliazione/attribution", "en": "UniCredit — building the reconciliation/attribution world" }, "note": { "it": "Lavora con il partner esterno Big Bang / Bit Bang.", "en": "Works with the external partner Big Bang / Bit Bang." } },
        { "name": "Porro", "role": { "it": "UniCredit — Group Finance (area CFO)", "en": "UniCredit — Group Finance (CFO area)" }, "note": { "it": "A monte della catena dati vendite. Contesto di governance.", "en": "Upstream of the sales-data chain. Governance context." } },
        { "name": "Big Bang / Bit Bang", "role": { "it": "Partner esterno del cliente", "en": "Client's external partner" }, "note": { "it": "Implementa i modelli con LDO. Possibile resistenza al cambio verso un modello Adobe: gestire, non ignorare.", "en": "Implements the models with LDO. Possible resistance to switching to an Adobe model: manage it, do not ignore it." } }
      ]
    },
    {
      "n": "05",
      "h": { "it": "Le big ideas Adobe × attribution", "en": "The Adobe × attribution big ideas" },
      "items": [
        { "it": "<strong>La vista complementare, non il sostituto.</strong> CJA come layer di viste cross-channel sopra il last-touch ufficiale: zero conflitto con il data office.", "en": "<strong>The complementary view, not the substitute.</strong> CJA as a layer of cross-channel views on top of official last-touch: zero conflict with the data office." },
        { "it": "<strong>Cost-per-sale, davvero.</strong> Riconciliare navigazione → vendita e pagare il budget media sul valore reale, non sul click.", "en": "<strong>Cost-per-sale, for real.</strong> Reconcile navigation → sale and pay media budget on real value, not on clicks." },
        { "it": "<strong>MTA + MMM nativi.</strong> Marketing Campaign Analytics (ex Mix Modeler): Causal AI, full-funnel attribution, incrementalità e budget optimization agentica — alternativa al build a mano.", "en": "<strong>Native MTA + MMM.</strong> Marketing Campaign Analytics (formerly Mix Modeler): Causal AI, full-funnel attribution, incrementality and agentic budget optimization — an alternative to a hand-built model." },
        { "it": "<strong>Dal monitoring all'orchestrazione.</strong> Misurare il contributo dei canali per instradare i lead, scegliere il next-best-channel e dare ai team target quantitativi.", "en": "<strong>From monitoring to orchestration.</strong> Measure channel contribution to route leads, pick the next-best-channel and give teams quantitative targets." },
        { "it": "<strong>Estendere il perimetro.</strong> DEM e altri canali owned oggi fuori dallo scope: opportunità di misurazione end-to-end (da validare).", "en": "<strong>Extend the perimeter.</strong> DEM and other owned channels currently out of scope: an end-to-end measurement opportunity (to be validated)." }
      ]
    },
    {
      "n": "06",
      "h": { "it": "Adobe Day — il workshop", "en": "Adobe Day — the workshop" },
      "items": [
        { "it": "<strong>Cos'è:</strong> workshop col cliente, co-condotto Adobe + Accenture — storia end-to-end su slide più demo dei prodotti.", "en": "<strong>What it is:</strong> a client workshop, co-run by Adobe + Accenture — an end-to-end story on slides plus product demos." },
        { "it": "<strong>Quando:</strong> target settimana del 14 settembre 2026, mezza giornata. Dry-run Adobe+Accenture nella settimana del 7 settembre.", "en": "<strong>When:</strong> target week of 14 September 2026, half a day. Adobe+Accenture dry-run in the week of 7 September." },
        { "it": "<strong>Dove:</strong> on-site dal cliente (riduce il rischio di no-show).", "en": "<strong>Where:</strong> on-site at the client (lowers the no-show risk)." },
        { "it": "<strong>Blocco aperto:</strong> in attesa della conferma del piano pluriennale del cliente per il fine-tuning; le date le sblocca il cliente.", "en": "<strong>Open blocker:</strong> awaiting the client's multi-year plan confirmation for fine-tuning; the client unlocks the dates." },
        { "it": "<strong>Mossa strategica:</strong> l'agenda oggi è demo-led. Elevare l'attribution (lead-to-sale + MTA/MMM) a filo conduttore, da spingere al dry-run.", "en": "<strong>Strategic move:</strong> the agenda is demo-led today. Elevate attribution (lead-to-sale + MTA/MMM) to the through-line, to push at the dry-run." }
      ],
      "people": [
        { "name": "Myriam Vegliante", "role": { "it": "Adobe — Strategic Customers, Product Sales (lead coordinamento)", "en": "Adobe — Strategic Customers, Product Sales (coordination lead)" }, "note": { "it": "Regia lato Adobe: agenda, stakeholder, chiusura.", "en": "Adobe-side lead: agenda, stakeholders, closing." } },
        { "name": "Antonio Gargiulo", "role": { "it": "Adobe — owner account UniCredit", "en": "Adobe — UniCredit account owner" }, "note": { "it": "Regia narrativa attribution e relazione.", "en": "Attribution narrative and relationship lead." } },
        { "name": "Team Adobe", "role": { "it": "Adobe — sul thread", "en": "Adobe — on the thread" }, "note": { "it": "Luca Pellerei, Giulia Pagnanelli, Alex Gordiani, Marco Lapiccirella.", "en": "Luca Pellerei, Giulia Pagnanelli, Alex Gordiani, Marco Lapiccirella." } },
        { "name": "Team Accenture", "role": { "it": "Accenture — co-host", "en": "Accenture — co-host" }, "note": { "it": "Jonathan Negri (interfaccia col cliente), Lorenzo Magnani, Massimiliano Parri, + Chiara Cerutti (prep).", "en": "Jonathan Negri (client interface), Lorenzo Magnani, Massimiliano Parri, + Chiara Cerutti (prep)." } },
        { "name": "Cristina + IT", "role": { "it": "UniCredit — sponsor canali digitali + IT", "en": "UniCredit — digital-channels sponsor + IT" }, "note": { "it": "Sponsor che disegna l'iniziativa; obiettivo: presenza di sponsor e IT.", "en": "Sponsor shaping the initiative; goal: sponsor and IT in the room." } },
        { "name": "Ruoli Adobe da assegnare", "role": { "it": "3 competenze chiave per il taglio attribution", "en": "3 key skills for the attribution cut" }, "note": { "it": "SC per demo CJA; specialist Marketing Campaign Analytics (MTA+MMM); data architect AEP ↔ Foundry (tema CJA vs build custom).", "en": "SC for the CJA demo; Marketing Campaign Analytics specialist (MTA+MMM); AEP ↔ Foundry data architect (CJA vs custom-build topic)." } }
      ]
    },
    {
      "n": "07",
      "h": { "it": "CJA vs build custom su Foundry", "en": "CJA vs a custom Foundry build" },
      "items": [
        { "it": "<strong>Prodotto pacchettizzato vs build a mano.</strong> Marketing Campaign Analytics unifica MMM + MTA in un prodotto (AI bidirectional-transfer, dati summary- e touchpoint-level) e si integra con CJA (common channel definitions).", "en": "<strong>Packaged product vs hand-built.</strong> Marketing Campaign Analytics unifies MMM + MTA in one product (bidirectional-transfer AI, summary- and touchpoint-level data) and integrates with CJA (common channel definitions)." },
        { "it": "<strong>CJA fa già attribution lead-to-revenue</strong> person-level (B2B Edition: modelli linear/U-shaped/time-decay/last-touch, lookback 13 mesi).", "en": "<strong>CJA already does person-level lead-to-revenue attribution</strong> (B2B Edition: linear/U-shaped/time-decay/last-touch models, 13-month lookback)." },
        { "it": "<strong>Il dato transazionale.</strong> Oggi su Foundry: va portato (o esposto) al layer di analytics, altrimenti si è ciechi. Mitigazione: minimizzare (venduto/non-venduto booleano) — sub-ottimale ma percorribile.", "en": "<strong>Transactional data.</strong> Today on Foundry: it must be brought (or exposed) to the analytics layer, otherwise you are blind. Mitigation: minimise (sold/not-sold boolean) — sub-optimal but workable." },
        { "it": "<strong>Onestà intellettuale.</strong> L'integrazione più profonda incrementalità↔dashboard CJA è data come «in development»; non esiste un confronto pubblico feature-by-feature Adobe vs Foundry. Meglio dichiararlo che gonfiarlo.", "en": "<strong>Intellectual honesty.</strong> The deepest incrementality↔CJA-dashboard integration is stated as «in development»; there is no public feature-by-feature Adobe-vs-Foundry comparison. Better to state it than to inflate it." }
      ]
    },
    {
      "n": "08",
      "h": { "it": "Da dire / da non dire", "en": "Say / don't say" },
      "say": [
        { "it": "CJA è una vista complementare: arricchisce il modello ufficiale, non lo tocca.", "en": "CJA is a complementary view: it enriches the official model, it does not touch it." },
        { "it": "Il cost-per-sale ha senso solo su un'attribution condivisa: «diventa un contratto, non una disputa».", "en": "Cost-per-sale only works on shared attribution: «it becomes a contract, not a dispute»." },
        { "it": "MTA e MMM sono complementari (tattico settimanale vs strategico trimestrale), causali con l'incrementalità.", "en": "MTA and MMM are complementary (weekly tactical vs quarterly strategic), causal with incrementality." },
        { "it": "MMM è privacy-safe: non traccia il singolo utente — vantaggio nel contesto GDPR.", "en": "MMM is privacy-safe: it does not track the individual user — an advantage in the GDPR context." }
      ],
      "dont": [
        { "it": "Che CJA sostituisca o cambi l'attribution ufficiale del data office: è escluso.", "en": "That CJA replaces or changes the data office's official attribution: it is ruled out." },
        { "it": "Che Adobe sia un'alternativa alla data platform del cliente: è un layer integrabile, non un rip & replace.", "en": "That Adobe is an alternative to the client's data platform: it is an integrable layer, not a rip & replace." },
        { "it": "Reference bancarie Adobe come fatti verificati finché l'Industry team non le conferma pubbliche.", "en": "Adobe banking references as verified facts until the Industry team confirms them public." },
        { "it": "Cifre economiche o dettagli contrattuali in stanza.", "en": "Any financial figures or contractual details in the room." }
      ]
    },
    {
      "n": "09",
      "h": { "it": "Evidenze (deep-research)", "en": "Evidence (deep-research)" },
      "note": { "it": "Sintesi verificata con voto avversariale a 3 voti (2/09). Le affermazioni pro-Adobe sono vendor-positioning, non benchmark indipendenti.", "en": "Synthesis verified with 3-vote adversarial checks (Sep 2). Pro-Adobe claims are vendor-positioning, not independent benchmarks." },
      "items": [
        { "it": "<strong>Il last-touch è debole nel banking:</strong> correlazionale non causale, non vede i touchpoint offline (filiale, contact center, agenti), sovra-accredita l'ultimo tocco digitale (+30% e oltre).", "en": "<strong>Last-touch is weak in banking:</strong> correlational not causal, blind to offline touchpoints (branch, contact centre, agents), over-credits the last digital touch (+30% and more)." },
        { "it": "<strong>MMM è il metodo adatto</strong> con spesa offline alta, cicli lunghi e identità parziale — la realtà lead-to-sale di una banca — ed è resiliente a privacy e cookie.", "en": "<strong>MMM is the right method</strong> with high offline spend, long cycles and partial identity — a bank's lead-to-sale reality — and is resilient to privacy and cookies." },
        { "it": "<strong>MTA + MMM sono complementari, non alternativi;</strong> nessuno dei due è causale senza esperimenti di incrementalità.", "en": "<strong>MTA + MMM are complementary, not alternative;</strong> neither is causal without incrementality experiments." },
        { "it": "<strong>Il cost-per-sale puro è raro</strong> e regge solo con un'attribution robusta: le dispute su «cosa conta» sono il rischio che rompe questi contratti.", "en": "<strong>Pure cost-per-sale is rare</strong> and holds only with robust attribution: disputes over «what counts» are the risk that breaks these contracts." }
      ]
    },
    {
      "n": "10",
      "h": { "it": "Domande aperte", "en": "Open questions" },
      "items": [
        { "it": "Data confermata dell'Adobe Day (dipende dal cliente) e decisione se elevare l'attribution a filo conduttore.", "en": "Confirmed Adobe Day date (client-dependent) and the decision whether to make attribution the through-line." },
        { "it": "Verifica nomi/ruoli §4 (trascrizione AI) prima di ogni contatto.", "en": "Verify names/roles in §4 (AI transcript) before any contact." },
        { "it": "Reference bancarie Adobe citabili in EMEA/Italia: la ricerca non ne ha confermate di pubbliche — chiudere con Industry team.", "en": "Adobe banking references usable in EMEA/Italy: research confirmed none public — close with the Industry team." },
        { "it": "Ruolo SI di Accenture nei programmi di attribution/measurement: definirlo internamente col team ACN.", "en": "Accenture's SI role in attribution/measurement programmes: define it internally with the ACN team." }
      ]
    },
    {
      "n": "11",
      "h": { "it": "Fonti", "en": "Sources" },
      "sources": [
        { "label": "The Financial Brand — attribution dilemma in banking", "url": "https://thefinancialbrand.com/news/bank-cross-selling/solving-the-marketing-sales-attribution-dilemma-in-banking-145732", "tipo": "settore" },
        { "label": "Improvado — MMM vs multi-touch attribution", "url": "https://improvado.io/blog/mmm-vs-multi-touch-attribution", "tipo": "analisi" },
        { "label": "Haus.io — MTA vs MMM", "url": "https://www.haus.io/blog/mta-vs-mmm-choosing-between-multi-touch-attribution-and-marketing-mix-modeling", "tipo": "analisi" },
        { "label": "Funnel.io — MTA vs MMM (privacy, granularità)", "url": "https://funnel.io/blog/mta-vs-mmm", "tipo": "analisi" },
        { "label": "TapClicks — MTA e MMM insieme (2026)", "url": "https://www.tapclicks.com/blog/marketing-attribution-in-2026-why-multi-touch-and-marketing-mix-modeling-have-to-work-together", "tipo": "analisi" },
        { "label": "Adobe — CJA B2B Edition, multi-touch attribution", "url": "https://business.adobe.com/products/adobe-analytics/customer-journey-analytics-b2b-edition/b2b-multi-touch-attribution.html", "tipo": "Adobe" },
        { "label": "Adobe — Mix Modeler / Marketing Campaign Analytics", "url": "https://business.adobe.com/products/mix-modeler.html", "tipo": "Adobe" },
        { "label": "EY × Adobe Mix Modeler (alliance)", "url": "https://www.ey.com/en_us/alliances/adobe-mix-modeler", "tipo": "SI" },
        { "label": "SevenFigureAgency — modelli pay-per-performance (rischi CPS)", "url": "https://sevenfigureagency.com/15-pay-per-performance-agency-models-explained/", "tipo": "analisi" }
      ]
    }
  ]
}
  $doc$::jsonb
)
on conflict (slug) do update
  set content = excluded.content, updated_at = now();

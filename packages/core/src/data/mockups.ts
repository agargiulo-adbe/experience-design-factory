/**
 * MOCKUP_LIBRARY — fonte unica di verità per i mockup prodotto Adobe.
 * Ogni experience eredita questa libreria; le funzionalità visibili dipendono
 * dalle soluzioni abilitate (solutionId) e dalla configurazione admin.
 *
 * relevantTo: array di section-slug o slide-id dove la feature è più utile.
 * maxVisible: quante scene mostra il mockup in una singola slide dedicata.
 */

export interface MockupFeature {
  id: string;
  nameEn: string;
  nameIt: string;
  descEn: string;
  descIt: string;
  /** Section slugs + slide IDs where this feature is most impactful */
  relevantTo: string[];
}

export interface ProductMockup {
  id: string;
  solutionId: string;
  nameEn: string;
  nameIt: string;
  /** How many features the mockup plays in sequence on the dedicated slide */
  maxVisible: number;
  features: MockupFeature[];
}

export const MOCKUP_LIBRARY: ProductMockup[] = [
  // ── GenStudio for Performance Marketing ─────────────────────────────────
  {
    id: 'genstudio',
    solutionId: 'genstudio',
    nameEn: 'GenStudio for Performance Marketing',
    nameIt: 'GenStudio for Performance Marketing',
    maxVisible: 3,
    features: [
      {
        id: 'brief-to-variants',
        nameEn: 'Brief → Variants',
        nameIt: 'Brief → Varianti',
        descEn: 'One campaign brief — brand, persona, product — generates 4 on-brand ad variants in seconds across Meta, LinkedIn and display.',
        descIt: 'Un brief di campagna — brand, persona, prodotto — genera 4 varianti on-brand in secondi per Meta, LinkedIn e display.',
        relevantTo: ['create', 'slide-genstudio', 'loop', 'slide-loop'],
      },
      {
        id: 'brand-check',
        nameEn: 'Brand compliance check',
        nameIt: 'Controllo conformità brand',
        descEn: 'Every variant is validated against Ferrari brand guidelines — Rosso Corsa, logo usage, tone — before it can go live. No human bottleneck.',
        descIt: 'Ogni variante viene verificata rispetto alle linee guida Ferrari — Rosso Corsa, uso del logo, tono — prima della pubblicazione. Zero colli di bottiglia.',
        relevantTo: ['create', 'slide-guardrails', 'loop'],
      },
      {
        id: 'channel-activation',
        nameEn: 'Channel activation',
        nameIt: 'Attivazione canale',
        descEn: 'Push approved variants directly to Meta Ads Manager, LinkedIn Campaign Manager and TikTok — without leaving GenStudio.',
        descIt: 'Pubblica le varianti approvate direttamente su Meta Ads Manager, LinkedIn Campaign Manager e TikTok — senza uscire da GenStudio.',
        relevantTo: ['activate', 'slide-activation', 'loop'],
      },
      {
        id: 'insights-dashboard',
        nameEn: 'Performance insights',
        nameIt: 'Insight sulle performance',
        descEn: 'CTR per variant, AI attribute analysis — emotional tone, photography style, persuasion technique — linked directly to conversion data.',
        descIt: 'CTR per variante, analisi attributi AI — tono emotivo, stile fotografico, tecnica persuasiva — collegati direttamente ai dati di conversione.',
        relevantTo: ['analisi', 'slide-cja', 'proof', 'loop'],
      },
      {
        id: 'express-quick-edit',
        nameEn: 'Adobe Express quick edit',
        nameIt: 'Modifica rapida Adobe Express',
        descEn: 'Non-designers on the partner side adapt approved assets with brand-locked Express templates — social posts, banners — in a few clicks.',
        descIt: 'Chi non è designer, lato partner, adatta gli asset approvati con template Express brand-locked in pochi clic.',
        relevantTo: ['create', 'slide-express'],
      },
      {
        id: 'translation',
        nameEn: '40+ language translation',
        nameIt: 'Traduzione in 40+ lingue',
        descEn: 'Translate approved ads in 40+ languages out of the box — no third-party integration, no extra briefing.',
        descIt: 'Traduci gli annunci approvati in 40+ lingue, natively — zero integrazioni di terze parti, zero brief aggiuntivi.',
        relevantTo: ['create', 'loop', 'activate'],
      },
    ],
  },

  // ── Real-Time CDP Collaboration ──────────────────────────────────────────
  {
    id: 'rtcdp-collab',
    solutionId: 'rtcdp-collab',
    nameEn: 'Real-Time CDP Collaboration',
    nameIt: 'Real-Time CDP Collaboration',
    maxVisible: 3,
    features: [
      {
        id: 'discover-overlap',
        nameEn: 'Audience overlap — Discover',
        nameIt: 'Overlap audience — Discover',
        descEn: 'Ferrari × HP: see exactly which fan segments you share — size, affinity, geography — without either party moving a single identity.',
        descIt: 'Ferrari × HP: vedi esattamente quali segmenti fan avete in comune — dimensione, affinità, geo — senza spostare un\'identità.',
        relevantTo: ['define', 'slide-collab', 'slide-audiences'],
      },
      {
        id: 'activate-audiences',
        nameEn: 'Secure audience activation',
        nameIt: 'Attivazione audience sicura',
        descEn: 'Build shared audiences for CTV, paid media and on-site channels — no raw customer data ever leaves Ferrari or the partner.',
        descIt: 'Costruisci audience condivise per CTV, paid media e canali on-site — nessun dato cliente grezzo lascia mai Ferrari o il partner.',
        relevantTo: ['define', 'activate', 'loop'],
      },
      {
        id: 'measure-attribution',
        nameEn: 'Campaign attribution — Measure',
        nameIt: 'Attribuzione campagna — Measure',
        descEn: 'On-demand attribution dashboards combining audience data, ad exposure and conversion — exportable directly to CJA and Mix Modeler.',
        descIt: 'Dashboard di attribuzione on-demand che combinano dati audience, esposizione agli annunci e conversione — esportabili direttamente in CJA e Mix Modeler.',
        relevantTo: ['analisi', 'proof', 'slide-insights'],
      },
      {
        id: 'clean-sketches',
        nameEn: 'Clean Sketches — Privacy tech',
        nameIt: 'Clean Sketches — Privacy tech',
        descEn: 'Patent-pending: noise injection, zero identity movement, minimum audience sizes, role-based access and audit logs. Privacy by design — not by policy.',
        descIt: 'Brevettato: noise injection, zero movimento identità, dimensioni minime audience, accesso per ruolo e audit log. Privacy by design — non by policy.',
        relevantTo: ['define', 'slide-privacy'],
      },
      {
        id: 'collaboration-starter',
        nameEn: 'Collaboration Starter',
        nameIt: 'Collaboration Starter',
        descEn: 'Invite an unlicensed partner via email — Adobe provisions their instance and funds onboarding up to 50M IDs. Zero friction for the partner.',
        descIt: 'Invita un partner senza licenza via email — Adobe provisiona la sua istanza e finanzia l\'onboarding fino a 50M ID. Zero attrito per il partner.',
        relevantTo: ['define', 'protagonisti', 'slide-collab'],
      },
    ],
  },

  // ── Customer Journey Analytics ───────────────────────────────────────────
  {
    id: 'cja',
    solutionId: 'cja',
    nameEn: 'Customer Journey Analytics',
    nameIt: 'Customer Journey Analytics',
    maxVisible: 3,
    features: [
      {
        id: 'cross-partner-view',
        nameEn: 'Cross-partner performance',
        nameIt: 'Performance cross-partner',
        descEn: 'Compare HP, Shell, Puma, IBM side by side in one Ferrari CJA instance — which partner drove the most audience value this season.',
        descIt: 'Confronta HP, Shell, Puma, IBM fianco a fianco in un\'unica istanza CJA Ferrari — quale partner ha portato più valore di audience questa stagione.',
        relevantTo: ['analisi', 'slide-aggregate', 'proof'],
      },
      {
        id: 'season-insights',
        nameEn: 'Season insights — deal evidence',
        nameIt: 'Insight di stagione — prove per il deal',
        descEn: 'ROI per partnership, quantified — the evidence Ferrari brings to sponsor renewals and net-new pitches. One season\'s data, one shared view.',
        descIt: 'ROI per partnership, quantificato — le prove che Ferrari porta ai rinnovi e ai pitch di nuovi sponsor. Una stagione di dati, una vista condivisa.',
        relevantTo: ['analisi', 'slide-insights', 'proof'],
      },
      {
        id: 'ai-attribution',
        nameEn: 'AI attribute analysis',
        nameIt: 'Analisi attributi AI',
        descEn: 'Which creative elements — emotional tone, reading level, photography style, audio genre — drove CTR and CPA across all partner campaigns.',
        descIt: 'Quali elementi creativi — tono emotivo, livello di lettura, stile fotografico, genere audio — hanno guidato CTR e CPA su tutte le campagne partner.',
        relevantTo: ['analisi', 'proof', 'loop'],
      },
      {
        id: 'cross-channel-dashboard',
        nameEn: 'Cross-channel unified view',
        nameIt: 'Vista unificata cross-channel',
        descEn: 'Web, app, social, CRM and on-site — all partner touchpoints in a single CJA dashboard. Race by race, campaign by campaign.',
        descIt: 'Web, app, social, CRM e on-site — tutti i touchpoint partner in un\'unica dashboard CJA. Gara per gara, campagna per campagna.',
        relevantTo: ['analisi', 'slide-cja'],
      },
    ],
  },

  // ── Adobe Express ────────────────────────────────────────────────────────
  {
    id: 'express',
    solutionId: 'express',
    nameEn: 'Adobe Express',
    nameIt: 'Adobe Express',
    maxVisible: 2,
    features: [
      {
        id: 'brand-locked-templates',
        nameEn: 'Brand-locked templates',
        nameIt: 'Template brand-locked',
        descEn: 'Creative team locks Rosso Corsa, logo placement and typography. Partner teams edit only what they should — nothing more.',
        descIt: 'Il team creativo blocca Rosso Corsa, posizionamento logo e tipografia. I team partner modificano solo ciò che devono — niente di più.',
        relevantTo: ['create', 'slide-express'],
      },
      {
        id: 'last-mile-edit',
        nameEn: 'Last-mile partner edits',
        nameIt: 'Modifiche last-mile dei partner',
        descEn: 'Non-designers on the partner side adapt approved assets for social posts, banners and event flyers — fast, safe and on-brand.',
        descIt: 'Chi non è designer, lato partner, adatta gli asset approvati per post social, banner e flyer evento — veloce, sicuro e on-brand.',
        relevantTo: ['create', 'activate', 'slide-express'],
      },
      {
        id: 'express-translation',
        nameEn: 'In-canvas translation',
        nameIt: 'Traduzione in-canvas',
        descEn: 'Translate any Express template ad in 40+ languages — swap text, regenerate translated fragments, swap images per region — without leaving the canvas.',
        descIt: 'Traduci qualsiasi template Express in 40+ lingue — sostituisci testo, rigenera frammenti tradotti, cambia immagini per regione — senza uscire dal canvas.',
        relevantTo: ['create', 'activate'],
      },
    ],
  },
];

/** Returns suggested features for a given section, sorted by relevance */
export function getSuggestedFeatures(
  mockup: ProductMockup,
  sectionId: string,
): MockupFeature[] {
  return [...mockup.features].sort((a, b) => {
    const aScore = a.relevantTo.includes(sectionId) ? 1 : 0;
    const bScore = b.relevantTo.includes(sectionId) ? 1 : 0;
    return bScore - aScore;
  });
}

/** Returns features pre-selected for a section (up to maxVisible) */
export function getDefaultFeatures(
  mockup: ProductMockup,
  sectionId: string,
): string[] {
  return getSuggestedFeatures(mockup, sectionId)
    .slice(0, mockup.maxVisible)
    .map((f) => f.id);
}

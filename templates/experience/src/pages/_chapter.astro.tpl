---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import DeckContainer from '@edf/core/blocks/immersive/DeckContainer.astro';
import Slide from '@edf/core/blocks/immersive/Slide.astro';
import HowItWorks from '@edf/core/blocks/HowItWorks.astro';
import T from '@edf/core/blocks/i18n/T.astro';
import { href } from '@edf/core/utils/url.js';
import { CHAPTERS, prevSlug, nextSlug } from '../data/chapters';
__CH_FRONTMATTER_EXTRA__
const SLUG = '__CH_SLUG__';
const ch = CHAPTERS.find((c) => c.slug === SLUG)!;
const base = import.meta.env.BASE_URL;
const currentPath = Astro.url.pathname;

/* ════════════════════════════════════════════════════════════════════════
   ANCORE, NON PROSA — la regola di questa slide, prima di scriverla.

   Chi guarda LEGGE, e mentre legge non ascolta chi parla. Il redundancy
   principle lo misura: si impara meglio da grafica + voce che da grafica +
   voce + testo a schermo. La condizione al contorno è la parte utile:
   etichette BREVI, messe accanto alla cosa che descrivono, aiutano, perché
   guidano l'attenzione invece di competere con la voce.

   Quindi, su ogni slide di contenuto:
     · una ANCORA per concetto — massimo 6 parole, è un nome non una frase;
     · UNA riga di lead, il punto della slide, massimo ~15 parole;
     · tutto il resto dietro <HowItWorks>, così il deck inoltrato regge
       comunque senza riempire la pagina di paragrafi;
     · e dove si spiega un meccanismo, si DISEGNA: un diagramma con le
       ancore attaccate ai nodi batte tre card di testo, sempre.

   Il segnaposto qui sotto è ANCORE. Se ti ritrovi a scrivere tre paragrafi
   dentro tre card, stai rifacendo l'errore che questa forma esiste per
   impedire. Vedi CLAUDE.md → «Ancore, non prosa» e la skill
   `skills/experience-design/references/ancore-non-prosa.md`.
   ════════════════════════════════════════════════════════════════════════ */
const ancore = [
  { it: 'La prima ancora', en: 'The first anchor' },
  { it: 'La seconda', en: 'The second' },
  { it: 'La terza', en: 'The third' },
];
---
<BaseLayout title={ch.title.it}>
  <div class="fixed top-0 left-0 right-0 z-50">
    <Navigation currentPath={currentPath} base={base} />
  </div>

  <DeckContainer nextHref={href(base, nextSlug(SLUG))} prevHref={href(base, prevSlug(SLUG))}>

    <!-- ── Cover del capitolo ────────────────────────────────────────────── -->
    <Slide id="slide-cover" bg="inverse" align="center">
      <div slot="backdrop" class="ex-bg-night"></div>
      <div class="ex-ch" data-reveal>
        <p class="ex-ch-num"><span data-lang-it>Capitolo {ch.num}</span><span data-lang-en>Chapter {ch.num}</span></p>
        <T as="h2" class="ex-ch-title" it={ch.title.it} en={ch.title.en} data-reveal data-reveal-delay="0.08" />
        <!-- Una riga sola. Sulla copertina di capitolo non va un paragrafo. -->
        <T as="p" class="ex-ch-lead" it="__CH_COVER_LEAD_IT__" en="__CH_COVER_LEAD_EN__" data-reveal data-reveal-delay="0.15" />
      </div>
    </Slide>

    <!-- ── Contenuto: ancore in pagina, prosa dietro «Scopri come» ───────── -->
    <Slide id="slide-contenuto" bg="primary" align="left">
      <div slot="backdrop" class="ex-bg-paper"></div>
      <div class="ex-content" data-reveal>
        <div class="ex-head">
          <T as="p" class="slide-eyebrow" it={ch.title.it} en={ch.title.en} />
          <!-- Il titolo È il punto della slide, non la sua etichetta. -->
          <T as="h2" class="ex-head-title" it="Il punto di questo capitolo, in una riga" en="The point of this chapter, in one line" />
          <!-- Una riga. Se ne servono due, la seconda va nel drill-down. -->
          <T as="p" class="ex-head-lead" it="La conseguenza, detta in una frase breve." en="The consequence, said in one short sentence." />
        </div>

        <div class="ex-ancore" data-reveal data-reveal-delay="0.14">
          {ancore.map((a) => (<T as="p" class="ex-ancora" it={a.it} en={a.en} />))}
        </div>

        <div class="ex-dett" data-reveal data-reveal-delay="0.22">
          <HowItWorks title="Che cosa vuol dire, una per una" tone="onLight">
            <T as="p" it="Qui va la prosa che prima stava in pagina: i fatti del cliente, i numeri con la fonte, il vincolo detto prima che lo chiedano. Serve perché il deck viene inoltrato e deve reggere senza chi l’ha presentato." en="Here goes the prose that used to sit on the page: the client’s facts, the figures with their source, the constraint declared before they ask. It is needed because the deck gets forwarded and has to hold up without the presenter." />
          </HowItWorks>
        </div>

        <T as="p" class="ex-src" it="Fonte: da citare slide per slide, con il link alla pagina pubblica." en="Source: to be cited slide by slide, with the link to the public page." data-reveal data-reveal-delay="0.3" />
      </div>
    </Slide>
__SIGNATURE_SLIDE__
  </DeckContainer>
</BaseLayout>

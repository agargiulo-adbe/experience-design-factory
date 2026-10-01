---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import DeckContainer from '@edf/core/blocks/immersive/DeckContainer.astro';
import Slide from '@edf/core/blocks/immersive/Slide.astro';
import T from '@edf/core/blocks/i18n/T.astro';
import { href } from '@edf/core/utils/url.js';
import { CHAPTERS, prevSlug, nextSlug } from '../data/chapters';
__CH_FRONTMATTER_EXTRA__
const SLUG = '__CH_SLUG__';
const ch = CHAPTERS.find((c) => c.slug === SLUG)!;
const base = import.meta.env.BASE_URL;
const currentPath = Astro.url.pathname;

// Tre blocchi di partenza per la slide di contenuto. Sostituire con i fatti del
// capitolo: il copy deve leggersi come scritto da una persona (vedi CLAUDE.md →
// Copy voice), con fonti e numeri verificati.
const blocchi = [
  {
    k: { it: 'Oggi', en: 'Today' },
    t: { it: 'Com’è fatto il processo adesso', en: 'How the process works now' },
    b: { it: 'Dove si inceppa, chi aspetta chi, quanto costa aspettare. Fatti presi dal cliente, non aggettivi.', en: 'Where it jams, who waits for whom, what the waiting costs. Facts taken from the client, not adjectives.' },
  },
  {
    k: { it: 'Con Adobe', en: 'With Adobe' },
    t: { it: 'Cosa fa la piattaforma in questo passaggio', en: 'What the platform does at this step' },
    b: { it: 'Il prodotto con il nome per esteso, al massimo due per slide, mentre agisce nella storia. Il catalogo intero sta altrove.', en: 'The product named in full, two per slide at most, while it acts in the story. The full catalogue lives elsewhere.' },
  },
  {
    k: { it: 'Cosa serve', en: 'What it takes' },
    t: { it: 'Dati, persone, decisioni', en: 'Data, people, decisions' },
    b: { it: 'Quello che il cliente deve mettere sul tavolo perché funzioni, detto prima che lo chieda lui.', en: 'What the client has to bring to the table for this to work, said before they have to ask.' },
  },
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
        <T
          as="p"
          class="ex-ch-lead"
          it="__CH_COVER_LEAD_IT__"
          en="__CH_COVER_LEAD_EN__"
          data-reveal data-reveal-delay="0.15"
        />
        <div class="ex-ch-agenda" data-reveal data-reveal-delay="0.22">
          <T as="p" class="ex-ch-agenda-k" it="In questo capitolo" en="In this chapter" />
          <ul role="list">
            {blocchi.map((x, i) => (
              <li><span class="ex-ch-agenda-n" aria-hidden="true">{i + 1}</span><T as="span" it={x.k.it} en={x.k.en} /></li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>

    <!-- ── Contenuto ─────────────────────────────────────────────────────── -->
    <Slide id="slide-contenuto" bg="primary" align="left">
      <div slot="backdrop" class="ex-bg-paper"></div>
      <div class="ex-content" data-reveal>
        <div class="ex-head">
          <T as="p" class="slide-eyebrow" it={ch.title.it} en={ch.title.en} />
          <T as="h2" class="ex-head-title" it="Il punto di questo capitolo, in una riga" en="The point of this chapter, in one line" />
          <T
            as="p"
            class="ex-head-lead"
            it="Due o tre frasi che spiegano l’argomento con le parole del cliente: cosa succede oggi, cosa cambia, con un numero se ce n’è uno verificato. Il resto va nei tre blocchi qui sotto."
            en="Two or three sentences that explain the subject in the client’s own words: what happens today, what changes, with a number if there is a verified one. The rest goes in the three blocks below."
          />
        </div>
        <div class="ex-cards" data-reveal data-reveal-delay="0.14">
          {blocchi.map((x) => (
            <div class="ex-card">
              <T as="p" class="ex-card-k" it={x.k.it} en={x.k.en} />
              <T as="p" class="ex-card-t" it={x.t.it} en={x.t.en} />
              <T as="p" class="ex-card-b" it={x.b.it} en={x.b.en} />
            </div>
          ))}
        </div>
        <T as="p" class="ex-src" it="Fonte: da citare slide per slide, con il link alla pagina pubblica." en="Source: to be cited slide by slide, with the link to the public page." data-reveal data-reveal-delay="0.24" />
      </div>
    </Slide>
__SIGNATURE_SLIDE__
  </DeckContainer>
</BaseLayout>

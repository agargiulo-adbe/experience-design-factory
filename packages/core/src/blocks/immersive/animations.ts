/**
 * Immersive step animations — GSAP ScrollTrigger powered.
 * All animations respect prefers-reduced-motion.
 * Only transform + opacity for 60fps.
 */

const REDUCED_MOTION = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let gsapLoaded = false;

async function ensureGsap() {
  if (gsapLoaded) return;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  gsapLoaded = true;
}

// ── Reveal: element fades up into view ──────────────────────────────
export async function initReveal(container: HTMLElement) {
  if (REDUCED_MOTION) {
    container.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  container.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    const direction = el.dataset.reveal || 'up';
    const y = direction === 'up' ? 60 : direction === 'down' ? -60 : 0;
    const x = direction === 'left' ? 60 : direction === 'right' ? -60 : 0;

    gsap.set(el, { opacity: 0, y, x });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ── Count-up: animated number ───────────────────────────────────────
export async function initCountUp(container: HTMLElement) {
  const els = container.querySelectorAll<HTMLElement>('[data-count-up]');
  if (!els.length) return;

  if (REDUCED_MOTION) {
    els.forEach(el => {
      el.textContent = el.dataset.countUp || el.textContent;
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  els.forEach(el => {
    const target = el.dataset.countUp || '';
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    const numericMatch = target.match(/[\d.]+/);
    if (!numericMatch) return;

    const endVal = parseFloat(numericMatch[0]);
    const proxy = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      scroller: container,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          val: endVal,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            const formatted = endVal % 1 === 0
              ? Math.round(proxy.val).toString()
              : proxy.val.toFixed(1);
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      },
    });
  });
}

// ── Stagger-in: children enter one by one ───────────────────────────
export async function initStagger(container: HTMLElement) {
  const groups = container.querySelectorAll<HTMLElement>('[data-stagger]');
  if (!groups.length) return;

  if (REDUCED_MOTION) {
    groups.forEach(group => {
      Array.from(group.children).forEach(child => {
        (child as HTMLElement).style.opacity = '1';
        (child as HTMLElement).style.transform = 'none';
      });
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  groups.forEach(group => {
    const children = Array.from(group.children) as HTMLElement[];
    const staggerDelay = parseFloat(group.dataset.stagger || '0.15');

    gsap.set(children, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: group,
      scroller: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: staggerDelay,
          ease: 'power3.out',
        });
      },
    });
  });
}

// ── Pulse: front→back impulse line animation ────────────────────────
export async function initPulse(container: HTMLElement) {
  const pulses = container.querySelectorAll<HTMLElement>('[data-pulse-line]');
  if (!pulses.length) return;

  if (REDUCED_MOTION) {
    pulses.forEach(el => { el.style.opacity = '1'; });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  pulses.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      scroller: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        // Animate the SVG line drawing
        const line = el.querySelector('.pulse-path');
        if (line instanceof SVGElement) {
          const length = (line as SVGPathElement).getTotalLength?.() || 200;
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.inOut',
          });
        }
        // Animate the dot
        const dot = el.querySelector('.pulse-dot');
        if (dot) {
          gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, delay: 1, ease: 'back.out(2)' }
          );
        }
      },
    });
  });
}

// ── Data Lake: scattered dots that aggregate into profiles ──────────
export async function initDataLake(container: HTMLElement) {
  const el = container.querySelector<HTMLElement>('[data-datalake]');
  if (!el) return;

  const dots = el.querySelectorAll<HTMLElement>('.data-dot');
  const profiles = el.querySelectorAll<HTMLElement>('.profile-circle');

  if (REDUCED_MOTION) {
    dots.forEach(d => { d.style.opacity = '0'; });
    profiles.forEach(p => { p.style.opacity = '1'; p.style.transform = 'none'; });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  // Start: dots visible, scattered; profiles hidden
  gsap.set(dots, { opacity: 0.6 });
  gsap.set(profiles, { opacity: 0, scale: 0.3 });

  ScrollTrigger.create({
    trigger: el,
    scroller: container,
    start: 'top 60%',
    once: true,
    onEnter: () => {
      // Phase 1: dots converge
      const tl = gsap.timeline();
      tl.to(dots, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 1.2,
        stagger: 0.03,
        ease: 'power3.in',
      });
      // Phase 2: profiles emerge
      tl.to(profiles, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.5)',
      }, '-=0.3');
    },
  });
}

// ── Personalize: generic tiles resolve to a personalized match ──────
// Metaphor (Engagement): the same surface, a different face for each
// customer. Generic tiles dim; the matched tiles light up.
// Markup: [data-personalize] wrapping `.perso-item` children; the ones
// to highlight carry `data-match`.
export async function initPersonalize(container: HTMLElement) {
  const groups = container.querySelectorAll<HTMLElement>('[data-personalize]');
  if (!groups.length) return;

  if (REDUCED_MOTION) {
    groups.forEach(group => {
      group.querySelectorAll<HTMLElement>('.perso-item').forEach(el => {
        el.style.opacity = el.hasAttribute('data-match') ? '1' : '0.25';
        el.style.transform = 'none';
      });
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  groups.forEach(group => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('.perso-item'));
    const matches = items.filter(el => el.hasAttribute('data-match'));
    const others = items.filter(el => !el.hasAttribute('data-match'));

    gsap.set(items, { opacity: 0, scale: 0.9 });

    ScrollTrigger.create({
      trigger: group,
      scroller: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        // Phase 1: everything appears, neutral
        tl.to(items, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
        // Phase 2: non-matches dim, matches assert themselves
        tl.to(others, { opacity: 0.2, scale: 0.95, duration: 0.6, ease: 'power2.inOut' }, '+=0.4');
        tl.to(matches, { scale: 1.04, duration: 0.5, ease: 'back.out(2)' }, '<');
      },
    });
  });
}

// ── Converse: chat bubbles appear one by one, alternating sides ─────
// Metaphor (Conversione): conversational discovery — Brand Concierge.
// Markup: [data-converse] wrapping `.chat-bubble` children; side comes
// from `data-side="in|out"` (in = customer, out = concierge).
export async function initConverse(container: HTMLElement) {
  const threads = container.querySelectorAll<HTMLElement>('[data-converse]');
  if (!threads.length) return;

  if (REDUCED_MOTION) {
    threads.forEach(t => {
      t.querySelectorAll<HTMLElement>('.chat-bubble').forEach(b => {
        b.style.opacity = '1';
        b.style.transform = 'none';
      });
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  threads.forEach(thread => {
    const bubbles = Array.from(thread.querySelectorAll<HTMLElement>('.chat-bubble'));
    bubbles.forEach(b => {
      const fromIn = b.dataset.side === 'in';
      gsap.set(b, { opacity: 0, y: 16, x: fromIn ? -24 : 24 });
    });

    ScrollTrigger.create({
      trigger: thread,
      scroller: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(bubbles, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.55,
          stagger: 0.5,
          ease: 'power3.out',
        });
      },
    });
  });
}

// ── Lifecycle: a recurring loop traced around a ring of touchpoints ──
// Metaphor (Loyalty): the relationship is a cycle, not a line — welcome,
// reward, re-engage, return. Nodes light in sequence as a dot orbits.
// Markup: [data-lifecycle] containing an SVG `.cycle-track` (the ring),
// a `.cycle-dot`, and `.cycle-node` markers around it.
export async function initLifecycle(container: HTMLElement) {
  const rings = container.querySelectorAll<HTMLElement>('[data-lifecycle]');
  if (!rings.length) return;

  if (REDUCED_MOTION) {
    rings.forEach(r => {
      r.querySelectorAll<HTMLElement>('.cycle-node').forEach(n => {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      const dot = r.querySelector<SVGElement>('.cycle-dot');
      if (dot) dot.style.opacity = '0';
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  rings.forEach(ring => {
    const nodes = Array.from(ring.querySelectorAll<HTMLElement>('.cycle-node'));
    const track = ring.querySelector('.cycle-track');
    const dot = ring.querySelector('.cycle-dot');

    gsap.set(nodes, { opacity: 0.25, scale: 0.85 });
    if (track instanceof SVGElement) {
      const len = (track as SVGPathElement).getTotalLength?.() || 600;
      gsap.set(track, { strokeDasharray: len, strokeDashoffset: len });
    }

    ScrollTrigger.create({
      trigger: ring,
      scroller: container,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        if (track instanceof SVGElement) {
          tl.to(track, { strokeDashoffset: 0, duration: 1.6, ease: 'none' });
        }
        // Nodes light up around the loop
        tl.to(nodes, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.35,
          ease: 'back.out(2)',
        }, '<+=0.2');
        // The relationship keeps going: dot orbits perpetually
        if (dot) {
          tl.set(dot, { opacity: 1 }, '>-0.2');
          gsap.to(dot, {
            rotation: 360,
            duration: 8,
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center center',
            svgOrigin: `${dot.getAttribute('data-cx') || 100} ${dot.getAttribute('data-cy') || 100}`,
          });
        }
      },
    });
  });
}

// ── Clienteling: recognition — a profile populates as the brand "knows" ──
// Metaphor (Persona/Loyalty): being recognised. A scan sweep reveals known
// attributes one by one onto a profile card.
// Markup: [data-clienteling] with a `.scan-line` and `.reveal-attr` items.
export async function initClienteling(container: HTMLElement) {
  const cards = container.querySelectorAll<HTMLElement>('[data-clienteling]');
  if (!cards.length) return;

  if (REDUCED_MOTION) {
    cards.forEach(c => {
      c.querySelectorAll<HTMLElement>('.reveal-attr').forEach(a => {
        a.style.opacity = '1';
        a.style.transform = 'none';
      });
      const scan = c.querySelector<HTMLElement>('.scan-line');
      if (scan) scan.style.opacity = '0';
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  cards.forEach(card => {
    const attrs = Array.from(card.querySelectorAll<HTMLElement>('.reveal-attr'));
    const scan = card.querySelector<HTMLElement>('.scan-line');

    gsap.set(attrs, { opacity: 0, x: -12 });
    if (scan) gsap.set(scan, { opacity: 0, top: '0%' });

    ScrollTrigger.create({
      trigger: card,
      scroller: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        if (scan) {
          tl.to(scan, { opacity: 1, duration: 0.2 })
            .to(scan, { top: '100%', duration: 1.1, ease: 'power1.inOut' })
            .to(scan, { opacity: 0, duration: 0.3 }, '-=0.2');
        }
        tl.to(attrs, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.18,
          ease: 'power3.out',
        }, scan ? '-=1.2' : 0);
      },
    });
  });
}

// ── Thread: a drawn line connecting two generations ─────────────────
// Metaphor (Home/Persona): "Generazioni" — the filo that ties the young
// customer to the heritage client. Nodes pop, the path draws between.
// Markup: [data-thread] with `.thread-node` markers and an SVG `.thread-path`.
export async function initThread(container: HTMLElement) {
  const threads = container.querySelectorAll<HTMLElement>('[data-thread]');
  if (!threads.length) return;

  if (REDUCED_MOTION) {
    threads.forEach(t => {
      t.querySelectorAll<HTMLElement>('.thread-node').forEach(n => {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      t.querySelectorAll<SVGElement>('.thread-path').forEach(p => {
        p.style.strokeDashoffset = '0';
      });
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  threads.forEach(thread => {
    const nodes = Array.from(thread.querySelectorAll<HTMLElement>('.thread-node'));
    const path = thread.querySelector('.thread-path');

    gsap.set(nodes, { opacity: 0, scale: 0.6 });
    if (path instanceof SVGElement) {
      const len = (path as SVGPathElement).getTotalLength?.() || 400;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    }

    ScrollTrigger.create({
      trigger: thread,
      scroller: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(nodes[0] ?? {}, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
        if (path instanceof SVGElement) {
          tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' });
        }
        if (nodes[1]) {
          tl.to(nodes[1], { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');
        }
      },
    });
  });
}

// ── Stack assemble: scattered Adobe products converge onto a core ────
// Metaphor (Il Motore Adobe): the full reveal — AEP/RTCDP at the centre,
// every product assembling into one platform. The culmination.
// Markup: [data-stack-assemble] with a `.stack-core` and `.stack-product`
// chips; each chip carries `data-from-x`/`data-from-y` (px offsets).
export async function initStackAssemble(container: HTMLElement) {
  const stacks = container.querySelectorAll<HTMLElement>('[data-stack-assemble]');
  if (!stacks.length) return;

  if (REDUCED_MOTION) {
    // Elements are centred on their anchor via translate(-50%,-50%); keep it.
    stacks.forEach(s => {
      const core = s.querySelector<HTMLElement>('.stack-core');
      if (core) { core.style.opacity = '1'; core.style.transform = 'translate(-50%, -50%)'; }
      s.querySelectorAll<HTMLElement>('.stack-product').forEach(p => {
        p.style.opacity = '1';
        p.style.transform = 'translate(-50%, -50%)';
      });
    });
    return;
  }

  await ensureGsap();
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  stacks.forEach(stack => {
    const core = stack.querySelector<HTMLElement>('.stack-core');
    const products = Array.from(stack.querySelectorAll<HTMLElement>('.stack-product'));

    if (core) gsap.set(core, { opacity: 0, scale: 0.4 });
    products.forEach(p => {
      const fx = parseFloat(p.dataset.fromX || '0');
      const fy = parseFloat(p.dataset.fromY || '0');
      gsap.set(p, { opacity: 0, x: fx, y: fy, scale: 0.7 });
    });

    ScrollTrigger.create({
      trigger: stack,
      scroller: container,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        if (core) tl.to(core, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' });
        tl.to(products, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        }, '-=0.3');
      },
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// DECK MODE — animations fire when a slide becomes ACTIVE (keynote),
// not on scroll. prepareSlide() paints the pre-animation state; playSlide()
// animates. Calling them again replays the slide on revisit.
// Covers the generic primitives + the Acquisizione metaphor (data lake).
// Page-specific metaphors (personalize/converse/lifecycle/clienteling/
// thread/stackAssemble) get deck handlers when their pages move to the deck.
// ════════════════════════════════════════════════════════════════════

async function ensureGsapCore() {
  const { gsap } = await import('gsap');
  return gsap;
}

/** Set the pre-animation (hidden) state for everything animated in a slide. */
export function prepareSlide(slide: HTMLElement) {
  // Reveals
  slide.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
    if (REDUCED_MOTION) { el.style.opacity = '1'; el.style.transform = 'none'; return; }
    const dir = el.dataset.reveal || 'up';
    const y = dir === 'up' ? 48 : dir === 'down' ? -48 : 0;
    const x = dir === 'left' ? 48 : dir === 'right' ? -48 : 0;
    el.style.opacity = '0';
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  // Stagger groups
  slide.querySelectorAll<HTMLElement>('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach(c => {
      const el = c as HTMLElement;
      if (REDUCED_MOTION) { el.style.opacity = '1'; el.style.transform = 'none'; return; }
      el.style.opacity = '0';
      el.style.transform = 'translateY(48px)';
    });
  });
  // Count-up
  slide.querySelectorAll<HTMLElement>('[data-count-up]').forEach(el => {
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    el.textContent = REDUCED_MOTION ? `${prefix}${el.dataset.countUp || ''}${suffix}` : `${prefix}0${suffix}`;
  });
  // Pulse line
  slide.querySelectorAll<HTMLElement>('[data-pulse-line]').forEach(el => {
    const line = el.querySelector<SVGPathElement>('.pulse-path');
    const dot = el.querySelector<SVGElement>('.pulse-dot');
    if (REDUCED_MOTION) {
      if (line) line.style.strokeDashoffset = '0';
      if (dot) (dot as SVGElement).style.opacity = '1';
      return;
    }
    if (line) {
      const len = line.getTotalLength?.() || 200;
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = `${len}`;
    }
    if (dot) (dot as SVGElement).style.opacity = '0';
  });
  // Data lake (deck variant: dots carry data-dx/data-dy; positions set in play)
  const dl = slide.querySelector<HTMLElement>('[data-datalake]');
  if (dl) {
    const dots = dl.querySelectorAll<HTMLElement>('.data-dot');
    const profiles = dl.querySelectorAll<HTMLElement>('.profile-circle');
    if (REDUCED_MOTION) {
      dots.forEach(d => { d.style.opacity = '0'; });
      profiles.forEach(p => { p.style.opacity = '1'; p.style.transform = 'none'; });
    } else {
      // Stay invisible until play() positions them — avoids a stacked flash.
      dots.forEach(d => { d.style.opacity = '0'; });
      profiles.forEach(p => { p.style.opacity = '0'; });
    }
  }
  // Cover slide (sartorial thread + converging wordmarks)
  const cover = slide.querySelector<HTMLElement>('[data-cover]');
  if (cover) {
    const mm = cover.querySelector<HTMLElement>('.cover-word-mm');
    const adobe = cover.querySelector<HTMLElement>('.cover-word-adobe');
    const thread = cover.querySelector<SVGPathElement>('.cover-thread-path');
    const knot = cover.querySelector<SVGElement>('.cover-knot');
    if (REDUCED_MOTION) {
      [mm, adobe].forEach(el => { if (el) { el.style.opacity = '1'; el.style.transform = 'none'; } });
      if (thread) thread.style.strokeDashoffset = '0';
      if (knot) knot.style.opacity = '1';
    } else {
      if (mm) { mm.style.opacity = '0'; mm.style.transform = 'translateX(-30px)'; }
      if (adobe) { adobe.style.opacity = '0'; adobe.style.transform = 'translateX(30px)'; }
      if (thread) {
        const len = thread.getTotalLength?.() || 120;
        thread.style.strokeDasharray = `${len}`;
        thread.style.strokeDashoffset = `${len}`;
      }
      if (knot) knot.style.opacity = '0';
    }
  }
  // Personalize (tiles resolve to the matching ones) — deck variant.
  const perso = slide.querySelector<HTMLElement>('[data-personalize]');
  if (perso) {
    const items = perso.querySelectorAll<HTMLElement>('.perso-item');
    if (REDUCED_MOTION) {
      items.forEach(el => { el.style.opacity = el.hasAttribute('data-match') ? '1' : '0.25'; el.style.transform = 'none'; });
    } else {
      items.forEach(el => { el.style.opacity = '0'; el.style.transform = 'scale(0.9)'; });
    }
  }
  // Converse (chat bubbles appear one by one) — deck variant.
  const conv = slide.querySelector<HTMLElement>('[data-converse]');
  if (conv) {
    const bubbles = conv.querySelectorAll<HTMLElement>('.chat-bubble');
    if (REDUCED_MOTION) {
      bubbles.forEach(b => { b.style.opacity = '1'; b.style.transform = 'none'; });
    } else {
      bubbles.forEach(b => { const fromIn = b.dataset.side === 'in'; b.style.opacity = '0'; b.style.transform = `translate(${fromIn ? -24 : 24}px, 16px)`; });
    }
  }
  // Lifecycle ring — deck variant.
  const ring = slide.querySelector<HTMLElement>('[data-lifecycle]');
  if (ring) {
    const nodes = ring.querySelectorAll<HTMLElement>('.cycle-node');
    const track = ring.querySelector<SVGPathElement>('.cycle-track');
    const dot = ring.querySelector<SVGElement>('.cycle-dot');
    if (REDUCED_MOTION) {
      nodes.forEach(n => { n.style.opacity = '1'; n.style.transform = 'none'; });
      if (track) track.style.strokeDashoffset = '0';
      if (dot) dot.style.opacity = '0';
    } else {
      nodes.forEach(n => { n.style.opacity = '0.25'; n.style.transform = 'scale(0.85)'; });
      if (track) { const len = track.getTotalLength?.() || 600; track.style.strokeDasharray = `${len}`; track.style.strokeDashoffset = `${len}`; }
      if (dot) dot.style.opacity = '0';
    }
  }
  // Clienteling recognition card — deck variant.
  const cl = slide.querySelector<HTMLElement>('[data-clienteling]');
  if (cl) {
    const attrs = cl.querySelectorAll<HTMLElement>('.reveal-attr');
    const scan = cl.querySelector<HTMLElement>('.scan-line');
    if (REDUCED_MOTION) {
      attrs.forEach(a => { a.style.opacity = '1'; a.style.transform = 'none'; });
      if (scan) scan.style.opacity = '0';
    } else {
      attrs.forEach(a => { a.style.opacity = '0'; a.style.transform = 'translateX(-12px)'; });
      if (scan) { scan.style.opacity = '0'; scan.style.top = '0%'; }
    }
  }
  // Atmospheric parallax: over-scaled so the drift never reveals an edge.
  slide.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    el.style.transform = REDUCED_MOTION ? 'scale(1.04)' : 'scale(1.06) translateX(16px)';
  });
}

/** Animate everything in a slide. Safe to call repeatedly (replay). */
export async function playSlide(slide: HTMLElement) {
  if (REDUCED_MOTION) {
    // prepareSlide already painted final states; only count-up text needs it.
    return;
  }
  const gsap = await ensureGsapCore();

  // Reveals
  slide.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 0.8, delay, ease: 'power3.out' });
  });
  // Stagger
  slide.querySelectorAll<HTMLElement>('[data-stagger]').forEach(group => {
    const children = Array.from(group.children) as HTMLElement[];
    const sd = parseFloat(group.dataset.stagger || '0.15');
    gsap.to(children, { opacity: 1, y: 0, duration: 0.7, stagger: sd, delay: 0.25, ease: 'power3.out' });
  });
  // Count-up
  slide.querySelectorAll<HTMLElement>('[data-count-up]').forEach(el => {
    const target = el.dataset.countUp || '';
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    const m = target.match(/[\d.]+/);
    if (!m) return;
    const endVal = parseFloat(m[0]);
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: endVal, duration: 1.6, delay: 0.3, ease: 'power2.out',
      onUpdate: () => {
        const f = endVal % 1 === 0 ? Math.round(proxy.val).toString() : proxy.val.toFixed(1);
        el.textContent = `${prefix}${f}${suffix}`;
      },
    });
  });
  // Pulse
  slide.querySelectorAll<HTMLElement>('[data-pulse-line]').forEach(el => {
    const line = el.querySelector<SVGPathElement>('.pulse-path');
    const dot = el.querySelector('.pulse-dot');
    if (line) {
      const len = line.getTotalLength?.() || 200;
      gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.1, delay: 0.3, ease: 'power2.inOut' });
    }
    if (dot) {
      gsap.fromTo(dot, { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 1.2, ease: 'back.out(2)', transformOrigin: 'center center' });
    }
  });
  // Data lake — dots converge cinematically to centre, then profiles emerge
  const dl = slide.querySelector<HTMLElement>('[data-datalake]');
  if (dl) {
    const dots = Array.from(dl.querySelectorAll<HTMLElement>('.data-dot'));
    const profiles = dl.querySelectorAll<HTMLElement>('.profile-circle');
    // Centre each dot with xPercent/yPercent, scatter via x/y from data-dx/dy
    dots.forEach(d => {
      gsap.set(d, {
        xPercent: -50, yPercent: -50,
        x: parseFloat(d.dataset.dx || '0'),
        y: parseFloat(d.dataset.dy || '0'),
        opacity: 0,
      });
    });
    gsap.set(profiles, { scale: 0.3, opacity: 0 });
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(dots, { opacity: 0.9, duration: 0.4, stagger: 0.01 });
    tl.to(dots, { x: 0, y: 0, opacity: 0, duration: 1.3, stagger: 0.012, ease: 'power3.inOut' }, '>-0.1');
    tl.to(profiles, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.6)' }, '-=0.5');
  }

  // Cover slide — wordmarks converge, then the sartorial thread draws itself
  const cover = slide.querySelector<HTMLElement>('[data-cover]');
  if (cover) {
    const mm = cover.querySelector<HTMLElement>('.cover-word-mm');
    const adobe = cover.querySelector<HTMLElement>('.cover-word-adobe');
    const thread = cover.querySelector('.cover-thread-path');
    const knot = cover.querySelector('.cover-knot');
    const tl = gsap.timeline({ delay: 0.15 });
    if (mm) tl.to(mm, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 0);
    if (adobe) tl.to(adobe, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 0.1);
    if (thread) tl.to(thread, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.45);
    if (knot) tl.to(knot, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '>-0.25');
  }
  // Personalize — all tiles appear neutral, then non-matches dim and matches assert
  const perso = slide.querySelector<HTMLElement>('[data-personalize]');
  if (perso) {
    const items = Array.from(perso.querySelectorAll<HTMLElement>('.perso-item'));
    const matches = items.filter(el => el.hasAttribute('data-match'));
    const others = items.filter(el => !el.hasAttribute('data-match'));
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(items, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    tl.to(others, { opacity: 0.2, scale: 0.95, duration: 0.6, ease: 'power2.inOut' }, '+=0.4');
    tl.to(matches, { scale: 1.04, duration: 0.5, ease: 'back.out(2)' }, '<');
  }
  // Converse — bubbles appear one by one, alternating sides
  const conv = slide.querySelector<HTMLElement>('[data-converse]');
  if (conv) {
    const bubbles = Array.from(conv.querySelectorAll<HTMLElement>('.chat-bubble'));
    gsap.to(bubbles, { opacity: 1, x: 0, y: 0, duration: 0.55, stagger: 0.5, delay: 0.25, ease: 'power3.out' });
  }
  // Lifecycle — track draws, nodes light up, dot orbits perpetually
  const ring = slide.querySelector<HTMLElement>('[data-lifecycle]');
  if (ring) {
    const nodes = Array.from(ring.querySelectorAll<HTMLElement>('.cycle-node'));
    const track = ring.querySelector('.cycle-track');
    const dot = ring.querySelector<SVGElement>('.cycle-dot');
    const tl = gsap.timeline({ delay: 0.2 });
    if (track instanceof SVGElement) tl.to(track, { strokeDashoffset: 0, duration: 1.6, ease: 'none' });
    tl.to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.35, ease: 'back.out(2)' }, '<+=0.2');
    if (dot) {
      gsap.killTweensOf(dot);
      tl.set(dot, { opacity: 1 }, '>-0.2');
      gsap.to(dot, { rotation: 360, duration: 8, repeat: -1, ease: 'none', transformOrigin: 'center center', svgOrigin: `${dot.getAttribute('data-cx') || 100} ${dot.getAttribute('data-cy') || 100}` });
    }
  }
  // Clienteling — scan sweep, then attributes reveal one by one
  const cl = slide.querySelector<HTMLElement>('[data-clienteling]');
  if (cl) {
    const attrs = Array.from(cl.querySelectorAll<HTMLElement>('.reveal-attr'));
    const scan = cl.querySelector<HTMLElement>('.scan-line');
    const tl = gsap.timeline({ delay: 0.2 });
    if (scan) tl.to(scan, { opacity: 1, duration: 0.2 }).to(scan, { top: '100%', duration: 1.1, ease: 'power1.inOut' }).to(scan, { opacity: 0, duration: 0.3 }, '-=0.2');
    tl.to(attrs, { opacity: 1, x: 0, duration: 0.5, stagger: 0.18, ease: 'power3.out' }, scan ? '-=1.2' : 0);
  }
  // Atmospheric parallax: a quiet drift on activation (stays over-scaled to cover).
  slide.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { scale: 1.06, x: 16 }, { scale: 1.06, x: 0, duration: 1.6, ease: 'power2.out' });
  });
}

// ── Master init: call all animation initializers ────────────────────
export async function initAllAnimations(container: HTMLElement) {
  await Promise.all([
    initReveal(container),
    initCountUp(container),
    initStagger(container),
    initPulse(container),
    initDataLake(container),
    initPersonalize(container),
    initConverse(container),
    initLifecycle(container),
    initClienteling(container),
    initThread(container),
    initStackAssemble(container),
  ]);
}

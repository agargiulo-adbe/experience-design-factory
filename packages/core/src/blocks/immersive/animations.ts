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

// ── Master init: call all animation initializers ────────────────────
export async function initAllAnimations(container: HTMLElement) {
  await Promise.all([
    initReveal(container),
    initCountUp(container),
    initStagger(container),
    initPulse(container),
    initDataLake(container),
  ]);
}

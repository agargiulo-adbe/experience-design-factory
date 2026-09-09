/**
 * Deck controller — keynote-style presentation.
 * No scroll: each slide is full-screen; advance one slide at a time with a
 * horizontal slide transition (~500ms ease-in-out), cross-fade under
 * prefers-reduced-motion. Presenter controls: arrows, space, PageUp/Down,
 * Home/End, click halves, swipe, fullscreen (F). Animations fire when a slide
 * becomes active (and replay on revisit).
 *
 * Contract exposed to apps (all optional, backwards compatible):
 *  - `deck:change` CustomEvent on `document` on every slide activation
 *    (initial + goTo) — detail `{ index, total, id, sectionSlug }`.
 *  - `deck:substep` CustomEvent on `document` when a sub-step is revealed/hidden
 *    — detail `{ index, substep, substeps, id, sectionSlug }`.
 *  - Sub-steps: children of the active slide marked `[data-substep]` are
 *    revealed one at a time by ↓ / PageDown / Space / next-button / click-right
 *    (the deck sets `data-substep-active` on the step and `data-substep-index="n"`
 *    on the slide = number revealed); ↑ / PageUp / prev hides the last one before
 *    going back. → / ← always move between slides (presenter escape hatch).
 *    Steps reset whenever a slide is (re)prepared. Under reduced-motion the CSS
 *    shows every step and the controller skips stepping.
 *  - `data-on-dark` on the deck root while the active slide is dark: the slide
 *    carries `[data-dark]` (or `data-dark="false"` to force light), the Slide
 *    bg class `bg-[var(--surface-inverse)]` / `bg-[var(--accent-primary)]`, or a
 *    computed background whose relative luminance is < 0.45.
 */
import { prepareSlide, playSlide } from './animations';

const SLIDE_MS = 500;

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DARK_CLASSES = ['bg-[var(--surface-inverse)]', 'bg-[var(--accent-primary)]'];

function relLuminance(color: string): number | null {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(s => parseFloat(s));
  if (p.length < 3 || p.some(v => Number.isNaN(v))) return null;
  if (p[3] !== undefined && p[3] === 0) return null; // transparent → unknown
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
}

/** Is this slide visually dark (light chrome needed)? See the header contract. */
export function isDarkSlide(slide: HTMLElement): boolean {
  const flag = slide.getAttribute('data-dark');
  if (flag !== null) return flag !== 'false';
  if (DARK_CLASSES.some(c => slide.classList.contains(c))) return true;
  try {
    const l = relLuminance(getComputedStyle(slide).backgroundColor);
    return l !== null && l < 0.45;
  } catch { return false; }
}

function sectionSlug(): string {
  const parts = window.location.pathname.replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || 'index';
}

export class Deck {
  root: HTMLElement;
  slides: HTMLElement[];
  index = 0;
  nextHref: string | null;
  prevHref: string | null;
  private playTimer: number | undefined;
  private idleTimer: number | undefined;
  private touchX = 0;
  private touchY = 0;
  private destroyed = false;
  // bound handlers (so we can remove them)
  private onKey = (e: KeyboardEvent) => this.handleKey(e);
  private onMove = () => this.wake();
  private onResize = () => this.render(true);

  constructor(root: HTMLElement) {
    this.root = root;
    this.slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
    this.nextHref = root.dataset.deckNext || null;
    this.prevHref = root.dataset.deckPrevHref || null;

    // If we arrived by navigating BACK from the next section, open on the LAST
    // slide so arrow nav is continuous across section boundaries (both ways).
    try {
      if (sessionStorage.getItem('edf:deck-enter-last') === '1') {
        sessionStorage.removeItem('edf:deck-enter-last');
        this.index = Math.max(0, this.slides.length - 1);
      }
    } catch { /* sessionStorage unavailable — start at 0 */ }

    // Stack every slide; paint pre-animation state.
    this.slides.forEach(s => {
      s.style.position = 'absolute';
      s.style.inset = '0';
      s.style.willChange = 'transform, opacity';
      this.prepare(s);
    });

    this.render(true);            // initial layout, no transition
    requestAnimationFrame(() => { // enable transitions after first paint
      this.slides.forEach(s => {
        s.style.transition = reduced
          ? 'opacity 320ms ease-in-out'
          : `transform ${SLIDE_MS}ms ease-in-out, opacity ${SLIDE_MS}ms ease-in-out`;
      });
    });

    this.updateChrome();
    this.bind();
    // Build the first slide in shortly after load.
    this.scheduleActivate(160);
    this.wake();
    this.emitChange();
  }

  private bind() {
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onResize);
    this.root.addEventListener('mousemove', this.onMove);
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.root.addEventListener('touchend', this.onTouchEnd, { passive: true });

    this.root.querySelector('[data-deck-prev]')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.stepBack(); });
    this.root.querySelector('[data-deck-next]')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.stepForward(); });
    this.root.querySelector('[data-deck-fs]')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.toggleFullscreen(); });
  }

  destroy() {
    this.destroyed = true;
    window.clearTimeout(this.playTimer);
    window.clearTimeout(this.idleTimer);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onResize);
    this.root.removeEventListener('mousemove', this.onMove);
    this.root.removeEventListener('click', this.onClick);
    this.root.removeEventListener('touchstart', this.onTouchStart);
    this.root.removeEventListener('touchend', this.onTouchEnd);
  }

  // True while a slide-over (HowItWorks) is open — pause deck navigation.
  private get locked(): boolean {
    return this.root.hasAttribute('data-deck-lock');
  }

  // ── Slide preparation (animations + sub-steps) ──────────────────
  private prepare(slide: HTMLElement) {
    prepareSlide(slide);
    this.resetSubsteps(slide);
  }

  private substepsOf(slide: HTMLElement): HTMLElement[] {
    return Array.from(slide.querySelectorAll<HTMLElement>('[data-substep]'));
  }

  private resetSubsteps(slide: HTMLElement) {
    const steps = this.substepsOf(slide);
    steps.forEach(s => s.removeAttribute('data-substep-active'));
    if (steps.length) slide.setAttribute('data-substep-index', '0');
    else slide.removeAttribute('data-substep-index');
  }

  /** Reveal the next sub-step of the active slide. Returns false when none is left. */
  revealSubstep(): boolean {
    if (reduced) return false; // CSS shows every step — nothing to reveal
    const slide = this.slides[this.index];
    if (!slide) return false;
    const steps = this.substepsOf(slide);
    const shown = steps.filter(s => s.hasAttribute('data-substep-active')).length;
    if (shown >= steps.length) return false;
    steps[shown].setAttribute('data-substep-active', '');
    slide.setAttribute('data-substep-index', String(shown + 1));
    this.emitSubstep(shown + 1, steps.length);
    this.wake();
    return true;
  }

  /** Hide the last revealed sub-step of the active slide. Returns false when none is shown. */
  hideSubstep(): boolean {
    if (reduced) return false;
    const slide = this.slides[this.index];
    if (!slide) return false;
    const shown = this.substepsOf(slide).filter(s => s.hasAttribute('data-substep-active'));
    if (!shown.length) return false;
    shown[shown.length - 1].removeAttribute('data-substep-active');
    slide.setAttribute('data-substep-index', String(shown.length - 1));
    this.emitSubstep(shown.length - 1, this.substepsOf(slide).length);
    this.wake();
    return true;
  }

  /** Step-aware advance: reveal a sub-step if any is pending, else next slide. */
  stepForward() {
    if (this.locked) return;
    if (!this.revealSubstep()) this.next();
  }

  /** Step-aware retreat: hide a sub-step if any is shown, else previous slide. */
  stepBack() {
    if (this.locked) return;
    if (!this.hideSubstep()) this.prev();
  }

  // ── Events ──────────────────────────────────────────────────────
  private detail() {
    const slide = this.slides[this.index];
    return { index: this.index, total: this.slides.length, id: slide?.id || '', sectionSlug: sectionSlug() };
  }

  private emitChange() {
    this.syncDark();
    try { document.dispatchEvent(new CustomEvent('deck:change', { detail: this.detail() })); } catch { /* ignore */ }
  }

  private emitSubstep(substep: number, substeps: number) {
    try { document.dispatchEvent(new CustomEvent('deck:substep', { detail: { ...this.detail(), substep, substeps } })); } catch { /* ignore */ }
  }

  /** Keep `data-on-dark` on the deck root in sync with the active slide. */
  syncDark() {
    const slide = this.slides[this.index];
    if (slide && isDarkSlide(slide)) this.root.setAttribute('data-on-dark', '');
    else this.root.removeAttribute('data-on-dark');
  }

  // ── Navigation ──────────────────────────────────────────────────
  goTo(i: number) {
    const clamped = Math.max(0, Math.min(this.slides.length - 1, i));
    if (clamped === this.index) return;
    this.index = clamped;
    // Re-hide the incoming slide while it is still off-screen, then replay.
    this.prepare(this.slides[this.index]);
    this.render();
    this.updateChrome();
    this.scheduleActivate(reduced ? 0 : SLIDE_MS + 20);
    this.wake();
    this.emitChange();
  }

  next() {
    if (this.locked) return;
    if (this.index < this.slides.length - 1) this.goTo(this.index + 1);
    else this.exitForward();
  }

  prev() {
    if (this.locked) return;
    if (this.index > 0) this.goTo(this.index - 1);
    else this.exitBackward();
  }

  private exitForward() {
    this.exitTo(this.nextHref, false);
  }

  private exitBackward() {
    // Land on the LAST slide of the previous section (continuous back-nav).
    this.exitTo(this.prevHref, true);
  }

  private exitTo(href: string | null, enterLast: boolean) {
    if (!href) return;
    if (enterLast) { try { sessionStorage.setItem('edf:deck-enter-last', '1'); } catch { /* ignore */ } }
    // Prefer SPA navigation (ClientRouter) so an active fullscreen session is
    // PRESERVED across sections; a full page load would exit fullscreen.
    const nav = (window as Window & { __edfNavigate?: (h: string) => void }).__edfNavigate;
    const go = () => { if (nav) nav(href); else window.location.assign(href); };
    if (reduced) { go(); return; }
    this.root.style.transition = 'opacity 240ms ease-in';
    this.root.style.opacity = '0';
    window.setTimeout(go, 240);
  }

  private scheduleActivate(delay: number) {
    window.clearTimeout(this.playTimer);
    this.playTimer = window.setTimeout(() => {
      if (this.destroyed) return;
      void playSlide(this.slides[this.index]);
    }, delay);
  }

  // ── Layout ──────────────────────────────────────────────────────
  private render(immediate = false) {
    this.slides.forEach((s, i) => {
      const offset = i - this.index;
      if (immediate) s.style.transition = 'none';
      if (reduced) {
        s.style.transform = 'none';
        s.style.opacity = i === this.index ? '1' : '0';
      } else {
        s.style.transform = `translateX(${offset * 100}%)`;
        s.style.opacity = '1';
      }
      const active = i === this.index;
      s.style.pointerEvents = active ? 'auto' : 'none';
      if (active) { s.removeAttribute('aria-hidden'); s.removeAttribute('inert'); }
      else { s.setAttribute('aria-hidden', 'true'); s.setAttribute('inert', ''); }
    });
    if (immediate) {
      // restore transitions on the next frame
      requestAnimationFrame(() => this.slides.forEach(s => {
        s.style.transition = reduced
          ? 'opacity 320ms ease-in-out'
          : `transform ${SLIDE_MS}ms ease-in-out, opacity ${SLIDE_MS}ms ease-in-out`;
      }));
    }
  }

  private updateChrome() {
    const n = this.slides.length;
    const pad = (v: number) => String(v).padStart(2, '0');
    const prog = this.root.querySelector('[data-deck-progress]');
    if (prog) prog.textContent = `${pad(this.index + 1)} / ${pad(n)}`;
    const prevBtn = this.root.querySelector<HTMLButtonElement>('[data-deck-prev]');
    if (prevBtn) {
      // Enabled unless we're at the very first slide with no previous section.
      const canPrev = this.index > 0 || !!this.prevHref;
      prevBtn.disabled = !canPrev;
      prevBtn.style.opacity = canPrev ? '1' : '0.25';
    }
  }

  // ── Input ───────────────────────────────────────────────────────
  private handleKey(e: KeyboardEvent) {
    if (this.locked) return; // a slide-over owns the keyboard (Esc handled there)
    switch (e.key) {
      // Step-aware keys: reveal/hide a sub-step before changing slide.
      case 'ArrowDown': case 'PageDown': case ' ': case 'Spacebar':
        e.preventDefault(); this.stepForward(); break;
      case 'ArrowUp': case 'PageUp':
        e.preventDefault(); this.stepBack(); break;
      // Presenter escape hatch: always move between slides.
      case 'ArrowRight': e.preventDefault(); this.next(); break;
      case 'ArrowLeft': e.preventDefault(); this.prev(); break;
      case 'Home': e.preventDefault(); this.goTo(0); break;
      case 'End': e.preventDefault(); this.goTo(this.slides.length - 1); break;
      case 'f': case 'F': e.preventDefault(); this.toggleFullscreen(); break;
    }
  }

  private onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('a, button, .deck-chrome, [data-deck-nochrome]')) return; // let links/controls work
    if (window.getSelection()?.toString()) return;
    if (!e.clientX && !e.clientY) return; // ignore synthetic/coordinateless clicks
    const x = e.clientX;
    if (x > window.innerWidth / 2) this.stepForward(); else this.stepBack();
  };

  private onTouchStart = (e: TouchEvent) => {
    this.touchX = e.changedTouches[0].clientX;
    this.touchY = e.changedTouches[0].clientY;
  };

  private onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) this.stepForward(); else this.stepBack();
    }
  };

  // ── Fullscreen ──────────────────────────────────────────────────
  // Fullscreen the document element (not the fixed deck root): more robust
  // across browsers and avoids position:fixed fullscreen quirks.
  private toggleFullscreen() {
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    const isFs = document.fullscreenElement || doc.webkitFullscreenElement;
    try {
      if (!isFs) {
        const req = (el.requestFullscreen || el.webkitRequestFullscreen);
        if (req) Promise.resolve(req.call(el)).catch(() => {});
      } else {
        const exit = (document.exitFullscreen || doc.webkitExitFullscreen);
        if (exit) Promise.resolve(exit.call(document)).catch(() => {});
      }
    } catch { /* fullscreen unavailable — no-op */ }
  }

  // ── Auto-hide controls / cursor ─────────────────────────────────
  private wake() {
    this.root.classList.remove('deck-idle');
    window.clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => {
      if (!this.destroyed) this.root.classList.add('deck-idle');
    }, 2600);
  }
}

/** Bootstrap any [data-deck] on the page; clean up across View Transitions. */
export function initDeck() {
  const root = document.querySelector<HTMLElement>('[data-deck]');
  const w = window as Window & { __edfDeck?: Deck };
  w.__edfDeck?.destroy();
  if (root) w.__edfDeck = new Deck(root);
}

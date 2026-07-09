/**
 * Deck controller — keynote-style presentation.
 * No scroll: each slide is full-screen; advance one slide at a time with a
 * horizontal slide transition (~500ms ease-in-out), cross-fade under
 * prefers-reduced-motion. Presenter controls: arrows, space, PageUp/Down,
 * Home/End, click halves, swipe, fullscreen (F). Animations fire when a slide
 * becomes active (and replay on revisit).
 */
import { prepareSlide, playSlide } from './animations';

const SLIDE_MS = 500;

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      prepareSlide(s);
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
  }

  private bind() {
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onResize);
    this.root.addEventListener('mousemove', this.onMove);
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.root.addEventListener('touchend', this.onTouchEnd, { passive: true });

    this.root.querySelector('[data-deck-prev]')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.prev(); });
    this.root.querySelector('[data-deck-next]')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.next(); });
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

  // ── Navigation ──────────────────────────────────────────────────
  goTo(i: number) {
    const clamped = Math.max(0, Math.min(this.slides.length - 1, i));
    if (clamped === this.index) return;
    this.index = clamped;
    // Re-hide the incoming slide while it is still off-screen, then replay.
    prepareSlide(this.slides[this.index]);
    this.render();
    this.updateChrome();
    this.scheduleActivate(reduced ? 0 : SLIDE_MS + 20);
    this.wake();
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
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Spacebar':
        e.preventDefault(); this.next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); this.prev(); break;
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
    if (x > window.innerWidth / 2) this.next(); else this.prev();
  };

  private onTouchStart = (e: TouchEvent) => {
    this.touchX = e.changedTouches[0].clientX;
    this.touchY = e.changedTouches[0].clientY;
  };

  private onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) this.next(); else this.prev();
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

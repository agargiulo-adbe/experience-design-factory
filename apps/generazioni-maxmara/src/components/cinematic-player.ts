/**
 * cinematic-player.ts — controller del player video on-brand della LP `/maxmara-adobe/`.
 *
 * Vanilla TS (zero dipendenze), stesso pattern di `deck.ts`/`initDeck`:
 *   initPlayer() → istanza, esposta su window.__edfPlayer; destroy() ripulisce.
 * I listener da tastiera sono agganciati AL PLAYER (non globali): lo Spazio fuori
 * dal player continua a scrollare la pagina. Espone seekToChapter(id) per il
 * walkthrough (deep-link). Gestisce anche lo stato "video in arrivo" (nessun <video>).
 */
import { deckVideo, activeChapterId, formatTime } from '../data/deck-video';

interface PlayerApi {
  seekToChapter: (id: string) => void;
  destroy: () => void;
}
declare global {
  interface Window {
    __edfPlayer?: PlayerApi;
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

class CinematicPlayer {
  private root: HTMLElement;
  private video: HTMLVideoElement | null;
  private hint: HTMLElement | null;
  private seek: HTMLElement | null;
  private progress: HTMLElement | null;
  private buffer: HTMLElement | null;
  private timeNow: HTMLElement | null;
  private timeDur: HTMLElement | null;
  private chapterButtons: HTMLButtonElement[];
  private dragging = false;
  private idleTimer = 0;
  private cleanups: Array<() => void> = [];

  constructor(root: HTMLElement) {
    this.root = root;
    this.video = root.querySelector<HTMLVideoElement>('[data-player-video]');
    this.hint = root.querySelector<HTMLElement>('[data-player-hint]');
    this.seek = root.querySelector<HTMLElement>('[data-player-seek]');
    this.progress = root.querySelector<HTMLElement>('[data-player-progress]');
    this.buffer = root.querySelector<HTMLElement>('[data-player-buffer]');
    this.timeNow = root.querySelector<HTMLElement>('[data-player-time-current]');
    this.timeDur = root.querySelector<HTMLElement>('[data-player-time-duration]');
    this.chapterButtons = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-chapter-id]'),
    );

    // Progressive enhancement: il <video> ha `controls` nel markup (no-JS funziona);
    // con JS attivo passiamo ai controlli custom.
    if (this.video) this.video.removeAttribute('controls');

    this.wire();
    this.syncTime();
    this.reflectPlayState();
    this.reflectMuteState();
    this.reflectFullscreenState();
    // JS pronto: i controlli custom subentrano a quelli nativi (progressive enhancement).
    this.root.dataset.ready = 'true';
  }

  private on<K extends keyof HTMLElementEventMap>(
    el: EventTarget,
    type: K | string,
    handler: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions,
  ) {
    el.addEventListener(type, handler, opts);
    this.cleanups.push(() => el.removeEventListener(type, handler, opts));
  }

  private wire() {
    const root = this.root;

    // Toggle generici via data-action (play/pause, mute, fullscreen, rail, bigplay)
    this.on(root, 'click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      if (action === 'playpause' || action === 'bigplay') this.togglePlay();
      else if (action === 'mute') this.toggleMute();
      else if (action === 'fullscreen') this.toggleFullscreen();
      else if (action === 'rail') this.toggleRail();
    });

    // Capitoli → seek
    for (const btn of this.chapterButtons) {
      this.on(btn, 'click', () => this.seekToChapter(btn.dataset.chapterId ?? ''));
    }

    // Tastiera SCOPED al player (i listener su `root` scattano solo se il focus è dentro)
    this.on(root, 'keydown', (e) => this.onKey(e as KeyboardEvent));

    if (this.video) {
      const v = this.video;
      this.on(v, 'timeupdate', () => this.syncTime());
      this.on(v, 'loadedmetadata', () => this.syncTime());
      this.on(v, 'progress', () => this.syncBuffer());
      this.on(v, 'play', () => this.reflectPlayState());
      this.on(v, 'pause', () => this.reflectPlayState());
      this.on(v, 'volumechange', () => this.reflectMuteState());
      this.on(v, 'ended', () => {
        this.setIdle(false);
        this.reflectPlayState();
      });

      // Seek bar: puntatore (click + drag)
      if (this.seek) {
        const seek = this.seek;
        this.on(seek, 'pointerdown', (e) => {
          const pe = e as PointerEvent;
          this.dragging = true;
          seek.setPointerCapture(pe.pointerId);
          this.seekToRatio(this.ratioFromEvent(pe));
        });
        this.on(seek, 'pointermove', (e) => {
          if (this.dragging) this.seekToRatio(this.ratioFromEvent(e as PointerEvent));
        });
        const endDrag = () => {
          this.dragging = false;
        };
        this.on(seek, 'pointerup', endDrag);
        this.on(seek, 'pointercancel', endDrag);
      }

      // Auto-hide chrome quando in play (mai sotto reduced-motion)
      this.on(root, 'pointermove', () => this.bumpIdle());
      this.on(root, 'focusin', () => this.setIdle(false));

      // Fullscreen sync
      this.on(document, 'fullscreenchange', () => this.reflectFullscreenState());
    }
  }

  // ── Stato play/pause ──────────────────────────────────────────────
  private togglePlay() {
    if (!this.video) {
      this.flashHint();
      return;
    }
    if (this.video.paused) void this.video.play();
    else this.video.pause();
  }

  private reflectPlayState() {
    if (!this.video) return;
    const playing = !this.video.paused && !this.video.ended;
    this.root.dataset.playing = playing ? 'true' : 'false';
    const btn = this.root.querySelector<HTMLElement>('[data-action="playpause"]');
    if (btn) {
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btn.setAttribute('aria-label', playing ? 'Pausa' : 'Riproduci');
    }
    if (playing) this.bumpIdle();
    else this.setIdle(false);
  }

  // ── Mute ──────────────────────────────────────────────────────────
  private toggleMute() {
    if (!this.video) return;
    this.video.muted = !this.video.muted;
  }

  private reflectMuteState() {
    if (!this.video) return;
    const muted = this.video.muted || this.video.volume === 0;
    this.root.dataset.muted = muted ? 'true' : 'false';
    const btn = this.root.querySelector<HTMLElement>('[data-action="mute"]');
    if (btn) {
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      btn.setAttribute('aria-label', muted ? 'Riattiva audio' : 'Disattiva audio');
    }
  }

  // ── Fullscreen ────────────────────────────────────────────────────
  private toggleFullscreen() {
    if (!document.fullscreenElement) void this.root.requestFullscreen?.();
    else void document.exitFullscreen?.();
  }

  private reflectFullscreenState() {
    const fs = document.fullscreenElement === this.root;
    this.root.dataset.fullscreen = fs ? 'true' : 'false';
    const btn = this.root.querySelector<HTMLElement>('[data-action="fullscreen"]');
    if (btn) {
      btn.setAttribute('aria-pressed', fs ? 'true' : 'false');
      btn.setAttribute('aria-label', fs ? 'Esci da schermo intero' : 'Schermo intero');
    }
  }

  // ── Rail capitoli (bottom-sheet su mobile) ────────────────────────
  private toggleRail() {
    const open = this.root.dataset.railOpen === 'true';
    this.root.dataset.railOpen = open ? 'false' : 'true';
    const btn = this.root.querySelector<HTMLElement>('[data-action="rail"]');
    if (btn) btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  }

  // ── Seek ──────────────────────────────────────────────────────────
  private ratioFromEvent(e: PointerEvent): number {
    if (!this.seek) return 0;
    const rect = this.seek.getBoundingClientRect();
    return clamp((e.clientX - rect.left) / rect.width, 0, 1);
  }

  private seekToRatio(ratio: number) {
    if (!this.video) return;
    const dur = Number.isFinite(this.video.duration) ? this.video.duration : 0;
    if (dur > 0) this.video.currentTime = ratio * dur;
  }

  private nudge(deltaSeconds: number) {
    if (!this.video) return;
    const dur = Number.isFinite(this.video.duration) ? this.video.duration : 0;
    this.video.currentTime = clamp(this.video.currentTime + deltaSeconds, 0, dur || Infinity);
  }

  private nudgeVolume(delta: number) {
    if (!this.video) return;
    this.video.muted = false;
    this.video.volume = clamp(this.video.volume + delta, 0, 1);
  }

  private siblingChapter(dir: 1 | -1) {
    const chapters = deckVideo.chapters;
    if (!this.video || !chapters.length) return;
    const current = activeChapterId(this.video.currentTime, chapters);
    const idx = Math.max(0, chapters.findIndex((c) => c.id === current));
    const next = clamp(idx + dir, 0, chapters.length - 1);
    this.seekToChapter(chapters[next].id);
  }

  // ── Sync UI col tempo ─────────────────────────────────────────────
  private syncTime() {
    const v = this.video;
    const dur =
      v && Number.isFinite(v.duration) && v.duration > 0
        ? v.duration
        : deckVideo.durationHint ?? 0;
    const now = v ? v.currentTime : 0;
    const ratio = dur > 0 ? clamp(now / dur, 0, 1) : 0;

    if (this.progress) this.progress.style.width = `${ratio * 100}%`;
    if (this.timeNow) this.timeNow.textContent = formatTime(now);
    if (this.timeDur) this.timeDur.textContent = formatTime(dur);

    const activeId = activeChapterId(now, deckVideo.chapters);
    const activeLabel = deckVideo.chapters.find((c) => c.id === activeId)?.label ?? '';
    if (this.seek) {
      this.seek.setAttribute('aria-valuemin', '0');
      this.seek.setAttribute('aria-valuemax', String(Math.round(dur)));
      this.seek.setAttribute('aria-valuenow', String(Math.round(now)));
      this.seek.setAttribute(
        'aria-valuetext',
        `${formatTime(now)}${activeLabel ? ` · capitolo ${activeLabel}` : ''}`,
      );
    }
    this.root.dataset.activeChapter = activeId ?? '';
    for (const btn of this.chapterButtons) {
      const on = btn.dataset.chapterId === activeId;
      btn.setAttribute('aria-current', on ? 'true' : 'false');
    }
  }

  private syncBuffer() {
    const v = this.video;
    if (!v || !this.buffer || v.buffered.length === 0) return;
    const dur = Number.isFinite(v.duration) ? v.duration : 0;
    if (dur <= 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    this.buffer.style.width = `${clamp(end / dur, 0, 1) * 100}%`;
  }

  // ── Idle / auto-hide chrome ───────────────────────────────────────
  private bumpIdle() {
    this.setIdle(false);
    if (reducedMotion()) return;
    window.clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => {
      if (this.video && !this.video.paused) this.setIdle(true);
    }, 2600);
  }

  private setIdle(idle: boolean) {
    this.root.dataset.idle = idle ? 'true' : 'false';
  }

  // ── Hint (stato "video in arrivo") ────────────────────────────────
  private flashHint() {
    if (!this.hint) return;
    this.hint.dataset.flash = 'true';
    window.setTimeout(() => {
      if (this.hint) this.hint.dataset.flash = 'false';
    }, 2400);
  }

  // ── API pubblica: deep-link dai capitoli / dal walkthrough ────────
  seekToChapter(id: string) {
    const chapter = deckVideo.chapters.find((c) => c.id === id);
    const behavior: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth';
    this.root.scrollIntoView({ behavior, block: 'center' });
    if (!this.video || !chapter) {
      this.flashHint();
      return;
    }
    this.video.currentTime = chapter.start;
    void this.video.play();
    this.syncTime();
    this.video.focus({ preventScroll: true });
  }

  // ── Tastiera (scoped: il listener è su root, scatta solo col focus dentro) ──
  private onKey(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const onButton = target.tagName === 'BUTTON' || target.tagName === 'A';
    switch (e.key) {
      case ' ':
      case 'k':
        if (onButton) return; // lascia attivare il bottone focalizzato
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nudge(5);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.nudge(-5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.nudgeVolume(0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.nudgeVolume(-0.1);
        break;
      case '.':
        e.preventDefault();
        this.siblingChapter(1);
        break;
      case ',':
        e.preventDefault();
        this.siblingChapter(-1);
        break;
      case 'Home':
        e.preventDefault();
        if (this.video) this.video.currentTime = 0;
        break;
      case 'End':
        e.preventDefault();
        if (this.video && Number.isFinite(this.video.duration))
          this.video.currentTime = this.video.duration;
        break;
      case 'm':
        e.preventDefault();
        this.toggleMute();
        break;
      case 'f':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      default:
        break;
    }
  }

  destroy() {
    window.clearTimeout(this.idleTimer);
    for (const off of this.cleanups) off();
    this.cleanups = [];
  }
}

export function initPlayer() {
  // Singola istanza per pagina; ripulisce l'eventuale precedente (view transitions).
  window.__edfPlayer?.destroy();
  const root = document.querySelector<HTMLElement>('[data-player]');
  if (!root) {
    window.__edfPlayer = undefined;
    return;
  }
  const player = new CinematicPlayer(root);
  window.__edfPlayer = {
    seekToChapter: (id: string) => player.seekToChapter(id),
    destroy: () => player.destroy(),
  };
}

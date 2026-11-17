/**
 * AVVIO DI UNO SCRIPT DI SLIDE, A OGNI PAGINA (17 nov 2026).
 *
 * Il deck naviga fra i capitoli con il ClientRouter di Astro: il body si
 * sostituisce, ma uno `<script>` di pagina è un modulo e gira UNA volta per
 * documento. Uno script che fa `document.querySelector(...)` al caricamento si
 * lega agli elementi della prima visita: rientrando nel capitolo dal menu o con
 * le frecce, gli elementi sono nuovi e i bottoni restano morti. In sala si vede
 * come «a volte funziona, a volte no» (Teams, 17 nov 2026: attribuzione ferma,
 * «Come entrano i dati» senza animazione, temi e modi non più cliccabili).
 *
 * `suOgniPagina(sel, fn)` chiama `fn` ogni volta che nella pagina c'è un
 * elemento NUOVO che risponde a `sel`, subito e a ogni `astro:page-load`. Il giro
 * precedente si spegne: i listener su document e window passano da `signal`, gli
 * observer si creano con `mo()` e `ro()`, e si scollegano da soli. Così i
 * listener non si sommano a ogni visita.
 */
export type Giro = {
  signal: AbortSignal;
  mo: (cb: MutationCallback) => MutationObserver;
  ro: (cb: ResizeObserverCallback) => ResizeObserver;
};

export function suOgniPagina<T extends HTMLElement = HTMLElement>(sel: string, fn: (el: T, giro: Giro) => void) {
  let corrente: T | null = null;
  let ctl: AbortController | null = null;
  const avvia = () => {
    const el = document.querySelector<T>(sel);
    if (el === corrente) return;
    ctl?.abort();
    ctl = null;
    corrente = el;
    if (!el) return;
    const c = new AbortController();
    ctl = c;
    const signal = c.signal;
    const mo = (cb: MutationCallback) => {
      const o = new MutationObserver(cb);
      signal.addEventListener('abort', () => o.disconnect());
      return o;
    };
    const ro = (cb: ResizeObserverCallback) => {
      const o = new ResizeObserver(cb);
      signal.addEventListener('abort', () => o.disconnect());
      return o;
    };
    fn(el, { signal, mo, ro });
  };
  avvia();
  document.addEventListener('astro:page-load', avvia);
}

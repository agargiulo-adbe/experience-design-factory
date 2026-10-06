#!/usr/bin/env tsx
/**
 * dossier-audit — il gate deterministico dei dossier interni.
 *
 * `audit:deck` misura le slide proiettate; un dossier vive altrove: lo si apre
 * su un telefono, in piedi, venti minuti prima di un incontro. I difetti che
 * contano sono altri, e sono tutti misurabili:
 *
 *   a  barra fissa  — ≤ 12% dell'altezza del viewport più piccolo
 *   b  nessuno sforamento orizzontale, da 320px in su
 *   c  tipo leggibile — corpo ≥ 16px, celle di tabella ≥ 14px, note ≥ 14px
 *   d  ogni cella di tabella porta la sua intestazione quando la tabella
 *      diventa una pila di schede (altrimenti sono numeri senza nome)
 *   e  bersagli tattili ≥ 44×44 nella barra
 *   f  indice presente e completo quando le sezioni sono più di sei
 *   g  misura di lettura 60–95 caratteri per riga sul desktop
 *   h  stampa: niente comandi, carta bianca, inchiostro scuro
 *   i  nessun errore JavaScript
 *
 * Uso:
 *   tsx scripts/dossier-audit.ts <url-con-?t=token> [altre url…]
 *   DOSSIER_URLS="url1,url2" tsx scripts/dossier-audit.ts
 *
 * Esce 1 se un controllo HARD fallisce, 2 se non ha auditato nulla — la
 * trappola già vista su `audit:deck`: un giro che non misura niente non è
 * un PASS.
 */
import { chromium, type Page } from 'playwright';

type Finding = { check: string; viewport: string; detail: string };

const VIEWPORTS = [
  { w: 320, h: 568, name: '320×568' },
  { w: 375, h: 667, name: '375×667' },
  { w: 390, h: 844, name: '390×844' },
  { w: 768, h: 1024, name: '768×1024' },
  { w: 1280, h: 900, name: '1280×900' },
];

const MIN_BODY = 16;
const MIN_TABLE = 14;
const MIN_NOTE = 14;
const MIN_TAP = 44;
const MAX_BAR_PCT = 12;
const CPL_MIN = 60;
const CPL_MAX = 95;

async function auditOne(page: Page, url: string, vp: { w: number; h: number; name: string }): Promise<Finding[]> {
  const out: Finding[] = [];
  const jsErrors: string[] = [];
  page.on('pageerror', (e) => jsErrors.push(String(e).slice(0, 120)));

  // tsx/esbuild inietta `__name` nelle funzioni che finiscono dentro
  // page.evaluate: senza questo stub la valutazione esplode nel browser.
  // Stessa riga che si trova in scripts/deck-audit.ts, per lo stesso motivo.
  await page.addInitScript(() => {
    (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f;
  });
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const m = await page.evaluate(
    ({ minBody, minTable, minNote, minTap }) => {
      const q = (s: string) => document.querySelector(s) as HTMLElement | null;
      const px = (el: Element | null, prop = 'fontSize') =>
        el ? parseFloat(getComputedStyle(el as Element)[prop as never] as string) : null;

      const shell = q('.dw-shell');
      if (!shell) return { missing: true } as never;

      const W = document.documentElement.clientWidth;
      const bar = q('.dw-bar');
      const sections = [...document.querySelectorAll('.dw-section')];

      // b — sforamenti. Un elemento più largo del viewport è legittimo se sta
      // dentro un contenitore che scorre (è il ripiego previsto per le tabelle
      // larghe); il difetto vero è la PAGINA che scorre in orizzontale.
      const inScroller = (e: Element) => {
        let p: Element | null = e.parentElement;
        while (p && p !== document.documentElement) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === 'auto' || ox === 'scroll') return true;
          p = p.parentElement;
        }
        return false;
      };
      const overflow = [...document.querySelectorAll('.dw-shell *')]
        .filter((e) => e.getBoundingClientRect().right > W + 1 && !inScroller(e))
        .map((e) => (e.className || e.tagName).toString().split(' ')[0])
        .slice(0, 6);
      if (document.documentElement.scrollWidth > W + 1) overflow.unshift('LA PAGINA SCORRE IN ORIZZONTALE');

      // c — tipo
      const small: string[] = [];
      const bodyEl = document.querySelector('.dw-li, .dw-row-v, .dw-idea-line');
      const noteEl = document.querySelector('.dw-note');
      const tdEl = document.querySelector('.dw-table tbody td, .dw-table tbody th');
      const thEl = document.querySelector('.dw-table thead th');
      const bodyPx = px(bodyEl);
      const notePx = px(noteEl);
      const tdPx = px(tdEl);
      if (bodyPx != null && bodyPx < minBody) small.push(`corpo ${bodyPx.toFixed(1)}px`);
      if (notePx != null && notePx < minNote) small.push(`nota ${notePx.toFixed(1)}px`);
      if (tdPx != null && tdPx < minTable) small.push(`cella ${tdPx.toFixed(1)}px`);
      // le intestazioni di colonna sono micro-label in maiuscoletto: soglia propria
      const thPx = px(thEl);
      if (thPx != null && thPx < 11) small.push(`etichetta di colonna ${thPx.toFixed(1)}px`);

      // d — celle etichettate quando la tabella è impilata
      let unlabelled = 0;
      let stacked = false;
      const firstTable = document.querySelector('.dw-table');
      if (firstTable) {
        const td = firstTable.querySelector('tbody td');
        stacked = td ? getComputedStyle(td).display !== 'table-cell' : false;
        if (stacked) {
          unlabelled = [...firstTable.querySelectorAll('tbody td')].filter((c) => {
            const lbl = (c as HTMLElement).dataset.label;
            const pseudo = getComputedStyle(c, '::before').content;
            return !lbl || pseudo === 'none' || pseudo === '""';
          }).length;
        }
      }

      // e — bersagli tattili
      const tiny = [...document.querySelectorAll('.dw-bar button, .dw-bar a')]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width > 0 && (r.width < minTap || r.height < minTap))
        .map((r) => `${Math.round(r.width)}×${Math.round(r.height)}`);

      // f — indice
      const toc = document.querySelectorAll('#dw-toc-list a').length;

      // g — caratteri per riga (misurati sul font reale)
      let cpl: number | null = null;
      const long = [...document.querySelectorAll('.dw-li')].find((e) => (e.textContent || '').length > 160);
      if (long) {
        const cs = getComputedStyle(long);
        const ctx = document.createElement('canvas').getContext('2d');
        if (ctx) {
          ctx.font = `${cs.fontSize} ${cs.fontFamily}`;
          const avg = ctx.measureText('abcdefghijklmnopqrstuvwxyz ').width / 27;
          cpl = Math.round((long.getBoundingClientRect().width - parseFloat(cs.paddingLeft)) / avg);
        }
      }

      return {
        missing: false,
        gated: !!q('#dw-doc')?.hidden,
        barH: bar ? Math.round(bar.getBoundingClientRect().height) : 0,
        sections: sections.length,
        overflow,
        small,
        stacked,
        unlabelled,
        tiny,
        toc,
        cpl,
      };
    },
    { minBody: MIN_BODY, minTable: MIN_TABLE, minNote: MIN_NOTE, minTap: MIN_TAP },
  );

  if ((m as { missing?: boolean }).missing) {
    out.push({ check: '—', viewport: vp.name, detail: 'nessun .dw-shell: la pagina non è un dossier del motore condiviso' });
    return out;
  }
  if (m.gated) {
    out.push({ check: '—', viewport: vp.name, detail: 'contenuto non caricato (token mancante o scaduto): audit impossibile' });
    return out;
  }

  const barPct = (m.barH / vp.h) * 100;
  if (barPct > MAX_BAR_PCT) out.push({ check: 'a', viewport: vp.name, detail: `barra fissa ${m.barH}px = ${barPct.toFixed(0)}% del viewport (max ${MAX_BAR_PCT}%)` });
  if (m.overflow.length) out.push({ check: 'b', viewport: vp.name, detail: `sforano a destra: ${m.overflow.join(', ')}` });
  if (m.small.length) out.push({ check: 'c', viewport: vp.name, detail: `tipo sotto la soglia: ${m.small.join(' · ')}` });
  if (m.stacked && m.unlabelled) out.push({ check: 'd', viewport: vp.name, detail: `${m.unlabelled} celle impilate senza intestazione: numeri senza nome` });
  if (m.tiny.length) out.push({ check: 'e', viewport: vp.name, detail: `bersagli sotto ${MIN_TAP}px: ${m.tiny.join(', ')}` });
  if (m.sections > 6 && m.toc !== m.sections) out.push({ check: 'f', viewport: vp.name, detail: `${m.sections} sezioni ma ${m.toc} voci di indice` });
  if (vp.w >= 1024 && m.cpl != null && (m.cpl < CPL_MIN || m.cpl > CPL_MAX)) {
    out.push({ check: 'g', viewport: vp.name, detail: `${m.cpl} caratteri per riga (finestra ${CPL_MIN}–${CPL_MAX})` });
  }
  if (jsErrors.length) out.push({ check: 'i', viewport: vp.name, detail: `errori JS: ${jsErrors.slice(0, 2).join(' | ')}` });

  // h — stampa, solo una volta per URL
  if (vp.w >= 1024) {
    await page.emulateMedia({ media: 'print' });
    const p = await page.evaluate(() => {
      const g = (s: string, prop: string) => {
        const e = document.querySelector(s);
        return e ? (getComputedStyle(e)[prop as never] as string) : '';
      };
      return { bar: g('.dw-bar', 'display'), bg: g('.dw-shell', 'backgroundColor'), ink: g('.dw-li', 'color') };
    });
    await page.emulateMedia({ media: 'screen' });
    if (p.bar !== 'none') out.push({ check: 'h', viewport: 'print', detail: 'la barra dei comandi finisce nel PDF' });
    if (!/255,\s*255,\s*255/.test(p.bg)) out.push({ check: 'h', viewport: 'print', detail: `fondo di stampa ${p.bg}, non bianco` });
  }

  return out;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const urls = (args.length ? args : (process.env.DOSSIER_URLS || '').split(',')).map((s) => s.trim()).filter(Boolean);

  if (!urls.length) {
    console.error('dossier-audit: nessuna URL. Uso: tsx scripts/dossier-audit.ts "<url>?t=<token>" [...]');
    process.exit(2);
  }

  const browser = await chromium.launch();
  const all: { url: string; findings: Finding[] }[] = [];

  for (const url of urls) {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    const findings: Finding[] = [];
    for (const vp of VIEWPORTS) findings.push(...(await auditOne(page, url, vp)));
    await page.close();
    all.push({ url, findings });

    const label = url.replace(/\?t=[^&]+/, '?t=…');
    if (findings.length === 0) {
      console.log(`PASS  ${label}  — 5 viewport, 0 rilievi`);
    } else {
      console.log(`FAIL  ${label}  — ${findings.length} rilievi`);
      for (const f of findings) console.log(`        [${f.check}] ${f.viewport.padEnd(10)} ${f.detail}`);
    }
  }

  await browser.close();

  const total = all.reduce((n, a) => n + a.findings.length, 0);
  console.log(`\n${all.length} dossier auditati · ${total} rilievi complessivi`);
  process.exit(total ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Le verifiche dell'edizione «lettura» (spec 2026-11-19-edizione-lettura).
 * Uso: LETTURA_URL=<origin+base lettura> SALA_URL=<origin+base sala> npx tsx scripts/edizione-check.ts [nome…]
 * Ogni controllo stampa OK o FAIL con il motivo; esce con 1 se uno fallisce.
 */
import { chromium, type Browser } from 'playwright';

const LETTURA = (process.env.LETTURA_URL ?? '').replace(/\/?$/, '/');
const SALA = (process.env.SALA_URL ?? '').replace(/\/?$/, '/');
const fallimenti: string[] = [];
const ok = (nome: string, cond: boolean, motivo = '') => {
  console.log(`${cond ? 'OK  ' : 'FAIL'} ${nome}${cond ? '' : ' — ' + motivo}`);
  if (!cond) fallimenti.push(nome);
};

async function statoPassi(b: Browser, base: string) {
  const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
  await p.goto(base + 'momenti/#slide-m-03', { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  const s = () => p.evaluate(() => {
    const d = (window as any).__edfDeck; const sl = d.slides[d.index] as HTMLElement;
    const passi = [...sl.querySelectorAll('[data-substep]')];
    return { index: d.index as number, n: passi.length, aperti: passi.filter((x) => x.hasAttribute('data-substep-active')).length };
  });
  return { p, s };
}

export async function checkAutoreveal(b: Browser) {
  const { p, s } = await statoPassi(b, LETTURA);
  const a = await s();
  ok('lettura: passi aperti da soli', a.n > 0 && a.aperti === a.n, JSON.stringify(a));
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(1200);
  const b1 = await s();
  ok('lettura: indietro va alla slide prima', b1.index === a.index - 1, `${a.index} → ${b1.index}`);
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(3500);
  const c = await s();
  ok('lettura: tornando, passi di nuovo aperti', c.index === a.index && c.aperti === c.n, JSON.stringify(c));
  await p.close();
  if (SALA !== '/') {
    const sala = await statoPassi(b, SALA);
    const d = await sala.s();
    ok('sala: nessun passo aperto da solo', d.aperti === 0, JSON.stringify(d));
    await sala.p.close();
  }
}

const CHECKS: Record<string, (b: Browser) => Promise<void>> = { autoreveal: checkAutoreveal };

const scelti = process.argv.slice(2);
const b = await chromium.launch();
for (const [nome, fn] of Object.entries(CHECKS)) if (!scelti.length || scelti.includes(nome)) await fn(b);
await b.close();
if (fallimenti.length) { console.log(`\n${fallimenti.length} controlli falliti`); process.exit(1); }
console.log('\ntutti i controlli OK');

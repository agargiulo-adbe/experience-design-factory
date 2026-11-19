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
  const s = () => p.evaluate(() => {
    const d = (window as any).__edfDeck; const sl = d.slides[d.index] as HTMLElement;
    const passi = [...sl.querySelectorAll('[data-substep]')];
    return { index: d.index as number, n: passi.length, aperti: passi.filter((x) => x.hasAttribute('data-substep-active')).length };
  });
  // Il ritmo di lettura apre un passo ogni 1,6 s: si aspetta finché sono tutti aperti (al massimo 12 s).
  for (let t0 = Date.now(); Date.now() - t0 < 12000; await p.waitForTimeout(400)) { const x = await s(); if (x.n && x.aperti === x.n) break; }
  await p.waitForTimeout(base === SALA ? 3500 : 0);
  return { p, s };
}

export async function checkAutoreveal(b: Browser) {
  const { p, s } = await statoPassi(b, LETTURA);
  const a = await s();
  ok('lettura: passi aperti da soli', a.n > 0 && a.aperti === a.n, JSON.stringify(a));
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(1200);
  const b1 = await s();
  ok('lettura: indietro va alla slide prima', b1.index === a.index - 1, `${a.index} → ${b1.index}`);
  await p.keyboard.press('ArrowRight');
  for (let t0 = Date.now(); Date.now() - t0 < 12000; await p.waitForTimeout(400)) { const x = await s(); if (x.n && x.aperti === x.n) break; }
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

export async function checkParliamone(b: Browser) {
  const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
  await p.goto(LETTURA + 'parliamone/', { waitUntil: 'load' });
  const l = await p.evaluate(() => [...document.querySelectorAll('a')].map((a) => a.getAttribute('href') || ''));
  const mail = l.filter((h) => h.startsWith('mailto:'));
  const wa = l.filter((h) => h.startsWith('https://wa.me/'));
  ok('parliamone: tre email', mail.length === 3 && ['agordiani@', 'fellena@', 'agargiulo@'].every((x) => mail.some((m) => m.includes(x))), mail.join(' '));
  ok('parliamone: due WhatsApp, i numeri giusti', wa.length === 2 && wa.some((h) => h.includes('393489696067')) && wa.some((h) => h.includes('393499385457')), wa.join(' '));
  await p.close();
  if (SALA !== '/') {
    const s = await b.newPage();
    const r = await s.goto(SALA + 'parliamone/');
    ok('sala: parliamone non esiste', r?.status() === 404, String(r?.status()));
    await s.close();
  }
}

const SHOTS = process.env.SHOTS_DIR ?? '';
const telefono = (w: number, h: number) => ({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

export async function checkTelefono(b: Browser) {
  for (const [w, h, atteso] of [[390, 844, 'breve'], [844, 390, 'breve'], [820, 1180, 'momenti']] as const) {
    const c = await b.newContext(telefono(w, h)); const p = await c.newPage();
    await p.goto(LETTURA + 'momenti/', { waitUntil: 'load' }); await p.waitForTimeout(800);
    ok(`telefono ${w}×${h}: link profondo → ${atteso}`, p.url().includes(`/${atteso}/`), p.url());
    await c.close();
  }
  const c = await b.newContext(telefono(390, 844)); const p = await c.newPage();
  await p.goto(LETTURA, { waitUntil: 'load' }); await p.waitForTimeout(600);
  await p.click('[data-apri-comunque]'); await p.waitForTimeout(1500);
  ok('telefono: «apri comunque» porta alla copertina', !p.url().includes('/breve/'), p.url());
  await p.goto(LETTURA + 'momenti/', { waitUntil: 'load' }); await p.waitForTimeout(800);
  ok('telefono: dopo «apri comunque» niente rinvio', p.url().includes('/momenti/'), p.url());
  await c.close();
  for (const [w, h] of [[360, 740], [390, 844], [430, 932]] as const) {
    const c2 = await b.newContext(telefono(w, h)); const q = await c2.newPage();
    await q.goto(LETTURA + 'breve/', { waitUntil: 'load' }); await q.waitForTimeout(1200);
    const m = await q.evaluate(() => {
      const piccoli = [...document.querySelectorAll('main p, main li, main a, main h1, main h2')]
        .filter((e) => (e.textContent ?? '').trim().length > 20 && getComputedStyle(e).textTransform !== 'uppercase')
        .filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => (e.textContent ?? '').trim().slice(0, 40));
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, piccoli };
    });
    ok(`breve ${w}: niente scorrimento orizzontale`, m.sw <= m.iw, `${m.sw} > ${m.iw}`);
    ok(`breve ${w}: corpo ≥ 16px`, m.piccoli.length === 0, m.piccoli.join(' | '));
    if (SHOTS) await q.screenshot({ path: `${SHOTS}/breve-${w}.png`, fullPage: true });
    await c2.close();
  }
}

const ROTTE = ['', 'adobe/', 'scenario/', 'persona/', 'momenti/', 'messa-a-terra/', 'approfondimenti/', 'coworker/', 'risultati/', 'parliamone/'];
const AMMESSI = /^(localhost|127\.0\.0\.1|agargiulo-adbe\.github\.io|github\.com|objects\.githubusercontent\.com|release-assets\.githubusercontent\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|[a-z0-9-]+\.scene7\.com|[a-z0-9-]+\.supabase\.co)$/;

async function giro(b: Browser, opts: { mobile: boolean; gpc: boolean }) {
  const c = await b.newContext(opts.mobile ? telefono(390, 844) : { viewport: { width: 1512, height: 860 } });
  // Come stringa: tsx avvolge le funzioni con `__name`, che nel browser non esiste.
  if (opts.gpc) await c.addInitScript({ content: "Object.defineProperty(navigator, 'globalPrivacyControl', { get: function () { return true; } });" });
  const richieste: { url: string; metodo: string; corpo: string | null; pagina: string }[] = [];
  let pagina = '';
  c.on('request', (r) => richieste.push({ url: r.url(), metodo: r.method(), corpo: r.postData(), pagina }));
  const p = await c.newPage();
  for (const r of opts.mobile ? ['breve/'] : ROTTE) {
    pagina = r || 'copertina';
    await p.goto(LETTURA + r, { waitUntil: 'load' }); await p.waitForTimeout(1500);
  }
  await c.close();
  return richieste;
}

export async function checkRete(b: Browser) {
  for (const mobile of [false, true]) {
    const r = await giro(b, { mobile, gpc: false });
    const estranei = [...new Set(r.map((x) => new URL(x.url).hostname).filter((h) => !AMMESSI.test(h)))];
    ok(`rete ${mobile ? 'telefono' : 'computer'}: solo domini ammessi`, estranei.length === 0, estranei.join(' '));
    const db = r.filter((x) => x.url.includes('.supabase.co'));
    const attesa = mobile ? ['breve'] : ['copertina'];
    ok(`rete ${mobile ? 'telefono' : 'computer'}: verso Supabase solo il contatore`,
      db.length === attesa.length && db.every((x) => x.metodo === 'POST' && x.url.endsWith('/rest/v1/aperture')),
      db.map((x) => `${x.metodo} ${x.url} @${x.pagina}`).join(' | '));
    ok(`rete ${mobile ? 'telefono' : 'computer'}: il corpo dice solo progetto e pagina`,
      db.every((x) => { const o = JSON.parse(x.corpo ?? '{}'); return Object.keys(o).sort().join() === 'pagina,progetto'; }),
      db.map((x) => x.corpo).join(' | '));
    const g = await giro(b, { mobile, gpc: true });
    ok(`rete ${mobile ? 'telefono' : 'computer'}: con GPC nessuna chiamata a Supabase`, !g.some((x) => x.url.includes('.supabase.co')), g.filter((x) => x.url.includes('.supabase.co')).map((x) => `${x.metodo} ${x.url} @${x.pagina}`).join(' | '));
  }
}

export async function checkSala(b: Browser) {
  // Niente strumenti di chi presenta nella lettura: né il pulsante né il tasto P.
  const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
  await p.goto(LETTURA + 'momenti/', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  ok('lettura: nessun pulsante presentatore', (await p.locator('[data-pv-apri]').count()) === 0, 'trovato [data-pv-apri]');
  const popup = p.waitForEvent('popup', { timeout: 1500 }).then(() => true).catch(() => false);
  await p.keyboard.press('p');
  ok('lettura: il tasto P non apre niente', !(await popup), 'si è aperta una finestra');
  const nota = await p.goto(LETTURA, { waitUntil: 'load' }).then(() => p.textContent('body'));
  ok('lettura: la frase sul contatore dice «Non registriamo chi la apre»', (nota ?? '').includes('Non registriamo chi la apre'), '');
  await p.close();
}

export async function checkComeFunziona(b: Browser) {
  // In lettura il «Come funziona» è un passaggio obbligato: la freccia avanti lo apre.
  for (const [nome, base, atteso] of [['lettura', LETTURA, true], ['sala', SALA, false]] as const) {
    if (base === '/') continue;
    const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
    await p.goto(base + 'messa-a-terra/#slide-innesto', { waitUntil: 'load' }); await p.waitForTimeout(3500);
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1500);
    const aperto = await p.evaluate(() => !!document.querySelector('dialog[data-e2e][open]'));
    ok(`${nome}: dall'innesto la freccia ${atteso ? 'apre' : 'non apre'} il «Come funziona»`, aperto === atteso, `aperto=${aperto}`);
    await p.close();
  }
}

export async function checkRitmo(b: Browser) {
  // Le slide in cui ogni passo è uno stato: il primo stato resta a vista prima del cambio.
  const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
  await p.goto(LETTURA + 'messa-a-terra/#slide-attribuzione', { waitUntil: 'load' });
  const aperti = () => p.evaluate(() => { const d = (window as any).__edfDeck; const sl = d.slides[d.index] as HTMLElement; return [...sl.querySelectorAll('[data-substep]')].filter((x) => x.hasAttribute('data-substep-active')).length; });
  await p.waitForTimeout(2200);
  ok('ritmo: a 2,2 s l\'attribuzione mostra ancora il primo stato', (await aperti()) === 0, `aperti=${await aperti()}`);
  await p.waitForTimeout(5000);
  ok('ritmo: entro 7 s tutti i passi aperti', (await aperti()) === 2, `aperti=${await aperti()}`);
  await p.close();
}

const CHECKS: Record<string, (b: Browser) => Promise<void>> = { autoreveal: checkAutoreveal, parliamone: checkParliamone, telefono: checkTelefono, rete: checkRete, sala: checkSala, comefunziona: checkComeFunziona, ritmo: checkRitmo };

const scelti = process.argv.slice(2);
const b = await chromium.launch();
for (const [nome, fn] of Object.entries(CHECKS)) if (!scelti.length || scelti.includes(nome)) await fn(b);
await b.close();
if (fallimenti.length) { console.log(`\n${fallimenti.length} controlli falliti`); process.exit(1); }
console.log('\ntutti i controlli OK');

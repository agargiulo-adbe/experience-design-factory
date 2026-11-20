/**
 * Le verifiche dell'edizione «lettura» (spec 2026-11-19-edizione-lettura).
 * Uso: LETTURA_URL=<origin+base lettura> SALA_URL=<origin+base sala> [INSIEME_URL=<origin+base versione B>] npx tsx scripts/edizione-check.ts [nome…]
 * Ogni controllo stampa OK o FAIL con il motivo; esce con 1 se uno fallisce.
 */
import { chromium, type Browser } from 'playwright';

const LETTURA = (process.env.LETTURA_URL ?? '').replace(/\/?$/, '/');
const SALA = (process.env.SALA_URL ?? '').replace(/\/?$/, '/');
const INSIEME = (process.env.INSIEME_URL ?? '').replace(/\/?$/, '/');
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
  // La slide precedente riapre i suoi passi: si aspetta l'anello pieno, come farebbe chi legge.
  await p.waitForFunction(() => (window as any).__edfDeck.root.hasAttribute('data-lettura-pronta'), null, { timeout: 15000 }).catch(() => {});
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
        .filter((e) => !e.closest('footer') && (e.textContent ?? '').trim().length > 20 && getComputedStyle(e).textTransform !== 'uppercase')
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

/** Il contatore conta solo sul dominio pubblicato (ContaAperture.astro). */
const PUBBLICATO = (u: string) => new URL(u).hostname === 'agargiulo-adbe.github.io';

async function giro(b: Browser, opts: { mobile: boolean; gpc: boolean }) {
  const c = await b.newContext(opts.mobile ? telefono(390, 844) : { viewport: { width: 1512, height: 860 } });
  // Come stringa: tsx avvolge le funzioni con `__name`, che nel browser non esiste.
  if (opts.gpc) await c.addInitScript({ content: "Object.defineProperty(navigator, 'globalPrivacyControl', { get: function () { return true; } });" });
  // Il contatore non conta i browser pilotati: qui si finge un browser vero, e la
  // chiamata si ferma prima del database (prima del 20 nov il check scriveva lì).
  await c.addInitScript({ content: "Object.defineProperty(navigator, 'webdriver', { get: function () { return false; } });" });
  await c.route('**/rest/v1/aperture', (x) => x.fulfill({ status: 201, body: '' }));
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
    // Il contatore parte solo sul sito pubblicato: contro un'anteprima locale non deve partire.
    const attesa = !PUBBLICATO(LETTURA) ? [] : mobile ? ['breve'] : ['copertina'];
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
    if (atteso) await p.waitForFunction(() => (window as any).__edfDeck.root.hasAttribute('data-lettura-pronta'), null, { timeout: 15000 }).catch(() => {});
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

export async function checkAnello(b: Browser) {
  // L'anello sul pulsante «avanti» e la rete: prima freccia = completa, seconda = slide dopo.
  const p = await b.newPage({ viewport: { width: 1512, height: 860 } });
  await p.goto(LETTURA + 'messa-a-terra/#slide-attribuzione', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const st = () => p.evaluate(() => { const d = (window as any).__edfDeck; const r = d.root as HTMLElement; const sl = d.slides[d.index] as HTMLElement; const ps = [...sl.querySelectorAll('[data-substep]')];
    return { i: d.index as number, corsa: r.hasAttribute('data-lettura-corsa'), pronta: r.hasAttribute('data-lettura-pronta'), aperti: ps.filter((x) => x.hasAttribute('data-substep-active')).length, n: ps.length }; });
  const a = await st();
  ok('anello: in corsa a 1,2 s, non ancora pronto', a.corsa && !a.pronta, JSON.stringify(a));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(500);
  const b1 = await st();
  ok('anello: la prima freccia completa la slide senza cambiarla', b1.i === a.i && b1.aperti === b1.n && b1.pronta, JSON.stringify(b1));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1200);
  const c = await st();
  ok('anello: la seconda freccia va alla slide dopo', c.i === a.i + 1, JSON.stringify(c));
  await p.close();
  if (SALA !== '/') {
    const s = await b.newPage({ viewport: { width: 1512, height: 860 } });
    await s.goto(SALA + 'messa-a-terra/#slide-attribuzione', { waitUntil: 'load' }); await s.waitForTimeout(1200);
    ok('sala: nessun anello', !(await s.evaluate(() => (window as any).__edfDeck.root.hasAttribute('data-lettura-corsa'))), '');
    await s.close();
  }
}

export async function checkInsieme(b: Browser) {
  // La versione A non ha né modulo né riepilogo.
  const a = await b.newPage({ viewport: { width: 1366, height: 768 } });
  await a.goto(LETTURA + 'momenti/', { waitUntil: 'load' }); await a.waitForTimeout(1200);
  ok('A: nessun modulo e nessun «Fateci una domanda»', (await a.locator('dialog[data-edf-contributo], .edf-mc-chiedi').count()) === 0, '');
  const r404 = await a.goto(LETTURA + 'riepilogo/');
  ok('A: il riepilogo non esiste', r404?.status() === 404, `status=${r404?.status()}`);
  await a.close();
  if (INSIEME === '/') { console.log('—    versione B saltata (manca INSIEME_URL)'); return; }

  // B, computer: prima di un invio verso Supabase va solo il contatore.
  const c = await b.newContext({ viewport: { width: 1366, height: 768 } });
  const rich: { url: string; metodo: string; corpo: string | null }[] = [];
  c.on('request', (x) => { if (x.url().includes('.supabase.co')) rich.push({ url: x.url(), metodo: x.method(), corpo: x.postData() }); });
  // L'invio non deve scrivere nel database vero: la rotta risponde da sé.
  await c.route('**/rest/v1/contributi', (x) => x.fulfill({ status: 201, body: '' }));
  // Il contatore non scrive nel database vero, e conta solo un browser non
  // pilotato sul sito pubblicato: qui gli si nasconde `webdriver`.
  await c.route('**/rest/v1/aperture', (x) => x.fulfill({ status: 201, body: '' }));
  await c.addInitScript({ content: "Object.defineProperty(navigator, 'webdriver', { get: function () { return false; } });" });
  const p = await c.newPage();
  for (const r of ['', 'momenti/', 'parliamone/']) { await p.goto(INSIEME + r, { waitUntil: 'load' }); await p.waitForTimeout(1200); }
  const attesoB = PUBBLICATO(INSIEME) ? 1 : 0;
  ok('B: prima dell\'invio verso Supabase solo il contatore', rich.length === attesoB && rich.every((x) => x.url.endsWith('/rest/v1/aperture')), rich.map((x) => `${x.metodo} ${x.url}`).join(' | '));
  if (attesoB) ok('B: il contatore conta la versione B', JSON.parse(rich[0]?.corpo ?? '{}').progetto === 'intesa-storia-insieme', rich[0]?.corpo ?? '');
  await p.goto(INSIEME + 'momenti/', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  await p.locator('.edf-mc-chiedi').click();
  const sez = await p.inputValue('dialog[data-edf-contributo] input[name=sezione]');
  ok('B: «Fateci una domanda» precompila capitolo e slide, in italiano', sez.includes(' · ') && !/[Ss]he |the /.test(sez), sez);
  const i0 = await p.evaluate(() => (window as any).__edfDeck.index);
  await p.locator('dialog[data-edf-contributo] textarea').focus();
  await p.keyboard.type('Come si collega al nostro CRM? ');
  await p.keyboard.press('ArrowRight');
  ok('B: scrivere nel modulo non muove il deck', (await p.evaluate(() => (window as any).__edfDeck.index)) === i0, '');
  await p.selectOption('dialog[data-edf-contributo] select[name=funzione]', 'dati');
  const prima = rich.length;
  await p.locator('[data-edf-mc-invia]').click(); await p.waitForTimeout(600);
  const inv = rich.slice(prima).filter((x) => x.url.endsWith('/rest/v1/contributi'));
  const chiavi = inv.length ? Object.keys(JSON.parse(inv[0].corpo ?? '{}')).sort().join() : '';
  ok('B: l\'invio porta solo i sei campi anonimi', chiavi === 'funzione,livello,ok_riepilogo,progetto,sezione,testo', chiavi);
  ok('B: la casella del riepilogo parte spenta', inv.length === 1 && JSON.parse(inv[0].corpo ?? '{}').ok_riepilogo === false, inv[0]?.corpo ?? '');
  ok('B: dopo l\'invio, la conferma', await p.locator('[data-edf-mc-fatto]').isVisible(), '');
  await c.close();

  // Il riepilogo: senza token nessuna chiamata, e dal telefono non rimanda alla pagina breve.
  const t = await b.newContext(telefono(390, 844));
  const rt: string[] = [];
  t.on('request', (x) => { if (x.url().includes('.supabase.co')) rt.push(x.url()); });
  const q = await t.newPage();
  await q.goto(INSIEME + 'riepilogo/', { waitUntil: 'load' }); await q.waitForTimeout(1200);
  ok('B: il riepilogo dal telefono resta il riepilogo', q.url().endsWith('/riepilogo/'), q.url());
  ok('B: senza token, nessuna chiamata e un messaggio', rt.length === 0 && /link personale/.test(await q.textContent('[data-rp-msg]') ?? ''), rt.join(' '));
  await t.close();
}

export async function checkFunzioni(b: Browser) {
  // Le card per funzione: ogni tappa esiste e porta il titolo della sua slide;
  // `?f=` dà il nome al pulsante della barra e segna la tappa corrente.
  const { CARD_FUNZIONI } = await import('../apps/intesa-esperienza-cliente/src/data/funzioni.ts');
  const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
  const titoli = new Map<string, string>();
  for (const pagina of [...new Set(CARD_FUNZIONI.flatMap((c) => c.tappe.map((t) => t.href.split('#')[0])))]) {
    await p.goto(LETTURA + pagina, { waitUntil: 'load' });
    const t = await p.evaluate(() => [...document.querySelectorAll('[data-slide]')].map((s) => {
      const h = s.querySelector('h1, h2, h3'); if (!h) return [s.id, ''];
      const c = h.cloneNode(true) as HTMLElement; c.querySelectorAll('[data-lang-en]').forEach((x) => x.remove());
      return [s.id, (c.textContent ?? '').replace(/\s+/g, ' ').trim()];
    }));
    for (const [id, tt] of t) titoli.set(`${pagina}#${id}`, tt);
  }
  const sbagliate = CARD_FUNZIONI.flatMap((c) => c.tappe.filter((t) => titoli.get(t.href) !== t.t).map((t) => `${c.k}: ${t.href} → «${titoli.get(t.href) ?? 'slide assente'}»`));
  ok('funzioni: ogni tappa esiste e ha il titolo della sua slide', sbagliate.length === 0, sbagliate.join(' | '));
  const comuni = CARD_FUNZIONI.flatMap((a, i) => CARD_FUNZIONI.slice(i + 1).map((c) => [a.k, c.k, a.tappe.filter((t) => c.tappe.some((u) => u.href === t.href)).length] as const)).filter((x) => x[2] > 1);
  ok('funzioni: due card non condividono più di una tappa', comuni.length === 0, JSON.stringify(comuni));
  await p.goto(LETTURA, { waitUntil: 'load' }); await p.waitForTimeout(800);
  await p.click('.im-libro-funz');
  ok('funzioni: la copertina apre le card', await p.locator('dialog[data-edf-funzioni][open]').isVisible(), '');
  ok('funzioni: ogni tappa ha la sua miniatura', (await p.evaluate(() => [...document.querySelectorAll('.edf-cf-img img')].every((i) => (i as HTMLImageElement).getAttribute('src')))) , '');
  ok('A: nelle card niente «Fateci una domanda»', (await p.locator('.edf-cf-chiedi').count()) === 0, '');
  await p.click('.edf-cf-voce[data-k="dati"]');
  await p.click('.edf-cf-c[data-k="dati"] .edf-cf-a >> nth=1'); await p.waitForTimeout(2500);
  const st = await p.evaluate(() => ({ attiva: document.querySelector('[data-deck] [data-slide]:not([aria-hidden])')?.id, btn: document.querySelector('.edf-cf-btn')?.textContent }));
  ok('funzioni: la tappa apre la slide giusta e il pulsante prende il nome', st.attiva === 'slide-cja-banca' && st.btn === 'Dati e analisi', JSON.stringify(st));
  await p.click('.edf-cf-btn'); await p.waitForTimeout(400);
  const cur = await p.evaluate(() => [...document.querySelectorAll('.edf-cf-a[aria-current="step"] .edf-cf-tt')].map((a) => a.textContent));
  const aperta = await p.evaluate(() => document.querySelector('.edf-cf-voce[aria-selected="true"]')?.getAttribute('data-k'));
  ok('funzioni: la tappa corrente è segnata, nella funzione giusta', cur.length === 1 && cur[0]!.startsWith('Quattro domande') && aperta === 'dati', JSON.stringify({ cur, aperta }));
  await p.close();
  if (INSIEME !== '/') {
    const q = await b.newPage({ viewport: { width: 1366, height: 768 } });
    await q.goto(INSIEME, { waitUntil: 'load' }); await q.waitForTimeout(800);
    await q.click('.im-libro-funz'); await q.click('.edf-cf-voce[data-k="rete"]'); await q.click('.edf-cf-c[data-k="rete"] .edf-cf-chiedi'); await q.waitForTimeout(300);
    const v = await q.evaluate(() => ({ f: (document.querySelector('dialog[data-edf-contributo] select[name=funzione]') as HTMLSelectElement).value, s: (document.querySelector('dialog[data-edf-contributo] input[name=sezione]') as HTMLInputElement).value, cf: (document.querySelector('dialog[data-edf-funzioni]') as HTMLDialogElement).open }));
    ok('B: «Fateci una domanda» della card apre il modulo con la funzione già scelta', v.f === 'rete' && v.s.includes('Rete e filiali') && !v.cf, JSON.stringify(v));
    await q.close();
  }
}

const CHECKS: Record<string, (b: Browser) => Promise<void>> = { autoreveal: checkAutoreveal, parliamone: checkParliamone, telefono: checkTelefono, rete: checkRete, sala: checkSala, comefunziona: checkComeFunziona, ritmo: checkRitmo, anello: checkAnello, insieme: checkInsieme, funzioni: checkFunzioni };

const scelti = process.argv.slice(2);
const b = await chromium.launch();
for (const [nome, fn] of Object.entries(CHECKS)) if (!scelti.length || scelti.includes(nome)) await fn(b);
await b.close();
if (fallimenti.length) { console.log(`\n${fallimenti.length} controlli falliti`); process.exit(1); }
console.log('\ntutti i controlli OK');

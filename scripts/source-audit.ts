/**
 * source-audit — le fonti citate in una slide portano il link, e il link risponde.
 *
 * PERCHÉ ESISTE
 * Una slide che cita una fonte pubblica senza il link chiede di fidarsi; con il
 * link si verifica in dieci secondi, ed è tutta un'altra conversazione — in sala
 * e, soprattutto, quando il documento viene girato a chi non c'era. Ma un link
 * ROTTO è peggio di nessun link: è una fonte che non regge proprio nel momento in
 * cui qualcuno prova a controllarla. Quindi due controlli, non uno.
 *
 * CHE COSA CONTROLLA
 *   HARD · ogni `<a href>` dentro una slide risponde (2xx o 3xx). Un 404 o un
 *          dominio morto è un errore: si corregge o si toglie la fonte.
 *   SOFT · le righe di fonte (`.ex-src`) che nominano qualcosa di pubblico ma non
 *          portano nessun link. Soft perché una riga di fonte può legittimamente
 *          rimandare a un documento interno o a una misura fatta da noi: il gate
 *          le elenca, il giudizio resta umano.
 *
 * CHE COSA NON CONTROLLA
 * Che il link sia quello GIUSTO per quella frase. Nessuno script lo sa: una
 * pagina che risponde 200 può parlare d'altro. Questo resta un controllo umano,
 * e va fatto una volta per fonte quando la si cita.
 *
 *   DECK_URL=http://localhost:4592 npx tsx scripts/source-audit.ts --app <alias>
 */
import { chromium } from 'playwright';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? process.cwd().split('/').pop() ?? '';
const appFlag = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? 'maxmara');
const ROUTE_SET = ROUTE_SETS[appFlag];
if (!ROUTE_SET) {
  throw new Error(`source-audit: nessun route set per «${asked}». Validi: ${Object.keys(ROUTE_SETS).join(', ')}`);
}
const only = flag('only');
const ROUTES = only ? ROUTE_SET.filter((r) => only.split(',').includes(r.name)) : ROUTE_SET;
if (!ROUTES.length) throw new Error(`source-audit: --only ${only} non seleziona nessuna rotta`);
const BASE = process.env.DECK_URL ?? 'http://localhost:4321';

interface Link { rotta: string; slide: string; href: string; testo: string }
interface Nuda { rotta: string; slide: string; testo: string }

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const links: Link[] = [];
const nude: Nuda[] = [];

for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  const found = await page.evaluate(() => {
    const out: { slide: string; href: string; testo: string }[] = [];
    const bare: { slide: string; testo: string }[] = [];
    document.querySelectorAll('[data-slide]').forEach((s) => {
      const id = s.id || '(senza id)';
      s.querySelectorAll('a[href]').forEach((a) => {
        const href = (a as HTMLAnchorElement).href;
        if (!/^https?:/i.test(href)) return;                   // i link interni li copre il build
        if (href.includes(location.host)) return;
        out.push({ slide: id, href, testo: (a.textContent || '').trim().slice(0, 48) });
      });
      s.querySelectorAll('.ex-src').forEach((p) => {
        if (p.querySelector('a[href]')) return;
        const t = (p.textContent || '').trim();
        // «fonte», «fonti», un dominio, o un'attribuzione con una data: indizi che
        // la riga stia citando qualcosa che esiste fuori da questa slide.
        if (/\bfonti?\b|\.(com|it|org|net)\b|\b(19|20)\d\d\b/i.test(t)) bare.push({ slide: id, testo: t.slice(0, 92) });
      });
    });
    return { out, bare };
  });
  found.out.forEach((l) => links.push({ rotta: rotta.name, ...l }));
  found.bare.forEach((b) => nude.push({ rotta: rotta.name, ...b }));
}
await browser.close();

// ── i link rispondono? Una sola volta per URL. ────────────────────────────
const unici = [...new Set(links.map((l) => l.href))];
const stato = new Map<string, number | string>();
/**
 * Due tentativi, non uno. Un timeout di rete non è un link rotto, e un gate che
 * dà un falso allarme per una connessione lenta smette di essere creduto al
 * secondo falso allarme — successo subito, sulla prima esecuzione vera.
 */
async function provaUna(u: string): Promise<number | 'irraggiungibile'> {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 25000);
    // Si parte da HEAD perché è leggero, ma parecchi server lo rifiutano e basta:
    // helpx.adobe.com risponde 403 a HEAD e 200 allo stesso URL con GET. Quindi su
    // 403/405 si riprova con una GET vera prima di dire qualunque cosa sul link.
    let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: c.signal });
    if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: 'follow', signal: c.signal });
    clearTimeout(t);
    return r.status;
  } catch { return 'irraggiungibile'; }
}
await Promise.all(unici.map(async (u) => {
  let st = await provaUna(u);
  if (st === 'irraggiungibile') {
    await new Promise((r) => setTimeout(r, 1500));
    st = await provaUna(u);
  }
  stato.set(u, st);
}));

/**
 * 401/403/429 NON sono «rotto»: sono siti che bloccano gli accessi automatici.
 * Gartner risponde 403 anche a un Chromium headless con uno user-agent da browser,
 * e quella pagina per una persona si apre benissimo. Trattarli come errori riempie
 * il gate di falsi allarmi — e un gate che grida al lupo viene ignorato, che è il
 * contrario del suo scopo. Finiscono in una terza lista: verifica umana, una volta.
 */
const BLOCCA_BOT = new Set([401, 403, 429]);
const rotti = links.filter((l) => {
  const st = stato.get(l.href);
  return typeof st !== 'number' ? st !== 'bloccato' : (st >= 400 && !BLOCCA_BOT.has(st));
});
const daGuardare = links.filter((l) => { const st = stato.get(l.href); return typeof st === 'number' && BLOCCA_BOT.has(st); });

console.log(`\nsource-audit · ${appFlag} · ${ROUTES.length} rotte`);
console.log(`Link esterni nelle slide: ${links.length} (${unici.length} distinti)`);

if (rotti.length) {
  console.log(`\nHARD — link che non rispondono: ${rotti.length}`);
  for (const l of rotti) console.log(`  ✗ ${l.rotta} · ${l.slide} — ${stato.get(l.href)} · ${l.href}\n     «${l.testo}»`);
}
if (daGuardare.length) {
  console.log(`\nDA APRIRE A MANO — il sito blocca gli accessi automatici: ${daGuardare.length}`);
  for (const l of daGuardare) console.log(`  ? ${l.rotta} · ${l.slide} — ${stato.get(l.href)} · ${l.href}`);
  console.log('  (403/401/429 non vuol dire rotto: si apre il link in un browser, una volta, e si tira una riga)');
}
if (nude.length) {
  console.log(`\nSOFT — righe di fonte senza link: ${nude.length}`);
  for (const n of nude) console.log(`  · ${n.rotta} · ${n.slide} — «${n.testo}»`);
  console.log('  (legittime se rimandano a un documento interno o a una misura nostra — si guardano una per una)');
}
if (!rotti.length && !nude.length && !daGuardare.length) console.log('\nPULITO — ogni fonte pubblica porta il suo link, e ogni link risponde.');
else if (!rotti.length) console.log('\nNessun link rotto. Le righe qui sopra vanno guardate una per una.');

console.log('\n⚠️  Il gate verifica che il link RISPONDA, non che sia quello giusto per quella frase: quello resta un controllo umano.');
process.exit(rotti.length ? 1 : 0);

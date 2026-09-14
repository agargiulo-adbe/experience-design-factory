/**
 * brand-tokens — estrae il design system PUBBLICO di un cliente dal suo sito.
 *
 * Una experience design è una skin sopra il motore: se la skin non è quella vera
 * del cliente, tutto il resto non conta. E il modo sbagliato di ricavarla è
 * andare a memoria — «UniCredit è rossa», «Agos è blu» — perché a memoria si
 * sbaglia: la palette vera di UniCredit ha il **petrolio** come colore di sistema
 * e il rosso solo come marchio, e Agos non è blu e rosso ma petrolio e acqua.
 * Le due volte che è successo, la correzione è arrivata leggendo il CSS di
 * produzione. Questo script fa quella lettura, in modo ripetibile.
 *
 *   pnpm brand:tokens https://www.unicredit.it
 *   pnpm brand:tokens https://www.agos.it --top 14
 *
 * Cosa fa: scarica la pagina, segue i CSS che include, e conta. I colori che
 * ricorrono di più nel CSS di produzione SONO il design system, qualunque cosa
 * dica un brand book. Riporta anche le famiglie di carattere dichiarate e le
 * custom property `--*` che il sito espone (molti design system moderni le
 * pubblicano: quando ci sono, sono la risposta diretta).
 *
 * Cosa NON fa: non decide al posto tuo. Stampa l'evidenza; la mappatura sui token
 * semantici dell'experience (`--surface-*`, `--ink-*`, `--accent-*`) resta una
 * scelta di design, e va fatta guardando dove ogni colore è usato sul sito.
 *
 * Nota: alcuni siti bancari bloccano gli headless browser ma servono il CSS a una
 * GET semplice. Per questo si usa fetch, non un browser.
 */
import { readBrandTokens } from './lib/brand-tokens';

/** Quadratino di colore nel terminale — vedere il colore vale più che leggerlo. */
function swatch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[48;2;${r};${g};${b}m   \x1b[0m`;
}

async function main() {
  const argv = process.argv.slice(2);
  const site = argv.find((a) => !a.startsWith('-'));
  const topIdx = argv.indexOf('--top');
  const TOP = topIdx !== -1 && argv[topIdx + 1] ? parseInt(argv[topIdx + 1], 10) : 12;
  if (!site) {
    console.error('uso: pnpm brand:tokens <https://sito-del-cliente> [--top 12]');
    process.exit(2);
  }
  const url = /^https?:\/\//.test(site) ? site : `https://${site}`;

  console.log(`\nLeggo il design system pubblico di ${new URL(url).hostname}\n`);
  const r = await readBrandTokens(url, { top: TOP });
  console.log(`  ${r.sheets} fogli di stile scaricati · ${r.cssKb} KB di CSS analizzati\n`);
  if (r.cssKb < 2) {
    console.log('  Poco CSS: il sito potrebbe servirlo via JS. Prova l\'URL di un CSS specifico.\n');
  }

  // — colori
  console.log('COLORI DI MARCA — per frequenza nel CSS di produzione');
  console.log('  (il più frequente è quasi sempre il colore di SISTEMA, non il marchio)\n');
  for (const h of r.brand) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);
  if (r.framework.length) {
    console.log('\n  ↓ default di framework (Bootstrap/Tailwind): quasi mai scelte di brand');
    for (const h of r.framework) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);
  }

  console.log('\nNEUTRI\n');
  for (const h of r.neutrals) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);

  // — custom property: quando ci sono, sono il design system dichiarato
  if (r.customProperties.length) {
    console.log('\nCUSTOM PROPERTY DICHIARATE DAL SITO — se ci sono, vincono su tutto\n');
    for (const v of r.customProperties) console.log(`  ${swatch(v.split(': ')[1])}  ${v}`);
  }

  // — tipografia
  console.log('\nCARATTERI DICHIARATI\n');
  for (const f of r.fonts) console.log(`  ${String(f.count).padStart(4)}×  ${f.value}`);

  console.log(`
COSA FARNE
  Questi sono FATTI, non ancora decisioni. Prima di scrivere il global.css:
  · guarda DOVE ogni colore è usato sul sito — il più frequente è il colore di
    sistema (link, stati, tab); il marchio spesso è raro ma inconfondibile;
  · un carattere proprietario non è distribuibile: scegli la sostituta più vicina
    e scrivi nel global.css perché l'hai scelta;
  · mappa sui token semantici (--surface-*, --ink-*, --accent-*) tenendo
    primary/secondary chiari e inverse scuro, se no i blocchi condivisi si rompono.
`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

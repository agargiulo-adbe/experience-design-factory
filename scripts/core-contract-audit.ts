/**
 * core-contract — il motore nomina RUOLI, mai valori.
 *
 * PERCHÉ ESISTE
 * `packages/core/DESIGN.md` apre con la regola che rende possibile tutto il
 * resto: «un blocco del core nomina ruoli, mai valori». Si consuma
 * `--surface-*`, `--ink-*`, `--accent-*`, `--line-*`, `--font-*`; non si scrive
 * mai un esadecimale e non si risale mai a un token primitivo. È quella regola
 * a permettere che nove experience con nove identità diverse condividano lo
 * stesso motore, e che una skin lo ridipinga per intero senza toccarne una riga.
 *
 * Finché è scritta soltanto in un documento, dipende da quanto bene se la
 * ricorda chi modifica — ed è la stessa dinamica che ha prodotto sei copie
 * divergenti del renderer dei dossier, una delle quali ha servito contenuto
 * riservato in chiaro. Una regola che nessuno misura è una regola che prima o
 * poi qualcuno viola senza accorgersene.
 *
 * CHE COSA CONTROLLA — su `packages/core/src/blocks/**`, dove vive il motore
 *   1 · HARD · nessun colore scritto a mano: esadecimali, `rgb()`, `hsl()`,
 *       `oklch()`. Fanno eccezione il bianco e il nero in `rgba()`, che servono
 *       a scrim e veli dove il contrasto si misura in trasparenza e un token
 *       semantico non saprebbe dire «nero al 40%».
 *   2 · HARD · nessun riferimento a un token PRIMITIVO (`--primitive-*`,
 *       `--color-*`): sono l'eredità della prima skin, tenuti come riserva, e
 *       un blocco che li nomina salta il livello semantico — cioè il contratto.
 *   3 · SOFT · famiglie di caratteri nominate fuori da un token: `--font-*`
 *       esiste per questo, e un nome di carattere nel motore è identità che si
 *       infila dove non deve stare.
 *
 * CHE COSA NON CONTROLLA
 * Che i token semantici siano usati con il ruolo GIUSTO — `--surface-inverse`
 * su una slide che rende chiara è un difetto che solo l'occhio e `audit:ink`
 * vedono. E non guarda le app: lì i valori ci vanno, è il loro mestiere.
 *
 *   pnpm audit:contratto
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const AMBITO = 'packages/core/src/blocks';

type Rilievo = { file: string; riga: number; codice: string; testo: string; estratto: string };

const file = execFileSync('git', ['-C', ROOT, 'ls-files', AMBITO], { encoding: 'utf8' })
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => /\.(astro|ts|css)$/.test(l) && !/\.test\.ts$/.test(l));

/* I colori che un motore neutro può comunque scrivere: bianco e nero in
   trasparenza. Uno scrim è una quantità di buio, non un colore di marca. */
const NEUTRO_OK = /^rgba?\(\s*(0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*[,)]/i;

/* IL DEBITO NOTO, dichiarato e non nascosto.
   Due componenti precedono il livello semantico e consumano ancora i grigi
   primitivi di un sistema più vecchio. Non si chiudono alla cieca: tradurre un
   grigio in un ruolo è una scelta di design che si fa guardando il componente
   rendere, e questi due non sono mai stati guardati in questa sessione.
   Il gate quindi non mente in nessuna delle due direzioni: conta tutto, e
   fallisce solo se il debito CRESCE. Così protegge il contratto da domani senza
   restare rosso per ieri — un gate sempre rosso è un gate che nessuno guarda. */
const DEBITO_NOTO: Record<string, number> = {
  'packages/core/src/blocks/scoping/ScopingCalculator.astro': 52,
  'packages/core/src/blocks/AdobeStackReveal.astro': 5,
};

const rilievi: Rilievo[] = [];
let righeLette = 0;

for (const f of file) {
  const testo = readFileSync(join(ROOT, f), 'utf8');
  const righe = testo.split('\n');
  righeLette += righe.length;

  /* Dentro un commento si SPIEGA un colore, non lo si dipinge: la riga che
     racconta perché il chrome usa `rgba()` esplicito non è una violazione.
     Serve uno stato, perché in un blocco /* … *\/ le righe interne non hanno
     sempre l'asterisco in testa. */
  let inBlocco = false;
  /* `@media print` è l'altra eccezione vera: su carta bianca i ruoli non
     servono e i colori si fissano, altrimenti un dossier stampato esce
     illeggibile. Si riconosce dall'apertura e dura fino alla graffa pari. */
  let inStampa = 0;

  righe.forEach((riga, i) => {
    if (/@media\s+print/.test(riga)) inStampa = 1;
    if (inStampa) {
      inStampa += (riga.match(/\{/g) ?? []).length - (riga.match(/\}/g) ?? []).length;
      if (inStampa <= 1 && /\}/.test(riga) && !/@media/.test(riga)) inStampa = 0;
      return;
    }
    const apre = riga.includes('/*');
    const chiude = riga.includes('*/');
    const eraInBlocco = inBlocco;
    if (apre && !chiude) inBlocco = true;
    if (chiude) inBlocco = false;
    if (eraInBlocco || apre) return;

    const pulita = riga.replace(/\/\/.*$/, '');
    if (/^\s*[/*]/.test(riga)) return;
    if (pulita.includes('core-contract-ignore')) return;

    const mockup = /Mockup|mockup/.test(f);
    const console_ = /\/admin\//.test(f);

    /* 1 · colori scritti a mano.
       Quattro eccezioni, e sono il contratto stesso, non scappatoie:
         · il VALORE DI RISERVA dentro `var(--token, #hex)`. È il modo in cui
           il motore è scritto per definizione: nomina il ruolo e porta un
           fallback perché regga anche senza skin. Segnalarlo vorrebbe dire
           segnalare l'architettura;
         · il rosso Adobe (#eb1000 e #fa0f00): è il NOSTRO marchio, non
           l'identità di un cliente, e per contratto non si ricolora;
         · gli attributi di un SVG in linea: un'icona disegnata porta i suoi
           colori nel markup, e lì un token CSS non arriva;
         · la console di amministrazione, che ha un tema dichiarato proprio. */
    const svgInline = /<(svg|path|circle|rect|g|polygon|line)\b/i.test(riga) || /\b(fill|stroke)=/.test(riga);
    for (const m of pulita.matchAll(/#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?|oklch|oklab)\([^)]*\)/g)) {
      const v = m[0];
      if (NEUTRO_OK.test(v)) continue;
      if (/^#(eb1000|fa0f00)$/i.test(v)) continue;
      if (svgInline || console_ || mockup) continue;
      if (/url\(|data:/.test(pulita)) continue;
      // fallback di un token: `var(--x, VALORE)` — il ruolo c'è, il valore è la riserva
      const prima = pulita.slice(0, m.index ?? 0);
      const aperte = (prima.match(/var\(/g) ?? []).length;
      const chiuse = (prima.match(/\)/g) ?? []).length;
      if (aperte > chiuse) continue;
      rilievi.push({ file: f, riga: i + 1, codice: 'C1', testo: v, estratto: riga.trim().slice(0, 96) });
    }

    /* 2 · token primitivi: saltano il livello semantico */
    for (const m of pulita.matchAll(/--(?:primitive-[a-z0-9-]+|color-[a-z0-9-]+)/g)) {
      rilievi.push({ file: f, riga: i + 1, codice: 'C2', testo: m[0], estratto: riga.trim().slice(0, 96) });
    }

    /* 3 · caratteri nominati fuori da un token.
       Tre eccezioni strutturali, e sono tutte vere: un gate che segnala
       sedici righe legittime viene spento, e allora non protegge più niente.
         · il monospace è FUNZIONE, non identità — serve a un identificatore,
           a un frammento di codice, a una misura che deve incolonnarsi;
         · i mockup imitano l'interfaccia di un altro prodotto: lì il carattere
           è parte di ciò che si sta riproducendo, e prenderlo dalla skin del
           cliente farebbe sembrare quel prodotto suo;
         · la console di amministrazione ha un tema dichiarato proprio, che non
           è la pelle di nessuna experience. */
    for (const m of pulita.matchAll(/font-family\s*:\s*([^;]+)/g)) {
      const valore = m[1];
      if (/var\(--/.test(valore)) continue;
      if (/^\s*(inherit|initial|unset|monospace|sans-serif|serif|system-ui)\s*$/.test(valore)) continue;
      if (/\bmono(space)?\b/i.test(valore)) continue;
      if (mockup || console_) continue;
      rilievi.push({ file: f, riga: i + 1, codice: 'F1', testo: valore.trim().slice(0, 48), estratto: riga.trim().slice(0, 96) });
    }
  });
}

const hard = rilievi.filter((r) => r.codice !== 'F1');
const soft = rilievi.filter((r) => r.codice === 'F1');

const SPIEGA: Record<string, string> = {
  C1: 'colore scritto a mano: il motore non ha colori, ha ruoli — si usa --surface-*, --ink-*, --accent-*, --line-*',
  C2: 'token primitivo: salta il livello semantico, cioè il contratto. I primitivi sono l’eredità della prima skin, tenuti come riserva',
  F1: 'carattere nominato fuori da un token: --font-display e --font-body esistono per questo',
};

const mostra = (gruppo: Rilievo[]) => {
  const perCodice = new Map<string, Rilievo[]>();
  for (const r of gruppo) perCodice.set(r.codice, [...(perCodice.get(r.codice) ?? []), r]);
  for (const [codice, elenco] of perCodice) {
    console.log(`\n  [${codice}] ${SPIEGA[codice]}`);
    for (const r of elenco.slice(0, 12)) {
      console.log(`     ${relative(ROOT, join(ROOT, r.file))}:${r.riga}  «${r.testo}»`);
      console.log(`        ${r.estratto}`);
    }
    if (elenco.length > 12) console.log(`     … e altri ${elenco.length - 12}`);
  }
};

console.log(
  `\ncore-contract · ${file.length} file del motore · ${righeLette} righe lette · la regola: ruoli, mai valori`,
);

/* quanto di questo HARD è debito già dichiarato, e quanto è nuovo */
const perFileHard = new Map<string, number>();
for (const r of hard) perFileHard.set(r.file, (perFileHard.get(r.file) ?? 0) + 1);
const nuovi: string[] = [];
for (const [f, n] of perFileHard) {
  const atteso = DEBITO_NOTO[f] ?? 0;
  if (n > atteso) nuovi.push(`${f}: ${n} contro ${atteso} dichiarati`);
}
const debitoResiduo = [...perFileHard].reduce((t, [f, n]) => t + Math.min(n, DEBITO_NOTO[f] ?? 0), 0);

if (hard.length) {
  console.log(`\nHARD — ${hard.length}, di cui ${debitoResiduo} debito già dichiarato e ${hard.length - debitoResiduo} nuovi`);
  const perFile = new Map<string, number>();
  for (const r of hard) perFile.set(r.file, (perFile.get(r.file) ?? 0) + 1);
  console.log('\n  dove stanno:');
  for (const [f, n] of [...perFile].sort((a, b) => b[1] - a[1])) {
    console.log(`     ${n.toString().padStart(4)}  ${f}`);
  }
  mostra(hard);
}
if (soft.length) {
  console.log(`\nSOFT — da guardare uno per uno: ${soft.length}`);
  mostra(soft);
}
if (!rilievi.length) {
  console.log('\nPULITO — nessun valore cablato nel motore: una skin può ridipingerlo per intero.');
}

if (nuovi.length) {
  console.log('\n✗ IL DEBITO È CRESCIUTO — queste sono violazioni nuove, non eredità:');
  for (const n of nuovi) console.log(`     ${n}`);
} else if (hard.length) {
  console.log(
    `\nNESSUNA VIOLAZIONE NUOVA — restano ${debitoResiduo} rilievi di debito dichiarato in ${Object.keys(DEBITO_NOTO).length} componenti.`,
  );
  console.log('   Si chiudono traducendo ogni grigio primitivo nel suo ruolo semantico, guardando il componente rendere.');
}

console.log(
  '\n⚠️  Il gate verifica che si usi un RUOLO, non che sia il ruolo giusto: --surface-inverse su una slide che rende chiara lo vedono solo l’occhio e `audit:ink`.',
);
process.exit(nuovi.length ? 1 : 0);

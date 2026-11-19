// La ripresa di una demo dal vivo dentro Experience Cloud (Coworker e simili).
//
// NON si lancia da shell: è il corpo di una chiamata `mcp__playwright__browser_run_code_unsafe`.
// Si legge questo file, si sostituisce il blocco CONFIG (l'unica parte che cambia da un
// cliente all'altro) e si passa tutto il testo come `code`. Il browser è il Chromium del
// server Playwright MCP: profilo suo, nessuna estensione, nessun cookie di Chrome — per
// questo sembra una finestra ospite. Il login (SSO + MFA) lo fa una persona in quella
// finestra PRIMA della ripresa; il profilo lo tiene finché il server MCP resta vivo.
//
// Cosa fa: un ciclo di screenshot JPEG ogni ~110 ms (≈6 fps) in CONFIG.dir, e intanto
// scrive i prompt con la tastiera (si vede la digitazione), aspetta che la risposta
// smetta di cambiare, la fa scorrere piano dall'inizio alla fine. Alla fine scrive
// `marks.json` nella cartella: è ciò che legge `monta.py`, niente numeri a mano.
//
// La cartella DEVE essere nuova e vuota: un ciclo di una ripresa precedente rimasto vivo
// continua a scrivere fotogrammi dove trova posto (successo il 17 nov 2026: si ferma con
// `chmod a-w <cartella vecchia>`).
async (page) => {
  const CONFIG = {
    dir: '.playwright-mcp/rec-NOME',                     // relativa alla cwd della sessione
    url: 'https://experience.adobe.com/#/@ORG/coworker/', // l'org demo, mai quella di un cliente
    viewport: { width: 1600, height: 900 },
    prompts: [
      'Prima domanda, scritta come la farebbe il team del cliente.',
      'Seconda domanda, che parte dalla risposta della prima.',
    ],
    newChat: true,       // apre una chat nuova: le conversazioni vecchie non entrano in video
    typeDelay: 28,       // ms per carattere: leggibile senza annoiare
    maxWaitS: 600,       // per prompt
  };

  const fs = await import('fs');
  fs.mkdirSync(CONFIG.dir, { recursive: true });
  if (fs.readdirSync(CONFIG.dir).length) return 'STOP: la cartella non è vuota, usane una nuova';

  await page.setViewportSize(CONFIG.viewport);
  await page.goto(CONFIG.url);
  await page.waitForTimeout(9000);
  const later = page.getByRole('button', { name: 'Ask me later' });
  if (await later.count()) await later.click().catch(() => {});
  if (CONFIG.newChat) { await page.getByRole('link', { name: 'New chat' }).click().catch(() => {}); await page.waitForTimeout(4000); }

  // Coworker vive in un iframe: il campo e il testo si cercano lì, non nella pagina.
  const frame = () => page.frames().find(f => f !== page.mainFrame() && f.url().includes('coworker')) || page.frames()[1];

  let rec = true, i = 0; const t0 = Date.now(); const marks = [];
  (async () => { while (rec) { const n = i++; await page.screenshot({ path: `${CONFIG.dir}/f_${String(n).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 85 }).catch(() => {}); await new Promise(r => setTimeout(r, 110)); } })();

  const tour = async (prompt) => {
    await frame().evaluate(async (p) => {
      const els = [...document.querySelectorAll('*')].filter(e => e.children.length < 3 && e.innerText && e.innerText.trim() === p);
      const target = els[els.length - 1]; if (!target) return;
      let sc = target.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 50 && getComputedStyle(sc).overflowY !== 'visible')) sc = sc.parentElement;
      if (!sc) return;
      const start = sc.scrollTop + target.getBoundingClientRect().top - sc.getBoundingClientRect().top - 20;
      const end = sc.scrollHeight - sc.clientHeight;
      sc.scrollTop = start; await new Promise(r => setTimeout(r, 1500));
      const steps = Math.max(1, Math.round((end - start) / 6));
      for (let s = 0; s <= steps; s++) { sc.scrollTop = start + (end - start) * s / steps; await new Promise(r => setTimeout(r, 40)); }
    }, prompt).catch(() => {});
    await page.waitForTimeout(2500);
  };

  let blocked = false;
  const ask = async (text) => {
    if (blocked) return;
    marks.push({ kind: 'start', frame: i });
    const box = page.frameLocator('iframe').first().getByRole('textbox', { name: 'AI Prompt' });
    await box.click(); await page.waitForTimeout(800);
    await page.keyboard.type(text, { delay: CONFIG.typeDelay });
    await page.waitForTimeout(1200);
    marks.push({ kind: 'sent', frame: i, text });
    await page.keyboard.press('Enter');
    let prev = '', stable = 0;
    for (let k = 0; k < CONFIG.maxWaitS / 4; k++) {
      await page.waitForTimeout(4000);
      const t = await frame().evaluate(() => document.body.innerText).catch(() => prev);
      // Coworker si ferma e chiede conferma: la ripresa si chiude lì, non si clicca al buio.
      if (t.includes('In attesa del tuo input') || t.includes('Waiting for your input')) { blocked = true; marks.push({ kind: 'blocked', frame: i }); return; }
      if (t === prev && !t.includes('Thinking…')) { if (++stable >= 4) break; } else stable = 0;
      prev = t;
    }
    marks.push({ kind: 'done', frame: i });
    await tour(text);
    marks.push({ kind: 'toured', frame: i });
  };

  await page.waitForTimeout(3000);
  for (const p of CONFIG.prompts) await ask(p);
  await page.waitForTimeout(3000);
  rec = false; await page.waitForTimeout(600);
  const ms = Date.now() - t0;
  fs.writeFileSync(`${CONFIG.dir}/marks.json`, JSON.stringify({ frames: i, ms, dt: ms / 1000 / i, blocked, marks }, null, 1));
  const tail = await frame().evaluate(() => document.body.innerText).catch(() => '');
  return JSON.stringify({ frames: i, secondi: Math.round(ms / 1000), blocked, scene: marks.filter(m => m.kind === 'toured').length, coda: tail.slice(-2500) });
}

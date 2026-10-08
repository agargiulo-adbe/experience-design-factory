import { chromium } from 'playwright';
const BASE = 'http://localhost:4413/experience-design-factory/intesa-scala-umana';
const ROUTES = [['home',''],['apertura','/apertura'],['domanda','/domanda'],['idee','/idee'],['rotta','/rotta']];
const OUT = '/tmp/isu-shots';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [name, path] of ROUTES) {
  await p.goto(`${BASE}${path}/`, { waitUntil: 'networkidle' });
  const n = await p.locator('[data-slide]').count();
  for (let i = 0; i < n; i++) {
    if (i > 0) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700); }
    const id = await p.locator('[data-slide]').nth(i).getAttribute('id');
    await p.screenshot({ path: `${OUT}/${name}-${i}-${id}.png` });
  }
  console.log(name, n, 'slide');
}
await b.close();

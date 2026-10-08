import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('http://localhost:4412/experience-design-factory/intesa-scala-umana/domanda/', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('.edf-cobrand, [class*="cobrand"]').forEach((el) => {
    const cs = getComputedStyle(el);
    out.push({ cls: el.className, color: cs.color, display: cs.display, onDark: el.getAttribute('data-on-dark') });
  });
  const html = document.documentElement;
  return { out, cobrandOff: html.getAttribute('data-cobrand-off') };
});
console.log(JSON.stringify(r, null, 1));
await b.close();

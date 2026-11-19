// Cartelli e fasce della demo, più le liste per ffmpeg. Uso: node render.mjs <spec.json> <out_dir>
// Testo reso con sharp (SVG → immagine) perché l'ffmpeg di Homebrew non ha `drawtext`.
// Dimensioni lette dal primo fotogramma: la fascia sta sotto il video, mai sopra la chat.
import sharp from 'sharp';
import fs from 'fs';

const [specP, OUT] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specP, 'utf8'));
const tl = JSON.parse(fs.readFileSync(`${OUT}/timeline.json`, 'utf8'));
const first = tl.entries.find(e => e[0] === 'f');
const { width: W, height: H } = await sharp(first[1]).metadata();
const BAND = 68;
const P = spec.brand || '#007A91';
const NOTE = spec.nota || 'Ambiente dimostrativo Adobe · dati fittizi · attese accelerate';
const F = spec.font || 'Helvetica Neue, Helvetica, Arial, sans-serif';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const svgCard = (k, big, sub, fsz = 72) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + BAND}">
<rect width="100%" height="100%" fill="${P}"/>
<text x="120" y="400" font-family="${F}" font-size="26" font-weight="500" fill="#fff" fill-opacity="0.8" letter-spacing="2">${esc(k.toUpperCase())}</text>
${big.map((l, i) => `<text x="120" y="${500 + i * Math.round(fsz * 1.17)}" font-family="${F}" font-size="${fsz}" font-weight="600" fill="#fff">${esc(l)}</text>`).join('')}
${(sub || []).map((l, i) => `<text x="120" y="${520 + big.length * 84 + i * 44}" font-family="${F}" font-size="32" fill="#fff" fill-opacity="0.9">${esc(l)}</text>`).join('')}
<text x="120" y="${H - 60}" font-family="${F}" font-size="20" fill="#fff" fill-opacity="0.7">${esc(NOTE)}</text></svg>`;
const svgBand = (label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${BAND}"><rect width="100%" height="100%" fill="${P}"/>
<text x="36" y="43" font-family="${F}" font-size="26" font-weight="500" fill="#fff">${esc(label)}</text>
<text x="${W - 36}" y="42" text-anchor="end" font-family="${F}" font-size="18" fill="#fff" fill-opacity="0.78">${esc(NOTE)}</text></svg>`;
const jpg = (svg, name) => sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(`${OUT}/card-${name}.jpg`);

await jpg(svgCard(spec.intro.k, spec.intro.big, spec.intro.sub), 'intro');
await jpg(svgCard(spec.outro.k, spec.outro.big, spec.outro.sub), 'outro');
for (const [i, s] of spec.scenes.entries()) {
  if (s.skip) continue;
  await jpg(svgCard(`La domanda del team · ${s.n}`, [s.q], s.ctx), String(i));
  if (s.a) await jpg(svgCard(`La risposta · ${s.n}`, s.a, [], 56), `a${i}`);
}
for (const [i, b] of tl.bands.entries()) await sharp(Buffer.from(svgBand(b[0]))).png().toFile(`${OUT}/band-${i}.png`);

let lst = '', last = '';
for (const [kind, ref, d] of tl.entries) {
  const f = kind === 'c' ? `${OUT}/card-${ref}.jpg` : ref;
  lst += `file '${f.replace(/'/g, "'\\''")}'\nduration ${d.toFixed(4)}\n`; last = f;
}
lst += `file '${last.replace(/'/g, "'\\''")}'\n`;
fs.writeFileSync(`${OUT}/frames.txt`, lst);
const hex = P.replace('#', '0x');
const fc = [`[0:v]fps=30,scale=${W}:-2,pad=${W}:${H + BAND}:0:0:color=${hex}[b0]`];
tl.bands.forEach((b, i) => fc.push(`[b${i}][${i + 1}:v]overlay=0:${H}:enable='between(t,${b[1].toFixed(2)},${b[2].toFixed(2)})'[b${i + 1}]`));
fc.push(`[b${tl.bands.length}]format=yuv420p[v]`);
fs.writeFileSync(`${OUT}/fc.txt`, fc.join(';'));
fs.writeFileSync(`${OUT}/inputs.txt`, tl.bands.map((_, i) => `-loop 1 -i ${OUT}/band-${i}.png`).join(' '));
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify({ bands: tl.bands.length, total: tl.total }));
console.log(`ok · ${W}x${H} · ${tl.bands.length} fasce · ${tl.total.toFixed(1)} s`);

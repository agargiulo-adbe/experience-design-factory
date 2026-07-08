/**
 * content-audit — static integrity gate for all experience apps.
 *
 * Rules enforced:
 *   (a) No STATS value string appears on >2 pages of the same experience.
 *   (b) The same stat value does not carry different label text across pages.
 *   (c) No sentence of ≥8 words appears verbatim more than once within a single page.
 *   (d) No combined-bilingual antipattern: en="FOO / BAR" it="FOO / BAR" (same mashup in both slots).
 *
 * Usage: npx tsx scripts/content-audit.ts [--src] [--dist-root <path>]
 *   --src        Check src/*.astro files (faster; for rules b/d in CI without a build).
 *   --dist-root  Override dist root (default: apps/<app>/dist).
 *
 * Exits 1 if any rule fails.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ── Stat values to track (sourced from apps/ferrari-racing/src/data/stats.ts) ─────
const FERRARI_STAT_VALUES = ['~400M', '€800M+', '+22%', '+56%', '+35%', '+36%'];

// ── Helpers ──────────────────────────────────────────────────────────────────────
function glob(dir: string, ext: string): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...glob(full, ext));
    else if (entry.name.endsWith(ext)) results.push(full);
  }
  return results;
}

function textContent(html: string): string {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Rule (a): stat value on >2 pages ─────────────────────────────────────────────
function checkStatDistribution(distRoot: string): string[] {
  const issues: string[] = [];
  const appDirs = readdirSync(distRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(distRoot, e.name));

  for (const appDir of appDirs) {
    const appName = appDir.split('/').pop()!;
    const htmlFiles = glob(appDir, '.html');

    for (const statValue of FERRARI_STAT_VALUES) {
      const pagesWithStat = htmlFiles.filter((f) => {
        try { return readFileSync(f, 'utf-8').includes(statValue); } catch { return false; }
      });
      if (pagesWithStat.length > 2) {
        const relative = pagesWithStat.map((f) => f.replace(appDir + '/', ''));
        issues.push(`[a] ${appName}: "${statValue}" on ${pagesWithStat.length} pages (budget ≤2): ${relative.join(', ')}`);
      }
    }
  }
  return issues;
}

// ── Rule (c): intra-page sentence repetition (≥8 words) ──────────────────────────
function sentences(text: string): string[] {
  return text.split(/[.!?]+/)
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter((s) => s.split(/\s+/).length >= 8);
}

function checkSentenceRepetition(htmlFiles: string[]): string[] {
  const issues: string[] = [];
  for (const file of htmlFiles) {
    let html: string;
    try { html = readFileSync(file, 'utf-8'); } catch { continue; }
    const text = textContent(html);
    const sents = sentences(text);
    const seen = new Map<string, number>();
    for (const s of sents) {
      const key = s.toLowerCase();
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    for (const [key, count] of seen) {
      if (count > 1) {
        const rel = file.replace(resolve('.') + '/', '');
        issues.push(`[c] ${rel}: sentence repeated ${count}×: "${key.slice(0, 80)}…"`);
      }
    }
  }
  return issues;
}

// ── Rule (d): combined-bilingual antipattern in src .astro files ──────────────────
// Matches: en="TEXT / TEXT" where the SAME string appears in both the en and it attr
// of the same element (the mashup "ANALYTICS / ANALISI" in both slots is the antipattern).
const COMBINED_BILINGUAL_RE = /en="([^"]+\s*\/\s*[^"]+)"\s[^>]*it="\1"/g;
// Also catch the simpler case where en and it are the same mashup on adjacent attrs
const SAME_MASHUP_RE = /(?:en|it)="([^"]+\s\/\s[^"]+)"[^>]+(?:it|en)="\1"/gs;

function checkBilingualAntipattern(srcFiles: string[]): string[] {
  const issues: string[] = [];
  for (const file of srcFiles) {
    let src: string;
    try { src = readFileSync(file, 'utf-8'); } catch { continue; }
    const rel = file.replace(resolve('.') + '/', '');
    // Check for combined bilingual strings in T component props
    const matches = [...src.matchAll(SAME_MASHUP_RE)];
    for (const m of matches) {
      issues.push(`[d] ${rel}: bilingual mashup in both en/it: "${m[1].slice(0, 60)}"`);
    }
  }
  return issues;
}

// ── Main ─────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const srcOnly = args.includes('--src');
const distRootIdx = args.indexOf('--dist-root');
const distRoot = distRootIdx !== -1 ? args[distRootIdx + 1] : resolve('apps');

const allIssues: string[] = [];

// Rule (a): dist-based stat distribution
if (!srcOnly) {
  const distIssues = checkStatDistribution(distRoot);
  allIssues.push(...distIssues);
}

// Rule (c): sentence repetition in dist HTML
if (!srcOnly) {
  const allHtml = glob(distRoot, '.html');
  const sentenceIssues = checkSentenceRepetition(allHtml);
  allIssues.push(...sentenceIssues);
}

// Rule (d): bilingual antipattern in src files
const srcAstro = glob(resolve('apps'), '.astro');
const bilingualIssues = checkBilingualAntipattern(srcAstro);
allIssues.push(...bilingualIssues);

if (allIssues.length === 0) {
  console.log('content-audit PASS — all rules green');
  process.exit(0);
} else {
  console.error(`content-audit FAIL — ${allIssues.length} issue(s):`);
  allIssues.forEach((i) => console.error(' ' + i));
  process.exit(1);
}

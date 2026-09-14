import { describe, it, expect } from 'vitest';
import { analyzeCss, stylesheetUrls, readBrandTokens } from './brand-tokens';

const CSS = `
  :root { --uc-petrolio: #007A91; --bs-primary: #0d6efd; }
  a { color: #007a91; } .tab.active { border-color: #007A91; } .btn { background: #E2001A; }
  body { font-family: "unicredit-regular", Arial, sans-serif; } h1 { font-family: Manrope, sans-serif; }
  .x { color: #fff; } .y { color: #ffffff; } .z { color: #0d6efd; }
`;

describe('analyzeCss', () => {
  it('ranks brand colours by frequency, merging #FFF/#ffffff and 3/6-digit forms', () => {
    const r = analyzeCss(CSS, 5);
    expect(r.brand[0]).toEqual({ value: '#007a91', count: 3 });
    expect(r.brand[1]).toEqual({ value: '#e2001a', count: 1 });
    expect(r.neutrals[0]).toEqual({ value: '#ffffff', count: 2 });
  });
  it('separates framework defaults and own custom properties', () => {
    const r = analyzeCss(CSS, 5);
    expect(r.framework).toEqual([{ value: '#0d6efd', count: 2 }]);
    expect(r.customProperties).toEqual(['--uc-petrolio: #007a91']);
  });
  it('lists declared font families, first of each stack', () => {
    expect(analyzeCss(CSS).fonts.map((f) => f.value)).toEqual(['unicredit-regular', 'Manrope']);
  });
});

describe('stylesheetUrls', () => {
  it('resolves relative hrefs against the page', () => {
    const html = '<link rel="stylesheet" href="/css/main.css"><link rel="icon" href="/x.ico">';
    expect(stylesheetUrls(html, 'https://www.example.it/home')).toEqual(['https://www.example.it/css/main.css']);
  });
});

describe('readBrandTokens', () => {
  it('fetches the page and its sheets through the injected fetcher', async () => {
    const pages: Record<string, string> = {
      'https://www.example.it/': '<link rel="stylesheet" href="/a.css"><style>.i{color:#123456}</style>',
      'https://www.example.it/a.css': CSS,
    };
    const r = await readBrandTokens('https://www.example.it/', { fetchText: async (u) => pages[u] ?? '' });
    expect(r.hostname).toBe('www.example.it');
    expect(r.sheets).toBe(1);
    expect(r.brand[0].value).toBe('#007a91');
  });
});

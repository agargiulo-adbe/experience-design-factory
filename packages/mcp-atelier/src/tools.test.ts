import { describe, it, expect } from 'vitest';
import { listExperiences, openExperience, brandTokens, type Registry } from './tools';

const reg: Registry = { generatedAt: '2026-09-14T00:00:00Z', experiences: [
  { slug: 'atelier', name: 'Experience Atelier', client: 'Adobe Italy', url: 'https://x.test/experience-design-factory/atelier/', sections: 7, tag: { en: 'Trilingual', it: 'Trilingue' }, desc: { en: 'd', it: 'd' } },
  { slug: 'ferrari-racing', name: 'Pole Position', client: 'Ferrari Racing', url: 'https://x.test/experience-design-factory/ferrari-racing/', sections: 9, tag: { en: 'Bilingual', it: 'Bilingue' }, desc: { en: 'd', it: 'd' } },
] };

describe('listExperiences', () => {
  it('returns one compact row per experience, EN tag', () => {
    expect(listExperiences(reg)).toEqual([
      { slug: 'atelier', name: 'Experience Atelier', client: 'Adobe Italy', url: reg.experiences[0].url, sections: 7, tag: 'Trilingual' },
      { slug: 'ferrari-racing', name: 'Pole Position', client: 'Ferrari Racing', url: reg.experiences[1].url, sections: 9, tag: 'Bilingual' },
    ]);
  });
});

describe('openExperience', () => {
  it('builds the plain URL by default', () => {
    expect(openExperience(reg, { slug: 'ferrari-racing' })).toEqual({ url: reg.experiences[1].url, name: 'Pole Position' });
  });
  it('adds the sponsor cut and the language for the atelier', () => {
    expect(openExperience(reg, { slug: 'atelier', cut: 'sponsor', lang: 'fr' })).toEqual({ url: reg.experiences[0].url + '?s=asks&lang=fr', name: 'Experience Atelier' });
  });
  it('rejects a sponsor cut outside the atelier and unknown slugs', () => {
    expect(openExperience(reg, { slug: 'ferrari-racing', cut: 'sponsor' })).toEqual({ error: 'the sponsor cut exists only for "atelier"', known: ['atelier', 'ferrari-racing'] });
    expect(openExperience(reg, { slug: 'nope' })).toEqual({ error: 'unknown experience "nope"', known: ['atelier', 'ferrari-racing'] });
  });
});

describe('brandTokens', () => {
  it('delegates to the reader and returns its result', async () => {
    const fake = async (url: string) => ({ hostname: new URL(url).hostname, sheets: 1, cssKb: 3, brand: [{ value: '#05636b', count: 9 }], framework: [], neutrals: [], customProperties: [], fonts: [] });
    const r = await brandTokens({ url: 'https://www.agos.it' }, fake as never);
    expect(r.hostname).toBe('www.agos.it'); expect(r.brand[0].value).toBe('#05636b');
  });
});

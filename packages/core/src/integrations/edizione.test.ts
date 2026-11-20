import { describe, it, expect } from 'vitest';
import { rotteDaTogliere } from './edizione';

const cfg = { soloSala: ['relatore', 'prossimi-passi'], soloLettura: ['parliamone', 'breve'] };
const cfgB = { ...cfg, soloInsieme: ['riepilogo'] };

describe('rotteDaTogliere', () => {
  it('la sala perde le pagine della lettura', () => {
    expect(rotteDaTogliere('sala', cfg)).toEqual(['parliamone', 'breve']);
  });
  it('la lettura perde le pagine di chi presenta', () => {
    expect(rotteDaTogliere('lettura', cfg)).toEqual(['relatore', 'prossimi-passi']);
  });
  it('le pagine della versione «insieme» escono da sala e da «leggere»', () => {
    expect(rotteDaTogliere('sala', cfgB)).toEqual(['parliamone', 'breve', 'riepilogo']);
    expect(rotteDaTogliere('lettura', cfgB, 'leggere')).toEqual(['relatore', 'prossimi-passi', 'riepilogo']);
    expect(rotteDaTogliere('lettura', cfgB, 'insieme')).toEqual(['relatore', 'prossimi-passi']);
  });
  it('rifiuta rotte vuote o che escono da dist', () => {
    expect(() => rotteDaTogliere('lettura', { soloSala: [''], soloLettura: [] })).toThrow();
    expect(() => rotteDaTogliere('lettura', { soloSala: ['a/b'], soloLettura: [] })).toThrow();
    expect(() => rotteDaTogliere('lettura', { soloSala: ['..'], soloLettura: [] })).toThrow();
    expect(() => rotteDaTogliere('sala', { soloSala: [], soloLettura: [], soloInsieme: ['../x'] })).toThrow();
  });
});

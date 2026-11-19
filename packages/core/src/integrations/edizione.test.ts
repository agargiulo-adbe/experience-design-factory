import { describe, it, expect } from 'vitest';
import { rotteDaTogliere } from './edizione';

const cfg = { soloSala: ['relatore', 'prossimi-passi'], soloLettura: ['parliamone', 'breve'] };

describe('rotteDaTogliere', () => {
  it('la sala perde le pagine della lettura', () => {
    expect(rotteDaTogliere('sala', cfg)).toEqual(['parliamone', 'breve']);
  });
  it('la lettura perde le pagine di chi presenta', () => {
    expect(rotteDaTogliere('lettura', cfg)).toEqual(['relatore', 'prossimi-passi']);
  });
  it('rifiuta rotte vuote o che escono da dist', () => {
    expect(() => rotteDaTogliere('lettura', { soloSala: [''], soloLettura: [] })).toThrow();
    expect(() => rotteDaTogliere('lettura', { soloSala: ['a/b'], soloLettura: [] })).toThrow();
    expect(() => rotteDaTogliere('lettura', { soloSala: ['..'], soloLettura: [] })).toThrow();
  });
});

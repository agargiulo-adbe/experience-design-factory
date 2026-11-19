import { describe, it, expect } from 'vitest';
import { rigaApertura } from './aperture';

describe('rigaApertura', () => {
  it('registra solo progetto e pagina', () => {
    expect(rigaApertura('intesa-storia', 'breve', false)).toEqual({ progetto: 'intesa-storia', pagina: 'breve' });
  });
  it('con Global Privacy Control non si conta', () => {
    expect(rigaApertura('intesa-storia', 'copertina', true)).toBeNull();
  });
  it('una pagina fuori elenco è un errore', () => {
    expect(() => rigaApertura('intesa-storia', 'momenti' as never, false)).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { deveRinviare } from './telefono';

const tel = { coarse: true, apriComunque: false };
describe('deveRinviare', () => {
  it('telefono in verticale → pagina breve', () => { expect(deveRinviare({ larghezza: 390, altezza: 844, ...tel })).toBe(true); });
  it('telefono in orizzontale → pagina breve', () => { expect(deveRinviare({ larghezza: 844, altezza: 390, ...tel })).toBe(true); });
  it('tablet → deck', () => { expect(deveRinviare({ larghezza: 820, altezza: 1180, ...tel })).toBe(false); });
  it('portatile → deck', () => { expect(deveRinviare({ larghezza: 1512, altezza: 860, coarse: false, apriComunque: false })).toBe(false); });
  it('chi ha scelto «apri comunque» resta nel deck', () => { expect(deveRinviare({ larghezza: 390, altezza: 844, coarse: true, apriComunque: true })).toBe(false); });
  it('finestra stretta su computer → deck', () => { expect(deveRinviare({ larghezza: 500, altezza: 900, coarse: false, apriComunque: false })).toBe(false); });
});

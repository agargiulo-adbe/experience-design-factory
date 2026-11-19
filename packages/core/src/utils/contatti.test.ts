import { describe, it, expect } from 'vitest';
import { linkWhatsApp } from './contatti';

describe('linkWhatsApp', () => {
  it('toglie spazi e +, codifica il testo', () => {
    expect(linkWhatsApp('+39 348 9696067', 'Buongiorno, ho una domanda'))
      .toBe('https://wa.me/393489696067?text=Buongiorno%2C%20ho%20una%20domanda');
  });
  it('rifiuta un numero con lettere', () => {
    expect(() => linkWhatsApp('+39 348 abc', 'x')).toThrow();
  });
});

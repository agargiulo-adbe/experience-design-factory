import { describe, it, expect } from 'vitest';
import { parseEdizione, parseVersione } from './edizione';

describe('parseEdizione', () => {
  it('senza valore è la sala', () => {
    expect(parseEdizione(undefined)).toBe('sala');
    expect(parseEdizione('')).toBe('sala');
  });
  it('riconosce la lettura, anche con maiuscole e spazi', () => {
    expect(parseEdizione('lettura')).toBe('lettura');
    expect(parseEdizione('LETTURA ')).toBe('lettura');
  });
  it('un valore sconosciuto torna alla sala', () => {
    expect(parseEdizione('qualunque')).toBe('sala');
  });
});

describe('parseVersione', () => {
  it('senza valore è «leggere»', () => {
    expect(parseVersione(undefined, 'lettura')).toBe('leggere');
  });
  it('riconosce «insieme» solo in lettura', () => {
    expect(parseVersione(' Insieme', 'lettura')).toBe('insieme');
    expect(parseVersione('insieme', 'sala')).toBe('leggere');
  });
  it('un valore sconosciuto torna a «leggere»', () => {
    expect(parseVersione('tutto', 'lettura')).toBe('leggere');
  });
});

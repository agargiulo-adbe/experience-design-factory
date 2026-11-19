import { describe, it, expect } from 'vitest';
import { parseEdizione } from './edizione';

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

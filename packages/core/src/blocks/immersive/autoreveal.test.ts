import { describe, it, expect } from 'vitest';
import { pianoRivelazione } from './autoreveal';

describe('pianoRivelazione', () => {
  it('nessun passo, nessun ritardo', () => { expect(pianoRivelazione(0, false)).toEqual([]); });
  it('un passo ogni 450 ms', () => { expect(pianoRivelazione(3, false)).toEqual([450, 900, 1350]); });
  it('con movimento ridotto tutto subito', () => { expect(pianoRivelazione(3, true)).toEqual([0, 0, 0]); });
  it('il passo si può cambiare', () => { expect(pianoRivelazione(2, false, 300)).toEqual([300, 600]); });
});

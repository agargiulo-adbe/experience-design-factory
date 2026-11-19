import { describe, it, expect } from 'vitest';
import { pianoRivelazione } from './autoreveal';

describe('pianoRivelazione', () => {
  it('nessun passo, nessun ritardo', () => { expect(pianoRivelazione(0, false)).toEqual([]); });
  it('ritmo di lettura: un passo ogni 1,6 s, il primo dopo che la slide è entrata', () => {
    expect(pianoRivelazione(3, false)).toEqual([1600, 3200, 4800]);
  });
  it('con movimento ridotto tutto subito', () => { expect(pianoRivelazione(3, true)).toEqual([0, 0, 0]); });
  it('il ritmo si può cambiare per slide', () => { expect(pianoRivelazione(2, false, 3200)).toEqual([3200, 6400]); });
  it('il primo passo può avere un ritardo suo', () => { expect(pianoRivelazione(3, false, 2000, 2600)).toEqual([2600, 4600, 6600]); });
});

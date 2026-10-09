import { describe, it, expect } from 'vitest';
import { contrast, mix, paletteFromSvg } from './brand-icons-palette';

/** Il marchio della vetrina: gradiente, più un bianco di dettaglio. */
const GRADIENTE = `<svg><defs><linearGradient id="g">
  <stop offset="0" stop-color="#EB1000"/><stop offset="1" stop-color="#6236FF"/>
</linearGradient></defs>
<rect fill="url(#g)"/><rect fill="#fff" fill-opacity=".5"/><rect fill="#fff"/></svg>`;

/** Un marchio normale: tessera scura, due forme nei colori della skin. */
const TESSERA = `<svg><rect fill="#0B0B0D"/><rect fill="#FF2800"/><rect fill="#45454A"/></svg>`;

/** Un marchio chiaro: il titolo deve diventare scuro, non restare bianco. */
const CHIARO = `<svg><rect fill="#F4F6F9"/><rect fill="#0066CC"/></svg>`;

describe('contrast', () => {
  it('va da 1 (uguali) a 21 (nero su bianco)', () => {
    expect(contrast('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });
  it('non dipende dall’ordine degli argomenti', () => {
    expect(contrast('#0B0B0D', '#FF2800')).toBeCloseTo(contrast('#FF2800', '#0B0B0D'), 10);
  });
});

describe('mix', () => {
  it('a metà strada sta in mezzo', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
  });
});

describe('paletteFromSvg', () => {
  it('su una tessera scura tiene il titolo bianco e prende l’accento dal marchio', () => {
    const p = paletteFromSvg(TESSERA);
    expect(p.bg).toBe('#0B0B0D');
    expect(p.ink).toBe('#ffffff');
    expect(p.accent).toBe('#FF2800');
    expect(contrast(p.accent, p.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('su un marchio chiaro ribalta il titolo invece di lasciarlo bianco', () => {
    const p = paletteFromSvg(CHIARO);
    expect(p.bg).toBe('#F4F6F9');
    expect(p.ink).toBe('#101114');
    expect(contrast(p.ink, p.bg)).toBeGreaterThan(4.5);
  });

  it('su un marchio a gradiente NON prende il bianco di dettaglio come fondo', () => {
    // È il caso che ha prodotto l'anteprima bianca su bianco della vetrina.
    const p = paletteFromSvg(GRADIENTE);
    expect(p.bg).toBe('#EB1000');
    expect(contrast(p.ink, p.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('non restituisce mai una riga che non si legge', () => {
    for (const svg of [TESSERA, CHIARO, GRADIENTE]) {
      const p = paletteFromSvg(svg);
      expect(contrast(p.accent, p.bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('quando nessun colore del marchio stacca, avvicina l’inchiostro al fondo', () => {
    // Fondo scuro e una sola forma quasi invisibile: l'accento non può essere lei.
    const p = paletteFromSvg(`<svg><rect fill="#101114"/><rect fill="#15161a"/></svg>`);
    expect(p.accent).not.toBe('#15161a');
    expect(contrast(p.accent, p.bg)).toBeGreaterThanOrEqual(4.5);
  });
});

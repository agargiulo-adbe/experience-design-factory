import { describe, it, expect } from 'vitest';
import { FUNZIONI, LIVELLI, rigaContributo, sezioneDa, LIMITI } from './contributi';

describe('rigaContributo', () => {
  const base = { sezione: 'Giulia · Il primo contatto', testo: 'Come si collega al nostro CRM?' };
  it('una riga minima è anonima e fuori dal riepilogo', () => {
    const r = rigaContributo('intesa-storia-insieme', base);
    expect(r).toEqual({ ok: true, riga: {
      progetto: 'intesa-storia-insieme', sezione: base.sezione, testo: base.testo,
      funzione: null, livello: null, ok_riepilogo: false,
    } });
  });
  it('tiene funzione, livello e la casella solo se validi', () => {
    const r = rigaContributo('p', { ...base, funzione: 'dati', livello: 'dirigente', okRiepilogo: true });
    expect(r.ok && r.riga.funzione).toBe('dati');
    expect(r.ok && r.riga.livello).toBe('dirigente');
    expect(r.ok && r.riga.ok_riepilogo).toBe(true);
    const x = rigaContributo('p', { ...base, funzione: 'inventata', livello: 'capo' });
    expect(x.ok && x.riga.funzione).toBeNull();
    expect(x.ok && x.riga.livello).toBeNull();
  });
  it('rifiuta un testo vuoto o troppo lungo, con una frase umana', () => {
    const v = rigaContributo('p', { ...base, testo: '   ' });
    expect(v.ok).toBe(false);
    expect(!v.ok && v.errore).toMatch(/scriv/i);
    const l = rigaContributo('p', { ...base, testo: 'a'.repeat(LIMITI.testo + 1) });
    expect(l.ok).toBe(false);
  });
  it('una sezione vuota diventa «In generale»', () => {
    const r = rigaContributo('p', { ...base, sezione: ' ' });
    expect(r.ok && r.riga.sezione).toBe('In generale');
  });
  it('non porta mai nome o contatto, anche se qualcuno li passa', () => {
    const r = rigaContributo('p', { ...base, nome: 'Mario', email: 'x@y.it' } as never);
    expect(r.ok && Object.keys(r.riga).sort()).toEqual(['funzione', 'livello', 'ok_riepilogo', 'progetto', 'sezione', 'testo']);
  });
});

describe('sezioneDa', () => {
  it('unisce capitolo e titolo della slide', () => {
    expect(sezioneDa('Giulia', 'Il primo contatto')).toBe('Giulia · Il primo contatto');
  });
  it('non ripete il capitolo se il titolo è lo stesso, e taglia al limite', () => {
    expect(sezioneDa('Giulia', ' Giulia ')).toBe('Giulia');
    expect(sezioneDa('C', 'x'.repeat(400)).length).toBeLessThanOrEqual(LIMITI.sezione);
  });
});

describe('liste chiuse', () => {
  it('le chiavi sono semplici e uniche', () => {
    for (const l of [FUNZIONI, LIVELLI]) {
      const k = l.map((x) => x.k);
      expect(new Set(k).size).toBe(k.length);
      k.forEach((x) => expect(x).toMatch(/^[a-z]+$/));
    }
  });
});

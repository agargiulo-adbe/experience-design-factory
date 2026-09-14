import { describe, it, expect } from 'vitest';
import { cutFromSearch, trackingMode, makeSessionId, routeFromPath, buildEvent } from './telemetry';

describe('cutFromSearch', () => {
  it('is "full" without ?s=', () => { expect(cutFromSearch('')).toBe('full'); expect(cutFromSearch('?x=1')).toBe('full'); });
  it('sorts and dedups ids', () => { expect(cutFromSearch('?s=detail,asks,detail')).toBe('asks,detail'); });
  it('ignores blanks', () => { expect(cutFromSearch('?s=asks,,%20')).toBe('asks'); });
});

describe('trackingMode', () => {
  it('is on by default', () => { expect(trackingMode('', null)).toBe('on'); });
  it('is off with ?telemetry=0 or stored off', () => {
    expect(trackingMode('?telemetry=0', null)).toBe('off');
    expect(trackingMode('', 'off')).toBe('off');
  });
  it('is mock with ?telemetry=mock', () => { expect(trackingMode('?telemetry=mock', null)).toBe('mock'); });
});

describe('makeSessionId', () => {
  it('is 16 hex chars and deterministic for a given random', () => {
    const id = makeSessionId(() => 0.5);
    expect(id).toMatch(/^[0-9a-f]{16}$/);
    expect(makeSessionId(() => 0.5)).toBe(id);
  });
});

describe('routeFromPath', () => {
  it('maps the app home to index and a section to its slug', () => {
    expect(routeFromPath('/experience-design-factory/atelier/')).toBe('atelier');
    expect(routeFromPath('/experience-design-factory/atelier/plan/')).toBe('plan');
    expect(routeFromPath('/experience-design-factory/atelier/plan')).toBe('plan');
  });
});

describe('buildEvent', () => {
  it('assembles a clamped event', () => {
    const e = buildEvent({ project: 'atelier', pathname: '/x/atelier/plan/', search: '?s=asks', slideId: 'slide-m1', slideIndex: 3, lang: 'fr', sessionId: 'abcdef0123456789', dwellMs: 4_000_000 });
    expect(e).toEqual({ project: 'atelier', route: 'plan', slide_id: 'slide-m1', slide_index: 3, cut: 'asks', lang: 'fr', session_id: 'abcdef0123456789', dwell_ms: 3_600_000 });
  });
  it('sanitises non-finite and negative dwell to the range', () => {
    const base = { project: 'atelier', pathname: '/x/atelier/', search: '', slideId: 'slide-cover', slideIndex: 0, lang: 'en', sessionId: 'abcdef0123456789' };
    expect(buildEvent({ ...base, dwellMs: NaN }).dwell_ms).toBe(0);
    expect(buildEvent({ ...base, dwellMs: Infinity }).dwell_ms).toBe(0);
    expect(buildEvent({ ...base, dwellMs: -50 }).dwell_ms).toBe(0);
  });
});

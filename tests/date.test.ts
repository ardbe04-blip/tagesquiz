import { describe, expect, it } from 'vitest';
import { addDays, berlinDateKey, countdown, diffDays, formatLong, formatShort, isDateKey, nextBerlinMidnight } from '../src/lib/date';

describe('Datumswechsel nach deutscher Zeit', () => {
  it('wechselt im Winter um 23:00 UTC (= Mitternacht MEZ)', () => {
    expect(berlinDateKey(new Date('2026-11-15T22:59:59Z'))).toBe('2026-11-15');
    expect(berlinDateKey(new Date('2026-11-15T23:00:00Z'))).toBe('2026-11-16');
  });

  it('wechselt im Sommer um 22:00 UTC (= Mitternacht MESZ)', () => {
    expect(berlinDateKey(new Date('2026-07-01T21:59:59Z'))).toBe('2026-07-01');
    expect(berlinDateKey(new Date('2026-07-01T22:00:00Z'))).toBe('2026-07-02');
  });

  it('Jahreswechsel', () => {
    expect(berlinDateKey(new Date('2026-12-31T23:00:00Z'))).toBe('2027-01-01');
  });

  it('nächste Mitternacht im Winter', () => {
    expect(nextBerlinMidnight(new Date('2026-11-15T12:00:00Z')).toISOString()).toBe('2026-11-15T23:00:00.000Z');
  });

  it('nächste Mitternacht am Tag der Zeitumstellung (März und Oktober)', () => {
    // 29.03.2026: Umstellung auf Sommerzeit → Mitternacht zum 30.03. ist 22:00 UTC
    expect(nextBerlinMidnight(new Date('2026-03-29T12:00:00Z')).toISOString()).toBe('2026-03-29T22:00:00.000Z');
    // Kurz vor der Umstellung: Mitternacht zum 29.03. ist noch 23:00 UTC
    expect(nextBerlinMidnight(new Date('2026-03-28T12:00:00Z')).toISOString()).toBe('2026-03-28T23:00:00.000Z');
    // 25.10.2026: Umstellung auf Winterzeit → Mitternacht zum 26.10. ist 23:00 UTC
    expect(nextBerlinMidnight(new Date('2026-10-25T12:00:00Z')).toISOString()).toBe('2026-10-25T23:00:00.000Z');
  });

  it('Countdown bis Mitternacht', () => {
    expect(countdown(new Date('2026-11-15T22:59:30Z'))).toBe('00:00:30');
    expect(countdown(new Date('2026-11-15T12:00:00Z'))).toBe('11:00:00');
    expect(countdown(new Date('2026-11-15T23:00:00Z'))).toBe('24:00:00');
  });

  it('Hilfsfunktionen', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(diffDays('2026-11-15', '2026-11-21')).toBe(6);
    expect(isDateKey('2026-11-15')).toBe(true);
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('_vorlage')).toBe(false);
    expect(formatShort('2026-11-15')).toBe('15.11.2026');
    expect(formatLong('2026-11-15')).toBe('Sonntag, 15. November 2026');
  });
});

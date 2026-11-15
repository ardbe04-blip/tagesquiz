import { describe, expect, it } from 'vitest';
import type { SchlagzeilePuzzle, ZeitstrahlPuzzle } from '../src/lib/puzzle';
import { answer, grid, initialSchlagzeile, schlagzeileShare, score } from '../src/games/schlagzeile/logic';
import { check, evaluate, initialZeitstrahl, lockedSlots, move, solution, swap, yearsAgo, zeitstrahlShare } from '../src/games/zeitstrahl/logic';
import { addGuess, bearing, compareLand, compareNumber, distanceKm, initialLaender, laenderShare } from '../src/games/laender/logic';
import { findLand, normalize, resolveInput, suggest } from '../src/games/laender/countries';

const news: SchlagzeilePuzzle = {
  fragen: [0, 1, 2, 3, 4].map((i) => ({
    frage: `F${i}`,
    antworten: ['a', 'b', 'c', 'd'],
    richtig: i % 4,
    erklaerung: 'x',
    quelle: { medium: 'm', datum: 'd' }
  }))
};

describe('Schlagzeile', () => {
  it('wertet Antworten aus', () => {
    let s = initialSchlagzeile();
    for (const a of [0, 1, 0, 3, 1]) s = answer(s, news, a);
    expect(s.fertig).toBe(true);
    expect(score(s, news)).toBe(3);
    expect(grid(s, news)).toBe('🟩🟩🟥🟩🟥');
    expect(schlagzeileShare(s, news)).toBe('📰 3/5');
  });
  it('nimmt nach dem Ende keine Antworten mehr an', () => {
    let s = initialSchlagzeile();
    for (let i = 0; i < 7; i++) s = answer(s, news, 0);
    expect(s.antworten).toHaveLength(5);
  });
  it('Teilen-Zeile für nicht gespielt', () => {
    expect(schlagzeileShare(undefined, news)).toBe('📰 –');
  });
});

const zs: ZeitstrahlPuzzle = {
  ereignisse: [
    { text: 'Mond', jahr: 1969 },
    { text: 'Kolumbus', jahr: 1492 },
    { text: 'Völkerbund', jahr: 1920, tag: '11-15', heute: true },
    { text: 'Bastille', jahr: 1789 },
    { text: 'iPhone', jahr: 2007 }
  ]
};

describe('Zeitstrahl', () => {
  it('kennt die richtige Reihenfolge', () => {
    expect(solution(zs)).toEqual([1, 3, 2, 0, 4]);
  });
  it('mischt für alle gleich und nie schon gelöst', () => {
    const a = initialZeitstrahl(zs, 'seed-1');
    const b = initialZeitstrahl(zs, 'seed-1');
    expect(a.reihenfolge).toEqual(b.reihenfolge);
    expect(evaluate(a.reihenfolge, zs).every(Boolean)).toBe(false);
    expect([...a.reihenfolge].sort()).toEqual([0, 1, 2, 3, 4]);
    for (let i = 0; i < 50; i++) expect(evaluate(initialZeitstrahl(zs, `s${i}`).reihenfolge, zs).every(Boolean)).toBe(false);
  });
  it('markiert richtige Plätze und sperrt sie', () => {
    let s = { ...initialZeitstrahl(zs, 'x'), reihenfolge: [1, 2, 3, 0, 4] };
    s = check(s, zs);
    expect(s.pruefungen[0]).toEqual([true, false, false, true, true]);
    expect(lockedSlots(s)).toEqual([true, false, false, true, true]);
    expect(s.fertig).toBe(false);
    // gesperrte Plätze lassen sich nicht bewegen
    expect(move(s, 0, 2)).toBe(s);
    s = swap(s, 1, 2);
    expect(s.reihenfolge).toEqual([1, 3, 2, 0, 4]);
    s = check(s, zs);
    expect(s.geloest).toBe(true);
    expect(s.fertig).toBe(true);
    expect(zeitstrahlShare(s)).toBe('📜 ✅');
  });
  it('verschieben lässt gesperrte Plätze stehen', () => {
    let s = { ...initialZeitstrahl(zs, 'x'), reihenfolge: [1, 0, 4, 2, 3] };
    s = check(s, zs); // nur Platz 0 stimmt
    expect(lockedSlots(s)).toEqual([true, false, false, false, false]);
    s = move(s, 4, 1);
    expect(s.reihenfolge).toEqual([1, 3, 0, 4, 2]);
  });
  it('nach 3 falschen Prüfungen vorbei', () => {
    let s = { ...initialZeitstrahl(zs, 'x'), reihenfolge: [4, 0, 2, 3, 1] };
    s = check(check(check(s, zs), zs), zs);
    expect(s.fertig).toBe(true);
    expect(s.geloest).toBe(false);
    expect(check(s, zs)).toBe(s);
    expect(zeitstrahlShare(s)).toBe('📜 ❌');
  });
  it('heute vor … Jahren', () => {
    expect(yearsAgo(1920, '2026-11-15')).toBe(106);
  });
});

describe('Länder-Detektiv', () => {
  const de = findLand('DE')!;
  const at = findLand('AT')!;
  const pt = findLand('PT')!;
  const br = findLand('BR')!;

  it('Zahlenvergleich mit Pfeil und Farbe', () => {
    expect(compareNumber(100, 105)).toEqual({ farbe: 'gruen', pfeil: null });
    expect(compareNumber(100, 150)).toEqual({ farbe: 'gelb', pfeil: 'hoch' });
    expect(compareNumber(100, 40)).toEqual({ farbe: 'grau', pfeil: 'runter' });
  });
  it('Entfernung und Richtung', () => {
    const km = distanceKm(de, pt);
    expect(km).toBeGreaterThan(1700);
    expect(km).toBeLessThan(2200);
    expect(bearing(de, pt)).toBe('SW');
    expect(bearing(pt, de)).toBe('NO');
    expect(bearing(de, findLand('DK')!)).toBe('N');
  });
  it('Vergleich zweier Länder', () => {
    const v = compareLand(de, at);
    expect(v.kontinent).toBe('gruen');
    expect(v.einwohner.pfeil).toBe('runter');
    expect(v.binnenland).toBe('grau');
    expect(v.distanz.farbe).toBe('gelb');
    const w = compareLand(de, br);
    expect(w.kontinent).toBe('grau');
    expect(w.flaeche).toEqual({ farbe: 'grau', pfeil: 'hoch' });
    expect(w.distanz.farbe).toBe('grau');
    const same = compareLand(pt, pt);
    expect(same.distanz).toEqual({ km: 0, richtung: null, farbe: 'gruen' });
    expect(same.einwohner.farbe).toBe('gruen');
  });
  it('Spielablauf: gelöst und Höchstzahl', () => {
    let s = initialLaender();
    s = addGuess(s, 'DE', 'PT');
    s = addGuess(s, 'DE', 'PT'); // doppelt zählt nicht
    expect(s.tipps).toEqual(['DE']);
    s = addGuess(s, 'ES', 'PT');
    s = addGuess(s, 'PT', 'PT');
    expect(s).toMatchObject({ fertig: true, geloest: true });
    expect(laenderShare(s)).toBe('🌍 3 Versuche');
    let t = initialLaender();
    for (const c of ['DE', 'FR', 'IT', 'ES', 'PL', 'NL', 'BE']) t = addGuess(t, c, 'PT');
    expect(t.tipps).toHaveLength(6);
    expect(t).toMatchObject({ fertig: true, geloest: false });
    expect(laenderShare(t)).toBe('🌍 ❌');
    expect(laenderShare(addGuess(initialLaender(), 'PT', 'PT'))).toBe('🌍 1 Versuch');
  });
  it('Autovervollständigung auf Deutsch, tolerant', () => {
    expect(normalize('Österreich')).toBe('osterreich');
    expect(suggest('oster')[0].iso2).toBe('AT');
    expect(suggest('usa')[0].iso2).toBe('US');
    expect(suggest('kongo').map((l) => l.iso2)).toEqual(expect.arrayContaining(['CG', 'CD']));
    expect(suggest('deu', ['DE'])).toHaveLength(0);
    expect(resolveInput('elfenbeinkuste')?.iso2).toBe('CI');
    expect(resolveInput('Vereinigte Staaten')?.iso2).toBe('US');
  });
});

import { describe, expect, it } from 'vitest';
import { computeStreak } from '../src/lib/streak';
import { addPlayDay, emptySave, parseSave, setGameState } from '../src/lib/storage';
import { buildShareText } from '../src/lib/share';

describe('Serie', () => {
  it('0 ohne Spieltage', () => {
    expect(computeStreak([], '2026-11-15')).toBe(0);
  });
  it('zählt Tage in Folge bis heute', () => {
    expect(computeStreak(['2026-11-13', '2026-11-14', '2026-11-15'], '2026-11-15')).toBe(3);
  });
  it('bleibt erhalten, wenn heute noch nicht gespielt wurde', () => {
    expect(computeStreak(['2026-11-13', '2026-11-14'], '2026-11-15')).toBe(2);
  });
  it('reißt nach einem verpassten Tag ab', () => {
    expect(computeStreak(['2026-11-12', '2026-11-13'], '2026-11-15')).toBe(0);
    expect(computeStreak(['2026-11-10', '2026-11-11', '2026-11-13', '2026-11-14', '2026-11-15'], '2026-11-15')).toBe(3);
  });
  it('über Monats- und Jahresgrenzen', () => {
    expect(computeStreak(['2026-12-30', '2026-12-31', '2027-01-01'], '2027-01-01')).toBe(3);
    expect(computeStreak(['2026-02-28', '2026-03-01'], '2026-03-01')).toBe(2);
  });
  it('Reihenfolge und Doppelte egal', () => {
    expect(computeStreak(['2026-11-15', '2026-11-14', '2026-11-15'], '2026-11-15')).toBe(2);
  });
});

describe('Speicherstand', () => {
  it('kaputte oder fremde Daten führen zu leerem Stand', () => {
    expect(parseSave(null)).toEqual(emptySave());
    expect(parseSave('{kaputt')).toEqual(emptySave());
    expect(parseSave('{"version":99}')).toEqual(emptySave());
  });
  it('Spielstand und Spieltag speichern', () => {
    let s = setGameState(emptySave(), '2026-11-15', 'schlagzeile', { x: 1 });
    s = addPlayDay(s, '2026-11-15');
    s = addPlayDay(s, '2026-11-15');
    const back = parseSave(JSON.stringify(s));
    expect(back.spiele['2026-11-15'].schlagzeile).toEqual({ x: 1 });
    expect(back.spieltage).toEqual(['2026-11-15']);
  });
});

describe('Teilen', () => {
  it('erzeugt das Emoji-Format', () => {
    expect(buildShareText('2026-11-15', ['📰 4/5', '📜 ✅', '🌍 3 Versuche'], 6)).toBe(
      'TagesQuiz 15.11.2026\n📰 4/5  📜 ✅  🌍 3 Versuche\n🔥 Serie: 6 Tage'
    );
    expect(buildShareText('2026-11-15', ['📰 –'], 1, 'https://x.de/')).toBe('TagesQuiz 15.11.2026\n📰 –\n🔥 Serie: 1 Tag\nhttps://x.de/');
  });
});

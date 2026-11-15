import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pickContentDate, validatePuzzle } from '../src/lib/puzzle';
import { LAENDER } from '../src/games/laender/countries';

const dir = join(process.cwd(), 'content');
const files = readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));

describe('Tagesdateien in /content', () => {
  it('es gibt Dateien', () => {
    expect(files.length).toBeGreaterThan(0);
  });
  // Dieser Test läuft vor jeder Veröffentlichung: eine fehlerhafte Datei stoppt das Deployment
  for (const f of files) {
    it(`${f} ist gültig`, () => {
      const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      expect(validatePuzzle(raw, f.replace('.json', ''))).toEqual([]);
    });
  }
});

describe('Auswahl der Tagesdatei', () => {
  const avail = ['2026-11-15', '2026-11-16', '2026-11-18', '_vorlage'];
  it('nimmt die Datei von heute', () => {
    expect(pickContentDate(avail, '2026-11-16')).toBe('2026-11-16');
  });
  it('fehlt sie, das letzte verfügbare Rätsel', () => {
    expect(pickContentDate(avail, '2026-11-17')).toBe('2026-11-16');
    expect(pickContentDate(avail, '2026-12-24')).toBe('2026-11-18');
  });
  it('nie aus der Zukunft', () => {
    expect(pickContentDate(avail, '2026-11-14')).toBeUndefined();
  });
});

describe('Validierung erkennt Fehler', () => {
  it('meldet verständliche Fehler', () => {
    const errs = validatePuzzle(
      {
        datum: '2026-11-15',
        schlagzeile: { fragen: [{ frage: 'x', antworten: ['a', 'b'], richtig: 5, erklaerung: 'e', quelle: { medium: 'm' } }] },
        zeitstrahl: { ereignisse: [{ text: 'a', jahr: 1 }, { text: 'b', jahr: 1 }, { text: 'c', jahr: 3, heute: true, tag: '01-01' }] },
        laenderdetektiv: { land: 'XX' }
      },
      '2026-11-16'
    );
    expect(errs.join('\n')).toMatch(/Dateinamen/);
    expect(errs.join('\n')).toMatch(/richtig/);
    expect(errs.join('\n')).toMatch(/quelle/);
    expect(errs.join('\n')).toMatch(/dasselbe Jahr/);
    expect(errs.join('\n')).toMatch(/heute/);
    expect(errs.join('\n')).toMatch(/XX/);
  });
});

describe('Länderdaten', () => {
  it('vollständig und plausibel', () => {
    expect(LAENDER.length).toBeGreaterThanOrEqual(190);
    const iso = new Set<string>();
    for (const l of LAENDER) {
      expect(l.iso2).toMatch(/^[A-Z]{2}$/);
      expect(iso.has(l.iso2)).toBe(false);
      iso.add(l.iso2);
      expect(l.einwohner).toBeGreaterThan(0);
      expect(l.flaeche).toBeGreaterThan(0);
      expect(Math.abs(l.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(l.lon)).toBeLessThanOrEqual(180);
      expect(['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Ozeanien']).toContain(l.kontinent);
    }
  });
});

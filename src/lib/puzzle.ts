// Format einer Tagesdatei /content/JJJJ-MM-TT.json – siehe ANLEITUNG.md
import { isDateKey, type DateKey } from './date';
import { findLand } from '../games/laender/countries';

export interface Quelle {
  medium: string;
  datum: string;
  url?: string;
}
export interface NewsFrage {
  frage: string;
  antworten: string[];
  richtig: number;
  erklaerung: string;
  quelle: Quelle;
}
export interface SchlagzeilePuzzle {
  platzhalter?: boolean;
  fragen: NewsFrage[];
}
export interface Ereignis {
  text: string;
  jahr: number;
  /** Optional "MM-TT", nur nötig für das Ereignis mit heute: true */
  tag?: string;
  /** Genau ein Ereignis pro Tag sollte am heutigen Kalendertag passiert sein. */
  heute?: boolean;
}
export interface ZeitstrahlPuzzle {
  ereignisse: Ereignis[];
}
export interface LaenderPuzzle {
  land: string;
}
export interface Puzzle {
  datum: DateKey;
  schlagzeile?: SchlagzeilePuzzle;
  zeitstrahl?: ZeitstrahlPuzzle;
  laenderdetektiv?: LaenderPuzzle;
  /** Platz für weitere Spiele, z. B. "gruppen" */
  [spiel: string]: unknown;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Prüft eine Tagesdatei und liefert eine Liste verständlicher Fehler (leer = alles gut). */
export function validatePuzzle(raw: unknown, fileDate?: DateKey): string[] {
  const err: string[] = [];
  if (!isObj(raw)) return ['Die Datei ist kein JSON-Objekt.'];
  if (!isStr(raw.datum) || !isDateKey(raw.datum)) err.push('"datum" fehlt oder ist kein Datum im Format JJJJ-MM-TT.');
  else if (fileDate && raw.datum !== fileDate) err.push(`"datum" (${raw.datum}) passt nicht zum Dateinamen (${fileDate}).`);

  const s = raw.schlagzeile;
  if (s !== undefined) {
    if (!isObj(s) || !Array.isArray(s.fragen) || s.fragen.length === 0) err.push('schlagzeile: "fragen" muss eine Liste sein.');
    else
      s.fragen.forEach((f: unknown, i: number) => {
        const n = `schlagzeile Frage ${i + 1}`;
        if (!isObj(f)) return err.push(`${n}: ist kein Objekt.`);
        if (!isStr(f.frage)) err.push(`${n}: "frage" fehlt.`);
        const antworten: unknown[] = Array.isArray(f.antworten) ? f.antworten : [];
        const richtig = typeof f.richtig === 'number' ? f.richtig : -1;
        if (antworten.length < 2 || !antworten.every(isStr)) err.push(`${n}: "antworten" braucht mindestens 2 Texte.`);
        else if (!Number.isInteger(richtig) || richtig < 0 || richtig >= antworten.length)
          err.push(`${n}: "richtig" muss die Nummer der richtigen Antwort sein (0 = erste).`);
        if (!isStr(f.erklaerung)) err.push(`${n}: "erklaerung" fehlt.`);
        if (!isObj(f.quelle) || !isStr(f.quelle.medium) || !isStr(f.quelle.datum))
          err.push(`${n}: "quelle" braucht "medium" und "datum".`);
      });
  }

  const z = raw.zeitstrahl;
  if (z !== undefined) {
    if (!isObj(z) || !Array.isArray(z.ereignisse) || z.ereignisse.length < 3) err.push('zeitstrahl: "ereignisse" braucht mindestens 3 Einträge.');
    else {
      const keys = new Set<string>();
      z.ereignisse.forEach((e: unknown, i: number) => {
        const n = `zeitstrahl Ereignis ${i + 1}`;
        if (!isObj(e)) return err.push(`${n}: ist kein Objekt.`);
        if (!isStr(e.text)) err.push(`${n}: "text" fehlt.`);
        if (typeof e.jahr !== 'number' || !Number.isInteger(e.jahr)) err.push(`${n}: "jahr" muss eine ganze Zahl sein.`);
        if (e.tag !== undefined && (typeof e.tag !== 'string' || !/^\d{2}-\d{2}$/.test(e.tag))) err.push(`${n}: "tag" muss "MM-TT" sein.`);
        const k = `${e.jahr}-${e.tag ?? ''}`;
        if (keys.has(k)) err.push(`${n}: zwei Ereignisse haben dasselbe Jahr – bitte eindeutige Jahre verwenden.`);
        keys.add(k);
        if (e.heute && isStr(raw.datum) && e.tag !== raw.datum.slice(5))
          err.push(`${n}: "heute" ist gesetzt, aber "tag" (${String(e.tag)}) ist nicht ${raw.datum.slice(5)}.`);
      });
    }
  }

  const l = raw.laenderdetektiv;
  if (l !== undefined) {
    if (!isObj(l) || !isStr(l.land)) err.push('laenderdetektiv: "land" fehlt (zweistelliger Ländercode, z. B. "PT").');
    else if (!findLand(l.land)) err.push(`laenderdetektiv: Ländercode "${l.land}" ist unbekannt.`);
  }
  return err;
}

/**
 * Wählt die Datei für heute: die von heute oder – falls sie fehlt – die neueste ältere.
 * Dateien aus der Zukunft werden nie gezeigt.
 */
export function pickContentDate(available: DateKey[], today: DateKey): DateKey | undefined {
  return available
    .filter((d) => isDateKey(d) && d <= today)
    .sort()
    .at(-1);
}

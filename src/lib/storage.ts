// Einzige Datenspeicherung der App: localStorage im Browser des Nutzers. Nichts verlässt das Gerät.
import type { DateKey } from './date';

export type Theme = 'auto' | 'hell' | 'dunkel';

export interface SaveData {
  version: 1;
  /** Spielstände je Rätsel-Datum und Spiel-ID */
  spiele: Record<DateKey, Record<string, unknown>>;
  /** Kalendertage (Berlin), an denen mindestens ein Spiel beendet wurde */
  spieltage: DateKey[];
  theme: Theme;
}

const KEY = 'tagesquiz:v1';

export const emptySave = (): SaveData => ({ version: 1, spiele: {}, spieltage: [], theme: 'auto' });

export function parseSave(raw: string | null): SaveData {
  if (!raw) return emptySave();
  try {
    const d = JSON.parse(raw);
    if (d && d.version === 1 && typeof d.spiele === 'object' && Array.isArray(d.spieltage)) {
      return { ...emptySave(), ...d };
    }
  } catch {
    /* kaputte Daten → neu anfangen */
  }
  return emptySave();
}

export function loadSave(): SaveData {
  try {
    return parseSave(localStorage.getItem(KEY));
  } catch {
    return emptySave();
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* privater Modus o. Ä. – Spiel läuft trotzdem, nur ohne Speichern */
  }
}

export function setGameState(data: SaveData, contentDate: DateKey, gameId: string, state: unknown): SaveData {
  return {
    ...data,
    spiele: { ...data.spiele, [contentDate]: { ...data.spiele[contentDate], [gameId]: state } }
  };
}

export function addPlayDay(data: SaveData, day: DateKey): SaveData {
  if (data.spieltage.includes(day)) return data;
  // nur die letzten ~2 Jahre aufheben
  return { ...data, spieltage: [...data.spieltage, day].sort().slice(-800) };
}

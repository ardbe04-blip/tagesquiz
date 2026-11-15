import type { ComponentType } from 'react';
import type { DateKey } from '../lib/date';
import type { Puzzle } from '../lib/puzzle';

export interface GameProps<P, S> {
  puzzle: P;
  state: S;
  setState: (s: S) => void;
  /** heutiger Kalendertag (Berlin) */
  today: DateKey;
  /** Datum der Rätseldatei (kann bei fehlender Datei älter sein) */
  contentDate: DateKey;
}

/**
 * Ein Tagesspiel. Neues Spiel ergänzen:
 *  1. Ordner src/games/<name>/ mit logic.ts + Komponente anlegen
 *  2. Definition hier im Format GameDefinition exportieren
 *  3. in src/games/registry.ts eintragen
 *  4. Inhalt unter dem Schlüssel `id` in die Tagesdateien schreiben
 */
export interface GameDefinition<P = any, S = any> {
  id: string;
  titel: string;
  kategorie: string;
  emoji: string;
  /** CSS-Farbvariable, z. B. "news" → var(--news) */
  farbe: string;
  beschreibung: string;
  getPuzzle(p: Puzzle): P | undefined;
  initialState(puzzle: P, contentDate: DateKey): S;
  isDone(state: S): boolean;
  /** kurzer Status für die Karte auf dem Startbildschirm, z. B. "4/5 🟩🟩🟥🟩🟩" */
  summary(state: S, puzzle: P): string;
  /** Teil der Teilen-Zeile, z. B. "📰 4/5" */
  shareLine(state: S | undefined, puzzle: P | undefined): string;
  Component: ComponentType<GameProps<P, S>>;
}

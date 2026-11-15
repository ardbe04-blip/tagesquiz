import type { GameDefinition } from '../types';
import type { ZeitstrahlPuzzle } from '../../lib/puzzle';
import { initialZeitstrahl, MAX_PRUEFUNGEN, zeitstrahlShare, type ZeitstrahlState } from './logic';
import { Zeitstrahl } from './Zeitstrahl';

export const zeitstrahlGame: GameDefinition<ZeitstrahlPuzzle, ZeitstrahlState> = {
  id: 'zeitstrahl',
  titel: 'Zeitstrahl',
  kategorie: 'Geschichte',
  emoji: '📜',
  farbe: 'geschichte',
  beschreibung: '5 Ereignisse in die richtige Reihenfolge',
  getPuzzle: (p) => p.zeitstrahl,
  initialState: (puzzle, contentDate) => initialZeitstrahl(puzzle, `zeitstrahl-${contentDate}`),
  isDone: (s) => s.fertig,
  summary: (s) => (s.geloest ? `✅ geschafft (${s.pruefungen.length}/${MAX_PRUEFUNGEN})` : '❌ nicht geschafft'),
  shareLine: (s) => zeitstrahlShare(s),
  Component: Zeitstrahl
};

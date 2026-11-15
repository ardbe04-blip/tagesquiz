import type { GameDefinition } from '../types';
import type { SchlagzeilePuzzle } from '../../lib/puzzle';
import { grid, initialSchlagzeile, schlagzeileShare, score, type SchlagzeileState } from './logic';
import { Schlagzeile } from './Schlagzeile';

export const schlagzeileGame: GameDefinition<SchlagzeilePuzzle, SchlagzeileState> = {
  id: 'schlagzeile',
  titel: 'Schlagzeile',
  kategorie: 'News',
  emoji: '📰',
  farbe: 'news',
  beschreibung: '5 Fragen zu den Nachrichten',
  getPuzzle: (p) => p.schlagzeile,
  initialState: () => initialSchlagzeile(),
  isDone: (s) => s.fertig,
  summary: (s, p) => `${score(s, p)}/${p.fragen.length} ${grid(s, p)}`,
  shareLine: schlagzeileShare,
  Component: Schlagzeile
};

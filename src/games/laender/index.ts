import type { GameDefinition } from '../types';
import type { LaenderPuzzle } from '../../lib/puzzle';
import { initialLaender, laenderShare, MAX_VERSUCHE, type LaenderState } from './logic';
import { LaenderDetektiv } from './LaenderDetektiv';

export const laenderGame: GameDefinition<LaenderPuzzle, LaenderState> = {
  id: 'laenderdetektiv',
  titel: 'Länder-Detektiv',
  kategorie: 'Wissen',
  emoji: '🌍',
  farbe: 'wissen',
  beschreibung: `Finde das Land in ${MAX_VERSUCHE} Versuchen`,
  getPuzzle: (p) => p.laenderdetektiv,
  initialState: () => initialLaender(),
  isDone: (s) => s.fertig,
  summary: (s) => (s.geloest ? `✅ in ${s.tipps.length} ${s.tipps.length === 1 ? 'Versuch' : 'Versuchen'}` : '❌ nicht gefunden'),
  shareLine: (s) => laenderShare(s),
  Component: LaenderDetektiv
};

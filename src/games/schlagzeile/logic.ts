import type { SchlagzeilePuzzle } from '../../lib/puzzle';

export interface SchlagzeileState {
  /** gewählte Antwort je Frage */
  antworten: number[];
  fertig: boolean;
}

export const initialSchlagzeile = (): SchlagzeileState => ({ antworten: [], fertig: false });

export function answer(state: SchlagzeileState, puzzle: SchlagzeilePuzzle, choice: number): SchlagzeileState {
  if (state.fertig) return state;
  const antworten = [...state.antworten, choice];
  return { antworten, fertig: antworten.length >= puzzle.fragen.length };
}

export function results(state: SchlagzeileState, puzzle: SchlagzeilePuzzle): boolean[] {
  return state.antworten.map((a, i) => puzzle.fragen[i]?.richtig === a);
}

export function score(state: SchlagzeileState, puzzle: SchlagzeilePuzzle): number {
  return results(state, puzzle).filter(Boolean).length;
}

export function grid(state: SchlagzeileState, puzzle: SchlagzeilePuzzle): string {
  return results(state, puzzle)
    .map((ok) => (ok ? '🟩' : '🟥'))
    .join('');
}

export function schlagzeileShare(state: SchlagzeileState | undefined, puzzle: SchlagzeilePuzzle | undefined): string {
  if (!state?.fertig || !puzzle) return '📰 –';
  return `📰 ${score(state, puzzle)}/${puzzle.fragen.length}`;
}

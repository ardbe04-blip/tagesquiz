import type { Ereignis, ZeitstrahlPuzzle } from '../../lib/puzzle';
import { seededRandom, shuffle } from '../../lib/random';

export const MAX_PRUEFUNGEN = 3;

export interface ZeitstrahlState {
  /** aktuelle Reihenfolge als Indizes in puzzle.ereignisse */
  reihenfolge: number[];
  /** Ergebnis jeder Prüfung: pro Platz richtig/falsch */
  pruefungen: boolean[][];
  /** Reihenfolge zum Zeitpunkt jeder Prüfung */
  verlauf: number[][];
  fertig: boolean;
  geloest: boolean;
}

const sortKey = (e: Ereignis) => e.jahr * 10_000 + (e.tag ? Number(e.tag.replace('-', '')) : 0);

/** Richtige Reihenfolge (älteste zuerst) als Indizes. */
export function solution(puzzle: ZeitstrahlPuzzle): number[] {
  return puzzle.ereignisse.map((_, i) => i).sort((a, b) => sortKey(puzzle.ereignisse[a]) - sortKey(puzzle.ereignisse[b]));
}

/** Startreihenfolge: für alle gleich gemischt (Seed = Datum), aber nie schon richtig. */
export function initialZeitstrahl(puzzle: ZeitstrahlPuzzle, seed: string): ZeitstrahlState {
  const sol = solution(puzzle);
  const rand = seededRandom(seed);
  let order = shuffle(sol, rand);
  for (let i = 0; i < 20 && order.every((v, k) => v === sol[k]); i++) order = shuffle(sol, rand);
  if (order.every((v, k) => v === sol[k])) order = [...sol].reverse();
  return { reihenfolge: order, pruefungen: [], verlauf: [], fertig: false, geloest: false };
}

export function evaluate(order: number[], puzzle: ZeitstrahlPuzzle): boolean[] {
  const sol = solution(puzzle);
  return order.map((v, i) => v === sol[i]);
}

/** Plätze, die bei der letzten Prüfung stimmten, sind gesperrt. */
export function lockedSlots(state: ZeitstrahlState): boolean[] {
  const last = state.pruefungen.at(-1);
  return state.reihenfolge.map((_, i) => state.fertig || (last ? last[i] : false));
}

export function check(state: ZeitstrahlState, puzzle: ZeitstrahlPuzzle): ZeitstrahlState {
  if (state.fertig) return state;
  const res = evaluate(state.reihenfolge, puzzle);
  const pruefungen = [...state.pruefungen, res];
  const verlauf = [...(state.verlauf ?? []), [...state.reihenfolge]];
  const geloest = res.every(Boolean);
  return { ...state, pruefungen, verlauf, geloest, fertig: geloest || pruefungen.length >= MAX_PRUEFUNGEN };
}

/**
 * Verschiebt ein Ereignis von Platz `from` nach Platz `to`.
 * Gesperrte (schon richtige) Plätze bleiben stehen; die übrigen rutschen nach.
 */
export function move(state: ZeitstrahlState, from: number, to: number): ZeitstrahlState {
  const locked = lockedSlots(state);
  if (state.fertig || from === to || locked[from] || locked[to]) return state;
  const free = state.reihenfolge.map((_, i) => i).filter((i) => !locked[i]);
  const values = free.map((i) => state.reihenfolge[i]);
  const fi = free.indexOf(from);
  const ti = free.indexOf(to);
  const [item] = values.splice(fi, 1);
  values.splice(ti, 0, item);
  const reihenfolge = [...state.reihenfolge];
  free.forEach((slot, k) => (reihenfolge[slot] = values[k]));
  return { ...state, reihenfolge };
}

/** Tausch zweier Plätze (für die Bedienung per Antippen). */
export function swap(state: ZeitstrahlState, a: number, b: number): ZeitstrahlState {
  const locked = lockedSlots(state);
  if (state.fertig || a === b || locked[a] || locked[b]) return state;
  const reihenfolge = [...state.reihenfolge];
  [reihenfolge[a], reihenfolge[b]] = [reihenfolge[b], reihenfolge[a]];
  return { ...state, reihenfolge };
}

export function zeitstrahlGrid(state: ZeitstrahlState): string {
  return state.pruefungen.map((r) => r.map((ok) => (ok ? '🟩' : '🟥')).join('')).join('\n');
}

export function zeitstrahlShare(state: ZeitstrahlState | undefined): string {
  if (!state?.fertig) return '📜 –';
  return state.geloest ? '📜 ✅' : '📜 ❌';
}

/** "Heute vor 106 Jahren" – bezogen auf das Jahr des heutigen Datums. */
export function yearsAgo(jahr: number, today: string): number {
  return Number(today.slice(0, 4)) - jahr;
}

export function formatJahr(jahr: number): string {
  return jahr < 0 ? `${-jahr} v. Chr.` : String(jahr);
}

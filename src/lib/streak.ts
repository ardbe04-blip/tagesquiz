import { addDays, type DateKey } from './date';

/**
 * Serie = Anzahl Tage in Folge, an denen mindestens ein Spiel beendet wurde.
 * Wer heute noch nicht gespielt hat, verliert die Serie erst, wenn auch heute vorbeigeht:
 * dann zählt die Serie bis gestern.
 */
export function computeStreak(playDays: Iterable<DateKey>, today: DateKey): number {
  const days = new Set(playDays);
  let start: DateKey;
  if (days.has(today)) start = today;
  else if (days.has(addDays(today, -1))) start = addDays(today, -1);
  else return 0;
  let n = 0;
  let d = start;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

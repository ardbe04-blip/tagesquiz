// Alle Tageswechsel richten sich nach deutscher Zeit (Europe/Berlin), egal wo das Handy gerade ist.
export const TIME_ZONE = 'Europe/Berlin';

/** Datum als Schlüssel "JJJJ-MM-TT". */
export type DateKey = string;

function parts(date: Date, timeZone = TIME_ZONE) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });
  const out: Record<string, number> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return out as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Heutiges Datum in Berlin als "JJJJ-MM-TT". */
export function berlinDateKey(now: Date = new Date()): DateKey {
  const p = parts(now);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

export function isDateKey(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function addDays(key: DateKey, days: number): DateKey {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

/** Abstand in Tagen von a nach b (b - a). */
export function diffDays(a: DateKey, b: DateKey): number {
  const toUtc = (k: DateKey) => {
    const [y, m, d] = k.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

/** Verschiebung von Berlin gegenüber UTC in Minuten zu einem Zeitpunkt (60 im Winter, 120 im Sommer). */
export function berlinOffsetMinutes(at: Date): number {
  const p = parts(at);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60_000);
}

/** Zeitpunkt der nächsten Mitternacht in Berlin (berücksichtigt Sommer-/Winterzeit). */
export function nextBerlinMidnight(now: Date = new Date()): Date {
  const tomorrow = addDays(berlinDateKey(now), 1);
  const [y, m, d] = tomorrow.split('-').map(Number);
  const utcMidnight = Date.UTC(y, m - 1, d);
  // Erst mit der Verschiebung von "jetzt" schätzen, dann mit der am Zielzeitpunkt korrigieren.
  let guess = utcMidnight - berlinOffsetMinutes(now) * 60_000;
  guess = utcMidnight - berlinOffsetMinutes(new Date(guess)) * 60_000;
  return new Date(guess);
}

/** Countdown "hh:mm:ss" bis zur nächsten Mitternacht in Berlin. */
export function countdown(now: Date = new Date()): string {
  const ms = Math.max(0, nextBerlinMidnight(now).getTime() - now.getTime());
  const s = Math.floor(ms / 1000);
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
}

/** "15.11.2026" */
export function formatShort(key: DateKey): string {
  const [y, m, d] = key.split('-');
  return `${d}.${m}.${y}`;
}

/** "Sonntag, 15. November 2026" */
export function formatLong(key: DateKey): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

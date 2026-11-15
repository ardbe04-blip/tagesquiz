// Lädt die Tagesrätsel aus /content/*.json. Vite packt jede Datei beim Bauen in ein eigenes kleines Stück,
// es gibt also zur Laufzeit keine Anfragen an fremde Server.
import { addDays, type DateKey } from './date';
import { pickContentDate, validatePuzzle, type Puzzle } from './puzzle';

const files = import.meta.glob('/content/2*.json', { import: 'default' }) as Record<string, () => Promise<unknown>>;

const byDate = new Map<DateKey, () => Promise<unknown>>();
for (const [path, loader] of Object.entries(files)) {
  const m = path.match(/(\d{4}-\d{2}-\d{2})\.json$/);
  if (m) byDate.set(m[1], loader);
}

export interface LoadedPuzzle {
  puzzle: Puzzle;
  /** true, wenn für heute keine Datei existiert und ein älteres Rätsel gezeigt wird */
  fallback: boolean;
}

/** Rätsel für heute laden; fehlt es (oder ist fehlerhaft), das neueste ältere gültige nehmen. */
export async function loadPuzzleFor(today: DateKey): Promise<LoadedPuzzle | undefined> {
  let candidates = [...byDate.keys()];
  for (let i = 0; i < 60; i++) {
    const date = pickContentDate(candidates, today);
    if (!date) return undefined;
    try {
      const raw = await byDate.get(date)!();
      const errors = validatePuzzle(raw, date);
      if (errors.length === 0) return { puzzle: raw as Puzzle, fallback: date !== today };
      console.warn(`Rätsel ${date} ist fehlerhaft:`, errors);
    } catch (e) {
      console.warn(`Rätsel ${date} konnte nicht geladen werden`, e);
    }
    candidates = candidates.filter((d) => d !== date);
  }
  return undefined;
}

export const hasPuzzle = (d: DateKey) => byDate.has(d);
export const tomorrowKnown = (today: DateKey) => byDate.has(addDays(today, 1));

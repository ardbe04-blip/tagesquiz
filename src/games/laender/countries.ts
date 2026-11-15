import data from '../../data/laender.json';

export interface Land {
  iso2: string;
  isoNum: string | null;
  name: string;
  nameEn: string;
  kontinent: string;
  einwohner: number;
  flaeche: number;
  binnenland: boolean;
  lat: number;
  lon: number;
  aliase?: string[];
}

export const LAENDER: Land[] = data.laender as unknown as Land[];
const byIso = new Map(LAENDER.map((l) => [l.iso2, l]));

export function findLand(iso2: string): Land | undefined {
  return byIso.get(iso2.toUpperCase());
}

/** Kleinschreibung, ohne Akzente/Umlaute-Punkte, ß → ss – für eine tolerante Suche. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Vorschläge für die Autovervollständigung, beste Treffer zuerst. */
export function suggest(query: string, exclude: readonly string[] = [], limit = 6): Land[] {
  const q = normalize(query);
  if (!q) return [];
  const scored: { land: Land; score: number }[] = [];
  for (const land of LAENDER) {
    if (exclude.includes(land.iso2)) continue;
    const names = [land.name, ...(land.aliase ?? [])].map(normalize);
    let score = 0;
    for (const n of names) {
      if (n === q) score = Math.max(score, 4);
      else if (n.startsWith(q)) score = Math.max(score, 3);
      else if (n.split(' ').some((w) => w.startsWith(q))) score = Math.max(score, 2);
      else if (q.length >= 3 && n.includes(q)) score = Math.max(score, 1);
    }
    if (score > 0) scored.push({ land, score });
  }
  scored.sort((a, b) => b.score - a.score || a.land.name.localeCompare(b.land.name, 'de'));
  return scored.slice(0, limit).map((s) => s.land);
}

/** Eingabe genau einem Land zuordnen (Name oder Alias), sonst undefined. */
export function resolveInput(query: string): Land | undefined {
  const q = normalize(query);
  return LAENDER.find((l) => [l.name, ...(l.aliase ?? [])].some((n) => normalize(n) === q));
}

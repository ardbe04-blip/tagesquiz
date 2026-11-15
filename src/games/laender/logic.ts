import type { Land } from './countries';

export const MAX_VERSUCHE = 6;

export type Farbe = 'gruen' | 'gelb' | 'grau';
export type Pfeil = 'hoch' | 'runter' | null;
export type Richtung = 'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW';

export interface Vergleich {
  kontinent: Farbe;
  einwohner: { farbe: Farbe; pfeil: Pfeil };
  flaeche: { farbe: Farbe; pfeil: Pfeil };
  binnenland: Farbe;
  distanz: { km: number; richtung: Richtung | null; farbe: Farbe };
}

/** Ab dieser Entfernung (km) gilt ein Tipp nicht mehr als "nah dran". */
export const NAH_KM = 1500;

/** Zahlvergleich: grün bis ±10 %, gelb bis Faktor 2, sonst grau. Pfeil zeigt, ob das gesuchte Land mehr oder weniger hat. */
export function compareNumber(guess: number, target: number): { farbe: Farbe; pfeil: Pfeil } {
  const pfeil: Pfeil = target > guess ? 'hoch' : target < guess ? 'runter' : null;
  const ratio = Math.max(guess, target) / Math.max(Math.min(guess, target), 1e-9);
  const farbe: Farbe = ratio <= 1.1 ? 'gruen' : ratio <= 2 ? 'gelb' : 'grau';
  return { farbe, pfeil: farbe === 'gruen' ? null : pfeil };
}

const rad = (d: number) => (d * Math.PI) / 180;

export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Himmelsrichtung vom Tipp zum gesuchten Land (Anfangskurs auf dem Großkreis). */
export function bearing(from: { lat: number; lon: number }, to: { lat: number; lon: number }): Richtung {
  const y = Math.sin(rad(to.lon - from.lon)) * Math.cos(rad(to.lat));
  const x = Math.cos(rad(from.lat)) * Math.sin(rad(to.lat)) - Math.sin(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.cos(rad(to.lon - from.lon));
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const dirs: Richtung[] = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function compareLand(guess: Land, target: Land): Vergleich {
  const same = guess.iso2 === target.iso2;
  const km = same ? 0 : Math.round(distanceKm(guess, target));
  return {
    kontinent: guess.kontinent === target.kontinent ? 'gruen' : 'grau',
    einwohner: same ? { farbe: 'gruen', pfeil: null } : compareNumber(guess.einwohner, target.einwohner),
    flaeche: same ? { farbe: 'gruen', pfeil: null } : compareNumber(guess.flaeche, target.flaeche),
    binnenland: guess.binnenland === target.binnenland ? 'gruen' : 'grau',
    distanz: {
      km,
      richtung: same ? null : bearing(guess, target),
      farbe: same ? 'gruen' : km <= NAH_KM ? 'gelb' : 'grau'
    }
  };
}

export interface LaenderState {
  tipps: string[];
  fertig: boolean;
  geloest: boolean;
}

export const initialLaender = (): LaenderState => ({ tipps: [], fertig: false, geloest: false });

export function addGuess(state: LaenderState, iso2: string, target: string): LaenderState {
  if (state.fertig || state.tipps.includes(iso2)) return state;
  const tipps = [...state.tipps, iso2];
  const geloest = iso2 === target;
  return { tipps, geloest, fertig: geloest || tipps.length >= MAX_VERSUCHE };
}

export function laenderShare(state: LaenderState | undefined): string {
  if (!state?.fertig) return '🌍 –';
  if (!state.geloest) return '🌍 ❌';
  const n = state.tipps.length;
  return `🌍 ${n} ${n === 1 ? 'Versuch' : 'Versuche'}`;
}

export const RICHTUNG_PFEIL: Record<Richtung, string> = {
  N: '⬆️', NO: '↗️', O: '➡️', SO: '↘️', S: '⬇️', SW: '↙️', W: '⬅️', NW: '↖️'
};
export const RICHTUNG_NAME: Record<Richtung, string> = {
  N: 'Norden', NO: 'Nordosten', O: 'Osten', SO: 'Südosten', S: 'Süden', SW: 'Südwesten', W: 'Westen', NW: 'Nordwesten'
};

export function formatEinwohner(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toLocaleString('de-DE', { maximumFractionDigits: 2 })} Mrd.`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('de-DE', { maximumFractionDigits: n >= 1e7 ? 0 : 1 })} Mio.`;
  if (n >= 1e3) return `${Math.round(n / 1e3).toLocaleString('de-DE')} Tsd.`;
  return n.toLocaleString('de-DE');
}
export function formatFlaeche(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('de-DE', { maximumFractionDigits: 1 })} Mio. km²`;
  if (n >= 1e4) return `${Math.round(n / 1e3).toLocaleString('de-DE')} Tsd. km²`;
  return `${n.toLocaleString('de-DE')} km²`;
}

import { useMemo, useState } from 'react';
import type { GameProps } from '../types';
import type { LaenderPuzzle } from '../../lib/puzzle';
import { findLand, resolveInput, suggest, type Land } from './countries';
import {
  addGuess,
  compareLand,
  formatEinwohner,
  formatFlaeche,
  MAX_VERSUCHE,
  RICHTUNG_NAME,
  RICHTUNG_PFEIL,
  type LaenderState,
  type Pfeil
} from './logic';

const BASE = import.meta.env.BASE_URL;
const pfeil = (p: Pfeil) => (p === 'hoch' ? '⬆️ ' : p === 'runter' ? '⬇️ ' : '');

export function LaenderDetektiv({ puzzle, state, setState }: GameProps<LaenderPuzzle, LaenderState>) {
  const target = findLand(puzzle.land)!;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [shake, setShake] = useState(false);
  const options = useMemo(() => suggest(query, state.tipps), [query, state.tipps]);

  const submit = (land: Land | undefined) => {
    if (!land || state.tipps.includes(land.iso2)) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setState(addGuess(state, land.iso2, target.iso2));
    setQuery('');
    setActive(0);
  };

  return (
    <div className="stack">
      {!state.fertig && (
        <div className={`guess-input${shake ? ' shake' : ''}`}>
          <label htmlFor="land-input" className="sr-only">
            Land eingeben
          </label>
          <input
            id="land-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={`Land eingeben … (${state.tipps.length + 1}/${MAX_VERSUCHE})`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, options.length - 1));
              else if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0));
              else if (e.key === 'Enter') submit(options[active] ?? resolveInput(query));
            }}
          />
          {options.length > 0 && (
            <ul className="suggestions" role="listbox">
              {options.map((l, i) => (
                <li key={l.iso2} role="option" aria-selected={i === active}>
                  <button className={i === active ? 'active' : ''} onClick={() => submit(l)}>
                    {l.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {state.tipps.length > 0 && (
        <div className="guess-head" aria-hidden="true">
          <span>Kontinent</span>
          <span>Einw.</span>
          <span>Fläche</span>
          <span>Binnen&shy;land</span>
          <span>Distanz</span>
        </div>
      )}
      <ol className="guesses">
        {state.tipps.map((iso, i) => {
          const g = findLand(iso)!;
          const v = compareLand(g, target);
          const richtung = v.distanz.richtung;
          return (
            <li key={iso} className="guess pop-in">
              <div className="guess-name">
                <span>{i + 1}.</span> {g.name}
              </div>
              <div className="tiles">
                <span className={`tile ${v.kontinent}`} style={{ animationDelay: '0ms' }}>
                  {g.kontinent}
                </span>
                <span className={`tile ${v.einwohner.farbe}`} style={{ animationDelay: '80ms' }} title={v.einwohner.pfeil === 'hoch' ? 'Gesuchtes Land hat mehr Einwohner' : v.einwohner.pfeil === 'runter' ? 'Gesuchtes Land hat weniger Einwohner' : ''}>
                  {pfeil(v.einwohner.pfeil)}
                  {formatEinwohner(g.einwohner)}
                </span>
                <span className={`tile ${v.flaeche.farbe}`} style={{ animationDelay: '160ms' }}>
                  {pfeil(v.flaeche.pfeil)}
                  {formatFlaeche(g.flaeche)}
                </span>
                <span className={`tile ${v.binnenland}`} style={{ animationDelay: '240ms' }}>
                  {g.binnenland ? 'Ja' : 'Nein'}
                </span>
                <span className={`tile ${v.distanz.farbe}`} style={{ animationDelay: '320ms' }} title={richtung ? `Das gesuchte Land liegt im ${RICHTUNG_NAME[richtung]}` : ''}>
                  {v.distanz.km === 0 ? '🎯' : `${v.distanz.km.toLocaleString('de-DE')} km ${richtung ? RICHTUNG_PFEIL[richtung] : ''}`}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {!state.fertig && (
        <details className="legend">
          <summary>So funktioniert's</summary>
          <p>
            🟩 gleich bzw. sehr ähnlich (±10 %) · 🟨 nah dran (höchstens doppelt so viel/wenig, bis 1.500 km) · ⬜ daneben.
            ⬆️ = das gesuchte Land hat mehr, ⬇️ = weniger. Der Richtungspfeil zeigt vom getippten Land zum gesuchten.
          </p>
        </details>
      )}

      {state.fertig && (
        <div className="reveal slide-up">
          <p className="verdict">{state.geloest ? `🎉 Gefunden in ${state.tipps.length}!` : '🕵️ Gesucht war:'}</p>
          <h2>{target.name}</h2>
          <div className="reveal-media">
            <Outline iso={target.iso2} />
            <img className="flag" src={`${BASE}flags/${target.iso2.toLowerCase()}.svg`} alt={`Flagge: ${target.name}`} />
          </div>
          <dl className="facts">
            <dt>Kontinent</dt>
            <dd>{target.kontinent}</dd>
            <dt>Einwohner</dt>
            <dd>{formatEinwohner(target.einwohner)}</dd>
            <dt>Fläche</dt>
            <dd>{formatFlaeche(target.flaeche)}</dd>
            <dt>Binnenland</dt>
            <dd>{target.binnenland ? 'Ja' : 'Nein'}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}

function Outline({ iso }: { iso: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img className="outline" src={`${BASE}outlines/${iso.toLowerCase()}.svg`} alt="Umriss des Landes" onError={() => setOk(false)} />;
}

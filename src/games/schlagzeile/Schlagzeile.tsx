import { useState } from 'react';
import type { GameProps } from '../types';
import type { SchlagzeilePuzzle } from '../../lib/puzzle';
import { answer, grid, results, score, type SchlagzeileState } from './logic';

export function Schlagzeile({ puzzle, state, setState }: GameProps<SchlagzeilePuzzle, SchlagzeileState>) {
  // Index der Frage, deren Auflösung gerade angezeigt wird
  const [showing, setShowing] = useState<number | null>(null);
  const total = puzzle.fragen.length;

  const banner = puzzle.platzhalter ? (
    <p className="banner">⚠️ Platzhalter: Hier stehen noch Beispielfragen, keine echten Nachrichten.</p>
  ) : null;

  if (state.fertig && showing === null) {
    const res = results(state, puzzle);
    return (
      <div className="stack">
        {banner}
        <div className="result-box">
          <div className="result-big">
            {score(state, puzzle)}/{total}
          </div>
          <div className="result-grid">{grid(state, puzzle)}</div>
        </div>
        <ol className="review">
          {puzzle.fragen.map((f, i) => (
            <li key={i} className={res[i] ? 'ok' : 'bad'}>
              <strong>{f.frage}</strong>
              <span>
                {res[i] ? '✅' : '❌'} {f.antworten[f.richtig]}
              </span>
              <small>
                {f.quelle.url ? (
                  <a href={f.quelle.url} target="_blank" rel="noopener noreferrer">
                    {f.quelle.medium}
                  </a>
                ) : (
                  f.quelle.medium
                )}
                , {f.quelle.datum}
              </small>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const idx = showing ?? state.antworten.length;
  const frage = puzzle.fragen[idx];
  if (!frage) return null;
  const chosen = showing !== null ? state.antworten[showing] : undefined;

  return (
    <div className="stack" key={idx}>
      {banner}
      <div className="progress" aria-label={`Frage ${idx + 1} von ${total}`}>
        {puzzle.fragen.map((_, i) => (
          <span
            key={i}
            className={
              i < state.antworten.length ? (puzzle.fragen[i].richtig === state.antworten[i] ? 'ok' : 'bad') : i === idx ? 'now' : ''
            }
          />
        ))}
      </div>
      <h2 className="question pop-in">{frage.frage}</h2>
      <div className="answers">
        {frage.antworten.map((a, i) => {
          let cls = 'answer';
          if (chosen !== undefined) {
            if (i === frage.richtig) cls += ' right';
            else if (i === chosen) cls += ' wrong';
            else cls += ' dim';
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={chosen !== undefined}
              onClick={() => {
                setState(answer(state, puzzle, i));
                setShowing(idx);
              }}
            >
              {a}
            </button>
          );
        })}
      </div>
      {chosen !== undefined && (
        <div className="explain slide-up">
          <p className="verdict">{chosen === frage.richtig ? '🎉 Richtig!' : '😬 Leider falsch.'}</p>
          <p>{frage.erklaerung}</p>
          <p className="source">
            Quelle:{' '}
            {frage.quelle.url ? (
              <a href={frage.quelle.url} target="_blank" rel="noopener noreferrer">
                {frage.quelle.medium}
              </a>
            ) : (
              frage.quelle.medium
            )}
            , {frage.quelle.datum}
          </p>
          <button className="btn primary" onClick={() => setShowing(null)}>
            {idx + 1 < total ? 'Nächste Frage →' : 'Ergebnis ansehen'}
          </button>
        </div>
      )}
    </div>
  );
}

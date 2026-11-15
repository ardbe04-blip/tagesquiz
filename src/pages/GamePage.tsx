import type { CSSProperties } from 'react';
import type { GameDefinition } from '../games/types';
import type { LoadedPuzzle } from '../lib/content';
import type { DateKey } from '../lib/date';
import { formatShort } from '../lib/date';

interface Props {
  def: GameDefinition;
  loaded: LoadedPuzzle | null | undefined;
  today: DateKey;
  state: unknown;
  setState: (s: unknown) => void;
}

export function GamePage({ def, loaded, today, state, setState }: Props) {
  const puzzle = loaded ? def.getPuzzle(loaded.puzzle) : undefined;
  const Component = def.Component;
  return (
    <div className="page" style={{ '--accent': `var(--${def.farbe})` } as CSSProperties}>
      <header className="game-header">
        <a href="#/" className="back" aria-label="Zurück zur Übersicht">
          ←
        </a>
        <div>
          <span className="eyebrow">
            {def.emoji} {def.kategorie}
          </span>
          <h1>{def.titel}</h1>
        </div>
      </header>
      {loaded === undefined && <p className="hint">Lädt …</p>}
      {loaded && loaded.fallback && (
        <p className="banner">Heute gibt's noch kein neues Rätsel – hier ist das vom {formatShort(loaded.puzzle.datum)}.</p>
      )}
      {(loaded === null || (loaded && !puzzle)) && <p className="hint">Für dieses Spiel gibt es heute kein Rätsel.</p>}
      {loaded && puzzle && (
        <Component
          puzzle={puzzle}
          state={state ?? def.initialState(puzzle, loaded.puzzle.datum)}
          setState={setState}
          today={today}
          contentDate={loaded.puzzle.datum}
        />
      )}
      {loaded && puzzle && def.isDone(state ?? def.initialState(puzzle, loaded.puzzle.datum)) && (
        <a href="#/" className="btn secondary wide">
          Zur Übersicht &amp; teilen
        </a>
      )}
    </div>
  );
}

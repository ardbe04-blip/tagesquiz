import { useRef, useState, type PointerEvent } from 'react';
import type { GameProps } from '../types';
import type { ZeitstrahlPuzzle } from '../../lib/puzzle';
import {
  check,
  formatJahr,
  lockedSlots,
  MAX_PRUEFUNGEN,
  move,
  solution,
  swap,
  yearsAgo,
  zeitstrahlGrid,
  type ZeitstrahlState
} from './logic';

interface Drag {
  from: number;
  startY: number;
  dy: number;
  moved: boolean;
}

export function Zeitstrahl({ puzzle, state, setState, today }: GameProps<ZeitstrahlPuzzle, ZeitstrahlState>) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const n = state.reihenfolge.length;
  const locked = lockedSlots(state);
  const free = state.reihenfolge.map((_, i) => i).filter((i) => !locked[i]);
  const lastRes = state.pruefungen.at(-1);
  const lastOrder = state.verlauf?.at(-1);
  const versuch = state.pruefungen.length;

  const step = () => {
    const el = listRef.current?.children[0] as HTMLElement | undefined;
    return el ? el.getBoundingClientRect().height + 10 : 72;
  };

  // nächstgelegener freier Platz zur Zielposition beim Ziehen
  const targetSlot = (d: Drag) => {
    const raw = Math.min(n - 1, Math.max(0, d.from + Math.round(d.dy / step())));
    return free.reduce((best, s) => (Math.abs(s - raw) < Math.abs(best - raw) ? s : best), d.from);
  };

  const shiftFor = (k: number): number => {
    if (!drag || !drag.moved || k === drag.from || locked[k]) return 0;
    const t = targetSlot(drag);
    const fi = free.indexOf(drag.from);
    const ti = free.indexOf(t);
    const j = free.indexOf(k);
    if (fi < ti && j > fi && j <= ti) return (free[j - 1] - k) * step();
    if (ti < fi && j >= ti && j < fi) return (free[j + 1] - k) * step();
    return 0;
  };

  const onDown = (e: PointerEvent<HTMLLIElement>, i: number) => {
    if (state.fertig || locked[i]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ from: i, startY: e.clientY, dy: 0, moved: false });
  };
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    if (!drag) return;
    const dy = e.clientY - drag.startY;
    setDrag({ ...drag, dy, moved: drag.moved || Math.abs(dy) > 8 });
  };
  const onUp = (i: number) => {
    if (!drag) return;
    if (drag.moved) {
      setState(move(state, drag.from, targetSlot(drag)));
      setSelected(null);
    } else if (selected === null) {
      setSelected(i);
    } else if (selected === i) {
      setSelected(null);
    } else {
      setState(swap(state, selected, i));
      setSelected(null);
    }
    setDrag(null);
  };

  const sol = solution(puzzle);

  return (
    <div className="stack">
      <p className="hint">
        {state.fertig
          ? state.geloest
            ? `🎉 Richtig sortiert – im ${versuch}. Versuch!`
            : '😅 Diesmal nicht. So wäre es richtig:'
          : selected !== null
            ? 'Jetzt ein zweites Ereignis antippen zum Tauschen.'
            : 'Älteste oben. Ziehen oder zwei Ereignisse nacheinander antippen.'}
      </p>
      <div className="timeline-wrap">
        <div className="timeline-axis" aria-hidden="true">
          <span>früher</span>
          <span>später</span>
        </div>
        <ol className="timeline" ref={listRef}>
          {(state.fertig && !state.geloest ? sol : state.reihenfolge).map((ev, k) => {
            const e = puzzle.ereignisse[ev];
            const isLocked = locked[k];
            const wasWrong = !state.fertig && lastRes && lastOrder && !lastRes[k] && lastOrder[k] === ev;
            const dragging = drag?.moved && drag.from === k;
            let cls = 'event';
            if (state.fertig) cls += state.geloest || state.reihenfolge[k] === ev ? ' right' : ' wrong';
            else if (isLocked) cls += ' right';
            else if (wasWrong) cls += ' wrong';
            if (selected === k) cls += ' selected';
            if (dragging) cls += ' dragging';
            const showYear = state.fertig || isLocked;
            const style = dragging ? { transform: `translateY(${drag!.dy}px) scale(1.03)` } : { transform: `translateY(${shiftFor(k)}px)` };
            return (
              <li
                key={ev}
                className={cls}
                style={style}
                onPointerDown={(pe) => onDown(pe, k)}
                onPointerMove={onMove}
                onPointerUp={() => onUp(k)}
                onPointerCancel={() => setDrag(null)}
                aria-label={e.text}
              >
                <span className="grip" aria-hidden="true">
                  {isLocked ? '🔒' : '⠿'}
                </span>
                <span className="event-text">
                  {e.text}
                  {e.heute && (
                    <em className="today-tag">
                      📅 Heute{showYear ? ` vor ${yearsAgo(e.jahr, today)} Jahren` : ''}
                    </em>
                  )}
                </span>
                <span className={showYear ? 'year shown' : 'year'}>{showYear ? formatJahr(e.jahr) : '????'}</span>
              </li>
            );
          })}
        </ol>
      </div>
      {!state.fertig && (
        <>
          <div className="dots" aria-label={`Versuch ${versuch + 1} von ${MAX_PRUEFUNGEN}`}>
            {Array.from({ length: MAX_PRUEFUNGEN }, (_, i) => (
              <span key={i} className={i < versuch ? 'used' : ''} />
            ))}
          </div>
          <button className="btn primary" onClick={() => { setSelected(null); setState(check(state, puzzle)); }}>
            Prüfen ({versuch + 1}/{MAX_PRUEFUNGEN})
          </button>
          {lastRes && <p className="hint small">🔒 Grüne Plätze stimmen und bleiben stehen. Rote müssen noch umsortiert werden.</p>}
        </>
      )}
      {state.fertig && <pre className="result-grid">{zeitstrahlGrid(state)}</pre>}
    </div>
  );
}

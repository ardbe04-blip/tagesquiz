import { useCallback, useEffect, useState } from 'react';
import { berlinDateKey, type DateKey } from './lib/date';
import { loadPuzzleFor, type LoadedPuzzle } from './lib/content';
import { addPlayDay, loadSave, setGameState, writeSave, type SaveData, type Theme } from './lib/storage';
import { computeStreak } from './lib/streak';
import { findGame } from './games/registry';
import { Home } from './pages/Home';
import { GamePage } from './pages/GamePage';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';
import { Quellen } from './pages/Quellen';

function useHashRoute(): string {
  const get = () => window.location.hash.replace(/^#/, '') || '/';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => {
      setRoute(get());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'auto') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

export function App() {
  const route = useHashRoute();
  const [today, setToday] = useState<DateKey>(() => berlinDateKey());
  const [loaded, setLoaded] = useState<LoadedPuzzle | null | undefined>(undefined);
  const [save, setSave] = useState<SaveData>(loadSave);

  // Tageswechsel (Mitternacht deutscher Zeit) erkennen – auch wenn die App offen bleibt
  useEffect(() => {
    const id = setInterval(() => {
      const now = berlinDateKey();
      setToday((t) => (t === now ? t : now));
    }, 15_000);
    const onVisible = () => setToday(berlinDateKey());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoaded(undefined);
    loadPuzzleFor(today).then((p) => !cancelled && setLoaded(p ?? null));
    return () => {
      cancelled = true;
    };
  }, [today]);

  useEffect(() => applyTheme(save.theme), [save.theme]);

  const update = useCallback((fn: (s: SaveData) => SaveData) => {
    setSave((prev) => {
      const next = fn(prev);
      writeSave(next);
      return next;
    });
  }, []);

  const streak = computeStreak(save.spieltage, today);
  const contentDate = loaded?.puzzle.datum;

  const setGame = (gameId: string, state: unknown) => {
    if (!contentDate) return;
    const def = findGame(gameId);
    update((s) => {
      let next = setGameState(s, contentDate, gameId, state);
      if (def?.isDone(state)) next = addPlayDay(next, today);
      return next;
    });
  };

  const cycleTheme = () => {
    const order: Theme[] = ['auto', 'hell', 'dunkel'];
    update((s) => ({ ...s, theme: order[(order.indexOf(s.theme) + 1) % order.length] }));
  };

  let page;
  if (route === '/impressum') page = <Impressum />;
  else if (route === '/datenschutz') page = <Datenschutz />;
  else if (route === '/quellen') page = <Quellen />;
  else if (route.startsWith('/spiel/')) {
    const def = findGame(route.slice('/spiel/'.length));
    page = def ? (
      <GamePage
        def={def}
        loaded={loaded}
        today={today}
        state={contentDate ? save.spiele[contentDate]?.[def.id] : undefined}
        setState={(s) => setGame(def.id, s)}
      />
    ) : (
      <Home loaded={loaded} today={today} save={save} streak={streak} theme={save.theme} onTheme={cycleTheme} />
    );
  } else page = <Home loaded={loaded} today={today} save={save} streak={streak} theme={save.theme} onTheme={cycleTheme} />;

  return <div className="app">{page}</div>;
}

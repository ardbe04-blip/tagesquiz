import { useEffect, useState, type CSSProperties } from 'react';
import { GAMES } from '../games/registry';
import type { LoadedPuzzle } from '../lib/content';
import { countdown, formatLong, formatShort, type DateKey } from '../lib/date';
import { buildShareText, copyText } from '../lib/share';
import type { SaveData, Theme } from '../lib/storage';
import { TIKTOK_NAME, TIKTOK_URL } from '../config';
import { Footer } from './Footer';

interface Props {
  loaded: LoadedPuzzle | null | undefined;
  today: DateKey;
  save: SaveData;
  streak: number;
  theme: Theme;
  onTheme: () => void;
}

const THEME_ICON: Record<Theme, string> = { auto: '🌓', hell: '☀️', dunkel: '🌙' };
const THEME_LABEL: Record<Theme, string> = { auto: 'Design: automatisch', hell: 'Design: hell', dunkel: 'Design: dunkel' };

function Countdown() {
  const [t, setT] = useState(() => countdown());
  useEffect(() => {
    const id = setInterval(() => setT(countdown()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="countdown">{t}</span>;
}

export function Home({ loaded, today, save, streak, theme, onTheme }: Props) {
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const contentDate = loaded?.puzzle.datum;
  const states: Record<string, unknown> = (contentDate && save.spiele[contentDate]) || {};

  const cards = GAMES.map((g) => {
    const puzzle = loaded ? g.getPuzzle(loaded.puzzle) : undefined;
    const state = states[g.id];
    const done = puzzle !== undefined && state !== undefined && g.isDone(state);
    const started = !done && state !== undefined;
    return { g, puzzle, state, done, started };
  });
  const anyDone = cards.some((c) => c.done);

  const share = async () => {
    const lines = cards.filter((c) => c.puzzle).map((c) => c.g.shareLine(c.done ? c.state : undefined, c.puzzle));
    const url = window.location.origin + window.location.pathname;
    const ok = await copyText(buildShareText(today, lines, streak, url));
    setCopied(ok ? 'ok' : 'fail');
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="page home">
      <header className="home-header">
        <div className="logo" aria-label="TagesQuiz">
          <span className="logo-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="logo-text">
            Tages<b>Quiz</b>
          </span>
        </div>
        <button className="icon-btn" onClick={onTheme} aria-label={THEME_LABEL[theme]} title={THEME_LABEL[theme]}>
          {THEME_ICON[theme]}
        </button>
      </header>

      <div className="today-row">
        <span className="date">{formatLong(today)}</span>
        <span className={`streak${streak > 0 ? ' hot' : ''}`} title="Tage in Folge gespielt">
          🔥 {streak} {streak === 1 ? 'Tag' : 'Tage'}
        </span>
      </div>

      {loaded?.fallback && (
        <p className="banner">Für heute gibt's noch keine neuen Rätsel – hier sind die vom {formatShort(loaded.puzzle.datum)}.</p>
      )}
      {loaded === null && <p className="banner">Noch keine Rätsel vorhanden.</p>}

      <ul className="cards">
        {cards.map(({ g, puzzle, state, done, started }, i) => (
          <li key={g.id} style={{ '--accent': `var(--${g.farbe})`, animationDelay: `${i * 70}ms` } as CSSProperties} className="card-li pop-in">
            <a className={`card${done ? ' done' : ''}${!puzzle ? ' disabled' : ''}`} href={puzzle ? `#/spiel/${g.id}` : undefined}>
              <span className="card-emoji" aria-hidden="true">
                {g.emoji}
              </span>
              <span className="card-body">
                <span className="card-cat">{g.kategorie}</span>
                <span className="card-title">{g.titel}</span>
                <span className="card-status">
                  {!puzzle
                    ? loaded === undefined
                      ? 'lädt …'
                      : 'heute kein Rätsel'
                    : done
                      ? g.summary(state, puzzle)
                      : started
                        ? 'angefangen – weiterspielen'
                        : g.beschreibung}
                </span>
              </span>
              <span className={`card-badge${done ? ' ok' : ''}`}>{done ? '✓' : started ? '…' : 'Los'}</span>
            </a>
          </li>
        ))}
      </ul>

      <button className="btn primary wide share" onClick={share} disabled={!anyDone}>
        {copied === 'ok' ? '✅ Kopiert – jetzt einfügen!' : copied === 'fail' ? 'Kopieren hat nicht geklappt' : '📋 Alle Ergebnisse teilen'}
      </button>
      {!anyDone && <p className="hint small center">Spiel erst eine Runde, dann kannst du teilen.</p>}

      <div className="next">
        <span>Neue Rätsel in</span>
        <Countdown />
      </div>

      <a className="tiktok" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">🎵</span> Folg {TIKTOK_NAME} auf TikTok
      </a>

      <Footer />
    </div>
  );
}

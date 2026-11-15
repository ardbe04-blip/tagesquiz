import type { ReactNode } from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <a href="#/impressum">Impressum</a>
      <a href="#/datenschutz">Datenschutz</a>
      <a href="#/quellen">Quellen &amp; Lizenzen</a>
    </footer>
  );
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page legal">
      <header className="game-header">
        <a href="#/" className="back" aria-label="Zurück zur Übersicht">
          ←
        </a>
        <div>
          <h1>{title}</h1>
        </div>
      </header>
      <article className="prose">{children}</article>
      <Footer />
    </div>
  );
}

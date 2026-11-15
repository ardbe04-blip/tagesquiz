import { LegalPage } from './Footer';

export function Quellen() {
  return (
    <LegalPage title="Quellen & Lizenzen">
      <h2>Kartendaten</h2>
      <p>
        Länderumrisse: <strong>Natural Earth</strong> (naturalearthdata.com) – gemeinfrei (Public Domain), aufbereitet über das Paket{' '}
        <strong>world-atlas</strong> von Mike Bostock (ISC-Lizenz).
      </p>

      <h2>Flaggen</h2>
      <p>
        <strong>flag-icons</strong> von Panayiotis Lipiridis und Mitwirkenden – MIT-Lizenz.
      </p>

      <h2>Länderdaten</h2>
      <p>
        Einwohnerzahlen: gerundete Schätzwerte (Stand ca. 2024) nach <strong>UN World Population Prospects 2024</strong>, © Vereinte
        Nationen, Lizenz CC BY 3.0 IGO, teils ergänzt um Angaben nationaler Statistikämter. Flächen: <strong>CIA World Factbook</strong>{' '}
        (gemeinfrei). Kontinent-Zuordnung, Binnenland-Angabe und Mittelpunkt-Koordinaten: eigene Zusammenstellung. Alle Werte gerundet.
      </p>

      <h2>Schriften</h2>
      <p>
        <strong>Fredoka</strong> und <strong>Nunito</strong> – SIL Open Font License 1.1, lokal eingebunden über Fontsource.
      </p>

      <h2>Software</h2>
      <p>React (MIT), Vite (MIT), vite-plugin-pwa (MIT), Workbox (MIT), d3-geo und topojson-client (ISC, nur beim Bauen).</p>

      <h2>Nachrichten</h2>
      <p>Die Quelle jeder News-Frage steht direkt bei der Auflösung (Medium und Datum).</p>
    </LegalPage>
  );
}

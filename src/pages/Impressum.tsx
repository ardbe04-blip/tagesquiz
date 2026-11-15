import { LegalPage } from './Footer';

// ⚠️ Alle Angaben in [eckigen Klammern] durch deine echten Daten ersetzen.
export function Impressum() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        [Vorname Nachname]
        <br />
        [Straße Hausnummer]
        <br />
        [PLZ Ort]
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: [deine@e-mail.de]
        <br />
        [optional: Telefon]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        [Vorname Nachname]
        <br />
        [Anschrift wie oben]
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Die Rätsel werden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität kann trotzdem keine Gewähr
        übernommen werden. Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>
    </LegalPage>
  );
}

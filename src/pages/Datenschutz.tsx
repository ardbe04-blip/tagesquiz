import { LegalPage } from './Footer';

// ⚠️ Angaben in [eckigen Klammern] ersetzen. Die Beschreibung entspricht dem, was die App technisch tut.
export function Datenschutz() {
  return (
    <LegalPage title="Datenschutz">
      <p className="lead">Kurz gesagt: TagesQuiz kennt dich nicht. Es gibt keine Konten, keine Cookies, kein Tracking und keine Werbung.</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        [Vorname Nachname], [Straße Hausnummer], [PLZ Ort], E-Mail: [deine@e-mail.de]
      </p>

      <h2>2. Was in deinem Browser gespeichert wird</h2>
      <p>
        Damit du sehen kannst, was du heute schon gespielt hast, und deine Serie zählt, speichert die App deine Spielstände, die Tage,
        an denen du gespielt hast, und deine Einstellung für Hell/Dunkel im <strong>lokalen Speicher (localStorage) deines Browsers</strong>.
        Außerdem legt der Browser eine Offline-Kopie der App an (Service Worker), damit sie auch ohne Internet funktioniert.
      </p>
      <p>
        Diese Daten bleiben <strong>ausschließlich auf deinem Gerät</strong>. Sie werden nicht an uns oder Dritte übertragen und wir
        können sie nicht einsehen. Die Speicherung ist für die von dir gewünschte Funktion unbedingt erforderlich
        (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst sie jederzeit löschen, indem du in deinem Browser die Websitedaten für diese Seite
        entfernst.
      </p>

      <h2>3. Keine Cookies, kein Tracking, keine externen Dienste</h2>
      <p>
        Wir setzen keine Cookies, keine Analyse- oder Werbedienste und keine Social-Media-Plugins ein. Schriften und alle
        anderen Dateien werden von derselben Adresse geladen wie die App selbst; es werden keine Inhalte von fremden Servern
        (z. B. Google Fonts) nachgeladen. Wenn du einen Link zu einer anderen Seite antippst (z. B. TikTok oder eine Nachrichtenquelle),
        gelten dort deren Datenschutzbestimmungen.
      </p>

      <h2>4. Hosting bei GitHub Pages</h2>
      <p>
        Die Seite wird über GitHub Pages bereitgestellt, einen Dienst der GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco,
        CA 94107, USA. Beim Aufruf verarbeitet GitHub technisch notwendige Verbindungsdaten (insbesondere deine IP-Adresse,
        Zeitpunkt des Abrufs, abgerufene Datei, Browserkennung), um die Seite auszuliefern und die Sicherheit des Dienstes zu gewährleisten.
        Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und kostenlosen Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO).
        Dabei können Daten in die USA übertragen werden; GitHub ist nach dem EU-US Data Privacy Framework zertifiziert.
        Wir selbst erhalten keine Zugriffsdaten. Weitere Informationen:{' '}
        <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">
          Datenschutzerklärung von GitHub
        </a>
        .
      </p>

      <h2>5. Teilen-Funktion</h2>
      <p>
        „Alle Ergebnisse teilen“ kopiert nur einen Text in deine Zwischenablage. Es wird nichts gesendet – du entscheidest selbst, wo du
        ihn einfügst.
      </p>

      <h2>6. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit
        (Art. 15–21 DSGVO) sowie das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Da wir keine personenbezogenen
        Daten von dir speichern, können wir zu Daten auf deinem Gerät keine Auskunft geben – du kannst sie aber selbst jederzeit löschen.
      </p>

      <p className="small">Stand: [Monat Jahr]</p>
    </LegalPage>
  );
}

# tagesquiz
Baue eine Web-App namens „TagesQuiz“: eine Sammlung täglicher Mini-Spiele zu News, Geschichte und Wissen, aufgebaut wie die App GeoTrivia (ein Startbildschirm mit mehreren Tagesspielen, jeden Tag neue Rätsel, Serien, teilbare Ergebnisse). Kopiere keine Namen, Texte oder Designs von GeoTrivia – nur das Prinzip. Sprache der App: Deutsch. Zielgruppe: junge Leute von TikTok, fast nur am Handy.

HARTE VORGABEN
- Keine laufenden Kosten: statische Seite ohne Server und ohne Datenbank, Hosting kostenlos über GitHub Pages. Richte das Deployment per GitHub Actions ein.
- Rechtlich sauber für Deutschland: keine Nutzerkonten, keine Cookies, kein Tracking, keine Analytics, keine Werbung, keine externen Anfragen. Schriften selbst hosten (keine Google-Fonts-Einbindung über Google-Server). Spielstand nur in localStorage.
- Nur Daten mit freier Lizenz verwenden (z. B. Natural Earth für Ländergrenzen = gemeinfrei, flag-icons für Flaggen = MIT). Lege eine Datei LIZENZEN.md an, die jede Quelle mit Lizenz auflistet, und zeige die nötigen Quellenangaben in der App.
- Seiten „Impressum“ und „Datenschutz“ mit Platzhaltern, die ich ausfülle. Die Datenschutzerklärung soll ehrlich beschreiben: nur lokale Speicherung im Browser, keine Weitergabe.
- Schnell fertig: Tech-Stack Vite + TypeScript + React, keine unnötigen Bibliotheken. Als PWA (installierbar auf dem Handy, funktioniert offline).

STARTBILDSCHIRM
- Logo „TagesQuiz“, Datum, Gesamt-Serie (Tage in Folge gespielt).
- Karten für jedes Tagesspiel mit Status (offen / gespielt + Ergebnis).
- Button „Alle Ergebnisse teilen“: kopiert einen Text mit Emoji-Raster in die Zwischenablage (für WhatsApp/TikTok), z. B.
  TagesQuiz 15.11.2026
  📰 4/5  📜 ✅  🌍 3 Versuche
  🔥 Serie: 6 Tage
- Countdown bis zu den nächsten Rätseln (Mitternacht deutscher Zeit).
- Unten: „Folg TagesNews auf TikTok“, Impressum, Datenschutz.

DIE SPIELE (Version 1 = diese drei, sauber umgesetzt)
1. „Schlagzeile“ (News): 5 Multiple-Choice-Fragen zu aktuellen Nachrichten. Nach jeder Antwort kurze Erklärung + Quellenangabe (Medium und Datum). Ergebnis als 🟩🟥-Reihe.
2. „Zeitstrahl“ (Geschichte): 5 historische Ereignisse per Drag & Drop (und alternativ per Antippen) in die richtige zeitliche Reihenfolge bringen. Nach dem Prüfen: richtige Plätze grün, falsche rot, Jahreszahlen werden aufgedeckt. 3 Versuche. Ein Ereignis jeden Tag passt zum heutigen Datum („Heute vor … Jahren“).
3. „Länder-Detektiv“ (Wissen): Finde das gesuchte Land in max. 6 Versuchen. Eingabe mit Autovervollständigung (alle Länder auf Deutsch). Nach jedem Tipp eine Zeile mit farbigen Feldern: Kontinent, Einwohner (Pfeil höher/niedriger), Fläche (Pfeil), Binnenland ja/nein, Entfernung in km + Himmelsrichtung. Grün = gleich, Gelb = nah dran, Grau = falsch. Am Ende Umriss und Flagge des Landes zeigen.
Plane den Code so, dass ich später weitere Spiele ergänzen kann (z. B. „Gruppen“: 16 Begriffe in 4 Gruppen sortieren; „Rangliste“: Länder Kategorien zuordnen).

INHALTE
- Tagesrätsel liegen als JSON-Dateien in /content/JJJJ-MM-TT.json (ein klar dokumentiertes Format, damit ich jeden Tag nur eine Datei hinzufügen muss). Fehlt eine Datei, wird das letzte verfügbare Rätsel gezeigt.
- Länderdaten (deutsche Namen, Kontinent, Einwohner, Fläche, Binnenland, Koordinaten) als eigene JSON-Datei mit Quellenangabe.
- Erstelle Inhalte für 7 Tage ab heute als Beispiel. News-Fragen nur als klar markierte Platzhalter – die echten News schreibe ich täglich selbst. Geschichts- und Länderrätsel bitte mit echten, überprüften Fakten.
- Schreibe eine kurze Anleitung (ANLEITUNG.md) auf Deutsch, wie ich ein neues Tagesrätsel hinzufüge und veröffentliche – möglichst nur über das Handy.

DESIGN
- Mobile-first, große Tippflächen, flüssige kleine Animationen, Hell- und Dunkelmodus.
- Jede Kategorie hat ihre Farbe: News rot, Geschichte gelb/ocker, Wissen blau.
- Eigenständiger Look, modern und verspielt – nicht wie GeoTrivia.

QUALITÄT
- Teste die Spiellogik (Auswertung, Serie, Datumswechsel) mit automatischen Tests.
- Prüfe die Darstellung bei 360 px Breite.
- Gib mir am Ende: den Link zur fertigen Seite, was ich im Impressum eintragen muss, und wie ich ein neues Rätsel veröffentliche.

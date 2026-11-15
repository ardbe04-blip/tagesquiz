# Neues Tagesrätsel hinzufügen – nur mit dem Handy

Jedes Tagesrätsel ist **eine Datei** im Ordner `content/`, benannt nach dem Datum: `content/2026-11-22.json`.
Sobald du sie auf GitHub speicherst, baut GitHub die Seite automatisch neu (dauert ca. 2 Minuten). Fertig.

> Du kannst Dateien auch **im Voraus** anlegen, z. B. für die ganze Woche. Die App zeigt jede Datei erst ab ihrem Datum (Mitternacht deutscher Zeit).
> Fehlt für einen Tag die Datei, zeigt die App das letzte vorhandene Rätsel.

## Schritt für Schritt (im Handy-Browser)

1. Öffne **github.com** im Browser (Chrome/Safari) und melde dich an. Tipp: Im Browser-Menü „Desktop-Website“ aktivieren, dann sind alle Knöpfe sichtbar.
2. Geh in dein Repository **tagesquiz** → Ordner **content**.
3. Am einfachsten: Öffne die Datei vom Vortag → Stift-Symbol ✏️ → **alles markieren und kopieren** → zurück.
4. Tippe auf **„Add file“ → „Create new file“**.
5. Als Namen eintippen: `2026-11-22.json` (Datum im Format JJJJ-MM-TT).
6. Inhalt einfügen und anpassen (siehe unten). **Wichtig:** `"datum"` muss zum Dateinamen passen.
7. **„Commit changes…“** → nochmal **„Commit changes“**.
8. Nach ca. 2 Minuten ist das Rätsel online. Ob alles geklappt hat, siehst du im Reiter **„Actions“**: grüner Haken = online, rotes ❌ = Fehler (siehe unten).

Alternative: In der **GitHub-App** kannst du vorhandene Dateien bearbeiten, aber keine neuen anlegen – lege dafür im Voraus Dateien an oder nutze den Browser.

## Aufbau einer Datei

```json
{
  "datum": "2026-11-22",
  "schlagzeile": {
    "fragen": [
      {
        "frage": "Welches Land hat diese Woche … ?",
        "antworten": ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
        "richtig": 0,
        "erklaerung": "Kurz in 1–2 Sätzen, warum A stimmt.",
        "quelle": { "medium": "tagesschau.de", "datum": "21.11.2026", "url": "https://www.tagesschau.de/..." }
      }
    ]
  },
  "zeitstrahl": {
    "ereignisse": [
      { "text": "Ereignis, das am 22. November passiert ist", "jahr": 1963, "tag": "11-22", "heute": true },
      { "text": "Zweites Ereignis", "jahr": 1492 },
      { "text": "Drittes Ereignis", "jahr": 1789 },
      { "text": "Viertes Ereignis", "jahr": 1990 },
      { "text": "Fünftes Ereignis", "jahr": 2007 }
    ]
  },
  "laenderdetektiv": { "land": "JP" }
}
```

### Schlagzeile (News)
- **5 Fragen** (es gehen auch mehr oder weniger).
- `"richtig"`: Nummer der richtigen Antwort, **gezählt ab 0** → `0` = erste, `1` = zweite, `2` = dritte, `3` = vierte. Die App zeigt die Antworten in der Reihenfolge der Datei – setz die richtige also nicht immer an dieselbe Stelle.
- `"quelle"`: `"medium"` und `"datum"` sind Pflicht, `"url"` ist optional (wird dann als Link angezeigt).
- Entferne die Zeile `"platzhalter": true`, sobald du echte Fragen schreibst – sonst erscheint ein Hinweis-Banner.

### Zeitstrahl (Geschichte)
- **5 Ereignisse**, jedes mit eigenem Jahr (keine zwei im selben Jahr). Die Reihenfolge in der Datei ist egal – die App mischt.
- Genau **ein** Ereignis soll am heutigen Kalendertag passiert sein: dort `"tag": "MM-TT"` und `"heute": true` eintragen. Die App zeigt dann „Heute vor … Jahren“.
- Jahre vor Christus als negative Zahl, z. B. `-44`.

### Länder-Detektiv (Wissen)
- `"land"`: zweistelliger Ländercode (ISO), z. B. `DE`, `FR`, `JP`, `BR`, `KE`. Alle Codes stehen in `src/data/laender.json` (Feld `"iso2"`).
- Tipp: Keine Mini-Staaten (Vatikan, Monaco, Nauru …) – für die gibt es teils keinen Umriss.

## Wenn etwas schiefgeht
- Im Reiter **Actions** ist ein rotes ❌ → antippen → Schritt „Tests“ öffnen. Dort steht auf Deutsch, was in welcher Datei falsch ist (z. B. `"richtig" muss die Nummer der richtigen Antwort sein`).
- Die bisherige Seite bleibt bei einem Fehler online – nichts geht kaputt.
- Häufige Fehler: fehlendes Komma zwischen Einträgen, Komma nach dem letzten Eintrag, „typografische“ Anführungszeichen („ “) statt `"` rund um Felder. Innerhalb von Texten sind „ “ erlaubt.

## Ein weiteres Spiel ergänzen (für später)
1. Neuer Ordner `src/games/<spielname>/` mit `logic.ts` (Regeln, testbar) und einer React-Komponente.
2. In `src/games/<spielname>/index.ts` eine `GameDefinition` exportieren (Titel, Farbe, Emoji, Teilen-Zeile …) – Vorbild: `src/games/laender/index.ts`.
3. In `src/games/registry.ts` in die Liste `GAMES` eintragen → erscheint automatisch als Karte, im Teilen-Text und mit Serie.
4. Inhalte unter dem Schlüssel des Spiels (z. B. `"gruppen": { … }`) in die Tagesdateien schreiben und in `src/lib/puzzle.ts` eine Prüfung ergänzen.

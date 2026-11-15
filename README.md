# TagesQuiz

Tägliche Mini-Spiele zu News, Geschichte und Wissen – als statische Web-App (PWA) auf GitHub Pages.
Keine Server, keine Datenbank, keine Cookies, kein Tracking. Spielstand nur im `localStorage`.

- **Neues Rätsel veröffentlichen:** siehe [ANLEITUNG.md](ANLEITUNG.md)
- **Quellen & Lizenzen:** siehe [LIZENZEN.md](LIZENZEN.md)
- **Impressum/Datenschutz ausfüllen:** `src/pages/Impressum.tsx`, `src/pages/Datenschutz.tsx` (alles in `[eckigen Klammern]`)
- **TikTok-Link:** `src/config.ts`
- **Ursprüngliche Aufgabenbeschreibung:** siehe [AUFGABE.md](AUFGABE.md)

## Aufbau

```
content/JJJJ-MM-TT.json     Tagesrätsel (eine Datei pro Tag)
src/data/laender.json       Länderdaten mit Quellenangabe
src/games/<spiel>/          je Spiel: logic.ts (Regeln) + Komponente + index.ts (Definition)
src/games/registry.ts       Liste aller Spiele → Startbildschirm, Teilen, Serie
src/lib/                    Datum (Berlin), Serie, Speicher, Laden/Prüfen der Tagesdateien
scripts/prepare-assets.mjs  erzeugt beim Bauen Flaggen und Länderumrisse in public/
tests/                      automatische Tests (Vitest)
.github/workflows/deploy.yml  testet, baut und veröffentlicht bei jedem Push auf main
```

## Lokal entwickeln (optional, braucht Node.js 20+)

```bash
npm install
npm test
npm run dev
```

## Erste Veröffentlichung

1. Repository auf GitHub anlegen (öffentlich, z. B. `tagesquiz`) und diesen Ordner auf den Branch `main` pushen.
2. Der Workflow aktiviert GitHub Pages automatisch. Falls nicht: *Settings → Pages → Source: „GitHub Actions“*.
3. Die Seite ist dann unter `https://<benutzername>.github.io/tagesquiz/` erreichbar.

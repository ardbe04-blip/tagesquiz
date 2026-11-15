# Quellen und Lizenzen

Alle verwendeten Daten und Bibliotheken stehen unter freien Lizenzen. Die Quellenangaben werden in der App unter **„Quellen & Lizenzen“** angezeigt.

| Was | Quelle | Lizenz | Wo genutzt |
|---|---|---|---|
| Länderumrisse | [Natural Earth](https://www.naturalearthdata.com/) (Admin 0, 1:50 Mio.) | Public Domain (gemeinfrei) | Umriss am Ende des Länder-Detektivs |
| Aufbereitung der Umrisse | [world-atlas](https://github.com/topojson/world-atlas) von Mike Bostock | ISC | nur beim Bauen |
| Flaggen | [flag-icons](https://github.com/lipis/flag-icons) von Panayiotis Lipiridis u. a. | MIT | Flagge am Ende des Länder-Detektivs |
| Einwohnerzahlen | [UN World Population Prospects 2024](https://population.un.org/wpp/), teils nationale Statistikämter (Kosovo, Moldau: Volkszählungen 2024) | CC BY 3.0 IGO (UN) | `src/data/laender.json` |
| Flächen | [CIA World Factbook](https://www.cia.gov/the-world-factbook/) | Public Domain (Werk der US-Regierung) | `src/data/laender.json` |
| Kontinent, Binnenland, Mittelpunkt-Koordinaten | eigene Zusammenstellung | – | `src/data/laender.json` |
| Schrift „Fredoka“ | Milena Brandão / Hafontia, über [Fontsource](https://fontsource.org/) | SIL Open Font License 1.1 | Überschriften |
| Schrift „Nunito“ | Vernon Adams, Cyreal, Jacques Le Bailly, über Fontsource | SIL Open Font License 1.1 | Fließtext |
| React, React DOM | Meta Platforms, Inc. | MIT | App |
| Vite, @vitejs/plugin-react | Vite-Team | MIT | Bauen |
| vite-plugin-pwa, Workbox | Anthony Fu u. a., Google | MIT | Offline-Funktion |
| d3-geo, topojson-client | Mike Bostock | ISC | nur beim Bauen |
| Vitest, TypeScript | Vitest-Team, Microsoft | MIT, Apache-2.0 | nur Entwicklung |

## Hinweise

- **Einwohnerzahlen** sind gerundete Schätzwerte (Stand ca. 2024). Bei der UN-Lizenz CC BY 3.0 IGO ist die Nennung der Quelle Pflicht – sie steht in der App und in `laender.json`.
- **Natural Earth** verlangt keine Nennung, sie wird trotzdem aufgeführt.
- **Nachrichten-Fragen**: Die Quelle (Medium und Datum) steht bei jeder Frage. Schreib die Fragen und Erklärungen in eigenen Worten und übernimm keine Texte oder Bilder aus den Artikeln.
- Die **Zeitstrahl-Ereignisse** sind allgemein bekannte historische Fakten in eigener Formulierung.

// Erzeugt beim Bauen:
//   public/flags/<iso2>.svg     – kopiert aus dem Paket flag-icons (MIT)
//   public/outlines/<iso2>.svg  – Länderumriss aus world-atlas (Natural Earth, gemeinfrei)
// Läuft automatisch vor `npm run build` und `npm run dev`.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { feature } from 'topojson-client';
import { geoAzimuthalEqualArea, geoPath, geoArea, geoCentroid, geoDistance } from 'd3-geo';

const root = process.cwd();
const { laender } = JSON.parse(readFileSync(join(root, 'src/data/laender.json'), 'utf8'));
const flagDir = join(root, 'public/flags');
const outlineDir = join(root, 'public/outlines');
mkdirSync(flagDir, { recursive: true });
mkdirSync(outlineDir, { recursive: true });

// ---------- Flaggen ----------
const flagSrc = join(root, 'node_modules/flag-icons/flags/4x3');
let flags = 0;
for (const land of laender) {
  const src = join(flagSrc, `${land.iso2.toLowerCase()}.svg`);
  if (existsSync(src)) {
    copyFileSync(src, join(flagDir, `${land.iso2.toLowerCase()}.svg`));
    flags++;
  } else {
    console.warn(`[flaggen] keine Flagge für ${land.iso2} (${land.name})`);
  }
}

// ---------- Umrisse ----------
const topo = JSON.parse(readFileSync(join(root, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const features = feature(topo, topo.objects.countries).features;
const pad = (id) => (id == null ? '' : String(id).padStart(3, '0'));

function polygonsOf(geom) {
  if (!geom) return [];
  if (geom.type === 'Polygon') return [geom.coordinates];
  if (geom.type === 'MultiPolygon') return geom.coordinates;
  return [];
}
function sphArea(g) {
  const a = geoArea(g);
  return a > 2 * Math.PI ? 4 * Math.PI - a : a;
}

let outlines = 0;
for (const land of laender) {
  const f =
    features.find((x) => land.isoNum && pad(x.id) === land.isoNum) ??
    features.find((x) => x.properties && x.properties.name === land.nameEn);
  if (!f) {
    console.warn(`[umrisse] kein Umriss für ${land.iso2} (${land.name})`);
    continue;
  }
  const center = [land.lon, land.lat];
  const parts = polygonsOf(f.geometry).map((coords) => {
    const g = { type: 'Polygon', coordinates: coords };
    return { coords, area: sphArea(g), dist: geoDistance(geoCentroid(g), center) * 6371 };
  });
  if (parts.length === 0) continue;
  // Weit entfernte Überseegebiete (z. B. Französisch-Guayana, Hawaii) weglassen,
  // damit das Hauptland gut erkennbar bleibt.
  const maxArea = Math.max(...parts.map((p) => p.area));
  const thr = Math.max(1000, 1.3 * Math.sqrt(land.flaeche));
  let kept = parts.filter((p) => p.dist < thr || (p.area >= 0.1 * maxArea && p.dist < 3 * thr));
  if (kept.length === 0) kept = [parts.find((p) => p.area === maxArea)];
  const shape = { type: 'MultiPolygon', coordinates: kept.map((p) => p.coords) };

  const projection = geoAzimuthalEqualArea().rotate([-land.lon, -land.lat]).fitExtent([[8, 8], [192, 192]], shape);
  const d = geoPath(projection).digits(1)(shape);
  if (!d) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="${d}" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  writeFileSync(join(outlineDir, `${land.iso2.toLowerCase()}.svg`), svg);
  outlines++;

  // Plausibilitätsprüfung der Koordinaten in laender.json
  const mainPart = parts.find((p) => p.area === maxArea);
  const off = geoDistance(geoCentroid({ type: 'Polygon', coordinates: mainPart.coords }), center) * 6371;
  if (off > Math.max(800, Math.sqrt(land.flaeche))) {
    console.warn(`[umrisse] Koordinaten von ${land.name} liegen ${Math.round(off)} km vom Umriss-Mittelpunkt entfernt`);
  }
}

console.log(`Assets: ${flags} Flaggen, ${outlines} Umrisse für ${laender.length} Länder.`);

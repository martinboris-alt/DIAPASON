/**
 * Genera emblemas SVG estilizados (heráldicos) para cada marca de piano.
 * NO usa logos reales (por copyright), crea seals inspirados en cada marca.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/marcas");
fs.mkdirSync(OUT, { recursive: true });

const marcas = [
  { file: "steinway",    initials: "S&S",  ornamento: "lyre",    color: "#D4AF37", bg: "#1A1200" },
  { file: "bosendorfer", initials: "B",    ornamento: "crown",   color: "#B8560C", bg: "#1F0E06" },
  { file: "bechstein",   initials: "CB",   ornamento: "cross",   color: "#5D7AAD", bg: "#0A1018" },
  { file: "bluthner",    initials: "B",    ornamento: "star",    color: "#C89B3B", bg: "#1A1400" },
  { file: "fazioli",     initials: "F",    ornamento: "rosette", color: "#B85438", bg: "#1A0A08" },
  { file: "yamaha",      initials: "Y",    ornamento: "tuning",  color: "#8064B8", bg: "#140818" },
  { file: "kawai",       initials: "K",    ornamento: "leaf",    color: "#4E82BA", bg: "#081018" },
  { file: "pleyel",      initials: "P",    ornamento: "fleur",   color: "#9B3F7C", bg: "#180818" },
  { file: "erard",       initials: "É",    ornamento: "scroll",  color: "#8B6A45", bg: "#140E08" },
  { file: "baldwin",     initials: "B",    ornamento: "eagle",   color: "#A0632E", bg: "#1A0E04" },
];

const ornamentos = {
  // Lira (Steinway)
  lyre: `
    <path d="M100 40 Q85 55 82 75 Q80 95 100 100 Q120 95 118 75 Q115 55 100 40Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <line x1="90" y1="55" x2="90" y2="90" stroke="COLOR" stroke-width="0.8"/>
    <line x1="100" y1="50" x2="100" y2="95" stroke="COLOR" stroke-width="0.8"/>
    <line x1="110" y1="55" x2="110" y2="90" stroke="COLOR" stroke-width="0.8"/>
  `,
  // Corona (Bösendorfer imperial)
  crown: `
    <path d="M75 65 L85 45 L95 60 L105 40 L115 60 L125 45 L130 65 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <circle cx="85" cy="45" r="2" fill="COLOR"/>
    <circle cx="105" cy="40" r="2" fill="COLOR"/>
    <circle cx="125" cy="45" r="2" fill="COLOR"/>
    <line x1="75" y1="75" x2="130" y2="75" stroke="COLOR" stroke-width="1"/>
  `,
  // Cruz (Bechstein – tradición alemana/protestante)
  cross: `
    <line x1="100" y1="45" x2="100" y2="100" stroke="COLOR" stroke-width="2"/>
    <line x1="80" y1="65" x2="120" y2="65" stroke="COLOR" stroke-width="2"/>
    <circle cx="100" cy="65" r="5" fill="none" stroke="COLOR" stroke-width="1"/>
  `,
  // Estrella (Blüthner - Golden Tone)
  star: `
    <path d="M100 45 L104 62 L122 62 L108 73 L113 90 L100 80 L87 90 L92 73 L78 62 L96 62 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
  `,
  // Rosetón (Fazioli - italiano refinado)
  rosette: `
    <circle cx="100" cy="70" r="22" fill="none" stroke="COLOR" stroke-width="1"/>
    <circle cx="100" cy="70" r="15" fill="none" stroke="COLOR" stroke-width="0.8"/>
    <circle cx="100" cy="70" r="8"  fill="none" stroke="COLOR" stroke-width="0.6"/>
    <path d="M100 48 L100 92 M78 70 L122 70 M84 54 L116 86 M116 54 L84 86" stroke="COLOR" stroke-width="0.5"/>
  `,
  // Diapasón (Yamaha)
  tuning: `
    <path d="M85 45 L85 70 Q85 85 100 85 Q115 85 115 70 L115 45" fill="none" stroke="COLOR" stroke-width="2"/>
    <line x1="100" y1="85" x2="100" y2="100" stroke="COLOR" stroke-width="2"/>
    <circle cx="100" cy="105" r="3" fill="COLOR"/>
  `,
  // Hoja (Kawai)
  leaf: `
    <path d="M100 45 Q78 55 78 75 Q78 95 100 95 Q122 95 122 75 Q122 55 100 45 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <path d="M100 45 L100 95" stroke="COLOR" stroke-width="0.8"/>
    <path d="M100 60 L87 65 M100 70 L82 75 M100 80 L87 85" stroke="COLOR" stroke-width="0.5"/>
    <path d="M100 60 L113 65 M100 70 L118 75 M100 80 L113 85" stroke="COLOR" stroke-width="0.5"/>
  `,
  // Flor de lis (Pleyel - Francia)
  fleur: `
    <path d="M100 45 Q95 55 92 65 Q98 62 100 70 Q102 62 108 65 Q105 55 100 45 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <path d="M100 65 Q90 75 85 90 Q95 85 100 92 Q105 85 115 90 Q110 75 100 65 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <line x1="78" y1="75" x2="122" y2="75" stroke="COLOR" stroke-width="1.2"/>
  `,
  // Pergamino ornamental (Érard - invención)
  scroll: `
    <path d="M80 60 Q80 50 90 50 L110 50 Q120 50 120 60 L120 90 Q120 100 110 100 L90 100 Q80 100 80 90 Z" fill="none" stroke="COLOR" stroke-width="1.5"/>
    <path d="M88 65 L112 65 M88 75 L112 75 M88 85 L112 85" stroke="COLOR" stroke-width="0.6"/>
  `,
  // Águila (Baldwin - estadounidense)
  eagle: `
    <path d="M100 45 L105 55 L110 50 L115 60 L120 55 L115 70 L125 75 L115 80 L120 95 L100 85 L80 95 L85 80 L75 75 L85 70 L80 55 L85 60 L90 50 L95 55 Z" fill="none" stroke="COLOR" stroke-width="1.2"/>
    <circle cx="100" cy="62" r="2" fill="COLOR"/>
  `,
};

function generateSVG({ initials, ornamento, color, bg }) {
  const orn = ornamentos[ornamento].replace(/COLOR/g, color);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#080808" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Fondo con degradado -->
  <rect x="0" y="0" width="200" height="260" fill="url(#bg)"/>
  <rect x="0" y="0" width="200" height="260" fill="url(#glow)"/>

  <!-- Marco heráldico -->
  <path d="M20 20 L180 20 L180 220 Q180 240 100 252 Q20 240 20 220 Z" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>
  <path d="M26 26 L174 26 L174 218 Q174 234 100 246 Q26 234 26 218 Z" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.25"/>

  <!-- Ornamento central -->
  <g opacity="0.85">${orn}</g>

  <!-- Línea divisoria -->
  <line x1="60" y1="130" x2="140" y2="130" stroke="${color}" stroke-width="0.5" opacity="0.4"/>

  <!-- Iniciales (pequeñas, abajo) -->
  <text x="100" y="165" font-family="Georgia, serif" font-size="32" font-weight="300"
    fill="${color}" text-anchor="middle" letter-spacing="4" opacity="0.95">${initials}</text>

  <!-- Estrellas decorativas -->
  <path d="M50 195 L52 199 L56 200 L52 201 L50 205 L48 201 L44 200 L48 199 Z" fill="${color}" opacity="0.3"/>
  <path d="M150 195 L152 199 L156 200 L152 201 L150 205 L148 201 L144 200 L148 199 Z" fill="${color}" opacity="0.3"/>

  <!-- Banda inferior ornamental -->
  <path d="M60 215 L100 225 L140 215" fill="none" stroke="${color}" stroke-width="0.6" opacity="0.4"/>
</svg>`;
}

for (const m of marcas) {
  const svg = generateSVG(m);
  fs.writeFileSync(path.join(OUT, `${m.file}.svg`), svg);
  console.log(`  ✓ ${m.file}.svg`);
}

console.log(`\n✅ ${marcas.length} emblemas generados en public/images/marcas/`);

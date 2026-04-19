/**
 * Genera retratos SVG artísticos para cada compositor
 * Uso: node scripts/generate-portraits.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/composers");
fs.mkdirSync(OUT, { recursive: true });

const composers = [
  // ── BARROCO ──
  { file: "bach",        initials: "JSB", color: "#C9A84C", bg: "#1a1400", era: "baroque" },
  { file: "bach_cpe",    initials: "CPE", color: "#B89440", bg: "#181200", era: "baroque" },
  { file: "handel",      initials: "GFH", color: "#A08040", bg: "#161000", era: "baroque" },
  { file: "scarlatti",   initials: "DS",  color: "#B87A30", bg: "#180e00", era: "baroque" },
  { file: "couperin",    initials: "FC",  color: "#A89040", bg: "#151000", era: "baroque" },
  { file: "rameau",      initials: "JPR", color: "#C09048", bg: "#1a1200", era: "baroque" },
  { file: "telemann",    initials: "GPT", color: "#B08838", bg: "#180f00", era: "baroque" },
  { file: "purcell",     initials: "HP",  color: "#A07838", bg: "#140e00", era: "baroque" },
  { file: "buxtehude",   initials: "DB",  color: "#988038", bg: "#120e00", era: "baroque" },
  { file: "pachelbel",   initials: "JP",  color: "#A88030", bg: "#150e00", era: "baroque" },
  { file: "froberger",   initials: "JJF", color: "#A88840", bg: "#161000", era: "baroque" },
  { file: "kuhnau",      initials: "JK",  color: "#B08830", bg: "#180f00", era: "baroque" },
  { file: "scheidemann", initials: "HS",  color: "#907830", bg: "#110d00", era: "baroque" },
  { file: "corelli",     initials: "AC",  color: "#C09838", bg: "#1a1200", era: "baroque" },
  { file: "vivaldi",     initials: "AV",  color: "#B09830", bg: "#181000", era: "baroque" },
  { file: "fischer",     initials: "JKF", color: "#988020", bg: "#141000", era: "baroque" },

  // ── CLÁSICO ──
  { file: "haydn",       initials: "FJH", color: "#7090B0", bg: "#0a1018", era: "classic" },
  { file: "haydn_m",     initials: "MH",  color: "#6080A0", bg: "#080e16", era: "classic" },
  { file: "mozart",      initials: "WAM", color: "#6080C0", bg: "#080e1a", era: "classic" },
  { file: "beethoven",   initials: "LvB", color: "#8060A0", bg: "#100818", era: "classic" },
  { file: "clementi",    initials: "MC",  color: "#708090", bg: "#0a0e14", era: "classic" },
  { file: "kuhlau",      initials: "FK",  color: "#607890", bg: "#080c14", era: "classic" },
  { file: "dussek",      initials: "JLD", color: "#5878A0", bg: "#080c18", era: "classic" },
  { file: "diabelli",    initials: "AD",  color: "#7088B0", bg: "#0a0e16", era: "classic" },
  { file: "czerny",      initials: "CC",  color: "#6878A0", bg: "#080c18", era: "classic" },
  { file: "pleyel",      initials: "IJP", color: "#7090A8", bg: "#0a0e16", era: "classic" },
  { file: "ries",        initials: "FR",  color: "#607090", bg: "#080c12", era: "classic" },
  { file: "mueller",     initials: "AEM", color: "#5880A0", bg: "#080e16", era: "classic" },

  // ── ROMÁNTICO ──
  { file: "schubert",    initials: "FS",  color: "#5090A0", bg: "#081418", era: "romantic" },
  { file: "chopin",      initials: "FC",  color: "#9060A0", bg: "#140818", era: "romantic" },
  { file: "schumann",    initials: "RS",  color: "#A07040", bg: "#180e00", era: "romantic" },
  { file: "liszt",       initials: "FL",  color: "#C06040", bg: "#1a0800", era: "romantic" },
  { file: "brahms",      initials: "JB",  color: "#806050", bg: "#120a08", era: "romantic" },
  { file: "grieg",       initials: "EG",  color: "#408080", bg: "#081414", era: "romantic" },
  { file: "tchaikovsky", initials: "PIT", color: "#5060A0", bg: "#080a18", era: "romantic" },
  { file: "mendelssohn", initials: "FM",  color: "#6090A0", bg: "#080e16", era: "romantic" },
  { file: "field",       initials: "JF",  color: "#6080A0", bg: "#0a0e16", era: "romantic" },
  { file: "alkan",       initials: "CVA", color: "#B07060", bg: "#180c08", era: "romantic" },
  { file: "burgmuller",  initials: "JFB", color: "#908060", bg: "#140e08", era: "romantic" },
  { file: "faure",       initials: "GF",  color: "#509090", bg: "#081418", era: "romantic" },
  { file: "franck",      initials: "CF",  color: "#607080", bg: "#080c10", era: "romantic" },
  { file: "saint_saens", initials: "CSS", color: "#708080", bg: "#0a1010", era: "romantic" },
  { file: "albeniz",     initials: "IA",  color: "#B07840", bg: "#180e00", era: "romantic" },
  { file: "dvorak",      initials: "AD",  color: "#608070", bg: "#081008", era: "romantic" },
  { file: "mussorgsky",  initials: "MM",  color: "#905040", bg: "#180800", era: "romantic" },
  { file: "rimsky_korsakov", initials: "NRK", color: "#7080A0", bg: "#0a0e18", era: "romantic" },
  { file: "rachmaninoff", initials: "SR", color: "#5060A0", bg: "#080a18", era: "romantic" },
  { file: "scriabin",    initials: "AS",  color: "#A05090", bg: "#180818", era: "romantic" },
  { file: "alyabyev",    initials: "AA",  color: "#7080A0", bg: "#0a0e16", era: "romantic" },
  { file: "chabrier",    initials: "EC",  color: "#908060", bg: "#140e08", era: "romantic" },
  { file: "volkmann",    initials: "RV",  color: "#808090", bg: "#0e1014", era: "romantic" },
  { file: "spohr",       initials: "LS",  color: "#7090A0", bg: "#0a0e16", era: "romantic" },
  { file: "paganini",    initials: "NP",  color: "#A04030", bg: "#180600", era: "romantic" },
  { file: "bortniansky", initials: "DB",  color: "#6070A0", bg: "#080c18", era: "romantic" },
  { file: "bruch",       initials: "MB",  color: "#708090", bg: "#0a0e14", era: "romantic" },
  { file: "verdi",       initials: "GV",  color: "#A06050", bg: "#180c08", era: "romantic" },
  { file: "bizet",       initials: "GB",  color: "#8070A0", bg: "#100c18", era: "romantic" },
  { file: "lalo",        initials: "EL",  color: "#607090", bg: "#080c14", era: "romantic" },
  { file: "rossini",     initials: "GR",  color: "#A07050", bg: "#180c08", era: "romantic" },
  { file: "donizetti",   initials: "GD",  color: "#A08060", bg: "#180e08", era: "romantic" },
  { file: "ippolitov_ivanov", initials: "MII", color: "#607890", bg: "#080c14", era: "romantic" },
  { file: "lachner",     initials: "FL",  color: "#908070", bg: "#100e0a", era: "romantic" },
  { file: "fuchs",       initials: "RF",  color: "#708070", bg: "#0a100a", era: "romantic" },
  { file: "kopylov",     initials: "AK",  color: "#5080A0", bg: "#080e18", era: "romantic" },
  { file: "strauss_jj",  initials: "JSJ", color: "#A08060", bg: "#180e08", era: "romantic" },
  { file: "bruckner",    initials: "AB",  color: "#708090", bg: "#0a0e14", era: "romantic" },
  { file: "humperdinck", initials: "EH",  color: "#8070A0", bg: "#100c18", era: "romantic" },

  // ── MODERNO ──
  { file: "satie",       initials: "ES",  color: "#608040", bg: "#0a1008", era: "modern" },
  { file: "debussy",     initials: "CD",  color: "#4080A0", bg: "#081018", era: "modern" },
  { file: "ravel",       initials: "MR",  color: "#60A080", bg: "#081410", era: "modern" },
  { file: "joplin",      initials: "SJ",  color: "#C08040", bg: "#1a1000", era: "modern" },
  { file: "bartok",      initials: "BB",  color: "#A04040", bg: "#180808", era: "modern" },
  { file: "prokofiev",   initials: "SP",  color: "#804040", bg: "#140808", era: "modern" },
  { file: "dukas",       initials: "PD",  color: "#708060", bg: "#0a100a", era: "modern" },
  { file: "elgar",       initials: "EE",  color: "#906040", bg: "#140a00", era: "modern" },
  { file: "holst",       initials: "GH",  color: "#6080A0", bg: "#080e16", era: "modern" },
  { file: "nielsen",     initials: "CN",  color: "#5090A0", bg: "#081418", era: "modern" },
  { file: "reger",       initials: "MR",  color: "#807060", bg: "#100c08", era: "modern" },
  { file: "turpin",      initials: "TT",  color: "#B08040", bg: "#181000", era: "modern" },
  { file: "stanchinsky", initials: "AS",  color: "#805070", bg: "#140810", era: "modern" },
  { file: "kosenko",     initials: "VK",  color: "#507090", bg: "#080c16", era: "modern" },
  { file: "korngold",    initials: "EWK", color: "#A07050", bg: "#180c08", era: "modern" },
  { file: "widor",       initials: "CW",  color: "#608080", bg: "#081010", era: "modern" },
  { file: "vidal",       initials: "PV",  color: "#708090", bg: "#0a0e14", era: "modern" },
  { file: "pejacsevich", initials: "DP",  color: "#906080", bg: "#140a10", era: "modern" },
  { file: "suter",       initials: "HS",  color: "#607080", bg: "#080c12", era: "modern" },
];

// Silhouettes por era (paths SVG de bustos estilizados)
const silhouettes = {
  baroque: `
    <ellipse cx="100" cy="68" rx="22" ry="26" fill="COLOR" opacity="0.9"/>
    <path d="M68 110 Q72 90 78 84 Q88 78 100 78 Q112 78 122 84 Q128 90 132 110 Q120 118 100 120 Q80 118 68 110Z" fill="COLOR" opacity="0.85"/>
    <path d="M60 120 Q65 108 68 110 Q80 118 100 120 Q120 118 132 110 Q135 108 140 120 Q130 145 100 150 Q70 145 60 120Z" fill="COLOR" opacity="0.7"/>
    <ellipse cx="100" cy="68" rx="18" ry="14" fill="BG" opacity="0.3"/>
    <path d="M78 58 Q82 44 100 42 Q118 44 122 58" fill="none" stroke="COLOR" stroke-width="1.5" opacity="0.6"/>
  `,
  classic: `
    <ellipse cx="100" cy="70" rx="20" ry="24" fill="COLOR" opacity="0.9"/>
    <path d="M72 112 Q75 92 80 86 Q90 80 100 80 Q110 80 120 86 Q125 92 128 112 Q116 122 100 124 Q84 122 72 112Z" fill="COLOR" opacity="0.85"/>
    <path d="M65 125 Q68 112 72 112 Q84 122 100 124 Q116 122 128 112 Q132 112 135 125 Q125 148 100 152 Q75 148 65 125Z" fill="COLOR" opacity="0.7"/>
    <ellipse cx="100" cy="70" rx="16" ry="12" fill="BG" opacity="0.3"/>
  `,
  romantic: `
    <ellipse cx="100" cy="72" rx="21" ry="25" fill="COLOR" opacity="0.9"/>
    <path d="M70 115 Q73 93 79 87 Q89 81 100 81 Q111 81 121 87 Q127 93 130 115 Q118 124 100 126 Q82 124 70 115Z" fill="COLOR" opacity="0.85"/>
    <path d="M58 128 Q63 114 70 115 Q82 124 100 126 Q118 124 130 115 Q137 114 142 128 Q132 152 100 156 Q68 152 58 128Z" fill="COLOR" opacity="0.7"/>
    <ellipse cx="100" cy="72" rx="17" ry="13" fill="BG" opacity="0.3"/>
    <path d="M79 65 Q85 55 100 53 Q115 55 121 65" fill="none" stroke="COLOR" stroke-width="1" opacity="0.5"/>
  `,
  modern: `
    <ellipse cx="100" cy="68" rx="20" ry="23" fill="COLOR" opacity="0.9"/>
    <path d="M74 108 Q76 90 82 84 Q91 78 100 78 Q109 78 118 84 Q124 90 126 108 Q115 118 100 120 Q85 118 74 108Z" fill="COLOR" opacity="0.85"/>
    <path d="M64 122 Q68 108 74 108 Q85 118 100 120 Q115 118 126 108 Q132 108 136 122 Q126 146 100 150 Q74 146 64 122Z" fill="COLOR" opacity="0.7"/>
    <ellipse cx="100" cy="68" rx="16" ry="11" fill="BG" opacity="0.35"/>
  `,
};

function generateSVG({ initials, color, bg, era }) {
  const silhouette = silhouettes[era]
    .replace(/COLOR/g, color)
    .replace(/BG/g, bg);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="circle">
      <circle cx="100" cy="100" r="96"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <circle cx="100" cy="100" r="100" fill="#0a0a0a"/>
  <circle cx="100" cy="100" r="96" fill="url(#bg)"/>
  <circle cx="100" cy="100" r="96" fill="url(#glow)"/>

  <!-- Silhouette -->
  <g clip-path="url(#circle)" transform="translate(0, 10)">
    ${silhouette}
  </g>

  <!-- Decorative rings -->
  <circle cx="100" cy="100" r="90" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
  <circle cx="100" cy="100" r="96" fill="none" stroke="${color}" stroke-width="1" opacity="0.5"/>

  <!-- Corner accents -->
  <path d="M14 14 L30 14 M14 14 L14 30" stroke="${color}" stroke-width="1.5" opacity="0.6" fill="none"/>
  <path d="M186 14 L170 14 M186 14 L186 30" stroke="${color}" stroke-width="1.5" opacity="0.6" fill="none"/>
  <path d="M14 186 L30 186 M14 186 L14 170" stroke="${color}" stroke-width="1.5" opacity="0.6" fill="none"/>
  <path d="M186 186 L170 186 M186 186 L186 170" stroke="${color}" stroke-width="1.5" opacity="0.6" fill="none"/>

  <!-- Initials -->
  <text x="100" y="192" font-family="Georgia, serif" font-size="11" fill="${color}"
    opacity="0.7" text-anchor="middle" letter-spacing="4">${initials}</text>
</svg>`;
}

for (const c of composers) {
  const svg = generateSVG(c);
  const dest = path.join(OUT, `${c.file}.svg`);
  fs.writeFileSync(dest, svg);
  console.log(`✓ ${c.file}.svg`);
}

console.log(`\n✅ ${composers.length} retratos generados en public/images/composers/`);

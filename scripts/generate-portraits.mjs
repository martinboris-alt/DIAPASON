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
  { file: "bach",        initials: "JSB", color: "#C9A84C", bg: "#1a1400", era: "baroque"    },
  { file: "handel",      initials: "GFH", color: "#A08040", bg: "#161000", era: "baroque"    },
  { file: "scarlatti",   initials: "DS",  color: "#B87A30", bg: "#180e00", era: "baroque"    },
  { file: "haydn",       initials: "FJH", color: "#7090B0", bg: "#0a1018", era: "classic"    },
  { file: "mozart",      initials: "WAM", color: "#6080C0", bg: "#080e1a", era: "classic"    },
  { file: "beethoven",   initials: "LvB", color: "#8060A0", bg: "#100818", era: "classic"    },
  { file: "schubert",    initials: "FS",  color: "#5090A0", bg: "#081418", era: "romantic"   },
  { file: "chopin",      initials: "FC",  color: "#9060A0", bg: "#140818", era: "romantic"   },
  { file: "schumann",    initials: "RS",  color: "#A07040", bg: "#180e00", era: "romantic"   },
  { file: "liszt",       initials: "FL",  color: "#C06040", bg: "#1a0800", era: "romantic"   },
  { file: "brahms",      initials: "JB",  color: "#806050", bg: "#120a08", era: "romantic"   },
  { file: "grieg",       initials: "EG",  color: "#408080", bg: "#081414", era: "romantic"   },
  { file: "tchaikovsky", initials: "PIT", color: "#5060A0", bg: "#080a18", era: "romantic"   },
  { file: "satie",       initials: "ES",  color: "#608040", bg: "#0a1008", era: "modern"     },
  { file: "debussy",     initials: "CD",  color: "#4080A0", bg: "#081018", era: "modern"     },
  { file: "ravel",       initials: "MR",  color: "#60A080", bg: "#081410", era: "modern"     },
  { file: "joplin",      initials: "SJ",  color: "#C08040", bg: "#1a1000", era: "modern"     },
  { file: "bartok",      initials: "BB",  color: "#A04040", bg: "#180808", era: "modern"     },
  { file: "prokofiev",   initials: "SP",  color: "#804040", bg: "#140808", era: "modern"     },
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

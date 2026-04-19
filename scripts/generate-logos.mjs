/**
 * Genera wordmarks SVG (logos tipográficos) para cada marca de piano.
 * Estilo inspirado en las tipografías reales de cada casa pero originales.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/images/marcas/logos");
fs.mkdirSync(OUT, { recursive: true });

// Genera un wordmark SVG con tipografía y estilo específico
function wordmark({ lines, color, style = {}, decor = null, bg = "transparent" }) {
  const W = 400, H = 120;
  const lineEls = lines.map((line, i) => {
    const y = lines.length === 1 ? 72 : (i === 0 ? 55 : 88);
    const fs_ = line.size ?? (lines.length === 1 ? 38 : 28);
    const family = line.family ?? "Georgia, 'Times New Roman', serif";
    const weight = line.weight ?? 400;
    const spacing = line.spacing ?? 2;
    const italic = line.italic ? "italic" : "normal";
    return `<text x="200" y="${y}" font-family="${family}" font-size="${fs_}"
      font-weight="${weight}" font-style="${italic}"
      letter-spacing="${spacing}" text-anchor="middle" fill="${color}"
      ${line.transform ? `transform="${line.transform}"` : ""}>${line.text}</text>`;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
    ${lineEls}
    ${decor ?? ""}
</svg>`;
}

const marcas = {
  // ── Steinway & Sons: serif clásico, grande, con ornamento de lira abajo
  steinway: () => wordmark({
    color: "#D4AF37",
    lines: [
      { text: "STEINWAY", size: 36, weight: 400, spacing: 6, family: "Georgia, serif" },
      { text: "& SONS",    size: 14, weight: 300, spacing: 10, family: "Georgia, serif" },
    ],
    decor: `
      <line x1="120" y1="100" x2="280" y2="100" stroke="#D4AF37" stroke-width="0.5" opacity="0.6"/>
      <path d="M195 107 Q200 103 205 107" fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.6"/>
    `,
  }),

  // ── Bösendorfer: italic refinado, elegante
  bosendorfer: () => wordmark({
    color: "#E8A85C",
    lines: [
      { text: "Bösendorfer", size: 42, weight: 400, spacing: 1, italic: true, family: "Georgia, serif" },
      { text: "VIENNA · 1828", size: 10, weight: 300, spacing: 6, family: "Georgia, serif" },
    ],
    decor: `
      <path d="M170 103 Q200 98 230 103" fill="none" stroke="#E8A85C" stroke-width="0.5" opacity="0.7"/>
    `,
  }),

  // ── C. Bechstein: serif bold, alemán
  bechstein: () => wordmark({
    color: "#E8E0D0",
    lines: [
      { text: "C. BECHSTEIN", size: 32, weight: 500, spacing: 8, family: "'Times New Roman', serif" },
      { text: "BERLIN SEIT 1853", size: 10, weight: 300, spacing: 6, family: "Georgia, serif" },
    ],
    decor: `
      <line x1="80" y1="30" x2="320" y2="30" stroke="#E8E0D0" stroke-width="0.5" opacity="0.5"/>
      <line x1="80" y1="100" x2="320" y2="100" stroke="#E8E0D0" stroke-width="0.5" opacity="0.5"/>
    `,
  }),

  // ── Blüthner: italic con gracia, golden tone
  bluthner: () => wordmark({
    color: "#E8C060",
    lines: [
      { text: "Blüthner", size: 48, weight: 400, spacing: 0, italic: true, family: "Georgia, serif" },
      { text: "LEIPZIG · GOLDEN TONE", size: 9, weight: 300, spacing: 5, family: "Georgia, serif" },
    ],
    decor: `
      <path d="M140 107 Q200 102 260 107" fill="none" stroke="#E8C060" stroke-width="0.4" opacity="0.7"/>
    `,
  }),

  // ── Fazioli: minimalista moderno italiano
  fazioli: () => wordmark({
    color: "#C9A84C",
    lines: [
      { text: "FAZIOLI", size: 42, weight: 300, spacing: 16, family: "Georgia, 'Times New Roman', serif" },
      { text: "PIANOFORTI", size: 10, weight: 300, spacing: 12, family: "Georgia, serif" },
    ],
  }),

  // ── Yamaha: sans-serif moderno con diapasón estilizado
  yamaha: () => wordmark({
    color: "#E8E0D0",
    lines: [
      { text: "YAMAHA", size: 44, weight: 300, spacing: 14, family: "'Helvetica Neue', Arial, sans-serif" },
    ],
    decor: `
      <!-- Tres diapasones estilizados (motivo real de Yamaha) -->
      <g transform="translate(200, 105)" fill="none" stroke="#E8E0D0" stroke-width="0.8" opacity="0.8">
        <path d="M-15 0 L-15 -8 M-10 0 L-10 -6 M-15 0 L-10 0"/>
        <path d="M-3 0 L-3 -8 M3 0 L3 -6 M-3 0 L3 0"/>
        <path d="M10 0 L10 -8 M15 0 L15 -6 M10 0 L15 0"/>
      </g>
    `,
  }),

  // ── Kawai: sans-serif con hoja estilizada
  kawai: () => wordmark({
    color: "#E8E0D0",
    lines: [
      { text: "KAWAI", size: 44, weight: 400, spacing: 18, family: "'Helvetica Neue', Arial, sans-serif" },
    ],
    decor: `
      <!-- Hoja estilizada (motivo Kawai) -->
      <g transform="translate(200, 103)" fill="#E8E0D0" opacity="0.85">
        <path d="M-14 0 Q-7 -10 0 -12 Q7 -10 14 0 Q7 6 0 6 Q-7 6 -14 0 Z"/>
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#0A0A0A" stroke-width="0.8"/>
      </g>
    `,
  }),

  // ── Pleyel: script francés elegante
  pleyel: () => wordmark({
    color: "#E8A8C0",
    lines: [
      { text: "Pleyel", size: 50, weight: 400, spacing: 0, italic: true, family: "Georgia, serif" },
      { text: "PARIS 1807", size: 10, weight: 300, spacing: 8, family: "Georgia, serif" },
    ],
    decor: `
      <path d="M140 107 Q200 102 260 107" fill="none" stroke="#E8A8C0" stroke-width="0.4" opacity="0.6"/>
    `,
  }),

  // ── Érard: serif histórico francés
  erard: () => wordmark({
    color: "#C8A878",
    lines: [
      { text: "ÉRARD", size: 46, weight: 400, spacing: 14, family: "Georgia, 'Times New Roman', serif" },
      { text: "MANUFACTURE · PARIS", size: 9, weight: 300, spacing: 5, family: "Georgia, serif" },
    ],
    decor: `
      <line x1="90" y1="30" x2="150" y2="30" stroke="#C8A878" stroke-width="0.4"/>
      <line x1="250" y1="30" x2="310" y2="30" stroke="#C8A878" stroke-width="0.4"/>
    `,
  }),

  // ── Baldwin: serif bold americano
  baldwin: () => wordmark({
    color: "#D89458",
    lines: [
      { text: "BALDWIN", size: 40, weight: 500, spacing: 10, family: "Georgia, 'Times New Roman', serif" },
      { text: "AMERICA'S PIANO · 1862", size: 9, weight: 300, spacing: 4, family: "Georgia, serif" },
    ],
    decor: `
      <line x1="100" y1="95" x2="300" y2="95" stroke="#D89458" stroke-width="0.5" opacity="0.6"/>
    `,
  }),
};

// Generar cada wordmark
for (const [name, fn] of Object.entries(marcas)) {
  const svg = fn();
  const dest = path.join(OUT, `${name}.svg`);
  fs.writeFileSync(dest, svg);
  console.log(`  ✓ ${name}.svg`);
}

console.log(`\n✅ ${Object.keys(marcas).length} wordmarks generados en public/images/marcas/logos/`);

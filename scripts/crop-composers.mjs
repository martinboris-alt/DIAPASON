/**
 * Recorta los 16 retratos del mosaico y los guarda con los nombres correctos
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "composers-grid.png");
const OUT = path.join(__dirname, "../public/images/composers");

// Mosaico: 4 columnas × 4 filas, imagen 1024 × 1536 → celdas de 256 × 384
const CELL_W = 256;
const CELL_H = 384;

// Posición (fila, columna) → nombre de archivo (según lo indicado por el usuario)
const layout = [
  // Fila 1
  [ "bartok",   "debussy",   "grieg",  "satie" ],
  // Fila 2
  [ "liszt",    "schubert",  "chopin", "handel" ],
  // Fila 3
  [ "bach",     "brahms",    "haydn",  "beethoven" ],
  // Fila 4
  [ "tchaikovsky", "schumann", "joplin", "mozart" ],
];

async function main() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const name = layout[row][col];
      const dest = path.join(OUT, `${name}.jpg`);
      await sharp(SRC)
        .extract({ left: col * CELL_W, top: row * CELL_H, width: CELL_W, height: CELL_H })
        .jpeg({ quality: 90 })
        .toFile(dest);
      console.log(`  ✓ ${name}.jpg`);
    }
  }
  console.log(`\n✅ 16 retratos recortados en public/images/composers/`);
}

main().catch(console.error);

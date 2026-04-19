/**
 * Descarga partituras de Mutopia Project (CC-licensed, redistribución permitida)
 * Uso: node scripts/download-partituras.mjs
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/partituras");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const DELAY_MS = 800; // respetuoso con el servidor
const BASE = "https://www.mutopiaproject.org";

// Compositores de piano que queremos (código Mutopia → nombre legible)
const COMPOSERS = [
  { code: "BachJS",      nombre: "Johann Sebastian Bach",   periodo: "Barroco"   },
  { code: "HandelGF",    nombre: "Georg Friedrich Händel",  periodo: "Barroco"   },
  { code: "ScarlattD",   nombre: "Domenico Scarlatti",      periodo: "Barroco"   },
  { code: "HaydnFJ",     nombre: "Joseph Haydn",            periodo: "Clásico"   },
  { code: "MozartWA",    nombre: "Wolfgang A. Mozart",      periodo: "Clásico"   },
  { code: "BeethovenLv", nombre: "Ludwig van Beethoven",    periodo: "Clásico"   },
  { code: "SchubertF",   nombre: "Franz Schubert",          periodo: "Romántico" },
  { code: "ChopinFF",    nombre: "Frédéric Chopin",         periodo: "Romántico" },
  { code: "SchumannR",   nombre: "Robert Schumann",         periodo: "Romántico" },
  { code: "LisztF",      nombre: "Franz Liszt",             periodo: "Romántico" },
  { code: "BrahmsJ",     nombre: "Johannes Brahms",         periodo: "Romántico" },
  { code: "GriegE",      nombre: "Edvard Grieg",            periodo: "Romántico" },
  { code: "TchaikovskyPI", nombre: "Piotr I. Tchaikovsky",  periodo: "Romántico" },
  { code: "SatieE",      nombre: "Erik Satie",              periodo: "Moderno"   },
  { code: "DebussyC",    nombre: "Claude Debussy",          periodo: "Moderno"   },
  { code: "RavelM",      nombre: "Maurice Ravel",           periodo: "Moderno"   },
  { code: "JoplinS",     nombre: "Scott Joplin",            periodo: "Moderno"   },
  { code: "BartokB",     nombre: "Béla Bartók",             periodo: "Moderno"   },
  { code: "ProkofievSS", nombre: "Sergei Prokofiev",        periodo: "Moderno"   },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "Diapason-Piano/1.0 (educational)" } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return fetchText(res.headers.location).then(resolve).catch(reject);
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { process.stdout.write("·"); return resolve(true); }
    const tmp = dest + ".tmp";
    const file = fs.createWriteStream(tmp);
    const req = https.get(url, { headers: { "User-Agent": "Diapason-Piano/1.0" } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(tmp);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlinkSync(tmp);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); fs.renameSync(tmp, dest); resolve(true); });
    });
    req.on("error", err => { try { fs.unlinkSync(tmp); } catch {} reject(err); });
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

// Extrae título y URL de PDF de la página HTML de Mutopia
function parsePage(html) {
  const pieces = [];
  // Cada pieza está en un bloque con su título y PDFs
  const titleRe = /<td[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/td>/gi;
  const pdfRe = /href="(https?:\/\/www\.mutopiaproject\.org\/ftp\/[^"]*-a4\.pdf)"/g;
  const licenseRe = /creativecommons\.org\/licenses\/([^/"]+)/g;

  // Extraer bloques de piezas — el HTML tiene estructura de tabla
  // Buscar filas con PDF links junto a títulos
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRe.exec(html)) !== null) {
    const row = rowMatch[1];
    const pdfMatch = /href="(https?:\/\/www\.mutopiaproject\.org\/ftp\/[^"]*-a4\.pdf)"/.exec(row);
    if (!pdfMatch) continue;
    const pdfUrl = pdfMatch[1];

    // Extraer título limpio
    const titleMatch = /<a[^>]*href="[^"]*piece-info[^"]*"[^>]*>([\s\S]*?)<\/a>/.exec(row);
    const titulo = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : path.basename(pdfUrl, "-a4.pdf");

    // Nombre del archivo local
    const filename = path.basename(pdfUrl);
    pieces.push({ titulo, pdfUrl, filename });
  }
  return pieces;
}

// Scrapea todas las páginas de un compositor para piano
async function fetchComposerPieces(composerCode) {
  const pieces = [];
  let startat = 0;
  while (true) {
    const url = `${BASE}/cgibin/make-table.cgi?Instrument=Piano&Composer=${composerCode}&startat=${startat}`;
    let html;
    try { html = await fetchText(url); } catch { break; }

    const found = parsePage(html);
    if (found.length === 0) break;
    pieces.push(...found);

    // ¿Hay más páginas?
    if (!html.includes("Next 10")) break;
    startat += 10;
    await sleep(DELAY_MS);
  }
  return pieces;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const catalog = [];
  let totalDescargadas = 0;
  let totalFallidas = 0;

  for (const composer of COMPOSERS) {
    console.log(`\n🎼 ${composer.nombre}…`);
    const pieces = await fetchComposerPieces(composer.code);
    console.log(`   ${pieces.length} piezas encontradas`);

    for (const piece of pieces) {
      const dest = path.join(OUTPUT_DIR, piece.filename);
      process.stdout.write(`   ↓ ${piece.titulo.slice(0, 50).padEnd(50)} `);
      try {
        await downloadFile(piece.pdfUrl, dest);
        process.stdout.write(" ✓\n");
        totalDescargadas++;
        catalog.push({
          titulo: piece.titulo,
          compositor: composer.nombre,
          periodo: composer.periodo,
          filename: piece.filename,
          localPath: `/partituras/${piece.filename}`,
          source: piece.pdfUrl,
          licencia: "CC / Dominio Público (Mutopia Project)",
        });
      } catch (e) {
        process.stdout.write(` ✗ ${e.message}\n`);
        totalFallidas++;
      }
      await sleep(DELAY_MS);
    }
  }

  // Guardar catálogo JSON
  const catalogPath = path.join(__dirname, "../config/mutopia-catalog.json");
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✓ Descargadas: ${totalDescargadas}`);
  console.log(`✗ Fallidas:    ${totalFallidas}`);
  console.log(`📁 PDFs en:    public/partituras/`);
  console.log(`📋 Catálogo:   config/mutopia-catalog.json`);

  // Tamaño total
  const totalBytes = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith(".pdf"))
    .reduce((acc, f) => acc + fs.statSync(path.join(OUTPUT_DIR, f)).size, 0);
  console.log(`💾 Tamaño total: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);

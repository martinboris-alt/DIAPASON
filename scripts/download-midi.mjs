/**
 * Descarga archivos MIDI de Mutopia Project para cada pieza ya descargada.
 * Los MIDIs se guardan en public/midi/ con el mismo nombre base que los PDFs.
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIDI_DIR  = path.join(__dirname, "../public/midi");
const CATALOG   = path.join(__dirname, "../config/mutopia-catalog.json");
fs.mkdirSync(MIDI_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { process.stdout.write("·"); return resolve(true); }
    const tmp = dest + ".tmp";
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { "User-Agent": "Diapason-Piano/1.0" } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); try { fs.unlinkSync(tmp); } catch {}
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); try { fs.unlinkSync(tmp); } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); fs.renameSync(tmp, dest); resolve(true); });
    }).on("error", err => { try { fs.unlinkSync(tmp); } catch {} reject(err); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error("No se encontró config/mutopia-catalog.json. Ejecuta primero download-partituras.mjs");
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf-8"));
  let ok = 0, missing = 0, fail = 0;

  console.log(`📥 Descargando MIDIs para ${catalog.length} piezas…\n`);

  for (const piece of catalog) {
    // El PDF está en .../piece-a4.pdf → MIDI en .../piece.mid
    const midiUrl = piece.source.replace("-a4.pdf", ".mid");
    const midiFilename = path.basename(piece.filename, "-a4.pdf") + ".mid";
    const dest = path.join(MIDI_DIR, midiFilename);

    process.stdout.write(`  ↓ ${midiFilename.padEnd(50)} `);
    try {
      await download(midiUrl, dest);
      process.stdout.write(" ✓\n");
      ok++;
      // Añadir midiPath al catálogo
      piece.midiPath = `/midi/${midiFilename}`;
    } catch {
      // Intentar con .midi extensión
      try {
        const midiUrl2 = piece.source.replace("-a4.pdf", ".midi");
        await download(midiUrl2, dest.replace(".mid", ".midi"));
        piece.midiPath = `/midi/${midiFilename.replace(".mid", ".midi")}`;
        process.stdout.write(" ✓ (.midi)\n");
        ok++;
      } catch {
        process.stdout.write(" — no disponible\n");
        missing++;
      }
    }
    await sleep(300);
  }

  // Guardar catálogo actualizado con midiPath
  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2));

  const totalMidi = fs.readdirSync(MIDI_DIR).length;
  const totalBytes = fs.readdirSync(MIDI_DIR)
    .reduce((acc, f) => acc + fs.statSync(path.join(MIDI_DIR, f)).size, 0);

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✓ MIDIs descargados: ${ok}`);
  console.log(`— No disponibles:    ${missing}`);
  console.log(`📁 Total en /midi/:  ${totalMidi} archivos (${(totalBytes/1024/1024).toFixed(1)} MB)`);
  console.log(`📋 Catálogo actualizado con midiPath`);
}

main().catch(console.error);

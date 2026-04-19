/**
 * Valida cada MIDI parseándolo con @tonejs/midi.
 * Si un MIDI no se puede parsear o está vacío, quita el midiPath del catálogo
 * y elimina el archivo, para que no aparezca el botón "Escuchar".
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tonejsMidi from "@tonejs/midi";
const { Midi } = tonejsMidi;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG  = path.join(__dirname, "../config/mutopia-catalog.json");
const MIDI_DIR = path.join(__dirname, "../public/midi");

function parseSafe(filepath) {
  try {
    const buf = fs.readFileSync(filepath);
    const midi = new Midi(buf);
    const notesCount = midi.tracks.reduce((a, t) => a + t.notes.length, 0);
    if (midi.duration <= 0) return { ok: false, reason: "duración 0" };
    if (notesCount === 0)   return { ok: false, reason: "sin notas" };
    return { ok: true, duration: midi.duration, notes: notesCount };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf-8"));
let valid = 0, invalid = 0, noPath = 0;
const removed = [];

for (const piece of catalog) {
  if (!piece.midiPath) { noPath++; continue; }
  const midiFile = path.join(MIDI_DIR, path.basename(piece.midiPath));
  if (!fs.existsSync(midiFile)) {
    removed.push({ file: piece.filename, reason: "archivo faltante" });
    delete piece.midiPath;
    invalid++;
    continue;
  }
  const result = parseSafe(midiFile);
  if (result.ok) {
    valid++;
  } else {
    removed.push({ file: piece.filename, reason: result.reason });
    delete piece.midiPath;
    try { fs.unlinkSync(midiFile); } catch {}
    invalid++;
  }
}

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2));

console.log(`\n─────────────────────────────────────────`);
console.log(`✓ MIDIs válidos:      ${valid}`);
console.log(`✗ MIDIs inválidos:    ${invalid}`);
console.log(`— Piezas sin MIDI:    ${noPath}`);
if (removed.length > 0) {
  console.log(`\nEjemplos de inválidos:`);
  removed.slice(0, 8).forEach(r => console.log(`  · ${r.file} → ${r.reason}`));
}
console.log(`\n📋 Catálogo actualizado. Las piezas sin MIDI válido ya no mostrarán el botón "Escuchar".`);

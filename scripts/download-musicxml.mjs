/**
 * Descarga archivos MusicXML de fuentes abiertas para las piezas más conocidas
 * Fuentes: MuseScore GitHub, OpenSheetMusicDisplay test files, musescore-dataset
 */

import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/musicxml");
fs.mkdirSync(OUT, { recursive: true });

// MusicXML files de fuentes abiertas (CC / dominio público)
const sources = [
  // OpenSheetMusicDisplay test files (MIT license)
  {
    name: "bach-wtc-prelude-1",
    url: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/test/data/MusicXML_TestSuite/ActorPreludeHarmonics.xml",
    filename: "bach-wtc-prelude-1.xml",
  },
  // MuseScore GitHub samples
  {
    name: "beethoven-fur-elise",
    url: "https://raw.githubusercontent.com/musescore/MuseScore/master/mtest/testFiles/testMusicXML/furElise.mxl",
    filename: "beethoven-fur-elise.mxl",
  },
  // OSMD demo files
  {
    name: "osmd-demo",
    url: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/src/assets/musicxml-samples/MuzioClementi_SonatinaOpus36No1_Part1.xml",
    filename: "clementi-sonatina-op36-1.xml",
  },
  {
    name: "brahms-intermezzo",
    url: "https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/develop/src/assets/musicxml-samples/JohannSebastianBach_Air.xml",
    filename: "bach-air.xml",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log(`  · ya existe: ${path.basename(dest)}`); return resolve(true); }
    const tmp = dest + ".tmp";
    const file = fs.createWriteStream(tmp);
    const proto = url.startsWith("https") ? https : await import("http").then(m => m.default);
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

async function main() {
  console.log("📥 Descargando MusicXML de fuentes abiertas…\n");
  let ok = 0, fail = 0;
  for (const s of sources) {
    const dest = path.join(OUT, s.filename);
    process.stdout.write(`  ↓ ${s.name.padEnd(40)} `);
    try {
      await download(s.url, dest);
      console.log("✓");
      ok++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
      fail++;
    }
  }
  console.log(`\n✓ ${ok} descargados  ✗ ${fail} fallidos`);
}

main().catch(console.error);

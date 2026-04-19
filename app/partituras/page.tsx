import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogClient, { type PartituraItem } from "./CatalogClient";
import { PlayerProvider } from "@/context/PlayerContext";

export const metadata: Metadata = {
  title: "Partituras Gratis de Piano — Diapasón",
  description:
    "Descarga gratis cientos de partituras de piano en dominio público: Bach, Beethoven, Chopin, Debussy, Mozart y más. Catálogo curado por Diapasón.",
  keywords: "partituras piano gratis, partituras dominio público, descargar partituras piano, Bach piano PDF, Beethoven piano PDF",
};

function loadCatalog(): PartituraItem[] {
  const catalogPath = path.join(process.cwd(), "config", "mutopia-catalog.json");
  if (!fs.existsSync(catalogPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(catalogPath, "utf-8")) as PartituraItem[];
  } catch {
    return [];
  }
}

export default function PartiturasPage() {
  const partituras = loadCatalog();
  const total = partituras.length;
  const compositores = new Set(partituras.map(p => p.compositor)).size;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24 relative">

        {/* Background image with elegant gradient fade */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage: "url('/images/partitura-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            maskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
          }}
        />

        {/* Relative wrapper for content above background */}
        <div className="relative z-10">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white-warm/5">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Dominio público · Descarga gratuita
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Partituras
            <br />
            <em className="italic text-gold">para Piano</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-xl leading-relaxed mb-10">
            Colección propia de obras en dominio público, alojadas y disponibles para descarga
            directa. Todas provienen del{" "}
            <a href="https://www.mutopiaproject.org" target="_blank" rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2">
              Mutopia Project
            </a>
            {" "}bajo licencias Creative Commons.
          </p>

          {/* Stats */}
          <div className="flex gap-10 flex-wrap">
            {[
              { value: total > 0 ? total.toLocaleString() : "—", label: "Partituras" },
              { value: compositores > 0 ? String(compositores) : "—", label: "Compositores" },
              { value: "100%", label: "Gratuitas" },
              { value: "PDF", label: "Formato" },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                <p className="text-[10px] tracking-widest uppercase text-white-warm/30 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Licencia notice */}
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-start gap-3 border border-gold/10 bg-gold/3 p-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-4 h-4 text-gold/50 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-xs text-white-warm/35 leading-relaxed">
              Todas las partituras son de <strong className="text-white-warm/50">dominio público</strong> o
              están bajo licencia <strong className="text-white-warm/50">Creative Commons</strong>.
              Descarga y uso libres para estudio personal, enseñanza y interpretación.
            </p>
          </div>
        </div>

        {/* Catalog */}
        <div className="pt-6">
          {total === 0 ? (
            <div className="max-w-7xl mx-auto px-6 py-24 text-center">
              <p className="font-display text-2xl text-white-warm/30 italic mb-4">
                Catálogo en preparación
              </p>
              <p className="text-white-warm/20 text-sm">
                Ejecuta <code className="text-gold/50">node scripts/download-partituras.mjs</code> para poblar el catálogo.
              </p>
            </div>
          ) : (
            <PlayerProvider>
              <CatalogClient partituras={partituras} />
            </PlayerProvider>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white-warm/5 text-center">
          <p className="text-white-warm/30 text-sm font-light mb-2">
            ¿Necesitas que tu piano esté en condiciones para interpretar estas obras?
          </p>
          <a href="/#contacto"
            className="inline-block mt-4 px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300">
            Solicitar afinación
          </a>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

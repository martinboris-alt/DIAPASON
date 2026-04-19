import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogClient from "./CatalogClient";
import { partituras } from "@/config/partituras";

export const metadata: Metadata = {
  title: "Partituras Gratis — Diapasón",
  description:
    "Descarga partituras de piano de dominio público: Bach, Beethoven, Chopin, Debussy y más. Catálogo gratuito para todos los niveles.",
  keywords: "partituras piano gratis, partituras dominio público, Bach piano, Beethoven piano, Chopin partituras",
};

const stats = [
  { value: String(partituras.length), label: "Partituras" },
  { value: "4", label: "Períodos" },
  { value: "100%", label: "Gratuitas" },
];

export default function PartiturasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white-warm/5">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Dominio público
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Partituras
            <br />
            <em className="italic text-gold">para Piano</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-xl leading-relaxed mb-10">
            Colección curada de obras clásicas en dominio público. Todas gratuitas,
            listas para descargar desde IMSLP — la mayor biblioteca musical del mundo.
          </p>

          {/* Stats */}
          <div className="flex gap-10 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold text-gold">{s.value}</p>
                <p className="text-[10px] tracking-widest uppercase text-white-warm/30 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IMSLP notice */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start gap-3 border border-gold/15 bg-gold/3 p-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold/60 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-white-warm/40 leading-relaxed">
              Las partituras están alojadas en{" "}
              <a href="https://imslp.org" target="_blank" rel="noopener noreferrer" className="text-gold/70 hover:text-gold transition-colors underline underline-offset-2">
                IMSLP (Petrucci Music Library)
              </a>
              {" "}— el mayor repositorio de música de dominio público. Al hacer clic en "Ver en IMSLP" accederás a la página de la obra donde podrás descargar el PDF.
            </p>
          </div>
        </div>

        {/* Catalog */}
        <div className="pt-8">
          <CatalogClient />
        </div>

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white-warm/5 text-center">
          <p className="text-white-warm/30 text-sm font-light mb-2">
            ¿Necesitas que tu piano esté en óptimas condiciones para tocar estas obras?
          </p>
          <a
            href="/#contacto"
            className="inline-block mt-4 px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Solicitar afinación
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}

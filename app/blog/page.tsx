import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles } from "@/config/blog";

export const metadata: Metadata = {
  title: "Blog · Guías y artículos sobre piano · Diapasón",
  description:
    "Artículos y guías prácticas sobre pianos: mantenimiento, afinación, compra, historia y técnica. Escritos por un afinador profesional en Chile.",
  keywords: "blog piano, guías piano, mantenimiento piano, afinación piano, Chile",
};

const categoryColor: Record<string, string> = {
  "Mantenimiento":   "bg-sky-500/10    text-sky-400    border-sky-500/20",
  "Guía de compra":  "bg-amber-500/10  text-amber-400  border-amber-500/20",
  "Historia":        "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Técnica":         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function BlogPage() {
  const ordenados = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const destacado = ordenados[0];
  const resto = ordenados.slice(1);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 py-12 border-b border-white-warm/5">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Blog · Guías de piano
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Artículos
            <br />
            <em className="italic text-gold">sobre el piano</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-xl leading-relaxed">
            Mantenimiento, historia, consejos de compra y técnica. Escritos desde la experiencia
            de más de una década afinando pianos en Chile.
          </p>
        </div>

        {/* Destacado */}
        {destacado && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
              href={`/blog/${destacado.slug}`}
              className="block border border-white-warm/10 bg-piano-black-soft p-6 sm:p-10 group hover:border-gold/30 transition-all"
            >
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/70 mb-3">Más reciente</p>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${categoryColor[destacado.category]}`}>
                  {destacado.category}
                </span>
                <span className="text-[10px] text-white-warm/40 tracking-wide">
                  {destacado.readTime} min lectura
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white-warm mb-4 leading-tight group-hover:text-gold transition-colors">
                {destacado.title}
              </h2>
              <p className="text-white-soft/60 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-3xl">
                {destacado.summary}
              </p>
              <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold group-hover:gap-3 transition-all">
                Leer artículo →
              </span>
            </Link>
          </div>
        )}

        {/* Resto de artículos */}
        {resto.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-8 font-light">
              Más artículos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white-warm/5">
              {resto.map(a => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="bg-piano-black p-6 flex flex-col group hover:bg-piano-black-soft transition-colors"
                >
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${categoryColor[a.category]}`}>
                      {a.category}
                    </span>
                    <span className="text-[10px] text-white-warm/30">
                      {a.readTime} min
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-white-warm leading-snug mb-3 group-hover:text-gold transition-colors line-clamp-3">
                    {a.title}
                  </h3>
                  <p className="text-white-soft/55 text-xs leading-relaxed font-light flex-1 mb-4 line-clamp-3">
                    {a.summary}
                  </p>
                  <span className="text-[10px] tracking-widest uppercase text-gold/70 mt-auto">
                    Leer →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-white-warm/5 text-center">
          <p className="text-white-warm/40 text-sm font-light mb-4">
            ¿Tienes una pregunta específica sobre tu piano?
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Consultar con Diego
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

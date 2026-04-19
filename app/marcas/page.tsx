import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marcas } from "@/config/marcas";

export const metadata: Metadata = {
  title: "Marcas de Piano — Historia y Tradición | Diapasón",
  description:
    "Conoce las grandes casas de piano del mundo: Steinway, Bösendorfer, Bechstein, Blüthner, Fazioli, Yamaha, Kawai, Pleyel, Érard y Baldwin. Historia, innovaciones y tradición.",
  keywords: "marcas de piano, Steinway historia, Bösendorfer, Bechstein, Blüthner, Fazioli, Yamaha piano, Kawai piano, Pleyel, Érard",
};

export default function MarcasPage() {
  // Ordenar cronológicamente por fundación
  const ordenadas = [...marcas].sort((a, b) => a.fundacion - b.fundacion);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white-warm/5">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Historia · Tradición · Innovación
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Las Grandes
            <br />
            <em className="italic text-gold">Casas del Piano</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-2xl leading-relaxed">
            Un recorrido por las marcas que construyeron la historia del piano moderno. Desde
            los talleres artesanales del siglo XVIII hasta las fábricas contemporáneas que
            mantienen viva la tradición — cada casa con su identidad sonora, sus innovaciones
            y sus intérpretes legendarios.
          </p>

          {/* Timeline mini */}
          <div className="flex items-center gap-1 mt-10 overflow-x-auto pb-2">
            {ordenadas.map((m, i) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="shrink-0 flex flex-col items-center min-w-[80px] group"
              >
                <span className="text-[10px] tracking-widest uppercase text-white-warm/30 group-hover:text-gold transition-colors">
                  {m.fundacion}
                </span>
                <div className="w-2 h-2 rounded-full my-1.5 border border-gold/40 group-hover:bg-gold transition-colors" />
                <span className="text-[9px] tracking-wider text-white-warm/50 group-hover:text-white-warm transition-colors text-center">
                  {m.nombre.split(" ")[0]}
                </span>
                {i < ordenadas.length - 1 && (
                  <div className="absolute h-px w-full bg-white-warm/5 top-[32px] -z-10" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Grid de marcas */}
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
          {ordenadas.map((marca, index) => (
            <article
              key={marca.id}
              id={marca.id}
              className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 scroll-mt-24"
            >
              {/* Lado izquierdo: emblema + datos */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-full max-w-[220px] aspect-[200/260] relative">
                  <Image
                    src={marca.emblema}
                    alt={marca.nombre}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="mt-6 w-full max-w-[220px]">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Fundada</p>
                  <p className="font-display text-2xl text-gold mb-4">
                    {marca.fundacion}
                    {marca.cese && <span className="text-white-warm/30 text-sm ml-2">– {marca.cese}</span>}
                  </p>

                  <p className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Origen</p>
                  <p className="text-white-warm/80 text-sm mb-1">{marca.pais}</p>
                  <p className="text-white-warm/40 text-xs mb-4">{marca.ciudad}</p>

                  <p className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Fundador</p>
                  <p className="text-white-warm/70 text-xs italic mb-4">{marca.fundador}</p>

                  {marca.webOficial && (
                    <a
                      href={marca.webOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gold/70 hover:text-gold transition-colors mt-2"
                    >
                      Web oficial →
                    </a>
                  )}
                </div>
              </div>

              {/* Lado derecho: contenido */}
              <div className="flex flex-col">
                {/* Numeración + nombre */}
                <div className="flex items-baseline gap-3 sm:gap-4 mb-2 flex-wrap">
                  <span
                    className="font-display text-4xl sm:text-5xl font-light opacity-20"
                    style={{ color: marca.acento }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white-warm">
                    {marca.nombre}
                  </h2>
                </div>

                <p
                  className="font-display italic text-sm mb-6 pl-0 sm:pl-16"
                  style={{ color: marca.acento }}
                >
                  « {marca.lema} »
                </p>

                {/* Línea dorada */}
                <div className="w-16 h-px bg-gradient-to-r from-gold/60 to-transparent mb-6 ml-16" />

                {/* Historia */}
                <p className="text-white-soft/75 text-sm md:text-base font-light leading-relaxed mb-8 pl-0 sm:pl-16">
                  {marca.historia}
                </p>

                {/* Innovaciones */}
                <div className="pl-0 sm:pl-16 mb-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                    Innovaciones y legado
                  </p>
                  <ul className="space-y-2">
                    {marca.innovaciones.map((inn, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-white-soft/65 text-xs md:text-sm font-light"
                      >
                        <span className="text-gold/50 mt-0.5 shrink-0">◆</span>
                        <span>{inn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Usuarios famosos */}
                <div className="pl-0 sm:pl-16">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
                    Intérpretes legendarios
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {marca.usuarios.map((u) => (
                      <span
                        key={u}
                        className="text-[11px] tracking-wide text-white-warm/60 border border-white-warm/10 px-3 py-1 hover:border-gold/30 hover:text-white-warm transition-colors"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA final */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white-warm/5 text-center">
          <p className="font-display text-xl italic text-white-warm/50 mb-2">
            Sea cual sea la marca de tu piano…
          </p>
          <p className="text-white-warm/40 text-sm font-light mb-6">
            …merece ser atendida por un profesional que conozca su tradición y sus secretos.
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

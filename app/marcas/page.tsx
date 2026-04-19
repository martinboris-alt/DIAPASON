import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marcas } from "@/config/marcas";

export const metadata: Metadata = {
  title: "Marcas de Piano · Historia y tradición · Diapasón",
  description:
    "Descubre las grandes casas de piano del mundo: Steinway, Bösendorfer, Bechstein, Blüthner, Fazioli, Yamaha, Kawai, Pleyel, Érard y Baldwin. Historia, modelos e innovaciones.",
  keywords: "marcas de piano, Steinway, Bösendorfer, Bechstein, Blüthner, Fazioli, Yamaha, Kawai, Pleyel, Érard, Baldwin, historia piano",
};

export default function MarcasPage() {
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
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Las Grandes
            <br />
            <em className="italic text-gold">Casas del Piano</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-2xl leading-relaxed">
            Un recorrido por las casas que han construido la historia del piano moderno. Desde
            los talleres artesanales del siglo XVIII hasta las fábricas contemporáneas, cada
            marca tiene su identidad sonora, sus innovaciones y sus intérpretes legendarios.
          </p>
        </div>

        {/* Wall of logos */}
        <div className="max-w-7xl mx-auto px-6 py-10 border-b border-white-warm/5">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white-warm/30 text-center mb-8">
            Las diez grandes casas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white-warm/5">
            {ordenadas.map((m) => (
              <Link
                key={m.id}
                href={`/marcas/${m.id}`}
                className="group bg-piano-black p-6 flex items-center justify-center h-24 hover:bg-piano-black-soft transition-colors"
                title={m.nombre}
              >
                <div className="relative w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                  <Image src={m.logo} alt={m.nombre} fill className="object-contain" unoptimized />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-7xl mx-auto px-6 py-10 border-b border-white-warm/5">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white-warm/30 text-center mb-8">
            Línea temporal · de 1780 a hoy
          </p>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {ordenadas.map((m) => (
              <Link
                key={m.id}
                href={`/marcas/${m.id}`}
                className="shrink-0 flex flex-col items-center min-w-[90px] group py-2"
              >
                <span className="text-[10px] tracking-widest uppercase text-white-warm/30 group-hover:text-gold transition-colors">
                  {m.fundacion}
                </span>
                <div className="w-2 h-2 rounded-full my-2 border border-gold/40 group-hover:bg-gold transition-colors" />
                <span className="text-[10px] tracking-wider text-white-warm/60 group-hover:text-white-warm transition-colors text-center leading-tight">
                  {m.nombre.split(" ")[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white-warm/5">
            {ordenadas.map((marca) => (
              <Link
                key={marca.id}
                href={`/marcas/${marca.id}`}
                className="bg-piano-black group hover:bg-piano-black-soft transition-colors p-6 flex flex-col"
              >
                {/* Emblema */}
                <div className="relative w-full aspect-[200/260] mb-5">
                  <Image
                    src={marca.emblema}
                    alt={marca.nombre}
                    fill
                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                    unoptimized
                  />
                </div>

                {/* Datos */}
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-2">
                  {marca.fundacion}{marca.cese && ` – ${marca.cese}`} · {marca.pais.split(" /")[0]}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-white-warm leading-tight mb-2 group-hover:text-gold transition-colors">
                  {marca.nombre}
                </h2>
                <p
                  className="font-display italic text-xs mb-4"
                  style={{ color: marca.acento }}
                >
                  « {marca.lema} »
                </p>
                <p className="text-white-soft/60 text-xs leading-relaxed font-light flex-1 mb-5">
                  {marca.resumen}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-4 border-t border-white-warm/5 text-[10px] tracking-wide text-white-warm/40">
                  {marca.produccionAnual && (
                    <span>{marca.produccionAnual}</span>
                  )}
                  <span className="ml-auto text-gold/70 tracking-widest uppercase group-hover:text-gold transition-colors">
                    Leer más →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white-warm/5 text-center">
          <p className="font-display text-xl italic text-white-warm/50 mb-2">
            Sea cual sea la marca de tu piano…
          </p>
          <p className="text-white-warm/40 text-sm font-light mb-6">
            …merece ser atendida por un profesional que conozca su tradición y sus secretos.
          </p>
          <Link
            href="/#contacto"
            className="inline-block mt-4 px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Solicitar afinación
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { heroFoto } from "@/config/fotos";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1.2s ease, transform 1.2s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroFoto.src}
          alt={heroFoto.alt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-piano-black/70 via-piano-black/50 to-piano-black" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
        }} />
      </div>

      {/* Decorative lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent ml-8 hidden lg:block" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent mr-8 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
          Maestro Afinador
        </p>

        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white-warm leading-tight mb-6"
        >
          El Arte de la
          <br />
          <em className="font-display italic text-gold">Afinación Perfecta</em>
        </h1>

        <p className="text-white-soft/70 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto mb-10 leading-relaxed">
          Más de una década dedicada al cuidado y la afinación de pianos.
          Cada nota, un compromiso con la excelencia musical.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Solicitar Afinación
          </button>
          <button
            onClick={() => {
              document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 border border-white/20 text-white-warm text-xs tracking-widest uppercase font-light hover:border-gold/60 hover:text-gold transition-all duration-300"
          >
            Ver Servicios
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

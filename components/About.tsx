"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { sobreMiFoto } from "@/config/fotos";

const stats = [
  { value: "10+", label: "Años de experiencia" },
  { value: "500+", label: "Pianos afinados" },
  { value: "100%", label: "Satisfacción garantizada" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".about-anim").forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "translateY(0)";
              }, i * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sobre-mi" ref={sectionRef} className="py-28 px-6 bg-piano-black-soft overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div
            className="about-anim relative"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="relative aspect-[3/4] max-w-md">
              <Image
                src={sobreMiFoto.src}
                alt={sobreMiFoto.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gold frame decoration */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/40" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-piano-black border border-gold/20 p-6 hidden md:block">
              <p className="font-display text-3xl font-semibold text-gold">A440</p>
              <p className="text-xs tracking-widest uppercase text-white/50 mt-1">Estándar Internacional</p>
            </div>
          </div>

          {/* Text side */}
          <div className="flex flex-col gap-6">
            <div
              className="about-anim"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                Sobre mí
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm leading-tight">
                Pasión por la
                <br />
                <em className="italic text-gold">precisión sonora</em>
              </h2>
            </div>

            <div
              className="about-anim"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <div className="w-12 h-px bg-gold/60 mb-6" />
              <p className="text-white-soft/70 text-base leading-relaxed font-light mb-4">
                Soy Diego Juica, fundador de Diapasón y técnico afinador de pianos con más de una década de experiencia.
                Mi pasión por los instrumentos de teclado nació desde temprana edad y me llevó
                a formarme con maestros reconocidos a nivel internacional.
              </p>
              <p className="text-white-soft/70 text-base leading-relaxed font-light">
                Trabajo con todo tipo de pianos, desde instrumentos familiares hasta pianos de
                concierto profesional. Mi compromiso es devolver a cada instrumento su voz
                original, con la precisión que la música merece.
              </p>
            </div>

            {/* Stats */}
            <div
              className="about-anim grid grid-cols-3 gap-6 pt-8 border-t border-white/10"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-semibold text-gold">{s.value}</p>
                  <p className="text-xs tracking-wide text-white/40 uppercase mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div
              className="about-anim pt-4"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">
                Certificaciones y formación
              </p>
              <div className="flex flex-wrap gap-3">
                {["PTG Miembro", "Formación Europa", "Steinway Certified", "Técnico Yamaha"].map((c) => (
                  <span
                    key={c}
                    className="text-xs tracking-wider uppercase text-gold/60 border border-gold/20 px-3 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

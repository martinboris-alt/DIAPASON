"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const partes = [
  {
    id: "cuerdas",
    nombre: "Cuerdas",
    descripcion:
      "El corazón del piano. Fabricadas en acero de alta tensión, cada cuerda está afinada a una frecuencia específica. Un piano de cola tiene alrededor de 230 cuerdas.",
  },
  {
    id: "martillos",
    nombre: "Martillos y Mecanismo",
    descripcion:
      "El mecanismo de acción transfiere el movimiento del dedo a los martillos forrados de fieltro que golpean las cuerdas. Su regulación precisa determina la sensibilidad al tacto.",
  },
  {
    id: "tabla",
    nombre: "Tabla armónica",
    descripcion:
      "El amplificador natural del piano. Esta delgada placa de madera de abeto resuena con las vibraciones de las cuerdas y proyecta el sonido con riqueza y profundidad.",
  },
  {
    id: "arpa",
    nombre: "Arpa de hierro",
    descripcion:
      "Marco de hierro fundido que soporta la enorme tensión de las cuerdas — hasta 20 toneladas. Garantiza la estabilidad de la afinación frente a cambios de temperatura y humedad.",
  },
  {
    id: "apagadores",
    nombre: "Apagadores",
    descripcion:
      "Pequeñas piezas de fieltro que silencian las cuerdas al soltar la tecla. El pedal derecho (sustain) los levanta todos, permitiendo que las notas resuenen libremente.",
  },
  {
    id: "pedales",
    nombre: "Pedales",
    descripcion:
      "Los tres pedales modifican el sonido de distintas formas: el sustain prolonga las notas, el sostenuto sostiene notas seleccionadas, y el una corda suaviza el timbre.",
  },
];

export default function PianoAnatomy() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate parts
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % partes.length);
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSelect = (i: number) => {
    setActive(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % partes.length);
    }, 3500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".anatomy-anim").forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "translateY(0)";
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-piano-black-soft overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 anatomy-anim" style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Conocimiento y precisión
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm mb-4">
            Anatomía del Piano
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <div
            className="anatomy-anim relative flex items-center justify-center"
            style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent rounded-full blur-3xl" />

            <div className="relative w-full max-w-lg aspect-square">
              <Image
                src="/images/anatomia-piano.png"
                alt="Anatomía de un piano de cola"
                fill
                className="object-contain mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Parts */}
          <div className="anatomy-anim flex flex-col gap-2" style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>

            {/* Part list */}
            <div className="flex flex-col gap-1 mb-8">
              {partes.map((parte, i) => (
                <button
                  key={parte.id}
                  onClick={() => handleSelect(i)}
                  className={`text-left px-4 py-3 border-l-2 transition-all duration-300 group ${
                    active === i
                      ? "border-gold bg-gold/5 text-white-warm"
                      : "border-white-warm/10 text-white-warm/40 hover:border-gold/40 hover:text-white-warm/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm tracking-widest uppercase font-light transition-colors duration-300 ${active === i ? "text-gold" : ""}`}>
                      {parte.nombre}
                    </span>
                    <span className={`text-gold transition-all duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}>
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Description card */}
            <div className="relative border border-gold/20 p-6 min-h-[120px]">
              <div className="absolute top-0 left-0 w-8 h-px bg-gold" />
              <div className="absolute top-0 left-0 w-px h-8 bg-gold" />
              <div className="absolute bottom-0 right-0 w-8 h-px bg-gold" />
              <div className="absolute bottom-0 right-0 w-px h-8 bg-gold" />

              <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-light">
                {partes[active].nombre}
              </p>
              <p
                key={active}
                className="text-white-soft/70 text-sm leading-relaxed font-light"
                style={{ animation: "fadeIn 0.4s ease" }}
              >
                {partes[active].descripcion}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-4 justify-center">
              {partes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    active === i ? "bg-gold w-4" : "bg-white-warm/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

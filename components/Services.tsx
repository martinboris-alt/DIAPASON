"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "Afinación de Piano",
    description:
      "Afinación precisa de todos los tipos de piano — de cola, vertical y digital. Utilizo herramientas profesionales y técnicas auditivas refinadas para alcanzar el estándar A440.",
    detail: "Desde $XX USD",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Reparación y Regulación",
    description:
      "Diagnóstico y reparación de mecanismos, teclas, pedales y cuerdas. Regulación completa de la acción para restaurar la sensibilidad y respuesta del teclado.",
    detail: "Presupuesto personalizado",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Mantenimiento Preventivo",
    description:
      "Plan de mantenimiento periódico para preservar la vida útil de su instrumento. Incluye limpieza interna, lubricación de mecanismos y evaluación general del estado.",
    detail: "Plan anual disponible",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Consultoría y Valuación",
    description:
      "Asesoramiento profesional para la compra o venta de pianos. Inspección técnica detallada, valuación de mercado y recomendaciones según su nivel y necesidades.",
    detail: "Consulta disponible",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".service-card").forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = "1";
                (card as HTMLElement).style.transform = "translateY(0)";
              }, i * 150);
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
    <section id="servicios" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-piano-black-soft">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Qué ofrezco
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm mb-4">
            Servicios Profesionales
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gold/10">
          {services.map((s, i) => (
            <div
              key={i}
              className="service-card bg-piano-black-soft p-10 group hover:bg-piano-black-mid transition-all duration-500 cursor-default"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, background 0.3s ease",
              }}
            >
              <div className="text-gold/50 mb-6 group-hover:text-gold transition-colors duration-300">
                {s.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-white-warm mb-4 tracking-wide">
                {s.title}
              </h3>
              <p className="text-white-soft/60 text-sm leading-relaxed mb-6 font-light">
                {s.description}
              </p>
              <span className="text-xs tracking-widest uppercase text-gold/70 group-hover:text-gold transition-colors duration-300">
                {s.detail} →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

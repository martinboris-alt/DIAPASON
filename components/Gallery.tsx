"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const photos = [
  {
    src: "/images/gallery-1.svg",
    alt: "Afinación de piano de cola",
    caption: "Piano de cola Steinway & Sons",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/gallery-2.svg",
    alt: "Detalle de cuerdas del piano",
    caption: "Cuerdas y martillos",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-3.svg",
    alt: "Mecanismo del piano",
    caption: "Regulación de mecanismo",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-4.svg",
    alt: "Piano vertical en sala",
    caption: "Piano vertical clásico",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/images/gallery-5.svg",
    alt: "Trabajo de afinación",
    caption: "Proceso de afinación",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-6.svg",
    alt: "Detalle de teclas",
    caption: "Teclas restauradas",
    span: "col-span-1 row-span-1",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight" && selected !== null)
        setSelected((selected + 1) % photos.length);
      if (e.key === "ArrowLeft" && selected !== null)
        setSelected((selected - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".gallery-item").forEach((item, i) => {
              setTimeout(() => {
                (item as HTMLElement).style.opacity = "1";
                (item as HTMLElement).style.transform = "scale(1)";
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="galeria" ref={sectionRef} className="py-28 px-6 bg-piano-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
              Mi trabajo
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm mb-4">
              Galería
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[220px] md:auto-rows-[260px]">
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`gallery-item relative overflow-hidden cursor-pointer group ${photo.span}`}
                style={{
                  opacity: 0,
                  transform: "scale(0.97)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
                onClick={() => setSelected(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-piano-black/0 group-hover:bg-piano-black/50 transition-all duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-xs tracking-widest uppercase text-gold">{photo.caption}</p>
                </div>
                {/* Gold corner */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-piano-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[85vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[selected].src}
              alt={photos[selected].alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <p className="absolute -bottom-8 left-0 right-0 text-center text-xs tracking-widest uppercase text-gold/70">
              {photos[selected].caption}
            </p>

            {/* Arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold transition-colors p-2 text-2xl"
              onClick={() => setSelected((selected - 1 + photos.length) % photos.length)}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold transition-colors p-2 text-2xl"
              onClick={() => setSelected((selected + 1) % photos.length)}
            >
              →
            </button>

            {/* Close */}
            <button
              className="absolute -top-10 right-0 text-white/50 hover:text-gold transition-colors text-sm tracking-widest uppercase"
              onClick={() => setSelected(null)}
            >
              Cerrar ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

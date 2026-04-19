"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { galeriaMedia, type MediaItem } from "@/config/media";

const spanMap = {
  normal: "col-span-1 row-span-1",
  alto:   "col-span-1 row-span-2",
  ancho:  "col-span-2 row-span-1",
};

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight" && selected !== null)
        setSelected((selected + 1) % galeriaMedia.length);
      if (e.key === "ArrowLeft" && selected !== null)
        setSelected((selected - 1 + galeriaMedia.length) % galeriaMedia.length);
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

  const current = selected !== null ? galeriaMedia[selected] : null;

  return (
    <>
      <section id="galeria" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-piano-black">
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
            {galeriaMedia.map((item, i) => (
              <div
                key={i}
                className={`gallery-item relative overflow-hidden cursor-pointer group ${spanMap[item.span]}`}
                style={{
                  opacity: 0,
                  transform: "scale(0.97)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
                onClick={() => setSelected(i)}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <>
                    <video
                      src={item.src}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                    />
                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center bg-piano-black/40 group-hover:border-gold group-hover:bg-piano-black/20 transition-all duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold ml-0.5">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-piano-black/0 group-hover:bg-piano-black/50 transition-all duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-xs tracking-widest uppercase text-gold">{item.caption}</p>
                </div>
                {/* Gold corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {current !== null && selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-piano-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {current.type === "image" ? (
              <div className="relative aspect-video">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            ) : (
              <video
                src={current.src}
                poster={current.poster}
                controls
                autoPlay
                className="w-full max-h-[80vh] object-contain"
              />
            )}

            <p className="mt-4 text-center text-xs tracking-widest uppercase text-gold/70">
              {current.caption}
            </p>

            {/* Arrows */}
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center bg-piano-black/50 sm:bg-transparent rounded-full text-white-warm/80 hover:text-gold transition-colors text-2xl touch-manipulation"
              aria-label="Anterior"
              onClick={() => setSelected((selected - 1 + galeriaMedia.length) % galeriaMedia.length)}
            >
              ←
            </button>
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center bg-piano-black/50 sm:bg-transparent rounded-full text-white-warm/80 hover:text-gold transition-colors text-2xl touch-manipulation"
              aria-label="Siguiente"
              onClick={() => setSelected((selected + 1) % galeriaMedia.length)}
            >
              →
            </button>

            {/* Close */}
            <button
              className="absolute -top-12 sm:-top-10 right-0 text-white-warm/70 hover:text-gold transition-colors text-xs sm:text-sm tracking-widest uppercase px-3 py-2 touch-manipulation"
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

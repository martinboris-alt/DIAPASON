"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { galeriaMedia } from "@/config/media";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ANIM } from "@/lib/animation";

const spanMap = {
  normal: "col-span-1 row-span-1",
  alto:   "col-span-1 row-span-2",
  ancho:  "col-span-2 row-span-1",
};

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const closeButtonRef          = useRef<HTMLButtonElement>(null);
  const modalRef                = useRef<HTMLDivElement>(null);

  const sectionRef = useScrollReveal<HTMLElement>({
    selector: ".gallery-item",
    stagger: ANIM.GALLERY_STAGGER,
    threshold: 0.1,
    finalTransform: "scale(1)",
  });

  // Keyboard navigation + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null) return;

      if (e.key === "Escape") { setSelected(null); return; }
      if (e.key === "ArrowRight") { setSelected((selected + 1) % galeriaMedia.length); return; }
      if (e.key === "ArrowLeft")  { setSelected((selected - 1 + galeriaMedia.length) % galeriaMedia.length); return; }

      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Auto-focus close button when modal opens
  useEffect(() => {
    if (selected === null) return;
    const id = setTimeout(() => closeButtonRef.current?.focus(), ANIM.AUTOFOCUS_DELAY);
    return () => clearTimeout(id);
  }, [selected]);

  const current = selected !== null ? galeriaMedia[selected] : null;

  return (
    <>
      <section id="galeria" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-piano-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">Mi trabajo</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm mb-4">Galería</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[220px] md:auto-rows-[260px]">
            {galeriaMedia.map((item, i) => (
              <div
                key={i}
                className={`gallery-item relative overflow-hidden cursor-pointer group ${spanMap[item.span]}`}
                style={{ opacity: 0, transform: "scale(0.97)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
                onClick={() => setSelected(i)}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${item.caption}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(i); } }}
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
                      aria-label={item.caption}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center bg-piano-black/40 group-hover:border-gold group-hover:bg-piano-black/20 transition-all duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold ml-0.5" aria-hidden="true">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-piano-black/0 group-hover:bg-piano-black/50 transition-all duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-xs tracking-widest uppercase text-gold">{item.caption}</p>
                </div>
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-300" aria-hidden="true" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/60 transition-all duration-300" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {current !== null && selected !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería — ${current.caption}`}
          className="fixed inset-0 z-50 bg-piano-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            ref={modalRef}
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
                aria-label={current.caption}
              />
            )}

            <p className="mt-4 text-center text-xs tracking-widest uppercase text-gold/70">
              {current.caption}
            </p>

            {/* Arrows */}
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center bg-piano-black/50 sm:bg-transparent rounded-full text-white-warm/80 hover:text-gold transition-colors text-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label="Imagen anterior"
              onClick={() => setSelected((selected - 1 + galeriaMedia.length) % galeriaMedia.length)}
            >
              ←
            </button>
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center bg-piano-black/50 sm:bg-transparent rounded-full text-white-warm/80 hover:text-gold transition-colors text-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label="Imagen siguiente"
              onClick={() => setSelected((selected + 1) % galeriaMedia.length)}
            >
              →
            </button>

            {/* Close */}
            <button
              ref={closeButtonRef}
              className="absolute -top-12 sm:-top-10 right-0 text-white-warm/70 hover:text-gold transition-colors text-xs sm:text-sm tracking-widest uppercase px-3 py-2 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              onClick={() => setSelected(null)}
              aria-label="Cerrar galería"
            >
              Cerrar ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

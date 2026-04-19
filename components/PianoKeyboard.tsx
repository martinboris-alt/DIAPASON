"use client";

import { useMemo, useEffect, useRef } from "react";

interface Props {
  activeNotes: Set<string>;
  /** Si true, el teclado hace auto-scroll hacia la zona activa en móvil */
  autoScroll?: boolean;
}

type PianoKey = {
  note:    string;   // e.g. "C4"
  isBlack: boolean;
  /** índice de la tecla blanca (para posicionar las negras). Solo en teclas blancas */
  whiteIndex?: number;
};

// Genera las 88 teclas del piano estándar (A0 a C8, MIDI 21-108)
function buildKeys(): PianoKey[] {
  const WHITES = ["C", "D", "E", "F", "G", "A", "B"];
  const BLACK_AFTER = ["C", "D", "F", "G", "A"]; // sol sostenido no existe después de E y B
  const keys: PianoKey[] = [];
  let whiteIdx = 0;

  // A0, A#0, B0
  keys.push({ note: "A0",  isBlack: false, whiteIndex: whiteIdx++ });
  keys.push({ note: "A#0", isBlack: true });
  keys.push({ note: "B0",  isBlack: false, whiteIndex: whiteIdx++ });

  // Octavas 1 a 7
  for (let oct = 1; oct <= 7; oct++) {
    for (const n of WHITES) {
      keys.push({ note: `${n}${oct}`, isBlack: false, whiteIndex: whiteIdx++ });
      if (BLACK_AFTER.includes(n)) {
        keys.push({ note: `${n}#${oct}`, isBlack: true });
      }
    }
  }

  // C8 (última tecla)
  keys.push({ note: "C8", isBlack: false, whiteIndex: whiteIdx++ });
  return keys;
}

// Normaliza "Cs4" (notación Tone.js) a "C#4"
function normalize(note: string): string {
  return note.replace(/s/i, "#");
}

export default function PianoKeyboard({ activeNotes, autoScroll = true }: Props) {
  const keys = useMemo(buildKeys, []);
  const whiteKeys = useMemo(() => keys.filter(k => !k.isBlack), [keys]);
  const totalWhites = whiteKeys.length; // 52

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: mantener la tecla activa visible en móvil
  useEffect(() => {
    if (!autoScroll || activeNotes.size === 0) return;
    const container = containerRef.current;
    if (!container) return;
    // Buscar la primera tecla activa y su posición
    const firstActive = Array.from(activeNotes)[0];
    if (!firstActive) return;
    const normalized = normalize(firstActive);
    const keyEl = container.querySelector<HTMLElement>(`[data-note="${normalized}"]`);
    if (!keyEl) return;
    const containerRect = container.getBoundingClientRect();
    const keyRect       = keyEl.getBoundingClientRect();
    // Solo scroll si la tecla está fuera del viewport del contenedor
    if (keyRect.left < containerRect.left || keyRect.right > containerRect.right) {
      keyEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeNotes, autoScroll]);

  // Activa el highlight si la tecla está en el set (considerando notaciones #/s)
  const isActive = (note: string): boolean => {
    if (activeNotes.has(note)) return true;
    // Probar variación con 's' por si vienen así
    const withS = note.replace("#", "s");
    if (activeNotes.has(withS)) return true;
    return false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto bg-piano-black-mid border border-white-warm/10 scroll-smooth"
    >
      <div
        className="relative h-28 sm:h-32 md:h-36"
        style={{ width: `${totalWhites * 18}px`, minWidth: "100%" }}
      >
        {/* Teclas blancas */}
        <div className="absolute inset-0 flex">
          {whiteKeys.map(k => {
            const active = isActive(k.note);
            return (
              <div
                key={k.note}
                data-note={k.note}
                className={`flex-1 border-r border-piano-black/40 relative transition-colors duration-75 ${
                  active
                    ? "bg-gradient-to-b from-gold/80 to-gold shadow-[inset_0_-6px_12px_rgba(201,168,76,0.4)]"
                    : "bg-white-warm"
                }`}
              >
                {/* Etiqueta sutil del Do central (C4) */}
                {k.note === "C4" && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] tracking-wider text-piano-black/40 font-medium">
                    C4
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Teclas negras (absolutas, posicionadas encima) */}
        {keys.map(k => {
          if (!k.isBlack) return null;
          // Encontrar la tecla blanca inmediatamente anterior para calcular la posición
          const blackKeyIdx = keys.indexOf(k);
          const prevWhite = keys.slice(0, blackKeyIdx).reverse().find(key => !key.isBlack);
          if (!prevWhite || prevWhite.whiteIndex === undefined) return null;
          // La negra se sitúa entre la blanca anterior y la siguiente
          const leftPct = ((prevWhite.whiteIndex + 0.7) / totalWhites) * 100;
          const widthPct = (0.6 / totalWhites) * 100;
          const active = isActive(k.note);

          return (
            <div
              key={k.note}
              data-note={k.note}
              className={`absolute top-0 h-[62%] transition-colors duration-75 z-10 border border-piano-black/80 ${
                active
                  ? "bg-gradient-to-b from-gold-dark to-gold shadow-[inset_0_-4px_8px_rgba(201,168,76,0.5)]"
                  : "bg-piano-black"
              }`}
              style={{
                left:  `${leftPct}%`,
                width: `${widthPct}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

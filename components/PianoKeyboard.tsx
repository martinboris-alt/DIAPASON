"use client";

import { useMemo, useEffect, useRef, useState } from "react";

export interface PianoNote {
  time:     number;
  duration: number;
  name:     string; // "C#4", "A4", etc.
}

interface Props {
  notes:           PianoNote[];
  /** ref al tiempo actual de reproducción en segundos (transport-time) */
  currentTimeRef:  React.RefObject<number>;
  /** ventana futura (en segundos) a mostrar en el visualizador 3D */
  lookAhead?:      number;
  /** habilita auto-scroll hacia la zona activa en móvil */
  autoScroll?:     boolean;
  /** indica si está reproduciendo (para empezar/parar la animación) */
  isPlaying:       boolean;
}

type PianoKey = { note: string; isBlack: boolean; whiteIndex?: number };

// Genera las 88 teclas del piano estándar (A0 a C8, MIDI 21-108)
function buildKeys(): PianoKey[] {
  const WHITES = ["C", "D", "E", "F", "G", "A", "B"];
  const BLACK_AFTER = ["C", "D", "F", "G", "A"];
  const keys: PianoKey[] = [];
  let whiteIdx = 0;

  keys.push({ note: "A0",  isBlack: false, whiteIndex: whiteIdx++ });
  keys.push({ note: "A#0", isBlack: true });
  keys.push({ note: "B0",  isBlack: false, whiteIndex: whiteIdx++ });

  for (let oct = 1; oct <= 7; oct++) {
    for (const n of WHITES) {
      keys.push({ note: `${n}${oct}`, isBlack: false, whiteIndex: whiteIdx++ });
      if (BLACK_AFTER.includes(n)) {
        keys.push({ note: `${n}#${oct}`, isBlack: true });
      }
    }
  }
  keys.push({ note: "C8", isBlack: false, whiteIndex: whiteIdx++ });
  return keys;
}

const norm = (n: string) => n.replace(/s/gi, "#");

export default function PianoKeyboard({
  notes, currentTimeRef, lookAhead = 3.5, autoScroll = true, isPlaying,
}: Props) {
  const keys      = useMemo(buildKeys, []);
  const whiteKeys = useMemo(() => keys.filter(k => !k.isBlack), [keys]);
  const totalWhites = whiteKeys.length; // 52

  // Mapa: nombre de nota → posición/ancho en % del teclado
  const noteLayout = useMemo(() => {
    const map: Record<string, { left: number; width: number; isBlack: boolean }> = {};
    for (const k of keys) {
      if (!k.isBlack && k.whiteIndex !== undefined) {
        map[k.note] = {
          left: (k.whiteIndex / totalWhites) * 100,
          width: (1 / totalWhites) * 100,
          isBlack: false,
        };
      } else if (k.isBlack) {
        const idx = keys.indexOf(k);
        const prevWhite = keys.slice(0, idx).reverse().find(x => !x.isBlack);
        if (prevWhite && prevWhite.whiteIndex !== undefined) {
          map[k.note] = {
            left: ((prevWhite.whiteIndex + 0.7) / totalWhites) * 100,
            width: (0.6 / totalWhites) * 100,
            isBlack: true,
          };
        }
      }
    }
    return map;
  }, [keys, totalWhites]);

  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef  = useRef<HTMLDivElement>(null);
  const fallRef      = useRef<HTMLDivElement>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const activeNotesRef = useRef<Set<string>>(new Set());
  const startIdxRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Pre-ordenar notas normalizadas y pre-calcular layout
  const orderedNotes = useMemo(() => {
    return notes
      .map(n => ({ ...n, name: norm(n.name) }))
      .filter(n => noteLayout[n.name])
      .sort((a, b) => a.time - b.time);
  }, [notes, noteLayout]);

  // Animación: lee currentTimeRef y actualiza DOM directamente (sin re-render)
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const t = currentTimeRef.current ?? 0;

      // ── Notas activas (las que están sonando en este momento)
      while (startIdxRef.current < orderedNotes.length &&
             orderedNotes[startIdxRef.current].time + orderedNotes[startIdxRef.current].duration < t) {
        startIdxRef.current++;
      }
      const newActive = new Set<string>();
      for (let i = startIdxRef.current; i < orderedNotes.length; i++) {
        const n = orderedNotes[i];
        if (n.time > t) break;
        if (t < n.time + n.duration) newActive.add(n.name);
      }
      const prev = activeNotesRef.current;
      if (newActive.size !== prev.size || !Array.from(newActive).every(n => prev.has(n))) {
        activeNotesRef.current = newActive;
        setActiveNotes(newActive);
      }

      // ── Caída 3D: posicionar notas que están dentro de la ventana visual
      const fall = fallRef.current;
      if (fall) {
        // Borrar y regenerar: buscar notas con t <= note.time <= t + lookAhead
        // Usamos transforms directos para eficiencia
        const children = fall.children;
        let childIdx = 0;
        for (let i = startIdxRef.current; i < orderedNotes.length; i++) {
          const n = orderedNotes[i];
          const delta = n.time - t;
          if (delta > lookAhead) break;
          if (n.time + n.duration < t) continue; // ya pasó
          const layout = noteLayout[n.name];
          if (!layout) continue;

          // Si delta > 0: aún no empezó, bajando
          // Si delta <= 0: ya está sonando (parte en el teclado)
          const topPct    = Math.max(0, (1 - delta / lookAhead)) * 100; // 0 arriba, 100 pegado al teclado
          const heightPct = (n.duration / lookAhead) * 100;

          let el = children[childIdx] as HTMLDivElement | undefined;
          if (!el) {
            el = document.createElement("div");
            el.className = "absolute rounded-t-md";
            fall.appendChild(el);
          }
          el.style.left   = `${layout.left}%`;
          el.style.width  = `${layout.width}%`;
          el.style.bottom = `${(delta / lookAhead) * 100}%`;
          el.style.height = `${heightPct}%`;
          el.style.background = layout.isBlack
            ? "linear-gradient(to bottom, rgba(201,168,76,0.9), rgba(154,122,46,0.8))"
            : "linear-gradient(to bottom, rgba(226,201,126,0.95), rgba(201,168,76,0.85))";
          el.style.boxShadow = delta < 0.15
            ? "0 0 18px rgba(201,168,76,0.7), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 0 6px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.2)";
          el.style.border = "1px solid rgba(201,168,76,0.5)";
          el.style.display = "block";
          childIdx++;
        }
        // Ocultar los sobrantes
        for (let i = childIdx; i < children.length; i++) {
          (children[i] as HTMLElement).style.display = "none";
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, orderedNotes, lookAhead, currentTimeRef, noteLayout]);

  // Reiniciar puntero cuando cambien las notas (nueva pieza)
  useEffect(() => { startIdxRef.current = 0; }, [orderedNotes]);

  // Si deja de reproducirse, limpiar teclas activas y el panel de caída
  useEffect(() => {
    if (!isPlaying) {
      activeNotesRef.current = new Set();
      setActiveNotes(new Set());
      startIdxRef.current = 0;
      if (fallRef.current) {
        for (const c of Array.from(fallRef.current.children)) {
          (c as HTMLElement).style.display = "none";
        }
      }
    }
  }, [isPlaying]);

  // Auto-scroll hacia la zona activa
  useEffect(() => {
    if (!autoScroll || activeNotes.size === 0) return;
    const container = containerRef.current;
    const firstActive = Array.from(activeNotes)[0];
    if (!container || !firstActive) return;
    const keyEl = container.querySelector<HTMLElement>(`[data-note="${firstActive}"]`);
    if (!keyEl) return;
    const cRect = container.getBoundingClientRect();
    const kRect = keyEl.getBoundingClientRect();
    if (kRect.left < cRect.left || kRect.right > cRect.right) {
      keyEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeNotes, autoScroll]);

  const isActive = (note: string) => activeNotes.has(note);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto bg-piano-black-mid border border-white-warm/10 scroll-smooth"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative"
        style={{ width: `${totalWhites * 18}px`, minWidth: "100%" }}
      >
        {/* ── Panel 3D de notas futuras cayendo ── */}
        <div
          className="relative h-40 sm:h-52 md:h-64 overflow-hidden bg-gradient-to-b from-piano-black to-piano-black-soft border-b border-gold/20"
          style={{
            transform: "rotateX(25deg)",
            transformOrigin: "bottom",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Líneas de referencia */}
          <div className="absolute inset-x-0 top-0 h-px bg-gold/10" />
          <div className="absolute inset-x-0 top-1/4 h-px bg-gold/5" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-gold/10" />
          <div className="absolute inset-x-0 top-3/4 h-px bg-gold/5" />
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold/60 shadow-[0_0_8px_rgba(201,168,76,0.5)]" />

          {/* Notas (se añaden dinámicamente via useEffect) */}
          <div ref={fallRef} className="absolute inset-0" />
        </div>

        {/* ── Teclado de 88 teclas ── */}
        <div
          ref={keyboardRef}
          className="relative h-24 sm:h-28 md:h-32"
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
                      ? "bg-gradient-to-b from-gold/80 to-gold shadow-[inset_0_-6px_12px_rgba(201,168,76,0.4),0_0_12px_rgba(201,168,76,0.3)]"
                      : "bg-white-warm"
                  }`}
                >
                  {k.note === "C4" && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] tracking-wider text-piano-black/40 font-medium">
                      C4
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Teclas negras */}
          {keys.map(k => {
            if (!k.isBlack) return null;
            const layout = noteLayout[k.note];
            if (!layout) return null;
            const active = isActive(k.note);
            return (
              <div
                key={k.note}
                data-note={k.note}
                className={`absolute top-0 h-[62%] transition-colors duration-75 z-10 border border-piano-black/80 ${
                  active
                    ? "bg-gradient-to-b from-gold-dark to-gold shadow-[inset_0_-4px_8px_rgba(201,168,76,0.5),0_0_10px_rgba(201,168,76,0.4)]"
                    : "bg-piano-black"
                }`}
                style={{
                  left: `${layout.left}%`,
                  width: `${layout.width}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useEffect, useRef, useState } from "react";

export type Hand = "right" | "left";

export interface PianoNote {
  time:     number;
  duration: number;
  name:     string; // "C#4", "A4", etc.
  hand?:    Hand;   // "right" | "left" (opcional)
}

// Paleta por mano
const HAND_COLORS = {
  right: {
    // Dorado cálido
    edge:      "rgba(201,168,76,0.55)",
    light:     "rgba(226,201,126,0.95)",
    base:      "rgba(201,168,76,0.85)",
    glow:      "rgba(201,168,76,0.7)",
    glowSoft:  "rgba(201,168,76,0.25)",
    whiteFrom: "from-gold/80",
    whiteTo:   "to-gold",
    blackFrom: "from-gold-dark",
    blackTo:   "to-gold",
    shadowWhite: "shadow-[inset_0_-6px_12px_rgba(201,168,76,0.4),0_0_12px_rgba(201,168,76,0.3)]",
    shadowBlack: "shadow-[inset_0_-4px_8px_rgba(201,168,76,0.5),0_0_10px_rgba(201,168,76,0.4)]",
    labelColor: "#E2C97E",
  },
  left: {
    // Turquesa frío
    edge:      "rgba(77,170,191,0.55)",
    light:     "rgba(127,210,226,0.95)",
    base:      "rgba(77,170,191,0.85)",
    glow:      "rgba(77,170,191,0.7)",
    glowSoft:  "rgba(77,170,191,0.25)",
    whiteFrom: "from-[#7ED2E2]/80",
    whiteTo:   "to-[#4DAABF]",
    blackFrom: "from-[#2E7A8B]",
    blackTo:   "to-[#4DAABF]",
    shadowWhite: "shadow-[inset_0_-6px_12px_rgba(77,170,191,0.4),0_0_12px_rgba(77,170,191,0.3)]",
    shadowBlack: "shadow-[inset_0_-4px_8px_rgba(77,170,191,0.5),0_0_10px_rgba(77,170,191,0.4)]",
    labelColor: "#7FD2E2",
  },
} as const;

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
  /** Mapa: nombre de nota → mano que la está tocando ("right" | "left" | "both") */
  const [activeMap, setActiveMap] = useState<Map<string, Hand | "both">>(new Map());
  const activeMapRef = useRef<Map<string, Hand | "both">>(new Map());
  const startIdxRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Pre-ordenar notas normalizadas y pre-calcular layout
  const orderedNotes = useMemo(() => {
    return notes
      .map(n => ({ ...n, name: norm(n.name), hand: n.hand ?? "right" }))
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

      // ── Notas activas (las que están sonando en este momento) con mano
      while (startIdxRef.current < orderedNotes.length &&
             orderedNotes[startIdxRef.current].time + orderedNotes[startIdxRef.current].duration < t) {
        startIdxRef.current++;
      }
      const newActive = new Map<string, Hand | "both">();
      for (let i = startIdxRef.current; i < orderedNotes.length; i++) {
        const n = orderedNotes[i];
        if (n.time > t) break;
        if (t < n.time + n.duration) {
          const prev = newActive.get(n.name);
          if (!prev) newActive.set(n.name, n.hand);
          else if (prev !== n.hand) newActive.set(n.name, "both");
        }
      }
      // Sólo actualizar estado si cambió
      const prev = activeMapRef.current;
      let changed = newActive.size !== prev.size;
      if (!changed) {
        for (const [k, v] of newActive) {
          if (prev.get(k) !== v) { changed = true; break; }
        }
      }
      if (changed) {
        activeMapRef.current = newActive;
        setActiveMap(newActive);
      }

      // ── Caída 3D: posicionar notas dentro de la ventana visual, coloreadas por mano
      const fall = fallRef.current;
      if (fall) {
        const children = fall.children;
        let childIdx = 0;
        for (let i = startIdxRef.current; i < orderedNotes.length; i++) {
          const n = orderedNotes[i];
          const delta = n.time - t;
          if (delta > lookAhead) break;
          if (n.time + n.duration < t) continue;
          const layout = noteLayout[n.name];
          if (!layout) continue;

          const heightPct = (n.duration / lookAhead) * 100;
          const colors = HAND_COLORS[n.hand];
          const almostPlaying = delta < 0.15;

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
          // Gradiente segun mano y tipo de tecla
          el.style.background = layout.isBlack
            ? `linear-gradient(to bottom, ${colors.base}, ${colors.base})`
            : `linear-gradient(to bottom, ${colors.light}, ${colors.base})`;
          el.style.boxShadow = almostPlaying
            ? `0 0 18px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`
            : `0 0 6px ${colors.glowSoft}, inset 0 1px 0 rgba(255,255,255,0.2)`;
          el.style.border = `1px solid ${colors.edge}`;
          el.style.display = "block";
          childIdx++;
        }
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
      activeMapRef.current = new Map();
      setActiveMap(new Map());
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
    if (!autoScroll || activeMap.size === 0) return;
    const container = containerRef.current;
    const firstActive = Array.from(activeMap.keys())[0];
    if (!container || !firstActive) return;
    const keyEl = container.querySelector<HTMLElement>(`[data-note="${firstActive}"]`);
    if (!keyEl) return;
    const cRect = container.getBoundingClientRect();
    const kRect = keyEl.getBoundingClientRect();
    if (kRect.left < cRect.left || kRect.right > cRect.right) {
      keyEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeMap, autoScroll]);

  const getHand = (note: string): Hand | "both" | undefined => activeMap.get(note);

  return (
    <div className="w-full">
      {/* Leyenda de manos */}
      <div className="flex items-center justify-center gap-5 mb-2 text-[10px] tracking-widest uppercase">
        <span className="flex items-center gap-2 text-white-warm/50">
          <span className="w-3 h-3 rounded-sm bg-gradient-to-b from-gold/90 to-gold" />
          Mano derecha
        </span>
        <span className="flex items-center gap-2 text-white-warm/50">
          <span className="w-3 h-3 rounded-sm bg-gradient-to-b from-[#7ED2E2] to-[#4DAABF]" />
          Mano izquierda
        </span>
      </div>

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
              const hand = getHand(k.note);
              const whiteClass = !hand ? "bg-white-warm"
                : hand === "both"
                  // Split visual: dorado arriba, turquesa abajo
                  ? `bg-gradient-to-b from-gold via-gold to-[#4DAABF] shadow-[inset_0_-6px_12px_rgba(201,168,76,0.4),0_0_12px_rgba(201,168,76,0.3)]`
                  : `bg-gradient-to-b ${HAND_COLORS[hand].whiteFrom} ${HAND_COLORS[hand].whiteTo} ${HAND_COLORS[hand].shadowWhite}`;
              return (
                <div
                  key={k.note}
                  data-note={k.note}
                  className={`flex-1 border-r border-piano-black/40 relative transition-colors duration-75 ${whiteClass}`}
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
            const hand = getHand(k.note);
            const blackClass = !hand ? "bg-piano-black"
              : hand === "both"
                ? `bg-gradient-to-b from-gold via-gold-dark to-[#4DAABF] shadow-[inset_0_-4px_8px_rgba(201,168,76,0.5),0_0_10px_rgba(201,168,76,0.4)]`
                : `bg-gradient-to-b ${HAND_COLORS[hand].blackFrom} ${HAND_COLORS[hand].blackTo} ${HAND_COLORS[hand].shadowBlack}`;
            return (
              <div
                key={k.note}
                data-note={k.note}
                className={`absolute top-0 h-[62%] transition-colors duration-75 z-10 border border-piano-black/80 ${blackClass}`}
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
    </div>
  );
}

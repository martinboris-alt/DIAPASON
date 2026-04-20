"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useMidiPlayer } from "@/hooks/useMidiPlayer";

const PdfViewer     = dynamic(() => import("@/components/PdfViewer"),     { ssr: false });
const PianoKeyboard = dynamic(() => import("@/components/PianoKeyboard"), { ssr: false });

interface Props {
  midiPath: string;
  pdfPath:  string;
  titulo: string;
  compositor: string;
}

export default function MidiPlayer({ midiPath, pdfPath, titulo, compositor }: Props) {
  const [showPdf,  setShowPdf]  = useState(false);
  const [showKeys, setShowKeys] = useState(true);

  const {
    state, progress, duration, tempo, volume,
    notesRef, currentTimeRef,
    handlePlay, handlePause, handleStop,
    handleSeek, handleTempoChange, handleVolumeChange,
    formatTime, realDuration, currentSec,
  } = useMidiPlayer(midiPath);

  return (
    <div className="border border-gold/20 bg-piano-black-soft">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white-warm/5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold/60 shrink-0" aria-hidden="true">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white-warm/80 font-display truncate">{titulo}</p>
          <p className="text-[10px] text-gold/50 tracking-wide">{compositor}</p>
        </div>
        {state === "loading" && (
          <span className="text-[10px] tracking-widest uppercase text-gold/50 animate-pulse" aria-live="polite">Cargando…</span>
        )}
        {state === "error" && (
          <span className="text-[10px] tracking-widest uppercase text-red-400/70" role="alert">MIDI no disponible</span>
        )}

        <button
          onClick={() => setShowKeys(v => !v)}
          aria-pressed={showKeys}
          className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-all duration-200 ${
            showKeys
              ? "border-gold/60 text-gold bg-gold/10"
              : "border-white-warm/15 text-white-warm/40 hover:border-gold/30 hover:text-gold"
          }`}
          title={showKeys ? "Ocultar teclado" : "Ver teclado"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden="true">
            <rect x="2" y="6" width="20" height="12" rx="1"/>
            <line x1="7"  y1="6" x2="7"  y2="14"/>
            <line x1="12" y1="6" x2="12" y2="14"/>
            <line x1="17" y1="6" x2="17" y2="14"/>
          </svg>
          <span className="hidden sm:inline">Teclado</span>
        </button>

        <button
          onClick={() => setShowPdf(v => !v)}
          aria-pressed={showPdf}
          className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-all duration-200 ${
            showPdf
              ? "border-gold/60 text-gold bg-gold/10"
              : "border-white-warm/15 text-white-warm/40 hover:border-gold/30 hover:text-gold"
          }`}
          title={showPdf ? "Ocultar partitura" : "Ver partitura"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          {showPdf ? "Ocultar" : "Partitura"}
        </button>
      </div>

      {showPdf && (
        <div className="border-b border-white-warm/5">
          <PdfViewer pdfPath={pdfPath} progress={progress} isPlaying={state === "playing"} />
        </div>
      )}

      {showKeys && (
        <div className="border-b border-white-warm/5 p-2">
          <PianoKeyboard
            notes={notesRef.current}
            currentTimeRef={currentTimeRef}
            isPlaying={state === "playing"}
            autoScroll={state === "playing"}
          />
        </div>
      )}

      <ProgressSlider
        progress={progress}
        disabled={duration === 0 || state === "loading"}
        onSeek={handleSeek}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3">
        <div className="flex items-center gap-2">
          {state === "playing" ? (
            <button onClick={handlePause} aria-label="Pausar"
              className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center border border-gold/40 text-gold hover:bg-gold/10 transition-colors touch-manipulation">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          ) : (
            <button onClick={handlePlay} disabled={state === "loading"} aria-label="Reproducir"
              className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center bg-gold text-piano-black hover:bg-gold-light transition-colors disabled:opacity-40 touch-manipulation">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5" aria-hidden="true">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </button>
          )}
          <button onClick={handleStop} disabled={state === "idle" || state === "loading"} aria-label="Detener"
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center border border-white-warm/10 text-white-warm/30 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20 touch-manipulation">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16"/>
            </svg>
          </button>
        </div>

        <span className="text-[10px] text-white-warm/30 tabular-nums" aria-live="polite" aria-atomic="true">
          {formatTime(currentSec)} / {formatTime(realDuration)}
        </span>

        <div className="flex items-center gap-2 sm:ml-auto order-3 sm:order-none basis-full sm:basis-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-white-warm/30 shrink-0" aria-hidden="true">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
          </svg>
          <input type="range" min="0.4" max="2" step="0.1" value={tempo}
            onChange={e => handleTempoChange(Number(e.target.value))}
            aria-label={`Tempo: ${Math.round(tempo * 100)}%`}
            className="flex-1 sm:w-20 sm:flex-none accent-gold h-1.5 cursor-pointer touch-manipulation"
          />
          <span className="text-[10px] text-white-warm/40 w-9 tabular-nums">{Math.round(tempo * 100)}%</span>
        </div>

        <div className="flex items-center gap-2 order-4 sm:order-none basis-full sm:basis-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-white-warm/30 shrink-0" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            aria-label="Volumen"
            className="flex-1 sm:w-20 sm:flex-none accent-gold h-1.5 cursor-pointer touch-manipulation"
          />
        </div>
      </div>

      {state === "loading" && (
        <div className="px-5 pb-3">
          <p className="text-[10px] text-white-warm/20">
            Cargando samples de piano Salamander Grand (primera vez puede tardar ~5s)…
          </p>
        </div>
      )}
    </div>
  );
}

function ProgressSlider({
  progress, disabled, onSeek,
}: {
  progress: number;
  disabled: boolean;
  onSeek: (r: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [hoverRatio, setHover]  = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getRatio = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setHover(getRatio(e.clientX));
    const onUp   = (e: PointerEvent) => { onSeek(getRatio(e.clientX)); setDragging(false); setHover(null); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragging, onSeek]);

  const displayRatio = hoverRatio ?? progress;

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(displayRatio * 100)}
      aria-label="Posición de reproducción"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={(e) => { if (disabled) return; e.preventDefault(); setDragging(true); setHover(getRatio(e.clientX)); }}
      onPointerMove={(e) => { if (disabled || dragging) return; setHover(getRatio(e.clientX)); }}
      onPointerLeave={() => { if (!dragging) setHover(null); }}
      className={`group relative h-1.5 hover:h-2 bg-white-warm/10 transition-all duration-150 ${
        disabled ? "cursor-default opacity-40" : "cursor-pointer"
      }`}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/60 to-gold transition-[width] duration-75"
        style={{ width: `${displayRatio * 100}%` }}
      />
      {!disabled && hoverRatio !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)] pointer-events-none"
          style={{ left: `${displayRatio * 100}%`, transform: "translate(-50%, -50%)" }}
        />
      )}
      {!disabled && hoverRatio !== null && (
        <div
          className="absolute -top-7 text-[10px] text-gold/70 bg-piano-black/80 px-2 py-0.5 border border-gold/20 pointer-events-none tabular-nums"
          style={{ left: `${displayRatio * 100}%`, transform: "translateX(-50%)" }}
        >
          {Math.round(displayRatio * 100)}%
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePlayerContext } from "@/context/PlayerContext";

const PdfViewer      = dynamic(() => import("@/components/PdfViewer"), { ssr: false });
const PianoKeyboard  = dynamic(() => import("@/components/PianoKeyboard"), { ssr: false });

interface Props {
  midiPath: string;
  pdfPath:  string;
  titulo: string;
  compositor: string;
}

type PlayState = "idle" | "loading" | "playing" | "paused" | "error";

export default function MidiPlayer({ midiPath, pdfPath, titulo, compositor }: Props) {
  const [state, setState]       = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tempo, setTempo]       = useState(1);
  const [volume, setVolume]     = useState(0.8);
  const [showPdf, setShowPdf]   = useState(false);
  const [showKeys, setShowKeys] = useState(true);

  const { register, requestPlay } = usePlayerContext();

  const toneRef      = useRef<typeof import("tone") | null>(null);
  const samplerRef   = useRef<InstanceType<typeof import("tone").Sampler> | null>(null);
  const partRef      = useRef<InstanceType<typeof import("tone").Part> | null>(null);
  const startTimeRef = useRef(0);
  const rafRef       = useRef<number>(0);
  const loadedRef    = useRef(false);
  const durationRef  = useRef(0);  // transport-duration (a 1× tempo)
  const baseBpmRef   = useRef(120); // BPM original del MIDI
  const tempoRef     = useRef(1);   // multiplicador actual de tempo
  const notesRef     = useRef<Array<{ time: number; duration: number; name: string; hand: "right" | "left" }>>([]);
  const currentTimeRef = useRef(0); // tiempo compensado para sync visual

  // Helper seguro para detener el Part evitando el error de tiempo negativo
  const safePart = {
    stop: () => { try { partRef.current?.stop("+0"); } catch {} },
    dispose: () => { try { partRef.current?.dispose(); } catch {} },
  };

  // Limpiar al desmontar
  // Registrar este player en el contexto global con su función de stop
  useEffect(() => {
    const unregister = register(midiPath, () => {
      cancelAnimationFrame(rafRef.current);
      safePart.stop();
      try { toneRef.current?.getTransport().stop(); } catch {}
      try { toneRef.current?.getTransport().cancel(); } catch {}
      setState("idle");
      setProgress(0);
    });
    return () => {
      unregister();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      safePart.stop();
      safePart.dispose();
      try { samplerRef.current?.dispose(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiPath]);

  const loadTone = useCallback(async () => {
    if (toneRef.current) return toneRef.current;
    const Tone = await import("tone");
    toneRef.current = Tone;
    return Tone;
  }, []);

  const loadSampler = useCallback(async (Tone: typeof import("tone")) => {
    if (samplerRef.current && loadedRef.current) return samplerRef.current;
    return new Promise<InstanceType<typeof Tone.Sampler>>((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: {
          C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3",
          C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", A5: "A5.mp3",
          C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3",
          C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3",
          C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", A6: "A6.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => { loadedRef.current = true; resolve(sampler); },
        onerror: reject,
      }).toDestination();
      samplerRef.current = sampler as InstanceType<typeof Tone.Sampler>;
    });
  }, []);

  const parseMidi = useCallback(async (midiUrl: string) => {
    const { Midi } = await import("@tonejs/midi");
    const res = await fetch(midiUrl);
    if (!res.ok) throw new Error(`No se pudo cargar el MIDI: ${res.status}`);
    const buf = await res.arrayBuffer();
    return new Midi(buf);
  }, []);

  const handlePlay = async () => {
    // Avisar al contexto: detener cualquier otro player activo
    requestPlay(midiPath);
    if (state === "paused" && partRef.current) {
      const Tone = toneRef.current!;
      await Tone.start();
      Tone.getTransport().start();
      setState("playing");
      animateProgress();
      return;
    }

    setState("loading");
    try {
      const Tone   = await loadTone();
      const sampler = await loadSampler(Tone);
      const midi   = await parseMidi(midiPath);

      // Limpiar part anterior
      safePart.stop();
      safePart.dispose();

      const totalDur = midi.duration;
      setDuration(totalDur);
      durationRef.current = totalDur; // actualizar ref inmediatamente

      // Construir notas de todos los tracks de piano
      // Detectar tracks con notas y decidir asignación de manos
      const tracksWithNotes = midi.tracks.filter(t => t.notes.length > 0);
      let rightTrackIdx = 0; // índice del track que es "mano derecha"
      const useTrackSplit = tracksWithNotes.length === 2;

      if (useTrackSplit) {
        // El track con mayor altura media es la mano derecha
        const avgPitch = (track: typeof tracksWithNotes[0]) =>
          track.notes.reduce((a, n) => a + n.midi, 0) / track.notes.length;
        rightTrackIdx = avgPitch(tracksWithNotes[0]) >= avgPitch(tracksWithNotes[1]) ? 0 : 1;
      }

      // Construir notas con asignación de mano
      const notes: Array<{
        time: number; note: string; duration: number; velocity: number;
        midi: number; hand: "right" | "left";
      }> = [];

      tracksWithNotes.forEach((track, trackIdx) => {
        for (const n of track.notes) {
          let hand: "right" | "left";
          if (useTrackSplit) {
            hand = trackIdx === rightTrackIdx ? "right" : "left";
          } else {
            // Un solo track: separar por altura (C4 = MIDI 60 como pivote)
            hand = n.midi >= 60 ? "right" : "left";
          }
          notes.push({
            time: n.time, note: n.name, duration: n.duration,
            velocity: n.velocity, midi: n.midi, hand,
          });
        }
      });
      notes.sort((a, b) => a.time - b.time);

      // Guardar notas para el teclado visual (normalizar el nombre + incluir hand)
      notesRef.current = notes.map(n => ({
        time: n.time,
        duration: n.duration,
        name: n.note.replace(/s/i, "#"), // "Cs4" → "C#4"
        hand: n.hand,
      }));

      // Crear Part de Tone
      const part = new Tone.Part((time, note) => {
        sampler.triggerAttackRelease(note.note, note.duration, time, note.velocity);
      }, notes);

      part.loop = false;
      partRef.current = part as InstanceType<typeof Tone.Part>;

      // Configurar transporte
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      const originalBpm = midi.header.tempos[0]?.bpm ?? 120;
      baseBpmRef.current = originalBpm;
      tempoRef.current   = tempo;
      transport.bpm.value = originalBpm * tempo;

      await Tone.start();
      transport.start("+0.1");
      part.start(0);
      startTimeRef.current = Date.now();

      setState("playing");
      animateProgress();

      // Auto-stop al terminar
      transport.schedule(() => {
        setState("idle");
        setProgress(0);
        cancelAnimationFrame(rafRef.current);
      }, totalDur + 0.5);

    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  const handlePause = () => {
    toneRef.current?.getTransport().pause();
    setState("paused");
    cancelAnimationFrame(rafRef.current);
  };

  const handleStop = () => {
    try { toneRef.current?.getTransport().stop(); } catch {}
    try { toneRef.current?.getTransport().cancel(); } catch {}
    safePart.stop();
    setState("idle");
    setProgress(0);
    currentTimeRef.current = 0;
    cancelAnimationFrame(rafRef.current);
  };

  const animateProgress = () => {
    const tick = () => {
      const Tone = toneRef.current;
      const pos = Tone?.getTransport().seconds ?? 0;
      // Compensar latencia del audio context para que lo visual coincida con lo que se oye
      const latency = Tone?.context?.lookAhead ?? 0;
      const visualPos = Math.max(0, pos - latency);
      currentTimeRef.current = visualPos;

      const dur = durationRef.current;
      setProgress(dur > 0 ? Math.min(pos / dur, 1) : 0);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Salta a una posición 0–1 de la canción
  const handleSeek = (ratio: number) => {
    const dur = durationRef.current;
    if (!toneRef.current || !partRef.current || dur === 0) return;
    const clamped = Math.max(0, Math.min(ratio, 0.999));
    const target  = clamped * dur;

    try {
      const Tone = toneRef.current;
      const transport = Tone.getTransport();
      // Silenciar notas sonando para evitar que queden "colgadas"
      try { samplerRef.current?.releaseAll(); } catch {}
      transport.seconds = target;
      currentTimeRef.current = target;
      setProgress(clamped);
    } catch (e) { console.error(e); }
  };

  const handleTempoChange = (v: number) => {
    setTempo(v);
    tempoRef.current = v;
    if (toneRef.current) {
      toneRef.current.getTransport().bpm.value = baseBpmRef.current * v;
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (samplerRef.current) {
      samplerRef.current.volume.value = Tone_dBFromLinear(v);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Duración real y tiempo actual en segundos (ajustados al tempo activo)
  const realDuration = duration / tempo;
  const currentSec   = progress * realDuration;

  return (
    <div className="border border-gold/20 bg-piano-black-soft">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white-warm/5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold/60 shrink-0">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white-warm/80 font-display truncate">{titulo}</p>
          <p className="text-[10px] text-gold/50 tracking-wide">{compositor}</p>
        </div>
        {state === "loading" && (
          <span className="text-[10px] tracking-widest uppercase text-gold/50 animate-pulse">Cargando…</span>
        )}
        {state === "error" && (
          <span className="text-[10px] tracking-widest uppercase text-red-400/70">MIDI no disponible</span>
        )}

        {/* Botón teclado */}
        <button
          onClick={() => setShowKeys(v => !v)}
          className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-all duration-200 ${
            showKeys
              ? "border-gold/60 text-gold bg-gold/10"
              : "border-white-warm/15 text-white-warm/40 hover:border-gold/30 hover:text-gold"
          }`}
          title={showKeys ? "Ocultar teclado" : "Ver teclado"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
            <rect x="2" y="6" width="20" height="12" rx="1"/>
            <line x1="7"  y1="6" x2="7"  y2="14"/>
            <line x1="12" y1="6" x2="12" y2="14"/>
            <line x1="17" y1="6" x2="17" y2="14"/>
          </svg>
          <span className="hidden sm:inline">Teclado</span>
        </button>

        {/* Botón ver partitura */}
        <button
          onClick={() => setShowPdf(v => !v)}
          className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-3 py-1.5 transition-all duration-200 ${
            showPdf
              ? "border-gold/60 text-gold bg-gold/10"
              : "border-white-warm/15 text-white-warm/40 hover:border-gold/30 hover:text-gold"
          }`}
          title={showPdf ? "Ocultar partitura" : "Ver partitura"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          {showPdf ? "Ocultar" : "Partitura"}
        </button>
      </div>

      {/* PDF Viewer sincronizado */}
      {showPdf && (
        <div className="border-b border-white-warm/5">
          <PdfViewer
            pdfPath={pdfPath}
            progress={progress}
            isPlaying={state === "playing"}
          />
        </div>
      )}

      {/* Teclado MIDI visual con notas cayendo */}
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

      {/* Progress bar */}
      <ProgressSlider
        progress={progress}
        disabled={duration === 0 || state === "loading"}
        onSeek={handleSeek}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3">
        {/* Play/Pause/Stop */}
        <div className="flex items-center gap-2">
          {state === "playing" ? (
            <button onClick={handlePause}
              className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center border border-gold/40 text-gold hover:bg-gold/10 transition-colors touch-manipulation">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          ) : (
            <button onClick={handlePlay} disabled={state === "loading"}
              className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center bg-gold text-piano-black hover:bg-gold-light transition-colors disabled:opacity-40 touch-manipulation">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </button>
          )}
          <button onClick={handleStop} disabled={state === "idle" || state === "loading"}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center border border-white-warm/10 text-white-warm/30 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20 touch-manipulation">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <rect x="4" y="4" width="16" height="16"/>
            </svg>
          </button>
        </div>

        {/* Time */}
        <span className="text-[10px] text-white-warm/30 tabular-nums">
          {formatTime(currentSec)} / {formatTime(realDuration)}
        </span>

        {/* Tempo */}
        <div className="flex items-center gap-2 sm:ml-auto order-3 sm:order-none basis-full sm:basis-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-white-warm/30 shrink-0">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
          </svg>
          <input type="range" min="0.4" max="2" step="0.1" value={tempo}
            onChange={e => handleTempoChange(Number(e.target.value))}
            className="flex-1 sm:w-20 sm:flex-none accent-gold h-1.5 cursor-pointer touch-manipulation"
            title={`Tempo: ${Math.round(tempo * 100)}%`}
          />
          <span className="text-[10px] text-white-warm/40 w-9 tabular-nums">{Math.round(tempo * 100)}%</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 order-4 sm:order-none basis-full sm:basis-auto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-white-warm/30 shrink-0">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            className="flex-1 sm:w-20 sm:flex-none accent-gold h-1.5 cursor-pointer touch-manipulation"
            title="Volumen"
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

// ── Slider de progreso interactivo (click + drag) ────────────────────────────
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
    const onUp   = (e: PointerEvent) => {
      onSeek(getRatio(e.clientX));
      setDragging(false);
      setHover(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, onSeek]);

  const displayRatio = hoverRatio ?? progress;

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragging(true);
        setHover(getRatio(e.clientX));
      }}
      onPointerMove={(e) => {
        if (disabled || dragging) return;
        setHover(getRatio(e.clientX));
      }}
      onPointerLeave={() => { if (!dragging) setHover(null); }}
      className={`group relative h-1.5 hover:h-2 bg-white-warm/10 transition-all duration-150 ${
        disabled ? "cursor-default opacity-40" : "cursor-pointer"
      }`}
    >
      {/* Fill */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/60 to-gold transition-[width] duration-75"
        style={{ width: `${displayRatio * 100}%` }}
      />
      {/* Handle (aparece en hover o drag) */}
      {!disabled && hoverRatio !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)] pointer-events-none"
          style={{ left: `${displayRatio * 100}%`, transform: "translate(-50%, -50%)" }}
        />
      )}
      {/* Tiempo tooltip en hover */}
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

// Convierte linear 0-1 a dB para Tone.js
function Tone_dBFromLinear(v: number): number {
  if (v === 0) return -Infinity;
  return 20 * Math.log10(v);
}

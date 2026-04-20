"use client";

import { useState, useRef, useCallback, useEffect, useId } from "react";
import Image from "next/image";
import { composers } from "@/config/composers";
import {
  generateComposition,
  generateVariation,
  type GeneratedNote,
  type CompositionResult,
  type VariationType,
} from "@/lib/composer-engine";

// ── Constantes ────────────────────────────────────────────────────────────────

const SLOT_COLORS  = ["#FF6B35", "#00D4FF", "#FFDD00", "#FF3CA0"];
const SLOT_LABELS  = ["A", "B", "C", "D"];
const PERIOD_BTNS  = ["Barroco", "Clásico", "Romántico", "Moderno"];
const VARIATION_TYPES: Array<{ id: VariationType; label: string; icon: string }> = [
  { id: "ornamental",   label: "Ornamental", icon: "♪" },
  { id: "inversion",    label: "Inversión",  icon: "↕" },
  { id: "augmentation", label: "Aumentación",icon: "⟷" },
  { id: "reharmonize",  label: "Rearmonizar",icon: "♭" },
];

interface Slot { composer: string | null; weight: number; }
interface KnobValue { tempo: number; mood: number; complexity: number; bars: number; humanize: number; }
type PlayState = "idle" | "generating" | "playing" | "paused";

const ALL_COMPOSERS = Object.keys(composers).sort();

// ── SVG Knob ─────────────────────────────────────────────────────────────────

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx: number, cy: number, r: number, s: number, e: number) {
  const a = polarXY(cx, cy, r, s), b = polarXY(cx, cy, r, e);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

function Knob({ value, onChange, color, label, sublabel, size = 60 }: {
  value: number; onChange: (v: number) => void; color: string;
  label: string; sublabel: string; size?: number;
}) {
  const startRef = useRef<{ y: number; val: number } | null>(null);
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const curDeg = -135 + value * 270;
  const dot = polarXY(cx, cy, r - 2, curDeg);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <svg width={size} height={size} className="cursor-ns-resize touch-none"
        role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={label}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); startRef.current = { y: e.clientY, val: value }; }}
        onPointerMove={e => { if (!startRef.current) return; onChange(Math.max(0, Math.min(1, startRef.current.val + (startRef.current.y - e.clientY) / 120))); }}
        onPointerUp={() => { startRef.current = null; }}
        onPointerCancel={() => { startRef.current = null; }}
      >
        <path d={arcPath(cx, cy, r, -135, 135)} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="4" strokeLinecap="round" />
        {value > 0.01 && <path d={arcPath(cx, cy, r, -135, curDeg)} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />}
        <circle cx={cx} cy={cy} r={r * 0.70} fill="#1a1a1a" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <circle cx={dot.x} cy={dot.y} r={3} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
        <circle cx={cx} cy={cy - r * 0.15} r={r * 0.28} fill="rgba(255,255,255,0.03)" />
      </svg>
      <span className="text-[9px] tracking-[0.2em] uppercase font-mono" style={{ color }}>{label}</span>
      <span className="text-[8px] text-white-warm/35 font-mono">{sublabel}</span>
    </div>
  );
}

// ── Piano Roll ────────────────────────────────────────────────────────────────

function midiFromName(name: string): number | null {
  const m = name.match(/^([A-G]#?)(-?\d+)$/);
  if (!m) return null;
  const ns: Record<string, number> = { C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11 };
  return (parseInt(m[2]) + 1) * 12 + (ns[m[1]] ?? 0);
}

function PianoRollDisplay({ notes, currentTime, totalDuration, isPlaying }: {
  notes: GeneratedNote[]; currentTime: number; totalDuration: number; isPlaying: boolean;
}) {
  if (notes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className="flex gap-1 items-end h-7">
          {[3,5,4,7,3,6,5,4,6,5,3,5].map((h, i) => (
            <div key={i} className="w-1.5 rounded-full opacity-15 animate-pulse"
              style={{ height: `${h * 3}px`, background: "#C9A84C", animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-white-warm/25 font-mono">Selecciona un compositor y presiona Generar</p>
      </div>
    );
  }
  const pitches   = notes.map(n => midiFromName(n.name)).filter(Boolean) as number[];
  const minPitch  = Math.min(...pitches);
  const maxPitch  = Math.max(...pitches);
  const pitchRange = Math.max(maxPitch - minPitch, 12);
  const W = 520, H = 76;
  const playheadX = totalDuration > 0 ? (currentTime / totalDuration) * W : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={W * f} y1={0} x2={W * f} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {notes.map((note, i) => {
        const midi = midiFromName(note.name);
        if (!midi) return null;
        const x = (note.time / totalDuration) * W;
        const w = Math.max(2, (note.duration / totalDuration) * W - 1);
        const y = H - ((midi - minPitch) / pitchRange) * (H - 6) - 4;
        const color = note.hand === "right" ? "#C9A84C" : "#4ECDC4";
        const active = isPlaying && currentTime >= note.time && currentTime <= note.time + note.duration;
        return <rect key={i} x={x} y={y} width={w} height={5} fill={color} opacity={active ? 1 : 0.6} rx={1}
          style={active ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined} />;
      })}
      {isPlaying && (
        <line x1={playheadX} y1={0} x2={playheadX} y2={H} stroke="white" strokeWidth="1.5" opacity={0.6} strokeDasharray="3 2" />
      )}
    </svg>
  );
}

// ── Chord Progression Display ─────────────────────────────────────────────────

function ChordDisplay({ labels, currentTime, plan }: {
  labels: string[]; currentTime: number;
  plan: CompositionResult | null;
}) {
  if (!plan || labels.length === 0) return (
    <div className="flex items-center gap-1">
      {["I","—","IV","—","V","—","I"].map((l, i) => (
        <span key={i} className="text-[9px] font-mono text-white/15 px-1">{l}</span>
      ))}
    </div>
  );

  const currentBeat = plan ? currentTime * (plan.plan.totalBeats / Math.max(currentTime + 0.01, 0.01)) : 0;
  const activeChordIdx = plan.plan.allChords.findIndex((c, i) => {
    const next = plan.plan.allChords[i + 1];
    return currentBeat >= c.startBeat && (!next || currentBeat < next.startBeat);
  });

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {plan.plan.allChords.map((chord, i) => {
        const isActive = i === activeChordIdx;
        return (
          <span
            key={i}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all duration-150"
            style={{
              background: isActive ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.04)",
              color: isActive ? "#C9A84C" : "rgba(255,255,255,0.35)",
              border: `1px solid ${isActive ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.07)"}`,
              boxShadow: isActive ? "0 0 6px rgba(201,168,76,0.3)" : "none",
            }}
          >
            {chord.label}
          </span>
        );
      })}
    </div>
  );
}

// ── Phrase Structure Display ──────────────────────────────────────────────────

function PhraseDisplay({ plan, currentTime }: {
  plan: CompositionResult["plan"] | null; currentTime: number;
}) {
  if (!plan) return null;
  const secsPerBeat = (plan.totalBeats > 0 && currentTime > 0) ? 1 : 0.5;
  const currentBeat = currentTime / secsPerBeat;

  return (
    <div className="flex items-center gap-1">
      {plan.phrases.map((phrase, i) => {
        const pStartBeat = phrase.startBar * 4;
        const pEndBeat   = (phrase.startBar + phrase.bars) * 4;
        const isActive   = currentBeat >= pStartBeat && currentBeat < pEndBeat;
        const colors: Record<string, string> = { A: "#00D4FF", B: "#FF6B35", "A'": "#FFDD00" };
        const c = colors[phrase.type] ?? "#fff";
        return (
          <div key={i} className="flex items-center gap-0.5">
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: isActive ? `${c}22` : "rgba(255,255,255,0.04)", color: isActive ? c : "rgba(255,255,255,0.25)", border: `1px solid ${isActive ? `${c}55` : "rgba(255,255,255,0.07)"}` }}>
              {phrase.type}
            </span>
            <span className="text-[7px] font-mono text-white/15">{phrase.bars}b</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Compositor Slot ───────────────────────────────────────────────────────────

function ComposerSlot({ slot, color, label, onSelect, onRemove, onWeight }: {
  slot: Slot; color: string; label: string;
  onSelect: () => void; onRemove: () => void; onWeight: (w: number) => void;
}) {
  const info = slot.composer ? composers[slot.composer] : null;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={slot.composer ? undefined : onSelect}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden group transition-all duration-200"
        style={{ background: slot.composer ? "transparent" : "#181818", border: `2px solid ${slot.composer ? color : "rgba(255,255,255,0.12)"}`, boxShadow: slot.composer ? `0 0 14px ${color}44` : "none" }}
        aria-label={slot.composer ? `Slot ${label}: ${slot.composer}` : `Añadir compositor al slot ${label}`}
      >
        {info?.portrait ? (
          <Image src={info.portrait} alt={slot.composer!} fill className="object-cover" sizes="64px" unoptimized={info.portrait.endsWith(".svg")} />
        ) : (
          <span className="text-2xl font-mono" style={{ color: slot.composer ? color : "rgba(255,255,255,0.25)" }}>
            {slot.composer ? slot.composer[0] : "+"}
          </span>
        )}
        {slot.composer && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1">
            <button onClick={e => { e.stopPropagation(); onSelect(); }} className="text-white text-[9px] px-1.5 py-0.5 bg-white/20 rounded">↕</button>
            <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-white text-[9px] px-1.5 py-0.5 bg-white/20 rounded">✕</button>
          </div>
        )}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold font-mono"
          style={{ background: color, color: "#0a0a0a" }}>
          {label}
        </div>
      </button>
      <span className="text-[8px] tracking-wide text-center font-mono leading-tight max-w-[68px]"
        style={{ color: slot.composer ? color : "rgba(255,255,255,0.20)" }}>
        {slot.composer ? slot.composer.split(" ").at(-1)!.toUpperCase() : "EMPTY"}
      </span>
      {slot.composer && (
        <div className="w-14 sm:w-16 flex flex-col items-center gap-0.5">
          <input type="range" min={0} max={100} value={Math.round(slot.weight * 100)}
            onChange={e => onWeight(Number(e.target.value) / 100)}
            className="w-full h-1 cursor-pointer" style={{ accentColor: color }}
            aria-label={`Influencia de ${slot.composer}`} />
          <span className="text-[8px] font-mono" style={{ color }}>{Math.round(slot.weight * 100)}%</span>
        </div>
      )}
    </div>
  );
}

// ── Composer Picker ───────────────────────────────────────────────────────────

function ComposerPicker({ onSelect, onClose, exclude }: {
  onSelect: (name: string) => void; onClose: () => void; exclude: (string | null)[];
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = ALL_COMPOSERS.filter(c => !exclude.includes(c) && c.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-piano-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 w-full max-w-sm max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-mono">Elige compositor</span>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>
        <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar…"
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 mb-3 font-mono" />
        <div className="overflow-y-auto flex flex-col gap-0.5">
          {filtered.map(name => {
            const info = composers[name];
            return (
              <button key={name} onClick={() => onSelect(name)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors text-left group">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10"
                  style={{ background: info?.color ?? "#333" }}>
                  {info?.portrait && <Image src={info.portrait} alt={name} width={32} height={32} className="w-full h-full object-cover" unoptimized={info.portrait.endsWith(".svg")} />}
                </div>
                <div>
                  <p className="text-xs text-white group-hover:text-gold transition-colors font-medium">{name}</p>
                  <p className="text-[9px] text-white/40 font-mono">{info?.estilo.split(" · ")[0]} · {info?.vida}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── StudioClient ──────────────────────────────────────────────────────────────

export default function StudioClient() {
  const [slots, setSlots]         = useState<Slot[]>([
    { composer: null, weight: 1 }, { composer: null, weight: 1 },
    { composer: null, weight: 1 }, { composer: null, weight: 1 },
  ]);
  const [knobs, setKnobs]         = useState<KnobValue>({ tempo: 0.5, mood: 0.6, complexity: 0.4, bars: 0.35, humanize: 0.6 });
  const [period, setPeriod]       = useState<string | null>(null);
  const [result, setResult]       = useState<CompositionResult | null>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [pickerSlot, setPickerSlot]   = useState<number | null>(null);
  const [loop, setLoop]           = useState(false);

  // Tone.js refs
  const toneRef    = useRef<typeof import("tone") | null>(null);
  const samplerRef = useRef<InstanceType<typeof import("tone").Sampler> | null>(null);
  const partRef    = useRef<InstanceType<typeof import("tone").Part> | null>(null);
  const rafRef     = useRef<number>(0);
  const loadedRef  = useRef(false);
  const startAtRef = useRef(0);
  const totalDurRef = useRef(0);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    try { partRef.current?.dispose(); } catch {}
    try { samplerRef.current?.dispose(); } catch {}
  }, []);

  const activeSlots    = slots.filter(s => s.composer);
  const canGenerate    = activeSlots.length > 0;
  const isGenerating   = playState === "generating";
  const notes          = result?.notes ?? [];
  const totalDuration  = notes.length > 0 ? Math.max(...notes.map(n => n.time + n.duration)) : 0;
  const tempoVal       = Math.round(40 + knobs.tempo * 180);
  const barsVal        = Math.round(4 + knobs.bars * 20);

  // ── Sampler ───────────────────────────────────────────────────────────────

  const loadSampler = useCallback(async (Tone: typeof import("tone")) => {
    if (samplerRef.current && loadedRef.current) return samplerRef.current;
    return new Promise<InstanceType<typeof Tone.Sampler>>((resolve, reject) => {
      const s = new Tone.Sampler({
        urls: {
          C4:"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",A4:"A4.mp3",
          C5:"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",A5:"A5.mp3",
          C3:"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",A3:"A3.mp3",
          C6:"C6.mp3","D#6":"Ds6.mp3","F#6":"Fs6.mp3",A6:"A6.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => { loadedRef.current = true; resolve(s); },
        onerror: reject,
      }).toDestination();
      samplerRef.current = s as InstanceType<typeof Tone.Sampler>;
    });
  }, []);

  // ── Stop ─────────────────────────────────────────────────────────────────

  const stopPlayback = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    try { partRef.current?.stop("+0"); partRef.current?.dispose(); } catch {}
    try { toneRef.current?.getTransport().stop(); toneRef.current?.getTransport().cancel(); } catch {}
    setPlayState("idle");
    setCurrentTime(0);
  }, []);

  // ── Play notes ────────────────────────────────────────────────────────────

  const playNotes = useCallback(async (notesToPlay: GeneratedNote[]) => {
    if (notesToPlay.length === 0) return;
    stopPlayback();
    setPlayState("generating");
    try {
      const Tone    = toneRef.current ?? (await import("tone"));
      toneRef.current = Tone;
      const sampler = await loadSampler(Tone);
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      transport.bpm.value = tempoVal;

      const dur = Math.max(...notesToPlay.map(n => n.time + n.duration));
      totalDurRef.current = dur;

      const part = new Tone.Part(
        (time: number, note: unknown) => {
          const n = note as GeneratedNote;
          try { sampler.triggerAttackRelease(n.name, n.duration * 0.9, time, n.velocity); } catch {}
        },
        notesToPlay.map(n => [n.time, n])
      );
      part.loop    = loop;
      part.loopEnd = dur;
      partRef.current = part as InstanceType<typeof Tone.Part>;

      await Tone.start();
      transport.start("+0.1");
      part.start(0);

      startAtRef.current = Date.now();
      setPlayState("playing");

      const tick = () => {
        const elapsed = (Date.now() - startAtRef.current) / 1000;
        setCurrentTime(loop ? elapsed % (dur + 0.05) : elapsed);
        if (elapsed < dur + 0.5 || loop) rafRef.current = requestAnimationFrame(tick);
        else { setPlayState("idle"); setCurrentTime(0); }
      };
      rafRef.current = requestAnimationFrame(tick);

      if (!loop) {
        transport.schedule(() => {
          cancelAnimationFrame(rafRef.current);
          setPlayState("idle");
          setCurrentTime(0);
        }, dur + 0.3);
      }
    } catch (e) {
      console.error(e);
      setPlayState("idle");
    }
  }, [loadSampler, loop, tempoVal, stopPlayback]);

  // ── Generate ──────────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    stopPlayback();
    setPlayState("generating");

    const source = activeSlots;
    const totalW = source.reduce((s, sl) => s + sl.weight, 0);
    const input  = source
      .filter(sl => !period || (sl.composer && (composers[sl.composer]?.estilo.toLowerCase().includes(period.toLowerCase()) ?? true)))
      .map(sl => ({ name: sl.composer!, weight: sl.weight / totalW }));

    const gen = generateComposition(
      input.length > 0 ? input : source.map(sl => ({ name: sl.composer!, weight: sl.weight / totalW })),
      { tempo: tempoVal, mood: knobs.mood, complexity: knobs.complexity, bars: barsVal, humanize: knobs.humanize }
    );
    setResult(gen);
    setPlayState("idle");
    setTimeout(() => playNotes(gen.notes), 80);
  }, [canGenerate, activeSlots, period, knobs, tempoVal, barsVal, stopPlayback, playNotes]);

  // ── Variation ─────────────────────────────────────────────────────────────

  const handleVariation = useCallback((type: VariationType) => {
    if (!result) return;
    stopPlayback();
    const secsPerBeat = 60 / tempoVal;
    const varNotes = generateVariation(result.notes, result.plan, type, null, secsPerBeat);
    const varResult: CompositionResult = { ...result, notes: varNotes };
    setResult(varResult);
    setTimeout(() => playNotes(varNotes), 80);
  }, [result, tempoVal, stopPlayback, playNotes]);

  // ── Play/Pause ────────────────────────────────────────────────────────────

  const handlePlayPause = () => {
    if (playState === "playing") {
      toneRef.current?.getTransport().pause();
      cancelAnimationFrame(rafRef.current);
      setPlayState("paused");
    } else if (playState === "paused") {
      toneRef.current?.getTransport().start();
      startAtRef.current = Date.now() - currentTime * 1000;
      setPlayState("playing");
      const tick = () => {
        const elapsed = (Date.now() - startAtRef.current) / 1000;
        setCurrentTime(elapsed);
        if (elapsed < totalDurRef.current + 0.5) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else if (notes.length > 0) {
      playNotes(notes);
    }
  };

  // ── Slot helpers ──────────────────────────────────────────────────────────

  const setSlotComposer = (idx: number, name: string) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, composer: name } : s));
    setPickerSlot(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen px-3 py-5 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-[9px] tracking-[0.5em] uppercase text-gold font-mono mb-1">Diapasón</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white-warm">
          Compositor <em className="italic text-gold">Studio</em>
        </h1>
        <p className="text-white-warm/35 text-[10px] mt-1.5 font-mono tracking-wide">
          Armonía funcional · Frases musicales · Humanización
        </p>
      </div>

      {/* ── INSTRUMENT BODY ────────────────────────────────────────────── */}
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1c1c1c 0%, #161616 100%)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)" }}>

        {/* Top strip */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" style={{ boxShadow: "0 0 5px #FF6B35" }} />
            <span className="text-[8px] tracking-[0.4em] uppercase font-mono text-white/30">DIAPASÓN STUDIO · HARMONY ENGINE</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[8px] font-mono text-white/25">{tempoVal} BPM</span>
            <span className="text-[8px] font-mono text-white/25">{barsVal} BARS</span>
            {result && <span className="text-[8px] font-mono" style={{ color: "#00D4FF" }}>{result.periodUsed.toUpperCase()}</span>}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-4">

          {/* ── DISPLAY + KNOBS ──────────────────────────────────────── */}
          <div className="flex gap-4 items-stretch">

            {/* LCD */}
            <div className="flex-1 rounded-lg overflow-hidden relative flex flex-col"
              style={{ background: "#090e09", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)", minHeight: 120 }}>
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)" }} />

              {/* Status bar */}
              <div className="px-3 pt-2 pb-1 flex items-center justify-between shrink-0">
                <span className="text-[8px] tracking-[0.3em] uppercase font-mono"
                  style={{ color: "#4CAF50", textShadow: "0 0 6px #4CAF5077" }}>
                  {isGenerating ? "GENERANDO…" : playState === "playing" ? "▶ PLAY" : playState === "paused" ? "‖ PAUSA" : notes.length > 0 ? "✓ LISTO" : "ESPERANDO"}
                </span>
                <span className="text-[7px] font-mono text-white/20">
                  {notes.length > 0 ? `${notes.length}N · ${Math.round(totalDuration)}s` : "—"}
                </span>
              </div>

              {/* Piano Roll */}
              <div className="px-2" style={{ height: 76 }}>
                <PianoRollDisplay notes={notes} currentTime={currentTime} totalDuration={totalDuration} isPlaying={playState === "playing"} />
              </div>

              {/* Chord display */}
              <div className="px-3 py-1.5 border-t border-white/5 flex items-center gap-2">
                <span className="text-[7px] font-mono text-white/20 shrink-0">CHORDS</span>
                <div className="overflow-hidden">
                  <ChordDisplay labels={result?.chordLabels ?? []} currentTime={currentTime} plan={result ?? null} />
                </div>
              </div>

              {/* Phrase display */}
              <div className="px-3 py-1 flex items-center gap-2">
                <span className="text-[7px] font-mono text-white/20 shrink-0">FORM</span>
                <PhraseDisplay plan={result?.plan ?? null} currentTime={currentTime} />
              </div>
            </div>

            {/* Knobs 3×2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
              <Knob value={knobs.tempo}      onChange={v => setKnobs(k => ({...k, tempo: v}))}      color="#FF6B35" label="TEMPO"    sublabel={`${tempoVal}`} />
              <Knob value={knobs.mood}       onChange={v => setKnobs(k => ({...k, mood: v}))}       color="#00D4FF" label="MOOD"     sublabel={knobs.mood > 0.55 ? "mayor" : "menor"} />
              <Knob value={knobs.complexity} onChange={v => setKnobs(k => ({...k, complexity: v}))} color="#FFDD00" label="DETALLE"  sublabel={knobs.complexity > 0.66 ? "ornado" : knobs.complexity > 0.33 ? "medio" : "simple"} />
              <Knob value={knobs.bars}       onChange={v => setKnobs(k => ({...k, bars: v}))}       color="#FF3CA0" label="LARGO"    sublabel={`${barsVal} bars`} />
              <Knob value={knobs.humanize}   onChange={v => setKnobs(k => ({...k, humanize: v}))}   color="#A78BFA" label="HUMANO"   sublabel={knobs.humanize > 0.6 ? "rubato" : knobs.humanize > 0.3 ? "natural" : "robot"} />
            </div>
          </div>

          {/* ── COMPOSITOR SLOTS ──────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] tracking-[0.4em] uppercase font-mono text-white/35">Compositores</span>
              <span className="text-[8px] font-mono text-white/20">arrastra slider para peso · hasta 4</span>
            </div>
            <div className="flex items-start justify-around gap-2">
              {slots.map((slot, i) => (
                <ComposerSlot key={i} slot={slot} color={SLOT_COLORS[i]} label={SLOT_LABELS[i]}
                  onSelect={() => setPickerSlot(i)}
                  onRemove={() => setSlots(prev => prev.map((s, j) => j === i ? { composer: null, weight: 1 } : s))}
                  onWeight={w => setSlots(prev => prev.map((s, j) => j === i ? { ...s, weight: w } : s))} />
              ))}
            </div>
          </div>

          {/* ── PERIOD + GENERATE ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8px] tracking-[0.3em] uppercase font-mono text-white/30">Período</span>
            {PERIOD_BTNS.map(p => (
              <button key={p} onClick={() => setPeriod(period === p ? null : p)}
                className="px-2.5 py-1 rounded-full text-[9px] tracking-[0.15em] uppercase font-mono transition-all duration-200"
                style={{ background: period === p ? "#C9A84C" : "rgba(255,255,255,0.05)", color: period === p ? "#0a0a0a" : "rgba(255,255,255,0.40)", border: `1px solid ${period === p ? "#C9A84C" : "rgba(255,255,255,0.09)"}`, boxShadow: period === p ? "0 0 8px #C9A84C44" : "none" }}>
                {p}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button onClick={handleGenerate} disabled={!canGenerate || isGenerating}
            className="w-full py-3.5 rounded-xl font-mono text-sm tracking-[0.4em] uppercase font-bold transition-all duration-200 disabled:opacity-35 active:scale-[0.98]"
            style={{
              background: canGenerate && !isGenerating ? "linear-gradient(135deg, #FF6B35 0%, #FF3CA0 100%)" : "#1a1a1a",
              color: canGenerate && !isGenerating ? "#0a0a0a" : "#444",
              boxShadow: canGenerate && !isGenerating ? "0 4px 20px rgba(255,107,53,0.35)" : "none",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
            {isGenerating ? "● COMPONIENDO…" : "◆ GENERAR COMPOSICIÓN"}
          </button>

          {/* ── VARIATIONS ─────────────────────────────────────────────── */}
          {result && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] tracking-[0.3em] uppercase font-mono text-white/30">Variaciones del tema</span>
              <div className="grid grid-cols-4 gap-2">
                {VARIATION_TYPES.map(vt => (
                  <button key={vt.id} onClick={() => handleVariation(vt.id)}
                    disabled={isGenerating}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-30"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-base">{vt.icon}</span>
                    <span className="text-[8px] font-mono text-white/50">{vt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── TRANSPORT ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <button onClick={handlePlayPause} disabled={notes.length === 0 || isGenerating}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
              style={{ background: playState === "playing" ? "#00D4FF18" : "rgba(255,255,255,0.06)", border: `1px solid ${playState === "playing" ? "#00D4FF" : "rgba(255,255,255,0.10)"}`, boxShadow: playState === "playing" ? "0 0 8px #00D4FF33" : "none" }}
              aria-label={playState === "playing" ? "Pausar" : "Reproducir"}>
              <span className="text-sm" style={{ color: playState === "playing" ? "#00D4FF" : "rgba(255,255,255,0.55)" }}>
                {playState === "playing" ? "‖" : "▶"}
              </span>
            </button>

            <button onClick={stopPlayback} disabled={playState === "idle"}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              aria-label="Detener">
              <span className="text-xs text-white/55">■</span>
            </button>

            <button onClick={() => setLoop(v => !v)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95"
              style={{ background: loop ? "#FFDD0018" : "rgba(255,255,255,0.06)", border: `1px solid ${loop ? "#FFDD00" : "rgba(255,255,255,0.10)"}`, boxShadow: loop ? "0 0 6px #FFDD0033" : "none" }}
              aria-pressed={loop} aria-label="Loop">
              <span className="text-xs" style={{ color: loop ? "#FFDD00" : "rgba(255,255,255,0.35)" }}>⟳</span>
            </button>

            {/* Progress */}
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-75"
                style={{ width: totalDuration > 0 ? `${Math.min((currentTime / totalDuration) * 100, 100)}%` : "0%", background: "linear-gradient(90deg, #00D4FF, #FF3CA0)", boxShadow: "0 0 5px rgba(0,212,255,0.35)" }} />
            </div>

            <span className="text-[8px] font-mono text-white/25 w-10 text-right">
              {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </span>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[7px] font-mono text-white/15 tracking-widest">FUNCTIONAL HARMONY · PHRASE STRUCTURE · HUMANIZATION</span>
          <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/8" />)}</div>
        </div>
      </div>

      <p className="mt-3 text-[8px] text-white/20 font-mono tracking-wide text-center max-w-xs">
        Los knobs se arrastran verticalmente · El knob HUMANO añade rubato y variación de dinámica
      </p>

      {pickerSlot !== null && (
        <ComposerPicker
          onSelect={name => setSlotComposer(pickerSlot, name)}
          onClose={() => setPickerSlot(null)}
          exclude={slots.map(s => s.composer)}
        />
      )}
    </div>
  );
}

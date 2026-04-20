"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePlayerContext } from "@/context/PlayerContext";

export type PlayState = "idle" | "loading" | "playing" | "paused" | "error";

export interface MidiNote {
  time: number;
  duration: number;
  name: string;
  hand: "right" | "left";
}

function dBFromLinear(v: number): number {
  if (v === 0) return -Infinity;
  return 20 * Math.log10(v);
}

export function useMidiPlayer(midiPath: string) {
  const [state, setState]       = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tempo, setTempo]       = useState(1);
  const [volume, setVolume]     = useState(0.8);

  const { register, requestPlay } = usePlayerContext();

  const toneRef      = useRef<typeof import("tone") | null>(null);
  const samplerRef   = useRef<InstanceType<typeof import("tone").Sampler> | null>(null);
  const partRef      = useRef<InstanceType<typeof import("tone").Part> | null>(null);
  const rafRef       = useRef<number>(0);
  const loadedRef    = useRef(false);
  const durationRef  = useRef(0);
  const baseBpmRef   = useRef(120);
  const tempoRef     = useRef(1);
  const notesRef     = useRef<MidiNote[]>([]);
  const currentTimeRef = useRef(0);

  const safePart = {
    stop:    () => { try { partRef.current?.stop("+0"); } catch {} },
    dispose: () => { try { partRef.current?.dispose(); } catch {} },
  };

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
        onload:  () => { loadedRef.current = true; resolve(sampler); },
        onerror: reject,
      }).toDestination();
      samplerRef.current = sampler as InstanceType<typeof Tone.Sampler>;
    });
  }, []);

  const parseMidi = useCallback(async (url: string) => {
    const { Midi } = await import("@tonejs/midi");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo cargar el MIDI: ${res.status}`);
    return new Midi(await res.arrayBuffer());
  }, []);

  const animateProgress = useCallback(() => {
    const tick = () => {
      const Tone = toneRef.current;
      const pos = Tone?.getTransport().seconds ?? 0;
      const latency = Tone?.context?.lookAhead ?? 0;
      currentTimeRef.current = Math.max(0, pos - latency);
      const dur = durationRef.current;
      setProgress(dur > 0 ? Math.min(pos / dur, 1) : 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePlay = useCallback(async () => {
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
      const Tone    = await loadTone();
      const sampler = await loadSampler(Tone);
      const midi    = await parseMidi(midiPath);

      safePart.stop();
      safePart.dispose();

      const totalDur = midi.duration;
      setDuration(totalDur);
      durationRef.current = totalDur;

      const tracksWithNotes = midi.tracks.filter(t => t.notes.length > 0);
      const useTrackSplit   = tracksWithNotes.length === 2;
      let rightTrackIdx     = 0;

      if (useTrackSplit) {
        const avgPitch = (t: typeof tracksWithNotes[0]) =>
          t.notes.reduce((a, n) => a + n.midi, 0) / t.notes.length;
        rightTrackIdx = avgPitch(tracksWithNotes[0]) >= avgPitch(tracksWithNotes[1]) ? 0 : 1;
      }

      const notes: Array<{
        time: number; note: string; duration: number;
        velocity: number; midi: number; hand: "right" | "left";
      }> = [];

      tracksWithNotes.forEach((track, trackIdx) => {
        for (const n of track.notes) {
          const hand: "right" | "left" = useTrackSplit
            ? (trackIdx === rightTrackIdx ? "right" : "left")
            : (n.midi >= 60 ? "right" : "left");
          notes.push({ time: n.time, note: n.name, duration: n.duration, velocity: n.velocity, midi: n.midi, hand });
        }
      });
      notes.sort((a, b) => a.time - b.time);

      notesRef.current = notes.map(n => ({
        time: n.time, duration: n.duration,
        name: n.note.replace(/s/i, "#"),
        hand: n.hand,
      }));

      const part = new Tone.Part((time, note) => {
        sampler.triggerAttackRelease(note.note, note.duration, time, note.velocity);
      }, notes);
      part.loop   = false;
      partRef.current = part as InstanceType<typeof Tone.Part>;

      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      const originalBpm         = midi.header.tempos[0]?.bpm ?? 120;
      baseBpmRef.current        = originalBpm;
      tempoRef.current          = tempo;
      transport.bpm.value       = originalBpm * tempo;

      await Tone.start();
      transport.start("+0.1");
      part.start(0);

      setState("playing");
      animateProgress();

      transport.schedule(() => {
        setState("idle");
        setProgress(0);
        cancelAnimationFrame(rafRef.current);
      }, totalDur + 0.5);

    } catch (e) {
      console.error(e);
      setState("error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, midiPath, tempo, loadTone, loadSampler, parseMidi, animateProgress, requestPlay]);

  const handlePause = useCallback(() => {
    toneRef.current?.getTransport().pause();
    setState("paused");
    cancelAnimationFrame(rafRef.current);
  }, []);

  const handleStop = useCallback(() => {
    try { toneRef.current?.getTransport().stop(); } catch {}
    try { toneRef.current?.getTransport().cancel(); } catch {}
    safePart.stop();
    setState("idle");
    setProgress(0);
    currentTimeRef.current = 0;
    cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeek = useCallback((ratio: number) => {
    const dur = durationRef.current;
    if (!toneRef.current || !partRef.current || dur === 0) return;
    const clamped = Math.max(0, Math.min(ratio, 0.999));
    try {
      const transport = toneRef.current.getTransport();
      try { samplerRef.current?.releaseAll(); } catch {}
      transport.seconds      = clamped * dur;
      currentTimeRef.current = clamped * dur;
      setProgress(clamped);
    } catch (e) { console.error(e); }
  }, []);

  const handleTempoChange = useCallback((v: number) => {
    setTempo(v);
    tempoRef.current = v;
    if (toneRef.current) toneRef.current.getTransport().bpm.value = baseBpmRef.current * v;
  }, []);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (samplerRef.current) samplerRef.current.volume.value = dBFromLinear(v);
  }, []);

  const formatTime = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    state, progress, duration, tempo, volume,
    notesRef, currentTimeRef,
    handlePlay, handlePause, handleStop,
    handleSeek, handleTempoChange, handleVolumeChange,
    formatTime,
    realDuration: duration / tempo,
    currentSec:   (progress * duration) / tempo,
  };
}

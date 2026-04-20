import {
  buildHarmonyPlan,
  chordAtBeat,
  snapToChordOrScale,
  beatVelocityWeight,
  phraseVelocityCurve,
  timingJitter,
  SCALES,
  type HarmonyPlan,
  type Chord,
} from "./harmony-engine";

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface GeneratedNote {
  time:     number;
  name:     string;
  duration: number;
  velocity: number;
  hand:     "right" | "left";
}

export interface GenerationParams {
  tempo:       number;  // BPM
  mood:        number;  // 0=dark/minor  1=bright/major
  complexity:  number;  // 0=simple  1=ornate
  bars:        number;  // total bars
  humanize:    number;  // 0=robotic  1=human (timing + velocity jitter)
}

export interface CompositionResult {
  notes:       GeneratedNote[];
  plan:        HarmonyPlan;
  periodUsed:  string;
  chordLabels: string[];  // e.g. ["I","IV","V7","I"]
}

// ── ADN musical ───────────────────────────────────────────────────────────────

interface ComposerDNA {
  period:          "Barroco" | "Clásico" | "Romántico" | "Moderno";
  scaleMode:       "major" | "minor" | "dorian" | "whole-tone" | "pentatonic";
  rhythmPatterns:  number[][];
  registerRange:   [number, number];
  bassRange:       [number, number];
  density:         number;
  chromaticism:    number;
  dynamicRange:    [number, number];
  jumpiness:       number;
  leftHandStyle:   "alberti" | "bass-chord" | "arpeggio" | "block" | "sparse";
  // How strongly the melody follows chord tones vs passing tones (0–1)
  chordToneBias:   number;
}

export const composerDNA: Record<string, ComposerDNA> = {
  "Johann Sebastian Bach": {
    period: "Barroco", scaleMode: "major",
    rhythmPatterns: [[0.25,0.25,0.25,0.25],[0.5,0.25,0.25],[0.25,0.25,0.5],[0.125,0.125,0.125,0.125,0.5]],
    registerRange: [55,79], bassRange: [36,55],
    density: 0.90, chromaticism: 0.10, dynamicRange: [0.45,0.80], jumpiness: 0.20,
    leftHandStyle: "bass-chord", chordToneBias: 0.75,
  },
  "Georg Friedrich Händel": {
    period: "Barroco", scaleMode: "major",
    rhythmPatterns: [[0.75,0.25],[0.5,0.5],[0.25,0.25,0.5]],
    registerRange: [57,81], bassRange: [38,57],
    density: 0.75, chromaticism: 0.08, dynamicRange: [0.50,0.85], jumpiness: 0.30,
    leftHandStyle: "bass-chord", chordToneBias: 0.70,
  },
  "Domenico Scarlatti": {
    period: "Barroco", scaleMode: "major",
    rhythmPatterns: [[0.25,0.25,0.25,0.25],[0.5,0.25,0.25],[0.125,0.125,0.125,0.125,0.5]],
    registerRange: [52,84], bassRange: [36,52],
    density: 0.95, chromaticism: 0.15, dynamicRange: [0.55,0.90], jumpiness: 0.50,
    leftHandStyle: "arpeggio", chordToneBias: 0.65,
  },
  "Joseph Haydn": {
    period: "Clásico", scaleMode: "major",
    rhythmPatterns: [[0.5,0.5],[1.0],[0.25,0.25,0.5],[0.5,0.25,0.25]],
    registerRange: [55,79], bassRange: [40,55],
    density: 0.70, chromaticism: 0.07, dynamicRange: [0.35,0.85], jumpiness: 0.25,
    leftHandStyle: "alberti", chordToneBias: 0.80,
  },
  "Wolfgang Amadeus Mozart": {
    period: "Clásico", scaleMode: "major",
    rhythmPatterns: [[0.5,0.5],[0.25,0.25,0.25,0.25],[1.0,0.5,0.5],[0.25,0.75]],
    registerRange: [57,81], bassRange: [40,57],
    density: 0.72, chromaticism: 0.10, dynamicRange: [0.30,0.80], jumpiness: 0.22,
    leftHandStyle: "alberti", chordToneBias: 0.82,
  },
  "Ludwig van Beethoven": {
    period: "Clásico", scaleMode: "minor",
    rhythmPatterns: [[1.0],[0.5,0.5],[0.25,0.25,0.25,0.25],[1.5,0.5],[0.25,0.25,0.5,1.0]],
    registerRange: [48,84], bassRange: [36,52],
    density: 0.78, chromaticism: 0.15, dynamicRange: [0.20,1.0], jumpiness: 0.40,
    leftHandStyle: "block", chordToneBias: 0.72,
  },
  "Franz Schubert": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[1.0,0.5,0.5],[0.5,0.5,1.0],[0.75,0.25,1.0]],
    registerRange: [55,81], bassRange: [38,55],
    density: 0.65, chromaticism: 0.20, dynamicRange: [0.25,0.80], jumpiness: 0.20,
    leftHandStyle: "arpeggio", chordToneBias: 0.68,
  },
  "Frédéric Chopin": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[1.0,0.5,0.5],[0.5,0.25,0.25,0.5,0.5],[0.75,0.25],[2.0]],
    registerRange: [52,88], bassRange: [36,52],
    density: 0.68, chromaticism: 0.28, dynamicRange: [0.20,0.90], jumpiness: 0.28,
    leftHandStyle: "arpeggio", chordToneBias: 0.60,
  },
  "Robert Schumann": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[0.5,0.5,1.0],[1.0,0.5,0.25,0.25],[0.25,0.5,0.25,1.0]],
    registerRange: [52,84], bassRange: [38,55],
    density: 0.72, chromaticism: 0.22, dynamicRange: [0.25,0.88], jumpiness: 0.32,
    leftHandStyle: "block", chordToneBias: 0.65,
  },
  "Franz Liszt": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[0.25,0.25,0.25,0.25],[0.125,0.125,0.125,0.125,0.5],[1.5,0.5]],
    registerRange: [43,91], bassRange: [28,48],
    density: 0.90, chromaticism: 0.30, dynamicRange: [0.15,1.0], jumpiness: 0.55,
    leftHandStyle: "arpeggio", chordToneBias: 0.55,
  },
  "Johannes Brahms": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[1.0,1.0],[0.5,0.5,1.0],[0.333,0.333,0.333]],
    registerRange: [48,79], bassRange: [35,52],
    density: 0.80, chromaticism: 0.18, dynamicRange: [0.30,0.90], jumpiness: 0.22,
    leftHandStyle: "block", chordToneBias: 0.70,
  },
  "Edvard Grieg": {
    period: "Romántico", scaleMode: "dorian",
    rhythmPatterns: [[0.5,0.5,1.0],[0.75,0.25,1.0],[1.0,0.5,0.5]],
    registerRange: [52,81], bassRange: [38,55],
    density: 0.65, chromaticism: 0.12, dynamicRange: [0.25,0.85], jumpiness: 0.28,
    leftHandStyle: "block", chordToneBias: 0.72,
  },
  "Piotr Ilich Tchaikovsky": {
    period: "Romántico", scaleMode: "minor",
    rhythmPatterns: [[1.0,0.5,0.5],[0.5,1.0,0.5],[0.333,0.333,0.333,1.0]],
    registerRange: [52,84], bassRange: [38,55],
    density: 0.70, chromaticism: 0.18, dynamicRange: [0.20,0.95], jumpiness: 0.25,
    leftHandStyle: "arpeggio", chordToneBias: 0.68,
  },
  "Erik Satie": {
    period: "Moderno", scaleMode: "dorian",
    rhythmPatterns: [[2.0],[1.0,1.0],[1.5,0.5],[3.0]],
    registerRange: [55,79], bassRange: [40,57],
    density: 0.35, chromaticism: 0.08, dynamicRange: [0.20,0.55], jumpiness: 0.10,
    leftHandStyle: "sparse", chordToneBias: 0.85,
  },
  "Claude Debussy": {
    period: "Moderno", scaleMode: "whole-tone",
    rhythmPatterns: [[1.0,0.5,0.5],[2.0,1.0],[0.5,0.25,0.25,1.0]],
    registerRange: [52,88], bassRange: [36,55],
    density: 0.55, chromaticism: 0.35, dynamicRange: [0.15,0.75], jumpiness: 0.18,
    leftHandStyle: "arpeggio", chordToneBias: 0.50,
  },
  "Maurice Ravel": {
    period: "Moderno", scaleMode: "dorian",
    rhythmPatterns: [[0.25,0.25,0.25,0.25],[0.5,0.25,0.25],[0.5,0.5,1.0]],
    registerRange: [52,88], bassRange: [36,55],
    density: 0.72, chromaticism: 0.28, dynamicRange: [0.25,0.85], jumpiness: 0.22,
    leftHandStyle: "arpeggio", chordToneBias: 0.58,
  },
  "Scott Joplin": {
    period: "Moderno", scaleMode: "major",
    rhythmPatterns: [[0.25,0.5,0.25],[0.5,0.25,0.5,0.25,0.5],[0.25,0.25,0.5,0.25,0.25,0.5]],
    registerRange: [55,83], bassRange: [40,57],
    density: 0.82, chromaticism: 0.12, dynamicRange: [0.45,0.85], jumpiness: 0.35,
    leftHandStyle: "bass-chord", chordToneBias: 0.75,
  },
};

const DEFAULT_DNA: ComposerDNA = {
  period: "Clásico", scaleMode: "major",
  rhythmPatterns: [[0.5,0.5],[1.0],[0.25,0.25,0.5]],
  registerRange: [55,79], bassRange: [40,55],
  density: 0.70, chromaticism: 0.10, dynamicRange: [0.35,0.80], jumpiness: 0.25,
  leftHandStyle: "alberti", chordToneBias: 0.75,
};

// ── Mezcla de ADN ─────────────────────────────────────────────────────────────

function blendDNA(entries: Array<{ name: string; weight: number }>): ComposerDNA {
  if (entries.length === 0) return DEFAULT_DNA;
  const total  = entries.reduce((s, e) => s + e.weight, 0);
  const normed = entries.map(e => ({ dna: composerDNA[e.name] ?? DEFAULT_DNA, w: e.weight / total }));
  const blend  = (fn: (d: ComposerDNA) => number) => normed.reduce((s, { dna, w }) => s + fn(dna) * w, 0);
  const pick   = <T>(fn: (d: ComposerDNA) => T): T => {
    const counts = new Map<T, number>();
    normed.forEach(({ dna, w }) => { const v = fn(dna); counts.set(v, (counts.get(v) ?? 0) + w); });
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  };
  const patterns = Array.from(new Set(normed.flatMap(({ dna }) => dna.rhythmPatterns.map(p => JSON.stringify(p)))))
    .slice(0, 6).map(s => JSON.parse(s) as number[]);

  return {
    period:        pick(d => d.period),
    scaleMode:     pick(d => d.scaleMode),
    rhythmPatterns: patterns,
    registerRange: [Math.round(blend(d => d.registerRange[0])), Math.round(blend(d => d.registerRange[1]))],
    bassRange:     [Math.round(blend(d => d.bassRange[0])),     Math.round(blend(d => d.bassRange[1]))],
    density:       blend(d => d.density),
    chromaticism:  blend(d => d.chromaticism),
    dynamicRange:  [blend(d => d.dynamicRange[0]), blend(d => d.dynamicRange[1])],
    jumpiness:     blend(d => d.jumpiness),
    leftHandStyle: pick(d => d.leftHandStyle),
    chordToneBias: blend(d => d.chordToneBias),
  };
}

// ── Utilidades ────────────────────────────────────────────────────────────────

function midiToName(midi: number): string {
  const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return names[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
  return weights.length - 1;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// ── Generador de melodía (mano derecha) ───────────────────────────────────────

function generateMelody(
  plan:  HarmonyPlan,
  dna:   ComposerDNA,
  params: GenerationParams,
  secsPerBeat: number,
): GeneratedNote[] {
  const notes: GeneratedNote[] = [];
  let beat = 0;
  let prevMidi = Math.round(lerp(dna.registerRange[0], dna.registerRange[1], 0.5));

  while (beat < plan.totalBeats) {
    if (Math.random() > lerp(0.5, 1.0, params.complexity * 0.4 + dna.density * 0.6)) {
      beat += 0.25;
      continue;
    }

    const chord  = chordAtBeat(beat, plan);
    const dur    = pickDuration(dna, params.complexity);

    // Calcular posición dentro de la frase para la curva dinámica
    const phrase      = plan.phrases.find(p => beat >= p.startBar * 4 && beat < (p.startBar + p.bars) * 4);
    const phraseStart = (phrase?.startBar ?? 0) * 4;
    const phraseEnd   = ((phrase?.startBar ?? 0) + (phrase?.bars ?? plan.totalBeats / 4)) * 4;
    const posInPhrase = (beat - phraseStart) / (phraseEnd - phraseStart);

    // Seleccionar próxima nota
    const nextMidi = selectNextNote(prevMidi, chord, plan, dna, params.complexity, beat);

    // Velocity: beat weight × phrase curve × dynamic range × humanization jitter
    const bvw      = beatVelocityWeight(Math.floor(beat) % 4);
    const phraseCv = phraseVelocityCurve(posInPhrase);
    const baseVel  = lerp(dna.dynamicRange[0], dna.dynamicRange[1], bvw * phraseCv);
    const velJitter = params.humanize * (Math.random() - 0.5) * 0.10;
    const velocity  = clamp(baseVel + velJitter, 0.12, 1.0);

    // Timing jitter
    const jitter = timingJitter(params.humanize);

    notes.push({
      time:     clamp(beat * secsPerBeat + jitter, 0, Infinity),
      name:     midiToName(nextMidi),
      duration: dur * secsPerBeat * lerp(0.82, 0.93, Math.random()),
      velocity,
      hand:     "right",
    });

    prevMidi = nextMidi;
    beat += dur;
  }

  return notes;
}

function pickDuration(dna: ComposerDNA, complexity: number): number {
  const pattern = dna.rhythmPatterns[Math.floor(Math.random() * dna.rhythmPatterns.length)];
  // With higher complexity, prefer shorter note values
  const weights = pattern.map(d => complexity > 0.6 ? 1 / (d + 0.1) : d);
  const idx = weightedRandom(weights);
  return pattern[idx];
}

function selectNextNote(
  prevMidi: number,
  chord:    Chord,
  plan:     HarmonyPlan,
  dna:      ComposerDNA,
  complexity: number,
  beat:     number,
): number {
  const beatInBar = Math.floor(beat) % 4;
  const isStrong  = beatInBar === 0 || beatInBar === 2;

  // On strong beats: bias towards chord tones
  const ctBias = isStrong ? Math.min(1, dna.chordToneBias + 0.15) : dna.chordToneBias * 0.6;

  // Candidate pool: chord tones in register
  const chordMidis: number[] = [];
  for (let oct = 3; oct <= 7; oct++) {
    for (const iv of chord.intervals) {
      const m = chord.root + iv + (oct - Math.floor(chord.root / 12)) * 12;
      if (m >= dna.registerRange[0] && m <= dna.registerRange[1]) chordMidis.push(m);
    }
  }

  // Scale tones in register
  const scaleMidis: number[] = [];
  for (let m = dna.registerRange[0]; m <= dna.registerRange[1]; m++) {
    const pc = ((m % 12) + 12) % 12;
    const tonicPc = (plan.tonic % 12 + 12) % 12;
    if (plan.scale.some(s => (tonicPc + s) % 12 === pc)) scaleMidis.push(m);
  }

  // Pool selection
  const pool = Math.random() < ctBias && chordMidis.length > 0 ? chordMidis : scaleMidis;
  if (pool.length === 0) return prevMidi;

  // Weight candidates by distance (prefer stepwise motion vs leaps by jumpiness)
  const weights = pool.map(m => {
    const dist = Math.abs(m - prevMidi);
    if (dist === 0) return 0.1; // avoid repeating
    const stepWeight  = dist <= 2 ? 1.0 : dist <= 4 ? 0.5 : 0.2;
    const leapWeight  = dist >= 5 && dist <= 8 ? 0.6 : dist > 8 ? 0.2 : 0;
    return lerp(stepWeight, leapWeight, dna.jumpiness);
  });

  // Prefer notes in same octave register area as previous (gravity)
  const mid = (dna.registerRange[0] + dna.registerRange[1]) / 2;
  const centeredWeights = weights.map((w, i) => {
    const distFromMid = Math.abs(pool[i] - mid) / (dna.registerRange[1] - dna.registerRange[0]);
    return w * (1 - distFromMid * 0.4);
  });

  const idx = weightedRandom(centeredWeights);
  return pool[idx];
}

// ── Generador de bajo / acompañamiento (mano izquierda) ──────────────────────

function generateBass(
  plan:        HarmonyPlan,
  dna:         ComposerDNA,
  params:      GenerationParams,
  secsPerBeat: number,
): GeneratedNote[] {
  const notes: GeneratedNote[] = [];

  for (const chord of plan.allChords) {
    const startBeat = chord.startBeat;
    const endBeat   = chord.startBeat + chord.durationBeats;
    const root      = clamp(chord.root, dna.bassRange[0], dna.bassRange[1]);
    const third     = root + (chord.intervals[1] ?? 4);
    const fifth     = root + (chord.intervals[2] ?? 7);
    const rootOctUp = root + 12 <= dna.bassRange[1] ? root + 12 : root;

    // Phrase position for dynamics
    const phraseObj = plan.phrases.find(p => startBeat >= p.startBar * 4);
    const phraseLen = (phraseObj?.bars ?? 4) * 4;
    const phraseStart = (phraseObj?.startBar ?? 0) * 4;
    const pos = (startBeat - phraseStart) / phraseLen;
    const dynMult = 0.75 * phraseVelocityCurve(pos);

    const velBase = lerp(dna.dynamicRange[0], dna.dynamicRange[1], dynMult) * 0.75;

    switch (dna.leftHandStyle) {
      case "alberti": {
        // root – fifth – third – fifth (repeating)
        const pattern = [root, fifth, third, fifth];
        for (let beat = startBeat; beat < endBeat; beat++) {
          for (let sub = 0; sub < 4; sub++) {
            const t = beat + sub * 0.25;
            if (t >= endBeat) break;
            const m = pattern[sub % 4];
            const jitter = timingJitter(params.humanize);
            notes.push({ time: t * secsPerBeat + jitter, name: midiToName(m), duration: 0.22 * secsPerBeat, velocity: clamp(velBase * beatVelocityWeight(sub % 4), 0.10, 0.80), hand: "left" });
          }
        }
        break;
      }
      case "arpeggio": {
        const arpeggioNotes = [root, third, fifth, rootOctUp, fifth, third];
        const step = (chord.durationBeats) / arpeggioNotes.length;
        arpeggioNotes.forEach((m, i) => {
          const t = startBeat + i * step;
          if (t >= endBeat) return;
          const jitter = timingJitter(params.humanize);
          notes.push({ time: t * secsPerBeat + jitter, name: midiToName(m), duration: step * secsPerBeat * 0.9, velocity: clamp(velBase * (i === 0 ? 1.0 : 0.70), 0.10, 0.85), hand: "left" });
        });
        break;
      }
      case "block": {
        [root, third, fifth].forEach(m => {
          notes.push({ time: startBeat * secsPerBeat, name: midiToName(m), duration: chord.durationBeats * secsPerBeat * 0.88, velocity: clamp(velBase, 0.15, 0.80), hand: "left" });
        });
        break;
      }
      case "bass-chord": {
        // Bass note on beat 1, chord on beat 3
        notes.push({ time: startBeat * secsPerBeat, name: midiToName(root), duration: 0.9 * secsPerBeat, velocity: clamp(velBase * 1.05, 0.15, 0.85), hand: "left" });
        if (chord.durationBeats >= 2) {
          const chordTime = (startBeat + 2) * secsPerBeat;
          [third, fifth].forEach(m => notes.push({ time: chordTime, name: midiToName(m), duration: 0.75 * secsPerBeat, velocity: clamp(velBase * 0.75, 0.10, 0.70), hand: "left" }));
        }
        break;
      }
      case "sparse":
      default: {
        if (Math.random() > 0.35) {
          notes.push({ time: startBeat * secsPerBeat, name: midiToName(root), duration: chord.durationBeats * secsPerBeat * 0.7, velocity: clamp(velBase * 0.85, 0.12, 0.65), hand: "left" });
        }
        break;
      }
    }
  }

  return notes;
}

// ── Variación de un tema existente ────────────────────────────────────────────

export type VariationType = "ornamental" | "inversion" | "augmentation" | "reharmonize";

export function generateVariation(
  original:  GeneratedNote[],
  plan:      HarmonyPlan,
  type:      VariationType,
  dna_:      ComposerDNA | null,
  secsPerBeat: number,
): GeneratedNote[] {
  const melody = original.filter(n => n.hand === "right");
  const bass   = original.filter(n => n.hand === "left");

  switch (type) {
    case "ornamental": {
      // Add grace notes before chord tones on strong beats
      const result: GeneratedNote[] = [...bass];
      for (const note of melody) {
        const beat = note.time / secsPerBeat;
        const beatInBar = Math.floor(beat) % 4;
        result.push(note);
        if ((beatInBar === 0 || beatInBar === 2) && Math.random() > 0.55) {
          const midiVal = midiFromName(note.name);
          if (midiVal !== null) {
            const graceOffset = Math.random() > 0.5 ? 1 : 2;
            result.push({
              time: clamp(note.time - 0.05 * secsPerBeat, 0, Infinity),
              name: midiToName(midiVal + graceOffset),
              duration: 0.06 * secsPerBeat,
              velocity: note.velocity * 0.75,
              hand: "right",
            });
          }
        }
      }
      return result.sort((a, b) => a.time - b.time);
    }

    case "inversion": {
      // Mirror the melody around the median pitch
      const midis = melody.map(n => midiFromName(n.name)).filter(Boolean) as number[];
      if (midis.length === 0) return original;
      const median = midis[Math.floor(midis.length / 2)];
      return [
        ...bass,
        ...melody.map(n => {
          const m = midiFromName(n.name);
          if (m === null) return n;
          const reflected = clamp(2 * median - m, dna_?.registerRange[0] ?? 48, dna_?.registerRange[1] ?? 84);
          const snapped = snapToChordOrScale(reflected, chordAtBeat(n.time / secsPerBeat, plan), plan.scale, plan.tonic, 0.6);
          return { ...n, name: midiToName(snapped) };
        }),
      ];
    }

    case "augmentation": {
      // Double note durations (slows melody to half speed)
      const maxTime = Math.max(...original.map(n => n.time + n.duration));
      return [
        ...bass.map(n => ({ ...n, time: n.time * 2, duration: n.duration * 2 })),
        ...melody.map(n => ({ ...n, time: n.time * 2, duration: n.duration * 2 })),
      ];
    }

    case "reharmonize": {
      // Keep melody, swap bass/chords for a new harmonic progression
      // (we rebuild bass from original plan but with different chord voicings)
      return [
        ...bass.map(n => ({
          ...n,
          velocity: clamp(n.velocity * lerp(0.8, 1.1, Math.random()), 0.10, 0.85),
          time: n.time + timingJitter(0.3),
        })),
        ...melody.map(n => ({
          ...n,
          velocity: clamp(n.velocity * lerp(0.85, 1.05, Math.random()), 0.12, 0.90),
        })),
      ].sort((a, b) => a.time - b.time);
    }
  }
}

function midiFromName(name: string): number | null {
  const m = name.match(/^([A-G]#?)(-?\d+)$/);
  if (!m) return null;
  const ns: Record<string, number> = { C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11 };
  return (parseInt(m[2]) + 1) * 12 + (ns[m[1]] ?? 0);
}

// ── Función principal ─────────────────────────────────────────────────────────

export function generateComposition(
  composers: Array<{ name: string; weight: number }>,
  params:    GenerationParams,
): CompositionResult {
  const dna = blendDNA(composers);

  // Escala y modo según mood + ADN
  const scaleName = dna.scaleMode === "whole-tone" ? "whole-tone"
    : dna.scaleMode === "pentatonic" ? "pentatonic"
    : params.mood > 0.55 ? "major"
    : params.mood < 0.45 ? "minor"
    : dna.scaleMode;

  // Tónica aleatoria entre C3 y G3
  const tonic = 48 + Math.floor(Math.random() * 8);

  const plan = buildHarmonyPlan(tonic, scaleName, dna.period, params.bars, params.mood);

  const secsPerBeat = 60 / params.tempo;

  const melodyNotes = generateMelody(plan, dna, params, secsPerBeat);
  const bassNotes   = generateBass(plan, dna, params, secsPerBeat);

  const allNotes = [...melodyNotes, ...bassNotes].sort((a, b) => a.time - b.time);

  const chordLabels = plan.allChords.map(c => c.label);

  return { notes: allNotes, plan, periodUsed: dna.period, chordLabels };
}

export { composerDNA as DNA };

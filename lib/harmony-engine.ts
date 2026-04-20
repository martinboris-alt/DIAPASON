// ── Tipos ────────────────────────────────────────────────────────────────────

export type ChordQuality = "maj" | "min" | "dom7" | "dim" | "maj7" | "min7" | "aug";
export type CadenceType  = "authentic" | "half" | "plagal" | "deceptive";
export type PhraseType   = "A" | "B" | "A'";

export interface Chord {
  degree:        number;        // 1–7
  root:          number;        // MIDI note number
  intervals:     number[];      // semitones from root [0,4,7] = major triad
  quality:       ChordQuality;
  label:         string;        // "I", "IV", "V7", "VI" …
  startBeat:     number;        // beat within the piece
  durationBeats: number;
}

export interface Phrase {
  type:      PhraseType;
  startBar:  number;
  bars:      number;
  chords:    Chord[];
  cadence:   CadenceType;
}

export interface HarmonyPlan {
  tonic:      number;       // MIDI root note (e.g. 60 = C4)
  scaleName:  string;
  scale:      number[];     // semitone offsets from tonic
  phrases:    Phrase[];
  allChords:  Chord[];      // flat list ordered by startBeat
  totalBeats: number;
}

// ── Escalas ───────────────────────────────────────────────────────────────────

export const SCALES: Record<string, number[]> = {
  major:      [0, 2, 4, 5, 7, 9, 11],
  minor:      [0, 2, 3, 5, 7, 8, 10],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  phrygian:   [0, 1, 3, 5, 7, 8, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  "whole-tone": [0, 2, 4, 6, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

// ── Intervalos de acordes en una tonalidad ────────────────────────────────────

const TRIAD_QUALITIES: Record<string, Record<number, ChordQuality>> = {
  major: { 1: "maj", 2: "min", 3: "min", 4: "maj", 5: "dom7", 6: "min", 7: "dim" },
  minor: { 1: "min", 2: "dim", 3: "maj", 4: "min", 5: "dom7", 6: "maj", 7: "maj" },
  dorian: { 1: "min", 2: "min", 3: "maj", 4: "dom7", 5: "min", 6: "dim", 7: "maj" },
};

const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  maj:  [0, 4, 7],
  min:  [0, 3, 7],
  dom7: [0, 4, 7, 10],
  dim:  [0, 3, 6],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  aug:  [0, 4, 8],
};

const DEGREE_LABELS = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

// ── Progresiones por período ──────────────────────────────────────────────────

// Each progression is an array of [degree, durationInBars]
type ProgTemplate = Array<[number, number]>;

const PROGRESSIONS: Record<string, ProgTemplate[]> = {
  Barroco: [
    [[1,2],[5,1],[1,1]],                         // I–V–I (simple)
    [[1,1],[4,1],[5,1],[1,1]],                   // I–IV–V–I
    [[1,1],[6,1],[4,1],[5,1]],                   // I–VI–IV–V  (romanesca)
    [[1,1],[5,1],[6,1],[3,1],[4,1],[1,1],[5,1],[1,1]], // circle of 5ths
  ],
  Clásico: [
    [[1,1],[5,1],[1,1],[5,1],[1,1],[4,1],[5,1],[1,1]],
    [[1,1],[4,1],[1,1],[5,1],[1,1],[4,1],[5,1],[1,1]],
    [[1,2],[4,1],[5,1]],
    [[1,1],[6,1],[4,1],[5,1]],
  ],
  Romántico: [
    [[1,1],[6,1],[4,1],[5,1]],                   // I–VI–IV–V
    [[1,1],[3,1],[6,1],[2,1],[5,1],[1,1]],        // descending 3rds
    [[1,1],[4,1],[7,1],[3,1],[6,1],[2,1],[5,1],[1,1]], // full diatonic descent
    [[1,2],[6,1],[4,1],[5,2],[1,2]],
  ],
  Moderno: [
    [[1,2],[7,1],[6,1]],                         // I–VII–VI (non-functional)
    [[1,1],[2,1],[4,1],[1,1]],                   // modal
    [[1,2],[4,2]],                               // static / drone
    [[6,1],[4,1],[1,1],[5,1]],                   // VI–IV–I–V (axis)
  ],
};

// ── Constructor de acorde ─────────────────────────────────────────────────────

function buildChord(
  degree:    number,
  tonic:     number,
  scaleName: string,
  scale:     number[],
  startBeat: number,
  durationBeats: number,
): Chord {
  const degreeIdx   = degree - 1;
  const scaleDegree = scale[degreeIdx % scale.length] ?? 0;
  const root        = tonic + scaleDegree;

  const qualityMap  = TRIAD_QUALITIES[scaleName] ?? TRIAD_QUALITIES.major;
  const quality     = qualityMap[degree] ?? "maj";
  const intervals   = CHORD_INTERVALS[quality];

  const isMajKey  = scaleName === "major" || scaleName === "mixolydian";
  const baseLabel = DEGREE_LABELS[degree] ?? `${degree}`;
  const label     = quality === "min" ? baseLabel.toLowerCase()
                  : quality === "dim" ? `${baseLabel.toLowerCase()}°`
                  : quality === "dom7" ? `${baseLabel}7`
                  : quality === "maj7" ? `${baseLabel}Δ`
                  : baseLabel;

  return { degree, root, intervals, quality, label, startBeat, durationBeats };
}

// ── Función pública: construir plan armónico ──────────────────────────────────

export function buildHarmonyPlan(
  tonic:     number,
  scaleName: string,
  period:    string,
  totalBars: number,
  mood:      number,   // 0=dark 1=bright → influences minor/major chord choices
): HarmonyPlan {
  const scale = SCALES[scaleName] ?? SCALES.major;

  // Elegir progresión base según período
  const progList = PROGRESSIONS[period] ?? PROGRESSIONS.Clásico;
  const baseProg = progList[Math.floor(Math.random() * progList.length)];
  const totalProgBars = baseProg.reduce((s, [, d]) => s + d, 0);

  // Distribuir compases en frases de 4/8 bars
  const phrases: Phrase[] = [];
  const allChords: Chord[] = [];
  let barCursor = 0;
  let beatCursor = 0;

  const phraseLength = totalBars <= 8 ? totalBars : totalBars <= 16 ? Math.ceil(totalBars / 2) : 8;
  const phraseTypes: PhraseType[] = totalBars <= phraseLength ? ["A"]
    : totalBars <= phraseLength * 2 ? ["A", "A'"]
    : ["A", "B", "A'"];

  for (let pi = 0; pi < phraseTypes.length; pi++) {
    const pType  = phraseTypes[pi];
    const pBars  = pi === phraseTypes.length - 1
      ? totalBars - barCursor
      : phraseLength;

    const phraseChords: Chord[] = [];

    // Build chords by repeating/truncating baseProg to fill pBars
    let barInPhrase = 0;
    let progIdx = 0;

    // For B section, shift the progression (e.g., start on IV instead of I)
    const degreeShift = pType === "B" ? 3 : 0;

    while (barInPhrase < pBars) {
      const [deg, durBars] = baseProg[progIdx % baseProg.length];
      const actualDur = Math.min(durBars, pBars - barInPhrase);
      const shiftedDeg = pType === "B"
        ? ((deg - 1 + degreeShift) % 7) + 1
        : deg;

      const chord = buildChord(shiftedDeg, tonic, scaleName, scale, beatCursor, actualDur * 4);
      phraseChords.push(chord);
      allChords.push(chord);
      barInPhrase  += actualDur;
      beatCursor   += actualDur * 4;
      progIdx++;
    }

    // Determine cadence type from last two chords
    const last  = phraseChords.at(-1)?.degree ?? 1;
    const penult = phraseChords.at(-2)?.degree ?? 5;
    const cadence: CadenceType =
      last === 1 && penult === 5 ? "authentic" :
      last === 1 && penult === 4 ? "plagal" :
      last === 5 ? "half" :
      last === 6 && penult === 5 ? "deceptive" : "authentic";

    phrases.push({ type: pType, startBar: barCursor, bars: pBars, chords: phraseChords, cadence });
    barCursor += pBars;
  }

  return { tonic, scaleName, scale, phrases, allChords, totalBeats: totalBars * 4 };
}

// ── Helpers para el generador de notas ───────────────────────────────────────

/** Devuelve el acorde activo en un beat dado */
export function chordAtBeat(beat: number, plan: HarmonyPlan): Chord {
  for (let i = plan.allChords.length - 1; i >= 0; i--) {
    if (plan.allChords[i].startBeat <= beat) return plan.allChords[i];
  }
  return plan.allChords[0];
}

/** Snap de una nota al acorde más cercano (chord tone o passing tone) */
export function snapToChordOrScale(
  midi:     number,
  chord:    Chord,
  scale:    number[],
  tonic:    number,
  chordWeight: number, // 0=pure scale  1=pure chord
): number {
  const oct = Math.floor(midi / 12) * 12;
  const pc  = ((midi % 12) + 12) % 12;

  // Chord tones relative to tonic
  const chordPcs = chord.intervals.map(iv => ((chord.root + iv) % 12 + 12) % 12);
  // Scale tones relative to tonic
  const scalePcs = scale.map(s => (tonic % 12 + s) % 12);

  const pool = Math.random() < chordWeight ? chordPcs : scalePcs;

  const closest = pool.reduce((best, p) => {
    const dist = (p: number, t: number) => Math.min(Math.abs(p - t), 12 - Math.abs(p - t));
    return dist(p, pc) < dist(best, pc) ? p : best;
  }, pool[0]);

  return oct + closest;
}

/** Peso de velocidad para un beat dentro de un compás (1=fuerte, 4=débil) */
export function beatVelocityWeight(beatInBar: number): number {
  // Acentos: 1 > 3 > 2 = 4
  const weights = [1.0, 0.65, 0.82, 0.65];
  return weights[beatInBar % 4] ?? 0.7;
}

/** Curva de dinámica de frase (sube hasta la mitad, baja al final) */
export function phraseVelocityCurve(posInPhrase: number): number {
  // posInPhrase: 0–1
  // Bell curve: sube 0→0.5, baja 0.5→1
  return 0.7 + 0.3 * Math.sin(posInPhrase * Math.PI);
}

/** Micro-jitter de timing en segundos */
export function timingJitter(humanization: number): number {
  // humanization: 0–1
  return (Math.random() - 0.5) * 0.025 * humanization;
}

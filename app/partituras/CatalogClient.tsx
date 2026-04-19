"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { composers, pieceDescriptions } from "@/config/composers";

const MidiPlayer = dynamic(() => import("@/components/MidiPlayer"), { ssr: false });

export type Periodo = "Barroco" | "Clásico" | "Romántico" | "Moderno";

export interface PartituraItem {
  titulo:      string;
  compositor:  string;
  periodo:     Periodo;
  filename:    string;
  localPath:   string;
  licencia:    string;
  midiPath?:   string;
}

const periodos: Periodo[] = ["Barroco", "Clásico", "Romántico", "Moderno"];

const periodoColor: Record<Periodo, string> = {
  Barroco:   "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Clásico:   "bg-sky-500/10    text-sky-400    border-sky-500/20",
  Romántico: "bg-rose-500/10   text-rose-400   border-rose-500/20",
  Moderno:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

function getPieceDescription(filename: string): string {
  const key = filename.replace("-a4.pdf", "").toLowerCase();
  for (const [k, v] of Object.entries(pieceDescriptions)) {
    if (key.includes(k)) return v;
  }
  return "";
}

function getComposerInfo(nombre: string) {
  return composers[nombre] ?? null;
}

function formatTitle(filename: string): string {
  return filename
    .replace("-a4.pdf", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ── Card ────────────────────────────────────────────────────────────────────

function PartituraCard({ p }: { p: PartituraItem }) {
  const [expanded, setExpanded] = useState(false);
  const info       = getComposerInfo(p.compositor);
  const pieceDesc  = getPieceDescription(p.filename);
  const titulo     = p.titulo !== p.filename ? p.titulo : formatTitle(p.filename);

  return (
    <div className={`bg-piano-black flex flex-col border-b border-white-warm/5 transition-all duration-300 ${expanded ? "bg-piano-black-soft" : "hover:bg-piano-black-soft"}`}>

      {/* Main row */}
      <div className="flex items-start gap-4 p-5">

        {/* Portrait */}
        {info?.portrait && (
          <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden border border-gold/20 bg-piano-black-mid">
            <Image
              src={info.portrait}
              alt={p.compositor}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              unoptimized={info.portrait.endsWith(".svg")}
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 shrink-0 ${periodoColor[p.periodo]}`}>
              {p.periodo}
            </span>
          </div>
          <h3 className="font-display text-sm font-semibold text-white-warm leading-snug truncate">
            {titulo}
          </h3>
          <p className="text-xs text-gold/60 mt-0.5">{p.compositor}</p>
          {info && (
            <p className="text-[10px] text-white-warm/25 mt-0.5 tracking-wide">{info.vida} · {info.nacionalidad}</p>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <a
            href={p.localPath}
            download={p.filename}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gold border border-gold/30 px-3 py-2 hover:bg-gold hover:text-piano-black transition-all duration-200"
            title="Descargar PDF"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </a>
          {p.midiPath && (
            <button
              onClick={() => setExpanded(e => !e)}
              className={`inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-3 py-2 transition-all duration-200 ${
                expanded
                  ? "border-gold/60 text-gold bg-gold/10"
                  : "border-white-warm/15 text-white-warm/40 hover:border-gold/40 hover:text-gold"
              }`}
              title="Escuchar"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              {expanded ? "Cerrar" : "Escuchar"}
            </button>
          )}
          {!p.midiPath && (info || pieceDesc) && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[10px] tracking-widest uppercase text-white-warm/25 hover:text-gold transition-colors"
            >
              {expanded ? "▲ menos" : "▼ más"}
            </button>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-white-warm/5 mx-5 mb-5 pt-5 flex flex-col gap-5">

          {/* MIDI Player + PDF Viewer */}
          {p.midiPath && (
            <MidiPlayer
              midiPath={p.midiPath}
              pdfPath={p.localPath}
              titulo={titulo}
              compositor={p.compositor}
            />
          )}
        </div>
      )}

      {/* Bio & description (always below player) */}
      {expanded && (info || pieceDesc) && (
        <div className="border-t border-white-warm/5 mx-5 mb-5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Piece description */}
          {pieceDesc && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-2">Sobre esta pieza</p>
              <p className="text-white-soft/65 text-xs leading-relaxed font-light">{pieceDesc}</p>
            </div>
          )}

          {/* Composer bio */}
          {info && (
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-2">Sobre el compositor</p>
              <p className="text-white-soft/65 text-xs leading-relaxed font-light mb-3">{info.bio}</p>
              <div className="flex flex-wrap gap-1">
                {info.estilo.split(" · ").map(tag => (
                  <span key={tag} className="text-[9px] tracking-wider uppercase text-gold/40 border border-gold/15 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main catalog ─────────────────────────────────────────────────────────────

interface Props { partituras: PartituraItem[]; }

export default function CatalogClient({ partituras }: Props) {
  const [busqueda, setBusqueda]         = useState("");
  const [periodoActivo, setPeriodo]     = useState<Periodo | "Todos">("Todos");
  const [compositorActivo, setCompositor] = useState("Todos");

  const listaCompositores = useMemo(() => {
    const set = new Set(partituras.map(p => p.compositor));
    return ["Todos", ...Array.from(set).sort()];
  }, [partituras]);

  const resultados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return partituras.filter(p => {
      const titulo = formatTitle(p.filename).toLowerCase();
      const matchQ = !q || titulo.includes(q) || p.compositor.toLowerCase().includes(q) || p.titulo.toLowerCase().includes(q);
      const matchP = periodoActivo === "Todos" || p.periodo === periodoActivo;
      const matchC = compositorActivo === "Todos" || p.compositor === compositorActivo;
      return matchQ && matchP && matchC;
    });
  }, [busqueda, periodoActivo, compositorActivo, partituras]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-28">

      {/* Search */}
      <div className="relative mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white-warm/30 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por título o compositor…"
          className="w-full bg-piano-black-soft border border-white-warm/10 focus:border-gold/50 pl-12 pr-4 py-4 text-white-warm placeholder-white-warm/30 text-sm focus:outline-none transition-colors tracking-wide"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] tracking-widest uppercase text-white-warm/25 w-16">Período</span>
          {(["Todos", ...periodos] as const).map(p => (
            <button key={p} onClick={() => setPeriodo(p as Periodo | "Todos")}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-all duration-200 ${
                periodoActivo === p ? "border-gold bg-gold/10 text-gold" : "border-white-warm/10 text-white-warm/40 hover:border-gold/30 hover:text-white-warm/70"
              }`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] tracking-widest uppercase text-white-warm/25 w-16">Autor</span>
          <div className="relative">
            <select value={compositorActivo} onChange={e => setCompositor(e.target.value)}
              className="bg-piano-black-soft border border-white-warm/10 focus:border-gold/50 px-4 py-2 text-xs text-white-warm/70 focus:outline-none appearance-none pr-8"
              style={{ background: "var(--color-piano-black-soft)" }}>
              {listaCompositores.map(c => (
                <option key={c} value={c} style={{ background: "var(--color-piano-black)" }}>{c}</option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white-warm/30 pointer-events-none">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {(periodoActivo !== "Todos" || compositorActivo !== "Todos" || busqueda) && (
            <button onClick={() => { setBusqueda(""); setPeriodo("Todos"); setCompositor("Todos"); }}
              className="text-xs tracking-widest uppercase text-gold/50 hover:text-gold transition-colors px-2">
              × Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs tracking-widest uppercase text-white-warm/25 mb-4">
        {resultados.length.toLocaleString()} {resultados.length === 1 ? "partitura" : "partituras"}
        <span className="text-white-warm/15 ml-3">· clic en ▼ más para ver bio y descripción</span>
      </p>

      {/* List */}
      {resultados.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-white-warm/30 italic">Sin resultados</p>
        </div>
      ) : (
        <div className="border border-white-warm/5">
          {resultados.map((p, i) => <PartituraCard key={i} p={p} />)}
        </div>
      )}
    </div>
  );
}

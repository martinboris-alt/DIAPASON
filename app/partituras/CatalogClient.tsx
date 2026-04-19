"use client";

import { useState, useMemo } from "react";
import { partituras, type Periodo, type Nivel } from "@/config/partituras";

const periodos: Periodo[] = ["Barroco", "Clásico", "Romántico", "Moderno"];
const niveles: Nivel[]    = ["Principiante", "Intermedio", "Avanzado"];

const nivelColor: Record<Nivel, string> = {
  Principiante: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5",
  Intermedio:   "text-amber-500  border-amber-500/30  bg-amber-500/5",
  Avanzado:     "text-rose-400   border-rose-400/30   bg-rose-400/5",
};

const periodoColor: Record<Periodo, string> = {
  Barroco:   "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Clásico:   "bg-sky-500/10    text-sky-400    border-sky-500/20",
  Romántico: "bg-rose-500/10   text-rose-400   border-rose-500/20",
  Moderno:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

export default function CatalogClient() {
  const [busqueda, setBusqueda]         = useState("");
  const [periodoActivo, setPeriodo]     = useState<Periodo | "Todos">("Todos");
  const [nivelActivo, setNivel]         = useState<Nivel | "Todos">("Todos");

  const resultados = useMemo(() => {
    return partituras.filter((p) => {
      const matchBusqueda =
        busqueda === "" ||
        p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.compositor.toLowerCase().includes(busqueda.toLowerCase());
      const matchPeriodo = periodoActivo === "Todos" || p.periodo === periodoActivo;
      const matchNivel   = nivelActivo   === "Todos" || p.nivel   === nivelActivo;
      return matchBusqueda && matchPeriodo && matchNivel;
    });
  }, [busqueda, periodoActivo, nivelActivo]);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-28">

      {/* Search */}
      <div className="relative mb-10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white-warm/30"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título o compositor…"
          className="w-full bg-piano-black-soft border border-white-warm/10 focus:border-gold/50 pl-12 pr-4 py-4 text-white-warm placeholder-white-warm/30 text-sm focus:outline-none transition-colors duration-300 tracking-wide"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        {/* Período */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] tracking-widest uppercase text-white-warm/30 self-center mr-1">Período</span>
          {(["Todos", ...periodos] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p as Periodo | "Todos")}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-all duration-200 ${
                periodoActivo === p
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-white-warm/10 text-white-warm/40 hover:border-gold/30 hover:text-white-warm/70"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px bg-white-warm/10 mx-2" />

        {/* Nivel */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] tracking-widest uppercase text-white-warm/30 self-center mr-1">Nivel</span>
          {(["Todos", ...niveles] as const).map((n) => (
            <button
              key={n}
              onClick={() => setNivel(n as Nivel | "Todos")}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-all duration-200 ${
                nivelActivo === n
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-white-warm/10 text-white-warm/40 hover:border-gold/30 hover:text-white-warm/70"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs tracking-widest uppercase text-white-warm/30 mb-8">
        {resultados.length} {resultados.length === 1 ? "partitura" : "partituras"} encontradas
      </p>

      {/* Grid */}
      {resultados.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-white-warm/30 italic">Sin resultados</p>
          <button
            onClick={() => { setBusqueda(""); setPeriodo("Todos"); setNivel("Todos"); }}
            className="mt-4 text-xs tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white-warm/5">
          {resultados.map((p) => (
            <div
              key={p.id}
              className="bg-piano-black group flex flex-col p-6 hover:bg-piano-black-soft transition-colors duration-300"
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${periodoColor[p.periodo]}`}>
                  {p.periodo}
                </span>
                <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${nivelColor[p.nivel]}`}>
                  {p.nivel}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-base font-semibold text-white-warm leading-snug mb-1 group-hover:text-gold transition-colors duration-300">
                {p.titulo}
              </h3>
              <p className="text-xs tracking-wide text-gold/70 mb-3">{p.compositor} · {p.anio}</p>

              {/* Difficulty */}
              <div className="flex items-center gap-1.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < p.dificultad ? "bg-gold/70" : "bg-white-warm/10"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-white-warm/30 ml-1">{p.dificultad}/5</span>
              </div>

              {/* Description */}
              <p className="text-white-soft/60 text-xs leading-relaxed font-light flex-1 mb-6">
                {p.descripcion}
              </p>

              {/* CTA */}
              <a
                href={p.imslpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold border border-gold/30 px-4 py-2.5 hover:bg-gold hover:text-piano-black transition-all duration-300 w-fit mt-auto"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Ver en IMSLP
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

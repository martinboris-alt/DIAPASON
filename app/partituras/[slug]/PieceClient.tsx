"use client";

import dynamic from "next/dynamic";
import { PlayerProvider } from "@/context/PlayerContext";

const MidiPlayer = dynamic(() => import("@/components/MidiPlayer"), { ssr: false });

interface Props {
  midiPath:   string;
  pdfPath:    string;
  titulo:     string;
  compositor: string;
  filename:   string;
}

export default function PieceClient({ midiPath, pdfPath, titulo, compositor, filename }: Props) {
  return (
    <PlayerProvider>
      <div className="space-y-6">
        {/* Botón descarga PDF directo */}
        <div className="flex flex-wrap gap-3">
          <a
            href={pdfPath}
            download={filename}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold border border-gold/40 px-6 py-3 hover:bg-gold hover:text-piano-black transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PDF
          </a>
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white-warm/50 border border-white-warm/15 px-6 py-3 hover:border-gold/40 hover:text-gold transition-all duration-300"
          >
            Abrir en pestaña nueva ↗
          </a>
        </div>

        {/* Reproductor MIDI */}
        {midiPath && (
          <MidiPlayer
            midiPath={midiPath}
            pdfPath={pdfPath}
            titulo={titulo}
            compositor={compositor}
          />
        )}
      </div>
    </PlayerProvider>
  );
}

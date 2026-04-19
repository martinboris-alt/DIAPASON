"use client";

import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  pdfPath: string;
  progress: number;   // 0–1
  isPlaying: boolean;
}

export default function PdfViewer({ pdfPath, progress, isPlaying }: Props) {
  const [numPages, setNumPages]     = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth]           = useState(600);
  const [manualOverride, setManual] = useState(false);

  // Calcular página automáticamente basándose en el progreso
  useEffect(() => {
    if (manualOverride || numPages === 0) return;
    const target = Math.min(Math.floor(progress * numPages) + 1, numPages);
    setCurrentPage(target);
  }, [progress, numPages, manualOverride]);

  // Cuando se reinicia la reproducción, quitar override manual
  useEffect(() => {
    if (progress === 0) {
      setManual(false);
      setCurrentPage(1);
    }
  }, [progress]);

  const onDocumentLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  const goTo = (page: number) => {
    setManual(true);
    setCurrentPage(Math.max(1, Math.min(page, numPages)));
  };

  return (
    <div className="flex flex-col bg-piano-black-mid border border-white-warm/8">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white-warm/5">
        <div className="flex items-center gap-3">
          {/* Prev */}
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-7 h-7 flex items-center justify-center border border-white-warm/10 text-white-warm/40 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Page indicator */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={currentPage}
              onChange={e => goTo(Number(e.target.value))}
              className="w-10 text-center bg-transparent border-b border-white-warm/20 focus:border-gold text-white-warm text-xs py-0.5 focus:outline-none"
            />
            <span className="text-white-warm/25 text-xs">/ {numPages || "…"}</span>
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage >= numPages}
            className="w-7 h-7 flex items-center justify-center border border-white-warm/10 text-white-warm/40 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto indicator */}
          {isPlaying && !manualOverride && (
            <span className="text-[9px] tracking-widest uppercase text-gold/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse inline-block"/>
              Auto
            </span>
          )}
          {manualOverride && (
            <button
              onClick={() => setManual(false)}
              className="text-[9px] tracking-widest uppercase text-white-warm/25 hover:text-gold transition-colors"
              title="Volver a sincronización automática"
            >
              ↺ Sync
            </button>
          )}

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button onClick={() => setWidth(w => Math.max(300, w - 80))}
              className="text-white-warm/30 hover:text-gold text-xs px-1 transition-colors">−</button>
            <span className="text-[10px] text-white-warm/20">{Math.round((width / 600) * 100)}%</span>
            <button onClick={() => setWidth(w => Math.min(1200, w + 80))}
              className="text-white-warm/30 hover:text-gold text-xs px-1 transition-colors">+</button>
          </div>
        </div>
      </div>

      {/* PDF Page */}
      <div className="overflow-auto max-h-[70vh] flex justify-center bg-[#2a2a2a] p-4">
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoad}
          loading={
            <div className="flex items-center justify-center h-64 w-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3"/>
                <p className="text-white-warm/30 text-xs tracking-widest uppercase">Cargando partitura…</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-40">
              <p className="text-white-warm/30 text-xs">No se pudo cargar el PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={width}
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className="shadow-2xl"
          />
        </Document>
      </div>

      {/* Page progress bar */}
      {numPages > 1 && (
        <div className="flex gap-px px-4 py-2 border-t border-white-warm/5">
          {Array.from({ length: numPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i + 1)}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i + 1 === currentPage ? "bg-gold" : i + 1 < currentPage ? "bg-gold/30" : "bg-white-warm/10"
              }`}
              title={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

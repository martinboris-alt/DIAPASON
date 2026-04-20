import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PieceClient from "./PieceClient";
import { partituraSlug, formatPartituraTitle, composerSlug } from "@/lib/slug";
import { composers, pieceDescriptions } from "@/config/composers";

interface CatalogItem {
  compositor: string;
  filename:   string;
  localPath:  string;
  midiPath?:  string;
  periodo:    "Barroco" | "Clásico" | "Romántico" | "Moderno";
  licencia:   string;
}

function loadCatalog(): CatalogItem[] {
  const p = path.join(process.cwd(), "config", "mutopia-catalog.json");
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return []; }
}

function findPiece(slug: string): CatalogItem | undefined {
  const catalog = loadCatalog();
  return catalog.find(p => partituraSlug(p) === slug);
}

function getPieceDescription(filename: string): string | null {
  const key = filename.replace("-a4.pdf", "").toLowerCase();
  for (const [k, v] of Object.entries(pieceDescriptions)) {
    if (key.includes(k)) return v;
  }
  return null;
}

// Asegurar que el MIDI existe físicamente antes de ofrecerlo
function ensureMidi(piece: CatalogItem): CatalogItem {
  if (!piece.midiPath) return piece;
  const full = path.join(process.cwd(), "public", piece.midiPath.replace(/^\//, ""));
  if (!fs.existsSync(full)) { const { midiPath: _, ...rest } = piece; return rest; }
  return piece;
}

// ── Metadata dinámica ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const piece = findPiece(slug);
  if (!piece) return { title: "Partitura no encontrada — Diapasón" };

  const titulo = formatPartituraTitle(piece.filename);
  const desc = getPieceDescription(piece.filename) ??
    `Descarga gratis la partitura de ${titulo} de ${piece.compositor} en PDF. Dominio público, sin registro.`;

  return {
    title: `${titulo} — ${piece.compositor} · Partitura PDF gratis`,
    description: desc,
    keywords: `${titulo}, ${piece.compositor}, partitura piano, PDF gratis, descargar partitura, ${piece.periodo}`,
    alternates: { canonical: `https://diapason.vercel.app/partituras/${slug}` },
    openGraph: {
      title: `${titulo} — ${piece.compositor}`,
      description: desc,
      type: "article",
    },
  };
}

// ── Generación estática de todas las slugs ──────────────────────────────────
export async function generateStaticParams() {
  const catalog = loadCatalog();
  return catalog.map(p => ({ slug: partituraSlug(p) }));
}

// ── Página ──────────────────────────────────────────────────────────────────
export default async function PartituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = findPiece(slug);
  if (!raw) notFound();
  const piece = ensureMidi(raw);

  const titulo   = formatPartituraTitle(piece.filename);
  const info     = composers[piece.compositor] ?? null;
  const pieceDesc = getPieceDescription(piece.filename);

  // JSON-LD: MusicComposition schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "name": titulo,
    "composer": {
      "@type": "Person",
      "name": piece.compositor,
    },
    "musicCompositionForm": "Piano",
    "inLanguage": "es",
    "license": "https://creativecommons.org/publicdomain/",
  };

  // Piezas relacionadas (mismo compositor)
  const relacionadas = loadCatalog()
    .filter(p => p.compositor === piece.compositor && p.filename !== piece.filename)
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs tracking-widest uppercase text-white-warm/30">
          <Link href="/" className="hover:text-gold transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/partituras" className="hover:text-gold transition-colors">Partituras</Link>
          <span className="mx-2">/</span>
          <span className="text-white-warm/50">{titulo}</span>
        </div>

        {/* Header */}
        <article className="max-w-6xl mx-auto px-6 py-10 border-b border-white-warm/5">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 items-start">
            {info?.portrait && (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-gold/20 bg-piano-black-mid shrink-0">
                <Image
                  src={info.portrait}
                  alt={piece.compositor}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  unoptimized={info.portrait.endsWith(".svg")}
                />
              </div>
            )}
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3 font-light">
                Partitura de piano · {piece.periodo}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white-warm mb-3 leading-tight">
                {titulo}
              </h1>
              <p className="text-white-soft/60 text-base">
                por{" "}
                <Link
                  href={`/compositores/${composerSlug(piece.compositor)}`}
                  className="text-gold/80 hover:text-gold italic transition-colors underline-offset-4 hover:underline"
                >
                  {piece.compositor}
                </Link>
                {info && <span className="text-white-warm/30 text-sm"> · {info.vida}</span>}
              </p>
            </div>
          </div>
        </article>

        {/* Player interactivo */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <PieceClient
            midiPath={piece.midiPath ?? ""}
            pdfPath={piece.localPath}
            titulo={titulo}
            compositor={piece.compositor}
            filename={piece.filename}
          />
        </div>

        {/* Descripción + bio */}
        <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white-warm/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {pieceDesc && (
              <section>
                <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                  Sobre esta obra
                </h2>
                <p className="text-white-soft/75 text-sm leading-relaxed font-light">
                  {pieceDesc}
                </p>
              </section>
            )}
            {info && (
              <section>
                <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                  Sobre el compositor
                </h2>
                <p className="text-white-soft/75 text-sm leading-relaxed font-light mb-4">
                  {info.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {info.estilo.split(" · ").map(tag => (
                    <span key={tag} className="text-[10px] tracking-wider uppercase text-gold/50 border border-gold/15 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 py-12 border-t border-white-warm/5">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
              Más obras de {piece.compositor.split(" ").pop()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white-warm/5">
              {relacionadas.map(r => (
                <Link
                  key={r.filename}
                  href={`/partituras/${partituraSlug(r)}`}
                  className="bg-piano-black p-4 hover:bg-piano-black-soft transition-colors group"
                >
                  <p className="text-[10px] tracking-wider uppercase text-gold/50 mb-1">{r.periodo}</p>
                  <h3 className="font-display text-sm text-white-warm group-hover:text-gold transition-colors line-clamp-2">
                    {formatPartituraTitle(r.filename)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-white-warm/5 text-center">
          <p className="text-white-warm/40 text-sm font-light mb-4">
            ¿Tu piano necesita afinación antes de interpretar esta obra?
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Solicitar servicio en Chile
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

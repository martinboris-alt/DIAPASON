import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { partituraSlug, formatPartituraTitle, composerSlug } from "@/lib/slug";
import { composers } from "@/config/composers";

interface CatalogItem {
  compositor: string;
  filename:   string;
  localPath:  string;
  midiPath?:  string;
  periodo:    "Barroco" | "Clásico" | "Romántico" | "Moderno";
}

const periodoColor = {
  Barroco:   "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Clásico:   "bg-sky-500/10    text-sky-400    border-sky-500/20",
  Romántico: "bg-rose-500/10   text-rose-400   border-rose-500/20",
  Moderno:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

function loadCatalog(): CatalogItem[] {
  const p = path.join(process.cwd(), "config", "mutopia-catalog.json");
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return []; }
}

function findComposer(slug: string) {
  const catalog = loadCatalog();
  const allComposers = Array.from(new Set(catalog.map(c => c.compositor)));
  return allComposers.find(c => composerSlug(c) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const nombre = findComposer(slug);
  if (!nombre) return { title: "Compositor no encontrado — Diapasón" };

  const info = composers[nombre];
  const desc = info?.bio
    ? `${info.bio.slice(0, 155)}…`
    : `Descarga partituras gratis de ${nombre} en PDF. Obras completas de dominio público.`;

  return {
    title: `${nombre} — Partituras de Piano Gratis · Diapasón`,
    description: desc,
    keywords: `${nombre}, partituras piano, PDF gratis, ${info?.nacionalidad ?? ""}, ${info?.estilo ?? ""}`,
    alternates: { canonical: `https://diapason.vercel.app/compositores/${slug}` },
    openGraph: {
      title: `${nombre} · Partituras de Piano`,
      description: desc,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  const catalog = loadCatalog();
  const names = Array.from(new Set(catalog.map(c => c.compositor)));
  return names.map(nombre => ({ slug: composerSlug(nombre) }));
}

export default async function ComposerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = findComposer(slug);
  if (!nombre) notFound();

  const info = composers[nombre] ?? null;
  const catalog = loadCatalog();
  const obras = catalog.filter(c => c.compositor === nombre);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": nombre,
    ...(info?.nacionalidad && { "nationality": info.nacionalidad }),
    ...(info?.bio && { "description": info.bio }),
    "jobTitle": "Compositor",
  };

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
          <span className="text-white-warm/50">{nombre}</span>
        </div>

        {/* Header */}
        <article className="max-w-6xl mx-auto px-6 py-12 border-b border-white-warm/5">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
            {info?.portrait && (
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border border-gold/20 bg-piano-black-mid shrink-0">
                <Image
                  src={info.portrait}
                  alt={nombre}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  unoptimized={info.portrait.endsWith(".svg")}
                />
              </div>
            )}
            <div>
              {info && (
                <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3 font-light">
                  {info.vida} · {info.nacionalidad}
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white-warm mb-4 leading-tight">
                {nombre}
              </h1>
              {info && (
                <p className="text-white-soft/75 text-base leading-relaxed font-light max-w-2xl mb-4">
                  {info.bio}
                </p>
              )}
              {info && (
                <div className="flex flex-wrap gap-2">
                  {info.estilo.split(" · ").map(tag => (
                    <span key={tag} className="text-[10px] tracking-wider uppercase text-gold/60 border border-gold/20 px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Lista de obras */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white-warm">
              Obras disponibles
            </h2>
            <span className="text-xs tracking-widest uppercase text-white-warm/40">
              {obras.length} {obras.length === 1 ? "partitura" : "partituras"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white-warm/5">
            {obras.map(o => (
              <Link
                key={o.filename}
                href={`/partituras/${partituraSlug(o)}`}
                className="bg-piano-black p-5 group hover:bg-piano-black-soft transition-colors flex flex-col"
              >
                <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 w-fit mb-3 ${periodoColor[o.periodo]}`}>
                  {o.periodo}
                </span>
                <h3 className="font-display text-sm font-semibold text-white-warm leading-snug mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                  {formatPartituraTitle(o.filename)}
                </h3>
                <span className="text-[10px] tracking-widest uppercase text-gold/60 mt-auto">
                  Ver partitura →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-white-warm/5 text-center">
          <p className="text-white-warm/40 text-sm font-light mb-4">
            Afinación profesional de pianos en Chile · Diapasón
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Solicitar servicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

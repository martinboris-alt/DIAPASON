import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marcas } from "@/config/marcas";

export async function generateStaticParams() {
  return marcas.map(m => ({ slug: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const marca = marcas.find(m => m.id === slug);
  if (!marca) return { title: "Marca no encontrada · Diapasón" };
  return {
    title: `${marca.nombre} · Historia y modelos de piano · Diapasón`,
    description: marca.resumen,
    keywords: `${marca.nombre}, piano ${marca.nombre}, historia ${marca.nombre}, ${marca.pais}, ${marca.ciudad}, marca de piano`,
    alternates: { canonical: `https://diapason.vercel.app/marcas/${slug}` },
    openGraph: { title: marca.nombre, description: marca.resumen, type: "article" },
  };
}

export default async function MarcaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const marca = marcas.find(m => m.id === slug);
  if (!marca) notFound();

  const otrasMarcas = marcas.filter(m => m.id !== marca.id);
  const indice = marcas.findIndex(m => m.id === marca.id);
  const anterior = indice > 0 ? marcas[indice - 1] : null;
  const siguiente = indice < marcas.length - 1 ? marcas[indice + 1] : null;

  // Structured data: Organization schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": marca.nombre,
    "foundingDate": String(marca.fundacion),
    "foundingLocation": { "@type": "Place", "name": `${marca.ciudad}, ${marca.pais}` },
    "founder": { "@type": "Person", "name": marca.fundador },
    "description": marca.resumen,
    ...(marca.webOficial && { "url": marca.webOficial }),
    ...(marca.cese && { "dissolutionDate": String(marca.cese) }),
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
          <Link href="/marcas" className="hover:text-gold transition-colors">Marcas</Link>
          <span className="mx-2">/</span>
          <span className="text-white-warm/50">{marca.nombre}</span>
        </div>

        {/* Header */}
        <section className="max-w-6xl mx-auto px-6 py-10 border-b border-white-warm/5">
          {/* Logo destacado */}
          <div className="mb-10 p-8 bg-piano-black-soft border border-white-warm/5 flex items-center justify-center">
            <div className="relative w-full max-w-xl h-24 sm:h-28">
              <Image src={marca.logo} alt={marca.nombre} fill className="object-contain" unoptimized />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                {marca.pais} · Fundada en {marca.fundacion}{marca.cese && ` – ${marca.cese}`}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white-warm mb-4 leading-tight">
                {marca.nombre}
              </h1>
              <p className="font-display italic text-base sm:text-lg mb-6" style={{ color: marca.acento }}>
                « {marca.lema} »
              </p>
              <p className="text-white-soft/80 text-base sm:text-lg font-light leading-relaxed">
                {marca.historia}
              </p>
            </div>

            {/* Data card */}
            <aside className="border border-white-warm/10 p-6 bg-piano-black-soft/50 self-start">
              <div className="relative w-full aspect-[200/260] mb-5">
                <Image src={marca.emblema} alt={marca.nombre} fill className="object-contain" unoptimized />
              </div>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Fundador</dt>
                  <dd className="text-white-warm/80 italic">{marca.fundador}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Sede</dt>
                  <dd className="text-white-warm/80">{marca.ciudad}</dd>
                </div>
                {marca.produccionAnual && (
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Producción</dt>
                    <dd className="text-white-warm/80">{marca.produccionAnual}</dd>
                  </div>
                )}
                {marca.precioRango && (
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-white-warm/30 mb-1">Rango precio</dt>
                    <dd className="text-white-warm/80 text-xs">{marca.precioRango}</dd>
                  </div>
                )}
                {marca.webOficial && (
                  <div className="pt-3 border-t border-white-warm/10">
                    <a
                      href={marca.webOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-gold/70 hover:text-gold transition-colors"
                    >
                      Sitio oficial ↗
                    </a>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        </section>

        {/* Historia extensa */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
            Historia
          </h2>
          <div className="space-y-5">
            {marca.historiaExtensa.map((p, i) => (
              <p key={i} className="text-white-soft/80 text-base leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Sonido + Fabricación */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white-warm/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                Identidad sonora
              </h2>
              <p className="text-white-soft/75 text-sm sm:text-base leading-relaxed font-light">
                {marca.sonido}
              </p>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
                Proceso de fabricación
              </h2>
              <p className="text-white-soft/75 text-sm sm:text-base leading-relaxed font-light">
                {marca.fabricacion}
              </p>
            </div>
          </div>
        </section>

        {/* Hitos / Timeline */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-8 font-light">
            Hitos en la historia
          </h2>
          <ol className="relative border-l border-gold/20 ml-3 space-y-6">
            {marca.hitos.map((h, i) => (
              <li key={i} className="pl-6">
                <span className="absolute -left-[7px] w-3 h-3 rounded-full border border-gold/50 bg-piano-black" />
                <p className="font-display text-lg font-semibold text-gold mb-1">{h.anio}</p>
                <p className="text-white-soft/75 text-sm font-light leading-relaxed">{h.evento}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Modelos */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-8 font-light">
            Modelos destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white-warm/5">
            {marca.modelos.map((m, i) => (
              <div
                key={i}
                className={`bg-piano-black p-6 flex flex-col ${m.emblematico ? "border-l-2" : ""}`}
                style={m.emblematico ? { borderLeftColor: marca.acento } : undefined}
              >
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <h3 className="font-display text-lg font-semibold text-white-warm">{m.nombre}</h3>
                  {m.emblematico && (
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: marca.acento }}>
                      ★ Emblemático
                    </span>
                  )}
                </div>
                <p className="text-[10px] tracking-wider uppercase text-gold/60 mb-3">{m.tipo}</p>
                <p className="text-white-soft/70 text-sm leading-relaxed font-light">{m.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Innovaciones */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
            Innovaciones técnicas
          </h2>
          <ul className="space-y-3">
            {marca.innovaciones.map((inn, i) => (
              <li key={i} className="flex items-start gap-3 text-white-soft/75 text-sm md:text-base font-light leading-relaxed">
                <span className="text-gold/60 mt-0.5 shrink-0">◆</span>
                <span>{inn}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Intérpretes */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
            Intérpretes legendarios
          </h2>
          <div className="flex flex-wrap gap-2">
            {marca.usuarios.map(u => (
              <span
                key={u}
                className="text-xs sm:text-sm tracking-wide text-white-warm/70 border border-white-warm/10 px-4 py-2 hover:border-gold/40 hover:text-white-warm transition-colors"
              >
                {u}
              </span>
            ))}
          </div>
        </section>

        {/* Curiosidades */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
            Curiosidades
          </h2>
          <ul className="space-y-4">
            {marca.curiosidades.map((c, i) => (
              <li
                key={i}
                className="relative pl-10 text-white-soft/75 text-sm sm:text-base leading-relaxed font-light"
              >
                <span
                  className="absolute left-0 top-0 font-display text-2xl leading-none opacity-40"
                  style={{ color: marca.acento }}
                >
                  ❝
                </span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Navegación prev/next */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white-warm/5">
          <div className="grid grid-cols-2 gap-4">
            {anterior ? (
              <Link
                href={`/marcas/${anterior.id}`}
                className="p-5 border border-white-warm/10 hover:border-gold/30 hover:bg-piano-black-soft transition-all group"
              >
                <p className="text-[10px] tracking-widest uppercase text-white-warm/30 mb-2 group-hover:text-gold/60 transition-colors">
                  ← Anterior
                </p>
                <p className="font-display text-base text-white-warm group-hover:text-gold transition-colors">
                  {anterior.nombre}
                </p>
              </Link>
            ) : <div />}
            {siguiente ? (
              <Link
                href={`/marcas/${siguiente.id}`}
                className="p-5 border border-white-warm/10 hover:border-gold/30 hover:bg-piano-black-soft transition-all group text-right"
              >
                <p className="text-[10px] tracking-widest uppercase text-white-warm/30 mb-2 group-hover:text-gold/60 transition-colors">
                  Siguiente →
                </p>
                <p className="font-display text-base text-white-warm group-hover:text-gold transition-colors">
                  {siguiente.nombre}
                </p>
              </Link>
            ) : <div />}
          </div>
        </section>

        {/* Otras marcas */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-white-warm/5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light text-center">
            Otras casas del piano
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-px bg-white-warm/5">
            {otrasMarcas.map(m => (
              <Link
                key={m.id}
                href={`/marcas/${m.id}`}
                className="bg-piano-black p-4 flex items-center justify-center h-20 group hover:bg-piano-black-soft transition-colors"
                title={m.nombre}
              >
                <div className="relative w-full h-full opacity-50 group-hover:opacity-100 transition-opacity">
                  <Image src={m.logo} alt={m.nombre} fill className="object-contain" unoptimized />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white-warm/5 text-center">
          <p className="font-display text-xl italic text-white-warm/60 mb-2">
            ¿Tienes un piano {marca.nombre}?
          </p>
          <p className="text-white-warm/40 text-sm font-light mb-6">
            Servicio profesional de afinación y mantenimiento en Chile · Diapasón
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
          >
            Solicitar afinación
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles, type Article, type Block } from "@/config/blog";

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: `${article.title} · Diapasón`,
    description: article.description,
    keywords: article.keywords.join(", "),
    openGraph: { title: article.title, description: article.description, type: "article" },
  };
}

const categoryColor: Record<string, string> = {
  "Mantenimiento":   "bg-sky-500/10    text-sky-400    border-sky-500/20",
  "Guía de compra":  "bg-amber-500/10  text-amber-400  border-amber-500/20",
  "Historia":        "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Técnica":         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white-warm mt-12 mb-5 leading-tight">{block.text}</h2>;
    case "h3":
      return <h3 className="font-display text-xl font-semibold text-white-warm mt-8 mb-3">{block.text}</h3>;
    case "p":
      return <p className="text-white-soft/80 text-base leading-relaxed font-light mb-5">{block.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2 mb-6 pl-1">
          {block.items?.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-white-soft/75 text-base font-light leading-relaxed">
              <span className="text-gold/60 mt-2 shrink-0 text-[6px]">●</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-2 mb-6 pl-1">
          {block.items?.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-white-soft/75 text-base font-light leading-relaxed">
              <span className="text-gold/70 shrink-0 tabular-nums font-display">{i + 1}.</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-gold/40 pl-6 my-8 font-display italic text-lg sm:text-xl text-gold/80 leading-relaxed">
          {block.text}
        </blockquote>
      );
    case "callout":
      return (
        <aside className="my-8 border border-gold/20 bg-gold/5 p-5 flex items-start gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gold/70 mt-1 shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-white-warm/80 text-sm font-light leading-relaxed">{block.text}</p>
        </aside>
      );
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article: Article | undefined = articles.find(a => a.slug === slug);
  if (!article) notFound();

  // Artículos relacionados (misma categoría)
  const relacionados = articles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt ?? article.publishedAt,
    "author": { "@type": "Person", "name": "Diego Juica" },
    "publisher": { "@type": "Organization", "name": "Diapasón" },
    "articleSection": article.category,
    "keywords": article.keywords.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs tracking-widest uppercase text-white-warm/30">
          <Link href="/" className="hover:text-gold transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-white-warm/50 truncate">{article.category}</span>
        </div>

        {/* Header */}
        <header className="max-w-3xl mx-auto px-6 py-10 border-b border-white-warm/5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`text-[10px] tracking-wider uppercase border px-2 py-0.5 ${categoryColor[article.category]}`}>
              {article.category}
            </span>
            <span className="text-[10px] text-white-warm/40">{article.readTime} min de lectura</span>
            <span className="text-[10px] text-white-warm/40">·</span>
            <time dateTime={article.publishedAt} className="text-[10px] text-white-warm/40">
              {new Date(article.publishedAt).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white-warm leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-white-soft/60 text-base sm:text-lg font-light leading-relaxed">
            {article.summary}
          </p>
        </header>

        {/* Cuerpo */}
        <article className="max-w-3xl mx-auto px-6 py-10">
          {article.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
        </article>

        {/* Autor + CTA */}
        <div className="max-w-3xl mx-auto px-6 py-10 border-t border-white-warm/5">
          <div className="border border-gold/20 bg-piano-black-soft p-6 text-center">
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">Diego Juica</p>
            <p className="text-white-soft/70 text-sm font-light leading-relaxed mb-5">
              Afinador profesional de pianos con más de una década de experiencia en Chile.
              Servicios de afinación, reparación y consultoría.
            </p>
            <Link
              href="/#contacto"
              className="inline-block px-6 py-3 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
            >
              Solicitar servicio
            </Link>
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 py-10 border-t border-white-warm/5">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-light">
              Sigue leyendo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relacionados.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block p-5 border border-white-warm/10 hover:border-gold/30 bg-piano-black hover:bg-piano-black-soft transition-all group"
                >
                  <h3 className="font-display text-sm font-semibold text-white-warm group-hover:text-gold transition-colors leading-snug mb-2 line-clamp-3">
                    {r.title}
                  </h3>
                  <span className="text-[10px] tracking-widest uppercase text-gold/60">Leer →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

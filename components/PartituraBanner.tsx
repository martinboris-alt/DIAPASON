import Link from "next/link";
import { partituras } from "@/config/partituras";

const destacadas = partituras.slice(0, 4);

export default function PartituraBanner() {
  return (
    <section className="py-20 px-6 bg-piano-black-mid border-y border-white-warm/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
              Recurso gratuito
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white-warm leading-tight mb-4">
              Partituras de Piano
              <br />
              <em className="italic text-gold">en dominio público</em>
            </h2>
            <p className="text-white-soft/60 text-sm font-light leading-relaxed mb-8 max-w-md">
              Accede gratis a más de {partituras.length} obras clásicas de Bach, Beethoven, Chopin,
              Debussy y más — organizadas por nivel y período histórico.
            </p>
            <Link
              href="/partituras"
              className="inline-flex items-center gap-3 px-8 py-4 border border-gold/60 text-gold text-xs tracking-widest uppercase hover:bg-gold hover:text-piano-black transition-all duration-300"
            >
              Ver catálogo completo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right — preview cards */}
          <div className="grid grid-cols-2 gap-2">
            {destacadas.map((p) => (
              <Link
                key={p.id}
                href="/partituras"
                className="group p-4 border border-white-warm/8 hover:border-gold/30 bg-piano-black hover:bg-piano-black-soft transition-all duration-300"
              >
                <p className="text-[10px] tracking-widest uppercase text-gold/60 mb-1">{p.periodo}</p>
                <p className="text-white-warm text-sm font-display leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                  {p.titulo}
                </p>
                <p className="text-white-warm/30 text-xs mt-1">{p.compositor}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

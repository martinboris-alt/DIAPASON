"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-piano-black border-t border-white-warm/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div>
          <p className="font-display text-base font-semibold tracking-widest text-white-warm">
            DIAPASÓN
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold/60 mt-0.5">
            Afinación de Pianos
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex gap-6 flex-wrap justify-center">
          {["Servicios", "Galería", "Sobre mí", "Contacto"].map((item) => (
            <button
              key={item}
              onClick={() => {
                const id = item === "Sobre mí" ? "sobre-mi" : item.toLowerCase().replace(" ", "-");
                document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs tracking-widest uppercase text-white-warm/50 hover:text-gold transition-colors duration-300"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[11px] text-white-warm/40 tracking-wide">
          © {year} Diapasón. Todos los derechos reservados.
        </p>
      </div>

      {/* Gold line */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white-warm/10 flex justify-center">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </footer>
  );
}

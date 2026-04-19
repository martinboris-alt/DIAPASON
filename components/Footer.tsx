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

        {/* Social */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/diegojuica/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @diegojuica"
            className="text-white-warm/40 hover:text-gold transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-white-warm/40 tracking-wide">
          © {year} Diapasón. Todos los derechos reservados.
        </p>
      </div>

      {/* Legal marcas */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white-warm/10">
        <p className="text-[10px] text-white-warm/25 tracking-wide text-center leading-relaxed max-w-3xl mx-auto">
          Los nombres y emblemas de Steinway, Bösendorfer, Bechstein, Blüthner, Fazioli, Yamaha, Kawai,
          Pleyel, Érard y Baldwin son marcas registradas de sus respectivos propietarios.
          Las representaciones gráficas en esta web son ilustraciones originales con fines informativos
          y didácticos — no logos oficiales. Las partituras pertenecen al{" "}
          <a href="https://www.mutopiaproject.org" target="_blank" rel="noopener noreferrer" className="text-gold/60 hover:text-gold transition-colors">
            Mutopia Project
          </a>
          {" "}bajo licencias Creative Commons o dominio público.
        </p>
      </div>

      {/* Gold line */}
      <div className="max-w-7xl mx-auto mt-6 flex justify-center">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const links = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería",   href: "#galeria" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

function smoothScrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const { theme, setTheme }     = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    smoothScrollTo(href);
  };

  const linkClass =
    "text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 relative group";
  const underline =
    "absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-piano-black/95 backdrop-blur-md border-b border-gold/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex flex-col items-start group"
          aria-label="DIAPASÓN — inicio"
        >
          <span className="font-display text-xl font-semibold tracking-widest text-white-warm group-hover:text-gold transition-colors duration-300">
            DIAPASÓN
          </span>
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-light">
            Afinación de Pianos
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className={linkClass}
            >
              {l.label}
              <span className={underline} aria-hidden="true" />
            </a>
          ))}
          <Link href="/partituras" className={linkClass}>
            Partituras
            <span className={underline} aria-hidden="true" />
          </Link>
          <Link href="/marcas" className={linkClass}>
            Marcas
            <span className={underline} aria-hidden="true" />
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
            <span className={underline} aria-hidden="true" />
          </Link>
          <Link href="/faq" className={linkClass}>
            FAQ
            <span className={underline} aria-hidden="true" />
          </Link>
          <Link
            href="/studio"
            className="text-sm tracking-widest uppercase px-3 py-1.5 border transition-colors duration-300 relative group font-medium"
            style={{ borderColor: "rgba(255,107,53,0.5)", color: "#FF6B35" }}
          >
            Studio ✦
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gold/60 hover:text-gold transition-colors duration-300 p-1"
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          )}

          <a
            href="#contacto"
            onClick={(e) => handleAnchor(e, "#contacto")}
            className="ml-2 px-6 py-2 border border-gold/60 text-gold text-xs tracking-widest uppercase hover:bg-gold hover:text-piano-black transition-all duration-300"
          >
            Solicitar servicio
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${open ? "rotate-45 translate-y-2.5" : ""}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${open ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-piano-black/98 border-t border-gold/10`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Menú móvil">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className="text-left text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 py-2 border-b border-white-warm/10"
            >
              {l.label}
            </a>
          ))}
          <Link href="/partituras" onClick={() => setOpen(false)} className="text-left text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 py-2 border-b border-white-warm/10">Partituras</Link>
          <Link href="/marcas"     onClick={() => setOpen(false)} className="text-left text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 py-2 border-b border-white-warm/10">Marcas</Link>
          <Link href="/blog"       onClick={() => setOpen(false)} className="text-left text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 py-2 border-b border-white-warm/10">Blog</Link>
          <Link href="/faq"    onClick={() => setOpen(false)} className="text-left text-sm tracking-widest uppercase text-white-soft/70 hover:text-gold transition-colors duration-300 py-2 border-b border-white-warm/10">FAQ</Link>
          <Link href="/studio" onClick={() => setOpen(false)} className="text-left text-sm tracking-widest uppercase py-2 border-b border-white-warm/10 font-medium" style={{ color: "#FF6B35" }}>Studio ✦</Link>
          <div className="flex items-center justify-between mt-2">
            <a
              href="#contacto"
              onClick={(e) => handleAnchor(e, "#contacto")}
              className="px-6 py-3 border border-gold/60 text-gold text-xs tracking-widest uppercase hover:bg-gold hover:text-piano-black transition-all duration-300"
            >
              Solicitar servicio
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

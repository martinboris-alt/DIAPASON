// ─────────────────────────────────────────────
//  CONFIGURACIÓN DE FOTOS — DIAPASÓN
//  Edita este archivo para gestionar todas las
//  imágenes del sitio sin tocar más código.
// ─────────────────────────────────────────────

export const heroFoto = {
  src: "/images/hero.jpg",
  alt: "Piano de cola en sala de conciertos",
};

export const sobreMiFoto = {
  src: "/images/diego.jpg",
  alt: "Diego Juica — Afinador de pianos",
};

// Galería: agrega o quita fotos aquí.
// "span" controla el tamaño en la cuadrícula:
//   "normal"  → 1 columna, 1 fila  (foto pequeña)
//   "alto"    → 1 columna, 2 filas (foto vertical)
//   "ancho"   → 2 columnas, 1 fila (foto horizontal)
export const galeriaFotos = [
  {
    src: "/images/galeria-01.jpg",
    alt: "Afinación de piano de cola",
    caption: "Piano de cola Steinway & Sons",
    span: "alto" as const,
  },
  {
    src: "/images/galeria-02.jpg",
    alt: "Detalle de cuerdas del piano",
    caption: "Cuerdas y martillos",
    span: "normal" as const,
  },
  {
    src: "/images/galeria-03.jpg",
    alt: "Mecanismo interior del piano",
    caption: "Regulación de mecanismo",
    span: "normal" as const,
  },
  {
    src: "/images/galeria-04.jpg",
    alt: "Piano vertical en sala",
    caption: "Piano vertical clásico",
    span: "ancho" as const,
  },
  {
    src: "/images/galeria-05.jpg",
    alt: "Trabajo de afinación",
    caption: "Proceso de afinación",
    span: "normal" as const,
  },
  {
    src: "/images/galeria-06.jpg",
    alt: "Detalle de teclas",
    caption: "Teclas restauradas",
    span: "normal" as const,
  },
];

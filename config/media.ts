// ─────────────────────────────────────────────
//  MEDIOS — DIAPASÓN
//  Agrega aquí fotos y videos para la galería.
//  Los archivos van en public/images/ y public/videos/
// ─────────────────────────────────────────────

export type MediaItem =
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
      span: "normal" | "alto" | "ancho";
    }
  | {
      type: "video";
      src: string;         // archivo local: "/videos/mi-video.mp4"
      poster: string;      // imagen de previsualización: "/images/poster-01.jpg"
      caption: string;
      span: "normal" | "alto" | "ancho";
    };

export const galeriaMedia: MediaItem[] = [
  {
    type: "image",
    src: "/images/galeria-01.jpg",
    alt: "Afinación de piano de cola",
    caption: "Piano de cola",
    span: "alto",
  },
  {
    type: "image",
    src: "/images/galeria-02.jpg",
    alt: "Detalle de cuerdas del piano",
    caption: "Cuerdas y martillos",
    span: "normal",
  },
  {
    type: "image",
    src: "/images/galeria-03.jpg",
    alt: "Mecanismo interior del piano",
    caption: "Regulación de mecanismo",
    span: "normal",
  },
  {
    type: "image",
    src: "/images/galeria-04.jpg",
    alt: "Piano vertical en sala",
    caption: "Piano vertical clásico",
    span: "ancho",
  },
  {
    type: "image",
    src: "/images/galeria-05.jpg",
    alt: "Trabajo de afinación",
    caption: "Proceso de afinación",
    span: "normal",
  },
  {
    type: "image",
    src: "/images/galeria-06.jpg",
    alt: "Detalle de teclas",
    caption: "Teclas restauradas",
    span: "normal",
  },

  // ── Para agregar un VIDEO descomenta y edita esto: ──
  // {
  //   type: "video",
  //   src: "/videos/afinacion-01.mp4",
  //   poster: "/images/poster-01.jpg",
  //   caption: "Proceso de afinación completo",
  //   span: "ancho",
  // },
];

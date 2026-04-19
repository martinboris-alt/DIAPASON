# Guía para agregar fotos — Diapasón

## Fotos necesarias

Pon todas las fotos en la carpeta `public/images/` con estos nombres exactos:

| Archivo             | Dónde aparece         | Tamaño recomendado |
|---------------------|-----------------------|--------------------|
| `hero.jpg`          | Fondo pantalla inicial | 1920 × 1080 px    |
| `diego.jpg`         | Sección "Sobre mí"    | 600 × 800 px       |
| `galeria-01.jpg`    | Galería (foto grande) | 800 × 1200 px      |
| `galeria-02.jpg`    | Galería               | 800 × 600 px       |
| `galeria-03.jpg`    | Galería               | 800 × 600 px       |
| `galeria-04.jpg`    | Galería (foto ancha)  | 1200 × 600 px      |
| `galeria-05.jpg`    | Galería               | 800 × 600 px       |
| `galeria-06.jpg`    | Galería               | 800 × 600 px       |

## Para agregar más fotos a la galería

Edita el archivo `config/fotos.ts` y agrega una entrada al array `galeriaFotos`:

```ts
{
  src: "/images/galeria-07.jpg",
  alt: "Descripción de la foto",
  caption: "Texto que aparece al pasar el mouse",
  span: "normal",  // opciones: "normal", "alto", "ancho"
},
```

## Cómo subir las fotos

1. Copia las fotos en la carpeta `public/images/`
2. Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
git add public/images/
git commit -m "Agregar fotos de Diego"
git push
```

Vercel desplegará los cambios automáticamente en 1-2 minutos.

## Formatos aceptados

JPG, PNG o WebP. Se recomiendan JPGs para fotografías.

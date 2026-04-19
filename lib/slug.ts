/**
 * Utilidades para generar slugs URL-friendly.
 */

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")    // caracteres no permitidos
    .trim()
    .replace(/\s+/g, "-")            // espacios → guion
    .replace(/-+/g, "-")             // múltiples guiones → uno
    .substring(0, 80);
}

export function formatPartituraTitle(filename: string): string {
  return filename
    .replace("-a4.pdf", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

export function partituraSlug(piece: { filename: string; compositor: string }): string {
  const titulo = formatPartituraTitle(piece.filename);
  const composer = piece.compositor.split(" ").pop() ?? "";
  return slugify(`${composer}-${titulo}`);
}

export function composerSlug(nombre: string): string {
  return slugify(nombre);
}

import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { partituraSlug, composerSlug } from "@/lib/slug";
import { articles } from "@/config/blog";
import { marcas } from "@/config/marcas";

const BASE = "https://diapason.vercel.app";

interface CatalogItem {
  compositor: string;
  filename: string;
}

function loadCatalog(): CatalogItem[] {
  const p = path.join(process.cwd(), "config", "mutopia-catalog.json");
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return []; }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const catalog = loadCatalog();

  // Páginas fijas
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,           lastModified: now, priority: 1.0,  changeFrequency: "weekly" },
    { url: `${BASE}/partituras`, lastModified: now, priority: 0.9,  changeFrequency: "weekly" },
    { url: `${BASE}/marcas`,     lastModified: now, priority: 0.8,  changeFrequency: "monthly" },
    { url: `${BASE}/blog`,       lastModified: now, priority: 0.9,  changeFrequency: "weekly" },
    { url: `${BASE}/faq`,        lastModified: now, priority: 0.8,  changeFrequency: "monthly" },
  ];

  // Artículos del blog
  const blogPages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  // Páginas de marcas
  const marcaPages: MetadataRoute.Sitemap = marcas.map(m => ({
    url: `${BASE}/marcas/${m.id}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  // Compositores únicos → una página cada uno
  const composers = Array.from(new Set(catalog.map(c => c.compositor)));
  const composerPages: MetadataRoute.Sitemap = composers.map(c => ({
    url: `${BASE}/compositores/${composerSlug(c)}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  // Cada partitura → una página
  const partituraPages: MetadataRoute.Sitemap = catalog.map(p => ({
    url: `${BASE}/partituras/${partituraSlug(p)}`,
    lastModified: now,
    priority: 0.6,
    changeFrequency: "yearly",
  }));

  return [...staticPages, ...blogPages, ...marcaPages, ...composerPages, ...partituraPages];
}

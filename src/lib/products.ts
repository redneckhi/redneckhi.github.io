import fs from "node:fs";
import path from "node:path";
import type { Product, ProductMeta } from "@/lib/types";

const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function resolveHasDocs(meta: ProductMeta, docs: string): boolean {
  if (meta.docsAvailable === false) return false;
  return docs.trim().length > 0;
}

export function getProductSlugs(): string[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  return fs
    .readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function getProduct(slug: string): Product | null {
  const dir = path.join(PRODUCTS_DIR, slug);
  const metaPath = path.join(dir, "meta.json");
  const overviewPath = path.join(dir, "overview.mdx");
  const docsPath = path.join(dir, "docs.mdx");

  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as ProductMeta;
  const overview = fs.existsSync(overviewPath)
    ? fs.readFileSync(overviewPath, "utf8")
    : "";
  const docs = fs.existsSync(docsPath) ? fs.readFileSync(docsPath, "utf8") : "";
  const hasDocs = resolveHasDocs(meta, docs);

  return {
    ...meta,
    overview,
    docs,
    readingMinutes: hasDocs ? readingMinutes(docs) : 0,
    hasDocs,
  };
}

export function getAllProducts(): Product[] {
  return getProductSlugs()
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== null);
}

export function getAllProductMetas(): ProductMeta[] {
  return getAllProducts().map(
    ({ overview: _o, docs: _d, readingMinutes: _r, hasDocs: _h, ...meta }) =>
      meta,
  );
}

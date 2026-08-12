export const PRODUCT_TAGS = [
  "Clothing",
  "Software",
  "AI",
  "Tools",
  "Pouches",
] as const;

export type ProductTag = (typeof PRODUCT_TAGS)[number];

export type ProductMeta = {
  slug: string;
  name: string;
  tagline: string;
  tags: ProductTag[];
  status: string;
  sku: string;
  coverAccent: "orange" | "green" | "yellow";
  summary: string;
  images?: string[];
  /** Set false to hide docs body even if docs.mdx exists. Defaults to true when omitted. */
  docsAvailable?: boolean;
  /** External or internal purchase URL; empty/omitted greys out Buy. */
  buyUrl?: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type Product = ProductMeta & {
  overview: string;
  docs: string;
  readingMinutes: number;
  /** Resolved: meta.docsAvailable !== false and docs body is non-empty */
  hasDocs: boolean;
};

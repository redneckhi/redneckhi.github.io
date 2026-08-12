import fs from "node:fs";
import path from "node:path";
import type { BlogMeta, BlogPost } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function isPublished(meta: BlogMeta): boolean {
  return meta.draft !== true;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function getPost(slug: string): BlogPost | null {
  const dir = path.join(BLOG_DIR, slug);
  const metaPath = path.join(dir, "meta.json");
  const bodyPath = path.join(dir, "post.mdx");

  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as BlogMeta;
  if (!isPublished(meta)) return null;

  const body = fs.existsSync(bodyPath) ? fs.readFileSync(bodyPath, "utf8") : "";

  return {
    ...meta,
    body,
    readingMinutes: readingMinutes(body),
  };
}

export function getAllPosts(): BlogPost[] {
  return getPostSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAllPostMetas(): BlogMeta[] {
  return getAllPosts().map(({ body: _b, readingMinutes: _r, ...meta }) => meta);
}

import Link from "next/link";
import type { BlogMeta } from "@/lib/types";
import {
  ProductCover,
  InstrumentLabel,
} from "@/components/instrument";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: BlogMeta & { readingMinutes?: number } }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group glass-panel flex h-full flex-col overflow-hidden border border-border backdrop-blur-xl transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/60 supports-[backdrop-filter]:bg-panel"
    >
      <ProductCover
        accent={post.coverAccent}
        name={post.title}
        imageSrc={post.coverImage}
        showName={false}
        textBackdrop
        className="aspect-[16/9] w-full"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <InstrumentLabel>{formatDate(post.publishedAt)}</InstrumentLabel>
          {post.readingMinutes != null ? (
            <InstrumentLabel className="text-foreground/70">
              {post.readingMinutes} min
            </InstrumentLabel>
          ) : null}
        </div>
        <div className="space-y-1">
          <h2 className="font-brand text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-5 items-center border border-border px-2 font-mono text-[10px] uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

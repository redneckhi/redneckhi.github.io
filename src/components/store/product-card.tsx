import Link from "next/link";
import type { ProductMeta } from "@/lib/types";
import {
  ProductCover,
  InstrumentLabel,
  StatusIndicator,
} from "@/components/instrument";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  view,
}: {
  product: ProductMeta;
  view: "grid" | "list";
}) {
  const thumb = product.images?.[0];

  if (view === "list") {
    return (
      <Link
        href={`/store/${product.slug}/`}
        className="group glass-panel flex flex-col gap-4 border border-border p-3 backdrop-blur-xl transition-[border-color,background-color] hover:border-primary/60 hover:bg-panel sm:flex-row sm:items-stretch supports-[backdrop-filter]:bg-panel"
      >
        <ProductCover
          accent={product.coverAccent}
          name={product.name}
          imageSrc={thumb}
          showName={false}
          textBackdrop
          className="h-28 w-full shrink-0 sm:h-auto sm:w-44"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
          <div className="space-y-2">
            <InstrumentLabel>{product.sku}</InstrumentLabel>
            <h2 className="font-brand text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
              {product.name}
            </h2>
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
            <StatusIndicator status={product.status} className="text-[10px]" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
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

  return (
    <Link
      href={`/store/${product.slug}/`}
      className={cn(
        "group glass-panel flex h-full flex-col overflow-hidden border border-border backdrop-blur-xl transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/60 supports-[backdrop-filter]:bg-panel",
      )}
    >
      <ProductCover
        accent={product.coverAccent}
        name={product.name}
        imageSrc={thumb}
        showName={false}
        textBackdrop
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <InstrumentLabel>{product.sku}</InstrumentLabel>
        <div className="space-y-1">
          <h2 className="font-brand text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
            {product.name}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.tagline}
          </p>
        </div>
        <StatusIndicator status={product.status} className="text-[10px]" />
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {product.tags.map((tag) => (
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

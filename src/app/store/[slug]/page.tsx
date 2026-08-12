import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct, getProductSlugs } from "@/lib/products";
import { extractToc } from "@/lib/toc";
import { MdxContent } from "@/components/mdx-content";
import { DocsToc } from "@/components/docs/docs-toc";
import { buttonVariants } from "@/components/ui/button";
import { ProductGallery } from "@/components/store/product-gallery";
import {
  InstrumentLabel,
  MetaRow,
  StockIndicator,
  FramedPanel,
} from "@/components/instrument";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

function BuyControl({ buyUrl }: { buyUrl?: string }) {
  const className = cn(buttonVariants({ size: "lg" }), "px-8");

  if (!buyUrl) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonVariants({ size: "lg", variant: "secondary" }),
          "pointer-events-none px-8 opacity-40 grayscale",
        )}
      >
        Buy
      </span>
    );
  }

  const external = /^https?:\/\//i.test(buyUrl);
  if (external) {
    return (
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Buy
      </a>
    );
  }

  return (
    <Link href={buyUrl} className={className}>
      Buy
    </Link>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const toc = product.hasDocs ? extractToc(product.docs) : [];

  const related = getAllProducts()
    .filter(
      (p) =>
        p.slug !== product.slug &&
        p.tags.some((t) => product.tags.includes(t)),
    )
    .slice(0, 3);

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] sm:px-6">
        <ProductGallery
          images={product.images ?? []}
          name={product.name}
          accent={product.coverAccent}
          textBackdrop
          showName={false}
          className="min-h-[280px] lg:min-h-[420px]"
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <InstrumentLabel>{product.sku}</InstrumentLabel>
            <h1 className="font-brand text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground">{product.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/store/?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex h-5 items-center rounded-none border border-border px-2 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <MetaRow
            items={[
              { label: "Status", value: product.status },
              {
                label: "Docs",
                value: product.hasDocs
                  ? `${product.readingMinutes} min`
                  : "Unavailable",
                led: {
                  tone: product.hasDocs ? "live" : "warn",
                  label: "DOCS",
                },
              },
            ]}
          />

          <p className="text-foreground/85 leading-relaxed">{product.summary}</p>

          <StockIndicator />

          <FramedPanel
            className="glass-heavy backdrop-blur-xl"
            contentClassName="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <InstrumentLabel className="text-tape">Acquire</InstrumentLabel>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.buyUrl
                  ? "External purchase link."
                  : "No purchase link configured — Buy locked."}
              </p>
            </div>
            <BuyControl buyUrl={product.buyUrl} />
          </FramedPanel>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {product.hasDocs ? (
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <DocsToc items={toc} />
            <FramedPanel
              className="glass-panel backdrop-blur-xl"
              contentClassName="p-6 sm:p-8"
            >
              <InstrumentLabel className="mb-4 block">
                Technical documentation
              </InstrumentLabel>
              <MdxContent source={product.docs} />
            </FramedPanel>
          </div>
        ) : (
          <FramedPanel
            className="border-dashed glass-panel backdrop-blur-xl"
            contentClassName="px-6 py-10"
          >
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Documentation unavailable
            </p>
          </FramedPanel>
        )}

        {related.length > 0 && (
          <div className="mt-10 space-y-4">
            <InstrumentLabel>Related units</InstrumentLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/store/${item.slug}/`}>
                  <FramedPanel
                    className="glass-panel h-full backdrop-blur-xl transition-colors hover:border-primary/50"
                    contentClassName="p-4"
                  >
                    <p className="font-brand font-bold">{item.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.tagline}
                    </p>
                  </FramedPanel>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProductMetas } from "@/lib/products";
import { ProductBrowser } from "@/components/store/product-browser";
import {
  StatusLed,
  HudReadout,
  FramedPanel,
} from "@/components/instrument";
import { store } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Store",
  description: store.description,
};

export default function StorePage() {
  const products = getAllProductMetas();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FramedPanel
          className="mb-8 border-border/60 bg-background/55 backdrop-blur-xl"
          contentClassName="space-y-3 p-5"
        >
          <div className="flex flex-wrap items-center gap-3" aria-hidden>
            <StatusLed tone="live" label="INV" />
            <HudReadout
              label="UNITS"
              value={String(products.length).padStart(2, "0")}
            />
          </div>
          <h1 className="font-brand text-4xl font-bold tracking-tight sm:text-5xl">
            {store.title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{store.description}</p>
        </FramedPanel>
        <Suspense
          fallback={
            <div className="border border-border glass-panel px-6 py-10 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
              Loading inventory…
            </div>
          }
        >
          <ProductBrowser products={products} />
        </Suspense>
      </div>
    </div>
  );
}

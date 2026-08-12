import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProductMetas } from "@/lib/products";
import { ProductBrowser } from "@/components/store/product-browser";
import {
  StatusLed,
  HudReadout,
  FramedPanel,
} from "@/components/instrument";

export const metadata: Metadata = {
  title: "Store",
  description: "Prototype shop — filter, search, and browse technical docs.",
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
            Prototype store
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse field kits and software. Open a unit for build docs; Buy uses
            the purchase link when one is configured.
          </p>
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

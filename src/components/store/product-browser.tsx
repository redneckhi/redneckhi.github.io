"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductMeta } from "@/lib/types";
import { PRODUCT_TAGS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import {
  InstrumentLabel,
  StatusLed,
  HudReadout,
  CrossHair,
  FramedPanel,
} from "@/components/instrument";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

function initialTagsFromSearch(tag: string | null): string[] {
  if (tag && PRODUCT_TAGS.includes(tag as never)) return [tag];
  return [];
}

export function ProductBrowser({ products }: { products: ProductMeta[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>(() =>
    initialTagsFromSearch(searchParams.get("tag")),
  );
  const [view, setView] = useState<ViewMode>("grid");

  const availableTags = useMemo(() => {
    const used = new Set(products.flatMap((p) => p.tags));
    return PRODUCT_TAGS.filter((tag) => used.has(tag));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => p.tags.includes(tag as never));
      return matchesQuery && matchesTags;
    });
  }, [products, query, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <div className="space-y-6">
      <FramedPanel
        className="glass-heavy backdrop-blur-xl"
        contentClassName="space-y-4 p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <InstrumentLabel>Inventory browser</InstrumentLabel>
            <StatusLed tone="live" label="SCAN" />
            <HudReadout
              label="HIT"
              value={String(filtered.length).padStart(2, "0")}
            />
            <CrossHair className="text-muted-foreground" />
          </div>
          <div className="flex items-center gap-0.5 border border-border glass-panel p-0.5 backdrop-blur-md">
            <Button
              type="button"
              size="icon-sm"
              variant={view === "grid" ? "default" : "ghost"}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant={view === "list" ? "default" : "ghost"}
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prototypes, SKUs, tags…"
            className="h-10 rounded-none border-border bg-background/50 pl-10 font-mono text-sm backdrop-blur-md"
          />
        </div>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const on = activeTags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={on ? "default" : "outline"}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    on &&
                      "border-hivis bg-hivis text-hivis-foreground hover:bg-hivis/90 before:hidden",
                  )}
                >
                  {tag}
                </Button>
              );
            })}
            {activeTags.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setActiveTags([])}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </FramedPanel>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-dashed border-border glass-panel px-6 py-16 text-center backdrop-blur-xl"
          >
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">
              No units match filter
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={cn(
              view === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-3",
            )}
          >
            {filtered.map((product) => (
              <motion.div
                layout
                key={product.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} view={view} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogMeta } from "@/lib/types";
import { BLOG_TAGS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import {
  InstrumentLabel,
  StatusLed,
  HudReadout,
  CrossHair,
  FramedPanel,
} from "@/components/instrument";
import { cn } from "@/lib/utils";

function initialTagsFromSearch(tag: string | null): string[] {
  if (tag && BLOG_TAGS.includes(tag as never)) return [tag];
  return [];
}

export function PostBrowser({
  posts,
}: {
  posts: (BlogMeta & { readingMinutes: number })[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>(() =>
    initialTagsFromSearch(searchParams.get("tag")),
  );

  const availableTags = useMemo(() => {
    const used = new Set(posts.flatMap((p) => p.tags));
    return BLOG_TAGS.filter((tag) => used.has(tag));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => p.tags.includes(tag as never));
      return matchesQuery && matchesTags;
    });
  }, [posts, query, activeTags]);

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
        <div className="flex flex-wrap items-center gap-3">
          <InstrumentLabel>Field notes index</InstrumentLabel>
          <StatusLed tone="live" label="LOG" />
          <HudReadout
            label="HIT"
            value={String(filtered.length).padStart(2, "0")}
          />
          <CrossHair className="text-muted-foreground" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, tags, authors…"
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
              No entries match filter
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((post) => (
              <motion.div
                layout
                key={post.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

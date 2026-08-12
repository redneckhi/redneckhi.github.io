import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/blog";
import { PostBrowser } from "@/components/blog/post-browser";
import {
  StatusLed,
  HudReadout,
  FramedPanel,
} from "@/components/instrument";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes, build logs, and prototype write-ups from RHI.",
};

export default function BlogPage() {
  const posts = getAllPosts().map(
    ({ body: _b, ...meta }) => meta,
  );

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FramedPanel
          className="mb-8 border-border/60 bg-background/55 backdrop-blur-xl"
          contentClassName="space-y-3 p-5"
        >
          <div className="flex flex-wrap items-center gap-3" aria-hidden>
            <StatusLed tone="live" label="LOG" />
            <HudReadout
              label="ENTRIES"
              value={String(posts.length).padStart(2, "0")}
            />
          </div>
          <h1 className="font-brand text-4xl font-bold tracking-tight sm:text-5xl">
            Field notes
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Build logs and field write-ups. Open an entry for the full brief.
          </p>
        </FramedPanel>
        <Suspense
          fallback={
            <div className="border border-border glass-panel px-6 py-10 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-xl">
              Loading index…
            </div>
          }
        >
          <PostBrowser posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}

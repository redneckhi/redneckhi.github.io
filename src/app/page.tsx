import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  StatusLed,
  HudReadout,
  FramedPanel,
} from "@/components/instrument";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="absolute inset-0 instrument-grid opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,color-mix(in_oklch,var(--warning)_35%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_70%,color-mix(in_oklch,var(--hivis)_28%,transparent),transparent_50%),linear-gradient(160deg,var(--background),color-mix(in_oklch,var(--background)_70%,var(--muted)))]" />
      <div className="noise-overlay absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        <FramedPanel
          className="max-w-3xl border-border/50 bg-background/35 backdrop-blur-xl"
          contentClassName="space-y-8 p-6 sm:p-10"
        >
          <div className="flex flex-wrap items-center gap-4" aria-hidden>
            <StatusLed tone="live" label="LINK" />
            <StatusLed tone="warn" label="FIELD" />
            <HudReadout label="GRID" value="47.2N / 08.5E" />
            <HudReadout label="CH" value="07" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-hivis">
            Prototype documentation network
          </p>
          <h1 className="font-brand text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.92] tracking-tight text-foreground">
            Redneck Heavy Industries
          </h1>
          <p className="max-w-xl text-lg text-foreground/80 sm:text-xl">
            Custom tactical solutions — good enough.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/store/" className={cn(buttonVariants({ size: "lg" }), "px-6")}>
              Enter store
            </Link>
          </div>
        </FramedPanel>
      </div>
    </section>
  );
}

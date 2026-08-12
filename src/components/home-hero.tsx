"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { buttonVariants } from "@/components/ui/button";
import {
  StatusLed,
  HudReadout,
  FramedPanel,
  CrossHair,
  CornerMarks,
} from "@/components/instrument";
import { home, site } from "@/lib/copy";
import { cn } from "@/lib/utils";

type TypeSpeed = NonNullable<
  React.ComponentProps<typeof TypeAnimation>["speed"]
>;

function HeroLine({
  text,
  delay,
  className,
  as: Tag = "p",
  speed = 60,
  ready,
  reduceMotion,
  cursor = false,
}: {
  text: string;
  delay: number;
  className?: string;
  as?: "p" | "h1" | "span";
  speed?: TypeSpeed;
  ready: boolean;
  reduceMotion: boolean;
  cursor?: boolean;
}) {
  if (!ready || reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <TypeAnimation
        sequence={[delay, text]}
        wrapper="span"
        cursor={cursor}
        speed={speed}
        repeat={0}
      />
    </Tag>
  );
}

export function HomeHero() {
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    setReady(true);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (reduceMotion) {
      setCtaReady(true);
      return;
    }
    const id = window.setTimeout(() => setCtaReady(true), 3200);
    return () => window.clearTimeout(id);
  }, [ready, reduceMotion]);

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
            <HudReadout label={home.gridLabel} value={home.gridValue} />
            <HudReadout label={home.protoLabel} value={home.protoValue} />
          </div>

          <HeroLine
            text={site.eyebrow}
            delay={200}
            speed={70}
            ready={ready}
            reduceMotion={reduceMotion}
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-hivis"
          />

          <HeroLine
            as="h1"
            text={site.name}
            delay={900}
            speed={75}
            ready={ready}
            reduceMotion={reduceMotion}
            className="font-brand text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.92] tracking-tight text-foreground"
          />

          <HeroLine
            text={site.tagline}
            delay={2200}
            speed={65}
            ready={ready}
            cursor={true}
            reduceMotion={reduceMotion}
            className="max-w-xl text-lg text-foreground/80 sm:text-xl"
          />

          <motion.div
            className="flex flex-wrap items-center gap-3 pt-2"
            initial={false}
            animate={
              ctaReady
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 8 }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Link
              href="/store/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group relative overflow-hidden px-6 pr-5",
              )}
            >
              <CornerMarks marks="corners" className="opacity-70" />
              <span className="relative z-10 flex items-center gap-3">
                <StatusLed tone="tape" ping className="scale-90" />
                <span>{home.ctaStore}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-primary-foreground/70">
                  {home.ctaStoreHint}
                </span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span
                className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-tape/25 transition-[width] duration-300 group-hover:w-full"
                aria-hidden
              />
            </Link>
            <span
              className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex"
              aria-hidden
            >
              <CrossHair className="text-muted-foreground/80" />
              <HudReadout label={home.statusLabel} value={home.statusValue} />
            </span>
          </motion.div>
        </FramedPanel>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { CrossHair, HudReadout } from "@/components/instrument";
import { backdropGlyphs, backdropTiming } from "@/lib/copy";

function BackdropGlyph({
  text,
  delay,
  className,
  reduceMotion,
  ready,
}: {
  text: string;
  delay: number;
  className: string;
  reduceMotion: boolean;
  ready: boolean;
}) {
  if (!ready || reduceMotion) {
    return <span className={className}>{reduceMotion ? text : null}</span>;
  }

  return (
    <TypeAnimation
      sequence={[delay, text, 2800, "", 1200]}
      wrapper="span"
      cursor={true}
      speed={55}
      deletionSpeed={70}
      repeat={Infinity}
      className={className}
    />
  );
}

function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "--ms";
  return `${Math.round(ms)}ms`;
}

function readNavTiming(): { dns: string; conn: string; load: string } {
  const entry = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming | undefined;

  if (!entry) {
    return { dns: "--ms", conn: "--ms", load: "--ms" };
  }

  const dns = Math.max(0, entry.domainLookupEnd - entry.domainLookupStart);
  const conn = Math.max(0, entry.connectEnd - entry.connectStart);
  const load =
    entry.loadEventEnd > 0
      ? Math.max(0, entry.loadEventEnd - entry.startTime)
      : Math.max(0, entry.duration);

  return {
    dns: formatMs(dns),
    conn: formatMs(conn),
    load: formatMs(load),
  };
}

/** Sparse instrument marks in page margins / whitespace. */
export function SiteBackdrop() {
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cursor, setCursor] = useState({ x: "00", y: "00" });
  const [timing, setTiming] = useState({
    dns: "--ms",
    conn: "--ms",
    load: "--ms",
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    setReady(true);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const update = () => setTiming(readNavTiming());
    update();

    if (document.readyState === "complete") {
      requestAnimationFrame(update);
      return;
    }

    window.addEventListener("load", update);
    return () => window.removeEventListener("load", update);
  }, []);

  useEffect(() => {
    let ticking = false;
    let latest = { x: 0, y: 0 };

    const format = (n: number) =>
      String(Math.min(99, Math.max(0, Math.round(n)))).padStart(2, "0");

    const flush = () => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setCursor({
        x: format((latest.x / w) * 99),
        y: format((latest.y / h) * 99),
      });
      ticking = false;
    };

    const onMove = (e: MouseEvent) => {
      latest = { x: e.clientX, y: e.clientY };
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden
    >
      <div className="absolute inset-0 instrument-grid opacity-40" />
      <div className="noise-overlay absolute inset-0 opacity-20" />

      <CrossHair className="absolute left-[3%] top-[18%] text-foreground/20" />
      <CrossHair className="absolute right-[4%] top-[32%] text-foreground/20" />
      <CrossHair className="absolute bottom-[22%] left-[5%] text-foreground/15" />
      <CrossHair className="absolute bottom-[40%] right-[6%] text-foreground/15" />

      <span className="absolute left-[2%] top-[12%] size-4 border-l border-t border-foreground/15" />
      <span className="absolute right-[2%] top-[12%] size-4 border-r border-t border-foreground/15" />
      <span className="absolute bottom-[8%] left-[2%] size-4 border-b border-l border-foreground/15" />
      <span className="absolute bottom-[8%] right-[2%] size-4 border-b border-r border-foreground/15" />

      <div className="absolute right-[2%] top-[4.75rem] hidden flex-col items-end gap-1 text-right opacity-30 xl:flex">
        {(
          [
            [timing.dns, backdropTiming.dnsLabel],
            [timing.conn, backdropTiming.connLabel],
            [timing.load, backdropTiming.loadLabel],
          ] as const
        ).map(([value, label]) => (
          <span
            key={label}
            className="inline-flex items-baseline justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]"
          >
            <span className="text-foreground/90 tabular-nums">{value}</span>
            <span className="text-muted-foreground">{label}</span>
          </span>
        ))}
      </div>

      <HudReadout
        label="X"
        value={cursor.x}
        className="absolute left-[2%] top-1/2 hidden -translate-y-1/2 opacity-30 xl:inline-flex"
      />
      <HudReadout
        label="Y"
        value={cursor.y}
        className="absolute right-[2%] top-1/2 hidden -translate-y-1/2 opacity-30 xl:inline-flex"
      />

      {backdropGlyphs.map((glyph) => (
        <BackdropGlyph
          key={glyph.text}
          text={glyph.text}
          delay={glyph.delay}
          className={glyph.className}
          reduceMotion={reduceMotion}
          ready={ready}
        />
      ))}
    </div>
  );
}

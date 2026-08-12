"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { CrossHair, HudReadout } from "@/components/instrument";

const GLYPHS = [
  {
    text: "RHI // GRID",
    delay: 400,
    className:
      "absolute left-[8%] top-[8%] hidden font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/20 lg:block",
  },
  {
    text: "Tactical solutions",
    delay: 900,
    className:
      "absolute right-[7%] top-[14%] hidden font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/15 xl:block",
  },
  {
    text: "Net · mesh · field",
    delay: 1400,
    className:
      "absolute left-[3%] top-[38%] hidden font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/15 xl:block",
  },
  {
    text: "Specimen index",
    delay: 1900,
    className:
      "absolute right-[3%] top-[48%] hidden font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/15 xl:block",
  },
  {
    text: "Do not trust the cloud",
    delay: 2400,
    className:
      "absolute left-[6%] bottom-[28%] hidden font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/15 xl:block",
  },
  {
    text: "Rev · mk.i // rhi",
    delay: 2900,
    className:
      "absolute right-[5%] bottom-[18%] hidden font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/15 xl:block",
  },
  {
    text: "Ch-07 · az 214",
    delay: 3300,
    className:
      "absolute left-[4%] bottom-[42%] hidden font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/12 xl:block",
  },
  {
    text: "Good enough",
    delay: 3700,
    className:
      "absolute bottom-[12%] right-[8%] hidden font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/20 lg:block",
  },
] as const;

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

/** Sparse instrument marks in page margins / whitespace. */
export function SiteBackdrop() {
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    setReady(true);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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

      <HudReadout
        label="X"
        value="00"
        className="absolute left-[2%] top-1/2 hidden -translate-y-1/2 opacity-30 xl:inline-flex"
      />
      <HudReadout
        label="Y"
        value="00"
        className="absolute right-[2%] top-1/2 hidden -translate-y-1/2 opacity-30 xl:inline-flex"
      />

      {GLYPHS.map((glyph) => (
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

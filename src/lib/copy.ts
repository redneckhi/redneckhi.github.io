/** Sitewide copy — brand, chrome, hero, backdrop glyphs. */

export const site = {
  name: "Redneck Heavy Industries",
  shortName: "RHI",
  tagline:
    "Innovation through stupidity; Voiding Warranties in Hostile Environments.",
  description:
    "Innovation through stupidity; voiding warranties in hostile environments. Prototype docs, store, and field notes.",
  eyebrow: "Prototype documentation network",
  titleTemplate: "%s //RHI",
} as const;

export const nav = {
  home: { href: "/", label: "Home" },
  store: { href: "/store/", label: "Store" },
  blog: { href: "/blog/", label: "Field notes" },
} as const;

export const navLinks = [nav.home, nav.store, nav.blog] as const;

export const orgLinks = [
  {
    label: "GitHub",
    href: "https://github.com/redneckhi",
  },
  {
    label: "Hugging Face",
    href: "https://huggingface.co/redneckhi",
  },
] as const;

export const misc = {
  latValue: "47.59N",
  longValue: "14.14E",
} as const;

export const home = {
  ctaStore: "Enter store",
  ctaStoreHint: "// INV",
  statusLabel: "STATUS:",
  statusValue: "ALPHA",
  gridLabel: "GRID",
  gridValue: `${misc.latValue} // ${misc.longValue}`,
  protoLabel: "PROTO",
  protoValue: "HTTPS",
} as const;

export const footer = {
  ledLabel: "RHI",
  docsLabel: "Documentation//",
  docsValue: "//",
  revLabel: "REV",
  revValue: "20260812",
} as const;

export const headerHud = {
  channelLabel: "CH",
  channelValue: "01",
  latLabel: "LAT",
  latValue: misc.latValue,
} as const;

export const blog = {
  title: "Field notes",
  description: "Field notes, build logs, and prototype write-ups from RHI.",
  indexLabel: "Field notes index",
  heroBlurb: "Build logs and field write-ups. Open an entry for the full brief.",
} as const;

export const store = {
  title: "Prototype store",
  description:
    "Browse field kits and software. Open a unit for build docs; Buy uses the purchase link when one is configured.",
} as const;

/** Top-right backdrop timing readout labels */
export const backdropTiming = {
  dnsLabel: "DNS",
  connLabel: "CONN",
  loadLabel: "LOAD",
} as const;

const glyphClass =
  "absolute hidden font-mono text-[9px] uppercase tracking-[0.24em] xl:block";

/**
 * Backdrop margin glyphs.
 * Edit `text` / `delay` / `className` (position + opacity) together here.
 */
export const backdropGlyphs = [
  {
    text: "RHI // GRID",
    delay: 400,
    className: `${glyphClass} left-[8%] top-[8%] tracking-[0.28em] text-foreground/20 lg:block`,
  },
  {
    text: "Zip tie solutions",
    delay: 900,
    className: `${glyphClass} right-[7%] top-[14%] tracking-[0.28em] text-foreground/15`,
  },
  {
    text: "Zip - Tape - Repeat",
    delay: 1400,
    className: `${glyphClass} left-[3%] top-[38%] text-foreground/15`,
  },
  {
    text: "Specimen index",
    delay: 1900,
    className: `${glyphClass} right-[3%] top-[48%] text-foreground/15`,
  },
  {
    text: "Do not trust the cloud",
    delay: 2400,
    className: `${glyphClass} left-[6%] bottom-[28%] tracking-[0.22em] text-foreground/15`,
  },
  {
    text: `Rev ${footer.revValue} // rhi`,
    delay: 2900,
    className: `${glyphClass} right-[5%] bottom-[18%] tracking-[0.28em] text-foreground/15`,
  },
  {
    text: "Ch-07 · az 214",
    delay: 3300,
    className: `${glyphClass} left-[4%] bottom-[42%] tracking-[0.2em] text-foreground/12`,
  },
  {
    text: "\\///| They are watching you --//",
    delay: 3800,
    className: `${glyphClass} right-[8%] top-[62%] tracking-[0.2em] text-foreground/12`,
  },
  {
    text: "Good enough",
    delay: 4200,
    className: `${glyphClass} bottom-[12%] right-[8%] tracking-[0.28em] text-foreground/20 lg:block`,
  },
] as const;

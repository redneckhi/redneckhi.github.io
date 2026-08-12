"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CrossHair,
  HudReadout,
  StatusLed,
  WarningRule,
  FramedPanel,
} from "@/components/instrument";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  footer,
  headerHud,
  navLinks,
  orgLinks,
  site,
} from "@/lib/copy";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-background/55 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40",
        className,
      )}
    >
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <span
          className="pointer-events-none absolute left-2 top-2 size-2 border-l border-t border-foreground/25"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-2 top-2 size-2 border-r border-t border-foreground/25"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-2 left-2 size-2 border-b border-l border-foreground/25"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-2 right-2 size-2 border-b border-r border-foreground/25"
          aria-hidden
        />

        <div className="flex items-center gap-4 sm:gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="sm:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="left" className="glass-heavy w-[min(100%,18rem)]">
              <SheetHeader>
                <SheetTitle className="font-mono text-xs uppercase tracking-[0.2em]">
                  Navigate
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border border-border px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="group flex items-center gap-3">
            <span className="tape-stripe size-7 shrink-0 border border-border" />
            <span className="font-brand text-sm font-bold tracking-tight sm:text-base">
              {site.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-none px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="pointer-events-none hidden items-center gap-3 md:flex"
            aria-hidden
          >
            <CrossHair className="text-muted-foreground/70" />
            <StatusLed tone="live" label="SYS" />
            <HudReadout
              label={headerHud.channelLabel}
              value={headerHud.channelValue}
            />
            <HudReadout
              label={headerHud.latLabel}
              value={headerHud.latValue}
              className="hidden xl:inline-flex"
            />
          </span>
          <ThemeToggle />
        </div>
      </div>
      <div className="h-1 tape-stripe opacity-90" />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/35">
      <WarningRule />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-brand text-sm font-semibold">{site.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {site.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {orgLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <FramedPanel
                  marks="corners"
                  className="bg-background/70 backdrop-blur-md transition-colors group-hover:border-primary"
                  contentClassName="flex items-center gap-2 px-3 py-2"
                >
                  <StatusLed tone="live" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" />
                </FramedPanel>
              </a>
            ))}
          </div>
        </div>
        <div
          className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-3"
          aria-hidden
        >
          <StatusLed tone="live" label={footer.ledLabel} />
          <HudReadout label={footer.docsLabel} value={footer.docsValue} />
          <HudReadout label={footer.revLabel} value={footer.revValue} />
          <CrossHair className="text-muted-foreground" />
        </div>
      </div>
    </footer>
  );
}

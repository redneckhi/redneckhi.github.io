"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import type { TocItem } from "@/lib/types";
import { InstrumentLabel, StatusLed, FramedPanel } from "@/components/instrument";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const HEADER_OFFSET = 112; // sticky header + spacing

function TocNav({
  items,
  activeId,
  onNavigate,
}: {
  items: TocItem[];
  activeId: string;
  onNavigate?: (id: string) => void;
}) {
  return (
    <nav aria-label="Table of contents" className="space-y-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            onNavigate?.(item.id);
            const el = document.getElementById(item.id);
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", `#${item.id}`);
            }
          }}
          className={cn(
            "block border-l-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
            item.level === 3 ? "pl-5" : "pl-3",
            activeId === item.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

export function DocsToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const getElements = () =>
      items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => Boolean(el));

    let ticking = false;

    const update = () => {
      const elements = getElements();
      if (elements.length === 0) return;

      let current = elements[0].id;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top - HEADER_OFFSET <= 1) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Keep the mobile FAB inside <main> — lift/hide as main bottom leaves the viewport
  useEffect(() => {
    const fab = fabRef.current;
    const main = document.querySelector("main");
    if (!fab || !main) return;

    const MARGIN = 16;

    const update = () => {
      const mainBottom = main.getBoundingClientRect().bottom;
      const lift = Math.max(0, window.innerHeight - mainBottom);
      const bottom = MARGIN + lift;
      fab.style.bottom = `${bottom}px`;

      const fabHeight = fab.offsetHeight;
      const inView = bottom + fabHeight + MARGIN < window.innerHeight;
      fab.style.opacity = inView ? "1" : "0";
      fab.style.pointerEvents = inView ? "auto" : "none";
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <aside className="hidden lg:block">
        <FramedPanel
          className="sticky top-24 glass-heavy backdrop-blur-xl"
          contentClassName="p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <InstrumentLabel>Contents</InstrumentLabel>
            <StatusLed tone="live" label="TOC" />
          </div>
          <ScrollArea className="scrollbar-rhi h-[min(70vh,32rem)] pr-2">
            <TocNav items={items} activeId={activeId} onNavigate={setActiveId} />
          </ScrollArea>
        </FramedPanel>
      </aside>

      <div
        ref={fabRef}
        className="fixed right-4 bottom-4 z-30 transition-[opacity] duration-150 lg:hidden"
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button size="lg" className="gap-2 shadow-lg">
                <Menu className="size-4" />
                TOC
              </Button>
            }
          />
          <SheetContent side="right" className="glass-heavy w-[min(100%,20rem)]">
            <SheetHeader>
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.2em]">
                Contents
              </SheetTitle>
            </SheetHeader>
            <div className="scrollbar-rhi px-4 pb-6">
              <TocNav
                items={items}
                activeId={activeId}
                onNavigate={(id) => {
                  setActiveId(id);
                  setOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

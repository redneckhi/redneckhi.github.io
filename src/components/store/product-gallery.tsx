"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  CornerMarks,
  CrossHair,
  HudReadout,
  InstrumentLabel,
  ProductCover,
  TextBackdrop,
  FramedPanel,
} from "@/components/instrument";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 4000;

function ImageLightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
  name,
}: {
  images: string[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  name: string;
}) {
  const total = images.length;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onIndexChange((index - 1 + total) % total);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, total, onClose, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open || images.length === 0) return null;

  const frame = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/55 p-4 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} image ${frame} of ${totalStr}`}
      onClick={onClose}
    >
      <FramedPanel
        className="relative max-h-[90vh] w-full max-w-5xl border-border bg-background/90 glass-heavy"
        contentClassName="flex flex-col"
      >
        <div
          className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <InstrumentLabel>Optic expand</InstrumentLabel>
            <HudReadout label="FRM" value={`${frame} / ${totalStr}`} />
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div
          className="relative flex min-h-[50vh] items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt=""
            className="max-h-[70vh] max-w-full object-contain"
          />
          {total > 1 ? (
            <>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                aria-label="Previous image"
                onClick={() => onIndexChange((index - 1 + total) % total)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Next image"
                onClick={() => onIndexChange((index + 1) % total)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          ) : null}
        </div>
      </FramedPanel>
    </div>,
    document.body,
  );
}

export function ProductGallery({
  images,
  name,
  accent,
  className,
  textBackdrop = false,
  showName = true,
}: {
  images: string[];
  name: string;
  accent: "orange" | "green" | "yellow";
  className?: string;
  textBackdrop?: boolean;
  showName?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const openLightbox = useCallback(() => {
    if (images.length === 0) return;
    setLightbox(true);
    setPaused(true);
  }, [images.length]);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    if (images.length < 2 || paused || lightbox) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [images.length, paused, lightbox]);

  if (images.length === 0) {
    return (
      <ProductCover
        accent={accent}
        name={name}
        className={className}
        textBackdrop={textBackdrop}
        showName={showName}
      />
    );
  }

  if (images.length === 1) {
    return (
      <>
        <ProductCover
          accent={accent}
          name={name}
          imageSrc={images[0]}
          className={className}
          textBackdrop={textBackdrop}
          showName={showName}
          onMediaClick={openLightbox}
        />
        <ImageLightbox
          images={images}
          index={0}
          open={lightbox}
          onClose={closeLightbox}
          onIndexChange={setIndex}
          name={name}
        />
      </>
    );
  }

  const frame = String(index + 1).padStart(2, "0");
  const total = String(images.length).padStart(2, "0");

  return (
    <>
      <div
        className={cn(
          "relative cursor-zoom-in overflow-hidden border border-border bg-muted/40",
          className,
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          if (!lightbox) setPaused(false);
        }}
        onFocus={() => setPaused(true)}
        onBlur={() => {
          if (!lightbox) setPaused(false);
        }}
        onClick={openLightbox}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Expand gallery for ${name}`}
      >
        <CornerMarks />
        <AnimatePresence mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="noise-overlay absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />

        <div className="relative flex h-full min-h-[280px] flex-col justify-between p-4 lg:min-h-[420px]">
          <div className="flex items-center justify-between gap-2">
            {textBackdrop ? (
              <TextBackdrop>
                <InstrumentLabel className="text-foreground/90">
                  OPTIC FEED
                </InstrumentLabel>
              </TextBackdrop>
            ) : (
              <InstrumentLabel className="text-foreground/80">
                OPTIC FEED
              </InstrumentLabel>
            )}
            <div className="flex items-center gap-3">
              {textBackdrop ? (
                <TextBackdrop>
                  <HudReadout label="FRM" value={`${frame} / ${total}`} />
                </TextBackdrop>
              ) : (
                <HudReadout label="FRM" value={`${frame} / ${total}`} />
              )}
              <CrossHair className="text-foreground/50" />
            </div>
          </div>

          <div className="space-y-3">
            {showName ? (
              textBackdrop ? (
                <TextBackdrop className="block">
                  <p className="font-brand text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                    {name}
                  </p>
                </TextBackdrop>
              ) : (
                <p className="font-brand text-xl font-bold leading-tight tracking-tight sm:text-2xl drop-shadow-sm">
                  {name}
                </p>
              )
            ) : null}
            <div
              className="flex gap-1.5"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1 max-w-8 flex-1 rounded-none transition-colors",
                    i === index
                      ? "bg-primary"
                      : "bg-foreground/25 hover:bg-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ImageLightbox
        images={images}
        index={index}
        open={lightbox}
        onClose={closeLightbox}
        onIndexChange={setIndex}
        name={name}
      />
    </>
  );
}

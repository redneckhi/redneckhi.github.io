import { cn } from "@/lib/utils";
import { resolveStatusTone } from "@/lib/status";

export function InstrumentLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export type MetaRowItem = {
  label: string;
  value: string;
  led?: {
    tone?: "live" | "warn" | "idle" | "tape" | "danger";
    label?: string;
  };
};

export function MetaRow({
  items,
  className,
}: {
  items: MetaRowItem[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "glass-panel flex flex-wrap gap-x-6 gap-y-2 border border-border px-3 py-2 backdrop-blur-xl",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </dt>
          <dd
            className={cn(
              "flex items-center font-mono text-xs text-foreground",
              item.led ? "gap-x-6" : "gap-2",
            )}
          >
            <span>{item.value}</span>
            {item.led ? (
              <StatusLed tone={item.led.tone ?? "live"} label={item.led.label} />
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function WarningRule({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-2 tape-stripe border-y border-border", className)}
      aria-hidden
    />
  );
}

export function CornerMarks({
  className,
  marks = "full",
}: {
  className?: string;
  marks?: "full" | "corners";
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <span className="absolute left-0 top-0 size-3 border-l-2 border-t-2 border-foreground/45" />
      <span className="absolute right-0 top-0 size-3 border-r-2 border-t-2 border-foreground/45" />
      <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-foreground/45" />
      <span className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-foreground/45" />
      {marks === "full" ? (
        <>
          <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-foreground/30" />
          <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-foreground/30" />
          <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-foreground/30" />
          <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-foreground/30" />
        </>
      ) : null}
    </div>
  );
}

/** Border + corner marks with content in a separate layer so marks always match the box. */
export function FramedPanel({
  children,
  className,
  contentClassName,
  marks = "full",
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  marks?: "full" | "corners";
}) {
  return (
    <div className={cn("relative border border-border", className)}>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <CornerMarks marks={marks} />
      </div>
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}

export function CrossHair({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block size-3 shrink-0", className)}
      aria-hidden
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}

const ledTone = {
  live: "bg-hivis shadow-[0_0_8px_color-mix(in_oklch,var(--hivis)_70%,transparent)]",
  warn: "bg-warning shadow-[0_0_8px_color-mix(in_oklch,var(--warning)_70%,transparent)]",
  idle: "bg-muted-foreground/50",
  tape: "bg-tape shadow-[0_0_8px_color-mix(in_oklch,var(--tape)_70%,transparent)]",
  danger:
    "bg-destructive shadow-[0_0_8px_color-mix(in_oklch,var(--destructive)_70%,transparent)]",
} as const;

const ledPing = {
  live: "bg-hivis",
  warn: "bg-warning",
  idle: "bg-muted-foreground/50",
  tape: "bg-tape",
  danger: "bg-destructive",
} as const;

export function StatusLed({
  tone = "live",
  label,
  className,
  ping = true,
}: {
  tone?: keyof typeof ledTone;
  label?: string;
  className?: string;
  ping?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        className,
      )}
      aria-hidden
    >
      <span className="relative flex size-1.5">
        {ping ? (
          <span
            className={cn(
              "absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping",
              ledPing[tone],
            )}
          />
        ) : null}
        <span
          className={cn("relative inline-flex size-1.5 rounded-full", ledTone[tone])}
        />
      </span>
      {label ? <span className="text-muted-foreground">{label}</span> : null}
    </span>
  );
}

export function HudReadout({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        className,
      )}
      aria-hidden
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/90">{value}</span>
    </span>
  );
}

export function StockIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-warning",
        className,
      )}
    >
      <StatusLed tone="warn" />
      <span>Out of stock - do it yourself :)</span>
    </div>
  );
}

const statusLedTone = {
  alpha: "danger",
  beta: "warn",
  field: "tape",
  production: "live",
  idle: "idle",
} as const;

const statusTextClass = {
  alpha: "text-destructive",
  beta: "text-warning",
  field: "text-[color:var(--tape)]",
  production: "text-[color:var(--hivis)]",
  idle: "text-muted-foreground",
} as const;

export function StatusIndicator({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = resolveStatusTone(status);
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]",
        statusTextClass[tone],
        className,
      )}
    >
      <StatusLed tone={statusLedTone[tone]} />
      <span>{status}</span>
    </div>
  );
}

export function TextBackdrop({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block max-w-full border border-border/40 bg-background/65 px-2 py-1 backdrop-blur-md supports-[backdrop-filter]:bg-background/50",
        className,
      )}
    >
      {children}
    </span>
  );
}

const accentMap = {
  orange: "from-warning/80 via-warning/20 to-transparent",
  green: "from-hivis/80 via-hivis/20 to-transparent",
  yellow: "from-tape/90 via-tape/30 to-transparent",
} as const;

export function ProductCover({
  accent,
  name,
  className,
  imageSrc,
  textBackdrop = false,
  showName = true,
  onMediaClick,
}: {
  accent: "orange" | "green" | "yellow";
  name: string;
  className?: string;
  imageSrc?: string;
  textBackdrop?: boolean;
  showName?: boolean;
  onMediaClick?: () => void;
}) {
  const LabelWrap = textBackdrop ? TextBackdrop : "span";
  const clickable = Boolean(onMediaClick && imageSrc);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border instrument-grid bg-muted/40",
        clickable && "cursor-zoom-in",
        className,
      )}
      onClick={clickable ? onMediaClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onMediaClick?.();
              }
            }
          : undefined
      }
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Expand image of ${name}` : undefined}
    >
      <CornerMarks />
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-90",
            accentMap[accent],
          )}
        />
      )}
      <div className="noise-overlay absolute inset-0 opacity-25" />
      {!imageSrc ? (
        <div className="absolute inset-0 glass-panel opacity-30" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
      )}
      <div className="relative flex h-full min-h-[140px] flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-2">
          <LabelWrap>
            <InstrumentLabel className="text-foreground/80">
              UNIT PREVIEW
            </InstrumentLabel>
          </LabelWrap>
          <CrossHair className="text-foreground/50" />
        </div>
        {showName ? (
          textBackdrop ? (
            <TextBackdrop className="mt-auto">
              <p className="font-brand text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                {name}
              </p>
            </TextBackdrop>
          ) : (
            <p className="font-brand text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              {name}
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}

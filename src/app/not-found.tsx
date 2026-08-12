import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WarningRule, CornerMarks } from "@/components/instrument";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-start justify-center gap-6 px-4 py-16 sm:px-6">
      <div className="relative w-full max-w-md space-y-6 border border-border/60 p-6">
        <CornerMarks />
        <WarningRule className="w-full" />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
          404 · Unit not found
        </p>
        <h1 className="font-brand text-4xl font-bold tracking-tight">
          Off the map
        </h1>
        <p className="text-muted-foreground">
          That prototype is not in inventory. Return to the store and try again.
        </p>
        <Link
          href="/store/"
          className={cn(
            buttonVariants(),
            "rounded-sm font-mono text-xs uppercase tracking-[0.2em]",
          )}
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}

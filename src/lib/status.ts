import { cn } from "@/lib/utils";

export type StatusTone = "alpha" | "beta" | "field" | "production" | "idle";

/** Normalize free-form status for color mapping. */
export function resolveStatusTone(status: string): StatusTone {
  const key = status.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

  if (key === "alpha") return "alpha";
  if (key === "beta") return "beta";
  if (key === "field testing" || key === "field test") return "field";
  if (key === "production") return "production";
  return "idle";
}

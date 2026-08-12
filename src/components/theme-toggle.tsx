"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const modes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "glass-panel flex h-9 items-center gap-0.5 border border-border p-0.5",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "glass-panel flex items-center gap-0.5 border border-border p-0.5",
        className,
      )}
      role="group"
      aria-label="Theme"
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "size-7 transition-colors",
            theme === value &&
              "border-primary/80 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground before:hidden",
          )}
        >
          <Icon className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}

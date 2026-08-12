"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import {
  FramedPanel,
  InstrumentLabel,
} from "@/components/instrument";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  children?: ReactNode;
  className?: string;
  "data-language"?: string;
};

export function CodeBlock({
  children,
  className,
  "data-language": dataLanguage,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const language = dataLanguage || "CODE";

  async function copyAll() {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <FramedPanel
      className="code-block-rhi mb-6 overflow-hidden glass-panel backdrop-blur-xl"
      contentClassName="flex flex-col"
      marks="corners"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <InstrumentLabel>{language}</InstrumentLabel>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.16em]"
          onClick={copyAll}
          aria-label="Copy all"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy all"}
        </Button>
      </div>
      <pre
        ref={preRef}
        className={cn(
          "m-0 overflow-x-hidden whitespace-pre-wrap break-words bg-transparent p-0 font-mono text-sm leading-relaxed",
          className,
        )}
        data-language={dataLanguage}
        {...props}
      >
        {children}
      </pre>
    </FramedPanel>
  );
}

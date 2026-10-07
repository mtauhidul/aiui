"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className={cn("group flex items-stretch overflow-hidden border bg-surface/70 backdrop-blur", className)}>
      <span aria-hidden className="flex items-center border-r px-3 font-mono text-xs text-accent">$</span>
      {/* Focusable so keyboard users can scroll a command that overflows on narrow screens. */}
      <div
        role="region"
        aria-label="Install command"
        tabIndex={0}
        className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <code className="font-mono text-[13px]">{command}</code>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-2 border-l px-3.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {copied ? "Copied" : "Copy"}
        <span className="sr-only"> install command</span>
      </button>
      <span role="status" className="sr-only">{copied ? "Install command copied" : ""}</span>
    </div>
  );
}

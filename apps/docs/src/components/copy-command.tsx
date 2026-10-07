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
    <div className={cn("flex items-stretch overflow-hidden rounded-md border bg-surface", className)}>
      <span aria-hidden className="flex items-center pl-4 font-mono text-[13px] text-faint">$</span>
      {/* Focusable so keyboard users can scroll a command that overflows on narrow screens. */}
      <div
        role="group"
        aria-label="Install command"
        tabIndex={0}
        className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <code className="font-mono text-[14px]">{command}</code>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 border-l px-4 text-[15px] text-muted-foreground outline-none transition-colors hover:bg-white/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {copied ? "copied" : "copy"}
        <span className="sr-only"> install command</span>
      </button>
      <span role="status" className="sr-only">{copied ? "Install command copied" : ""}</span>
    </div>
  );
}

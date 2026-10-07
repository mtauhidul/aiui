"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/utils";

export function Reasoning({
  children,
  isStreaming = false,
  duration,
  className,
}: {
  children: React.ReactNode;
  isStreaming?: boolean;
  /** Seconds spent thinking; shown once streaming ends. */
  duration?: number;
  className?: string;
}) {
  const [open, setOpen] = React.useState(isStreaming);
  const wasStreaming = React.useRef(isStreaming);

  // Open while thinking, collapse when done.
  React.useEffect(() => {
    if (isStreaming) setOpen(true);
    else if (wasStreaming.current) setOpen(false);
    wasStreaming.current = isStreaming;
  }, [isStreaming]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={className}>
      <Collapsible.Trigger className="group flex items-center gap-1.5 rounded-sm font-mono text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <span className={cn(isStreaming && "animate-pulse motion-reduce:animate-none")}>
          {isStreaming
            ? "Thinking…"
            : duration
              ? `Thought for ${duration}s`
              : "Thought process"}
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 transition-transform motion-reduce:transition-none group-data-[panel-open]:rotate-90"
        >
          <path d="m6 4 4 4-4 4" />
        </svg>
      </Collapsible.Trigger>
      <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 motion-reduce:transition-none data-[ending-style]:h-0 data-[starting-style]:h-0">
        <div className="mt-2 border-l-2 pl-3 text-[13px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

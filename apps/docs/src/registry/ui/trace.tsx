import * as React from "react";
import { cn } from "@/lib/utils";

export type TraceEvent = {
  id: string;
  kind: "llm" | "tool" | "retrieval" | "agent";
  name: string;
  /** Start offset in ms from the beginning of the run. */
  start: number;
  /** Duration in ms. */
  duration: number;
  status?: "success" | "error";
};

const kindColor: Record<TraceEvent["kind"], string> = {
  llm: "bg-accent",
  tool: "bg-emerald-500",
  retrieval: "bg-amber-500",
  agent: "bg-foreground/70",
};

const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`);

/** Waterfall view of an agent run: one row per span, bars scaled to total duration. */
export function Trace({ events, className }: { events: TraceEvent[]; className?: string }) {
  const total = Math.max(1, ...events.map((e) => e.start + e.duration));
  return (
    <div className={cn("rounded border", className)} role="table" aria-label="Trace">
      <div role="row" className="flex items-center justify-between border-b px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span role="columnheader">Span</span>
        <span role="columnheader">Total {fmt(total)}</span>
      </div>
      {events.map((e) => (
        <div key={e.id} role="row" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3 py-2 text-xs sm:grid-cols-[minmax(0,12rem)_1fr_4rem] sm:py-1.5">
          <span role="cell" className="truncate font-mono">
            <span className="mr-2 text-[10px] uppercase tracking-wider text-muted-foreground">{e.kind}</span>
            {e.name}
            {e.status === "error" && <span className="ml-1.5 font-sans text-red-700 dark:text-red-400">failed</span>}
          </span>
          <span role="cell" className="relative order-3 col-span-2 h-1.5 rounded-sm bg-muted sm:order-none sm:col-span-1">
            <span
              className={cn("absolute inset-y-0 rounded-sm", e.status === "error" ? "bg-red-500" : kindColor[e.kind])}
              style={{ left: `${(e.start / total) * 100}%`, width: `max(2px, ${(e.duration / total) * 100}%)` }}
            />
          </span>
          <span role="cell" className="text-right tabular-nums text-muted-foreground">{fmt(e.duration)}</span>
        </div>
      ))}
    </div>
  );
}

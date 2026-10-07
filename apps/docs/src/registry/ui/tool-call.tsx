"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/utils";

export type ToolCallState = "pending" | "running" | "success" | "error";

const stateLabel: Record<ToolCallState, string> = {
  pending: "Pending",
  running: "Running",
  success: "Done",
  error: "Failed",
};

function StatusDot({ state }: { state: ToolCallState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 rounded-full",
        state === "pending" && "bg-muted-foreground/40",
        state === "running" && "animate-pulse bg-accent",
        state === "success" && "bg-emerald-500",
        state === "error" && "bg-red-500",
      )}
    />
  );
}

function Json({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <pre className="overflow-x-auto rounded-md bg-muted/60 p-2.5 font-mono text-xs leading-relaxed">
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

export function ToolCall({
  name,
  state,
  input,
  output,
  error,
  defaultOpen = false,
  className,
}: {
  name: string;
  state: ToolCallState;
  input?: unknown;
  output?: unknown;
  error?: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className={cn("rounded-lg border bg-muted/20", className)}
    >
      <Collapsible.Trigger className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <StatusDot state={state} />
        <span className="font-mono text-[13px]">{name}</span>
        <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
          {stateLabel[state]}
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5 text-muted-foreground transition-transform group-data-[panel-open]:rotate-90"
        >
          <path d="m6 4 4 4-4 4" />
        </svg>
      </Collapsible.Trigger>
      <Collapsible.Panel className="space-y-3 border-t p-3">
        {input !== undefined && <Json label="Input" value={input} />}
        {output !== undefined && <Json label="Output" value={output} />}
        {error && <Json label="Error" value={error} />}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

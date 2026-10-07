import * as React from "react";
import { cn } from "@/lib/utils";

export type StepState = "pending" | "active" | "done" | "error";

export type PlanStep = { id: string; title: string; state: StepState; detail?: string };

function StepIcon({ state }: { state: StepState }) {
  const base = "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]";
  if (state === "done")
    return (
      <span aria-hidden className={cn(base, "border-transparent bg-foreground text-background")}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3"><path d="m3.5 8.5 3 3 6-6.5" /></svg>
      </span>
    );
  if (state === "active")
    return <span aria-hidden className={cn(base, "border-accent")}><span className="size-2 animate-pulse motion-reduce:animate-none rounded-full bg-accent" /></span>;
  if (state === "error")
    return <span aria-hidden className={cn(base, "border-red-500 text-red-500")}>!</span>;
  return <span aria-hidden className={cn(base, "border-border")} />;
}

const stateText: Record<StepState, string> = {
  done: "Completed",
  active: "In progress",
  pending: "Not started",
  error: "Failed",
};

export function Plan({ steps, className }: { steps: PlanStep[]; className?: string }) {
  return (
    <ol className={cn("space-y-0", className)} aria-label="Plan">
      {steps.map((step, i) => (
        <li
          key={step.id}
          aria-current={step.state === "active" ? "step" : undefined}
          className="relative flex gap-3 pb-4 last:pb-0"
        >
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute left-[9.5px] top-6 bottom-1 w-px bg-border" />
          )}
          <StepIcon state={step.state} />
          <div className="min-w-0 -mt-px">
            <div className={cn("text-sm", step.state === "pending" && "text-muted-foreground", step.state === "done" && "text-muted-foreground line-through decoration-border")}>
              <span className="sr-only">{stateText[step.state]}: </span>
              {step.title}
            </div>
            {step.detail && <div className="mt-0.5 text-xs text-muted-foreground">{step.detail}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

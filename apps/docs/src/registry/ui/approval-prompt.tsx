"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/** Human-in-the-loop gate: the agent wants to do something and needs a yes/no. */
const riskStyle = {
  low: { bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", label: "Low risk" },
  medium: { bar: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", label: "Medium risk" },
  high: { bar: "bg-red-500", text: "text-red-700 dark:text-red-400", label: "High risk" },
} as const;

export function ApprovalPrompt({
  title,
  description,
  details,
  status = "pending",
  risk,
  autoFocus = false,
  onApprove,
  onDeny,
  className,
}: {
  title: string;
  description?: string;
  details?: React.ReactNode;
  status?: "pending" | "approved" | "denied";
  /** How consequential the action is. Shown as a text label and a coloured edge. */
  risk?: "low" | "medium" | "high";
  /** Move focus into the prompt when it appears (use when it arrives mid-conversation). */
  autoFocus?: boolean;
  onApprove?: () => void;
  onDeny?: () => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoFocus && status === "pending") ref.current?.focus();
  }, [autoFocus, status]);

  // Approve/Deny unmount once decided; keep keyboard focus in the prompt instead of losing it to <body>.
  const wasPending = React.useRef(status === "pending");
  React.useEffect(() => {
    if (wasPending.current && status !== "pending" && document.activeElement === document.body) {
      ref.current?.focus();
    }
    wasPending.current = status === "pending";
  }, [status]);

  const edge = status === "approved" ? "bg-emerald-500" : status === "denied" ? "bg-red-500" : risk ? riskStyle[risk].bar : "bg-foreground/60";

  return (
    <div
      ref={ref}
      role="alertdialog"
      aria-modal="false"
      aria-label={title}
      tabIndex={-1}
      className={cn("relative overflow-hidden rounded border bg-muted/20 py-3 pl-4 pr-3 outline-none focus-visible:border-foreground/50", className)}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5", edge)} />
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span aria-live="polite">{status === "pending" ? "Needs approval" : status === "approved" ? "Approved" : "Denied"}</span>
        {status === "pending" && risk && <span className={riskStyle[risk].text}>· {riskStyle[risk].label}</span>}
      </div>
      <div className="mt-1.5 text-sm font-medium">{title}</div>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      {details && <div className="mt-2.5 rounded-sm border bg-background/60 p-2.5 font-mono text-xs">{details}</div>}
      {status === "pending" && (
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={onApprove}>Approve</Button>
          <Button size="sm" variant="outline" onClick={onDeny}>Deny</Button>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/** Human-in-the-loop gate: the agent wants to do something and needs a yes/no. */
export function ApprovalPrompt({
  title,
  description,
  details,
  status = "pending",
  autoFocus = false,
  onApprove,
  onDeny,
  className,
}: {
  title: string;
  description?: string;
  details?: React.ReactNode;
  status?: "pending" | "approved" | "denied";
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

  return (
    <div
      ref={ref}
      role="alertdialog"
      aria-modal="false"
      aria-label={title}
      tabIndex={-1}
      className={cn("rounded-lg border bg-muted/20 p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <div className="text-sm font-medium">{title}</div>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      {details && <div className="mt-2 rounded-md bg-muted/60 p-2.5 font-mono text-xs">{details}</div>}
      <div className="mt-3 flex items-center gap-2" aria-live="polite">
        {status === "pending" ? (
          <>
            <Button size="sm" variant="accent" onClick={onApprove}>Approve</Button>
            <Button size="sm" variant="outline" onClick={onDeny}>Deny</Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">
            {status === "approved" ? "Approved" : "Denied"}
          </span>
        )}
      </div>
    </div>
  );
}

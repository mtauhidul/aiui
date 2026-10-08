import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./turn-button";

/** A failed reply, with an optional retry. Keep it mounted until the retry produces output so focus is not lost. */
export function ErrorNotice({
  title = "Something went wrong",
  message,
  onRetry,
  retrying = false,
  retryLabel = "Retry",
  className,
}: {
  title?: string;
  /** What happened, in plain words. */
  message?: React.ReactNode;
  /** Shows a retry button when set. */
  onRetry?: () => void;
  /** Disables the button and shows "Retrying…" while the retry is in flight. */
  retrying?: boolean;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("relative overflow-hidden rounded border bg-muted/20 py-3 pl-4 pr-3", className)}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-red-500" />
      <div className="font-mono text-[11px] uppercase tracking-wider text-red-700 dark:text-red-400">Error</div>
      <div className="mt-1.5 text-sm font-medium">{title}</div>
      {message && <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button size="sm" variant="outline" className="mt-3" onClick={onRetry} disabled={retrying} focusableWhenDisabled>
          {retrying ? "Retrying…" : retryLabel}
        </Button>
      )}
    </div>
  );
}

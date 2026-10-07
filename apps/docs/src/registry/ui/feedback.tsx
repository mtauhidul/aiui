"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type FeedbackValue = "up" | "down";

export type FeedbackDetails = {
  value: FeedbackValue;
  reasons: string[];
  comment: string;
};

export const DEFAULT_REASONS: Record<FeedbackValue, string[]> = {
  up: ["Accurate", "Helpful", "Well written", "Creative"],
  down: ["Inaccurate", "Not helpful", "Too long", "Unsafe or offensive", "Other"],
};

function Thumb({ direction, filled }: { direction: FeedbackValue; filled: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(direction === "down" && "rotate-180")}
    >
      <path d="M5.5 7.25V13.5H3a.75.75 0 0 1-.75-.75v-4.75A.75.75 0 0 1 3 7.25h2.5Zm0 0 2.1-4.4a1.4 1.4 0 0 1 2.65.65v2.5h2.9a1.25 1.25 0 0 1 1.22 1.52l-.9 4a1.25 1.25 0 0 1-1.22.98H5.5" />
    </svg>
  );
}

/**
 * Thumbs up/down with an optional follow-up (reasons and a comment).
 * The rating is reported immediately via onValueChange; details arrive on submit.
 */
export function Feedback({
  value,
  defaultValue = null,
  onValueChange,
  onSubmit,
  details = "down",
  reasons = DEFAULT_REASONS,
  children,
  className,
}: {
  value?: FeedbackValue | null;
  defaultValue?: FeedbackValue | null;
  /** Called on every rating change. Receives null when a rating is toggled off. */
  onValueChange?: (value: FeedbackValue | null) => void;
  /** Called when the follow-up form is submitted. */
  onSubmit?: (details: FeedbackDetails) => void;
  /** Which ratings open the follow-up form. */
  details?: "never" | "down" | "both";
  reasons?: Partial<Record<FeedbackValue, string[]>>;
  /** Extra actions (e.g. Copy) rendered in the same row, before the rating buttons. */
  children?: React.ReactNode;
  className?: string;
}) {
  const [inner, setInner] = React.useState<FeedbackValue | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [phase, setPhase] = React.useState<"idle" | "form" | "done">("idle");
  const [picked, setPicked] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState("");
  const panelRef = React.useRef<HTMLDivElement>(null);
  const ratingRef = React.useRef<HTMLDivElement>(null);

  const opensForm = (v: FeedbackValue) => details === "both" || (details === "down" && v === "down");

  React.useEffect(() => {
    if (phase === "form") panelRef.current?.querySelector<HTMLElement>("button, textarea")?.focus();
  }, [phase]);

  function rate(next: FeedbackValue) {
    const result = current === next ? null : next;
    setInner(result);
    onValueChange?.(result);
    setPicked([]);
    setComment("");
    setPhase(result && opensForm(result) ? "form" : "idle");
  }

  // The form unmounts while it holds focus, so hand focus back to the rating.
  function closeForm(next: "idle" | "done") {
    setPhase(next);
    queueMicrotask(() => ratingRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus());
  }

  function submit() {
    if (!current) return;
    onSubmit?.({ value: current, reasons: picked, comment: comment.trim() });
    closeForm("done");
  }

  const options = (current && (reasons[current] ?? DEFAULT_REASONS[current])) || [];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-0.5">
        {children}
        <div ref={ratingRef} className="flex items-center gap-0.5" role="group" aria-label="Rate this response">
          {(["up", "down"] as const).map((v) => (
            <Button
              key={v}
              type="button"
              variant="ghost"
              size="icon"
              aria-pressed={current === v}
              aria-label={v === "up" ? "Good response" : "Bad response"}
              onClick={() => rate(v)}
              className="aria-pressed:bg-muted aria-pressed:text-foreground"
            >
              <Thumb direction={v} filled={current === v} />
            </Button>
          ))}
        </div>
        <span role="status" className="ml-2 text-xs text-muted-foreground">
          {phase === "done" ? "Thanks for the feedback" : ""}
        </span>
      </div>

      {phase === "form" && current && (
        <div ref={panelRef} className="w-full max-w-sm space-y-3 rounded-lg border bg-background p-3">
          <div className="text-sm font-medium">{current === "up" ? "What did you like?" : "What went wrong?"}</div>
          {options.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Reasons">
              {options.map((r) => {
                const on = picked.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked((p) => (on ? p.filter((x) => x !== r) : [...p, r]))}
                    className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-foreground aria-pressed:text-foreground"
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          )}
          <textarea
            rows={2}
            value={comment}
            placeholder="Tell us more (optional)"
            aria-label="Additional feedback"
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape") closeForm("idle");
            }}
            className="w-full resize-none rounded-md border bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => closeForm("idle")}>Skip</Button>
            <Button type="button" size="sm" onClick={submit}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}

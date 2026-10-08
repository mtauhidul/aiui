"use client";

import * as React from "react";
import { Button } from "./button";

/** Icon button that copies text and confirms through a status region. Sits in the MessageActions row. */
export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  /** Text to copy, or a function that returns it at click time. */
  value: string | (() => string);
  /** Accessible name. */
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(typeof value === "function" ? value() : value);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <Button type="button" variant="ghost" size="icon" aria-label={label} onClick={copy} className={className}>
        {copied ? (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 8.5 3.5 3.5L13 4.5" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden><rect x="5.5" y="5.5" width="8" height="8" rx="1" /><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></svg>
        )}
      </Button>
      <span role="status" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
    </>
  );
}

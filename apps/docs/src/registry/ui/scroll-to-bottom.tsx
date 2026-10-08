"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * A "jump to latest" button that appears when a scroll container is not at the bottom.
 * Place it inside a `relative` wrapper around the container; it centers itself near the bottom edge.
 */
export function ScrollToBottom({
  target,
  threshold = 120,
  label = "Scroll to latest message",
  className,
}: {
  /** The scrolling element, e.g. the ref returned by useAutoScroll. */
  target: React.RefObject<HTMLElement | null>;
  /** How far from the bottom, in pixels, before the button appears. */
  threshold?: number;
  /** Accessible name. Keep the word "latest" so it contains the visible text. */
  label?: string;
  className?: string;
}) {
  const [away, setAway] = React.useState(false);

  React.useEffect(() => {
    const el = target.current;
    if (!el) return;
    const update = () => setAway(el.scrollHeight - el.scrollTop - el.clientHeight > threshold);
    const first = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : undefined;
    resize?.observe(el);
    const mutate = new MutationObserver(update);
    mutate.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelAnimationFrame(first);
      el.removeEventListener("scroll", update);
      resize?.disconnect();
      mutate.disconnect();
    };
  }, [target, threshold]);

  function jump() {
    const el = target.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    // The button unmounts once the container is at the bottom, so hand focus to the container.
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  if (!away) return null;
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={label}
      onClick={jump}
      className={cn("absolute bottom-3 left-1/2 -translate-x-1/2 gap-1.5 bg-background font-mono text-xs", className)}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
      </svg>
      latest
    </Button>
  );
}

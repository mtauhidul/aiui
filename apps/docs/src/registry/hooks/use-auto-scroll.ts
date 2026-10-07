"use client";

import * as React from "react";

/** Keeps a scroll container pinned to the bottom unless the user scrolls up. */
export function useAutoScroll<T extends HTMLElement>(dep: unknown) {
  const ref = React.useRef<T>(null);
  const pinned = React.useRef(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [dep]);

  return ref;
}

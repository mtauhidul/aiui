"use client";

import * as React from "react";

/** Docs-only: simulates a token stream so demos work without a backend. */
export function useFakeStream() {
  const [text, setText] = React.useState("");
  const [isStreaming, setStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = React.useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setStreaming(false);
  }, []);

  const start = React.useCallback(
    (full: string) => {
      stop();
      setText("");
      setStreaming(true);
      let i = 0;
      timer.current = setInterval(() => {
        i += 1 + Math.floor(Math.random() * 3);
        setText(full.slice(0, i));
        if (i >= full.length) stop();
      }, 18);
    },
    [stop],
  );

  React.useEffect(() => stop, [stop]);
  return { text, isStreaming, start, stop };
}

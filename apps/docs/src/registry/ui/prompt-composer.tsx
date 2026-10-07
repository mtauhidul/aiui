"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function PromptComposer({
  onSubmit,
  onStop,
  isStreaming = false,
  placeholder = "Ask anything…",
  className,
}: {
  onSubmit: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = React.useState("");
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSubmit(text);
    setValue("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/40",
        className,
      )}
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        placeholder={placeholder}
        aria-label="Message"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-muted-foreground"
      />
      {isStreaming ? (
        <Button type="button" variant="outline" size="icon" onClick={onStop} aria-label="Stop generating">
          <svg viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" /></svg>
        </Button>
      ) : (
        <Button type="submit" variant="accent" size="icon" disabled={!value.trim()} aria-label="Send message">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
        </Button>
      )}
    </form>
  );
}

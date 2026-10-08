"use client";

import { cn } from "@/lib/utils";

export type Suggestion = string | { label: string; value?: string };

/** A row of starter prompts. One line that scrolls sideways on narrow screens, wraps on wider ones. */
export function Suggestions({
  items,
  onSelect,
  disabled = false,
  label = "Suggested prompts",
  className,
}: {
  items: Suggestion[];
  /** Called with the prompt text: `value` when given, otherwise the label. */
  onSelect: (prompt: string) => void;
  /** Keep the row visible but inert, e.g. while a reply streams. Avoids losing keyboard focus. */
  disabled?: boolean;
  /** Accessible name of the group. */
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "-m-1 flex gap-2 overflow-x-auto p-1 sm:flex-wrap sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => {
        const text = typeof item === "string" ? item : item.label;
        const value = typeof item === "string" ? item : (item.value ?? item.label);
        return (
          <button
            key={text}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(value)}
            className="shrink-0 whitespace-nowrap rounded border px-3 py-1.5 text-[14px] text-muted-foreground outline-none transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

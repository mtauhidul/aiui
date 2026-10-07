"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SlashCommand = {
  id: string;
  /** Name without the leading slash, e.g. "summarize". */
  name: string;
  description?: string;
  /** Extra search terms. */
  keywords?: string[];
  /** If set, selecting replaces the input with this text instead of running the command. */
  insert?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
};

/**
 * Ranks name-prefix matches first, then name substrings (2+ characters), then
 * keywords or description words that start with the query.
 */
export function filterCommands(commands: SlashCommand[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  const scored: [SlashCommand, number][] = [];
  for (const c of commands) {
    const name = c.name.toLowerCase();
    if (name.startsWith(q)) scored.push([c, 0]);
    else if (q.length > 1 && name.includes(q)) scored.push([c, 1]);
    else if (
      [...(c.keywords ?? []), ...(c.description ?? "").split(/\s+/)].some((w) => w.toLowerCase().startsWith(q))
    ) scored.push([c, 2]);
  }
  return scored.sort((a, b) => a[1] - b[1]).map(([c]) => c);
}

export function optionId(menuId: string, index: number) {
  return `${menuId}-option-${index}`;
}

/** The listbox. PromptComposer wires keyboard handling and ARIA; use this directly for custom inputs. */
export function CommandMenu({
  id,
  commands,
  activeIndex,
  onActiveChange,
  onSelect,
  className,
}: {
  id: string;
  commands: SlashCommand[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onSelect: (command: SlashCommand) => void;
  className?: string;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[id="${optionId(id, activeIndex)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id]);

  return (
    <ul
      ref={listRef}
      id={id}
      role="listbox"
      aria-label="Commands"
      className={cn(
        "max-h-64 overflow-y-auto rounded border bg-background p-1 shadow-lg",
        className,
      )}
    >
      {commands.map((c, i) => (
        <li
          key={c.id}
          id={optionId(id, i)}
          role="option"
          aria-selected={i === activeIndex}
          onMouseMove={() => i !== activeIndex && onActiveChange(i)}
          // Keep focus in the textarea while clicking.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(c)}
          className={cn(
            "flex cursor-default items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm",
            i === activeIndex && "bg-muted",
          )}
        >
          {c.icon && <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">{c.icon}</span>}
          <span className="font-mono text-[13px]">/{c.name}</span>
          {c.description && <span className="min-w-0 truncate text-xs text-muted-foreground">{c.description}</span>}
        </li>
      ))}
    </ul>
  );
}

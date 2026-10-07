"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Structurally compatible with the items returned by useAttachments. */
export type AttachmentData = {
  name: string;
  size: number;
  previewUrl?: string;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function RemoveButton({ name, onRemove, className }: { name: string; onRemove: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${name}`}
      className={cn(
        "flex size-5 items-center justify-center rounded-sm bg-foreground text-background outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-2.5"><path d="m4 4 8 8M12 4l-8 8" /></svg>
    </button>
  );
}

function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className={cn("h-0.5 overflow-hidden rounded-none bg-border", className)}>
      <div className="h-full bg-accent transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Attachment({
  item,
  onRemove,
  className,
}: {
  item: AttachmentData;
  onRemove?: () => void;
  className?: string;
}) {
  const failed = item.status === "error";
  const uploading = item.status === "uploading";

  if (item.previewUrl) {
    return (
      <div className={cn("group relative size-16 shrink-0", className)} title={failed ? item.error : item.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.previewUrl}
          alt={item.name}
          className={cn("size-full rounded border object-cover", uploading && "opacity-60", failed && "border-red-500")}
        />
        {uploading && <Progress value={item.progress} label={`Uploading ${item.name}`} className="absolute inset-x-1.5 bottom-1.5" />}
        {onRemove && (
          <RemoveButton name={item.name} onRemove={onRemove} className="absolute -right-1.5 -top-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex h-16 w-44 shrink-0 items-center gap-2.5 overflow-hidden rounded border bg-muted/40 px-2.5",
        failed && "border-red-500/60",
        className,
      )}
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground", failed && "text-red-500")}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M9.5 1.75H4.75a1.5 1.5 0 0 0-1.5 1.5v9.5a1.5 1.5 0 0 0 1.5 1.5h6.5a1.5 1.5 0 0 0 1.5-1.5V5l-3.25-3.25Z" /><path d="M9.5 1.75V5h3.25" /></svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium" title={item.name}>{item.name}</div>
        <div className={cn("truncate text-xs", failed ? "text-red-500" : "text-muted-foreground")} title={failed ? item.error : undefined} aria-live="polite">
          {failed ? item.error : uploading ? `${item.progress}%` : formatBytes(item.size)}
        </div>
      </div>
      {uploading && <Progress value={item.progress} label={`Uploading ${item.name}`} className="absolute inset-x-0 bottom-0 rounded-none" />}
      {onRemove && (
        <RemoveButton name={item.name} onRemove={onRemove} className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100" />
      )}
    </div>
  );
}

/** Horizontal, scrollable row of attachments. */
export function AttachmentList({
  items,
  onRemove,
  className,
}: {
  items: (AttachmentData & { id: string })[];
  onRemove?: (id: string) => void;
  className?: string;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);
  if (!items.length) return null;

  // The focused Remove button disappears with its item, so move focus to a neighbour
  // (or the message input when the list is empty) instead of dropping it on <body>.
  function remove(index: number, id: string) {
    const form = listRef.current?.closest("form");
    onRemove?.(id);
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLElement>('button[aria-label^="Remove"]');
      if (buttons?.length) buttons[Math.min(index, buttons.length - 1)].focus();
      else form?.querySelector("textarea")?.focus();
    });
  }

  return (
    <ul ref={listRef} className={cn("flex gap-2 overflow-x-auto px-1 pb-1 pt-2", className)} aria-label="Attachments">
      {items.map((item, i) => (
        <li key={item.id} className="shrink-0">
          <Attachment item={item} onRemove={onRemove && (() => remove(i, item.id))} />
        </li>
      ))}
    </ul>
  );
}

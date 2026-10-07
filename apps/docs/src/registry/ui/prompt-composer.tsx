"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function PromptComposer({
  onSubmit,
  onStop,
  isStreaming = false,
  placeholder = "Ask anything…",
  attachments,
  toolbar,
  onFiles,
  accept,
  allowEmpty = false,
  submitDisabled = false,
  className,
}: {
  onSubmit: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  /** Rendered above the input, e.g. an <AttachmentList />. */
  attachments?: React.ReactNode;
  /** Enables the attach button, drag-and-drop and paste of files. */
  onFiles?: (files: File[]) => void;
  /** Passed to the file picker, e.g. "image/*,.pdf". */
  accept?: string;
  /** Rendered below the input, e.g. a <ModelPicker />. */
  toolbar?: React.ReactNode;
  /** Allow sending with no text (e.g. attachments only). */
  allowEmpty?: boolean;
  /** Block sending, e.g. while uploads are in progress. */
  submitDisabled?: boolean;
  className?: string;
}) {
  const [value, setValue] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const canSend = !submitDisabled && (allowEmpty || value.trim().length > 0);

  function submit() {
    if (!canSend || isStreaming) return;
    onSubmit(value.trim());
    setValue("");
  }

  const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      onDragEnter={(e) => {
        if (!onFiles || !hasFiles(e)) return;
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => {
        if (onFiles && hasFiles(e)) e.preventDefault();
      }}
      onDragLeave={() => {
        if (!onFiles) return;
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDrop={(e) => {
        if (!onFiles || !hasFiles(e)) return;
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "relative rounded-2xl border bg-background p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring/40",
        dragging && "ring-2 ring-accent",
        className,
      )}
    >
      {attachments}
      <div className="flex items-end gap-2">
        {onFiles && (
          <>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              accept={accept}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) onFiles(files);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="ghost" size="icon" aria-label="Attach files" onClick={() => fileInput.current?.click()}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m13.5 7.5-5.25 5.25a3.18 3.18 0 0 1-4.5-4.5l5.5-5.5a2.12 2.12 0 0 1 3 3l-5.5 5.5a1.06 1.06 0 0 1-1.5-1.5L10 4.25" /></svg>
            </Button>
          </>
        )}
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder={placeholder}
          aria-label="Message"
          onChange={(e) => setValue(e.target.value)}
          onPaste={(e) => {
            if (!onFiles || !e.clipboardData.files.length) return;
            e.preventDefault();
            onFiles(Array.from(e.clipboardData.files));
          }}
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
          <Button type="submit" variant="accent" size="icon" disabled={!canSend} aria-label="Send message">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
          </Button>
        )}
      </div>
      {toolbar && <div className="flex items-center gap-1 px-1 pt-1">{toolbar}</div>}
      {dragging && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 text-sm font-medium text-accent">
          Drop files to attach
        </div>
      )}
    </form>
  );
}

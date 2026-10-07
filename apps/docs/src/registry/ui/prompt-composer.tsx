"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandMenu, filterCommands, optionId, type SlashCommand } from "./command-menu";

export function PromptComposer({
  onSubmit,
  onStop,
  isStreaming = false,
  placeholder = "Ask anything…",
  attachments,
  toolbar,
  onFiles,
  accept,
  commands,
  onCommand,
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
  /** Typing "/" at the start of the input opens a command menu. */
  commands?: SlashCommand[];
  /** Called when a command without `insert` is chosen. The "/query" text is cleared. */
  onCommand?: (command: SlashCommand) => void;
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
  const menuId = React.useId();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const caretToEnd = React.useRef(false);

  // The menu is open while the whole input is a single "/token".
  const slashQuery = commands ? /^\/(\S*)$/.exec(value)?.[1] : undefined;
  const matches = React.useMemo(
    () => (commands && slashQuery !== undefined ? filterCommands(commands, slashQuery) : []),
    [commands, slashQuery],
  );
  const menuOpen = !dismissed && matches.length > 0;
  const active = Math.min(activeIndex, Math.max(0, matches.length - 1));

  React.useLayoutEffect(() => {
    if (!caretToEnd.current) return;
    caretToEnd.current = false;
    const el = ref.current;
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
  }, [value]);

  function selectCommand(command: SlashCommand) {
    setDismissed(false);
    setActiveIndex(0);
    if (command.insert !== undefined) {
      caretToEnd.current = true;
      setValue(command.insert);
    } else {
      setValue("");
      onCommand?.(command);
    }
  }

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
        "group/composer relative rounded border bg-background p-2 transition-colors focus-within:border-foreground/40",
        dragging && "border-accent",
        className,
      )}
    >
      {menuOpen && (
        <CommandMenu
          id={menuId}
          commands={matches}
          activeIndex={active}
          onActiveChange={setActiveIndex}
          onSelect={selectCommand}
          className="absolute inset-x-0 bottom-full z-20 mb-2"
        />
      )}
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
          // role="combobox" isn't allowed on <textarea>, so use the attributes a textbox supports.
          {...(commands && {
            "aria-autocomplete": "list" as const,
            "aria-controls": menuOpen ? menuId : undefined,
            "aria-activedescendant": menuOpen ? optionId(menuId, active) : undefined,
          })}
          onChange={(e) => {
            setValue(e.target.value);
            setDismissed(false);
            setActiveIndex(0);
          }}
          onPaste={(e) => {
            if (!onFiles || !e.clipboardData.files.length) return;
            e.preventDefault();
            onFiles(Array.from(e.clipboardData.files));
          }}
          onKeyDown={(e) => {
            if (menuOpen && !e.nativeEvent.isComposing) {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const step = e.key === "ArrowDown" ? 1 : -1;
                setActiveIndex((active + step + matches.length) % matches.length);
                return;
              }
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                selectCommand(matches[active]);
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setDismissed(true);
                return;
              }
            }
            if (e.key === "Escape" && isStreaming && onStop) {
              e.preventDefault();
              onStop();
              return;
            }
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-muted-foreground"
        />
        {/* One element for both states so keyboard focus survives send -> stop. */}
        <Button
          type={isStreaming ? "button" : "submit"}
          variant={isStreaming ? "outline" : "accent"}
          size="icon"
          disabled={!isStreaming && !canSend}
          onClick={isStreaming ? onStop : undefined}
          aria-label={isStreaming ? "Stop generating" : "Send message"}
        >
          {isStreaming ? (
            <svg viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
          )}
        </Button>
      </div>
      <div className="flex items-center gap-1 px-1 pt-1">
        {toolbar}
        <span aria-hidden className="ml-auto hidden font-mono text-[11px] text-muted-foreground [@media(hover:hover)]:group-focus-within/composer:inline">
          {isStreaming && onStop ? "esc stop" : "↵ send · ⇧↵ newline"}
        </span>
      </div>
      {dragging && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center rounded bg-background/80 text-sm font-medium text-accent">
          Drop files to attach
        </div>
      )}
    </form>
  );
}

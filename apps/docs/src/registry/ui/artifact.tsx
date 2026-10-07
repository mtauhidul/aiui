"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/** Side pane for generated content, with Preview and Code tabs. */
export function Artifact({
  title,
  preview,
  code,
  onClose,
  className,
}: {
  title: string;
  preview: React.ReactNode;
  code: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <Tabs.Root defaultValue="preview" className={cn("flex h-full flex-col overflow-hidden rounded border bg-background", className)}>
      <div className="flex h-11 items-center gap-3 border-b px-3">
        <span className="truncate text-sm font-medium">{title}</span>
        <Tabs.List className="ml-auto flex gap-0.5 rounded-sm bg-muted p-0.5 text-xs">
          {(["preview", "code"] as const).map((v) => (
            <Tabs.Tab
              key={v}
              value={v}
              className="rounded-sm px-2.5 py-1 capitalize text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"
            >
              {v}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close artifact">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m4 4 8 8M12 4l-8 8" /></svg>
          </Button>
        )}
      </div>
      <Tabs.Panel value="preview" className="min-h-0 flex-1 overflow-auto p-4">{preview}</Tabs.Panel>
      <Tabs.Panel value="code" className="min-h-0 flex-1 overflow-auto p-4">{code}</Tabs.Panel>
    </Tabs.Root>
  );
}

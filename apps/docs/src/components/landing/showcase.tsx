"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { ChatDemo } from "@/components/chat-demo";
import { AgentDemo } from "@/components/agent-demo";
import { ComposerShowcase } from "@/components/landing/composer-showcase";

const tabs = [
  { value: "chat", label: "chat", body: <ChatDemo /> },
  { value: "agent", label: "agent", body: <AgentDemo /> },
  { value: "composer", label: "composer", body: <ComposerShowcase /> },
];

/** The product itself, as the hero visual: a window with live, interactive components. */
export function Showcase() {
  return (
    <Tabs.Root defaultValue="chat" className="overflow-hidden rounded-lg border bg-surface">
      <div className="flex items-center gap-4 border-b bg-black/40 px-4">
        <div aria-hidden className="flex gap-2">
          <span className="size-3 rounded-full bg-white/15" />
          <span className="size-3 rounded-full bg-white/15" />
        </div>
        <Tabs.List className="flex">
          {tabs.map((t) => (
            <Tabs.Tab
              key={t.value}
              value={t.value}
              className="relative px-4 py-3.5 text-[15px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[active]:text-foreground data-[active]:after:absolute data-[active]:after:inset-x-3 data-[active]:after:bottom-0 data-[active]:after:h-px data-[active]:after:bg-foreground"
            >
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </div>
      {tabs.map((t) => (
        <Tabs.Panel key={t.value} value={t.value} className="h-[640px] overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
          {t.body}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

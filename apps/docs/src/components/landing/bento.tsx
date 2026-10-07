import * as React from "react";

import { cn } from "@/lib/utils";
import { ToolCall } from "@/registry/ui/tool-call";
import { Plan } from "@/registry/ui/plan";
import { Attachment } from "@/registry/ui/attachment";
import { Feedback } from "@/registry/ui/feedback";

function Cell({
  index,
  label,
  title,
  body,
  className,
  children,
}: {
  index: string;
  label: string;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={cn("group relative flex flex-col overflow-hidden border bg-surface/70 p-6 transition-colors hover:bg-surface", className)}>
      <div className="font-medium flex items-center justify-between text-xs text-muted-foreground">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <div aria-hidden inert className="my-6 flex flex-1 items-center">
        <div className="w-full">{children}</div>
      </div>
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}

function StreamingViz() {
  const row = "grid grid-cols-[1fr_auto_auto] items-center gap-3";
  const tag = "font-medium w-20 text-right text-xs text-muted-foreground";
  return (
    <div className="space-y-3.5">
      {[78, 92, 64].map((w, i) => (
        <div key={i} className={row}>
          <div className="h-2 rounded-full bg-foreground/15" style={{ width: `${w}%` }} />
          <span />
          <span className={tag}>memoized</span>
        </div>
      ))}
      <div className={row}>
        <div className="relative h-2 w-[46%] overflow-hidden rounded-full bg-accent/25">
          <div className="animate-shimmer absolute inset-0" />
        </div>
        <span aria-hidden className="animate-caret h-3 w-1.5 bg-accent" />
        <span className={`${tag} text-accent`}>live</span>
      </div>
    </div>
  );
}

export function Bento() {
  return (
    <div className="grid grid-cols-1 gap-px border bg-border md:grid-cols-6 [&>article]:min-w-0 [&>article]:border-0">
      <Cell
        index="01"
        label="Streaming"
        title="Streams that never flicker"
        body="Markdown is split into blocks and each one is memoized. Only the block being written re-renders, and code highlights once it settles."
        className="md:col-span-4"
      >
        <StreamingViz />
      </Cell>

      <Cell index="02" label="Agents" title="Agent-native" body="Tool calls, reasoning, plans, traces and human approvals." className="md:col-span-2">
        <div className="space-y-2.5">
          <ToolCall name="search_docs" state="success" input={{ q: "streaming" }} />
          <Plan
            steps={[
              { id: "1", title: "Search", state: "done" },
              { id: "2", title: "Draft", state: "active" },
            ]}
          />
        </div>
      </Cell>

      <Cell index="03" label="Input" title="Rich composer" body="Files, drag and drop, paste, slash commands and a model picker." className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          <Attachment item={{ name: "brief.pdf", size: 245000, status: "done", progress: 100 }} />
          <Attachment item={{ name: "data.csv", size: 880000, status: "uploading", progress: 64 }} />
        </div>
      </Cell>

      <Cell index="04" label="Ownership" title="Your code, not a dependency" body="Install with the shadcn CLI and edit every line. No wrapper, no lock-in." className="md:col-span-2">
        <pre className="overflow-hidden border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
{`components/ui/
  `}<span className="text-accent">message.tsx</span>{`
  tool-call.tsx
  prompt-composer.tsx
  feedback.tsx`}
        </pre>
      </Cell>

      <Cell index="05" label="Feedback" title="Closes the loop" body="Thumbs with an optional follow-up that returns focus where you left it." className="md:col-span-2">
        <Feedback defaultValue="up" />
      </Cell>

      <Cell
        index="06"
        label="Accessibility"
        title="Accessible by default"
        body="Keyboard-first, live regions that wait for the reply, AA contrast in both themes, and reduced-motion respected everywhere."
        className="md:col-span-6"
      >
        <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4">
          {[
            ["0", "axe violations"],
            ["4.5:1", "min. text contrast"],
            ["✓", "keyboard operable"],
            ["✓", "reduced motion"],
          ].map(([big, small]) => (
            <div key={small} className="bg-surface px-4 py-5">
              <div className="font-display text-3xl font-medium leading-none tracking-[-0.04em]">{big}</div>
              <div className="font-medium mt-2 text-xs text-muted-foreground">{small}</div>
            </div>
          ))}
        </div>
      </Cell>
    </div>
  );
}



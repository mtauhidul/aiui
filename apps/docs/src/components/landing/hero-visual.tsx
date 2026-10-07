"use client";

import * as React from "react";
import { Message, MessageContent } from "@/registry/ui/message";
import { Reasoning } from "@/registry/ui/reasoning";
import { ToolCall } from "@/registry/ui/tool-call";
import { CitationMarker, type Source } from "@/registry/ui/citations";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { ModelPicker, type Model } from "@/registry/ui/model-picker";
import { Plan } from "@/registry/ui/plan";
import { Trace } from "@/registry/ui/trace";
import { Feedback } from "@/registry/ui/feedback";
import { Sources } from "@/registry/ui/citations";

const SOURCES: Source[] = [
  { title: "Base UI documentation", url: "https://base-ui.com", snippet: "Unstyled, accessible React components." },
  { title: "Tailwind CSS", url: "https://tailwindcss.com", snippet: "A utility-first CSS framework." },
];

const MODELS: Model[] = [
  { value: "sonnet", label: "Claude Sonnet 5.5", provider: "Anthropic" },
];

const panel = "border bg-surface/90 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl";
const z = (px: number) => ({ transform: `translateZ(${px}px)` });

/**
 * A tilted stack of real components. Decorative only: it is hidden from assistive tech and inert,
 * and the interactive version lives in the live demo below it.
 */
export function HeroVisual() {
  const ref = React.useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", String(x * 12));
    el.style.setProperty("--ry", String(-y * 10));
  }

  function onLeave() {
    ref.current?.style.setProperty("--rx", "0");
    ref.current?.style.setProperty("--ry", "0");
  }

  return (
    <div
      aria-hidden
      inert
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto h-[500px] w-full max-w-[620px] select-none [perspective:1800px] sm:h-[620px]"
    >
      <div
        ref={ref}
        className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: "rotateX(calc(9deg + var(--ry, 0) * 1deg)) rotateY(calc(-19deg + var(--rx, 0) * 1deg))" }}
      >
        {/* back plate: a grid slab the console sits on */}
        <div
          className="bg-grid-fine absolute inset-x-[-4%] inset-y-[2%] border border-dashed opacity-70"
          style={z(-120)}
        />

        {/* console window */}
        <div className={`${panel} absolute left-[3%] top-[5%] w-[90%] [border-radius:calc(var(--radius)+4px)]`} style={z(0)}>
          <div className="flex items-center gap-2 border-b px-3.5 py-2.5">
            <span className="size-2 bg-foreground/25" />
            <span className="size-2 bg-foreground/25" />
            <span className="size-2 bg-foreground/25" />
            <span className="font-medium ml-3 text-xs text-muted-foreground">session / 0x4f2a</span>
            <span className="font-medium ml-auto inline-flex items-center gap-1.5 text-xs text-accent tabular-nums">
              <span className="animate-caret size-1.5 bg-accent" />
              streaming
            </span>
          </div>
          <div className="space-y-3.5 px-4 pb-4 pt-4">
            <Message role="user" label={false}>
              <MessageContent className="text-sm">Summarize this PDF and cite your sources.</MessageContent>
            </Message>
            <Reasoning duration={3}>Reading the document, then cross-checking two references.</Reasoning>
            <ToolCall name="read_pdf" state="success" input={{ pages: "1-12" }} output={{ tokens: 4120 }} />
            <Message label={false}>
              <MessageContent className="text-sm leading-relaxed">
                Blocks are memoized, so finished text never re-renders
                <CitationMarker index={1} source={SOURCES[0]} />
                and only the live block updates
                <CitationMarker index={2} source={SOURCES[1]} />
                <span className="animate-caret ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-accent" />
              </MessageContent>
            </Message>
            <PromptComposer
              onSubmit={() => {}}
              placeholder="Ask a follow-up…"
              toolbar={<ModelPicker models={MODELS} defaultValue="sonnet" />}
              className="shadow-none"
            />
          </div>
        </div>

        {/* floating satellites */}
        <div className={`${panel} animate-float absolute -right-[2%] top-[-2%] hidden w-48 p-3 [border-radius:calc(var(--radius)+2px)] md:block`} style={z(130)}>
          <p className="font-medium mb-2 text-xs text-muted-foreground">Sources</p>
          <Sources sources={SOURCES} />
        </div>

        <div className={`${panel} absolute -left-[5%] bottom-[8%] hidden w-56 p-3.5 [border-radius:calc(var(--radius)+2px)] md:block`} style={z(160)}>
          <p className="font-medium mb-3 text-xs text-muted-foreground">Plan</p>
          <Plan
            steps={[
              { id: "1", title: "Read the document", state: "done" },
              { id: "2", title: "Cross-check sources", state: "active" },
              { id: "3", title: "Write summary", state: "pending" },
            ]}
          />
        </div>

        <div className={`${panel} animate-float absolute -right-[4%] bottom-[2%] hidden w-64 p-3 [animation-delay:-3s] [border-radius:calc(var(--radius)+2px)] md:block`} style={z(100)}>
          <p className="font-medium mb-2 text-xs text-muted-foreground">Trace</p>
          <Trace
            className="border-0"
            events={[
              { id: "a", kind: "agent", name: "run", start: 0, duration: 4200 },
              { id: "b", kind: "tool", name: "read_pdf", start: 200, duration: 900 },
              { id: "c", kind: "llm", name: "claude", start: 1200, duration: 2600 },
            ]}
          />
        </div>

        <div className={`${panel} absolute left-[34%] top-[-6%] hidden px-2 py-1 [border-radius:calc(var(--radius)+8px)] md:block`} style={z(90)}>
          <Feedback />
        </div>
      </div>
    </div>
  );
}

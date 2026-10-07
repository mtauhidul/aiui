"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { CitationMarker, type Source } from "./citations";

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
};

/** Turns "[1]" in text into <citation index="1"> elements. */
function remarkCitations() {
  const walk = (node: MdNode) => {
    if (!node.children || node.type === "link") return;
    const next: MdNode[] = [];
    for (const child of node.children) {
      if (child.type !== "text" || !child.value) {
        walk(child);
        next.push(child);
        continue;
      }
      const parts = child.value.split(/\[(\d{1,3})\]/);
      parts.forEach((part, i) => {
        if (i % 2 === 0) {
          if (part) next.push({ type: "text", value: part });
        } else {
          next.push({
            type: "citation",
            data: { hName: "citation", hProperties: { index: part } },
          });
        }
      });
    }
    node.children = next;
  };
  return (tree: MdNode) => walk(tree);
}

const baseComponents = {
  code({ className, children, ...props }: React.ComponentProps<"code">) {
    const lang = /language-(\w+)/.exec(className ?? "")?.[1];
    const text = String(children).replace(/\n$/, "");
    if (!lang && !text.includes("\n")) {
      return (
        <code
          className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <CodeBlock code={text} lang={lang} className="my-3" />;
  },
  pre: ({ children }: React.ComponentProps<"pre">) => <>{children}</>,
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="underline underline-offset-4 decoration-border hover:decoration-foreground"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
};

const Block = React.memo(function Block({
  source,
  sources,
}: {
  source: string;
  sources?: Source[];
}) {
  const components = React.useMemo(
    () => ({
      ...baseComponents,
      citation: ({ index }: { index?: string }) => {
        const n = Number(index);
        const src = sources?.[n - 1];
        return src ? <CitationMarker index={n} source={src} /> : <>[{index}]</>;
      },
    }),
    [sources],
  );
  return (
    <ReactMarkdown
      remarkPlugins={sources ? [remarkGfm, remarkCitations] : [remarkGfm]}
      components={components as never}
    >
      {source}
    </ReactMarkdown>
  );
});

/**
 * Splits markdown into top-level blocks and memoizes each one, so only the
 * block currently being streamed re-renders (no flicker, no re-highlighting).
 */
export function StreamingMarkdown({
  children,
  sources,
  streaming = false,
  className,
}: {
  children: string;
  /** When provided, "[n]" in the text renders as a citation marker for sources[n - 1]. */
  sources?: Source[];
  /** Shows a caret after the last block while text is still arriving. */
  streaming?: boolean;
  className?: string;
}) {
  const blocks = React.useMemo(
    () => marked.lexer(children).map((t) => t.raw),
    [children],
  );
  return (
    <div
      className={cn(
        "space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_table]:w-full [&_th]:text-left [&_td]:border-t [&_td]:py-1.5",
        streaming &&
          "[&>:last-child]:after:ml-1 [&>:last-child]:after:inline-block [&>:last-child]:after:h-[1.05em] [&>:last-child]:after:w-[2px] [&>:last-child]:after:translate-y-[3px] [&>:last-child]:after:bg-foreground [&>:last-child]:after:content-[''] [&>:last-child]:after:animate-pulse motion-reduce:[&>:last-child]:after:animate-none",
        className,
      )}
      aria-busy={streaming || undefined}
    >
      {blocks.map((raw, i) => (
        <Block key={i} source={raw} sources={sources} />
      ))}
    </div>
  );
}

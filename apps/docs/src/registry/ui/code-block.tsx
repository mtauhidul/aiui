"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function CodeBlock({
  code,
  lang = "text",
  className,
}: {
  code: string;
  lang?: string;
  className?: string;
}) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    import("shiki").then(({ codeToHtml }) =>
      codeToHtml(code, {
        lang,
        themes: { light: "github-light-high-contrast", dark: "github-dark-default" },
        defaultColor: false,
      })
        .catch(() => null)
        .then((out) => !cancelled && setHtml(out)),
    );
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded border bg-muted/40 text-[13px]",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between border-b px-3">
        <span className="font-mono text-xs text-muted-foreground">{lang}</span>
        <Button variant="ghost" size="sm" onClick={copy} className="font-mono text-xs">
          {copied ? (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 8.5 3.5 3.5L13 4.5" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden><rect x="5.5" y="5.5" width="8" height="8" rx="1" /><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></svg>
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
        <span role="status" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
      </div>
      {html ? (
        <div
          className="overflow-x-auto p-3 font-mono [&_.shiki]:!bg-transparent [&_.shiki_span]:text-[var(--shiki-light)] dark:[&_.shiki_span]:text-[var(--shiki-dark)]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-3 font-mono">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

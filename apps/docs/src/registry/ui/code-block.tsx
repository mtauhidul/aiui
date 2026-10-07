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
        themes: { light: "github-light", dark: "github-dark-default" },
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
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-muted/40 text-[13px]",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between border-b px-3">
        <span className="font-mono text-xs text-muted-foreground">{lang}</span>
        <Button variant="ghost" size="sm" onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </Button>
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

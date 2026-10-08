"use client";

import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";

export type Source = {
  title: string;
  url: string;
  snippet?: string;
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Inline numbered marker, e.g. [1], with a hover preview of the source. */
export function CitationMarker({
  index,
  source,
}: {
  index: number;
  source: Source;
}) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={source.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Source ${index}: ${source.title}`}
        className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-sm border bg-muted/60 px-1 align-middle font-mono text-[10px] text-muted-foreground no-underline transition-colors hover:border-transparent hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {index}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup className="z-50 w-72 rounded border bg-background p-3 text-sm shadow-lg transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
            <div className="font-mono text-[11px] text-muted-foreground">{hostname(source.url)}</div>
            <div className="mt-0.5 font-medium leading-snug">{source.title}</div>
            {source.snippet && (
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {source.snippet}
              </p>
            )}
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

/** Footer list of all sources used in a response. */
export function Sources({
  sources,
  className,
}: {
  sources: Source[];
  className?: string;
}) {
  if (!sources.length) return null;
  return (
    <ol className={cn("flex flex-wrap gap-2", className)} aria-label="Sources">
      {sources.map((s, i) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-mono text-foreground">{i + 1}</span>
            <span className="max-w-40 truncate font-mono">{hostname(s.url)}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

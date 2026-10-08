import { cn } from "@/lib/utils";

/** Shown between sending a message and the first token. For the reasoning text itself, see Reasoning. */
export function Thinking({ label = "Thinking", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center gap-2 font-mono text-xs text-muted-foreground", className)}>
      <span aria-hidden className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-pulse bg-muted-foreground motion-reduce:animate-none"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span>{label}…</span>
    </div>
  );
}

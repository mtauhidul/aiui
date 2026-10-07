import Link from "next/link";
import { docs } from "@/content/components";

export function ComponentIndex() {
  const fill = (cols: number) => (cols - (docs.length % cols)) % cols;
  return (
    <ul className="grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((d, i) => (
        <li key={d.slug} className="bg-surface/70">
          <Link
            href={`/docs/${d.slug}`}
            className="group flex h-full flex-col gap-3 p-5 outline-none transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{d.group}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-3xl leading-none tracking-tight">{d.title}</span>
              <span aria-hidden className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">→</span>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
          </Link>
        </li>
      ))}
      {/* Empty cells keep the 1px divider grid from showing as a solid block. */}
      {Array.from({ length: fill(2) }, (_, i) => (
        <li key={`s${i}`} aria-hidden className="hidden bg-surface/40 sm:block lg:hidden" />
      ))}
      {Array.from({ length: fill(3) }, (_, i) => (
        <li key={`l${i}`} aria-hidden className="hidden bg-surface/40 lg:block" />
      ))}
    </ul>
  );
}

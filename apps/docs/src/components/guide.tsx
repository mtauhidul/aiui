import Link from "next/link";
import { guides } from "@/content/guides";

export const h2 = "heading text-foreground";
export const p = "max-w-2xl text-[16px] leading-[1.7] text-muted-foreground";
export const code = "rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.88em] text-foreground";

/** Shared frame for the guide pages: title, description and previous/next links. */
export function Guide({ slug, children }: { slug: string; children: React.ReactNode }) {
  const index = guides.findIndex((g) => g.slug === slug);
  const guide = guides[index];
  const prev = guides[index - 1];
  const next = guides[index + 1];
  return (
    <article className="space-y-14">
      <header className="space-y-5">
        <p className="text-[15px] text-faint">guides</p>
        <h1 className="display text-foreground">{guide.title}</h1>
        <p className="max-w-2xl text-[19px] leading-[1.6] text-muted-foreground">{guide.description}</p>
      </header>
      {children}
      <nav aria-label="Pagination" className="grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2">
        {[prev && { g: prev, label: "previous" }, next && { g: next, label: "next" }].map((x, i) =>
          x ? (
            <Link
              key={x.g.slug}
              href={`/docs/${x.g.slug}`}
              rel={i === 0 ? "prev" : "next"}
              className={`rounded-lg border p-5 outline-none transition-colors hover:border-white/30 focus-visible:ring-2 focus-visible:ring-ring ${i === 1 ? "sm:text-right" : ""}`}
            >
              <div className="text-[14px] text-faint">{x.label}</div>
              <div className="mt-1 text-[19px] text-foreground">{x.g.title}</div>
            </Link>
          ) : (
            <div key={i} className="hidden sm:block" />
          ),
        )}
      </nav>
    </article>
  );
}

/** A horizontally scrollable table. Focusable so keyboard users can scroll it on narrow screens. */
export function TableScroll({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {children}
    </div>
  );
}

import Link from "next/link";
import { Wordmark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t">
      <div aria-hidden className="bg-grid mask-fade-y absolute inset-0 -z-10 opacity-60" />
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark className="text-xl" />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Open source UI for AI applications, built on Base UI and Tailwind. Copy it, own it.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
            <Link href="/docs/button" className="text-muted-foreground transition-colors hover:text-foreground">Components</Link>
            <a href="https://github.com/mtauhidul/aiui" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
            <a href="https://base-ui.com" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">Base UI</a>
            <a href="https://ui.shadcn.com/docs/registry" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">shadcn registry</a>
          </nav>
        </div>
      </div>
      <div aria-hidden className="select-none overflow-hidden whitespace-nowrap pt-10 text-center font-display text-[clamp(7rem,26vw,22rem)] leading-[0.8] tracking-tighter text-outline">
        aiui
      </div>
    </footer>
  );
}

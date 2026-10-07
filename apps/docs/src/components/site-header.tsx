import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./brand";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-30 px-3">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center gap-1 border bg-background/75 pl-2 pr-1.5 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl [border-radius:calc(var(--radius)+6px)]">
        <MobileNav />
        <Link href="/" className="rounded-md px-1.5 py-1 text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="aiui home">
          <Wordmark />
        </Link>
        <nav className="ml-auto flex items-center gap-0.5 text-[13px]" aria-label="Primary">
          <Link href="/docs/button" className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Components</Link>
          <a href="https://github.com/mtauhidul/aiui" target="_blank" rel="noreferrer" className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">GitHub</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

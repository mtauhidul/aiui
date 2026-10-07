import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-6">
        <MobileNav />
        <Link href="/" className="text-lg font-semibold tracking-tight">aiui</Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/docs/button" className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground">Components</Link>
          <a href="https://github.com/mtauhidul/aiui" target="_blank" rel="noreferrer" className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

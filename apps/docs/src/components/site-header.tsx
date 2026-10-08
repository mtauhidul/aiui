import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./brand";

const link = "rounded-md px-3 py-1.5 text-[16px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 h-[61px] border-b border-white/[0.1] bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-[1240px] items-center gap-2 px-5 sm:px-8">
        <MobileNav />
        <Link href="/" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="turn home">
          <Wordmark />
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
          <Link href="/docs/getting-started" className={`${link} max-sm:hidden`}>docs</Link>
          <Link href="/docs/button" className={`${link} max-sm:hidden`}>components</Link>
          <a href="https://github.com/mtauhidul/turnui" target="_blank" rel="noreferrer" className={link}>github</a>
        </nav>
      </div>
    </header>
  );
}

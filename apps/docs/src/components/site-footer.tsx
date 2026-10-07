import Link from "next/link";
import { Wordmark } from "./brand";

const link = "text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.12]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            open source ui for ai applications, built on base ui and tailwind.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-20 gap-y-3 text-[15px]">
          <Link href="/docs/getting-started" className={link}>getting started</Link>
          <Link href="/docs/button" className={link}>components</Link>
          <a href="https://github.com/mtauhidul/aiui" target="_blank" rel="noreferrer" className={link}>github</a>
          <a href="https://base-ui.com" target="_blank" rel="noreferrer" className={link}>base ui</a>
          <a href="https://ui.shadcn.com/docs/registry" target="_blank" rel="noreferrer" className={link}>shadcn registry</a>
        </nav>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { docs, groups } from "@/content/components";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
      <aside className="sticky top-10 hidden h-fit w-52 shrink-0 md:block">
        <Link href="/" className="mb-6 block text-lg font-semibold tracking-tight">aiui</Link>
        <nav className="space-y-5 text-sm">
          {groups.map((g) => (
            <div key={g}>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">{g}</div>
              <ul className="space-y-0.5">
                {docs.filter((d) => d.group === g).map((d) => (
                  <li key={d.slug}>
                    <Link href={`/docs/${d.slug}`} className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{d.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

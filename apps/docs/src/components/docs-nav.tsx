"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docs, groups } from "@/content/components";

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-7 text-sm" aria-label="Components">
      {groups.map((g) => (
        <div key={g}>
          <div className="font-medium mb-2 px-3 text-xs text-muted-foreground">{g}</div>
          <ul className="space-y-px border-l">
            {docs.filter((d) => d.group === g).map((d) => {
              const active = pathname === `/docs/${d.slug}`;
              return (
                <li key={d.slug} className="-ml-px">
                  <Link
                    href={`/docs/${d.slug}`}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block border-l px-3 py-1.5 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      active ? "border-accent font-medium text-foreground" : "border-transparent text-muted-foreground",
                    )}
                  >
                    {d.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

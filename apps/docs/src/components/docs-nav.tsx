"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docs, groups } from "@/content/components";

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-8" aria-label="Components">
      {groups.map((g) => (
        <div key={g}>
          <div className="mb-2.5 px-3 text-[14px] text-faint">{g.toLowerCase()}</div>
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
                      "block border-l px-3 py-1.5 text-[16px] outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground",
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

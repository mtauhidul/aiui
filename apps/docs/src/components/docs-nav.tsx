"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docs, groups } from "@/content/components";

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-5 text-sm" aria-label="Components">
      {groups.map((g) => (
        <div key={g}>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">{g}</div>
          <ul className="space-y-0.5">
            {docs.filter((d) => d.group === g).map((d) => {
              const active = pathname === `/docs/${d.slug}`;
              return (
                <li key={d.slug}>
                  <Link
                    href={`/docs/${d.slug}`}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground",
                      active ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
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

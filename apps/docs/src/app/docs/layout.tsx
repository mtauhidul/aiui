import { DocsNav } from "@/components/docs-nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 md:block">
        <DocsNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

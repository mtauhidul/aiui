import { DocsNav } from "@/components/docs-nav";
import { SiteFooter } from "@/components/site-footer";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <div className="relative">
        <div aria-hidden className="bg-grid mask-fade-y pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] opacity-70" />
        <div className="mx-auto flex w-full max-w-6xl gap-14 px-6 pb-16 pt-14">
          <aside className="sticky top-24 hidden h-fit w-52 shrink-0 md:block">
            <DocsNav />
          </aside>
          <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
            {children}
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

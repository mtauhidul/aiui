import { DocsNav } from "@/components/docs-nav";
import { SiteFooter } from "@/components/site-footer";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-[1240px] gap-16 px-5 pb-24 pt-14 sm:px-8">
        <aside className="sticky top-24 hidden h-fit w-52 shrink-0 md:block">
          <DocsNav />
        </aside>
        <main id="main" tabIndex={-1} className="min-w-0 max-w-[820px] flex-1 outline-none">
          {children}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}

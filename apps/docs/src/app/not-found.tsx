import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-5 py-24 outline-none sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">404</p>
      <h1 className="display mt-3">page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">that page does not exist or has moved.</p>
      <div className="mt-8 flex items-center gap-6">
        <Link href="/docs/button" className="rounded-sm bg-primary px-4 py-2.5 text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          browse components
        </Link>
        <Link href="/" className="rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
          back home
        </Link>
      </div>
    </main>
  );
}

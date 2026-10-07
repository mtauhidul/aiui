import { Suspense } from "react";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { docs } from "@/content/components";
import { CodeBlock } from "@/registry/ui/code-block";
import Link from "next/link";
import { Eyebrow, Frame } from "@/components/kit";

import { REGISTRY_URL as REGISTRY } from "@/lib/registry-url";

async function getSource(file: string) {
  "use cache";
  return readFile(path.join(process.cwd(), "src/registry/ui", file), "utf8");
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export default function ComponentPage({ params }: PageProps<"/docs/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ComponentContent params={params} />
    </Suspense>
  );
}

async function ComponentContent({ params }: { params: PageProps<"/docs/[slug]">["params"] }) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  const source = await getSource(doc.file);
  const Demo = doc.demo;

  const index = docs.findIndex((d) => d.slug === doc.slug);
  const prev = docs[index - 1];
  const next = docs[index + 1];

  const h2 = "flex items-baseline gap-3 font-display text-3xl tracking-tight";
  const num = "font-mono text-[11px] tracking-[0.18em] text-accent";

  return (
    <article className="space-y-14">
      <header className="space-y-5">
        <Eyebrow>Components / {doc.group}</Eyebrow>
        <h1 className="font-display text-5xl leading-none tracking-tight sm:text-7xl">{doc.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{doc.description}</p>
      </header>

      <Frame caption={<><span>Preview</span><span>{doc.slug}</span></>} bodyClassName="bg-dots p-6 sm:p-10">
        <Demo />
      </Frame>

      <section className="space-y-4">
        <h2 className={h2}><span aria-hidden className={num}>01</span>Install</h2>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY}/r/${doc.slug}.json`} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}><span aria-hidden className={num}>02</span>Props</h2>
        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr><th className="px-4 py-3 font-medium">Prop</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Default</th><th className="px-4 py-3 font-medium">Description</th></tr>
            </thead>
            <tbody>
              {doc.props.map((p) => (
                <tr key={p.name} className="border-t align-top">
                  <td className="px-4 py-3 font-mono text-xs text-accent">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={h2}><span aria-hidden className={num}>03</span>Accessibility</h2>
        <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
          {doc.a11y.map((note) => (
            <li key={note} className="flex gap-3">
              <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-accent" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={h2}><span aria-hidden className={num}>04</span>Source</h2>
        <CodeBlock lang="tsx" code={source} />
      </section>

      <nav aria-label="Pagination" className="grid grid-cols-1 gap-px border bg-border sm:grid-cols-2">
        {[prev && { d: prev, label: "Previous" }, next && { d: next, label: "Next" }].map((x, i) =>
          x ? (
            <Link
              key={x.d.slug}
              href={`/docs/${x.d.slug}`}
              rel={i === 0 ? "prev" : "next"}
              className={`group bg-surface/70 p-5 outline-none transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${i === 1 ? "sm:text-right" : ""}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{x.label}</div>
              <div className="mt-1 font-display text-2xl tracking-tight">{x.d.title}</div>
            </Link>
          ) : (
            <div key={i} className="hidden bg-surface/40 sm:block" />
          ),
        )}
      </nav>
    </article>
  );
}

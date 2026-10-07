import { Suspense } from "react";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { docs } from "@/content/components";
import { CodeBlock } from "@/registry/ui/code-block";
import Link from "next/link";
import { Panel } from "@/components/kit";
import { TableScroll } from "@/components/guide";

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

  const h2 = "heading text-foreground";

  return (
    <article className="space-y-16">
      <header className="space-y-5">
        <p className="text-[15px] text-faint">components / {doc.group.toLowerCase()}</p>
        <h1 className="display text-foreground">{doc.title}</h1>
        <p className="max-w-2xl text-[19px] leading-[1.6] text-muted-foreground">{doc.description}</p>
      </header>

      <Panel caption={<><span>preview</span><span className="font-mono text-[12px]">{doc.slug}</span></>} bodyClassName="p-6 sm:p-10">
        <Demo />
      </Panel>

      <section className="space-y-4">
        <h2 className={h2}>install</h2>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY}/r/${doc.slug}.json`} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>props</h2>
        <TableScroll label={`${doc.title} props`}>
          <table className="w-full text-[15px]">
            <thead className="border-b bg-white/[0.03] text-left text-[14px] text-muted-foreground">
              <tr><th className="px-4 py-3 font-medium">prop</th><th className="px-4 py-3 font-medium">type</th><th className="px-4 py-3 font-medium">default</th><th className="px-4 py-3 font-medium">description</th></tr>
            </thead>
            <tbody>
              {doc.props.map((p) => (
                <tr key={p.name} className="border-t align-top">
                  <td className="px-4 py-3 font-mono text-[13px] text-foreground">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{p.default ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>accessibility</h2>
        <ul className="space-y-3 text-[16px] leading-relaxed text-muted-foreground">
          {doc.a11y.map((note) => (
            <li key={note} className="flex gap-3">
              <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-faint" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>source</h2>
        <CodeBlock lang="tsx" code={source} />
      </section>

      <nav aria-label="Pagination" className="grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2">
        {[prev && { d: prev, label: "previous" }, next && { d: next, label: "next" }].map((x, i) =>
          x ? (
            <Link
              key={x.d.slug}
              href={`/docs/${x.d.slug}`}
              rel={i === 0 ? "prev" : "next"}
              className={`group rounded-lg border p-5 outline-none transition-colors hover:border-white/30 focus-visible:ring-2 focus-visible:ring-ring ${i === 1 ? "sm:text-right" : ""}`}
            >
              <div className="text-[14px] text-faint">{x.label}</div>
              <div className="mt-1 text-[19px] text-foreground">{x.d.title}</div>
            </Link>
          ) : (
            <div key={i} className="hidden sm:block" />
          ),
        )}
      </nav>
    </article>
  );
}

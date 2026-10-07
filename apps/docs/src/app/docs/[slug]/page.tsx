import { Suspense } from "react";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { docs } from "@/content/components";
import { CodeBlock } from "@/registry/ui/code-block";

const REGISTRY = process.env.NEXT_PUBLIC_REGISTRY_URL ?? "http://localhost:3100";

async function getSource(file: string) {
  "use cache";
  return readFile(path.join(process.cwd(), "src/registry/ui", file), "utf8");
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

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
        <p className="text-muted-foreground">{doc.description}</p>
      </header>

      <div className="rounded-xl border p-6"><Demo /></div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Install</h2>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY}/r/${doc.slug}.json`} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Props</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr><th className="px-3 py-2 font-medium">Prop</th><th className="px-3 py-2 font-medium">Type</th><th className="px-3 py-2 font-medium">Default</th><th className="px-3 py-2 font-medium">Description</th></tr>
            </thead>
            <tbody>
              {doc.props.map((p) => (
                <tr key={p.name} className="border-t align-top">
                  <td className="px-3 py-2 font-mono text-xs">{p.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Source</h2>
        <CodeBlock lang="tsx" code={source} />
      </section>
    </article>
  );
}

import { Eyebrow } from "@/components/kit";
import { CopyCommand } from "@/components/copy-command";
import { REGISTRY_URL } from "@/lib/registry-url";

const steps = [
  { n: "01", title: "Add a component", body: "Pull the source into your project with the shadcn CLI. Dependencies resolve automatically." },
  { n: "02", title: "Compose", body: "Plain props, no provider. Wire it to the Vercel AI SDK, LangChain or raw SSE." },
  { n: "03", title: "Make it yours", body: "It is your file now. Change tokens, markup and behavior without forking anything." },
];

export function InstallSteps() {
  return (
    <div className="grid grid-cols-1 gap-px border bg-border md:grid-cols-3">
      {steps.map((s) => (
        <div key={s.n} className="bg-surface/70 p-6">
          <Eyebrow>{s.n}</Eyebrow>
          <h3 className="mt-4 text-lg font-medium tracking-tight">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
      ))}
      <div className="min-w-0 bg-surface/70 p-4 md:col-span-3">
        <CopyCommand command={`npx shadcn@latest add ${REGISTRY_URL}/r/prompt-composer.json`} />
      </div>
    </div>
  );
}

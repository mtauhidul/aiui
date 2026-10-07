import Link from "next/link";
import { ChatDemo } from "@/components/chat-demo";
import { AgentDemo } from "@/components/agent-demo";
import { CodeBlock } from "@/registry/ui/code-block";
import { docs } from "@/content/components";

const features = [
  { title: "Built for streaming", body: "Block-memoized markdown and highlighted code that never flicker while tokens arrive." },
  { title: "Agent-native", body: "Tool calls, reasoning, plans, traces and approvals as first-class components." },
  { title: "Own your code", body: "Install into your project with the shadcn CLI and edit every line." },
  { title: "Accessible by default", body: "Base UI primitives, keyboard-first input, live regions for streamed content." },
  { title: "Backend-agnostic", body: "Plain props. Works with the Vercel AI SDK, LangChain or raw SSE." },
  { title: "Minimal and modern", body: "A restrained neutral palette, one accent, light and dark themes." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-24 px-6 py-20">
      <section className="space-y-6 text-center">
        <h1 className="mx-auto max-w-2xl text-balance text-5xl font-semibold tracking-tight">
          UI components for AI applications
        </h1>
        <p className="mx-auto max-w-xl text-balance text-lg text-muted-foreground">
          Minimal, accessible building blocks for chat, agents and tool use. Copy them into your project and make them yours.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/docs/button" className="inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
            Browse components
          </Link>
          <a href="https://github.com/mtauhidul/aiui" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-md border px-5 text-sm font-medium transition-colors hover:bg-muted">
            GitHub
          </a>
        </div>
        <div className="mx-auto max-w-md pt-2 text-left">
          <CodeBlock lang="bash" code="npx shadcn@latest add <registry-url>/r/streaming-markdown.json" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl"><ChatDemo /></section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border p-5">
            <h3 className="font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Agents, not just chat</h2>
        <AgentDemo />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <Link key={d.slug} href={`/docs/${d.slug}`} className="rounded-xl border p-4 transition-colors hover:bg-muted">
              <div className="font-medium">{d.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

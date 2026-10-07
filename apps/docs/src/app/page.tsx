import Link from "next/link";
import { ChatDemo } from "@/components/chat-demo";
import { AgentDemo } from "@/components/agent-demo";
import { Backdrop, Eyebrow, Frame, Rule } from "@/components/kit";
import { CopyCommand } from "@/components/copy-command";
import { HeroBackground } from "@/components/landing/hero-background";
import { HeroVisual } from "@/components/landing/hero-visual";
import { WorksWith } from "@/components/landing/works-with";
import { Bento } from "@/components/landing/bento";
import { Stats } from "@/components/landing/stats";
import { InstallSteps } from "@/components/landing/install-steps";
import { ComponentIndex } from "@/components/landing/component-index";
import { SiteFooter } from "@/components/site-footer";
import { REGISTRY_URL } from "@/lib/registry-url";
import { docs } from "@/content/components";

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="mb-10 max-w-2xl space-y-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">{title}</h2>
      {children && <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{children}</p>}
    </header>
  );
}

const callouts = [
  ["Block-memoized markdown", "Only the live block re-renders."],
  ["Reasoning and tool calls", "Collapsible, with live status."],
  ["Citations with previews", "Hover or focus to peek at a source."],
  ["Stop, send, slash, attach", "One composer, fully keyboard driven."],
];

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <HeroBackground />
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1fr_1.05fr] lg:pb-28 lg:pt-28">
            <div className="animate-rise min-w-0 space-y-8">
              <Eyebrow>Open source · Base UI · shadcn registry</Eyebrow>
              <h1 className="font-display text-[clamp(2.75rem,6.4vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                Interfaces for <em className="text-accent">intelligence</em>.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Streaming-first components for chat, agents and tool use. Minimal, accessible and yours to edit: copied into your codebase, never locked inside a package.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/docs/button"
                  className="inline-flex h-11 items-center gap-2 bg-accent px-6 text-sm font-medium text-accent-foreground outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [border-radius:calc(var(--radius)+2px)]"
                >
                  Browse components <span aria-hidden>→</span>
                </Link>
                <a
                  href="https://github.com/mtauhidul/aiui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center border bg-surface/60 px-6 text-sm font-medium outline-none backdrop-blur transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [border-radius:calc(var(--radius)+2px)]"
                >
                  View on GitHub
                </a>
              </div>
              <CopyCommand command={`npx shadcn@latest add ${REGISTRY_URL}/r/streaming-markdown.json`} className="max-w-xl [border-radius:calc(var(--radius)+2px)]" />
              <p className="font-medium text-xs text-muted-foreground">
                {docs.length} components · light + dark · AA contrast
              </p>
            </div>
            <HeroVisual />
          </div>
        </section>

        <WorksWith />

        <div className="mx-auto max-w-6xl space-y-28 px-6 py-24 sm:space-y-36 sm:py-32">
          {/* Live demo */}
          <section aria-labelledby="live" className="relative">
            <Backdrop variant="dots" />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
              <div>
                <SectionHead eyebrow="Live demo" title={<span id="live">The real thing, <em className="text-muted-foreground">running</em>.</span>}>
                  Not a mockup. This is the same code you install, wired to a fake stream so you can poke at it.
                </SectionHead>
                <ol className="space-y-0 border-t">
                  {callouts.map(([t, d], i) => (
                    <li key={t} className="flex gap-4 border-b py-4">
                      <span className="font-medium text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="text-sm font-medium">{t}</div>
                        <div className="text-sm text-muted-foreground">{d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <Frame caption={<><span>chat / demo</span><span>fake stream</span></>} className="shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]">
                <ChatDemo />
              </Frame>
            </div>
          </section>

          {/* Bento */}
          <section aria-labelledby="features">
            <SectionHead eyebrow="What you get" title={<span id="features">Everything an AI product <em className="text-muted-foreground">actually</em> needs.</span>}>
              Opinionated where it matters, unopinionated about your stack.
            </SectionHead>
            <Bento />
          </section>

          {/* Agents */}
          <section aria-labelledby="agents" className="relative">
            <Backdrop variant="grid" />
            <SectionHead eyebrow="Agents" title={<span id="agents">Built for <em className="text-muted-foreground">agents</em>, not just chat.</span>}>
              Plans, approvals, traces and artifacts as first-class building blocks.
            </SectionHead>
            <Frame caption={<><span>agent / run #0042</span><span>awaiting approval</span></>}>
              <AgentDemo />
            </Frame>
          </section>
        </div>

        <Stats />

        <div className="mx-auto max-w-6xl space-y-28 px-6 py-24 sm:space-y-36 sm:py-32">
          {/* Install */}
          <section aria-labelledby="start">
            <SectionHead eyebrow="Get started" title={<span id="start">Three steps. <em className="text-muted-foreground">Zero</em> lock-in.</span>} />
            <InstallSteps />
          </section>

          {/* Index */}
          <section aria-labelledby="index">
            <SectionHead eyebrow="Index" title={<span id="index">All {docs.length} components.</span>} />
            <ComponentIndex />
          </section>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <Rule />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

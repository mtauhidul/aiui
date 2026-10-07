import Link from "next/link";
import * as React from "react";
import { Panel, Statement } from "@/components/kit";
import { CopyCommand } from "@/components/copy-command";
import { Showcase } from "@/components/landing/showcase";
import { SiteFooter } from "@/components/site-footer";
import { REGISTRY_URL } from "@/lib/registry-url";
import { docs } from "@/content/components";
import { Reasoning } from "@/registry/ui/reasoning";
import { ToolCall } from "@/registry/ui/tool-call";
import { CitationMarker, Sources, type Source } from "@/registry/ui/citations";
import { Message, MessageContent } from "@/registry/ui/message";
import { Plan } from "@/registry/ui/plan";
import { Trace } from "@/registry/ui/trace";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { Attachment } from "@/registry/ui/attachment";
import { CommandMenuStill } from "@/components/landing/stills";
import { Feedback } from "@/registry/ui/feedback";

const wrap = "mx-auto w-full max-w-[1240px] px-5 sm:px-8";
const section = `${wrap} py-24 sm:py-32`;

const SOURCES: Source[] = [
  { title: "Base UI documentation", url: "https://base-ui.com", snippet: "Unstyled, accessible React components." },
  { title: "Tailwind CSS", url: "https://tailwindcss.com", snippet: "A utility-first CSS framework." },
];

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="heading text-foreground">{title}</h3>
      <p className="mt-2 max-w-[460px] text-muted-foreground">{children}</p>
    </div>
  );
}

/** Real components, shown static: not focusable, hidden from assistive tech (the live versions are above). */
function Still({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden inert className={className}>
      {children}
    </div>
  );
}

const cream =
  "inline-flex h-11 items-center rounded-md bg-accent px-5 text-[17px] font-medium text-accent-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Hero */}
        <section className={`${wrap} pt-20 sm:pt-28`}>
          <div className="max-w-[760px]">
            <Statement
              as="h1"
              claim="interfaces for intelligence"
              rest="streaming-first components for chat, agents and tool use"
            />
            <p className="mt-7 max-w-[620px] text-[19px] leading-[1.6] text-muted-foreground">
              open source and shadcn-compatible. copy the code into your project and own every line.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/docs/button" className={cream}>
                browse components
              </Link>
              <a
                href="https://github.com/mtauhidul/aiui"
                target="_blank"
                rel="noreferrer"
                className="rounded-md text-[17px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                view on github →
              </a>
            </div>
          </div>
        </section>

        {/* The product, as the visual */}
        <section aria-label="Live demo" className={`${wrap} mt-16 sm:mt-20`}>
          <Showcase />
        </section>

        <p className={`${wrap} mt-10 text-[15px] leading-relaxed text-faint`}>
          works with the vercel ai sdk, langchain, openai, anthropic, next.js, tailwind and base ui
        </p>

        {/* Conversation */}
        <section aria-labelledby="conversation" className={section}>
          <Statement id="conversation" claim="every reply streams smoothly" rest="markdown is split into blocks, so only the live block re-renders" className="max-w-[820px]" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
            <div>
              <Panel bodyClassName="p-6">
                <Still className="space-y-3.5">
                  <Message role="user" label={false}>
                    <MessageContent className="text-[15px]">Summarize this PDF and cite your sources.</MessageContent>
                  </Message>
                  <Reasoning duration={3}>Reading the document, then cross-checking two references.</Reasoning>
                  <ToolCall name="read_pdf" state="success" input={{ pages: "1-12" }} output={{ tokens: 4120 }} />
                  <Message label={false}>
                    <MessageContent className="text-[15px] leading-relaxed">
                      Finished blocks never re-render
                      <CitationMarker index={1} source={SOURCES[0]} />, and only the live block updates
                      <CitationMarker index={2} source={SOURCES[1]} />.
                    </MessageContent>
                  </Message>
                  <Sources sources={SOURCES} />
                </Still>
              </Panel>
              <div className="mt-6">
                <Feature title="reasoning, tool calls and citations">
                  collapsible thinking, live tool status and numbered sources with previews, all keyboard reachable.
                </Feature>
              </div>
            </div>
            <div>
              <Panel bodyClassName="p-6">
                <Still className="space-y-6">
                  <Plan
                    steps={[
                      { id: "1", title: "Read the document", state: "done" },
                      { id: "2", title: "Cross-check sources", state: "active", detail: "2 of 3 checked" },
                      { id: "3", title: "Write the summary", state: "pending" },
                    ]}
                  />
                  <Trace
                    events={[
                      { id: "a", kind: "agent", name: "agent.run", start: 0, duration: 4200 },
                      { id: "b", kind: "retrieval", name: "search_docs", start: 150, duration: 640 },
                      { id: "c", kind: "llm", name: "claude", start: 850, duration: 2400 },
                      { id: "d", kind: "tool", name: "write_file", start: 3300, duration: 600 },
                    ]}
                  />
                </Still>
              </Panel>
              <div className="mt-6">
                <Feature title="plans and traces">
                  show what an agent is doing as it happens, then how long each step took.
                </Feature>
              </div>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section aria-labelledby="agents" className={`${section} border-t border-white/[0.06]`}>
          <Statement id="agents" claim="humans stay in control" rest="approvals, artifacts and feedback are first-class" className="max-w-[820px]" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
            <div>
              <Panel bodyClassName="p-5">
                <Still>
                  <ApprovalPrompt title="Run migration on production?" description="This will modify the users table." details="ALTER TABLE users ADD COLUMN plan text;" />
                </Still>
              </Panel>
              <div className="mt-6"><Feature title="approvals">a named dialog that keeps focus where the decision was made.</Feature></div>
            </div>
            <div>
              <Panel bodyClassName="p-5">
                <Still className="flex min-h-[7.5rem] items-center">
                  <p className="text-[28px] font-[360] leading-tight tracking-[-0.02em]">hello, <span className="text-faint">world</span></p>
                </Still>
              </Panel>
              <div className="mt-6"><Feature title="artifacts">a side pane with preview and code tabs for generated work.</Feature></div>
            </div>
            <div>
              <Panel bodyClassName="p-5">
                <Still className="flex min-h-[7.5rem] flex-col justify-center gap-3">
                  <p className="text-[15px] text-muted-foreground">Was this helpful?</p>
                  <Feedback defaultValue="up" />
                </Still>
              </Panel>
              <div className="mt-6"><Feature title="feedback">thumbs with an optional follow-up, returning focus afterwards.</Feature></div>
            </div>
          </div>
        </section>

        {/* Input */}
        <section aria-labelledby="input" className={`${section} border-t border-white/[0.06]`}>
          <Statement id="input" claim="an input that does it all" rest="files, slash commands and a model picker, in one composer" className="max-w-[820px]" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
            <div>
              <Panel bodyClassName="p-6">
                <Still className="space-y-3">
                  <CommandMenuStill />
                  <div className="flex gap-2.5">
                    <Attachment item={{ name: "brief.pdf", size: 245000, status: "done", progress: 100 }} />
                    <Attachment item={{ name: "data.csv", size: 880000, status: "uploading", progress: 64 }} />
                  </div>
                </Still>
              </Panel>
              <div className="mt-6"><Feature title="slash commands and attachments">drop, paste or attach files, and type / to run a command or insert a template.</Feature></div>
            </div>
            <div className="md:pt-0">
              <div className="grid h-full grid-cols-1 content-start gap-10">
                <Feature title="one api, any backend">plain props and no provider. wire it to the vercel ai sdk, langchain or raw server-sent events.</Feature>
                <Feature title="your code, not a dependency">install with the shadcn cli and edit every line. components stay self-contained.</Feature>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section aria-labelledby="a11y" className={`${section} border-t border-white/[0.06]`}>
          <Statement id="a11y" claim="accessible by default" rest="tested with axe and by keyboard, in every state" className="max-w-[820px]" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            <Feature title="keyboard first">every control is reachable and operable without a mouse, and focus is never dropped.</Feature>
            <Feature title="screen reader aware">live regions wait for a reply to finish, and state is spoken, not just colored.</Feature>
            <Feature title="clear contrast">text meets the 4.5:1 minimum on every surface.</Feature>
            <Feature title="reduced motion">movement stops when your system asks for less.</Feature>
          </div>
        </section>

        {/* Install */}
        <section aria-labelledby="install" className={`${section} border-t border-white/[0.06]`}>
          <Statement id="install" claim="copy it into your project" rest="no package to install and nothing to fork" className="max-w-[820px]" />
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
            <Feature title="add a component">pull the source in with the shadcn cli. dependencies resolve automatically.</Feature>
            <Feature title="compose">wire it to your data with plain props. no wrappers and no context.</Feature>
            <Feature title="make it yours">it is your file now. change the markup, tokens and behavior freely.</Feature>
          </div>
          <CopyCommand command={`npx shadcn@latest add ${REGISTRY_URL}/r/prompt-composer.json`} className="mt-12 max-w-2xl" />
        </section>

        {/* Index */}
        <section aria-labelledby="index" className={`${section} border-t border-white/[0.06]`}>
          <Statement id="index" claim={`all ${docs.length} components`} className="max-w-[820px]" />
          <ul className="mt-14 border-t">
            {docs.map((d, i) => (
              <li key={d.slug} className="border-b">
                <Link
                  href={`/docs/${d.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 px-1 py-5 outline-none transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:grid-cols-[3rem_14rem_1fr_7rem_1rem]"
                >
                  <span className="text-[15px] tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[19px] text-foreground">{d.title}</span>
                  <span className="col-start-2 row-start-2 text-[15px] text-muted-foreground md:col-start-auto md:row-start-auto md:line-clamp-1">{d.description}</span>
                  <span className="hidden text-[15px] text-faint md:block">{d.group.toLowerCase()}</span>
                  <span aria-hidden className="col-start-3 row-start-1 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none md:col-start-auto md:row-start-auto">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

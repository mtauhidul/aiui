import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/registry/ui/code-block";
import { Guide, h2, p, code } from "@/components/guide";
import { guides } from "@/content/guides";
import { REGISTRY_URL } from "@/lib/registry-url";

const guide = guides[0];
export const metadata: Metadata = { title: guide.title, description: guide.description };

const firstChat = `"use client";

import { useState } from "react";
import { Message, MessageContent } from "@/components/ui/message";
import { PromptComposer } from "@/components/ui/prompt-composer";

type Turn = { role: "user" | "assistant"; text: string };

export default function Page() {
  const [turns, setTurns] = useState<Turn[]>([]);

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col p-4">
      <div role="log" aria-live="polite" aria-label="Conversation" tabIndex={0} className="flex-1 space-y-4 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {turns.map((t, i) => (
          <Message key={i} role={t.role}>
            <MessageContent>{t.text}</MessageContent>
          </Message>
        ))}
      </div>
      <PromptComposer
        onSubmit={(text) =>
          setTurns((all) => [...all, { role: "user", text }, { role: "assistant", text: "You said: " + text }])
        }
      />
    </div>
  );
}`;

export default function GettingStarted() {
  return (
    <Guide slug={guide.slug}>
      <section className="space-y-4">
        <h2 className={h2}>requirements</h2>
        <ul className={`${p} list-disc space-y-1.5 pl-5`}>
          <li>React 19 and a framework that supports it, such as Next.js or Vite.</li>
          <li>Tailwind CSS v4.</li>
          <li>
            A project set up with the shadcn CLI. If you do not have one yet, run <span className={code}>npx shadcn@latest init</span>. It creates <span className={code}>components.json</span>, the <span className={code}>cn</span> helper and the base styles.
          </li>
        </ul>
        <p className={p}>aiui is a registry, not a package. The CLI copies the source into your project and installs the small number of dependencies each component needs (Base UI, and for a few components Shiki, marked or react-markdown).</p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>1. add the theme</h2>
        <p className={p}>
          The components read eight color tokens, and one of them behaves differently from a stock shadcn theme: <span className={code}>accent</span> is the primary action color here, not a pale highlight. Install the theme to set all eight, or skip this step and define them yourself. See <Link href="/docs/theming" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">theming</Link>.
        </p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/r/theme.json`} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>2. add components</h2>
        <p className={p}>Each command also installs the components it depends on. You can pass several at once.</p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add \\
  ${REGISTRY_URL}/r/message.json \\
  ${REGISTRY_URL}/r/prompt-composer.json`} />
        <p className={p}>
          Files land in <span className={code}>components/ui</span> and <span className={code}>hooks</span>, using the aliases from your <span className={code}>components.json</span>. They are yours from that point: edit the markup, tokens and behavior freely.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>3. build a chat</h2>
        <p className={p}>A complete page with a message list and a composer. It echoes your message back, so you can see everything working before you connect a model.</p>
        <CodeBlock lang="tsx" code={firstChat} />
        <p className={p}>
          The container has <span className={code}>role=&quot;log&quot;</span> and <span className={code}>aria-live=&quot;polite&quot;</span> so screen readers announce new messages, and <span className={code}>tabIndex=&#123;0&#125;</span> so keyboard users can scroll it. Enter sends, Shift+Enter adds a line.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>next</h2>
        <ul className={`${p} list-disc space-y-1.5 pl-5`}>
          <li>
            <Link href="/docs/ai-sdk" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Connect a real model</Link> with the Vercel AI SDK.
          </li>
          <li>
            Add attachments, slash commands and a model picker: they all plug into the <Link href="/docs/prompt-composer" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Prompt Composer</Link>.
          </li>
          <li>
            Show agent work with <Link href="/docs/plan" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Plan</Link>, <Link href="/docs/tool-call" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Tool Call</Link> and <Link href="/docs/approval-prompt" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Approval Prompt</Link>.
          </li>
        </ul>
      </section>
    </Guide>
  );
}

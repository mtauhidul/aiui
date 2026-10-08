import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/registry/ui/code-block";
import { Guide, TableScroll, h2, p, code } from "@/components/guide";
import { guides } from "@/content/guides";
import { REGISTRY_URL } from "@/lib/registry-url";

const guide = guides[2];
export const metadata: Metadata = { title: guide.title, description: guide.description };

const route = `import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-5.5",
    messages: await convertToModelMessages(messages),
    tools: {
      getWeather: tool({
        description: "Get the current weather for a city",
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => ({ city, temperature: 21, unit: "C" }),
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, sendReasoning: true }),
  });
}`;

const page = `"use client";

import { useChat } from "@ai-sdk/react";
import { getToolName, isToolUIPart } from "ai";
import { Message, MessageContent } from "@/components/ui/message";
import { StreamingMarkdown } from "@/components/ui/streaming-markdown";
import { Reasoning } from "@/components/ui/reasoning";
import { ToolCall, type ToolCallState } from "@/components/ui/tool-call";
import { Thinking } from "@/components/ui/thinking";
import { ErrorNotice } from "@/components/ui/error-notice";
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom";
import { PromptComposer } from "@/components/ui/prompt-composer";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

const toolState: Record<string, ToolCallState> = {
  "input-streaming": "pending",
  "input-available": "running",
  "output-available": "success",
  "output-error": "error",
};

export default function Chat() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const ref = useAutoScroll<HTMLDivElement>(messages);

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={ref}
          role="log"
          aria-live="polite"
          aria-busy={busy}
          aria-label="Conversation"
          tabIndex={0}
          className="flex-1 space-y-6 overflow-y-auto p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.map((message, m) => (
            <Message key={message.id} role={message.role === "user" ? "user" : "assistant"}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  const live = busy && m === messages.length - 1;
                  if (part.type === "text")
                    return message.role === "user" ? (
                      part.text
                    ) : (
                      <StreamingMarkdown key={i} streaming={live && i === message.parts.length - 1}>
                        {part.text}
                      </StreamingMarkdown>
                    );
                  if (part.type === "reasoning")
                    return (
                      <Reasoning key={i} isStreaming={part.state === "streaming"}>
                        {part.text}
                      </Reasoning>
                    );
                  if (isToolUIPart(part))
                    return (
                      <ToolCall
                        key={part.toolCallId}
                        name={getToolName(part)}
                        state={toolState[part.state] ?? "pending"}
                        input={part.input}
                        output={part.output}
                        error={part.errorText}
                      />
                    );
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Thinking />}
          {error && (
            <ErrorNotice
              message={error.message}
              onRetry={() => {
                regenerate();
                ref.current?.focus(); // the notice disappears on retry; keep focus in the conversation
              }}
            />
          )}
        </div>
        <ScrollToBottom target={ref} />
      </div>
      <div className="p-4">
        <PromptComposer isStreaming={busy} onStop={stop} onSubmit={(text) => sendMessage({ text })} />
      </div>
    </div>
  );
}`;

const map = [
  ["text part", "StreamingMarkdown", "Pass streaming while this is the last part of the message being produced."],
  ["reasoning part", "Reasoning", "Open while part.state is streaming, collapses when it ends."],
  ["tool part", "ToolCall", "Map the tool state to pending, running, success or error."],
  ["status", "PromptComposer", "Pass isStreaming for the stop button. status is submitted, streaming, ready or error."],
  ["status is submitted", "Thinking", "Shown until the first token arrives."],
  ["error", "ErrorNotice", "Pass regenerate as onRetry. Move focus back into the conversation, since the notice disappears."],
];

export default function AiSdk() {
  return (
    <Guide slug={guide.slug}>
      <section className="space-y-4">
        <h2 className={h2}>setup</h2>
        <p className={p}>
          This guide uses the <a href="https://ai-sdk.dev" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">Vercel AI SDK</a> with Next.js. It was written against <span className={code}>ai</span> 7 and <span className={code}>@ai-sdk/react</span> 4; check the SDK docs if you are on another major version, since the server helpers have changed between releases. Do the <Link href="/docs/getting-started" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">getting started</Link> steps first, then add the components used below.
        </p>
        <CodeBlock lang="bash" code={`pnpm add ai @ai-sdk/react zod
npx shadcn@latest add \\
  ${REGISTRY_URL}/r/message.json \\
  ${REGISTRY_URL}/r/streaming-markdown.json \\
  ${REGISTRY_URL}/r/reasoning.json \\
  ${REGISTRY_URL}/r/tool-call.json \\
  ${REGISTRY_URL}/r/thinking.json \\
  ${REGISTRY_URL}/r/error-notice.json \\
  ${REGISTRY_URL}/r/scroll-to-bottom.json \\
  ${REGISTRY_URL}/r/prompt-composer.json \\
  ${REGISTRY_URL}/r/use-auto-scroll.json`} />
        <p className={p}>
          With the default model string the SDK talks to the Vercel AI Gateway, which needs <span className={code}>AI_GATEWAY_API_KEY</span> in <span className={code}>.env.local</span>. To use a provider directly, pass that provider&apos;s model instead of the string.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>server route</h2>
        <p className={p}>
          <span className={code}>app/api/chat/route.ts</span> receives the conversation, streams the model&apos;s answer and runs a sample tool. Reasoning is forwarded with <span className={code}>sendReasoning</span>; remove the option if your model does not produce it.
        </p>
        <CodeBlock lang="ts" code={route} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>chat page</h2>
        <p className={p}>
          <span className={code}>app/page.tsx</span> renders each message part with the matching component. <span className={code}>useChat</span> posts to <span className={code}>/api/chat</span> by default.
        </p>
        <CodeBlock lang="tsx" code={page} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>how it maps</h2>
        <TableScroll label="How SDK parts map to components">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-white/[0.03] text-left text-[14px] text-muted-foreground">
              <tr><th className="px-4 py-3 font-medium">from the SDK</th><th className="px-4 py-3 font-medium">component</th><th className="px-4 py-3 font-medium">notes</th></tr>
            </thead>
            <tbody>
              {map.map(([from, to, note]) => (
                <tr key={from} className="border-t align-top">
                  <td className="px-4 py-3 font-mono text-[13px] text-foreground">{from}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{to}</td>
                  <td className="px-4 py-3 text-muted-foreground">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
        <p className={p}>
          The message list keeps <span className={code}>role=&quot;log&quot;</span> and sets <span className={code}>aria-busy</span> while a reply streams, so screen readers wait for the finished message instead of reading every token.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>other backends</h2>
        <p className={p}>
          Nothing here is specific to the AI SDK. The components take plain props, so anything that gives you text, a status and tool results will work: LangChain, the OpenAI or Anthropic SDKs, or your own server-sent events. Feed the text to <span className={code}>StreamingMarkdown</span> as it arrives.
        </p>
      </section>
    </Guide>
  );
}

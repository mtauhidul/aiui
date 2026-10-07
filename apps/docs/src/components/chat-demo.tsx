"use client";

import * as React from "react";
import { Message, MessageContent } from "@/registry/ui/message";
import { StreamingMarkdown } from "@/registry/ui/streaming-markdown";
import { Reasoning } from "@/registry/ui/reasoning";
import { ToolCall } from "@/registry/ui/tool-call";
import { Sources, type Source } from "@/registry/ui/citations";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { useAutoScroll } from "@/registry/hooks/use-auto-scroll";
import { useFakeStream } from "@/registry/hooks/use-fake-stream";

const REPLY = `Here's a quick example of a **streaming** reply with \`inline code\`:

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

- Blocks are memoized, so finished content never re-renders [1]
- Code is highlighted once the block settles [2]

| Feature | Status |
| --- | --- |
| Markdown | Done |
| Tables | Done |
`;

const SOURCES: Source[] = [
  { title: "Base UI documentation", url: "https://base-ui.com", snippet: "Unstyled, accessible React components." },
  { title: "Tailwind CSS v4", url: "https://tailwindcss.com", snippet: "A utility-first CSS framework." },
];

function AssistantExtras({ done }: { done: boolean }) {
  return (
    <div className="mb-3 space-y-2">
      <Reasoning isStreaming={!done} duration={3}>
        The user wants a streaming demo. I'll look up the docs, then answer with an example.
      </Reasoning>
      <ToolCall
        name="search_docs"
        state={done ? "success" : "running"}
        input={{ query: "streaming markdown" }}
        output={done ? { results: 2 } : undefined}
        duration={done ? "0.6s" : undefined}
      />
    </div>
  );
}

type Turn = { role: "user" | "assistant"; content: string };

// The window opens on a finished conversation, so the first impression is the product, not an empty state.
const SEED: Turn[] = [
  { role: "user", content: "How does streaming markdown stay smooth?" },
  { role: "assistant", content: REPLY },
];

export function ChatDemo() {
  const [turns, setTurns] = React.useState<Turn[]>(SEED);
  const { text, isStreaming, start, stop } = useFakeStream();
  const ref = useAutoScroll<HTMLDivElement>(text + turns.length, { pinOnMount: false });

  const wasStreaming = React.useRef(false);
  React.useEffect(() => {
    if (wasStreaming.current && !isStreaming && text) {
      setTurns((t) => [...t, { role: "assistant", content: text }]);
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, text]);

  function send(text: string) {
    setTurns((t) => [...t, { role: "user", content: text }]);
    start(REPLY);
    // Jump to the newest message; the scroll event re-pins the log so the reply is followed as it streams.
    requestAnimationFrame(() => ref.current?.scrollTo({ top: ref.current.scrollHeight }));
  }

  return (
    <div className="flex h-full min-h-[560px] flex-col">
      <div ref={ref} role="log" aria-live="polite" aria-busy={isStreaming} aria-label="Conversation" className="flex-1 space-y-6 overflow-y-auto p-6">
        {turns.map((t, i) => (
          <Message key={i} role={t.role}>
            <MessageContent>
              {t.role === "user" ? (
                t.content
              ) : (
                <>
                  <AssistantExtras done />
                  <StreamingMarkdown sources={SOURCES}>{t.content}</StreamingMarkdown>
                  <Sources sources={SOURCES} className="mt-3" />
                </>
              )}
            </MessageContent>
          </Message>
        ))}
        {isStreaming && (
          <Message>
            <MessageContent>
              <AssistantExtras done={false} />
              <StreamingMarkdown sources={SOURCES} streaming>{text}</StreamingMarkdown>
            </MessageContent>
          </Message>
        )}
      </div>
      <div className="px-4 pb-4 pt-2">
        {!isStreaming && (
          <div className="mb-3 flex flex-wrap gap-2" aria-label="Suggested prompts" role="group">
            {["Explain streaming markdown", "Show me a code example", "Cite your sources"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="rounded-md border px-3 py-1.5 text-[14px] text-muted-foreground outline-none transition-colors hover:border-white/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <PromptComposer
          isStreaming={isStreaming}
          onStop={stop}
          onSubmit={send}
        />
      </div>
    </div>
  );
}

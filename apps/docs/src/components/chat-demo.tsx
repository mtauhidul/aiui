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
      />
    </div>
  );
}

type Turn = { role: "user" | "assistant"; content: string };

export function ChatDemo() {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const { text, isStreaming, start, stop } = useFakeStream();
  const ref = useAutoScroll<HTMLDivElement>(text + turns.length);

  const wasStreaming = React.useRef(false);
  React.useEffect(() => {
    if (wasStreaming.current && !isStreaming && text) {
      setTurns((t) => [...t, { role: "assistant", content: text }]);
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, text]);

  return (
    <div className="flex h-[620px] flex-col rounded-xl border">
      <div ref={ref} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-6 overflow-y-auto p-6">
        {turns.length === 0 && !isStreaming && (
          <p className="pt-24 text-center text-sm text-muted-foreground">
            Send a message to see a streamed reply.
          </p>
        )}
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
              <StreamingMarkdown sources={SOURCES}>{text}</StreamingMarkdown>
            </MessageContent>
          </Message>
        )}
      </div>
      <div className="p-4">
        <PromptComposer
          isStreaming={isStreaming}
          onStop={stop}
          onSubmit={(v) => {
            setTurns((t) => [...t, { role: "user", content: v }]);
            start(REPLY);
          }}
        />
      </div>
    </div>
  );
}

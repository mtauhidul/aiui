"use client";

import { useChat } from "@ai-sdk/react";
import { getToolName, isToolUIPart, type UIMessage } from "ai";
import { Message, MessageContent, MessageActions } from "@/components/ui/message";
import { StreamingMarkdown } from "@/components/ui/streaming-markdown";
import { Reasoning } from "@/components/ui/reasoning";
import { ToolCall, type ToolCallState } from "@/components/ui/tool-call";
import { Thinking } from "@/components/ui/thinking";
import { ErrorNotice } from "@/components/ui/error-notice";
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom";
import { Suggestions } from "@/components/ui/suggestions";
import { CopyButton } from "@/components/ui/copy-button";
import { PromptComposer } from "@/components/ui/prompt-composer";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

const toolState: Record<string, ToolCallState> = {
  "input-streaming": "pending",
  "input-available": "running",
  "output-available": "success",
  "output-error": "error",
};

const starters = ["Explain streaming markdown", "What is the weather in Berlin?", "Show me the error state: fail"];

const textOf = (message: UIMessage) =>
  message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");

export function Chat({ demo }: { demo: boolean }) {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const ref = useAutoScroll<HTMLDivElement>(messages);

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="whitespace-nowrap font-mono text-sm">turn chat template</h1>
        {demo && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            demo mode<span className="hidden sm:inline"> · set AI_GATEWAY_API_KEY for a real model</span>
          </span>
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={ref}
          role="log"
          aria-live="polite"
          aria-busy={busy}
          aria-label="Conversation"
          tabIndex={0}
          className="flex-1 space-y-6 overflow-y-auto p-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {messages.length === 0 && (
            <p className="text-muted-foreground">Ask something, or pick a suggestion below.</p>
          )}
          {messages.map((message, m) => {
            const live = busy && m === messages.length - 1;
            const assistant = message.role !== "user";
            const content = (
              <MessageContent>
                {message.parts.map((part, i) => {
                  if (part.type === "text")
                    return assistant ? (
                      <StreamingMarkdown key={i} streaming={live && i === message.parts.length - 1}>
                        {part.text}
                      </StreamingMarkdown>
                    ) : (
                      part.text
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
            );
            return (
              <Message key={message.id} role={assistant ? "assistant" : "user"}>
                {assistant ? (
                  <div className="min-w-0 flex-1">
                    {content}
                    {!live && textOf(message) && (
                      <MessageActions className="-ml-2">
                        <CopyButton value={() => textOf(message)} />
                      </MessageActions>
                    )}
                  </div>
                ) : (
                  content
                )}
              </Message>
            );
          })}
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

      <div className="space-y-3 p-4">
        <Suggestions items={starters} disabled={busy} onSelect={(text) => sendMessage({ text })} />
        <PromptComposer isStreaming={busy} onStop={stop} onSubmit={(text) => sendMessage({ text })} />
      </div>
      </main>
    </div>
  );
}

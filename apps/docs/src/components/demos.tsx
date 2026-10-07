"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { Message, MessageContent, MessageActions } from "@/registry/ui/message";
import { CodeBlock } from "@/registry/ui/code-block";
import { StreamingMarkdown } from "@/registry/ui/streaming-markdown";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { Reasoning } from "@/registry/ui/reasoning";
import { ToolCall } from "@/registry/ui/tool-call";
import { Sources, CitationMarker, type Source } from "@/registry/ui/citations";
import { Plan } from "@/registry/ui/plan";
import { Trace } from "@/registry/ui/trace";
import { ApprovalPrompt } from "@/registry/ui/approval-prompt";
import { Artifact } from "@/registry/ui/artifact";
import { AttachmentList } from "@/registry/ui/attachment";
import { useAttachments } from "@/registry/hooks/use-attachments";
import { ModelPicker, type Model } from "@/registry/ui/model-picker";
import { useFakeStream } from "@/registry/hooks/use-fake-stream";

const SOURCES: Source[] = [
  { title: "Base UI documentation", url: "https://base-ui.com", snippet: "Unstyled, accessible React components." },
  { title: "Tailwind CSS v4", url: "https://tailwindcss.com", snippet: "A utility-first CSS framework." },
];

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

export function MessageDemo() {
  return (
    <div className="space-y-5">
      <Message role="user"><MessageContent>How do I center a div?</MessageContent></Message>
      <Message>
        <div>
          <MessageContent>Use flexbox: put <code className="font-mono">display: flex</code> with <code className="font-mono">place-content: center</code> on the parent.</MessageContent>
          <MessageActions>
            <Button variant="ghost" size="sm">Copy</Button>
            <Button variant="ghost" size="sm">Regenerate</Button>
          </MessageActions>
        </div>
      </Message>
    </div>
  );
}

export function CodeBlockDemo() {
  return <CodeBlock lang="ts" code={`const sum = (a: number, b: number) => a + b;\nconsole.log(sum(2, 3));`} />;
}

const MD = `## Streaming markdown

Finished blocks are **memoized**, so only the active block re-renders [1]. Inline \`code\`, lists and tables all work [2]:

- Fast
- Flicker-free

| Feature | Status |
| --- | --- |
| Tables | Done |
`;

export function StreamingMarkdownDemo() {
  const { text, isStreaming, start } = useFakeStream();
  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => start(MD)} disabled={isStreaming}>
        {isStreaming ? "Streaming…" : "Replay stream"}
      </Button>
      <StreamingMarkdown sources={SOURCES}>{text || MD}</StreamingMarkdown>
    </div>
  );
}

export function PromptComposerDemo() {
  const { isStreaming, start, stop } = useFakeStream();
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div className="space-y-3">
      <PromptComposer
        isStreaming={isStreaming}
        onStop={stop}
        onSubmit={(v) => { setLast(v); start("x".repeat(200)); }}
      />
      {last && <p className="text-xs text-muted-foreground">Submitted: {last}</p>}
    </div>
  );
}

export function ReasoningDemo() {
  const [thinking, setThinking] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setThinking(false), 3000); return () => clearTimeout(t); }, []);
  return (
    <Reasoning isStreaming={thinking} duration={3}>
      Comparing two approaches. A grid is simpler here, so I&apos;ll go with that.
    </Reasoning>
  );
}

export function ToolCallDemo() {
  return (
    <div className="space-y-2">
      <ToolCall name="get_weather" state="success" defaultOpen input={{ city: "Berlin" }} output={{ temp: 14, unit: "C" }} />
      <ToolCall name="send_email" state="running" input={{ to: "team@acme.com" }} />
      <ToolCall name="read_file" state="error" error="ENOENT: no such file" />
    </div>
  );
}

export function CitationsDemo() {
  return (
    <div className="space-y-4">
      <p className="text-[15px]">
        Base UI is unstyled<CitationMarker index={1} source={SOURCES[0]} /> and pairs well with Tailwind<CitationMarker index={2} source={SOURCES[1]} />.
      </p>
      <Sources sources={SOURCES} />
    </div>
  );
}

export function PlanDemo() {
  return (
    <Plan steps={[
      { id: "1", title: "Search the codebase", state: "done" },
      { id: "2", title: "Draft the change", state: "active", detail: "Editing 3 files" },
      { id: "3", title: "Run the tests", state: "pending" },
    ]} />
  );
}

export function TraceDemo() {
  return (
    <Trace events={[
      { id: "a", kind: "agent", name: "agent.run", start: 0, duration: 3000 },
      { id: "b", kind: "retrieval", name: "search", start: 100, duration: 500 },
      { id: "c", kind: "llm", name: "claude", start: 650, duration: 1500 },
      { id: "d", kind: "tool", name: "write_file", start: 2200, duration: 700, status: "error" },
    ]} />
  );
}

export function ApprovalPromptDemo() {
  const [status, setStatus] = React.useState<"pending" | "approved" | "denied">("pending");
  return (
    <ApprovalPrompt
      title="Send this email?"
      description="The agent wants to email 12 recipients."
      details="Subject: Q3 update"
      status={status}
      onApprove={() => setStatus("approved")}
      onDeny={() => setStatus("denied")}
    />
  );
}

export function ArtifactDemo() {
  return (
    <Artifact
      className="h-64"
      title="Hello.tsx"
      preview={<h1 className="text-2xl font-semibold">Hello, world</h1>}
      code={<CodeBlock lang="tsx" code={`export const Hello = () => <h1>Hello, world</h1>;`} />}
    />
  );
}

function fakeUpload(file: File, onProgress: (n: number) => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let p = 0;
    const t = setInterval(() => {
      p += 8 + Math.random() * 14;
      if (p >= 100) {
        clearInterval(t);
        onProgress(100);
        if (file.name.toLowerCase().includes("fail")) reject(new Error("Upload failed"));
        else resolve();
      } else onProgress(p);
    }, 150);
    signal.addEventListener("abort", () => {
      clearInterval(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function AttachmentDemo() {
  const { items, add, remove, clear, isUploading, ready } = useAttachments({
    accept: "image/*,.pdf,.txt,.md",
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    upload: fakeUpload,
  });
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <div className="space-y-4">
      <PromptComposer
        placeholder="Drop, paste or attach files…"
        onFiles={add}
        accept="image/*,.pdf,.txt,.md"
        allowEmpty={ready.length > 0}
        submitDisabled={isUploading}
        attachments={<AttachmentList items={items} onRemove={remove} />}
        onSubmit={(text) => {
          setSent(`${text || "(no text)"} + ${ready.length} file(s)`);
          clear();
        }}
      />
      <p className="text-xs text-muted-foreground">
        Images up to 5 MB, PDF or text, max 5 files. Name a file &quot;fail&quot; to see the error state.
      </p>
      {sent && <p className="text-xs text-muted-foreground">Sent: {sent}</p>}
    </div>
  );
}

const MODELS: Model[] = [
  { value: "claude-fable-5-1", label: "Claude Fable 5.1", provider: "Anthropic", description: "Most capable. Best for complex, long-running work.", contextWindow: 1_000_000, capabilities: ["vision", "reasoning", "tools"] },
  { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "Anthropic", description: "Balanced speed and intelligence.", contextWindow: 500_000, capabilities: ["vision", "tools"] },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5", provider: "Anthropic", description: "Fastest and most affordable.", contextWindow: 200_000, capabilities: ["fast", "tools"] },
  { value: "gpt-example-large", label: "GPT Example Large", provider: "OpenAI", description: "General-purpose flagship model.", contextWindow: 400_000, capabilities: ["vision", "reasoning"] },
  { value: "gemini-example-pro", label: "Gemini Example Pro", provider: "Google", description: "Very long context for large documents.", contextWindow: 2_000_000, capabilities: ["vision", "tools"] },
];

export function ModelPickerDemo() {
  const [model, setModel] = React.useState("claude-sonnet-5-5");
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <div className="space-y-4">
      <PromptComposer
        placeholder="Message the selected model…"
        toolbar={<ModelPicker models={MODELS} value={model} onValueChange={setModel} />}
        onSubmit={(t) => setSent(`"${t}" → ${model}`)}
      />
      <p className="text-xs text-muted-foreground">Selected: <span className="font-mono">{model}</span></p>
      {sent && <p className="text-xs text-muted-foreground">Sent {sent}</p>}
    </div>
  );
}

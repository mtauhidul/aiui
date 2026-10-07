"use client";

import * as React from "react";
import { PromptComposer } from "@/registry/ui/prompt-composer";
import { AttachmentList } from "@/registry/ui/attachment";
import { ModelPicker, type Model } from "@/registry/ui/model-picker";
import { useAttachments } from "@/registry/hooks/use-attachments";
import type { SlashCommand } from "@/registry/ui/command-menu";

const MODELS: Model[] = [
  { value: "claude-fable-5-1", label: "Claude Fable 5.1", provider: "Anthropic", description: "Most capable. Long-running work.", contextWindow: 1_000_000, capabilities: ["vision", "reasoning", "tools"] },
  { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "Anthropic", description: "Balanced speed and intelligence.", contextWindow: 500_000, capabilities: ["vision", "tools"] },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5", provider: "Anthropic", description: "Fastest and most affordable.", contextWindow: 200_000, capabilities: ["fast", "tools"] },
];

const COMMANDS: SlashCommand[] = [
  { id: "summarize", name: "summarize", description: "Summarize text", insert: "Summarize the following:\n\n" },
  { id: "translate", name: "translate", description: "Translate to another language", insert: "Translate to French:\n\n" },
  { id: "clear", name: "clear", description: "Clear the conversation" },
  { id: "help", name: "help", description: "Show available commands" },
];

function fakeUpload(_file: File, onProgress: (n: number) => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let p = 0;
    const t = setInterval(() => {
      p += 10 + Math.random() * 15;
      if (p >= 100) {
        clearInterval(t);
        onProgress(100);
        resolve();
      } else onProgress(p);
    }, 150);
    signal.addEventListener("abort", () => {
      clearInterval(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/** One composer with everything switched on: attachments, slash commands and a model picker. */
export function ComposerShowcase() {
  const { items, add, remove, clear, isUploading, ready } = useAttachments({
    accept: "image/*,.pdf,.txt,.md",
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    upload: fakeUpload,
  });
  const [model, setModel] = React.useState("claude-sonnet-5-5");
  const [log, setLog] = React.useState<string[]>([]);
  const push = (s: string) => setLog((l) => [s, ...l].slice(0, 4));

  return (
    <div className="flex h-full min-h-[460px] flex-col justify-end gap-5 p-6 sm:p-10">
      <ul className="space-y-1.5 text-[15px] text-muted-foreground">
        <li>type <span className="font-mono text-foreground">/</span> for commands</li>
        <li>drop, paste or attach files</li>
        <li>switch models from the toolbar</li>
      </ul>
      <ul aria-label="Activity" className="min-h-[5.5rem] space-y-1 font-mono text-[13px] text-faint">
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      <PromptComposer
        placeholder="Message the model…"
        commands={COMMANDS}
        onCommand={(c) => push(`ran /${c.name}`)}
        onFiles={add}
        accept="image/*,.pdf,.txt,.md"
        allowEmpty={ready.length > 0}
        submitDisabled={isUploading}
        attachments={<AttachmentList items={items} onRemove={remove} />}
        toolbar={<ModelPicker models={MODELS} value={model} onValueChange={setModel} />}
        onSubmit={(t) => {
          push(`sent “${t || "(no text)"}” with ${ready.length} file(s) to ${model}`);
          clear();
        }}
      />
    </div>
  );
}

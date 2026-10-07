import type { ComponentType } from "react";
import * as D from "@/components/demos";

export type Prop = { name: string; type: string; default?: string; description: string };

export type ComponentDoc = {
  slug: string;
  title: string;
  group: "Foundation" | "Conversation" | "Input" | "Agent";
  description: string;
  /** Source file under src/registry/ui */
  file: string;
  demo: ComponentType;
  props: Prop[];
};

export const docs: ComponentDoc[] = [
  { slug: "button", title: "Button", group: "Foundation", description: "Accessible button on Base UI with four variants and three sizes.", file: "button.tsx", demo: D.ButtonDemo,
    props: [
      { name: "variant", type: '"default" | "accent" | "ghost" | "outline"', default: '"default"', description: "Visual style." },
      { name: "size", type: '"sm" | "md" | "icon"', default: '"md"', description: "Button size." },
    ] },
  { slug: "message", title: "Message", group: "Conversation", description: "Chat message layout with user and assistant roles and hover actions.", file: "message.tsx", demo: D.MessageDemo,
    props: [{ name: "role", type: '"user" | "assistant"', default: '"assistant"', description: "Aligns and styles the message. User messages render as a bubble." }] },
  { slug: "streaming-markdown", title: "Streaming Markdown", group: "Conversation", description: "Markdown renderer for token streams. Finished blocks are memoized so only the active block re-renders.", file: "streaming-markdown.tsx", demo: D.StreamingMarkdownDemo,
    props: [
      { name: "children", type: "string", description: "The full markdown text so far." },
      { name: "sources", type: "Source[]", description: "When set, [n] in the text renders as a citation marker for sources[n - 1]." },
    ] },
  { slug: "code-block", title: "Code Block", group: "Conversation", description: "Syntax-highlighted code with light and dark themes and a copy button.", file: "code-block.tsx", demo: D.CodeBlockDemo,
    props: [
      { name: "code", type: "string", description: "Source code to display." },
      { name: "lang", type: "string", default: '"text"', description: "Any Shiki language id." },
    ] },
  { slug: "citations", title: "Citations", group: "Conversation", description: "Inline numbered markers with hover previews, plus a sources footer.", file: "citations.tsx", demo: D.CitationsDemo,
    props: [
      { name: "CitationMarker.index", type: "number", description: "Displayed number." },
      { name: "CitationMarker.source", type: "Source", description: "{ title, url, snippet? }" },
      { name: "Sources.sources", type: "Source[]", description: "Sources to list." },
    ] },
  { slug: "prompt-composer", title: "Prompt Composer", group: "Input", description: "Auto-growing input. Enter sends, Shift+Enter adds a line, and send becomes stop while streaming.", file: "prompt-composer.tsx", demo: D.PromptComposerDemo,
    props: [
      { name: "onSubmit", type: "(value: string) => void", description: "Called with the trimmed text." },
      { name: "onStop", type: "() => void", description: "Called when stop is pressed." },
      { name: "isStreaming", type: "boolean", default: "false", description: "Swaps send for stop and blocks submit." },
      { name: "placeholder", type: "string", default: '"Ask anything…"', description: "Input placeholder." },
    ] },
  { slug: "feedback", title: "Feedback", group: "Conversation", description: "Thumbs up and down for a response, with an optional follow-up for reasons and a comment. Designed to sit in the message actions row.", file: "feedback.tsx", demo: D.FeedbackDemo,
    props: [
      { name: "value / defaultValue", type: '"up" | "down" | null', description: "Current rating (controlled or initial)." },
      { name: "onValueChange", type: "(value: FeedbackValue | null) => void", description: "Fires on every change. null when the active rating is toggled off." },
      { name: "onSubmit", type: "(details: FeedbackDetails) => void", description: "Fires when the follow-up is submitted: { value, reasons, comment }." },
      { name: "details", type: '"never" | "down" | "both"', default: '"down"', description: "Which ratings open the follow-up form." },
      { name: "reasons", type: "{ up?: string[]; down?: string[] }", description: "Reason chips per rating. Defaults are exported as DEFAULT_REASONS." },
      { name: "children", type: "ReactNode", description: "Extra actions (e.g. Copy) rendered in the same row, so the follow-up form opens below the whole row." },
    ] },
  { slug: "slash-commands", title: "Slash Commands", group: "Input", description: "Type \"/\" in the Prompt Composer to open a filterable command menu. Arrow keys navigate, Enter or Tab selects, Escape dismisses.", file: "command-menu.tsx", demo: D.SlashCommandsDemo,
    props: [
      { name: "PromptComposer.commands", type: "SlashCommand[]", description: "{ id, name, description?, keywords?, insert?, icon? }. Name has no leading slash." },
      { name: "PromptComposer.onCommand", type: "(command: SlashCommand) => void", description: "Called for commands without insert. The typed /query is cleared." },
      { name: "SlashCommand.insert", type: "string", description: "Replace the input with this text (a prompt template) instead of running the command." },
      { name: "CommandMenu", type: "component", description: "The listbox on its own, for custom inputs. Takes id, commands, activeIndex, onActiveChange and onSelect." },
      { name: "filterCommands(commands, query)", type: "SlashCommand[]", description: "Ranks name-prefix matches first, then name substrings, then keywords or description words starting with the query." },
    ] },
  { slug: "model-picker", title: "Model Picker", group: "Input", description: "Searchable model selector grouped by provider, with context size and capability tags. Sits in the Prompt Composer toolbar.", file: "model-picker.tsx", demo: D.ModelPickerDemo,
    props: [
      { name: "models", type: "Model[]", description: "{ value, label, provider, description?, contextWindow?, capabilities? }. contextWindow is in tokens." },
      { name: "value", type: "string", description: "Selected model id (controlled)." },
      { name: "defaultValue", type: "string", description: "Initial model id (uncontrolled)." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called with the new model id." },
      { name: "groupByProvider", type: "boolean", default: "true", description: "Group the list under provider headings." },
      { name: "placeholder", type: "string", default: '"Select model"', description: "Shown when nothing is selected." },
      { name: "disabled", type: "boolean", description: "Disable the picker." },
      { name: "PromptComposer.toolbar", type: "ReactNode", description: "Slot below the input for controls like this picker." },
    ] },
  { slug: "attachment", title: "Attachment", group: "Input", description: "File chips and image thumbnails with upload progress and errors, plus a hook that handles validation, previews and uploads. Plugs into Prompt Composer for drag-and-drop, paste and attach.", file: "attachment.tsx", demo: D.AttachmentDemo,
    props: [
      { name: "Attachment.item", type: "AttachmentData", description: "{ name, size, previewUrl?, status, progress, error? }. Images with a previewUrl render as thumbnails." },
      { name: "Attachment.onRemove", type: "() => void", description: "Shows a remove button when set." },
      { name: "AttachmentList.items", type: "AttachmentData[]", description: "Items from useAttachments." },
      { name: "AttachmentList.onRemove", type: "(id: string) => void", description: "Remove handler." },
      { name: "useAttachments({ accept, maxSize, maxFiles, upload })", type: "options", description: "Returns { items, add, remove, clear, isUploading, ready }. upload(file, onProgress, signal) is optional. Without it, files are ready immediately. Remove aborts an in-flight upload." },
      { name: "PromptComposer.onFiles", type: "(files: File[]) => void", description: "Enables the attach button, drag-and-drop and paste." },
      { name: "PromptComposer.attachments", type: "ReactNode", description: "Slot above the input, usually an AttachmentList." },
      { name: "PromptComposer.allowEmpty", type: "boolean", default: "false", description: "Allow sending with no text." },
      { name: "PromptComposer.submitDisabled", type: "boolean", default: "false", description: "Block sending, e.g. while uploading." },
    ] },
  { slug: "reasoning", title: "Reasoning", group: "Agent", description: "Collapsible thinking block that opens while streaming and collapses when done.", file: "reasoning.tsx", demo: D.ReasoningDemo,
    props: [
      { name: "isStreaming", type: "boolean", default: "false", description: "Open and animate while true." },
      { name: "duration", type: "number", description: 'Seconds thought, shown as "Thought for Ns".' },
    ] },
  { slug: "tool-call", title: "Tool Call", group: "Agent", description: "Collapsible card showing a tool's status, input, output and error.", file: "tool-call.tsx", demo: D.ToolCallDemo,
    props: [
      { name: "name", type: "string", description: "Tool name." },
      { name: "state", type: '"pending" | "running" | "success" | "error"', description: "Current status." },
      { name: "input / output", type: "unknown", description: "Rendered as JSON." },
      { name: "error", type: "string", description: "Error message." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Start expanded." },
    ] },
  { slug: "plan", title: "Plan", group: "Agent", description: "Step list with done, active, pending and error states.", file: "plan.tsx", demo: D.PlanDemo,
    props: [{ name: "steps", type: "PlanStep[]", description: "{ id, title, state, detail? }" }] },
  { slug: "trace", title: "Trace", group: "Agent", description: "Waterfall view of an agent run, one row per span.", file: "trace.tsx", demo: D.TraceDemo,
    props: [{ name: "events", type: "TraceEvent[]", description: "{ id, kind, name, start, duration, status? } with times in ms." }] },
  { slug: "approval-prompt", title: "Approval Prompt", group: "Agent", description: "Human-in-the-loop gate where the agent asks for a yes or no.", file: "approval-prompt.tsx", demo: D.ApprovalPromptDemo,
    props: [
      { name: "title", type: "string", description: "What needs approval." },
      { name: "description", type: "string", description: "Supporting text." },
      { name: "details", type: "ReactNode", description: "Monospace detail block, e.g. a command." },
      { name: "status", type: '"pending" | "approved" | "denied"', default: '"pending"', description: "Shows buttons while pending." },
      { name: "autoFocus", type: "boolean", default: "false", description: "Move focus into the prompt when it appears." },
      { name: "onApprove / onDeny", type: "() => void", description: "Decision handlers." },
    ] },
  { slug: "artifact", title: "Artifact", group: "Agent", description: "Side pane for generated content with Preview and Code tabs.", file: "artifact.tsx", demo: D.ArtifactDemo,
    props: [
      { name: "title", type: "string", description: "Header title." },
      { name: "preview / code", type: "ReactNode", description: "Tab contents." },
      { name: "onClose", type: "() => void", description: "Shows a close button when set." },
    ] },
];

export const groups = ["Foundation", "Conversation", "Input", "Agent"] as const;

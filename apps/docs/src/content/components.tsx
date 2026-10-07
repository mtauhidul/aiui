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
  /** Keyboard and screen-reader behavior, shown on the docs page. */
  a11y: string[];
};

export const docs: ComponentDoc[] = [
  { slug: "button", a11y: ["Native button semantics with a visible focus ring.", "Disabled buttons are removed from the tab order."],  title: "Button", group: "Foundation", description: "Accessible button on Base UI with four variants and three sizes.", file: "button.tsx", demo: D.ButtonDemo,
    props: [
      { name: "variant", type: '"default" | "accent" | "ghost" | "outline"', default: '"default"', description: "Visual style." },
      { name: "size", type: '"sm" | "md" | "icon"', default: '"md"', description: "Button size." },
    ] },
  { slug: "message", a11y: ["Each message is prefixed with a screen-reader-only speaker (\"You said:\" / \"Assistant said:\"). Put the list in a container with role=\"log\" and aria-live=\"polite\".", "Set aria-busy on that container while a reply streams so screen readers announce it once, not per token.", "Actions are revealed on hover and on keyboard focus."],  title: "Message", group: "Conversation", description: "Chat message layout with user and assistant roles and hover actions.", file: "message.tsx", demo: D.MessageDemo,
    props: [
      { name: "role", type: '"user" | "assistant"', default: '"assistant"', description: "Aligns and styles the message. User messages render as a bubble." },
      { name: "label", type: "string | false", description: 'Screen-reader-only speaker label. Defaults to "You said:" or "Assistant said:". Pass false to omit.' },
    ] },
  { slug: "streaming-markdown", a11y: ["Output is semantic HTML: headings, lists, tables and links.", "Links open in a new tab with rel=\"noreferrer\".", "Citation markers are links named \"Source n: title\".", "Set aria-busy on the surrounding log while streaming so updates are announced when complete."],  title: "Streaming Markdown", group: "Conversation", description: "Markdown renderer for token streams. Finished blocks are memoized so only the active block re-renders.", file: "streaming-markdown.tsx", demo: D.StreamingMarkdownDemo,
    props: [
      { name: "children", type: "string", description: "The full markdown text so far." },
      { name: "sources", type: "Source[]", description: "When set, [n] in the text renders as a citation marker for sources[n - 1]." },
      { name: "streaming", type: "boolean", default: "false", description: "Shows a caret after the last block and sets aria-busy while text is arriving." },
    ] },
  { slug: "code-block", a11y: ["The Copy button confirms through a separate role=\"status\" region (\"Copied to clipboard\"), which screen readers announce reliably.", "Light mode uses a high-contrast Shiki theme (github-light-high-contrast); all token colors pass 4.5:1."],  title: "Code Block", group: "Conversation", description: "Syntax-highlighted code with light and dark themes and a copy button.", file: "code-block.tsx", demo: D.CodeBlockDemo,
    props: [
      { name: "code", type: "string", description: "Source code to display." },
      { name: "lang", type: "string", default: '"text"', description: "Any Shiki language id." },
    ] },
  { slug: "citations", a11y: ["Markers are links named \"Source n: title\".", "The hover preview also opens on keyboard focus.", "Sources is a list labelled \"Sources\"."],  title: "Citations", group: "Conversation", description: "Inline numbered markers with hover previews, plus a sources footer.", file: "citations.tsx", demo: D.CitationsDemo,
    props: [
      { name: "CitationMarker.index", type: "number", description: "Displayed number." },
      { name: "CitationMarker.source", type: "Source", description: "{ title, url, snippet? }" },
      { name: "Sources.sources", type: "Source[]", description: "Sources to list." },
    ] },
  { slug: "prompt-composer", a11y: ["Enter sends, Shift+Enter inserts a newline, Escape stops a running response, and IME composition is respected.", "Send is disabled when there is nothing to send; while streaming the same button becomes \"Stop generating\".", "The attach button is labelled, and drop or paste of files is also supported."],  title: "Prompt Composer", group: "Input", description: "Auto-growing input. Enter sends, Shift+Enter adds a line, and send becomes stop while streaming.", file: "prompt-composer.tsx", demo: D.PromptComposerDemo,
    props: [
      { name: "onSubmit", type: "(value: string) => void", description: "Called with the trimmed text." },
      { name: "onStop", type: "() => void", description: "Called when stop is pressed." },
      { name: "isStreaming", type: "boolean", default: "false", description: "Swaps send for stop and blocks submit." },
      { name: "placeholder", type: "string", default: '"Ask anything…"', description: "Input placeholder." },
    ] },
  { slug: "feedback", a11y: ["Rating buttons are toggles (aria-pressed) in a group named \"Rate this response\".", "Opening the follow-up moves focus to its first reason; Escape, Skip and Submit return focus to the rating button.", "The confirmation is a role=\"status\" region. Ctrl/Cmd+Enter submits from the comment box."],  title: "Feedback", group: "Conversation", description: "Thumbs up and down for a response, with an optional follow-up for reasons and a comment. Designed to sit in the message actions row.", file: "feedback.tsx", demo: D.FeedbackDemo,
    props: [
      { name: "value / defaultValue", type: '"up" | "down" | null', description: "Current rating (controlled or initial)." },
      { name: "onValueChange", type: "(value: FeedbackValue | null) => void", description: "Fires on every change. null when the active rating is toggled off." },
      { name: "onSubmit", type: "(details: FeedbackDetails) => void", description: "Fires when the follow-up is submitted: { value, reasons, comment }." },
      { name: "details", type: '"never" | "down" | "both"', default: '"down"', description: "Which ratings open the follow-up form." },
      { name: "reasons", type: "{ up?: string[]; down?: string[] }", description: "Reason chips per rating. Defaults are exported as DEFAULT_REASONS." },
      { name: "children", type: "ReactNode", description: "Extra actions (e.g. Copy) rendered in the same row, so the follow-up form opens below the whole row." },
    ] },
  { slug: "slash-commands", a11y: ["Focus stays in the textarea. Up/Down move through the list (wrapping), Enter or Tab selects, Escape dismisses.", "The input points at the active option with aria-activedescendant and at the list with aria-controls.", "The textarea does not use role=\"combobox\" because that role is not allowed on a textarea."],  title: "Slash Commands", group: "Input", description: "Type \"/\" in the Prompt Composer to open a filterable command menu. Arrow keys navigate, Enter or Tab selects, Escape dismisses.", file: "command-menu.tsx", demo: D.SlashCommandsDemo,
    props: [
      { name: "PromptComposer.commands", type: "SlashCommand[]", description: "{ id, name, description?, keywords?, insert?, icon? }. Name has no leading slash." },
      { name: "PromptComposer.onCommand", type: "(command: SlashCommand) => void", description: "Called for commands without insert. The typed /query is cleared." },
      { name: "SlashCommand.insert", type: "string", description: "Replace the input with this text (a prompt template) instead of running the command." },
      { name: "CommandMenu", type: "component", description: "The listbox on its own, for custom inputs. Takes id, commands, activeIndex, onActiveChange and onSelect." },
      { name: "filterCommands(commands, query)", type: "SlashCommand[]", description: "Ranks name-prefix matches first, then name substrings, then keywords or description words starting with the query." },
    ] },
  { slug: "model-picker", a11y: ["Built on Base UI Combobox: the trigger is a combobox with aria-expanded and the popup is a dialog with a listbox.", "Opening moves focus to the search field; Arrow keys and Enter select, Escape closes and returns focus to the trigger.", "Disabled pickers cannot be opened.", "Respects prefers-reduced-motion: the popup opens and closes without the scale/fade animation."],  title: "Model Picker", group: "Input", description: "Searchable model selector grouped by provider, with context size and capability tags. Sits in the Prompt Composer toolbar.", file: "model-picker.tsx", demo: D.ModelPickerDemo,
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
  { slug: "attachment", a11y: ["Remove buttons are named \"Remove <file>\" and are visible on hover, on focus, and always on touch devices.", "Upload progress is a progressbar named \"Uploading <file>\"; errors are shown as text, not color alone.", "After removing an item, focus moves to the next one (or the message input when the list is empty).", "Respects prefers-reduced-motion: the progress bar fill updates without animating."],  title: "Attachment", group: "Input", description: "File chips and image thumbnails with upload progress and errors, plus a hook that handles validation, previews and uploads. Plugs into Prompt Composer for drag-and-drop, paste and attach.", file: "attachment.tsx", demo: D.AttachmentDemo,
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
  { slug: "reasoning", a11y: ["The header is a button with aria-expanded; its label reflects state (\"Thinking…\", \"Thought for 3s\").", "It opens while streaming and collapses afterwards.", "Respects prefers-reduced-motion: the thinking pulse, chevron rotation and expand/collapse animation are turned off."],  title: "Reasoning", group: "Agent", description: "Collapsible thinking block that opens while streaming and collapses when done.", file: "reasoning.tsx", demo: D.ReasoningDemo,
    props: [
      { name: "isStreaming", type: "boolean", default: "false", description: "Open and animate while true." },
      { name: "duration", type: "number", description: 'Seconds thought, shown as "Thought for Ns".' },
    ] },
  { slug: "tool-call", a11y: ["The header is a button with aria-expanded; its accessible name includes the tool name and status.", "Status changes are in a polite live region.", "Respects prefers-reduced-motion: the running pulse and chevron rotation are turned off; the status is still shown by color and text."],  title: "Tool Call", group: "Agent", description: "Collapsible card showing a tool's status, input, output and error.", file: "tool-call.tsx", demo: D.ToolCallDemo,
    props: [
      { name: "name", type: "string", description: "Tool name." },
      { name: "state", type: '"pending" | "running" | "success" | "error"', description: "Current status." },
      { name: "input / output", type: "unknown", description: "Rendered as JSON." },
      { name: "error", type: "string", description: "Error message." },
      { name: "duration", type: "string", description: 'Elapsed time such as "1.2s", shown beside the status.' },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Start expanded." },
    ] },
  { slug: "plan", a11y: ["An ordered list named \"Plan\"; the active step has aria-current=\"step\".", "Each step's state is read out (\"Completed:\", \"In progress:\", \"Not started:\", \"Failed:\"), not just shown as an icon.", "Respects prefers-reduced-motion: the active-step pulse is turned off; the active step is still marked by its ring and aria-current."],  title: "Plan", group: "Agent", description: "Step list with done, active, pending and error states.", file: "plan.tsx", demo: D.PlanDemo,
    props: [{ name: "steps", type: "PlanStep[]", description: "{ id, title, state, detail? }" }] },
  { slug: "trace", a11y: ["A table with a header row. Every span has its duration as text, so the bars are a visual extra.", "Failed spans are labelled \"failed\" in text as well as shown in red."],  title: "Trace", group: "Agent", description: "Waterfall view of an agent run, one row per span.", file: "trace.tsx", demo: D.TraceDemo,
    props: [{ name: "events", type: "TraceEvent[]", description: "{ id, kind, name, start, duration, status? } with times in ms." }] },
  { slug: "approval-prompt", a11y: ["An alertdialog named by its title. It does not trap focus; set autoFocus when it appears mid-conversation.", "After a decision the buttons are removed and focus stays in the prompt, with the result in a polite live region."],  title: "Approval Prompt", group: "Agent", description: "Human-in-the-loop gate where the agent asks for a yes or no.", file: "approval-prompt.tsx", demo: D.ApprovalPromptDemo,
    props: [
      { name: "title", type: "string", description: "What needs approval." },
      { name: "description", type: "string", description: "Supporting text." },
      { name: "details", type: "ReactNode", description: "Monospace detail block, e.g. a command." },
      { name: "status", type: '"pending" | "approved" | "denied"', default: '"pending"', description: "Shows buttons while pending." },
      { name: "risk", type: '"low" | "medium" | "high"', description: "Adds a text label and coloured edge so the stakes are clear before deciding." },
      { name: "autoFocus", type: "boolean", default: "false", description: "Move focus into the prompt when it appears." },
      { name: "onApprove / onDeny", type: "() => void", description: "Decision handlers." },
    ] },
  { slug: "artifact", a11y: ["Tabs follow the WAI-ARIA pattern: Arrow keys move focus between tabs, Enter or Space activates, and the panel is focusable.", "The close button is labelled \"Close artifact\"."],  title: "Artifact", group: "Agent", description: "Side pane for generated content with Preview and Code tabs.", file: "artifact.tsx", demo: D.ArtifactDemo,
    props: [
      { name: "title", type: "string", description: "Header title." },
      { name: "preview / code", type: "ReactNode", description: "Tab contents." },
      { name: "onClose", type: "() => void", description: "Shows a close button when set." },
    ] },
];

export const groups = ["Foundation", "Conversation", "Input", "Agent"] as const;

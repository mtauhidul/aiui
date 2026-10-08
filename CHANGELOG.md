# Changelog

## Unreleased

- Components now use the standard shadcn `primary` and `primary-foreground` tokens instead of `accent`, so they match your existing theme with no setup. `Button` variant `accent` is now `primary`.
- Docs: the theme is clearly optional, and the guides say it replaces your existing color variables.

## 0.1.0

First public release.

- 21 components for chat, agents and tool use: Button, Message, Streaming Markdown, Code Block, Citations, Feedback, Scroll to Bottom, Thinking, Error Notice, Copy Button, Prompt Composer, Slash Commands, Model Picker, Attachment, Suggestions, Reasoning, Tool Call, Plan, Trace, Approval Prompt and Artifact.
- Hooks: `useAutoScroll`, `useAttachments`, `useFakeStream`.
- shadcn-compatible registry served at `/r/*.json`, with an optional `theme` item for the color tokens.
- Guides: getting started, theming, use with the AI SDK, and accessibility.
- Dark and light support through eight color tokens.
- `templates/chat`: a runnable chat app (AI SDK, streaming, reasoning, tool calls, errors with retry). Works in demo mode without an API key.
- Tests for behavior, accessibility (axe) and reduced motion.

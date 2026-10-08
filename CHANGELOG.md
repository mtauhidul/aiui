# Changelog

## 0.1.2

Install fixes found by testing against fresh Next.js and Vite projects created with `shadcn init`.

- The button item is now `turn-button` (`components/ui/turn-button.tsx`). The old `button` collided with the `button.tsx` that `shadcn init` creates, so installing a turn component either skipped ours or overwrote yours.
- turn no longer ships its own `utils`. It depends on shadcn's, so installing no longer asks to overwrite `lib/utils.ts`.
- Removed unused `React` imports that made `npm run build` fail in a new Vite project (`noUnusedLocals`).

Upgrading from 0.1.0 or 0.1.1: re-add the components you use with `--overwrite`. They will import `./turn-button` instead of `./button`. If you replaced your own `button.tsx` with turn's, restore it from version control.

## 0.1.1

- Components now use the standard shadcn `primary` and `primary-foreground` tokens instead of `accent`, so they match your existing theme with no setup. `Button` variant `accent` is now `primary`.
- Docs: the theme is clearly optional, and the guides say it replaces your existing color variables.
- The logo mark is now a plain rounded square, matching the social image.
- Dependencies pinned to compatible version ranges; the unused `motion` package was removed.

Upgrading from 0.1.0: if you copied components earlier, replace `bg-accent`, `border-accent`, `text-accent` and `text-accent-foreground` with the `primary` equivalents, and change `variant="accent"` to `variant="primary"`. Or run `npx shadcn@latest add <component url> --overwrite` to refresh a component.

## 0.1.0

First public release.

- 21 components for chat, agents and tool use: Button, Message, Streaming Markdown, Code Block, Citations, Feedback, Scroll to Bottom, Thinking, Error Notice, Copy Button, Prompt Composer, Slash Commands, Model Picker, Attachment, Suggestions, Reasoning, Tool Call, Plan, Trace, Approval Prompt and Artifact.
- Hooks: `useAutoScroll`, `useAttachments`, `useFakeStream`.
- shadcn-compatible registry served at `/r/*.json`, with an optional `theme` item for the color tokens.
- Guides: getting started, theming, use with the AI SDK, and accessibility.
- Dark and light support through eight color tokens.
- `templates/chat`: a runnable chat app (AI SDK, streaming, reasoning, tool calls, errors with retry). Works in demo mode without an API key.
- Tests for behavior, accessibility (axe) and reduced motion.

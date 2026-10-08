# turn chat template

A streaming chat built with [turn](https://turnui.xyz) components and the [Vercel AI SDK](https://ai-sdk.dev). It shows the pieces working together: streamed markdown, reasoning, tool calls, a loading state, errors with retry, stop, and scroll-to-bottom.

## Run it

From the repo root:

```bash
pnpm install
pnpm --filter turn-chat-template dev
```

Open http://localhost:3000. With no API key the app runs in **demo mode**: a built-in fake model streams canned replies, so you can see every state without any setup. Try these:

- anything: reasoning, then a markdown answer with a code block
- "what is the weather in Berlin?": a tool call, then an answer using its result
- "fail": the error state, with retry

## Use a real model

Copy `.env.example` to `.env.local` and set `AI_GATEWAY_API_KEY`. The app then streams from the [AI Gateway](https://vercel.com/ai-gateway). Set `MODEL` to choose a model (default `anthropic/claude-sonnet-5.5`). To use a provider directly instead, pass that provider's model to `streamText` in `src/app/api/chat/route.ts`.

## What is in here

- `src/app/api/chat/route.ts`: the streaming route and a sample tool.
- `src/components/chat.tsx`: the chat page. Each message part maps to a turn component.
- `src/lib/demo-model.ts`: the fake model used in demo mode. Delete it, and the fallback in the route, once you have a real model.
- `src/components/ui` and `src/hooks`: the turn components, installed with the shadcn CLI:

```bash
npx shadcn@latest add https://turnui.xyz/r/prompt-composer.json
```

They are your files now. Edit them freely.

## Notes

- The AI SDK hides provider error details from the browser by default. The route passes `onError` to choose what users see; in demo mode it shows the fake model's message, otherwise a generic one.
- The chat log has `tabIndex={0}` so keyboard users can scroll it, and the page is wrapped in a `main` landmark.

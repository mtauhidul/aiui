# aiui

Minimal, modern UI components for AI applications. Built on Base UI and Tailwind, shadcn-registry compatible.

- `apps/docs` — docs site and live demos
- `packages/registry` — component source and `registry.json`
- `templates` — chat, agent dashboard, playground (planned)

```bash
pnpm install
pnpm dev
```

## Testing

```bash
pnpm test
```

Vitest + Testing Library cover behavior (keyboard, ARIA state, callbacks) and every component runs through axe for a11y violations. Tests live in `apps/docs/tests`. jsdom can't compute layout or color, so `color-contrast` is disabled in axe; check contrast in the browser.

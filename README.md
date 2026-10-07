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

## Reduced motion

Anything that moves, scales, slides, resizes or loops opts out with Tailwind's `motion-reduce:` variants, so components stay self-contained when copied into your project. Color and opacity fades are kept. `tests/motion.test.ts` enforces this for every component, so new animations can't ship without an opt-out.

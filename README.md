# turn

Minimal, modern UI components for AI applications. Built on Base UI and Tailwind, shadcn-registry compatible.

- `apps/docs` — docs site, live demos, and the component source (`src/registry`)

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a component, and [CHANGELOG.md](CHANGELOG.md) for what changed.

```bash
pnpm install
pnpm dev
```

## Install a component

Components are distributed through a shadcn-compatible registry. Each item lists the items it depends on, so one command pulls everything it needs:

```bash
npx shadcn@latest add https://turnui.xyz/r/prompt-composer.json
```

## Deploy

The docs site is a Next.js app and also serves the registry at `/r/*.json`. `pnpm build` generates the registry first (`apps/docs/scripts/build-registry.mjs`) and then builds the site.

Registry items refer to each other by absolute URL, so the build needs to know the public origin. It defaults to `https://turnui.xyz` for production builds and `http://localhost:3000` for `pnpm dev`. To use another domain, set `NEXT_PUBLIC_REGISTRY_URL` before building (see `apps/docs/.env.example`).

## Testing

```bash
pnpm test
```

Vitest + Testing Library cover behavior (keyboard, ARIA state, callbacks) and every component runs through axe for a11y violations. Tests live in `apps/docs/tests`. jsdom can't compute layout or color, so `color-contrast` is disabled in axe; check contrast in the browser.

## Reduced motion

Anything that moves, scales, slides, resizes or loops opts out with Tailwind's `motion-reduce:` variants, so components stay self-contained when copied into your project. Color and opacity fades are kept. `tests/motion.test.ts` enforces this for every component, so new animations can't ship without an opt-out.

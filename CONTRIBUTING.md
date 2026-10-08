# Contributing

Thanks for helping. This is a small codebase; the rules below keep it that way.

## Setup

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run what CI runs:

```bash
pnpm lint
pnpm test
pnpm build
```

## Where things live

- `apps/docs/src/registry/ui` and `hooks`: the component source. This is what users copy.
- `apps/docs/registry.json`: the registry. Add an item for every new file.
- `apps/docs/src/content/components.tsx`: docs data (props, accessibility notes, demo) for each component.
- `apps/docs/src/components/demos.tsx`: the live demo for each docs page.
- `apps/docs/tests`: Vitest, Testing Library and axe.

## Rules for components

- **Self-contained.** No imports from outside the component's own folder except `@/lib/utils` and sibling registry files. Users copy these files, so they must work alone.
- **Plain props.** No providers or context.
- **Tokens only.** Use the eight color tokens (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `primary`, `primary-foreground`, `ring`), which every shadcn theme already defines. Status colors may use emerald, amber and red, with a darker shade on light backgrounds.
- **Square and quiet.** Corners are 4px for panels and 2px for inner items. No shadows for decoration, no gradients.
- **Accessible.** Native elements first. Every interactive state needs a text equivalent. If focus can disappear, hand it to a neighbor. Fix accessibility problems in the component, not in the test.
- **Reduced motion.** Anything that moves, scales, slides or loops needs a `motion-reduce:` opt-out. `tests/motion.test.ts` enforces it.

## Adding a component

1. Write it in `src/registry/ui`.
2. Add it to `registry.json` with its dependencies (bare names; the build rewrites them to URLs).
3. Add a docs entry and a demo.
4. Add tests: behavior, and `checkA11y`.
5. Add a line to `CHANGELOG.md`.

## Registry URLs

Registry items depend on each other by absolute URL, generated at build time from `NEXT_PUBLIC_REGISTRY_URL`. See the README for deployment.

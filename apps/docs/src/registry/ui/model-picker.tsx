"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/utils";

export type ModelCapability = "vision" | "reasoning" | "tools" | "fast";

export type Model = {
  /** Unique id sent to your backend, e.g. "claude-sonnet-5-5". */
  value: string;
  /** Display name. */
  label: string;
  provider: string;
  description?: string;
  /** Context window in tokens. */
  contextWindow?: number;
  capabilities?: ModelCapability[];
};

type ModelGroup = { value: string; items: Model[] };

const capabilityLabel: Record<ModelCapability, string> = {
  vision: "Vision",
  reasoning: "Reasoning",
  tools: "Tools",
  fast: "Fast",
};

function formatContext(tokens: number) {
  return tokens >= 1_000_000 ? `${+(tokens / 1_000_000).toFixed(1)}M` : `${Math.round(tokens / 1000)}K`;
}

function ProviderMark({ provider, className }: { provider: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-semibold uppercase text-muted-foreground", className)}
    >
      {provider.charAt(0)}
    </span>
  );
}

function matches(model: Model, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [model.label, model.provider, model.description ?? "", ...(model.capabilities ?? [])]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function ModelPicker({
  models,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select model",
  groupByProvider = true,
  disabled,
  className,
}: {
  models: Model[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Group the list under provider headings. */
  groupByProvider?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [inner, setInner] = React.useState(defaultValue ?? null);
  const current = value !== undefined ? value : inner;
  const selected = models.find((m) => m.value === current) ?? null;

  const items = React.useMemo<Model[] | ModelGroup[]>(() => {
    if (!groupByProvider) return models;
    const map = new Map<string, Model[]>();
    for (const m of models) map.set(m.provider, [...(map.get(m.provider) ?? []), m]);
    return [...map].map(([provider, list]) => ({ value: provider, items: list }));
  }, [models, groupByProvider]);

  const renderItem = (model: Model) => (
    <Combobox.Item
      key={model.value}
      value={model}
      className="group/item flex cursor-default items-start gap-2.5 rounded-sm px-2 py-2 text-sm outline-none select-none data-[highlighted]:bg-muted data-[highlighted]:shadow-[inset_2px_0_0_currentColor]"
    >
      <ProviderMark provider={model.provider} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{model.label}</span>
          {model.contextWindow && (
            <span className="font-mono text-[11px] text-muted-foreground">{formatContext(model.contextWindow)} ctx</span>
          )}
        </div>
        {model.description && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{model.description}</p>}
        {!!model.capabilities?.length && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {model.capabilities.map((c) => (
              <span key={c} className="rounded-sm border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
                {capabilityLabel[c]}
              </span>
            ))}
          </div>
        )}
      </div>
      <Combobox.ItemIndicator className="mt-0.5 text-foreground">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="m3.5 8.5 3 3 6-6.5" /></svg>
      </Combobox.ItemIndicator>
    </Combobox.Item>
  );

  return (
    <Combobox.Root
      items={items}
      value={selected}
      onValueChange={(m: Model | null) => {
        if (!m) return;
        setInner(m.value);
        onValueChange?.(m.value);
      }}
      isItemEqualToValue={(a: Model, b: Model) => a.value === b.value}
      filter={(item: Model, query: string) => matches(item, query)}
      disabled={disabled}
    >
      <Combobox.Trigger
        aria-label="Model"
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-sm px-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[popup-open]:bg-muted data-[popup-open]:text-foreground",
          className,
        )}
      >
        {selected && <ProviderMark provider={selected.provider} className="size-4 text-[9px]" />}
        <span className="max-w-40 truncate">{selected ? selected.label : placeholder}</span>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner align="start" sideOffset={6}>
          <Combobox.Popup
            aria-label="Select model"
            className="z-50 w-80 max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded border bg-background text-foreground shadow-lg transition-[scale,opacity] duration-150 motion-reduce:transition-none data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
          >
            <div className="border-b p-2">
              <Combobox.Input
                placeholder="Search models…"
                className="h-8 w-full rounded-sm bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <Combobox.Empty>
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">No models found.</div>
            </Combobox.Empty>
            <Combobox.List className="max-h-[min(22rem,var(--available-height))] overflow-y-auto overscroll-contain p-1 outline-none">
              {groupByProvider
                ? (group: ModelGroup) => (
                    <Combobox.Group key={group.value} items={group.items} className="block pb-1 last:pb-0">
                      <Combobox.GroupLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground select-none">
                        {group.value}
                      </Combobox.GroupLabel>
                      <Combobox.Collection>{renderItem}</Combobox.Collection>
                    </Combobox.Group>
                  )
                : renderItem}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

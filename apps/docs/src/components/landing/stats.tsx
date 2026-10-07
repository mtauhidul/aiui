import { docs } from "@/content/components";

export function Stats() {
  const items = [
    { n: String(docs.length), label: "Components" },
    { n: "100+", label: "Tests" },
    { n: "0", label: "Axe violations" },
    { n: "2", label: "Themes" },
  ];
  return (
    <dl className="grid grid-cols-2 border-y md:grid-cols-4">
      {items.map((it, i) => (
        <div key={it.label} className={`px-6 py-10 ${i > 0 ? "md:border-l" : ""} ${i % 2 === 1 ? "border-l md:border-l" : ""}`}>
          <dd className="font-display text-6xl leading-none tracking-tight sm:text-7xl">{it.n}</dd>
          <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}

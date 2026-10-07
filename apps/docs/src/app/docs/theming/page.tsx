import type { Metadata } from "next";
import { CodeBlock } from "@/registry/ui/code-block";
import { Guide, TableScroll, h2, p, code } from "@/components/guide";
import { guides } from "@/content/guides";
import { REGISTRY_URL } from "@/lib/registry-url";

const guide = guides[1];
export const metadata: Metadata = { title: guide.title, description: guide.description };

const tokens = [
  ["background", "Page, composer and popup surfaces.", "#000000", "#ffffff"],
  ["foreground", "Primary text, active borders, the default button.", "#efefe4", "#0a0a0a"],
  ["muted", "Quiet fills: user bubbles, code chips, hover rows.", "#1a1a1a", "#f2f2ee"],
  ["muted-foreground", "Secondary text, labels, placeholders.", "#a3a3a3", "#525252"],
  ["border", "Every hairline. Components use the plain border utility.", "rgb(255 255 255 / 0.13)", "rgb(0 0 0 / 0.12)"],
  ["accent", "Primary action: the send button, progress, the selected item.", "#efefe4", "#0a0a0a"],
  ["accent-foreground", "Text on top of accent.", "#0a0a0a", "#fafaf5"],
  ["ring", "Focus rings.", "#efefe4", "#0a0a0a"],
];

const css = `:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f2f2ee;
  --muted-foreground: #525252;
  --border: rgb(0 0 0 / 0.12);
  --accent: #0a0a0a;
  --accent-foreground: #fafaf5;
  --ring: #0a0a0a;
}

.dark {
  --background: #000000;
  --foreground: #efefe4;
  --muted: #1a1a1a;
  --muted-foreground: #a3a3a3;
  --border: rgb(255 255 255 / 0.13);
  --accent: #efefe4;
  --accent-foreground: #0a0a0a;
  --ring: #efefe4;
}

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-ring: var(--ring);
}

@layer base {
  * { border-color: var(--border); }
}`;

export default function Theming() {
  return (
    <Guide slug={guide.slug}>
      <section className="space-y-4">
        <h2 className={h2}>install the theme</h2>
        <p className={p}>One command writes the tokens below into your global stylesheet, for both light and dark. It is optional. If your project already defines these names, the components will use your values.</p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/r/theme.json`} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>tokens</h2>
        <p className={p}>The components use only these eight, through ordinary Tailwind utilities such as <span className={code}>bg-muted</span> and <span className={code}>text-muted-foreground</span>.</p>
        <TableScroll label="Color tokens">
          <table className="w-full text-[15px]">
            <thead className="border-b bg-white/[0.03] text-left text-[14px] text-muted-foreground">
              <tr><th className="px-4 py-3 font-medium">token</th><th className="px-4 py-3 font-medium">used for</th><th className="px-4 py-3 font-medium">dark</th><th className="px-4 py-3 font-medium">light</th></tr>
            </thead>
            <tbody>
              {tokens.map(([name, use, dark, light]) => (
                <tr key={name} className="border-t align-top">
                  <td className="px-4 py-3 font-mono text-[13px] text-foreground">{name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{use}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{dark}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-foreground">{light}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>accent is the primary action</h2>
        <p className={p}>In a default shadcn theme, <span className={code}>accent</span> is a pale background used for hover states. In aiui it is the strongest color on the page: the send button, upload progress and the selected item all use it. If you skip the theme and keep the default, those controls will look washed out. Set <span className={code}>accent</span> to your brand or primary color and <span className={code}>accent-foreground</span> to a color that reads on it.</p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>what the tokens map to</h2>
        <p className={p}>If you set things up by hand, this is everything the components need. The theme item writes the variables; <span className={code}>shadcn init</span> adds the rest. The <span className={code}>@custom-variant</span> line matters: a few components use <span className={code}>dark:</span> variants, for example the code colors and the status text.</p>
        <CodeBlock lang="css" code={css} />
      </section>

      <section className="space-y-4">
        <h2 className={h2}>shape, color and type</h2>
        <ul className={`${p} list-disc space-y-1.5 pl-5`}>
          <li>Corners are fixed at 4px for panels and 2px for inner items, in the markup of each component. They do not follow <span className={code}>--radius</span>, so a rounded theme will not change them. Search for <span className={code}>rounded</span> in a component to change its corners.</li>
          <li>Status colors (success, warning, error) use Tailwind&apos;s emerald, amber and red directly, with darker shades on light backgrounds so text stays readable. They are not tokens. Edit them in the component if you want your own.</li>
          <li>Code, durations and labels use <span className={code}>font-mono</span>. Define it in your theme if you want a specific monospace font.</li>
        </ul>
      </section>
    </Guide>
  );
}

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
  ["primary", "Primary action: the send button, progress, the selected item.", "#efefe4", "#0a0a0a"],
  ["primary-foreground", "Text on top of primary.", "#0a0a0a", "#fafaf5"],
  ["ring", "Focus rings.", "#efefe4", "#0a0a0a"],
];

const css = `:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f2f2ee;
  --muted-foreground: #525252;
  --border: rgb(0 0 0 / 0.12);
  --primary: #0a0a0a;
  --primary-foreground: #fafaf5;
  --ring: #0a0a0a;
}

.dark {
  --background: #000000;
  --foreground: #efefe4;
  --muted: #1a1a1a;
  --muted-foreground: #a3a3a3;
  --border: rgb(255 255 255 / 0.13);
  --primary: #efefe4;
  --primary-foreground: #0a0a0a;
  --ring: #efefe4;
}

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-ring: var(--ring);
}

@layer base {
  * { border-color: var(--border); }
}`;

export default function Theming() {
  return (
    <Guide slug={guide.slug}>
      <section className="space-y-4">
        <h2 className={h2}>you probably do not need a theme</h2>
        <p className={p}>
          The components use the standard shadcn color tokens, so they pick up the theme your project already has. If you set up your project with <span className={code}>shadcn init</span>, skip the theme and the components will look like the rest of your app.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>the optional turn theme</h2>
        <p className={p}>
          If you want turn&apos;s own look (black and warm off-white, with a light companion), install the theme item. It writes the tokens below into your global stylesheet for both light and dark.
        </p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/r/theme.json`} />
        <p className={p}>
          <strong className="font-medium text-foreground">It replaces your existing values</strong> for these token names, which restyles your whole app, including any shadcn components you already use. Install it on a new project, or when you want that palette everywhere. To change only the components, edit the tokens yourself instead.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={h2}>tokens</h2>
        <p className={p}>The components use only these eight, all of which a standard shadcn theme already defines, through ordinary Tailwind utilities such as <span className={code}>bg-muted</span> and <span className={code}>text-muted-foreground</span>.</p>
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

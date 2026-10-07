const ITEMS = ["Vercel AI SDK", "LangChain", "OpenAI", "Anthropic", "Next.js", "Tailwind v4", "Base UI", "shadcn registry", "React 19", "Server-Sent Events"];

/** A calm strip of integrations. Scrolls for users who allow motion, wraps statically for those who don't. */
export function WorksWith() {
  const set = (hidden: boolean) =>
    ITEMS.map((name) => (
      <li key={name + hidden} className="font-medium flex shrink-0 items-center gap-10 whitespace-nowrap text-xs text-muted-foreground">
        {name}
        <span aria-hidden className="size-1 bg-border" />
      </li>
    ));
  return (
    <section aria-label="Works with" className="relative border-y bg-surface/40 py-5">
      <div className="marquee-pause mask-fade-x mx-auto max-w-6xl overflow-hidden px-6">
        <div className="animate-marquee flex w-max items-center motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
          <ul className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0">{set(false)}</ul>
          <ul aria-hidden className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:hidden">{set(true)}</ul>
        </div>
      </div>
    </section>
  );
}

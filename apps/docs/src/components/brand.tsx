import { cn } from "@/lib/utils";

/** An aperture ring with a streaming caret: the brand is "live output". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-6", className)}>
      <rect x="1.75" y="1.75" width="20.5" height="20.5" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9.75" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="15.5" y="6.5" width="2.25" height="11" rx="0.5" className="fill-accent" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-medium tracking-tight", className)}>
      <LogoMark />
      <span className="flex items-baseline">
        aiui
        <span aria-hidden className="animate-caret ml-0.5 inline-block h-[0.95em] w-[0.28em] translate-y-[0.12em] bg-accent" />
      </span>
    </span>
  );
}

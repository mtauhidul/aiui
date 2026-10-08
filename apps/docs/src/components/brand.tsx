import { cn } from "@/lib/utils";

/** A plain rounded square. Monochrome; matches the mark on the social image. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-[22px]", className)}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[19px] font-medium tracking-[-0.02em]", className)}>
      <LogoMark />
      turn
    </span>
  );
}

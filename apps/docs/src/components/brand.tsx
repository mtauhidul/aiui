import { cn } from "@/lib/utils";

/** A ring and a bar: output being written. Monochrome. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-[22px]", className)}>
      <rect x="1.75" y="1.75" width="20.5" height="20.5" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9.75" cy="12" r="3.9" stroke="currentColor" strokeWidth="1.6" />
      <rect x="15.5" y="7" width="2.25" height="10" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[19px] font-medium tracking-[-0.02em]", className)}>
      <LogoMark />
      aiui
    </span>
  );
}

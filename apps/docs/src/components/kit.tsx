import * as React from "react";
import { cn } from "@/lib/utils";

/** Mono, uppercase micro-label with a signal-colored square. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground", className)}>
      <span aria-hidden className="size-1.5 bg-accent" />
      {children}
    </p>
  );
}

/** Registration marks at the four corners, like a blueprint or a camera frame. */
export function Ticks({ className }: { className?: string }) {
  const tick = "pointer-events-none absolute size-2.5 border-foreground/45";
  return (
    <>
      <span aria-hidden className={cn(tick, "-left-px -top-px border-l border-t", className)} />
      <span aria-hidden className={cn(tick, "-right-px -top-px border-r border-t", className)} />
      <span aria-hidden className={cn(tick, "-bottom-px -left-px border-b border-l", className)} />
      <span aria-hidden className={cn(tick, "-bottom-px -right-px border-b border-r", className)} />
    </>
  );
}

/** A bordered panel with registration marks and an optional mono caption. */
export function Frame({
  children,
  caption,
  className,
  bodyClassName,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("relative border bg-surface/80", className)}>
      <Ticks />
      {caption && (
        <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

/** A full-width rule with "+" crosshairs at both ends. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-px w-full bg-border", className)}>
      <span className="absolute -left-1.5 -top-[7px] font-mono text-[13px] leading-none text-muted-foreground">+</span>
      <span className="absolute -right-1.5 -top-[7px] font-mono text-[13px] leading-none text-muted-foreground">+</span>
    </div>
  );
}

/** A soft, masked field behind a section. Decorative. */
export function Backdrop({ variant = "dots", className }: { variant?: "dots" | "grid"; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute -inset-x-6 -inset-y-16 -z-10 overflow-hidden", className)}>
      <div className={cn("absolute inset-0 mask-fade opacity-90", variant === "dots" ? "bg-dots" : "bg-grid-fine")} />
      <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow blur-[120px]" />
    </div>
  );
}

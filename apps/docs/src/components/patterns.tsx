import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Squares sharing one corner, like stacked layers. Hairline and transparent, drawn as SVG paths
 * so it adds no contrast or screen-reader noise.
 */
export function StackedSquares({ className }: { className?: string }) {
  const sizes = [64, 112, 160, 208, 256];
  return (
    <div aria-hidden className={cn("pointer-events-none absolute select-none text-white", className)}>
      <svg viewBox="0 0 256 256" preserveAspectRatio="xMaxYMin meet" className="h-full w-full" fill="none" stroke="currentColor">
        <rect x={256 - 64} y={0} width={64} height={64} fill="currentColor" fillOpacity={0.035} stroke="none" />
        {sizes.map((n, i) => (
          <rect key={n} x={256 - n + 0.5} y={0.5} width={n - 1} height={n - 1} rx={i === 0 ? 0 : 2} strokeOpacity={0.1 - i * 0.012} />
        ))}
      </svg>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

// Fades the figure out from its top-right corner, so its lines stay quiet behind text.
const FADE = "radial-gradient(ellipse 100% 100% at 100% 0%, #000 30%, transparent 100%)";

/**
 * Squares sharing one corner, like stacked layers. Hairline and transparent, drawn as SVG paths
 * so it adds no contrast or screen-reader noise. Strokes are non-scaling, so the lines stay one
 * pixel wide however large the figure is.
 */
export function StackedSquares({ className }: { className?: string }) {
  const sizes = [64, 112, 160, 208, 256];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute select-none text-white", className)}
      style={{ WebkitMaskImage: FADE, maskImage: FADE }}
    >
      <svg viewBox="0 0 256 256" preserveAspectRatio="xMaxYMin meet" className="h-full w-full" fill="none" stroke="currentColor">
        <rect x={256 - 64} y={0} width={64} height={64} fill="currentColor" fillOpacity={0.04} stroke="none" />
        {sizes.map((n, i) => (
          <rect
            key={n}
            x={256 - n}
            y={0}
            width={n}
            height={n}
            vectorEffect="non-scaling-stroke"
            strokeWidth={1}
            strokeOpacity={0.22 - i * 0.025}
          />
        ))}
      </svg>
    </div>
  );
}

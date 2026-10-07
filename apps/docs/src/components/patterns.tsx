import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Construction geometry: hairline, transparent, static.
 * A triangular lattice, circles, squares and arcs, in white at low opacity. Drawn as SVG paths
 * (never text) so they add no contrast or screen-reader noise, and each one is masked to fade
 * away from the content it sits beside.
 */

/** CSS masks that fade a figure toward a corner or edge. */
export const fade = {
  topRight: "radial-gradient(ellipse 90% 100% at 100% 0%, #000 0%, transparent 72%)",
  right: "radial-gradient(ellipse 64% 82% at 88% 42%, #000 0%, transparent 74%)",
  vertical: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
} as const;

type Base = { className?: string; mask?: string };

function Wrap({ className, mask, children }: Base & { children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute select-none text-white", className)}
      style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
    >
      {children}
    </div>
  );
}

/** A triangular lattice (three families of hairlines meeting at shared points). */
export function Lattice({ className, mask, s = 32, opacity = 0.1 }: Base & { s?: number; opacity?: number }) {
  const id = React.useId();
  const h = +(s * Math.sqrt(3)).toFixed(2);
  const d = `M0 0H${s}M0 ${h / 2}H${s}M0 ${h}H${s}M0 0L${s / 2} ${h / 2}L${s} ${h}M${s} 0L${s / 2} ${h / 2}L0 ${h}`;
  return (
    <Wrap className={className} mask={mask}>
      <svg className="h-full w-full" fill="none">
        <defs>
          <pattern id={id} width={s} height={h} patternUnits="userSpaceOnUse">
            <path d={d} stroke="currentColor" strokeOpacity={opacity} strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </Wrap>
  );
}

/** Two overlapping circles; the overlap is tinted. Echoes the ring in the logo. */
export function Lens({ className, mask }: Base) {
  const id = React.useId();
  return (
    <Wrap className={className} mask={mask}>
      <svg viewBox="0 0 640 560" className="h-full w-full" fill="none" stroke="currentColor">
        <defs>
          <clipPath id={id}>
            <circle cx={240} cy={280} r={196} />
          </clipPath>
        </defs>
        <circle cx={400} cy={280} r={196} fill="currentColor" fillOpacity={0.035} stroke="none" clipPath={`url(#${id})`} />
        <circle cx={240} cy={280} r={196} strokeOpacity={0.16} />
        <circle cx={400} cy={280} r={196} strokeOpacity={0.16} />
        <circle cx={320} cy={280} r={262} strokeOpacity={0.1} strokeDasharray="2 8" />
        <path d="M320 40V520M60 280H580" strokeOpacity={0.07} />
        <rect x={317} y={277} width={6} height={6} fill="currentColor" fillOpacity={0.5} stroke="none" />
      </svg>
    </Wrap>
  );
}

/** Squares sharing one corner, like stacked layers. */
export function StackedSquares({ className, mask }: Base) {
  const sizes = [64, 112, 160, 208, 256];
  return (
    <Wrap className={className} mask={mask}>
      <svg viewBox="0 0 256 256" preserveAspectRatio="xMaxYMin meet" className="h-full w-full" fill="none" stroke="currentColor">
        <rect x={256 - 64} y={0} width={64} height={64} fill="currentColor" fillOpacity={0.04} stroke="none" />
        {sizes.map((n, i) => (
          <rect key={n} x={256 - n + 0.5} y={0.5} width={n - 1} height={n - 1} rx={i === 0 ? 0 : 2} strokeOpacity={0.12 - i * 0.015} />
        ))}
      </svg>
    </Wrap>
  );
}

/** Quarter circles radiating from the top-right corner. */
export function Arcs({ className, mask }: Base) {
  const radii = [56, 104, 152, 200, 248];
  return (
    <Wrap className={className} mask={mask}>
      <svg viewBox="0 0 256 256" preserveAspectRatio="xMaxYMin meet" className="h-full w-full" fill="none" stroke="currentColor">
        {radii.map((r, i) => (
          <path key={r} d={`M${256 - r} 0A${r} ${r} 0 0 0 256 ${r}`} strokeOpacity={0.16 - i * 0.02} strokeDasharray={i === 2 ? "2 7" : undefined} />
        ))}
        <path d="M0 0H256V256" strokeOpacity={0.05} />
      </svg>
    </Wrap>
  );
}

/** Small square joints where a section rule meets the column rails. */
export function RailNodes() {
  const node = "absolute top-0 hidden size-[7px] -translate-y-1/2 border border-white/25 bg-black min-[1280px]:block";
  return (
    <>
      <span aria-hidden className={cn(node, "left-[calc(50%-620px-3.5px)]")} />
      <span aria-hidden className={cn(node, "left-[calc(50%+620px-3.5px)]")} />
    </>
  );
}

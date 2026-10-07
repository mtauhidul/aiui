/** Layered geometric backdrop: grid, glow, orbit rings, scan line and grain. Purely decorative. */
export function HeroBackground() {
  const rings = [120, 210, 300, 400, 520];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade" />

      <div className="absolute left-[64%] top-[22%] size-[44rem] -translate-x-1/2 rounded-full bg-glow blur-[120px]" />
      <div className="absolute -left-48 top-[46%] size-[30rem] rounded-full bg-iris/15 blur-[130px]" />

      <svg
        viewBox="-550 -550 1100 1100"
        fill="none"
        className="mask-fade absolute left-[64%] top-[38%] w-[1100px] max-w-none -translate-x-1/2 -translate-y-1/2 text-foreground"
      >
        {rings.map((r) => (
          <circle key={r} r={r} stroke="currentColor" strokeOpacity={0.1} />
        ))}
        <path d="M-550 0H550M0 -550V550" stroke="currentColor" strokeOpacity={0.12} />
        <path d="M-390 -390 390 390M390 -390-390 390" stroke="currentColor" strokeOpacity={0.06} />

        {/* tick marks along both axes */}
        {Array.from({ length: 21 }, (_, i) => (i - 10) * 50).map((v) => (
          <g key={v} stroke="currentColor" strokeOpacity={0.22}>
            <path d={`M${v} -5V5`} />
            <path d={`M-5 ${v}H5`} />
          </g>
        ))}

        <g className="animate-orbit">
          <circle r={300} stroke="currentColor" strokeOpacity={0.45} strokeDasharray="2 9" />
          <circle cx={300} r={18} className="fill-accent" fillOpacity={0.18} />
          <circle cx={300} r={5} className="fill-accent" />
        </g>
        <g className="animate-orbit-slow">
          <circle r={400} stroke="currentColor" strokeOpacity={0.3} strokeDasharray="1 14" />
          <rect x={-5} y={-405} width={10} height={10} className="fill-iris" />
        </g>
        <circle r={4} className="fill-foreground" fillOpacity={0.6} />
      </svg>

      <div className="animate-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="grain absolute inset-0" />
    </div>
  );
}

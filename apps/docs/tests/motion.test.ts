import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Policy: anything that moves, scales, slides, resizes or loops must opt out under
// prefers-reduced-motion. Color and opacity fades are allowed to stay.
const NEEDS_ANIMATE_OPT_OUT = /(^|\s)animate-(pulse|spin|bounce|ping)(\s|$)/;
const NEEDS_TRANSITION_OPT_OUT = /(^|\s)transition-(transform|\[height\]|\[width\]|\[scale,opacity\])(\s|$)/;

/** Returns the class strings that animate but have no reduced-motion counterpart. */
export function findMotionViolations(source: string) {
  const bad: string[] = [];
  for (const [, , literal] of source.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g)) {
    if (NEEDS_ANIMATE_OPT_OUT.test(literal) && !literal.includes("motion-reduce:animate-none")) bad.push(literal);
    if (NEEDS_TRANSITION_OPT_OUT.test(literal) && !literal.includes("motion-reduce:transition-none")) bad.push(literal);
  }
  return bad;
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : /\.(tsx|ts)$/.test(name) ? [full] : [];
  });
}

describe("prefers-reduced-motion policy", () => {
  it("detects animations without an opt-out (checker self-test)", () => {
    expect(findMotionViolations('<i className="animate-pulse rounded" />')).toHaveLength(1);
    expect(findMotionViolations('<i className="transition-transform rotate-90" />')).toHaveLength(1);
    expect(findMotionViolations('<i className="transition-[height] duration-200" />')).toHaveLength(1);
    expect(findMotionViolations('<i className="animate-pulse motion-reduce:animate-none" />')).toHaveLength(0);
    expect(findMotionViolations('<i className="transition-transform motion-reduce:transition-none" />')).toHaveLength(0);
    // colour and opacity fades are fine
    expect(findMotionViolations('<i className="transition-colors transition-opacity" />')).toHaveLength(0);
  });

  it.each(["src/registry", "src/components"])("every moving class in %s opts out under reduced motion", (dir) => {
    const root = path.resolve(__dirname, "..", dir);
    const violations = files(root).flatMap((file) =>
      findMotionViolations(readFileSync(file, "utf8")).map((v) => `${path.relative(root, file)}: ${v.slice(0, 80)}`),
    );
    expect(violations).toEqual([]);
  });
});

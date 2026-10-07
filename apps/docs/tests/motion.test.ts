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

/** Returns the `animation` declarations that are not inside a `prefers-reduced-motion: no-preference` block. */
export function findUngatedAnimations(css: string) {
  const bad: string[] = [];
  const stack: boolean[] = []; // true when the enclosing block is a no-preference media query
  let buf = "";
  for (const ch of css) {
    if (ch === "{") {
      const prelude = buf.trim();
      stack.push(/@media[^{]*prefers-reduced-motion:\s*no-preference/.test(prelude) || (stack[stack.length - 1] ?? false));
      buf = "";
    } else if (ch === "}") {
      stack.pop();
      buf = "";
    } else if (ch === ";") {
      const decl = buf.trim();
      if (/^animation(-name)?\s*:/.test(decl) && !/:\s*none\b/.test(decl) && !(stack[stack.length - 1] ?? false)) bad.push(decl);
      buf = "";
    } else buf += ch;
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

  it("gates every CSS animation behind prefers-reduced-motion: no-preference (checker self-test)", () => {
    expect(findUngatedAnimations(".a{animation: x 1s infinite;}")).toHaveLength(1);
    expect(findUngatedAnimations("@media (prefers-reduced-motion: no-preference){.a{animation: x 1s infinite;}}")).toHaveLength(0);
    expect(findUngatedAnimations("@media (prefers-reduced-motion: reduce){.a{animation: none;}}")).toHaveLength(0);
    expect(findUngatedAnimations("@media (min-width: 1px){.a{animation: x 1s;}}")).toHaveLength(1);
  });

  it("globals.css only animates inside a no-preference media query", () => {
    const css = readFileSync(path.resolve(__dirname, "../src/app/globals.css"), "utf8");
    expect(findUngatedAnimations(css)).toEqual([]);
  });

  it.each(["src/registry", "src/components"])("every moving class in %s opts out under reduced motion", (dir) => {
    const root = path.resolve(__dirname, "..", dir);
    const violations = files(root).flatMap((file) =>
      findMotionViolations(readFileSync(file, "utf8")).map((v) => `${path.relative(root, file)}: ${v.slice(0, 80)}`),
    );
    expect(violations).toEqual([]);
  });
});

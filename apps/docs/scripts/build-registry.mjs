// Builds public/r from registry.json. Items depend on each other by bare name in the source file,
// but shadcn resolves bare names against its own registry, so they are rewritten to absolute URLs
// of this registry here. Keep the base-URL rule in sync with next.config.ts.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const base = (
  process.env.NEXT_PUBLIC_REGISTRY_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const names = new Set(registry.items.map((item) => item.name));

registry.homepage = base;
for (const item of registry.items) {
  if (!item.registryDependencies) continue;
  item.registryDependencies = item.registryDependencies.map((dep) => {
    if (/^(https?:|@)/.test(dep)) return dep;
    if (!names.has(dep)) throw new Error(`${item.name} depends on unknown registry item "${dep}"`);
    return `${base}/r/${dep}.json`;
  });
}

const out = "registry.generated.json";
writeFileSync(out, JSON.stringify(registry, null, 2));
try {
  execFileSync("pnpm", ["exec", "shadcn", "build", out, "-o", "public/r"], { stdio: "inherit" });
} finally {
  rmSync(out, { force: true });
}
console.log(`registry built for ${base}`);

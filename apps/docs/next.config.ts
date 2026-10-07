import type { NextConfig } from "next";

// Absolute origin used in install commands and registry dependencies. Keep in sync with scripts/build-registry.mjs.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const registryUrl = (
  process.env.NEXT_PUBLIC_REGISTRY_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_REGISTRY_URL: registryUrl },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

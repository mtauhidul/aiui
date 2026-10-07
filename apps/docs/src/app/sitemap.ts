import type { MetadataRoute } from "next";
import { docs } from "@/content/components";
import { REGISTRY_URL } from "@/lib/registry-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: REGISTRY_URL, priority: 1 },
    ...docs.map((d) => ({ url: `${REGISTRY_URL}/docs/${d.slug}`, priority: 0.7 })),
  ];
}

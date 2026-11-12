import type { MetadataRoute } from "next";
import { residences } from "@/config/residences";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...residences.map((r) => ({ url: `${site.url}/residences/${r.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...site.legal.map((l) => ({ url: `${site.url}${l.href}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CATEGORIES, CATEGORY_KEYS, getAllQuestions } from "@/lib/questions";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/questions`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...CATEGORY_KEYS.map((k) => ({
      url: `${SITE.url}/categories/${CATEGORIES[k].slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllQuestions().map((q) => ({
      url: `${SITE.url}/questions/${q.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

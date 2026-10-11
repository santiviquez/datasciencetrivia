import type { MetadataRoute } from "next";
import { SITE, CONTENT_UPDATED, ABOUT_UPDATED } from "@/lib/site";
import { CATEGORIES, CATEGORY_KEYS, getAllQuestions } from "@/lib/questions";
import { QUIZ_SLUGS } from "@/lib/quiz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);

  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/questions`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(ABOUT_UPDATED),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    { url: `${SITE.url}/ai-history`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/quiz`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...QUIZ_SLUGS.map((s) => ({
      url: `${SITE.url}/quiz/${s}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
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

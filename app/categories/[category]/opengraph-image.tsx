import { OG_SIZE, cardImage } from "@/lib/og";
import { CATEGORIES, CATEGORY_KEYS, getCategoryBySlug, getQuestionsByCategory } from "@/lib/questions";

export const alt = "Data Science Trivia interview questions";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CATEGORY_KEYS.map((k) => ({ category: CATEGORIES[k].slug }));
}

export default async function CategoryOgImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const key = getCategoryBySlug(category) ?? "ml";
  return cardImage({
    category: key,
    title: `${getQuestionsByCategory(key).length} ${CATEGORIES[key].name} interview questions`,
    subtitle: CATEGORIES[key].blurb,
  });
}

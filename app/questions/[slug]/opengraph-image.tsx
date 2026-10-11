import { OG_SIZE, cardImage } from "@/lib/og";
import { getAllQuestions, getQuestionBySlug } from "@/lib/questions";

export const alt = "A Data Science Trivia question";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export default async function QuestionOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  return cardImage({
    category: q?.category ?? "ml",
    title: q?.question ?? "Data Science Trivia",
    subtitle: "Know the answer? Flip the card.",
  });
}

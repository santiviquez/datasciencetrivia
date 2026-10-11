import { OG_SIZE, cardImage } from "@/lib/og";
import { QUESTIONS_PER_QUIZ, QUIZZES, QUIZ_SLUGS, isQuizSlug } from "@/lib/quiz";

export const alt = "A Data Science Trivia quiz";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return QUIZ_SLUGS.map((slug) => ({ slug }));
}

export default async function QuizOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = QUIZZES[isQuizSlug(slug) ? slug : "data-science"];
  return cardImage({
    category: quiz.categories[0],
    label: quiz.name,
    title: `Can you get ${QUESTIONS_PER_QUIZ}/${QUESTIONS_PER_QUIZ}?`,
    subtitle: `${QUESTIONS_PER_QUIZ} questions. ${quiz.blurb}`,
  });
}

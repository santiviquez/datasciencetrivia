import { OG_SIZE, cardImage } from "@/lib/og";
import { QUESTIONS_PER_QUIZ, QUIZ_SLUGS } from "@/lib/quiz";

export const alt = "Data science, machine learning and AI quizzes";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function QuizIndexOgImage() {
  return cardImage({
    category: "ml",
    label: "Quizzes",
    title: "Data science, ML and AI quizzes",
    subtitle: `${QUIZ_SLUGS.length} quizzes, ${QUESTIONS_PER_QUIZ} questions each, answers included.`,
  });
}

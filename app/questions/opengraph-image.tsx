import { OG_SIZE, cardImage } from "@/lib/og";
import { CATEGORY_KEYS, QUESTION_COUNT } from "@/lib/questions";

export const alt = "Data science interview questions and answers";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function QuestionsOgImage() {
  return cardImage({
    category: "stats",
    label: "All questions",
    title: `${QUESTION_COUNT} data science interview questions`,
    subtitle: `With answers, across ${CATEGORY_KEYS.length} categories.`,
  });
}

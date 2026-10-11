import { OG_SIZE, cardImage } from "@/lib/og";
import { QUESTION_COUNT } from "@/lib/questions";

export const alt = "About Data Science Trivia";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function AboutOgImage() {
  return cardImage({
    category: "genai",
    label: "About",
    title: "Data Science Trivia",
    subtitle: `${QUESTION_COUNT} free flashcards by Santiago Víquez, kept up by an AI agent.`,
  });
}

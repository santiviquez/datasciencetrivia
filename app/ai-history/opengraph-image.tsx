import { OG_SIZE, cardImage } from "@/lib/og";
import { TIMELINE_SPAN, getTimeline } from "@/lib/timeline";

export const alt = "The history of AI as a timeline";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function AiHistoryOgImage() {
  return cardImage({
    category: "history",
    title: `The history of AI, ${TIMELINE_SPAN.from} to ${TIMELINE_SPAN.to}`,
    subtitle: `${getTimeline().length} milestones from Bayes to the Transformer and ChatGPT.`,
  });
}

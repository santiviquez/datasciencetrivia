import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Confidence interval calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function ConfidenceIntervalOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Confidence interval calculator",
    subtitle: "The interval and margin of error for a mean or a proportion, at any confidence level.",
  });
}

import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Z-score calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function ZScoreOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Z-score calculator",
    subtitle: "Z score, percentile and tail probabilities from a value, mean and standard deviation.",
  });
}

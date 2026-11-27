import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Binomial distribution calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function BinomialOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Binomial distribution calculator",
    subtitle: "Exact and cumulative binomial probabilities, with the working.",
  });
}

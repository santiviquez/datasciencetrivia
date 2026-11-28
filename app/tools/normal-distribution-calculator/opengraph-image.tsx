import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Normal distribution calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function NormalOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Normal distribution calculator",
    subtitle: "Probability between two values and inverse normal, with the working.",
  });
}

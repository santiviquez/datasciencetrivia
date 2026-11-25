import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Standard deviation calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function StandardDeviationOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Standard deviation calculator",
    subtitle: "Sample and population standard deviation, variance and mean from a list of numbers, with the steps.",
  });
}

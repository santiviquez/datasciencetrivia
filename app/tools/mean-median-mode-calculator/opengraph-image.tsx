import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Mean, median and mode calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function MeanMedianModeOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "Mean, median and mode calculator",
    subtitle: "Mean, median, mode, range and quartiles from a list of numbers, with the working.",
  });
}

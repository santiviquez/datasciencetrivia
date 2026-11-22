import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "P-value calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function PValueOgImage() {
  return cardImage({
    category: "stats",
    label: "Tools",
    title: "P-value calculator",
    subtitle: "Two-tailed and one-tailed p-values from a z, t, chi-square or F statistic.",
  });
}

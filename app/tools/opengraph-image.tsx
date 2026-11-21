import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Free data science and machine learning calculators";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function ToolsOgImage() {
  return cardImage({
    category: "ml",
    label: "Tools",
    title: "Data science calculators",
    subtitle: "Free, in your browser, with every formula worked out.",
  });
}

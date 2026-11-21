import { OG_SIZE, cardImage } from "@/lib/og";

export const alt = "Confusion matrix calculator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function ConfusionMatrixOgImage() {
  return cardImage({
    category: "ml",
    label: "Tools",
    title: "Confusion matrix calculator",
    subtitle: "Precision, recall, F1, MCC, kappa and 9 more metrics from TP, FP, FN and TN.",
  });
}

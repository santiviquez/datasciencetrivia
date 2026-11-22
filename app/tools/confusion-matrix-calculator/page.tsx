import ConfusionMatrixCalculator from "@/components/ConfusionMatrixCalculator";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import { EXAMPLE_COUNTS, METRICS, formatMetric, total } from "@/lib/metrics";

const SLUG = "confusion-matrix-calculator";
const TITLE = "Confusion Matrix Calculator: Precision, Recall, F1, MCC and More";
const DESCRIPTION =
  "Free confusion matrix calculator. Enter true positives, false positives, false negatives and true negatives to get accuracy, precision, recall, F1 score, specificity, MCC, Cohen's kappa and 7 more metrics, with every formula worked out.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

function value(key: string) {
  const m = METRICS.find((d) => d.key === key)!;
  return m.compute(EXAMPLE_COUNTS);
}

const FAQ: Faq[] = [
  {
    q: "How do you calculate precision and recall?",
    a: "Precision = TP / (TP + FP). Recall = TP / (TP + FN). Neither uses true negatives.",
  },
  {
    q: "Which metric should I use on imbalanced data?",
    a: "Not accuracy. Use MCC or balanced accuracy for one number, or F1 if only the positive class matters.",
  },
  {
    q: "What about more than two classes?",
    a: "Treat each class as positive and the rest as negative, compute per class, then macro- or micro-average.",
  },
];

export default function ConfusionMatrixCalculatorPage() {
  const n = total(EXAMPLE_COUNTS);
  const { tp, fn } = EXAMPLE_COUNTS;

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro={`Enter the four counts. Get ${METRICS.length} metrics, with the working shown.`}
      features={METRICS.map((m) => m.name)}
      example={
        <>
          A fraud model checks {n.toLocaleString("en-US")} transactions, {tp + fn} of them fraud. Accuracy is{" "}
          {formatMetric(value("accuracy"), 2)}, but a model that flags nothing scores 0.95. Precision (
          {formatMetric(value("precision"), 2)}) and MCC ({formatMetric(value("mcc"), 2)}) tell the real story.
        </>
      }
      faq={FAQ}
    >
      <ConfusionMatrixCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

import Link from "next/link";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import ConfidenceIntervalCalculator from "@/components/ConfidenceIntervalCalculator";
import { meanInterval } from "@/lib/stats";

const SLUG = "confidence-interval-calculator";
const TITLE = "Confidence Interval Calculator for a Mean or Proportion";
const DESCRIPTION =
  "Free confidence interval calculator. Enter a mean, standard deviation and sample size, or a proportion, to get the 95% interval and its margin of error.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "How do I calculate a 95% confidence interval?",
    a: "Take the sample mean plus or minus a critical value times the standard error, s/√n. The critical value is 1.96 for large samples and a little more, from the t distribution, for small ones.",
  },
  {
    q: "Should I use t or z?",
    a: "Use t when the standard deviation comes from the sample, which is nearly always. Use z when the population standard deviation is known. Past a few hundred observations the two barely differ.",
  },
  {
    q: "What does 95% confidence mean?",
    a: "The method captures the true value in 95% of repeated samples. It is not a 95% chance that this one interval contains it.",
  },
];

export default function ConfidenceIntervalCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const ci = meanInterval("t", 32, 10, 100, 0.95);

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Enter a sample's mean, standard deviation and size, or a count of successes. Get the confidence interval and its margin of error."
      features={[
        "Confidence interval for a mean, with t or z",
        "Confidence interval for a proportion, normal or Wilson",
        "Any confidence level",
        "Margin of error",
        "Working shown step by step",
      ]}
      example={
        <>
          100 deliveries take 32 minutes on average, with a standard deviation of 10. The 95%{" "}
          <Link
            href="/questions/what-is-a-confidence-interval"
            className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
          >
            confidence interval
          </Link>{" "}
          for the mean is 32 ± {ci.critical.toFixed(3)} × 10/√100, which runs from {ci.lower.toFixed(2)} to{" "}
          {ci.upper.toFixed(2)} minutes.
        </>
      }
      faq={FAQ}
    >
      <ConfidenceIntervalCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

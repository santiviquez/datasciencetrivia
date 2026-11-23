import Link from "next/link";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import ZScoreCalculator from "@/components/ZScoreCalculator";
import { lowerTail } from "@/lib/stats";

const SLUG = "z-score-calculator";
const TITLE = "Z-Score Calculator: Z Score, Percentile and Probability";
const DESCRIPTION =
  "Free z-score calculator. Enter a value, mean and standard deviation to get the z score, its percentile and the probability above, below and in both tails.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "What is a z score?",
    a: "How many standard deviations a value sits above or below the mean: z = (value − mean) / standard deviation. A z score of 0 is the mean, and a negative one is below it.",
  },
  {
    q: "How do I turn a z score into a percentile?",
    a: "Type it into the z score cell. The Below figure is the percentile: z = 1 is about the 84th percentile, and z = 1.96 the 97.5th.",
  },
  {
    q: "Does a z score need a normal distribution?",
    a: "The z score does not. The percentile and the probabilities do: they assume the values follow a normal distribution.",
  },
];

export default function ZScoreCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const below = lowerTail("z", (85 - 70) / 10);

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Enter a value, the mean and the standard deviation. Get the z score and its percentile."
      features={[
        "Z score from a value, mean and standard deviation",
        "Value from a z score",
        "Percentile",
        "Probability below, above and in both tails",
        "Shaded normal curve",
      ]}
      example={
        <>
          An exam has a mean of 70 and a standard deviation of 10, so a score of 85 has z = (85 − 70) / 10 = 1.5. If
          scores follow a{" "}
          <Link
            href="/questions/what-two-parameters-defined-a-normal-distribution"
            className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
          >
            normal distribution
          </Link>
          , that beats {(below * 100).toFixed(1)}% of them.
        </>
      }
      faq={FAQ}
    >
      <ZScoreCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

import Link from "next/link";
import PValueCalculator from "@/components/PValueCalculator";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import { twoTail } from "@/lib/stats";

const SLUG = "p-value-calculator";
const TITLE = "P-Value Calculator: From a z, t, Chi-Square or F Statistic";
const DESCRIPTION =
  "Free p-value calculator. Enter a z, t, chi-square or F statistic and its degrees of freedom to get two-tailed and one-tailed p-values and critical values.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "What does a p-value mean?",
    a: "The probability of a result at least as extreme as yours if the null hypothesis is true. It is not the probability that the null hypothesis is true.",
  },
  {
    q: "One-tailed or two-tailed?",
    a: "Two-tailed, unless you predicted the direction before seeing the data. Chi-square and F tests use the right tail.",
  },
  {
    q: "How do I get a p-value from a z score?",
    a: "Pick z and enter the score. z = 1.96 gives a two-tailed p-value of 0.05.",
  },
];

export default function PValueCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const p = twoTail("t", 2.02, [47]);

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Enter a test statistic. Get the p-value for each tail, and the critical values."
      features={[
        "Two-tailed p-value",
        "Right-tailed p-value",
        "Left-tailed p-value",
        "Critical values at 0.10, 0.05 and 0.01",
        "z, t, chi-square and F distributions",
      ]}
      example={
        <>
          Two page designs are each shown to 25 users, and{" "}
          <Link href="/questions/what-is-a-t-test" className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current">
            Welch&apos;s t-test
          </Link>{" "}
          gives t = 2.02 with 47 degrees of freedom. The two-tailed p-value is {p.toFixed(3)}: under 0.05, but only
          just, so report the confidence interval too.
        </>
      }
      faq={FAQ}
    >
      <PValueCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

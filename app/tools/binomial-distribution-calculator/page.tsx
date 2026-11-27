import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import BinomialCalculator from "@/components/BinomialCalculator";
import { binomialLower, binomialPmf, binomialUpper } from "@/lib/stats";

const SLUG = "binomial-distribution-calculator";
const TITLE = "Binomial Distribution Calculator: Exact and Cumulative Probability";
const DESCRIPTION =
  "Free binomial distribution calculator. Enter trials, probability and successes to get exact and cumulative probabilities (binompdf, binomcdf), with the working.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "What is the binomial probability formula?",
    a: "P(X = x) = C(n, x) × p^x × (1 − p)^(n − x), where n is the number of trials, x the number of successes and p the chance of success on each trial. C(n, x) = n! / (x! × (n − x)!) counts the ways to pick which trials succeed. The mean is n × p and the variance is n × p × (1 − p).",
  },
  {
    q: "When can I use the binomial distribution?",
    a: "When the number of trials is fixed, each trial either succeeds or fails, the trials are independent and the chance of success is the same every time. Drawing without replacement from a small group breaks independence; that is the hypergeometric distribution.",
  },
  {
    q: "Which results match binompdf and binomcdf on a TI-84?",
    a: "binompdf(n, p, x) is the Exactly row, P(X = x). binomcdf(n, p, x) is the At most row, P(X ≤ x). At least x is 1 − binomcdf(n, p, x − 1).",
  },
];

export default function BinomialCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const [n, p, x] = [20, 0.1, 2];
  const four = (v: number) => v.toFixed(4);
  const sup = (v: number) => String(v).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]);

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Enter the trials, the chance of success and the number of successes. Get the exact and cumulative probabilities, with the working."
      features={[
        "Exact probability P(X = x), as binompdf",
        "Cumulative probability P(X ≤ x), as binomcdf",
        "Fewer than, at least and more than x successes",
        "Mean, variance and standard deviation",
        "Bar chart of the distribution",
        "Working for every result",
      ]}
      example={
        <>
          An email converts {p * 100}% of the people who get it, and it goes to {n} people. The chance that exactly {x}{" "}
          convert is C({n}, {x}) × {p}{sup(x)} × {1 - p}{sup(n - x)} = {four(binomialPmf(x, n, p))}. At most {x} convert with probability{" "}
          {four(binomialLower(x, n, p))}, and at least {x} with {four(binomialUpper(x, n, p))}. On average {n * p} convert.
        </>
      }
      faq={FAQ}
    >
      <BinomialCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

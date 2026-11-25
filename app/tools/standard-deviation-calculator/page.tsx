import Link from "next/link";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import StandardDeviationCalculator from "@/components/StandardDeviationCalculator";
import { spread, variance } from "@/lib/stats";

const SLUG = "standard-deviation-calculator";
const TITLE = "Standard Deviation Calculator: Sample and Population";
const DESCRIPTION =
  "Free standard deviation calculator. Paste a list of numbers to get the sample and population standard deviation, variance and mean, with every step shown.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "How do I calculate standard deviation?",
    a: "Find the mean, square each value's distance from it and add the squares up. Divide by n − 1 for a sample or by n for a population, then take the square root.",
  },
  {
    q: "Sample or population standard deviation?",
    a: "Use the sample version, which divides by n − 1, when your numbers are a sample of something larger. Use the population version when they are the whole group.",
  },
  {
    q: "What is the difference between variance and standard deviation?",
    a: "The standard deviation is the square root of the variance. It is in the same units as the data, which is why it is the one usually reported.",
  },
];

export default function StandardDeviationCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const stats = spread([2, 4, 4, 4, 5, 5, 7, 9]);
  const population = Math.sqrt(variance(stats, false));
  const sample = Math.sqrt(variance(stats, true));

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Paste or type a list of numbers. Get the standard deviation, variance and mean, with the steps."
      features={[
        "Sample standard deviation",
        "Population standard deviation",
        "Variance, mean and sum of squares",
        "Standard error of the mean",
        "Working shown step by step",
        "Dot plot with the mean and one standard deviation",
      ]}
      example={
        <>
          The numbers 2, 4, 4, 4, 5, 5, 7 and 9 have a mean of {stats.mean}, and their squared distances from it add up
          to {stats.ss}. As a whole population their{" "}
          <Link
            href="/questions/measures-how-far-a-set-of-random-numbers-are-spread-out-from-their-average-value"
            className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
          >
            standard deviation
          </Link>{" "}
          is √({stats.ss}/{stats.n}) = {population}. As a sample it is √({stats.ss}/{stats.n - 1}) = {sample.toFixed(2)}.
        </>
      }
      faq={FAQ}
    >
      <StandardDeviationCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

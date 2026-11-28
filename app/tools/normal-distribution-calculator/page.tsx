import Link from "next/link";
import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import NormalCalculator from "@/components/NormalCalculator";
import { lowerTail, normalBetween, upperQuantile } from "@/lib/stats";

const SLUG = "normal-distribution-calculator";
const TITLE = "Normal Distribution Calculator: Probability and Inverse Normal";
const DESCRIPTION =
  "Free normal distribution calculator. Probability below, between or above any values (normalcdf), and the value for a probability (invNorm), with the working.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "How do I find the probability between two values?",
    a: "Turn each value into a z score, z = (value − mean) / standard deviation, and subtract the two cumulative probabilities: P(a < X < b) = Φ(z of b) − Φ(z of a). For one tail, leave From or To empty.",
  },
  {
    q: "How do I find a value from a probability (inverse normal)?",
    a: "Type it into the Probability cell and choose a row. Below gives the value with that share of the distribution under it, Above the value with that share over it, and Between the middle stretch around the mean.",
  },
  {
    q: "Which results match normalcdf and invNorm on a TI-84?",
    a: "normalcdf(lower, upper, μ, σ) is the Between row. Leave From empty where a TI-84 needs −1E99, and To empty where it needs 1E99. invNorm(area, μ, σ) is the To value after typing the area into Probability with Below chosen.",
  },
];

export default function NormalCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const [mean, sd, from, to] = [70, 10, 60, 85];
  const [za, zb] = [(from - mean) / sd, (to - mean) / sd];
  const four = (v: number) => v.toFixed(4);
  const minus = (v: number) => String(v).replace("-", "−");
  const top = mean - upperQuantile("z", 0.9) * sd;

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Enter the mean, the standard deviation and one or two values. Get the probability below, between and above them, or type a probability to get the values."
      features={[
        "Probability below, between, above and outside two values, as normalcdf",
        "Inverse normal: values from a probability, as invNorm",
        "Left tail, right tail and the middle",
        "Shaded normal curve",
        "Z scores and the working for every result",
      ]}
      example={
        <>
          Exam scores follow a{" "}
          <Link
            href="/questions/what-two-parameters-defined-a-normal-distribution"
            className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
          >
            normal distribution
          </Link>{" "}
          with mean {mean} and standard deviation {sd}. The values {from} and {to} have z scores of {minus(za)} and {minus(zb)}, so the
          share of scores between them is Φ({minus(zb)}) − Φ({minus(za)}) = {four(lowerTail("z", zb))} − {four(lowerTail("z", za))} ={" "}
          {four(normalBetween(za, zb))}. Going the other way, a probability of 0.9 with Below chosen gives {top.toFixed(1)}: the score
          that beats 90% of the class.
        </>
      }
      faq={FAQ}
    >
      <NormalCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

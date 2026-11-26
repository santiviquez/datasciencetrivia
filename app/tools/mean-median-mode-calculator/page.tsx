import ToolPage, { toolLook, toolMetadata, type Faq } from "@/components/ToolPage";
import MeanMedianModeCalculator from "@/components/MeanMedianModeCalculator";
import { modes, sampleQuantile, spread } from "@/lib/stats";

const SLUG = "mean-median-mode-calculator";
const TITLE = "Mean, Median, Mode and Range Calculator";
const DESCRIPTION =
  "Free mean, median, mode and range calculator. Paste a list of numbers to get all four, plus the quartiles and interquartile range, with the working shown.";

export const metadata = toolMetadata(SLUG, TITLE, DESCRIPTION);

const FAQ: Faq[] = [
  {
    q: "How do you find the mean, median and mode?",
    a: "Mean: add the numbers up and divide by how many there are. Median: sort them and take the middle one, or the average of the two middle ones. Mode: the value that appears most often.",
  },
  {
    q: "When should I use the median instead of the mean?",
    a: "When the data is skewed or has outliers, as incomes and house prices do. One extreme value drags the mean with it and barely moves the median.",
  },
  {
    q: "Can a data set have more than one mode, or none?",
    a: "Yes. When two or more values tie for most frequent, each one is a mode. When no value repeats, there is no mode.",
  },
];

export default function MeanMedianModeCalculatorPage() {
  // The numbers the calculator opens on, so the text can't drift from the tool.
  const sorted = [2, 4, 4, 4, 5, 5, 7, 9];
  const { n, sum, mean } = spread(sorted);
  const [low, high] = [sorted[n / 2 - 1], sorted[n / 2]];
  const [mode] = modes(sorted).values;
  const [min, max] = [sorted[0], sorted[n - 1]];

  return (
    <ToolPage
      slug={SLUG}
      description={DESCRIPTION}
      intro="Paste or type a list of numbers. Get the mean, median, mode and range, with the working."
      features={[
        "Mean (average)",
        "Median",
        "Mode, including ties",
        "Range, minimum and maximum",
        "Quartiles and interquartile range",
        "Dot plot of the data",
      ]}
      example={
        <>
          The numbers 2, 4, 4, 4, 5, 5, 7 and 9 add up to {sum}, so their mean is {sum} / {n} = {mean}. The two middle
          values are {low} and {high}, which puts the median at {sampleQuantile(sorted, 0.5)}. The mode is {mode}, the
          value that appears most often, and the range is {max} − {min} = {max - min}.
        </>
      }
      faq={FAQ}
    >
      <MeanMedianModeCalculator look={toolLook(SLUG)} />
    </ToolPage>
  );
}

import type { CategoryKey } from "./questions";

/**
 * Free calculators. A different kind of page from the flashcards: people
 * search for tools far more than for definitions, and each tool links to the
 * cards that explain what its numbers mean.
 */
export interface Tool {
  slug: string;
  name: string;
  blurb: string;
  category: CategoryKey;
  /**
   * The flashcards that explain the tool's numbers, as [card slug, short
   * label]. The tool page lists them, and each of those cards links back.
   */
  cards: [slug: string, label: string][];
}

export const TOOLS: Tool[] = [
  {
    slug: "confusion-matrix-calculator",
    name: "Confusion matrix calculator",
    blurb: "Precision, recall, F1, MCC and 10 more.",
    category: "ml",
    cards: [
      ["what-is-a-confusion-matrix", "Confusion matrix"],
      ["what-is-the-difference-between-precision-and-recall", "Precision vs recall"],
      ["what-is-f1-score", "F1 score"],
      ["what-is-the-difference-between-sensitivity-and-specificity", "Sensitivity vs specificity"],
      ["what-is-the-matthews-correlation-coefficient", "MCC"],
      ["what-is-cohens-kappa", "Cohen's kappa"],
    ],
  },
  {
    slug: "p-value-calculator",
    name: "P-value calculator",
    blurb: "From a z, t, chi-square or F statistic.",
    category: "stats",
    cards: [
      ["what-is-a-p-value", "P-value"],
      ["what-is-a-t-test", "t-test"],
      ["what-is-a-chi-square-test", "Chi-square test"],
      ["what-is-anova", "ANOVA"],
      ["what-is-a-z-test", "z-test"],
      ["what-does-it-mean-for-a-result-to-be-statistically-significant", "Statistical significance"],
    ],
  },
  {
    slug: "z-score-calculator",
    name: "Z-score calculator",
    blurb: "Z score, percentile and tail probabilities.",
    category: "stats",
    cards: [
      ["what-two-parameters-defined-a-normal-distribution", "Normal distribution"],
      ["measures-how-far-a-set-of-random-numbers-are-spread-out-from-their-average-value", "Standard deviation"],
      ["what-is-a-z-test", "z-test"],
      ["what-is-a-p-value", "P-value"],
      ["values-distant-from-most-other-values-are", "Outliers"],
      ["standardization-of-features-is-required-before-training-a-logistic-regression", "Standardization"],
    ],
  },
  {
    slug: "confidence-interval-calculator",
    name: "Confidence interval calculator",
    blurb: "For a mean or a proportion, at any level.",
    category: "stats",
    cards: [
      ["what-is-a-confidence-interval", "Confidence interval"],
      ["the-normal-distribution-derives-its-importance-from-which-famous-theorem", "Central limit theorem"],
      ["what-is-a-t-test", "t-test"],
      ["what-is-a-z-test", "z-test"],
      ["what-is-bootstrapping-in-statistics", "Bootstrapping"],
      ["what-does-it-mean-for-a-result-to-be-statistically-significant", "Statistical significance"],
    ],
  },
];

export const TOOLS_UPDATED = "2026-11-24";

export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}

/** The calculators a card's page should point to. */
export function toolsForCard(cardSlug: string): Tool[] {
  return TOOLS.filter((t) => t.cards.some(([slug]) => slug === cardSlug));
}

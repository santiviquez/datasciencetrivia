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
}

export const TOOLS: Tool[] = [
  {
    slug: "confusion-matrix-calculator",
    name: "Confusion matrix calculator",
    blurb:
      "Precision, recall, F1, MCC and 10 more.",
    category: "ml",
  },
];

export const TOOLS_UPDATED = "2026-11-21";

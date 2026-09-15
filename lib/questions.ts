import raw from "../content/questions.json";
import { buildRelatedIndex, type RelatedIndex } from "./related";

/**
 * `blurb` is the one-line summary used in metadata and on the deck. `intro`
 * names the topic clusters a hub's list actually covers, for someone who
 * landed on it from a search and needs to know whether their question is in
 * here. `starters` are the cards to read first: the canonical questions of the
 * category, each one a doorway into a different cluster. `check:content`
 * fails the build if a starter id is not in the deck.
 */
export const CATEGORIES = {
  ml: {
    slug: "machine-learning",
    name: "Machine Learning",
    color: "#72D0EA",
    pattern: "/ml_pattern.svg",
    blurb:
      "Models, metrics and the tradeoffs that decide whether a model survives contact with real data.",
    intro:
      "The cards below cluster into the themes machine learning interviews keep circling back to: the bias-variance tradeoff and the regularization that moves it, picking metrics when the classes are imbalanced, cross-validation and the leakage that quietly inflates it, ensembles from bagging to boosting, and the encoding choices that decide what a model ever gets to see.",
    starters: ["ml-59", "ml-63", "ml-16", "ml-55", "ml-17"],
  },
  dl: {
    slug: "deep-learning",
    name: "Deep Learning",
    color: "#EFAAAD",
    pattern: "/dl_pattern.svg",
    blurb:
      "Neural networks from backpropagation to attention, and the tricks that make them trainable.",
    intro:
      "These cards group around what you get asked to explain at a whiteboard: activation functions and why a network is a linear model without them, gradient descent and the learning rate that makes or breaks it, dropout and batch normalization, and the architectures that stack the pieces into something useful — CNNs, LSTMs and GRUs, GANs, autoencoders, Transformers.",
    starters: ["dl-169", "dl-171", "dl-159", "dl-150", "dl-172"],
  },
  genai: {
    slug: "generative-ai",
    name: "Generative AI",
    color: "#F2C86B",
    pattern: "/genai_pattern.svg",
    blurb:
      "Large language models in practice: prompting, retrieval, evaluation and the tradeoffs behind shipping them.",
    intro:
      "Four clusters run through these cards: the decoding knobs of temperature, top-p and top-k; retrieval from chunk size through hybrid search to evaluating the pipeline; when prompting beats fine-tuning or RLHF; and the serving details that set latency and cost, like tokenization, the KV cache and how much context is actually worth paying for.",
    starters: ["genai-2", "genai-1", "genai-12", "genai-5", "genai-16"],
  },
  stats: {
    slug: "statistics",
    name: "Statistics",
    color: "#92DCCF",
    pattern: "/stats_pattern.svg",
    blurb:
      "Inference, uncertainty and the ideas that people most often get subtly wrong in interviews.",
    intro:
      "These cards cluster around inference and error: the two ways a test can be wrong, the distributions and limit theorems behind them, correlation and the confounders that fake it, regression diagnostics from residuals to R-squared, and the missing-data and dimensionality-reduction decisions that come before any of it.",
    starters: ["stats-74", "stats-88", "stats-95", "stats-80", "stats-82"],
  },
  history: {
    slug: "history",
    name: "History",
    color: "#BB92D4",
    pattern: "/hist_pattern.svg",
    blurb:
      "The people, papers and moments that built the field, from the perceptron to the Transformer.",
    intro:
      "The cards run from least squares and Bayes through the perceptron, backpropagation and MNIST to AlexNet, AlphaGo and the Transformer: the papers, datasets and people whose names turn up in interview small talk, and in the citations behind everything else in the deck.",
    starters: ["history-115", "history-126", "history-122", "history-124", "history-123"],
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type Category = (typeof CATEGORIES)[CategoryKey];

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export interface Question {
  id: string;
  category: CategoryKey;
  question: string;
  answer: string;
  /** Optional X/Twitter handle of whoever suggested the question. */
  proposedBy?: string;
  /**
   * Stored so a URL survives rewording the question. Generated at import time;
   * omit it and one is derived from the question text.
   */
  slug?: string;
}

export interface QuestionWithSlug extends Question {
  slug: string;
}

/**
 * URL slug derived from the question text, so every card gets a keyword-rich,
 * human-readable permalink. `check:content` fails the build on collisions.
 */
export function slugify(text: string): string {
  const base = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"\u201c\u201d\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base.length <= 90) return base;
  // Trim to the last whole word inside the limit so URLs stay readable.
  const cut = base.slice(0, 90);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 40 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

const questions: QuestionWithSlug[] = (raw as Question[]).map((q) => ({
  ...q,
  slug: q.slug ?? slugify(q.question),
}));

export function getAllQuestions(): QuestionWithSlug[] {
  return questions;
}

export function getQuestionBySlug(slug: string): QuestionWithSlug | undefined {
  return questions.find((q) => q.slug === slug);
}

export function getQuestionsByCategory(key: CategoryKey): QuestionWithSlug[] {
  return questions.filter((q) => q.category === key);
}

export function getCategoryBySlug(slug: string): CategoryKey | undefined {
  return CATEGORY_KEYS.find((k) => CATEGORIES[k].slug === slug);
}

/**
 * Handles credited in `proposedBy`, with how many cards each of them
 * contributed. Busiest first, so the About page can credit them without the
 * list needing to be maintained by hand alongside the deck.
 */
export function getProposers(): { handle: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const q of questions) {
    if (!q.proposedBy) continue;
    counts.set(q.proposedBy, (counts.get(q.proposedBy) ?? 0) + 1);
  }
  return [...counts]
    .map(([handle, count]) => ({ handle, count }))
    .sort((a, b) => b.count - a.count || a.handle.localeCompare(b.handle));
}

/**
 * The cards a hub recommends reading first, in the order they are listed.
 */
export function getCategoryStarters(key: CategoryKey): QuestionWithSlug[] {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return CATEGORIES[key].starters
    .map((id) => byId.get(id))
    .filter((q): q is QuestionWithSlug => q !== undefined);
}

// One index per category, built on first use and reused for the rest of the
// build. Every question page asks for its own related list, and the term
// weights only depend on the category the page belongs to.
const relatedIndexes = new Map<CategoryKey, RelatedIndex<QuestionWithSlug>>();

/**
 * Same-category cards ranked by how much of the topic they share, most
 * relevant first. See `lib/related.ts` for the scoring.
 */
export function getRelatedQuestions(
  q: QuestionWithSlug,
  limit = 4,
): QuestionWithSlug[] {
  let index = relatedIndexes.get(q.category);
  if (!index) {
    index = buildRelatedIndex(getQuestionsByCategory(q.category));
    relatedIndexes.set(q.category, index);
  }
  return index.related(q, limit);
}

export const QUESTION_COUNT = questions.length;

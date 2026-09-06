import raw from "../content/questions.json";

export const CATEGORIES = {
  ml: {
    slug: "machine-learning",
    name: "Machine Learning",
    color: "#72D0EA",
    pattern: "/ml_pattern.svg",
    blurb:
      "Models, metrics and the tradeoffs that decide whether a model survives contact with real data.",
  },
  dl: {
    slug: "deep-learning",
    name: "Deep Learning",
    color: "#EFAAAD",
    pattern: "/dl_pattern.svg",
    blurb:
      "Neural networks from backpropagation to attention, and the tricks that make them trainable.",
  },
  stats: {
    slug: "statistics",
    name: "Statistics",
    color: "#92DCCF",
    pattern: "/stats_pattern.svg",
    blurb:
      "Inference, uncertainty and the ideas that people most often get subtly wrong in interviews.",
  },
  history: {
    slug: "history",
    name: "History",
    color: "#BB92D4",
    pattern: "/hist_pattern.svg",
    blurb:
      "The people, papers and moments that built the field, from the perceptron to the Transformer.",
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
}

export interface QuestionWithSlug extends Question {
  slug: string;
}

/**
 * URL slug derived from the question text, so every card gets a keyword-rich,
 * human-readable permalink. `check:content` fails the build on collisions.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"“”’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 12)
    .join("-");
}

const questions: QuestionWithSlug[] = (raw as Question[]).map((q) => ({
  ...q,
  slug: slugify(q.question),
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

export function getRelatedQuestions(
  q: QuestionWithSlug,
  limit = 4,
): QuestionWithSlug[] {
  return questions
    .filter((o) => o.category === q.category && o.slug !== q.slug)
    .slice(0, limit);
}

export const QUESTION_COUNT = questions.length;

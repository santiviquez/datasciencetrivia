import {
  getQuestionsByCategory,
  type CategoryKey,
  type QuestionWithSlug,
} from "./questions";

/**
 * Quiz landing pages under /quiz. Each draws a short run of cards from one or
 * more categories. They exist because people search for "machine learning
 * quiz" and "ai quiz", not for flashcards, and the deck is already a quiz.
 */
export const QUESTIONS_PER_QUIZ = 10;

interface QuizDef {
  /** Name as people search for it; used in the h1 and <title>. */
  name: string;
  categories: CategoryKey[];
  /** One-line description for metadata and the /quiz index. */
  blurb: string;
  /** Opening paragraph of the page. */
  intro: string;
}

export const QUIZZES = {
  "machine-learning": {
    name: "Machine Learning Quiz",
    categories: ["ml"],
    blurb: "Bias and variance, regularization, metrics, ensembles and encodings.",
    intro:
      "Ten questions on the machine learning ideas interviews keep coming back to: the bias-variance tradeoff, regularization, picking a metric, cross-validation, ensembles and feature encoding. Answer in your head, reveal the answer, and be honest about whether you got it.",
  },
  "data-science": {
    name: "Data Science Quiz",
    categories: ["ml", "stats"],
    blurb: "Machine learning and statistics mixed, the way a data science interview mixes them.",
    intro:
      "Ten questions drawn from machine learning and statistics together, because a data science interview rarely keeps them apart: hypothesis tests next to metrics, distributions next to models.",
  },
  ai: {
    name: "AI Quiz",
    categories: ["genai", "dl", "history"],
    blurb: "Large language models, neural networks and the history of AI.",
    intro:
      "Ten questions on artificial intelligence: how large language models are prompted, retrieved and served, how the neural networks under them train, and the people and papers that got the field here.",
  },
  "deep-learning": {
    name: "Deep Learning Quiz",
    categories: ["dl"],
    blurb: "Activations, gradient descent, regularization and the architectures built from them.",
    intro:
      "Ten deep learning questions: activation functions, learning rates and optimizers, dropout and batch normalization, and the CNNs, RNNs and Transformers they make up.",
  },
  statistics: {
    name: "Statistics Quiz",
    categories: ["stats"],
    blurb: "Hypothesis tests, distributions, correlation and regression diagnostics.",
    intro:
      "Ten statistics questions on the ideas people most often get subtly wrong: the two kinds of error, p-values, distributions and limit theorems, correlation and confounding, and reading a regression.",
  },
  "generative-ai": {
    name: "Generative AI and LLM Quiz",
    categories: ["genai"],
    blurb: "Decoding, retrieval, fine-tuning and serving large language models.",
    intro:
      "Ten questions on large language models in practice: temperature and top-p, retrieval-augmented generation, when to fine-tune, and what sets latency and cost.",
  },
  "ai-history": {
    name: "AI History Quiz",
    categories: ["history"],
    blurb: "The people, papers and machines that built AI, from Bayes to the Transformer.",
    intro:
      "Ten questions on the history of artificial intelligence: who invented what, when the famous datasets and libraries arrived, and the matches between people and machines that made headlines.",
  },
} as const satisfies Record<string, QuizDef>;

export type QuizSlug = keyof typeof QUIZZES;
export const QUIZ_SLUGS = Object.keys(QUIZZES) as QuizSlug[];

export function isQuizSlug(slug: string): slug is QuizSlug {
  return slug in QUIZZES;
}

export function getQuizPool(slug: QuizSlug): QuestionWithSlug[] {
  return QUIZZES[slug].categories.flatMap((c) => getQuestionsByCategory(c));
}

/**
 * The run a page renders before anyone presses "New quiz". It has to be the
 * same on the server and in the browser, so it is shuffled with a seed taken
 * from the quiz slug rather than Math.random.
 */
export function getInitialRun(slug: QuizSlug): QuestionWithSlug[] {
  let seed = [...slug].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const rand = () => {
    // mulberry32
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pool = [...getQuizPool(slug)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, QUESTIONS_PER_QUIZ);
}

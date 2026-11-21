/**
 * Classification metrics from the four cells of a binary confusion matrix.
 *
 * Pure functions with no React in them, so the calculator page, its static
 * worked example and any later tool share one implementation. A metric whose
 * denominator is zero is `null` (undefined), never 0 or NaN: "precision is
 * undefined because the model predicted no positives" is a real answer, and
 * reporting 0 instead would be wrong.
 */

export interface ConfusionCounts {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

export type MetricKey =
  | "accuracy"
  | "precision"
  | "recall"
  | "specificity"
  | "f1"
  | "balancedAccuracy"
  | "mcc"
  | "kappa"
  | "npv"
  | "fpr"
  | "fnr"
  | "fdr"
  | "prevalence"
  | "youden";

export interface MetricDef {
  key: MetricKey;
  name: string;
  /** Other names people search for, shown under the metric. */
  aka?: string;
  /** Plain-text formula in terms of TP, FP, FN, TN. */
  formula: string;
  /** One sentence: what the number tells you. */
  meaning: string;
  /** Slug of the flashcard that explains it, when the deck has one. */
  card?: string;
  /** Range of the metric, for the bar. MCC, kappa and Youden's J can go negative. */
  range: [number, number];
  /** Higher is better for every metric here except the error rates. */
  lowerIsBetter?: boolean;
  compute: (c: ConfusionCounts) => number | null;
}

function ratio(num: number, den: number): number | null {
  return den === 0 ? null : num / den;
}

export function total(c: ConfusionCounts): number {
  return c.tp + c.fp + c.fn + c.tn;
}

export function recallOf(c: ConfusionCounts) {
  return ratio(c.tp, c.tp + c.fn);
}

export function specificityOf(c: ConfusionCounts) {
  return ratio(c.tn, c.tn + c.fp);
}

export function mccOf(c: ConfusionCounts): number | null {
  const { tp, fp, fn, tn } = c;
  const den = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  return den === 0 ? null : (tp * tn - fp * fn) / den;
}

export function kappaOf(c: ConfusionCounts): number | null {
  const n = total(c);
  if (n === 0) return null;
  const observed = (c.tp + c.tn) / n;
  const expected =
    ((c.tp + c.fp) * (c.tp + c.fn) + (c.fn + c.tn) * (c.fp + c.tn)) / (n * n);
  return expected === 1 ? null : (observed - expected) / (1 - expected);
}

export const METRICS: MetricDef[] = [
  {
    key: "accuracy",
    name: "Accuracy",
    formula: "(TP + TN) / (TP + FP + FN + TN)",
    meaning: "Share of all predictions that were right. Misleading when one class is rare.",
    range: [0, 1],
    compute: (c) => ratio(c.tp + c.tn, total(c)),
  },
  {
    key: "precision",
    name: "Precision",
    aka: "positive predictive value (PPV)",
    formula: "TP / (TP + FP)",
    meaning: "Of everything the model flagged as positive, how much really was.",
    card: "what-is-the-difference-between-precision-and-recall",
    range: [0, 1],
    compute: (c) => ratio(c.tp, c.tp + c.fp),
  },
  {
    key: "recall",
    name: "Recall",
    aka: "sensitivity, true positive rate (TPR), hit rate",
    formula: "TP / (TP + FN)",
    meaning: "Of all the real positives, how many the model caught.",
    card: "what-is-the-difference-between-precision-and-recall",
    range: [0, 1],
    compute: recallOf,
  },
  {
    key: "specificity",
    name: "Specificity",
    aka: "true negative rate (TNR), selectivity",
    formula: "TN / (TN + FP)",
    meaning: "Of all the real negatives, how many the model correctly left alone.",
    card: "what-is-the-difference-between-sensitivity-and-specificity",
    range: [0, 1],
    compute: specificityOf,
  },
  {
    key: "f1",
    name: "F1 score",
    aka: "F-measure, harmonic mean of precision and recall",
    formula: "2·TP / (2·TP + FP + FN)",
    meaning: "One number that is high only when precision and recall are both high. Ignores TN.",
    card: "what-is-f1-score",
    range: [0, 1],
    compute: (c) => ratio(2 * c.tp, 2 * c.tp + c.fp + c.fn),
  },
  {
    key: "balancedAccuracy",
    name: "Balanced accuracy",
    formula: "(Recall + Specificity) / 2",
    meaning: "Accuracy that weighs both classes equally, so a rare class can't be ignored.",
    range: [0, 1],
    compute: (c) => {
      const r = recallOf(c);
      const s = specificityOf(c);
      return r === null || s === null ? null : (r + s) / 2;
    },
  },
  {
    key: "mcc",
    name: "Matthews correlation coefficient",
    aka: "MCC, phi coefficient",
    formula: "(TP·TN − FP·FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN))",
    meaning: "Correlation between predictions and truth, from −1 to 1. Uses all four cells, so it stays honest on imbalanced data.",
    card: "what-is-the-matthews-correlation-coefficient",
    range: [-1, 1],
    compute: mccOf,
  },
  {
    key: "kappa",
    name: "Cohen's kappa",
    formula: "(p_o − p_e) / (1 − p_e)",
    meaning: "How much better than chance agreement the predictions are. 0 means no better than guessing with the same class rates.",
    card: "what-is-cohens-kappa",
    range: [-1, 1],
    compute: kappaOf,
  },
  {
    key: "npv",
    name: "Negative predictive value",
    aka: "NPV",
    formula: "TN / (TN + FN)",
    meaning: "Of everything the model called negative, how much really was.",
    range: [0, 1],
    compute: (c) => ratio(c.tn, c.tn + c.fn),
  },
  {
    key: "fpr",
    name: "False positive rate",
    aka: "fall-out, 1 − specificity, the x-axis of a ROC curve",
    formula: "FP / (FP + TN)",
    meaning: "Of all the real negatives, how many the model wrongly flagged.",
    card: "graphical-representation-of-the-contrast-between-true-positives-and-false-positives-rates",
    range: [0, 1],
    lowerIsBetter: true,
    compute: (c) => ratio(c.fp, c.fp + c.tn),
  },
  {
    key: "fnr",
    name: "False negative rate",
    aka: "miss rate, 1 − recall",
    formula: "FN / (FN + TP)",
    meaning: "Of all the real positives, how many the model missed.",
    card: "what-is-the-difference-between-a-false-positive-and-a-false-negative",
    range: [0, 1],
    lowerIsBetter: true,
    compute: (c) => ratio(c.fn, c.fn + c.tp),
  },
  {
    key: "fdr",
    name: "False discovery rate",
    aka: "FDR, 1 − precision",
    formula: "FP / (FP + TP)",
    meaning: "Of everything the model flagged, how much was a false alarm.",
    card: "what-is-the-benjamini-hochberg-procedure",
    range: [0, 1],
    lowerIsBetter: true,
    compute: (c) => ratio(c.fp, c.fp + c.tp),
  },
  {
    key: "prevalence",
    name: "Prevalence",
    formula: "(TP + FN) / (TP + FP + FN + TN)",
    meaning: "Share of the data that is really positive. Not a model score, but it tells you how much to trust accuracy.",
    range: [0, 1],
    compute: (c) => ratio(c.tp + c.fn, total(c)),
  },
  {
    key: "youden",
    name: "Youden's J statistic",
    aka: "informedness",
    formula: "Recall + Specificity − 1",
    meaning: "How far the model sits above the ROC curve's diagonal at this threshold, from −1 to 1.",
    range: [-1, 1],
    compute: (c) => {
      const r = recallOf(c);
      const s = specificityOf(c);
      return r === null || s === null ? null : r + s - 1;
    },
  },
];

/** The default example: a fraud model scored on 1,000 transactions, 50 of them fraud. */
export const EXAMPLE_COUNTS: ConfusionCounts = { tp: 40, fp: 60, fn: 10, tn: 890 };

export function formatMetric(value: number | null, digits = 4): string {
  if (value === null) return "undefined";
  return value.toFixed(digits);
}

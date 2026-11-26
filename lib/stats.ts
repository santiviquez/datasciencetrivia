/**
 * Probability distributions for the calculators (normal, Student's t,
 * chi-square and F) and summaries of a list of numbers.
 *
 * Pure functions with no React in them. Tail probabilities are computed
 * directly (never as 1 − CDF), so a p-value of 1e-12 keeps its digits.
 * `scripts/check-stats.mjs` checks every function against reference values.
 */

const EPS = 1e-15;
const TINY = 1e-300;
const MAX_ITER = 100_000;

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];

/** ln Γ(x) for x > 0 (Lanczos, g = 7). */
export function logGamma(x: number): number {
  if (x < 0.5) {
    // Reflection: Γ(x)·Γ(1 − x) = π / sin(πx)
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }
  const z = x - 1;
  let sum = LANCZOS[0];
  for (let i = 1; i < LANCZOS.length; i++) sum += LANCZOS[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum);
}

/** Lower regularized incomplete gamma P(a, x) by its series. Best for x < a + 1. */
function gammaSeries(a: number, x: number): number {
  let term = 1 / a;
  let sum = term;
  for (let n = 1; n < MAX_ITER; n++) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < Math.abs(sum) * EPS) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

/** Upper regularized incomplete gamma Q(a, x) by a continued fraction. Best for x ≥ a + 1. */
function gammaFraction(a: number, x: number): number {
  let b = x + 1 - a;
  let c = 1 / TINY;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < MAX_ITER; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < TINY) d = TINY;
    c = b + an / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPS) break;
  }
  return h * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  return x < a + 1 ? gammaSeries(a, x) : 1 - gammaFraction(a, x);
}

/** Regularized upper incomplete gamma Q(a, x) = 1 − P(a, x). */
export function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  return x < a + 1 ? 1 - gammaSeries(a, x) : gammaFraction(a, x);
}

function betaFraction(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < MAX_ITER; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPS) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (front * betaFraction(a, b, x)) / a
    : 1 - (front * betaFraction(b, a, 1 - x)) / b;
}

export type Distribution = "z" | "t" | "chi2" | "f";

/** Degrees of freedom: none for z, one for t and chi-square, two for F. */
export type Df = readonly number[];

/** P(X ≥ x): the right-tail probability. */
export function upperTail(dist: Distribution, x: number, df: Df = []): number {
  switch (dist) {
    case "z":
      return x >= 0 ? 0.5 * gammaQ(0.5, (x * x) / 2) : 1 - 0.5 * gammaQ(0.5, (x * x) / 2);
    case "t": {
      const v = df[0];
      const half = 0.5 * betaI(v / 2, 0.5, v / (v + x * x));
      return x >= 0 ? half : 1 - half;
    }
    case "chi2":
      return x <= 0 ? 1 : gammaQ(df[0] / 2, x / 2);
    case "f": {
      const [d1, d2] = df;
      return x <= 0 ? 1 : betaI(d2 / 2, d1 / 2, d2 / (d2 + d1 * x));
    }
  }
}

/** P(X ≤ x): the left-tail probability. */
export function lowerTail(dist: Distribution, x: number, df: Df = []): number {
  switch (dist) {
    case "z":
    case "t":
      return upperTail(dist, -x, df);
    case "chi2":
      return x <= 0 ? 0 : gammaP(df[0] / 2, x / 2);
    case "f": {
      const [d1, d2] = df;
      return x <= 0 ? 0 : betaI(d1 / 2, d2 / 2, (d1 * x) / (d1 * x + d2));
    }
  }
}

/** Two-tailed p-value, 2 · P(X ≥ |x|). Only defined for the symmetric distributions. */
export function twoTail(dist: "z" | "t", x: number, df: Df = []): number {
  return Math.min(1, 2 * upperTail(dist, Math.abs(x), df));
}

/** Probability density, for drawing the curve. */
export function density(dist: Distribution, x: number, df: Df = []): number {
  switch (dist) {
    case "z":
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    case "t": {
      const v = df[0];
      return Math.exp(
        logGamma((v + 1) / 2) - logGamma(v / 2) - 0.5 * Math.log(v * Math.PI) -
          ((v + 1) / 2) * Math.log1p((x * x) / v),
      );
    }
    case "chi2": {
      const k = df[0];
      if (x <= 0) return 0;
      return Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - logGamma(k / 2));
    }
    case "f": {
      const [d1, d2] = df;
      if (x <= 0) return 0;
      const logBeta = logGamma(d1 / 2) + logGamma(d2 / 2) - logGamma((d1 + d2) / 2);
      return Math.exp(
        0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2)) -
          Math.log(x) - logBeta,
      );
    }
  }
}

/** The x with P(X ≥ x) = p: the critical value for a right-tailed test at level p. */
export function upperQuantile(dist: Distribution, p: number, df: Df = []): number {
  const symmetric = dist === "z" || dist === "t";
  if (symmetric && p === 0.5) return 0;
  if (symmetric && p > 0.5) return -upperQuantile(dist, 1 - p, df);
  let lo = 0;
  let hi = 1;
  while (upperTail(dist, hi, df) > p && hi < 1e12) {
    lo = hi;
    hi *= 2;
  }
  for (let i = 0; i < 200 && hi - lo > 1e-13 * Math.max(1, hi); i++) {
    const mid = (lo + hi) / 2;
    if (upperTail(dist, mid, df) > p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** A confidence interval, with the critical value that set its width. */
export interface Interval {
  lower: number;
  upper: number;
  critical: number;
}

/** The z or t value that leaves `level` (between 0 and 1) in the middle of the distribution. */
export function criticalValue(dist: "z" | "t", level: number, df: Df = []): number {
  return upperQuantile(dist, (1 - level) / 2, df);
}

/** mean ± critical × sd / √n. The t interval uses n − 1 degrees of freedom. */
export function meanInterval(dist: "z" | "t", mean: number, sd: number, n: number, level: number): Interval {
  const critical = criticalValue(dist, level, dist === "t" ? [n - 1] : []);
  const margin = (critical * sd) / Math.sqrt(n);
  return { lower: mean - margin, upper: mean + margin, critical };
}

/**
 * The interval for a proportion of `successes` out of n. "wald" is the
 * textbook normal approximation, p ± z √(p(1 − p)/n). "wilson" is the score
 * interval, which holds up with small samples and proportions near 0 or 1.
 */
export function proportionInterval(
  method: "wald" | "wilson",
  successes: number,
  n: number,
  level: number,
): Interval {
  const z = criticalValue("z", level);
  const p = successes / n;
  const spread = (p * (1 - p)) / n;
  const scale = method === "wilson" ? 1 + (z * z) / n : 1;
  const centre = method === "wilson" ? (p + (z * z) / (2 * n)) / scale : p;
  const half = (z * Math.sqrt(method === "wilson" ? spread + (z * z) / (4 * n * n) : spread)) / scale;
  return { lower: Math.max(0, centre - half), upper: Math.min(1, centre + half), critical: z };
}

/** What a standard deviation is built from. */
export interface Spread {
  n: number;
  sum: number;
  mean: number;
  /** The sum of squared deviations from the mean. */
  ss: number;
}

/** The count, sum, mean and sum of squared deviations of a list of numbers. */
export function spread(values: readonly number[]): Spread {
  const n = values.length;
  let sum = 0;
  for (const v of values) sum += v;
  const mean = sum / n;
  let ss = 0;
  for (const v of values) ss += (v - mean) ** 2;
  return { n, sum, mean, ss };
}

/** The sum of squares over n − 1 for a sample (Bessel's correction), over n for a whole population. */
export function variance({ ss, n }: Spread, sample: boolean): number {
  return ss / (sample ? n - 1 : n);
}

/**
 * The value a fraction p of the way through a sorted list, interpolating
 * between neighbours: p = 0.5 is the median, 0.25 and 0.75 the quartiles.
 * The convention of Excel's QUARTILE.INC, NumPy and R's default.
 */
export function sampleQuantile(sorted: readonly number[], p: number): number {
  const at = (sorted.length - 1) * p;
  const below = Math.floor(at);
  const above = Math.ceil(at);
  return sorted[below] + (sorted[above] - sorted[below]) * (at - below);
}

/** The values of a sorted list that occur most often, and how often. No modes when no value repeats. */
export function modes(sorted: readonly number[]): { values: number[]; count: number } {
  let values: number[] = [];
  let count = 1;
  for (let start = 0; start < sorted.length; ) {
    let end = start + 1;
    while (end < sorted.length && sorted[end] === sorted[start]) end++;
    const run = end - start;
    if (run > count) {
      values = [sorted[start]];
      count = run;
    } else if (run === count && run > 1) {
      values.push(sorted[start]);
    }
    start = end;
  }
  return { values, count };
}

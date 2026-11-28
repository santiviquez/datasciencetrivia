// Checks lib/stats.ts against reference values (scripts/stats-reference.json):
// tails, densities, quantiles and intervals from SciPy and statsmodels, and
// spreads, quartiles, modes and binomial probabilities computed in exact
// rational arithmetic (SciPy for the binomial rows with n of 5,000 and up),
// and normal probabilities between two z scores from mpmath at 50 digits.
// Run with `npm run check:stats`.
import { readFileSync } from "node:fs";
import {
  binomialLower,
  binomialPmf,
  binomialUpper,
  density,
  lowerTail,
  meanInterval,
  modes,
  normalBetween,
  proportionInterval,
  sampleQuantile,
  spread,
  upperQuantile,
  upperTail,
  variance,
} from "../lib/stats.ts";

const rows = JSON.parse(readFileSync(new URL("./stats-reference.json", import.meta.url), "utf8"));
const fns = { upper: upperTail, lower: lowerTail, density, quantile: upperQuantile };
const bounds = ({ lower, upper }) => [lower, upper];
const inOrder = (values) => [...values].sort((a, b) => a - b);
// Functions checked on several numbers at once: a row holds their arguments and a list of expected values.
const lists = {
  meanInterval: (...args) => bounds(meanInterval(...args)),
  proportionInterval: (...args) => bounds(proportionInterval(...args)),
  spread: (values) => {
    const s = spread(values);
    return [s.mean, s.ss, variance(s, true), variance(s, false)];
  },
  quartiles: (values) => [0.25, 0.5, 0.75].map((p) => sampleQuantile(inOrder(values), p)),
  // How often the modes occur, how many there are, then the modes themselves.
  modes: (values) => {
    const m = modes(inOrder(values));
    return [m.count, m.values.length, ...m.values];
  },
  // P(X = k), P(X ≤ k) and P(X ≥ k).
  binomial: (k, n, p) => [binomialPmf(k, n, p), binomialLower(k, n, p), binomialUpper(k, n, p)],
  // P(Z ≤ a), P(a ≤ Z ≤ b) and P(Z ≥ b).
  normal: (a, b) => [lowerTail("z", a), normalBetween(a, b), upperTail("z", b)],
};
const TOLERANCE = {
  upper: 1e-9,
  lower: 1e-9,
  density: 1e-9,
  quantile: 1e-8,
  meanInterval: 1e-8,
  proportionInterval: 1e-8,
  spread: 1e-9,
  quartiles: 1e-12,
  modes: 0,
  binomial: 1e-9,
  normal: 1e-9,
};

let failures = 0;
let worst = 0;
let values = 0;
for (const row of rows) {
  const { fn, want } = row;
  const list = fn in lists;
  const got = list ? lists[fn](...row.args) : [fns[fn](row.dist, row.x, row.df)];
  const expected = list ? want : [want];
  for (let i = 0; i < expected.length; i++) {
    values++;
    // Relative error. Values that should be exactly 0 are held to the same number absolutely.
    const error = Math.abs(got[i] - expected[i]) / (expected[i] === 0 ? 1 : Math.abs(expected[i]));
    if (Number.isFinite(got[i]) && error <= TOLERANCE[fn]) {
      worst = Math.max(worst, error);
      continue;
    }
    failures++;
    if (failures <= 20) {
      const call = list ? `(${JSON.stringify(row.args).slice(1, 80)})[${i}]` : ` ${row.dist} x=${row.x} df=[${row.df}]`;
      console.error(`${fn}${call} got ${got[i]}, want ${expected[i]} (rel ${error.toExponential(2)})`);
    }
  }
}

if (failures) {
  console.error(`\ncheck:stats failed: ${failures} of ${values} values are off.`);
  process.exit(1);
}
console.log(`check:stats ok: ${values} values match the references (worst relative error ${worst.toExponential(1)}).`);

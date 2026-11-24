// Checks lib/stats.ts against reference values computed with SciPy and
// statsmodels (scripts/stats-reference.json). Run with `npm run check:stats`.
import { readFileSync } from "node:fs";
import { density, lowerTail, meanInterval, proportionInterval, upperQuantile, upperTail } from "../lib/stats.ts";

const rows = JSON.parse(readFileSync(new URL("./stats-reference.json", import.meta.url), "utf8"));
const fns = { upper: upperTail, lower: lowerTail, density, quantile: upperQuantile };
const intervals = { meanInterval, proportionInterval };
const TOLERANCE = { upper: 1e-9, lower: 1e-9, density: 1e-9, quantile: 1e-8, meanInterval: 1e-8, proportionInterval: 1e-8 };

let failures = 0;
let worst = 0;
let values = 0;
for (const row of rows) {
  const { fn, want } = row;
  // An interval row holds both bounds; every other row holds one number.
  const interval = fn in intervals ? intervals[fn](...row.args) : null;
  const pairs = interval
    ? [[interval.lower, want[0]], [interval.upper, want[1]]]
    : [[fns[fn](row.dist, row.x, row.df), want]];
  for (const [got, expected] of pairs) {
    values++;
    // Relative error. Values that should be exactly 0 are held to the same number absolutely.
    const error = Math.abs(got - expected) / (expected === 0 ? 1 : Math.abs(expected));
    if (Number.isFinite(got) && error <= TOLERANCE[fn]) {
      worst = Math.max(worst, error);
      continue;
    }
    failures++;
    if (failures <= 20) {
      const call = interval ? `(${row.args.join(", ")})` : ` ${row.dist} x=${row.x} df=[${row.df}]`;
      console.error(`${fn}${call} got ${got}, want ${expected} (rel ${error.toExponential(2)})`);
    }
  }
}

if (failures) {
  console.error(`\ncheck:stats failed: ${failures} of ${values} values are off.`);
  process.exit(1);
}
console.log(`check:stats ok: ${values} values match SciPy and statsmodels (worst relative error ${worst.toExponential(1)}).`);

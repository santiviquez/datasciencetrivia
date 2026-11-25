// Checks lib/stats.ts against reference values (scripts/stats-reference.json):
// tails, densities, quantiles and intervals from SciPy and statsmodels, and
// spreads computed in exact rational arithmetic. Run with `npm run check:stats`.
import { readFileSync } from "node:fs";
import {
  density,
  lowerTail,
  meanInterval,
  proportionInterval,
  spread,
  upperQuantile,
  upperTail,
  variance,
} from "../lib/stats.ts";

const rows = JSON.parse(readFileSync(new URL("./stats-reference.json", import.meta.url), "utf8"));
const fns = { upper: upperTail, lower: lowerTail, density, quantile: upperQuantile };
const bounds = ({ lower, upper }) => [lower, upper];
// Functions checked on several numbers at once: a row holds their arguments and a list of expected values.
const lists = {
  meanInterval: (...args) => bounds(meanInterval(...args)),
  proportionInterval: (...args) => bounds(proportionInterval(...args)),
  spread: (values) => {
    const s = spread(values);
    return [s.mean, s.ss, variance(s, true), variance(s, false)];
  },
};
const TOLERANCE = {
  upper: 1e-9,
  lower: 1e-9,
  density: 1e-9,
  quantile: 1e-8,
  meanInterval: 1e-8,
  proportionInterval: 1e-8,
  spread: 1e-9,
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

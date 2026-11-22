// Checks lib/stats.ts against reference values computed with SciPy
// (scripts/stats-reference.json). Run with `npm run check:stats`.
import { readFileSync } from "node:fs";
import { density, lowerTail, upperQuantile, upperTail } from "../lib/stats.ts";

const rows = JSON.parse(readFileSync(new URL("./stats-reference.json", import.meta.url), "utf8"));
const fns = { upper: upperTail, lower: lowerTail, density, quantile: upperQuantile };
const TOLERANCE = { upper: 1e-9, lower: 1e-9, density: 1e-9, quantile: 1e-8 };

let failures = 0;
let worst = 0;
for (const { fn, dist, x, df, want } of rows) {
  const got = fns[fn](dist, x, df);
  // Relative error. Values that should be exactly 0 are held to the same number absolutely.
  const error = Math.abs(got - want) / (want === 0 ? 1 : Math.abs(want));
  const ok = Number.isFinite(got) && error <= TOLERANCE[fn];
  if (ok) {
    worst = Math.max(worst, error);
  } else {
    failures++;
    if (failures <= 20) console.error(`${fn} ${dist} x=${x} df=[${df}] got ${got}, want ${want} (rel ${error.toExponential(2)})`);
  }
}

if (failures) {
  console.error(`\ncheck:stats failed: ${failures} of ${rows.length} values are off.`);
  process.exit(1);
}
console.log(`check:stats ok: ${rows.length} values match SciPy (worst relative error ${worst.toExponential(1)}).`);

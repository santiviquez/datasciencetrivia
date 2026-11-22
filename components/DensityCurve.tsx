import { density, upperQuantile, type Df, type Distribution } from "@/lib/stats";

export type Tail = "two" | "right" | "left";

const W = 100;
const H = 100;
const STEPS = 120;
/** The marker at the statistic is at least this tall, so it shows where the curve is flat. */
const TICK = 14;

/** The x-range worth drawing: where the distribution has its mass, stretched to include the statistic. */
function range(dist: Distribution, df: Df, x: number | null): [number, number] {
  if (dist === "z" || dist === "t") {
    const base = dist === "z" ? 4 : Math.min(Math.max(upperQuantile("t", 0.005, df), 4), 8);
    const lim = x === null ? base : Math.min(Math.max(base, Math.abs(x) * 1.2), 3 * base);
    return [-lim, lim];
  }
  let hi = Math.min(upperQuantile(dist, 0.002, df), dist === "f" ? 8 : Infinity);
  let lo = upperQuantile(dist, 0.998, df);
  if (lo < 0.3 * hi) lo = 0;
  if (x !== null) {
    if (x * 1.15 > hi) hi = Math.min(x * 1.15, 4 * hi);
    if (x < lo) lo = Math.max(0, x * 0.85);
  }
  return [lo, hi];
}

/** At most two decimals, no trailing zeros, a real minus sign. */
const fmt = (v: number) => String(Number(v.toFixed(Math.abs(v) >= 100 ? 0 : 2))).replace("-", "−");

/**
 * The distribution's density with the p-value's tail shaded.
 *
 * The SVG stretches to its box and the strokes don't scale, so lines stay the
 * same weight at any width. Labels are HTML under it, so the type doesn't
 * shrink on a phone.
 */
export default function DensityCurve({
  dist,
  df,
  x,
  tail,
  fill,
}: {
  dist: Distribution;
  df: Df;
  x: number | null;
  tail: Tail;
  fill: string;
}) {
  const [lo, hi] = range(dist, df, x);
  const sx = (v: number) => ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * W;

  // Chi-square and F are evaluated just right of 0, where the density may be finite, zero or a pole.
  const floor = dist === "z" || dist === "t" ? -Infinity : (hi - lo) * 1e-9;
  const f = (v: number) => density(dist, Math.max(v, floor), df);

  const xs = Array.from({ length: STEPS + 1 }, (_, i) => lo + ((hi - lo) * i) / STEPS);
  const ys = xs.map(f);
  // A density with a pole at 0 (chi-square with 1 df) is clipped at the top, not allowed to flatten the rest.
  const finite = (v: number[]) => Math.max(...v.filter(Number.isFinite), 1e-12);
  const pole = !(ys[0] <= 4 * ys[3]);
  const top = finite(pole ? ys.slice(3) : ys) * 1.08;
  const sy = (d: number) => H - (Math.min(Number.isFinite(d) ? d : top, top) / top) * (H - 4);

  const line = xs.map((v, i) => `${i ? "L" : "M"}${sx(v).toFixed(2)},${sy(ys[i]).toFixed(2)}`).join("");

  /** The area under the curve between a and b. */
  const area = (a: number, b: number) => {
    const from = Math.max(a, lo);
    const to = Math.min(b, hi);
    if (!(to > from)) return null;
    const pts = [from, ...xs.filter((v) => v > from && v < to), to];
    const d = pts.map((v) => `L${sx(v).toFixed(2)},${sy(f(v)).toFixed(2)}`).join("");
    return `M${sx(from).toFixed(2)},${H}${d}L${sx(to).toFixed(2)},${H}Z`;
  };

  const marks: number[] = [];
  const areas: (string | null)[] = [];
  if (x !== null) {
    if (tail === "two") {
      const a = Math.abs(x);
      areas.push(area(-Infinity, -a), area(a, Infinity));
      marks.push(-a, a);
    } else if (tail === "right") {
      areas.push(area(x, Infinity));
      marks.push(x);
    } else {
      areas.push(area(-Infinity, x));
      marks.push(x);
    }
  }

  // Two labels too close to read are merged into one "±" label.
  const merged = marks.length === 2 && sx(marks[1]) - sx(marks[0]) < 20;
  const labels = merged
    ? [{ at: 50, text: `±${fmt(Math.abs(marks[1]))}` }]
    : marks.map((m) => ({ at: Math.min(Math.max(sx(m), 6), 94), text: fmt(m) }));

  return (
    <div aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-24 w-full overflow-visible">
        {areas.map((d, i) => (d ? <path key={i} d={d} fill={fill} /> : null))}
        {marks.map((m, i) => (
          <line
            key={i}
            x1={sx(m)}
            x2={sx(m)}
            y1={Math.min(sy(f(Math.min(Math.max(m, lo), hi))), H - TICK)}
            y2={H}
            stroke="#000"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={line} fill="none" stroke="#000" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <line x1={0} x2={W} y1={H} y2={H} stroke="#000" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative mt-1 h-4 text-[11px] tabular-nums text-[var(--muted)]">
        {labels.map((l) => (
          <span key={l.text} className="absolute -translate-x-1/2" style={{ left: `${l.at}%` }}>
            {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}

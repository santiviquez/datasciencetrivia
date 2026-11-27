import { placeLabel, type PlotLabel } from "@/lib/plot-labels";

const W = 100;
const H = 100;
/** More bars than this are drawn in groups, since each would be narrower than a couple of pixels. */
const MAX_COLUMNS = 200;
/** Up to this many bars get a line between neighbours. More read better as one outline. */
const MAX_SEPARATE = 41;

const fmt = (v: number) => v.toLocaleString("en-US");

/**
 * A distribution over whole numbers as bars, with a run of them shaded: the
 * probability of exactly 3 successes, or of 3 or fewer. The counterpart of
 * DensityCurve for counts, drawn with the same baseline, shading and labels.
 */
export default function MassBars({
  from,
  mass,
  shade,
  mark,
  fill,
}: {
  /** The value of the first bar. */
  from: number;
  /** P(X = from), P(X = from + 1) and so on. */
  mass: readonly number[];
  /** The first and last value to shade. */
  shade: readonly [number, number] | null;
  /** A value to label under its bar. Both ends of the axis are labelled too, where there is room. */
  mark: number | null;
  fill: string;
}) {
  const count = mass.length;
  // Edges are counted in bars from the left: bar i runs from edge i to edge i + 1.
  const sx = (edge: number) => ((edge / Math.max(count, 1)) * W).toFixed(2);
  const top = Math.max(...mass, 1e-300) * 1.08;
  const sy = (m: number) => (H - (m / top) * (H - 4)).toFixed(2);

  const group = Math.ceil(count / MAX_COLUMNS);
  const columns: { start: number; end: number; height: number }[] = [];
  for (let start = 0; start < count; start += group) {
    const end = Math.min(count, start + group);
    columns.push({ start, end, height: Math.max(...mass.slice(start, end)) });
  }

  /** The tops of the bars between two edges, as one path along the baseline and back. */
  const outline = (a: number, b: number) =>
    `M${sx(a)},${H}` +
    columns
      .filter((c) => c.end > a && c.start < b)
      .map((c) => `V${sy(c.height)}H${sx(Math.min(c.end, b))}`)
      .join("") +
    `V${H}`;

  const first = shade ? Math.max(0, shade[0] - from) : 0;
  const last = shade ? Math.min(count, shade[1] - from + 1) : 0;

  const separators: number[] = [];
  if (count <= MAX_SEPARATE) {
    for (let i = 1; i < count; i++) if (Math.min(mass[i - 1], mass[i]) > 0) separators.push(i);
  }

  // The marked value comes first, so an end of the axis is what gives way to it.
  const labels: PlotLabel[] = [];
  const place = (v: number) => placeLabel(labels, ((v - from + 0.5) / count) * 100, fmt(v));
  if (count) {
    const end = from + count - 1;
    // A value off the axis is pointed to from the nearer edge.
    if (mark !== null && mark < from) placeLabel(labels, 0, `← ${fmt(mark)}`);
    else if (mark !== null && mark > end) placeLabel(labels, 100, `${fmt(mark)} →`);
    else if (mark !== null) place(mark);
    place(from);
    place(end);
  }

  return (
    <div aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-24 w-full overflow-visible">
        {last > first ? <path d={`${outline(first, last)}Z`} fill={fill} /> : null}
        {separators.map((i) => (
          <line
            key={i}
            x1={sx(i)}
            x2={sx(i)}
            y1={sy(Math.min(mass[i - 1], mass[i]))}
            y2={H}
            stroke="#000"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {count ? (
          <path d={outline(0, count)} fill="none" stroke="#000" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ) : null}
        <line x1={0} x2={W} y1={H} y2={H} stroke="#000" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative mt-1 h-4 text-[11px] tabular-nums text-[var(--muted)]">
        {labels.map((l) => (
          <span key={l.text} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${l.at}%` }}>
            {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}

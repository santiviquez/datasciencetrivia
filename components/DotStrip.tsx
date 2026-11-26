const BINS = 30;
/** Dots are 8px on a 9px pitch, so ten fit under the 96px plot. Taller stacks become bars. */
const MAX_DOTS = 10;
/** A label's width as a share of the narrowest plot (about 300px), per character of 11px tabular type. */
const CHAR = 2.1;

interface Label {
  at: number;
  text: string;
}

/**
 * A list of numbers as stacked dots on a number line, with a line at each
 * value that summarizes it (the mean, the median, the modes) and an optional
 * shaded range behind them. The raw-data counterpart of DensityCurve, drawn
 * with the same baseline, band and labels.
 */
export default function DotStrip({
  values,
  marks,
  band = null,
  fill,
  caption,
}: {
  values: readonly number[];
  /** Where to draw a line. */
  marks: readonly number[];
  /** A range to shade, such as one standard deviation either side of the mean. */
  band?: readonly [number, number] | null;
  fill: string;
  /** What to print when a single mark's band is too narrow to label at both ends. */
  caption?: (fmt: (v: number) => string) => string;
}) {
  const shaded = band !== null && band[1] > band[0] ? band : null;
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of [...values, ...marks, ...(shaded ?? [])]) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  // An empty list, or identical values, still need a line to sit on.
  if (!Number.isFinite(lo)) [lo, hi] = [0, 0];
  if (!(hi > lo)) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.04;
  lo -= pad;
  hi += pad;
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  // Labels carry as many decimals as the width of the plot makes meaningful, without trailing zeros.
  const decimals = Math.min(12, Math.max(0, 2 - Math.floor(Math.log10(hi - lo))));
  const fmt = (v: number) => String(Number(v.toFixed(decimals))).replace(/-/g, "−");

  const counts = new Array<number>(BINS).fill(0);
  for (const v of values) counts[Math.min(BINS - 1, Math.floor(((v - lo) / (hi - lo)) * BINS))]++;
  const tallest = Math.max(...counts, 1);
  const bars = tallest > MAX_DOTS;

  // A label sits under its value, pulled in from the edges, and is dropped if it would run into one already placed.
  const labels: Label[] = [];
  const place = (v: number, text = fmt(v)) => {
    const half = (text.length * CHAR) / 2;
    const spot = Math.min(Math.max(at(v), half), 100 - half);
    if (labels.some((l) => Math.abs(l.at - spot) < half + (l.text.length * CHAR) / 2 + 2)) return false;
    labels.push({ at: spot, text });
    return true;
  };
  // The marks come first, so the band is what gives way: both of its ends are labelled, or neither.
  for (const m of marks) place(m);
  const marked = labels.length;
  if (shaded && !(place(shaded[0]) && place(shaded[1]))) {
    labels.length = marked;
    if (caption && marks.length === 1) {
      labels.length = 0;
      place(marks[0], caption(fmt));
    }
  }

  return (
    <div aria-hidden="true">
      <div className="relative h-24 border-b-[2.5px] border-black">
        {shaded ? (
          <div
            className="absolute inset-y-0"
            style={{ left: `${at(shaded[0])}%`, width: `${at(shaded[1]) - at(shaded[0])}%`, backgroundColor: fill }}
          />
        ) : null}
        {marks.map((m, i) => (
          <div key={i} className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: `${at(m)}%` }} />
        ))}
        {counts.map((count, bin) => {
          if (!count) return null;
          const left = `${((bin + 0.5) / BINS) * 100}%`;
          return bars ? (
            <div
              key={bin}
              className="absolute bottom-0 w-2 -translate-x-1/2 bg-black"
              style={{ left, height: `${(count / tallest) * 100}%` }}
            />
          ) : (
            Array.from({ length: count }, (_, row) => (
              <div
                key={`${bin}-${row}`}
                className="absolute h-2 w-2 -translate-x-1/2 rounded-full bg-black"
                style={{ left, bottom: row * 9 + 1 }}
              />
            ))
          );
        })}
      </div>
      <div className="relative mt-1 h-4 text-[11px] tabular-nums text-[var(--muted)]">
        {labels.map((l) => (
          <span key={l.at} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${l.at}%` }}>
            {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}

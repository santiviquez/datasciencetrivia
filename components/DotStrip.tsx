const BINS = 30;
/** Dots are 8px on a 9px pitch, so ten fit under the 96px plot. Taller stacks become bars. */
const MAX_DOTS = 10;

/**
 * A list of numbers as stacked dots on a number line, with the mean marked
 * and one standard deviation either side of it shaded. The raw-data
 * counterpart of DensityCurve, drawn with the same baseline, band and labels.
 */
export default function DotStrip({
  values,
  mean,
  sd,
  fill,
}: {
  values: readonly number[];
  mean: number | null;
  /** Leave null to draw the dots and the mean without a band. */
  sd: number | null;
  fill: string;
}) {
  const reach = sd ?? 0;
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  if (mean !== null) {
    lo = Math.min(lo, mean - reach);
    hi = Math.max(hi, mean + reach);
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

  const band = mean !== null && sd !== null && sd > 0 ? { left: at(mean - sd), width: at(mean + sd) - at(mean - sd) } : null;
  // Three labels need room; a narrow band gets one.
  const labels =
    mean === null
      ? []
      : band && band.width >= 36
        ? [
            { at: at(mean - reach), text: fmt(mean - reach) },
            { at: at(mean), text: fmt(mean) },
            { at: at(mean + reach), text: fmt(mean + reach) },
          ]
        : [{ at: Math.min(Math.max(at(mean), 14), 86), text: sd === null ? fmt(mean) : `${fmt(mean)} ± ${fmt(sd)}` }];

  return (
    <div aria-hidden="true">
      <div className="relative h-24 border-b-[2.5px] border-black">
        {band ? (
          <div className="absolute inset-y-0" style={{ left: `${band.left}%`, width: `${band.width}%`, backgroundColor: fill }} />
        ) : null}
        {mean !== null ? (
          <div className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-black" style={{ left: `${at(mean)}%` }} />
        ) : null}
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
        {labels.map((l, i) => (
          <span key={i} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${l.at}%` }}>
            {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}

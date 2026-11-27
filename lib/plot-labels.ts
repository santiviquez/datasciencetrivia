/** A label's width as a share of the narrowest plot (about 300px), per character of 11px tabular type. */
const CHAR = 2.1;

/** A label under a plot. */
export interface PlotLabel {
  /** Where its centre sits, in percent across the plot. */
  at: number;
  text: string;
}

/**
 * Puts a label under a point of a plot, pulled in from the edges. Places
 * nothing and returns false when it would run into a label already there.
 */
export function placeLabel(labels: PlotLabel[], at: number, text: string): boolean {
  const half = (text.length * CHAR) / 2;
  const spot = Math.min(Math.max(at, half), 100 - half);
  if (labels.some((l) => Math.abs(l.at - spot) < half + (l.text.length * CHAR) / 2 + 2)) return false;
  labels.push({ at: spot, text });
  return true;
}

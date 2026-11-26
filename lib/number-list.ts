/** What the calculators that take a pasted list of numbers share: reading the list, printing a result, and the link. */

const MAX = 1e12;
/** A longer list still computes; it just isn't written to the address bar. */
export const MAX_LINK = 1500;

/** Numbers separated by commas, spaces, semicolons or new lines. `bad` is the first entry that isn't one. */
export function parseList(text: string): { values: number[]; bad: string | null } {
  const values: number[] = [];
  for (const token of text.split(/[\s,;]+/)) {
    if (token === "") continue;
    const v = Number(token);
    if (!Number.isFinite(v) || Math.abs(v) > MAX) return { values: [], bad: token };
    values.push(v);
  }
  return { values, bad: null };
}

/** Five significant digits and at least two decimals, with no trailing zeros. */
export function shown(v: number): string {
  if (v === 0) return "0";
  const size = Math.floor(Math.log10(Math.abs(v)));
  // Below a ten-thousandth, decimals stop being readable.
  const text = size < -4 ? v.toExponential(4).replace(/\.?0+e/, "e") : String(Number(v.toFixed(Math.max(2, 4 - size))));
  return text.replace(/-/g, "−");
}

/** The list a shared link carries (?data=2,4,4,4,5,5,7,9), as the text of the input. Null when the link has none. */
export function listFromSearch(params: URLSearchParams): string | null {
  const data = params.get("data");
  return data === null ? null : data.split(",").join(", ");
}

/** What to say about an entry that isn't a number. */
export function badEntry(bad: string): string {
  return `“${bad.length > 20 ? `${bad.slice(0, 20)}…` : bad}” is not a number.`;
}

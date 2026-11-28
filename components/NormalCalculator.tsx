"use client";

import { useEffect, useMemo, useState } from "react";
import DensityCurve from "@/components/DensityCurve";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ResultChoice, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { lowerTail, normalBetween, upperQuantile, upperTail } from "@/lib/stats";

/** The part of the curve a probability belongs to. */
type Region = "below" | "between" | "above" | "outside";
/** The values and the probability are two views of one region: whichever was typed last drives the other. */
type Source = "x" | "p";

interface State {
  mean: string;
  sd: string;
  from: string;
  to: string;
  /** What was typed into the probability cell. Read only while it is the source. */
  p: string;
  source: Source;
  show: Region;
}

/**
 * Exam scores with mean 70 and standard deviation 10, and the share between
 * 60 and 85. The normal distribution flashcard works the same numbers.
 */
const EXAMPLE: State = { mean: "70", sd: "10", from: "60", to: "85", p: "", source: "x", show: "between" };
const MAX = 1e9;
/** In order along the number line, then what is left over. */
const REGIONS: Region[] = ["below", "between", "above", "outside"];

const isRegion = (v: string | null): v is Region => REGIONS.some((r) => r === v);

function parse(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

const inRange = (v: number | null): v is number => v !== null && Math.abs(v) <= MAX;
const validSd = (v: number | null): v is number => v !== null && v > 0 && v <= MAX;

/** A probability strictly between 0 and 1. Anything above 1 is read as a percentage, so 90 means 0.9. */
function parseP(raw: string): number | null {
  const v = parse(raw);
  if (v === null || v <= 0 || v === 1 || v >= 100) return null;
  return v > 1 ? Number((v / 100).toPrecision(12)) : v;
}

/** At most four decimals, no trailing zeros. Also what a cell shows, so it has to parse as a number. */
const tidy = (v: number, places = 4) => String(Number(v.toFixed(places)));
const shown = (v: number, places = 4) => tidy(v, places).replace("-", "−");
/** A negative number in brackets, where it follows a sign. */
const wrap = (text: string) => (text.startsWith("−") ? `(${text})` : text);
/** The decimal place a standard deviation starts at: −1 for 10, 0 for 1, 4 for 0.0002. */
const scale = (sd: number) => -Math.floor(Math.log10(sd));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Four decimals, or four significant digits once that would round to zero.
 * A 0 or 1 that is only the rounding of something close is marked as such.
 */
function prob(v: number, exact: boolean): string {
  if (v === 0) return exact ? "0" : "≈ 0";
  if (v === 1 && exact) return "1";
  if (v >= 0.99995) return "≈ 1";
  return v >= 0.0001 ? v.toFixed(4) : v.toExponential(3).replace("-", "−");
}

/** "= 0.7745", or "≈ 1" as it stands. */
const equals = (text: string) => (text.startsWith("≈") ? text : `= ${text}`);
/** Whether a probability prints as plain decimals, so it can sit in a sum. */
const plain = (v: number) => v >= 0.0001 && v < 0.99995;

/** A probability for its cell: the number as the results print it, without the "≈". */
const cell = (v: number) => String(Number(v >= 0.0001 ? v.toFixed(4) : v.toPrecision(4)));

/** A share of the values as a percentage. */
function percent(v: number): string {
  const pct = v * 100;
  if (pct >= 99.995) return v === 1 ? "All" : "Nearly all";
  if (pct < 0.005) return v === 0 ? "None" : "Almost none";
  return `${Number(pct.toFixed(2))}%`;
}

/**
 * Two probabilities to as few decimals, four or more, as it takes for their
 * sum or difference to agree with the result as printed. Rounding each to
 * four can leave the last digit one off.
 */
function terms(a: number, b: number, sign: 1 | -1, result: number): [string, string] {
  for (let d = 4; d < 8; d++) {
    if ((Number(a.toFixed(d)) + sign * Number(b.toFixed(d))).toFixed(4) === result.toFixed(4)) return [a.toFixed(d), b.toFixed(d)];
  }
  return [a.toFixed(8), b.toFixed(8)];
}

/**
 * A z score to as few decimals, four or more, as it takes for the arithmetic
 * that follows it to give the values as printed.
 */
function precise(z: number, agrees: (rounded: number) => boolean): string {
  for (let d = 4; d < 12; d++) {
    const rounded = Number(z.toFixed(d));
    if (agrees(rounded)) return String(rounded).replace("-", "−");
  }
  return shown(z);
}

/** With one value there is no between: the missing end is taken as infinitely far away. */
function regionFor(show: Region, hasFrom: boolean, hasTo: boolean): Region {
  if (hasFrom === hasTo || show === "below" || show === "above") return show;
  return (show === "between") === hasFrom ? "above" : "below";
}

/** A shared link (?mean=70&sd=10&from=60&to=85&show=between, or &p=0.9 in place of the values) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const mean = params.get("mean");
  if (mean === null) return null;
  const show = params.get("show");
  const p = params.get("p");
  return {
    mean,
    sd: params.get("sd") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    p: p ?? "",
    source: p === null ? "x" : "p",
    show: isRegion(show) ? show : EXAMPLE.show,
  };
}

export default function NormalCalculator({ look }: { look: CardLook }) {
  // The link's inputs show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { source } = state;
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const rawMean = parse(state.mean);
  const rawSd = parse(state.sd);
  const mean = inRange(rawMean) && validSd(rawSd) ? rawMean : null;
  const sd = mean === null ? null : rawSd;
  const typedP = source === "p" ? parseP(state.p) : null;
  // Values print to four decimals, and to more where the spread itself is a small fraction.
  const places = 4 + (sd === null ? 0 : clamp(scale(sd), 0, 8));
  const X = (v: number) => shown(v, places);

  // The two values, typed or worked back from the probability. A tail has one of them.
  const ends = useMemo<{ from: number | null; to: number | null }>(() => {
    if (source === "x") return { from: parse(state.from), to: parse(state.to) };
    if (mean === null || sd === null || typedP === null) return { from: null, to: null };
    const at = (z: number) => mean + z * sd;
    if (state.show === "below") return { from: null, to: at(-upperQuantile("z", typedP)) };
    if (state.show === "above") return { from: at(upperQuantile("z", typedP)), to: null };
    const z = upperQuantile("z", state.show === "between" ? (1 - typedP) / 2 : typedP / 2);
    return { from: at(-z), to: at(z) };
  }, [source, state.from, state.to, state.show, mean, sd, typedP]);

  const badFrom = ends.from !== null && !inRange(ends.from);
  const badTo = ends.to !== null && !inRange(ends.to);
  const hasFrom = ends.from !== null && !badFrom;
  const hasTo = ends.to !== null && !badTo;
  // Typed the wrong way round, the two values are still the ends of the same stretch.
  const given = [ends.from, ends.to].filter((v): v is number => inRange(v)).sort((a, b) => a - b);
  const [a, b] = badFrom || badTo ? [null, null] : [given[0] ?? null, given[given.length - 1] ?? null];
  const two = given.length === 2 && a !== null;
  const show = regionFor(state.show, hasFrom, hasTo);

  const solved = useMemo(() => {
    if (mean === null || sd === null || a === null || b === null) return null;
    const [za, zb] = [(a - mean) / sd, (b - mean) / sd];
    const below = lowerTail("z", za);
    const above = upperTail("z", zb);
    // Worked back from a probability, the chosen region is that probability, not its round trip.
    const typed = (r: Region, v: number) => (source === "p" && typedP !== null && r === show ? typedP : v);
    const values: Record<Region, number | null> = {
      below: typed("below", below),
      above: typed("above", above),
      between: two ? typed("between", normalBetween(za, zb)) : null,
      outside: two ? typed("outside", a === b ? 1 : Math.min(1, below + above)) : null,
    };
    const exact: Record<Region, boolean> = { below: false, above: false, between: a === b, outside: a === b };
    const text = Object.fromEntries(
      REGIONS.map((r) => [r, values[r] === null ? "—" : prob(values[r], exact[r])]),
    ) as Record<Region, string>;
    return { za, zb, values, text };
  }, [mean, sd, a, b, two, source, typedP, show]);

  const p = solved ? solved.values[show] : null;

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || mean === null || sd === null || p === null) return;
    replaceUrlSearch({
      mean: String(mean),
      sd: String(sd),
      ...(source === "p"
        ? { p: String(typedP) }
        : { ...(hasFrom ? { from: String(ends.from) } : {}), ...(hasTo ? { to: String(ends.to) } : {}) }),
      show,
    });
  }, [edited, mean, sd, p, source, typedP, hasFrom, hasTo, ends, show]);

  const labels: Record<Region, string> =
    a === null || b === null
      ? { below: "Below", between: "Between", above: "Above", outside: "Outside" }
      : {
          below: `Below ${X(a)}`,
          between: two ? `Between ${X(a)} and ${X(b)}` : "Between",
          above: `Above ${X(b)}`,
          outside: two ? `Below ${X(a)} or above ${X(b)}` : "Outside",
        };

  let name = "";
  let steps: string[] = [];
  let sentence = "";
  let regions: [number, number][] = [];
  if (solved && p !== null && mean !== null && sd !== null && a !== null && b !== null) {
    const { za, zb, text } = solved;
    const [A, B] = [X(a), X(b)];
    const result = equals(text[show]);
    const z = (v: number, score: number) => `(${X(v)} − ${wrap(X(mean))}) / ${X(sd)} = ${shown(score)}`;
    const phi = (score: number) => `Φ(${shown(score)})`;
    const [lowA, lowB, highB] = [lowerTail("z", za), lowerTail("z", zb), upperTail("z", zb)];
    name = { below: `P(X < ${A})`, above: `P(X > ${B})`, between: `P(${A} < X < ${B})`, outside: `P(X < ${A}) + P(X > ${B})` }[show];
    regions = {
      below: [[-Infinity, za]],
      above: [[zb, Infinity]],
      between: [[za, zb]],
      outside: [[-Infinity, za], [zb, Infinity]],
    }[show] as [number, number][];
    sentence = `${percent(p)} of the values fall ${labels[show].toLowerCase()}.`;

    if (source === "p" && typedP !== null) {
      // The other way round: from the probability to a z score, then to the values.
      const P = String(typedP).replace("-", "−");
      const tail = show === "below" || show === "above";
      const end = show === "above" ? a : b;
      // Where the value is printed to more digits than four decimals of z can give, z gets the digits too.
      const score = precise(show === "above" ? za : zb, (r) =>
        tail ? X(mean + r * sd) === X(end) : X(mean - r * sd) === A && X(mean + r * sd) === B,
      );
      const inside = { below: P, above: `1 − ${P}`, between: `(1 + ${P}) / 2`, outside: `1 − ${P} / 2` }[show];
      steps = [
        `z = Φ⁻¹(${inside}) = ${score}`,
        tail
          ? `x = ${X(mean)} + ${wrap(score)} × ${X(sd)} = ${X(end)}`
          : `x = ${X(mean)} ± ${score} × ${X(sd)} = ${A} and ${B}`,
      ];
    } else if (show === "below") {
      steps = [`z = ${z(a, za)}`, `${name} = ${phi(za)} ${result}`];
    } else if (show === "above") {
      const complement = plain(lowB) && plain(p) ? ` = 1 − ${lowB.toFixed(4)}` : "";
      steps = [`z = ${z(b, zb)}`, `${name} = 1 − ${phi(zb)}${complement} ${result}`];
    } else {
      const outside = show === "outside";
      const [first, second] = outside ? [lowA, highB] : [lowB, lowA];
      const numbers = plain(first) && plain(second) && plain(p) ? terms(first, second, outside ? 1 : -1, p) : null;
      const sum = numbers ? ` = ${numbers[0]} ${outside ? "+" : "−"} ${numbers[1]}` : "";
      steps = [
        `z = ${z(a, za)} and ${z(b, zb)}`,
        outside ? `${name}${sum} ${result}` : `${name} = ${phi(zb)} − ${phi(za)}${sum} ${result}`,
      ];
    }
  }

  // Typing a value takes over from a typed probability, keeping the other value as it stood.
  const typeEnd = (patch: { from: string } | { to: string }) =>
    set({
      source: "x",
      from: ends.from === null ? "" : source === "x" ? state.from : tidy(ends.from, places),
      to: ends.to === null ? "" : source === "x" ? state.to : tidy(ends.to, places),
      ...patch,
    });
  const endCell = (typed: string, value: number | null) => (source === "x" ? typed : value === null ? "" : tidy(value, places));

  return (
    <div className="space-y-8">
      <ToolCard title="Normal distribution" look={look} footer={name && solved ? `${name} ${equals(solved.text[show])}` : ""}>
        <div className="grid grid-cols-2 gap-2">
          <NumberCell
            label="Mean (μ)"
            name="Mean"
            value={state.mean}
            onChange={(v) => set({ mean: v })}
            invalid={!inRange(rawMean)}
            signed
          />
          <NumberCell
            label="SD (σ)"
            name="Standard deviation"
            value={state.sd}
            onChange={(v) => set({ sd: v })}
            invalid={!validSd(rawSd)}
          />
          <NumberCell
            label="From"
            name="Lower value. Leave empty for everything below the upper value."
            value={endCell(state.from, ends.from)}
            onChange={(v) => typeEnd({ from: v })}
            invalid={badFrom || (source === "x" && state.from.trim() !== "" && ends.from === null)}
            signed
          />
          <NumberCell
            label="To"
            name="Upper value. Leave empty for everything above the lower value."
            value={endCell(state.to, ends.to)}
            onChange={(v) => typeEnd({ to: v })}
            invalid={badTo || (source === "x" && state.to.trim() !== "" && ends.to === null)}
            signed
          />
          <div className="col-span-2">
            <NumberCell
              label="Probability"
              name="Probability of the chosen region. Type one to get the values."
              value={source === "p" ? state.p : p === null ? "" : cell(p)}
              onChange={(v) => set({ source: "p", p: v, show })}
              invalid={source === "p" && typedP === null}
              color={look.color}
            />
          </div>
        </div>

        <div className="mt-5">
          <DensityCurve
            dist="z"
            df={[]}
            regions={regions}
            fill="var(--color-dl)"
            label={(mark) => (mean === null || sd === null ? "" : shown(mean + mark * sd, clamp(2 + scale(sd), 0, 10)))}
          />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() => setEdited(EXAMPLE)}
          onClear={() => setEdited({ mean: "", sd: "", from: "", to: "", p: "", source: "x", show })}
          canShare={p !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          legend="The probability below, between, above and outside the two values. Choose one to shade it on the curve and see its working."
          name="show"
          options={REGIONS.map((r) => ({ value: r, label: labels[r], text: solved ? solved.text[r] : "—" }))}
          value={show}
          onChange={(r) => set({ show: r })}
          rows
        />

        {steps.length > 0 ? (
          <ol className="mt-3 space-y-0.5 font-mono text-xs text-[var(--muted)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {sentence ? <p className="mt-2 text-sm">{sentence}</p> : null}
      </section>
    </div>
  );
}

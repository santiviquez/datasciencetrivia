"use client";

import { useEffect, useMemo, useState } from "react";
import MassBars from "@/components/MassBars";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ResultChoice, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { binomialLower, binomialPmf, binomialUpper, logGamma } from "@/lib/stats";

/** Which probability is worked through: fewer than, at most, exactly, at least or more than x successes. */
type Show = "lt" | "le" | "eq" | "ge" | "gt";

interface State {
  n: string;
  p: string;
  x: string;
  show: Show;
}

/** An email that converts 10% of the people who get it, sent to 20 people. The binomial flashcard works the same numbers. */
const EXAMPLE: State = { n: "20", p: "0.1", x: "2", show: "eq" };
const MAX_N = 1_000_000;
/** In order along the number line. */
const SHOWS: { value: Show; words: string; sign: string }[] = [
  { value: "lt", words: "Fewer than", sign: "<" },
  { value: "le", words: "At most", sign: "≤" },
  { value: "eq", words: "Exactly", sign: "=" },
  { value: "ge", words: "At least", sign: "≥" },
  { value: "gt", words: "More than", sign: ">" },
];

const isShow = (v: string | null): v is Show => SHOWS.some((s) => s.value === v);

function parse(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

const validN = (v: number | null): v is number => v !== null && Number.isInteger(v) && v >= 1 && v <= MAX_N;

/** A probability from 0 to 1. Anything above 1 is read as a percentage, so 30 means 0.3. */
function parseP(raw: string): number | null {
  const v = parse(raw);
  if (v === null || v < 0 || v > 100) return null;
  return v > 1 ? Number((v / 100).toPrecision(12)) : v;
}

const minus = (s: string) => s.replace(/-/g, "−");
const whole = (v: number) => v.toLocaleString("en-US");
/** At most four decimals, no trailing zeros. */
const tidy = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 4 });

/**
 * Four decimals, or four significant digits once that would round to zero.
 * A 0 or 1 that is only the rounding of something close is marked as such.
 */
function prob(v: number, exact: boolean): string {
  if (v === 0) return exact ? "0" : "≈ 0";
  if (v === 1 && exact) return "1";
  if (v >= 0.99995) return "≈ 1";
  return v >= 0.0001 ? v.toFixed(4) : minus(v.toExponential(3));
}

/** "= 0.2852", or "≈ 0" as it stands. */
const equals = (text: string) => (text.startsWith("≈") ? text : `= ${text}`);
/** Whether a probability prints as plain decimals, so it can sit in a subtraction. */
const plain = (v: number) => v >= 0.0001 && v < 0.99995;

/** C(n, x) in full while it fits in 15 digits, and to four digits after that. */
function choose(n: number, x: number): string {
  const log10 = (logGamma(n + 1) - logGamma(x + 1) - logGamma(n - x + 1)) / Math.LN10;
  if (log10 < 15) {
    let c = BigInt(1);
    for (let i = 1; i <= Math.min(x, n - x); i++) c = (c * BigInt(n - i + 1)) / BigInt(i);
    return c.toLocaleString("en-US");
  }
  // Written out by hand, since the value itself can be past what a number holds.
  const exponent = Math.floor(log10);
  const digits = (10 ** (log10 - exponent)).toFixed(3);
  return digits === "10.000" ? `1.000e${exponent + 1}` : `${digits}e${exponent}`;
}

/** "P(0) + P(1) + P(2)", and "P(0) + P(1) + … + P(40)" past four terms. */
function series(from: number, to: number): string {
  const terms = to - from < 4 ? Array.from({ length: to - from + 1 }, (_, i) => from + i) : [from, from + 1, null, to];
  return terms.map((t) => (t === null ? "…" : `P(${t})`)).join(" + ");
}

/** The counts worth drawing: all of them for a small n, otherwise where the probability is, stretched to reach x. */
function drawn(n: number, p: number, x: number | null): [number, number] {
  if (n <= 40) return [0, n];
  const mean = n * p;
  const reach = Math.max(4.5 * Math.sqrt(mean * (1 - p)), 6);
  let lo = Math.max(0, Math.floor(mean - reach));
  let hi = Math.min(n, Math.ceil(mean + reach));
  if (x !== null && Math.abs(x - mean) <= 3 * reach) {
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
  }
  return [lo, hi];
}

/** A shared link (?n=20&p=0.1&x=2&show=eq) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const n = params.get("n");
  if (n === null) return null;
  const show = params.get("show");
  return { n, p: params.get("p") ?? "", x: params.get("x") ?? "", show: isShow(show) ? show : EXAMPLE.show };
}

export default function BinomialCalculator({ look }: { look: CardLook }) {
  // The link's inputs show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { show } = state;
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const rawN = parse(state.n);
  const n = validN(rawN) ? rawN : null;
  const p = parseP(state.p);
  const rawX = parse(state.x);
  const validX = rawX !== null && Number.isInteger(rawX) && rawX >= 0 && (n === null || rawX <= n);
  const x = validX && n !== null && p !== null ? rawX : null;

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || n === null || p === null || x === null) return;
    replaceUrlSearch({ n: String(n), p: String(p), x: String(x), show });
  }, [edited, n, p, x, show]);

  // The bars keep their shape while the number of successes is being typed.
  const bars = useMemo(() => {
    if (n === null || p === null) return null;
    const [lo, hi] = drawn(n, p, x);
    return { from: lo, mass: Array.from({ length: hi - lo + 1 }, (_, i) => binomialPmf(lo + i, n, p)) };
  }, [n, p, x]);

  const solved = useMemo(() => {
    if (n === null || p === null || x === null) return null;
    const values: Record<Show, number> = {
      lt: binomialLower(x - 1, n, p),
      le: binomialLower(x, n, p),
      eq: binomialPmf(x, n, p),
      ge: binomialUpper(x, n, p),
      gt: binomialUpper(x + 1, n, p),
    };
    // Certain or impossible by the numbers themselves, not by rounding.
    const sure = p === 0 || p === 1;
    const exact: Record<Show, boolean> = { lt: sure || x === 0, le: sure || x === n, eq: sure, ge: sure || x === 0, gt: sure || x === n };
    const text = Object.fromEntries(SHOWS.map((s) => [s.value, prob(values[s.value], exact[s.value])])) as Record<Show, string>;
    return { values, text };
  }, [n, p, x]);

  const { sign } = SHOWS.find((s) => s.value === show)!;
  let steps: string[] = [];
  let shade: [number, number] | null = null;
  if (solved && n !== null && p !== null && x !== null) {
    const { values, text } = solved;
    const left = `P(X ${sign} ${x})`;
    const result = equals(text[show]);
    if (show === "eq") {
      const c = choose(n, x);
      const q = Number((1 - p).toPrecision(12));
      steps = [`C(${n}, ${x}) = ${n}! / (${x}! × ${n - x}!) = ${c}`, `${left} = ${c} × ${p}^${x} × ${q}^${n - x} ${result}`];
      shade = [x, x];
    } else if (show === "le" || show === "lt") {
      const to = show === "le" ? x : x - 1;
      steps = to < 0 ? [`${left} = 0`] : [`${left} = ${show === "lt" ? `P(X ≤ ${to}) = ` : ""}${series(0, to)} ${result}`];
      shade = to < 0 ? null : [0, to];
    } else {
      const from = show === "ge" ? x : x + 1;
      const below = show === "ge" ? values.lt : values.le;
      if (from > n) steps = [`${left} = 0`];
      else if (from === 0) steps = [`${left} = 1`];
      else {
        const sum = `${left} = ${show === "gt" ? `P(X ≥ ${from}) = ` : ""}${series(from, n)}`;
        // The way it is done by hand, shown when both numbers print in full.
        steps =
          plain(below) && plain(values[show])
            ? [sum, `= 1 − P(X ≤ ${from - 1}) = 1 − ${below.toFixed(4)} ${result}`]
            : [`${sum} ${result}`];
      }
      shade = from > n ? null : [from, n];
    }
  }

  const mean = n !== null && p !== null ? n * p : null;
  const variance = mean !== null && p !== null ? mean * (1 - p) : null;

  return (
    <div className="space-y-8">
      <ToolCard title="Binomial distribution" look={look} footer={solved && x !== null ? `P(X ${sign} ${x}) ${equals(solved.text[show])}` : ""}>
        <div className="grid grid-cols-2 gap-2">
          <NumberCell
            label="Trials (n)"
            name="Number of trials"
            value={state.n}
            onChange={(v) => set({ n: v })}
            invalid={n === null}
            integer
          />
          <NumberCell
            label="Probability (p)"
            name="Probability of success on each trial, from 0 to 1"
            value={state.p}
            onChange={(v) => set({ p: v })}
            invalid={p === null}
          />
          <div className="col-span-2">
            <NumberCell
              label="Successes (x)"
              name="Number of successes"
              value={state.x}
              onChange={(v) => set({ x: v })}
              invalid={!validX}
              color={look.color}
              integer
            />
          </div>
        </div>

        <div className="mt-5">
          <MassBars from={bars?.from ?? 0} mass={bars?.mass ?? []} shade={shade} mark={x} fill="var(--color-dl)" />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() => setEdited(EXAMPLE)}
          onClear={() => setEdited({ n: "", p: "", x: "", show })}
          canShare={solved !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          legend="The probability of fewer than, at most, exactly, at least and more than that many successes. Choose one to shade it on the chart and see its working."
          name="show"
          options={SHOWS.map((s) => ({
            value: s.value,
            label: x === null ? s.words : `${s.words} ${whole(x)}`,
            text: solved ? solved.text[s.value] : "—",
          }))}
          value={show}
          onChange={(s) => set({ show: s })}
          rows
        />

        {steps.length > 0 ? (
          <ol className="mt-3 space-y-0.5 font-mono text-xs text-[var(--muted)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {mean !== null && variance !== null ? (
          <p className="mt-2 text-sm">
            Mean {tidy(mean)} (n × p), variance {tidy(variance)}, standard deviation {tidy(Math.sqrt(variance))}.
          </p>
        ) : null}
      </section>
    </div>
  );
}

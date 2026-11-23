"use client";

import { useEffect, useMemo, useState } from "react";
import DensityCurve, { type Tail } from "@/components/DensityCurve";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ResultChoice, Segmented, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { lowerTail, twoTail, upperQuantile, upperTail, type Distribution } from "@/lib/stats";

type Field = "x" | "df1" | "df2";
type Inputs = Record<Field, string>;

const DISTS = [
  { value: "z", label: "z", title: "z score" },
  { value: "t", label: "t", title: "t statistic" },
  { value: "chi2", label: "χ²", title: "Chi-square statistic" },
  { value: "f", label: "F", title: "F statistic" },
] as const;

const SYMBOL: Record<Distribution, string> = { z: "z", t: "t", chi2: "χ²", f: "F" };
const STAT_LABEL: Record<Distribution, string> = {
  z: "z score",
  t: "t statistic",
  chi2: "χ² statistic",
  f: "F statistic",
};
const TAIL_NAME: Record<Tail, string> = { two: "Two-tailed", right: "Right tail", left: "Left tail" };
const ALPHAS = [0.1, 0.05, 0.01];
const MAX = 1e6;

/** Each distribution opens on a worked example from its flashcard. */
const EXAMPLES: Record<Distribution, Inputs> = {
  z: { x: "1.96", df1: "", df2: "" },
  t: { x: "2.02", df1: "47", df2: "" },
  chi2: { x: "6.25", df1: "1", df2: "" },
  f: { x: "10", df1: "2", df2: "12" },
};
const EXAMPLE_DF: Record<Distribution, number[]> = { z: [], t: [47], chi2: [1], f: [2, 12] };
const EMPTY: Inputs = { x: "", df1: "", df2: "" };

const symmetric = (d: Distribution) => d === "z" || d === "t";
const dfCount = (d: Distribution) => (d === "z" ? 0 : d === "f" ? 2 : 1);
const isDist = (v: string | null): v is Distribution => DISTS.some((d) => d.value === v);
const isTail = (v: string | null): v is Tail => v === "two" || v === "right" || v === "left";

function parse(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

const validStat = (d: Distribution, x: number | null): x is number =>
  x !== null && Math.abs(x) <= MAX && (symmetric(d) || x >= 0);
const validDf = (v: number | null): v is number => v !== null && v > 0 && v <= MAX;

/** Four decimals, or two significant digits once that would round to zero. */
function formatP(p: number | null): string {
  if (p === null) return "—";
  if (p >= 0.0001) return p.toFixed(4);
  if (p === 0) return "< 1e-300";
  return p.toExponential(1).replace("-", "−");
}

/** Three decimals, or two significant digits for a critical value that would round to zero. */
const signed = (v: number) =>
  (v === 0 || Math.abs(v) >= 0.001 ? v.toFixed(3) : v.toPrecision(2)).replace(/-/g, "−");

interface State {
  dist: Distribution;
  inputs: Record<Distribution, Inputs>;
  /** z and t remember their tail separately from chi-square and F, which have no two-tailed p. */
  tails: { sym: Tail; one: Tail };
}

const INITIAL: State = { dist: "t", inputs: EXAMPLES, tails: { sym: "two", one: "right" } };

/** A shared link (?dist=t&x=2.02&df=47&tail=two) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const dist = params.get("dist");
  const x = params.get("x");
  if (!isDist(dist) || x === null) return null;
  const tail = params.get("tail");
  const tails = { ...INITIAL.tails };
  if (isTail(tail) && (symmetric(dist) || tail !== "two")) tails[symmetric(dist) ? "sym" : "one"] = tail;
  return {
    dist,
    inputs: { ...EXAMPLES, [dist]: { x, df1: params.get("df") ?? "", df2: params.get("df2") ?? "" } },
    tails,
  };
}

export default function PValueCalculator({ look }: { look: CardLook }) {
  // The link's inputs show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? INITIAL;
  const { dist, inputs } = state;

  const raw = inputs[dist];
  const tail = symmetric(dist) ? state.tails.sym : state.tails.one;
  const setDist = (d: Distribution) => setEdited({ ...state, dist: d });
  const setRaw = (next: Inputs) => setEdited({ ...state, inputs: { ...inputs, [dist]: next } });
  const setTail = (t: Tail) =>
    setEdited({ ...state, tails: { ...state.tails, [symmetric(dist) ? "sym" : "one"]: t } });

  // The curve keeps its shape while the statistic is being typed, as long as the df are usable.
  const df = useMemo(() => {
    const values = [parse(raw.df1), parse(raw.df2)].slice(0, dfCount(dist));
    return values.every(validDf) ? (values as number[]) : null;
  }, [dist, raw]);

  const parsed = useMemo(() => {
    const x = parse(raw.x);
    return validStat(dist, x) && df ? { x, df } : null;
  }, [dist, raw, df]);

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || !parsed) return;
    const [df1, df2] = parsed.df;
    replaceUrlSearch({
      dist,
      x: String(parsed.x),
      ...(df1 === undefined ? {} : { df: String(df1) }),
      ...(df2 === undefined ? {} : { df2: String(df2) }),
      tail,
    });
  }, [edited, dist, parsed, tail]);

  const p = useMemo<Record<Tail, number | null>>(() => {
    if (!parsed) return { two: null, right: null, left: null };
    const { x, df } = parsed;
    return {
      two: dist === "z" || dist === "t" ? twoTail(dist, x, df) : null,
      right: upperTail(dist, x, df),
      left: lowerTail(dist, x, df),
    };
  }, [dist, parsed]);

  const s = SYMBOL[dist];
  const dfText = parsed && parsed.df.length ? `${parsed.df.join(" and ")} df` : "";
  const report = parsed
    ? `${s}${parsed.df.length ? `(${parsed.df.join(", ")})` : ""} = ${String(parsed.x).replace("-", "−")}`
    : "";

  const upper = s === "χ²" ? "χ²" : s.toUpperCase();
  const working = parsed
    ? {
        two: `2 × P(${upper} ≥ ${Math.abs(parsed.x)})`,
        right: `P(${upper} ≥ ${String(parsed.x).replace("-", "−")})`,
        left: `P(${upper} ≤ ${String(parsed.x).replace("-", "−")})`,
      }[tail]
    : null;

  const levels = useMemo(() => {
    if (!parsed) return [];
    const { df } = parsed;
    return ALPHAS.map((alpha) => {
      const critical = upperQuantile(dist, tail === "two" ? alpha / 2 : tail === "right" ? alpha : 1 - alpha, df);
      const bound = tail === "two" ? `|${s}| ≥ ` : tail === "right" ? `${s} ≥ ` : `${s} ≤ `;
      // The search for a critical value stops at 1e12; past that there is no honest number to show.
      const region = Math.abs(critical) < 1e12 ? bound + signed(critical) : null;
      return { alpha, region, significant: p[tail]! < alpha };
    });
  }, [dist, parsed, p, s, tail]);

  const shownTails: Tail[] = symmetric(dist) ? ["two", "right", "left"] : ["right", "left"];
  const dfLabels = dist === "f" ? ["df₁", "df₂"] : dist === "z" ? [] : ["df"];
  const dfNames =
    dist === "f" ? ["Numerator degrees of freedom", "Denominator degrees of freedom"] : ["Degrees of freedom"];
  const fields: Field[] = ["df1", "df2"];

  return (
    <div className="space-y-8">
      <ToolCard title="P-value" look={look} footer={report}>
        <Segmented legend="Test statistic" name="dist" options={DISTS} value={dist} onChange={setDist} />

        <div
          className={`mt-2 grid gap-2 ${dist === "z" ? "" : dist === "f" ? "grid-cols-3" : "grid-cols-[3fr_2fr]"}`}
        >
          <NumberCell
            label={STAT_LABEL[dist]}
            name={DISTS.find((d) => d.value === dist)!.title}
            value={raw.x}
            onChange={(x) => setRaw({ ...raw, x })}
            invalid={!validStat(dist, parse(raw.x))}
            color={look.color}
            signed={symmetric(dist)}
          />
          {dfLabels.map((label, i) => (
            <NumberCell
              key={label}
              label={label}
              name={dfNames[i]}
              value={raw[fields[i]]}
              onChange={(v) => setRaw({ ...raw, [fields[i]]: v })}
              invalid={!validDf(parse(raw[fields[i]]))}
            />
          ))}
        </div>

        <div className="mt-5">
          <DensityCurve
            dist={dist}
            df={df ?? EXAMPLE_DF[dist]}
            x={parsed?.x ?? null}
            tail={tail}
            fill="var(--color-dl)"
          />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() => setRaw(EXAMPLES[dist])}
          onClear={() => setRaw(EMPTY)}
          canShare={parsed !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          legend="P-value by tail. Choose one to see its critical values."
          name="tail"
          options={shownTails.map((t) => ({ value: t, label: TAIL_NAME[t], text: formatP(p[t]) }))}
          value={tail}
          onChange={setTail}
        />

        {working ? (
          <p className="mt-3 font-mono text-xs text-[var(--muted)]">
            p = {working}
            {dfText ? `, ${dfText}` : ""}
          </p>
        ) : null}

        {levels.length > 0 ? (
          <table className="mt-6 w-full text-sm">
            <thead className="sr-only">
              <tr><th>Significance level</th><th>Result</th><th>Rejection region</th></tr>
            </thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.alpha} className="border-t border-[var(--rule)] align-baseline">
                  <th scope="row" className="py-2 pr-3 text-left font-normal tabular-nums">α = {l.alpha.toFixed(2)}</th>
                  <td className="py-2 pr-3 text-right font-semibold">{l.significant ? "Significant" : "Not significant"}</td>
                  <td className="hidden w-1/2 py-2 font-mono text-xs text-[var(--muted)] sm:table-cell">{l.region ? `reject H₀ if ${l.region}` : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </div>
  );
}

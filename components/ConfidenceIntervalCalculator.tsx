"use client";

import { useEffect, useMemo, useState } from "react";
import DensityCurve from "@/components/DensityCurve";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ResultChoice, Segmented, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { meanInterval, proportionInterval, type Interval } from "@/lib/stats";

type Kind = "mean" | "prop";
type Method = "t" | "z" | "wald" | "wilson";

const KINDS = [
  { value: "mean", label: "Mean", title: "Interval for a mean" },
  { value: "prop", label: "Proportion", title: "Interval for a proportion" },
] as const;

const METHODS: Record<Kind, readonly { value: Method; label: string }[]> = {
  mean: [
    { value: "t", label: "t interval" },
    { value: "z", label: "z interval" },
  ],
  prop: [
    { value: "wald", label: "Normal" },
    { value: "wilson", label: "Wilson" },
  ],
};

interface State {
  kind: Kind;
  mean: string;
  sd: string;
  n: string;
  /** Successes and the sample percentage are two views of one number: whichever was typed last drives the other. */
  source: "x" | "p";
  typed: string;
  /** The proportion's sample size, kept apart from the mean's. */
  size: string;
  /** In percent, shared by both kinds. */
  level: string;
  method: Record<Kind, Method>;
}

/** 100 deliveries averaging 32 minutes with a standard deviation of 10, and 120 conversions from 1,000 visitors. */
const EXAMPLE: State = {
  kind: "mean",
  mean: "32",
  sd: "10",
  n: "100",
  source: "x",
  typed: "120",
  size: "1000",
  level: "95",
  method: { mean: "t", prop: "wald" },
};
const MAX = 1e9;

function parse(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

const inRange = (v: number | null): v is number => v !== null && Math.abs(v) <= MAX;
const validSd = (v: number | null): v is number => v !== null && v > 0 && v <= MAX;
const validN = (v: number | null): v is number => v !== null && Number.isInteger(v) && v >= 1 && v <= MAX;
const between = (v: number | null, max: number): v is number => v !== null && v >= 0 && v <= max;

/**
 * The confidence level in percent, from 1 to 99.9999. Nobody wants a 0.95%
 * interval, so anything below 1 is read as a fraction.
 */
function parseLevel(raw: string): number | null {
  const v = parse(raw);
  if (v === null) return null;
  const percent = v < 1 ? Number((v * 100).toPrecision(12)) : v;
  return percent >= 1 && percent <= 99.9999 ? percent : null;
}

/** At most four decimals, no trailing zeros. */
const tidy = (v: number) => String(Number(v.toFixed(4)));
const minus = (s: string) => s.replace(/-/g, "−");
/** A typed number as JavaScript prints it, with a real minus sign. */
const shown = (v: number) => minus(String(v));
/** Four significant digits, for the small terms in the working. */
const sig = (v: number, digits = 4) => minus(String(Number(v.toPrecision(digits))));

/** Enough decimals to show two digits of the margin, and never fewer than two. */
const decimalsFor = (margin: number) =>
  margin > 0 ? Math.min(8, Math.max(2, 1 - Math.floor(Math.log10(margin)))) : 2;

function fixed(v: number, decimals: number): string {
  const s = v.toFixed(decimals);
  return Number(s) === 0 ? s.replace("-", "") : minus(s);
}

/** A shared link (?type=mean&mean=32&sd=10&n=100&level=95, or ?type=prop&x=120&n=1000) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const type = params.get("type");
  if (type !== "mean" && type !== "prop") return null;
  const level = params.get("level") ?? EXAMPLE.level;
  const method = params.get("method");
  if (type === "mean") {
    return {
      ...EXAMPLE,
      kind: "mean",
      mean: params.get("mean") ?? "",
      sd: params.get("sd") ?? "",
      n: params.get("n") ?? "",
      level,
      method: { ...EXAMPLE.method, mean: method === "z" ? "z" : "t" },
    };
  }
  const p = params.get("p");
  return {
    ...EXAMPLE,
    kind: "prop",
    source: p === null ? "x" : "p",
    typed: p ?? params.get("x") ?? "",
    size: params.get("n") ?? "",
    level,
    method: { ...EXAMPLE.method, prop: method === "wilson" ? "wilson" : "wald" },
  };
}

type Solved =
  | { kind: "mean"; level: number; mean: number; sd: number; n: number }
  | { kind: "prop"; level: number; x: number; n: number };

export default function ConfidenceIntervalCalculator({ look }: { look: CardLook }) {
  // The link's inputs show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { kind, source } = state;
  const method = state.method[kind];
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const level = parseLevel(state.level);
  const size = parse(state.size);
  const typed = parse(state.typed);
  // The count behind a proportion, whichever of the two cells it was typed into.
  const successes = !validN(size)
    ? null
    : source === "x"
      ? between(typed, size) ? typed : null
      : between(typed, 100) ? (typed / 100) * size : null;

  const solved = useMemo<Solved | null>(() => {
    if (level === null) return null;
    if (kind === "prop") return successes === null || !validN(size) ? null : { kind, level, x: successes, n: size };
    const mean = parse(state.mean);
    const sd = parse(state.sd);
    const n = parse(state.n);
    return inRange(mean) && validSd(sd) && validN(n) ? { kind, level, mean, sd, n } : null;
  }, [kind, level, successes, size, state.mean, state.sd, state.n]);

  const intervals = useMemo<Partial<Record<Method, Interval | null>>>(() => {
    if (!solved) return {};
    const c = solved.level / 100;
    if (solved.kind === "prop") {
      return {
        wald: proportionInterval("wald", solved.x, solved.n, c),
        wilson: proportionInterval("wilson", solved.x, solved.n, c),
      };
    }
    const { mean, sd, n } = solved;
    // One observation has no degrees of freedom left for a t interval.
    return { t: n >= 2 ? meanInterval("t", mean, sd, n, c) : null, z: meanInterval("z", mean, sd, n, c) };
  }, [solved]);

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || !solved) return;
    const common = { level: String(solved.level), method };
    replaceUrlSearch(
      solved.kind === "mean"
        ? { type: "mean", mean: String(solved.mean), sd: String(solved.sd), n: String(solved.n), ...common }
        : { type: "prop", [source]: String(typed), n: String(solved.n), ...common },
    );
  }, [edited, solved, method, source, typed]);

  /** An interval's bounds as text: the mean's own units, or percent for a proportion. */
  const bounds = (ci: Interval): [string, string] => {
    const scale = kind === "prop" ? 100 : 1;
    const unit = kind === "prop" ? "%" : "";
    const d = decimalsFor(((ci.upper - ci.lower) / 2) * scale);
    return [fixed(ci.lower * scale, d) + unit, fixed(ci.upper * scale, d) + unit];
  };

  const chosen = intervals[method] ?? null;
  const range = chosen ? bounds(chosen) : null;
  const levelText = solved ? `${shown(solved.level)}%` : "";
  const report = range ? `${levelText} CI: ${range[0]} to ${range[1]}` : "";
  // The card's footer has room for a short report only.
  const footer = report.length <= 24 ? report : `${levelText} CI`;

  let working: string | null = null;
  let note: string | null = null;
  if (solved && chosen) {
    const crit = chosen.critical.toFixed(3);
    if (solved.kind === "mean") {
      const { mean, sd, n } = solved;
      const margin = (chosen.critical * sd) / Math.sqrt(n);
      const m = fixed(margin, decimalsFor(margin));
      working = `${shown(mean)} ± ${crit} × ${shown(sd)}/√${n} = ${shown(mean)} ± ${m}`;
      note =
        method === "t"
          ? `Margin of error ±${m}, with ${n - 1} degree${n === 2 ? "" : "s"} of freedom.`
          : `Margin of error ±${m}.`;
    } else {
      const { x, n } = solved;
      const p = x / n;
      const z = chosen.critical;
      if (method === "wald") {
        const margin = z * Math.sqrt((p * (1 - p)) / n);
        const points = margin * 100;
        working = `${sig(p)} ± ${crit} × √(${sig(p)} × ${sig(1 - p)}/${n}) = ${sig(p)} ± ${sig(margin, 3)}`;
        note = `Margin of error ±${fixed(points, decimalsFor(points))} points.`;
        if (x < 10 || n - x < 10) note += " Under 10 successes or failures, so Wilson is the safer interval.";
      } else {
        const root = Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
        const scale = 1 + (z * z) / n;
        const centre = ((p + (z * z) / (2 * n)) / scale) * 100;
        working = `(${sig(p)} + ${sig((z * z) / (2 * n))} ± ${crit} × ${sig(root)}) / ${sig(scale, 6)}`;
        note = `Wilson score interval, centred on ${fixed(centre, decimalsFor(root * 100))}%.`;
      }
    }
  }

  const invalidTyped = (cell: "x" | "p") =>
    source === cell && !(cell === "x" ? between(typed, validN(size) ? size : MAX) : between(typed, 100));
  const derived = (cell: "x" | "p") =>
    source === cell
      ? state.typed
      : successes === null || !validN(size)
        ? ""
        : tidy(cell === "x" ? successes : (successes / size) * 100);

  const levelCell = (
    <NumberCell
      label="Confidence %"
      name="Confidence level in percent"
      value={state.level}
      onChange={(v) => set({ level: v })}
      invalid={level === null}
      color={look.color}
    />
  );

  return (
    <div className="space-y-8">
      <ToolCard title="Confidence interval" look={look} footer={footer}>
        <Segmented legend="Interval for" name="type" options={KINDS} value={kind} onChange={(k) => set({ kind: k })} />

        {kind === "mean" ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <NumberCell
              label="Mean"
              name="Sample mean"
              value={state.mean}
              onChange={(mean) => set({ mean })}
              invalid={!inRange(parse(state.mean))}
              signed
            />
            <NumberCell
              label="SD"
              name="Standard deviation"
              value={state.sd}
              onChange={(sd) => set({ sd })}
              invalid={!validSd(parse(state.sd))}
            />
            <NumberCell
              label="n"
              name="Sample size"
              value={state.n}
              onChange={(n) => set({ n })}
              invalid={!validN(parse(state.n))}
              integer
            />
            {levelCell}
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <NumberCell
              label="Successes"
              name="Number of successes"
              value={derived("x")}
              onChange={(v) => set({ source: "x", typed: v })}
              invalid={invalidTyped("x")}
            />
            <NumberCell
              label="n"
              name="Sample size"
              value={state.size}
              onChange={(v) => set({ size: v })}
              invalid={!validN(size)}
              integer
            />
            <NumberCell
              label="Sample %"
              name="Sample proportion in percent"
              value={derived("p")}
              onChange={(v) => set({ source: "p", typed: v })}
              invalid={invalidTyped("p")}
            />
            {levelCell}
          </div>
        )}

        <div className="mt-5">
          <DensityCurve
            dist={method === "t" ? "t" : "z"}
            df={method === "t" ? [solved?.kind === "mean" && solved.n >= 2 ? solved.n - 1 : 99] : []}
            x={chosen?.critical ?? null}
            tail="middle"
            fill="var(--color-dl)"
            label={(mark) => (range ? range[mark < 0 ? 0 : 1] : "")}
          />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() =>
            set(
              kind === "mean"
                ? { mean: EXAMPLE.mean, sd: EXAMPLE.sd, n: EXAMPLE.n, level: EXAMPLE.level }
                : { source: EXAMPLE.source, typed: EXAMPLE.typed, size: EXAMPLE.size, level: EXAMPLE.level },
            )
          }
          onClear={() => set(kind === "mean" ? { mean: "", sd: "", n: "" } : { source: "x", typed: "", size: "" })}
          canShare={solved !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          rows
          legend="Confidence interval by method. Choose one to see its working."
          name="method"
          options={METHODS[kind].map((m) => {
            const ci = intervals[m.value];
            const [lower, upper] = ci ? bounds(ci) : [];
            return { ...m, text: ci ? `${lower} to ${upper}` : "—" };
          })}
          value={method}
          onChange={(m) => set({ method: { ...state.method, [kind]: m } })}
        />

        {working ? <p className="mt-3 font-mono text-xs text-[var(--muted)]">{working}</p> : null}
        {note ? <p className="mt-2 text-sm">{note}</p> : null}
      </section>
    </div>
  );
}

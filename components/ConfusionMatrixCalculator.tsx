"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  EXAMPLE_COUNTS,
  METRICS,
  formatMetric,
  total,
  type ConfusionCounts,
  type MetricDef,
  type MetricKey,
} from "@/lib/metrics";

type Cell = keyof ConfusionCounts;
const CELLS: Cell[] = ["tp", "fn", "fp", "tn"];

const CELL_INFO: Record<Cell, { short: string; long: string; correct: boolean }> = {
  tp: { short: "TP", long: "True positives", correct: true },
  fn: { short: "FN", long: "False negatives", correct: false },
  fp: { short: "FP", long: "False positives", correct: false },
  tn: { short: "TN", long: "True negatives", correct: true },
};

const HEADLINE: MetricKey[] = ["accuracy", "precision", "recall", "f1"];

/** The numbers plugged into the formula, so the reader can check the arithmetic. */
function substituted(key: MetricKey, c: ConfusionCounts): string | null {
  const { tp, fp, fn, tn } = c;
  const n = total(c);
  switch (key) {
    case "accuracy":
      return `(${tp} + ${tn}) / ${n}`;
    case "precision":
      return `${tp} / (${tp} + ${fp})`;
    case "recall":
      return `${tp} / (${tp} + ${fn})`;
    case "specificity":
      return `${tn} / (${tn} + ${fp})`;
    case "f1":
      return `${2 * tp} / (${2 * tp} + ${fp} + ${fn})`;
    case "npv":
      return `${tn} / (${tn} + ${fn})`;
    case "fpr":
      return `${fp} / (${fp} + ${tn})`;
    case "fnr":
      return `${fn} / (${fn} + ${tp})`;
    case "fdr":
      return `${fp} / (${fp} + ${tp})`;
    case "prevalence":
      return `(${tp} + ${fn}) / ${n}`;
    default:
      return null;
  }
}

function parseCount(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 1e9 ? n : null;
}

function pct(v: number | null) {
  return v === null ? "" : `${(v * 100).toFixed(1)}%`;
}

function MetricBar({ def, value }: { def: MetricDef; value: number | null }) {
  if (value === null) return <div className="h-2 bg-black/5" aria-hidden="true" />;
  const [lo, hi] = def.range;
  const share = Math.min(1, Math.max(0, (value - lo) / (hi - lo)));
  const zero = lo < 0 ? (0 - lo) / (hi - lo) : 0;
  const left = Math.min(share, zero);
  const width = Math.abs(share - zero);
  return (
    <div className="relative h-2 bg-black/5" aria-hidden="true">
      {lo < 0 ? <span className="absolute inset-y-0 w-px bg-black/40" style={{ left: `${zero * 100}%` }} /> : null}
      <span
        className="absolute inset-y-0 bg-black transition-[left,width] duration-200 ease-out"
        style={{ left: `${left * 100}%`, width: `${width * 100}%` }}
      />
    </div>
  );
}

function MetricRow({ def, counts, big }: { def: MetricDef; counts: ConfusionCounts; big?: boolean }) {
  const value = def.compute(counts);
  const sub = substituted(def.key, counts);
  return (
    <li className={`flex flex-col gap-2 border-[var(--rule)] ${big ? "border-[6px] border-black p-4" : "border-t py-4"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-[family-name:var(--font-card)] text-sm font-bold uppercase leading-tight">{def.name}</h3>
        <p className="shrink-0 text-right font-[family-name:var(--font-card)] tabular-nums">
          <span className={big ? "text-2xl font-bold" : "text-lg font-bold"}>{formatMetric(value)}</span>
          {def.range[0] === 0 && value !== null ? (
            <span className="ml-2 text-xs text-[var(--muted)]">{pct(value)}</span>
          ) : null}
        </p>
      </div>
      <MetricBar def={def} value={value} />
      {def.aka ? <p className="text-xs text-[var(--muted)]">Also called {def.aka}</p> : null}
      <p className="text-sm leading-relaxed">{def.meaning}</p>
      <p className="font-mono text-xs leading-relaxed text-[var(--muted)]">
        {def.formula}
        {sub ? <> = {sub}</> : null}
        {value === null ? " → undefined, the denominator is 0" : null}
      </p>
      {def.card ? (
        <Link href={`/questions/${def.card}`} className="text-xs font-semibold underline underline-offset-2">
          {def.name} on its flashcard
        </Link>
      ) : null}
    </li>
  );
}

export default function ConfusionMatrixCalculator() {
  const [raw, setRaw] = useState<Record<Cell, string>>({
    tp: String(EXAMPLE_COUNTS.tp),
    fp: String(EXAMPLE_COUNTS.fp),
    fn: String(EXAMPLE_COUNTS.fn),
    tn: String(EXAMPLE_COUNTS.tn),
  });
  const [copied, setCopied] = useState(false);

  // A shared link (?tp=…&fp=…&fn=…&tn=…) opens with those counts.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = CELLS.map((c) => parseCount(params.get(c)));
    if (fromUrl.every((v) => v !== null)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
      setRaw({ tp: String(fromUrl[0]), fn: String(fromUrl[1]), fp: String(fromUrl[2]), tn: String(fromUrl[3]) });
    }
  }, []);

  const parsed = useMemo(() => {
    const out = {} as ConfusionCounts;
    for (const c of CELLS) {
      const v = parseCount(raw[c]);
      if (v === null) return null;
      out[c] = v;
    }
    return out;
  }, [raw]);

  useEffect(() => {
    if (!parsed) return;
    const url = new URL(window.location.href);
    for (const c of CELLS) url.searchParams.set(c, String(parsed[c]));
    window.history.replaceState(null, "", url);
  }, [parsed]);

  const counts = parsed ?? { tp: 0, fp: 0, fn: 0, tn: 0 };
  const n = total(counts);
  const headline = METRICS.filter((m) => HEADLINE.includes(m.key));
  const rest = METRICS.filter((m) => !HEADLINE.includes(m.key));

  const accuracy = METRICS[0].compute(counts);
  const mcc = METRICS.find((m) => m.key === "mcc")!.compute(counts);
  const prevalence = n === 0 ? null : (counts.tp + counts.fn) / n;
  const imbalanced = prevalence !== null && (prevalence < 0.2 || prevalence > 0.8);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const cellInput = (c: Cell) => {
    const info = CELL_INFO[c];
    const invalid = parseCount(raw[c]) === null;
    return (
      <label
        key={c}
        className="flex flex-col gap-1 border-[4px] border-black p-3"
        style={{ backgroundColor: info.correct ? "var(--color-stats)" : "var(--color-dl)" }}
      >
        <span className="font-[family-name:var(--font-card)] text-xs font-bold uppercase">
          {info.short} <span className="font-normal normal-case">· {info.long}</span>
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={raw[c]}
          onChange={(e) => setRaw((r) => ({ ...r, [c]: e.target.value }))}
          aria-invalid={invalid}
          className={`w-full border-2 bg-white px-2 py-1.5 font-[family-name:var(--font-card)] text-xl font-bold tabular-nums outline-none focus:border-black ${
            invalid ? "border-red-600" : "border-black/20"
          }`}
        />
      </label>
    );
  };

  return (
    <div>
      <section aria-labelledby="calc-input" className="border-[10px] border-black bg-white">
        <header className="flex items-center justify-between gap-3 border-b-[10px] border-black px-4 py-3" style={{ backgroundColor: "var(--color-ml)" }}>
          <h2 id="calc-input" className="font-[family-name:var(--font-card)] text-sm font-bold uppercase sm:text-base">
            Your confusion matrix
          </h2>
          <span className="text-xs font-semibold tabular-nums">n = {n.toLocaleString("en-US")}</span>
        </header>

        <div className="p-4">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-xs">
            <span />
            <span className="text-center font-semibold">Predicted positive</span>
            <span className="text-center font-semibold">Predicted negative</span>

            <span className="flex items-center font-semibold [writing-mode:vertical-rl] rotate-180 sm:rotate-0 sm:[writing-mode:horizontal-tb]">Actual positive</span>
            {cellInput("tp")}
            {cellInput("fn")}

            <span className="flex items-center font-semibold [writing-mode:vertical-rl] rotate-180 sm:rotate-0 sm:[writing-mode:horizontal-tb]">Actual negative</span>
            {cellInput("fp")}
            {cellInput("tn")}
          </div>

          {!parsed ? (
            <p className="mt-3 text-sm text-red-700" role="alert">
              Each cell needs a whole number of 0 or more.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setRaw({
                  tp: String(EXAMPLE_COUNTS.tp),
                  fp: String(EXAMPLE_COUNTS.fp),
                  fn: String(EXAMPLE_COUNTS.fn),
                  tn: String(EXAMPLE_COUNTS.tn),
                })
              }
              className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white active:scale-[0.97]"
            >
              Load the fraud example
            </button>
            <button
              type="button"
              onClick={() => setRaw({ tp: "", fp: "", fn: "", tn: "" })}
              className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white active:scale-[0.97]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={copyLink}
              disabled={!parsed}
              className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white active:scale-[0.97] disabled:opacity-40"
            >
              {copied ? "Link copied" : "Copy a link to these numbers"}
            </button>
          </div>
        </div>
      </section>

      {parsed && n > 0 ? (
        <p className="mt-6 max-w-2xl leading-relaxed" aria-live="polite">
          Out of {n.toLocaleString("en-US")} cases, the model flagged {(counts.tp + counts.fp).toLocaleString("en-US")} as
          positive and {counts.tp.toLocaleString("en-US")} of those were right. It caught {counts.tp.toLocaleString("en-US")}{" "}
          of the {(counts.tp + counts.fn).toLocaleString("en-US")} real positives.
          {imbalanced && accuracy !== null && mcc !== null && accuracy - Math.max(mcc, 0) > 0.25 ? (
            <>
              {" "}
              Only {pct(prevalence)} of the data is positive, so accuracy ({pct(accuracy)}) looks much better than the
              model is. Read MCC ({formatMetric(mcc, 2)}), F1 or balanced accuracy instead.
            </>
          ) : null}
        </p>
      ) : null}

      <section aria-labelledby="calc-results" className="mt-8">
        <h2 id="calc-results" className="font-[family-name:var(--font-display)] text-xl">
          Results
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {headline.map((m) => (
            <MetricRow key={m.key} def={m} counts={counts} big />
          ))}
        </ul>
        <ul className="mt-6">
          {rest.map((m) => (
            <MetricRow key={m.key} def={m} counts={counts} />
          ))}
        </ul>
      </section>
    </div>
  );
}

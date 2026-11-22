"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import {
  EXAMPLE_COUNTS,
  METRICS,
  total,
  type ConfusionCounts,
  type MetricKey,
} from "@/lib/metrics";

type Cell = keyof ConfusionCounts;
const CELLS: Cell[] = ["tp", "fn", "fp", "tn"];
const CORRECT: Record<Cell, boolean> = { tp: true, fn: false, fp: false, tn: true };
const HEADLINE: MetricKey[] = ["accuracy", "precision", "recall", "f1"];
const SHORT: Partial<Record<MetricKey, string>> = { f1: "F1", mcc: "MCC" };

/** The numbers plugged into the formula, so the reader can check the arithmetic. */
function working(key: MetricKey, c: ConfusionCounts): string | null {
  const { tp, fp, fn, tn } = c;
  switch (key) {
    case "accuracy":
      return `(${tp} + ${tn}) / ${total(c)}`;
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
      return `(${tp} + ${fn}) / ${total(c)}`;
    default:
      return null;
  }
}

function parseCount(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 1e9 ? n : null;
}

const show = (v: number | null) => (v === null ? "—" : v.toFixed(3));

const asRaw = (c: ConfusionCounts): Record<Cell, string> => ({
  tp: String(c.tp),
  fp: String(c.fp),
  fn: String(c.fn),
  tn: String(c.tn),
});
const EXAMPLE_RAW = asRaw(EXAMPLE_COUNTS);

export default function ConfusionMatrixCalculator({ look }: { look: CardLook }) {
  // A shared link (?tp=…&fp=…&fn=…&tn=…) opens with those counts, until the first edit.
  const search = useUrlSearch();
  const shared = useMemo(() => {
    const params = new URLSearchParams(search);
    const v = CELLS.map((c) => parseCount(params.get(c)));
    return v.every((x) => x !== null) ? { tp: String(v[0]), fn: String(v[1]), fp: String(v[2]), tn: String(v[3]) } : null;
  }, [search]);
  const [edited, setRaw] = useState<Record<Cell, string> | null>(null);
  const raw = edited ?? shared ?? EXAMPLE_RAW;

  const counts = useMemo(() => {
    const out = {} as ConfusionCounts;
    for (const c of CELLS) {
      const v = parseCount(raw[c]);
      if (v === null) return null;
      out[c] = v;
    }
    return out;
  }, [raw]);

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || !counts) return;
    replaceUrlSearch(Object.fromEntries(CELLS.map((c) => [c, String(counts[c])])));
  }, [edited, counts]);

  const c = counts ?? { tp: 0, fp: 0, fn: 0, tn: 0 };
  const n = total(c);
  const get = (k: MetricKey) => METRICS.find((m) => m.key === k)!.compute(c);
  const prevalence = get("prevalence");
  const accuracy = get("accuracy");
  const mcc = get("mcc");
  const flattered =
    prevalence !== null && accuracy !== null && mcc !== null &&
    (prevalence < 0.2 || prevalence > 0.8) && accuracy - Math.max(mcc, 0) > 0.25;

  const input = (cell: Cell, name: string) => (
    <NumberCell
      label={cell.toUpperCase()}
      name={name}
      value={raw[cell]}
      onChange={(v) => setRaw({ ...raw, [cell]: v })}
      invalid={parseCount(raw[cell]) === null}
      color={CORRECT[cell] ? "var(--color-stats)" : "var(--color-dl)"}
      integer
    />
  );

  return (
    <div className="space-y-8">
      <ToolCard title="Confusion matrix" look={look} footer={`n = ${n.toLocaleString("en-US")}`}>
        <div className="grid grid-cols-[1.25rem_1fr_1fr] gap-2">
          <span />
          <span className="text-center text-[11px] text-[var(--muted)]">Predicted +</span>
          <span className="text-center text-[11px] text-[var(--muted)]">Predicted −</span>
          <span className="flex items-center justify-center text-[11px] text-[var(--muted)] [writing-mode:vertical-rl] rotate-180">Actual +</span>
          {input("tp", "True positives")}
          {input("fn", "False negatives")}
          <span className="flex items-center justify-center text-[11px] text-[var(--muted)] [writing-mode:vertical-rl] rotate-180">Actual −</span>
          {input("fp", "False positives")}
          {input("tn", "True negatives")}
        </div>

        <ToolActions
          className="mt-4 pl-7"
          onExample={() => setRaw(EXAMPLE_RAW)}
          onClear={() => setRaw({ tp: "", fp: "", fn: "", tn: "" })}
          canShare={counts !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <dl className="grid grid-cols-2 border-[4px] border-black sm:grid-cols-4">
          {HEADLINE.map((k, i) => {
            const m = METRICS.find((d) => d.key === k)!;
            return (
              <div
                key={k}
                className={`px-3 py-3 ${i % 2 ? "border-l-[4px] border-black" : ""} ${i > 1 ? "border-t-[4px] border-black sm:border-t-0" : ""} ${i === 2 ? "sm:border-l-[4px]" : ""}`}
              >
                <dt className="font-[family-name:var(--font-card)] text-[11px] font-bold uppercase">{SHORT[k] ?? m.name}</dt>
                <dd className="mt-1 font-[family-name:var(--font-card)] text-2xl font-bold tabular-nums">{show(m.compute(c))}</dd>
              </div>
            );
          })}
        </dl>

        {flattered ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Only {(prevalence! * 100).toFixed(0)}% of cases are positive, so accuracy flatters this model. MCC is{" "}
            {mcc!.toFixed(2)}.
          </p>
        ) : null}

        <table className="mt-6 w-full text-sm">
          <thead className="sr-only">
            <tr><th>Metric</th><th>Value</th><th>Working</th></tr>
          </thead>
          <tbody>
            {METRICS.map((m) => {
              const w = working(m.key, c);
              return (
                <tr key={m.key} className="border-t border-[var(--rule)] align-baseline">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    {m.card ? (
                      <Link href={`/questions/${m.card}`} className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current">
                        {m.name}
                      </Link>
                    ) : (
                      m.name
                    )}
                  </th>
                  <td className="py-2 pr-3 text-right font-semibold tabular-nums">{show(m.compute(c))}</td>
                  <td className="hidden py-2 font-mono text-xs text-[var(--muted)] sm:table-cell">
                    {m.formula}
                    {w ? ` = ${w}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-[var(--muted)]">— means undefined: the formula divides by zero.</p>
      </section>
    </div>
  );
}

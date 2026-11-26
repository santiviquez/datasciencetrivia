"use client";

import { useEffect, useMemo, useState } from "react";
import DotStrip from "@/components/DotStrip";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { ListCell, ResultChoice, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { MAX_LINK, badEntry, listFromSearch, parseList, shown } from "@/lib/number-list";
import { spread, variance } from "@/lib/stats";

type Kind = "sample" | "population";

interface State {
  text: string;
  kind: Kind;
}

/** Eight numbers with a mean of 5 and a population standard deviation of exactly 2. */
const EXAMPLE: State = { text: "2, 4, 4, 4, 5, 5, 7, 9", kind: "sample" };
const KINDS: { value: Kind; label: string }[] = [
  { value: "sample", label: "Sample" },
  { value: "population", label: "Population" },
];

/** A shared link (?data=2,4,4,4,5,5,7,9&sd=population) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const text = listFromSearch(params);
  if (text === null) return null;
  return { text, kind: params.get("sd") === "population" ? "population" : "sample" };
}

export default function StandardDeviationCalculator({ look }: { look: CardLook }) {
  // The link's numbers show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { text, kind } = state;
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const { values, bad } = useMemo(() => parseList(text), [text]);
  const stats = useMemo(() => (values.length ? spread(values) : null), [values]);
  const link = values.join(",");

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || !link || link.length > MAX_LINK) return;
    replaceUrlSearch({ data: link, sd: kind });
  }, [edited, link, kind]);

  // One number has no spread to estimate, so a sample needs two.
  const sd = (k: Kind) => (stats && (k === "population" || stats.n > 1) ? Math.sqrt(variance(stats, k === "sample")) : null);
  const chosen = sd(kind);
  const symbol = kind === "sample" ? "s" : "σ";

  let steps: string[] = [];
  let note: string | null = null;
  if (bad !== null) {
    note = badEntry(bad);
  } else if (stats && chosen === null) {
    note = "A sample standard deviation needs at least two numbers.";
  } else if (stats && chosen !== null) {
    const { n, sum, mean, ss } = stats;
    const v = variance(stats, kind === "sample");
    steps = [
      `mean = ${shown(sum)} / ${n} = ${shown(mean)}`,
      `Σ(x − mean)² = ${shown(ss)}`,
      `variance = ${shown(ss)} / ${kind === "sample" ? `(${n} − 1)` : n} = ${shown(v)}`,
      `${symbol} = √${shown(v)} = ${shown(chosen)}`,
    ];
    const within = values.filter((x) => Math.abs(x - mean) <= chosen).length;
    note =
      chosen === 0
        ? "Every value is the same, so there is no spread."
        : `${within.toLocaleString("en-US")} of ${n.toLocaleString("en-US")} values ${within === 1 ? "is" : "are"} within one standard deviation of the mean, ` +
          `${shown(mean - chosen)} to ${shown(mean + chosen)}. Standard error of the mean: ${shown(chosen / Math.sqrt(n))}.`;
  }

  return (
    <div className="space-y-8">
      <ToolCard title="Standard deviation" look={look} footer={chosen === null ? "" : `${symbol} = ${shown(chosen)}`}>
        <ListCell
          label="Numbers"
          name="Numbers, separated by commas, spaces or new lines"
          value={text}
          onChange={(t) => set({ text: t })}
          invalid={bad !== null}
          count={values.length}
          placeholder="Paste or type numbers"
        />

        <div className="mt-5">
          <DotStrip
            values={values}
            marks={stats ? [stats.mean] : []}
            band={stats && chosen !== null ? [stats.mean - chosen, stats.mean + chosen] : null}
            fill="var(--color-dl)"
            caption={stats && chosen !== null ? (fmt) => `${fmt(stats.mean)} ± ${fmt(chosen)}` : undefined}
          />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() => set({ text: EXAMPLE.text })}
          onClear={() => set({ text: "" })}
          canShare={link !== "" && link.length <= MAX_LINK}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          legend="Standard deviation as a sample or as a whole population. Choose one to see its working."
          name="sd"
          options={KINDS.map((k) => {
            const value = sd(k.value);
            return { ...k, text: value === null ? "—" : shown(value) };
          })}
          value={kind}
          onChange={(k) => set({ kind: k })}
        />

        {steps.length > 0 ? (
          <ol className="mt-3 space-y-0.5 font-mono text-xs text-[var(--muted)]">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {note ? <p className="mt-2 text-sm">{note}</p> : null}
      </section>
    </div>
  );
}

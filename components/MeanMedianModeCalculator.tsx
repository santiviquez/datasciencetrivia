"use client";

import { useEffect, useMemo, useState } from "react";
import DotStrip from "@/components/DotStrip";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { ListCell, ResultChoice, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { MAX_LINK, badEntry, listFromSearch, parseList, shown } from "@/lib/number-list";
import { modes, sampleQuantile, spread } from "@/lib/stats";

type Stat = "mean" | "median" | "mode" | "range";

interface State {
  text: string;
  show: Stat;
}

/** Eight numbers whose mean (5), median (4.5) and mode (4) all differ. The standard deviation calculator opens on the same list. */
const EXAMPLE: State = { text: "2, 4, 4, 4, 5, 5, 7, 9", show: "mean" };
const STATS: { value: Stat; label: string }[] = [
  { value: "mean", label: "Mean" },
  { value: "median", label: "Median" },
  { value: "mode", label: "Mode" },
  { value: "range", label: "Range" },
];
/** A longer list is not written out again in sorted order. */
const MAX_SORTED = 60;
/** Quartiles of fewer numbers than this say little. */
const MIN_FOR_QUARTILES = 4;

/** A shared link (?data=2,4,4,4,5,5,7,9&show=median) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const text = listFromSearch(params);
  if (text === null) return null;
  const show = STATS.find((s) => s.value === params.get("show"))?.value ?? "mean";
  return { text, show };
}

/** Everything the card shows, from one pass over the sorted list. */
function summarize(values: readonly number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const { n, sum, mean } = spread(values);
  return {
    sorted,
    n,
    sum,
    mean,
    median: sampleQuantile(sorted, 0.5),
    q1: sampleQuantile(sorted, 0.25),
    q3: sampleQuantile(sorted, 0.75),
    mode: modes(sorted),
    min: sorted[0],
    max: sorted[n - 1],
  };
}

/** Values in a tight space: one is always written out, several only when they fit (otherwise null). */
function several(values: readonly number[], room: number): string | null {
  const all = values.map(shown).join(", ");
  return values.length === 1 || all.length <= room ? all : null;
}

/** "4", "4 and 5", "4, 5 and 7", and past six values "… and 3 more". */
function inWords(values: readonly number[]): string {
  const head = values.slice(0, 6).map(shown);
  if (values.length > 6) return `${head.join(", ")} and ${values.length - 6} more`;
  return head.length > 1 ? `${head.slice(0, -1).join(", ")} and ${head[head.length - 1]}` : head[0];
}

export default function MeanMedianModeCalculator({ look }: { look: CardLook }) {
  // The link's numbers show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { text, show } = state;
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const { values, bad } = useMemo(() => parseList(text), [text]);
  const s = useMemo(() => (values.length ? summarize(values) : null), [values]);
  const link = values.join(",");

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || !link || link.length > MAX_LINK) return;
    replaceUrlSearch({ data: link, show });
  }, [edited, link, show]);

  const results: Record<Stat, string> = {
    mean: s ? shown(s.mean) : "—",
    median: s ? shown(s.median) : "—",
    mode: !s ? "—" : s.mode.values.length ? (several(s.mode.values, 11) ?? `${s.mode.values.length} modes`) : "None",
    range: s ? shown(s.max - s.min) : "—",
  };

  let steps: string[] = [];
  let note: string | null = bad === null ? null : badEntry(bad);
  let footer = "";
  let marks: number[] = [];
  let band: [number, number] | null = null;
  if (s && show === "mean") {
    steps = [`mean = ${shown(s.sum)} / ${s.n} = ${shown(s.mean)}`];
    footer = `mean = ${shown(s.mean)}`;
    marks = [s.mean];
  } else if (s && show === "median") {
    const { sorted, n } = s;
    const inOrder = sorted.map(shown).join(", ");
    if (n > 1 && inOrder.length <= MAX_SORTED) steps.push(`sorted: ${inOrder}`);
    steps.push(
      n === 1
        ? `median = ${shown(s.median)}`
        : n % 2
          ? `median = value ${(n + 1) / 2} of ${n} in sorted order = ${shown(s.median)}`
          : `median = (${shown(sorted[n / 2 - 1])} + ${shown(sorted[n / 2])}) / 2 = ${shown(s.median)}`,
    );
    footer = `median = ${shown(s.median)}`;
    marks = [s.median];
    if (n >= MIN_FOR_QUARTILES && s.q3 > s.q1) {
      band = [s.q1, s.q3];
      note = `The middle half of the values runs from ${shown(s.q1)} to ${shown(s.q3)} (quartiles as in Excel's QUARTILE.INC), an interquartile range of ${shown(s.q3 - s.q1)}.`;
    }
  } else if (s && show === "mode") {
    const { values: most, count } = s.mode;
    if (most.length === 0) {
      note = "No value repeats, so there is no mode.";
      footer = "no mode";
    } else {
      steps = [`${inWords(most)} ${most.length > 1 ? `appear ${count} times each` : `appears ${count} times`}`];
      const fits = several(most, 14);
      footer = fits === null ? `${most.length} modes` : `${most.length > 1 ? "modes" : "mode"} = ${fits}`;
      marks = most.slice(0, 12);
    }
  } else if (s) {
    steps = [`range = ${shown(s.max)} − ${s.min < 0 ? `(${shown(s.min)})` : shown(s.min)} = ${shown(s.max - s.min)}`];
    footer = `range = ${shown(s.max - s.min)}`;
    band = [s.min, s.max];
  }

  return (
    <div className="space-y-8">
      <ToolCard title="Mean, median, mode" look={look} footer={footer}>
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
          <DotStrip values={values} marks={marks} band={band} fill="var(--color-dl)" />
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
          legend="Mean, median, mode and range. Choose one to see its working."
          name="show"
          options={STATS.map((stat) => ({ ...stat, text: results[stat.value] }))}
          value={show}
          onChange={(stat) => set({ show: stat })}
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

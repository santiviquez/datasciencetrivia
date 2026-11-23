"use client";

import { useEffect, useMemo, useState } from "react";
import DensityCurve, { type Tail } from "@/components/DensityCurve";
import ToolCard, { type CardLook } from "@/components/ToolCard";
import { NumberCell, ResultChoice, ToolActions, replaceUrlSearch, useUrlSearch } from "@/components/ToolControls";
import { lowerTail, twoTail, upperTail } from "@/lib/stats";

/** The value and its z score are two views of one number: whichever was typed last drives the other. */
type Source = "x" | "z";

interface State {
  source: Source;
  /** What was typed into the source cell. */
  typed: string;
  mean: string;
  sd: string;
  tail: Tail;
}

/** An exam with mean 70 and standard deviation 10, and a score of 85. */
const EXAMPLE: State = { source: "x", typed: "85", mean: "70", sd: "10", tail: "left" };
const MAX = 1e9;
const TAILS: { value: Tail; label: string }[] = [
  { value: "left", label: "Below" },
  { value: "right", label: "Above" },
  { value: "two", label: "Two-tailed" },
];

const isTail = (v: string | null): v is Tail => v === "two" || v === "right" || v === "left";

function parse(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

const inRange = (v: number | null): v is number => v !== null && Math.abs(v) <= MAX;
const validSd = (v: number | null): v is number => v !== null && v > 0 && v <= MAX;

/** At most four decimals, no trailing zeros. */
const tidy = (v: number) => String(Number(v.toFixed(4)));
const shown = (v: number) => tidy(v).replace("-", "−");
const bracketed = (v: number) => (v < 0 ? `(${shown(v)})` : shown(v));

/** A probability as a percentage: two decimals, or two significant digits once that would round to zero. */
function percent(p: number | null): string {
  if (p === null) return "—";
  const v = p * 100;
  if (v === 0) return "≈ 0%";
  if (v >= 100) return "100%";
  if (v > 99.995) return "≈ 100%";
  if (v >= 0.01) return `${v.toFixed(2)}%`;
  return `${v.toExponential(1).replace("-", "−")}%`;
}

/** A shared link (?x=85&mean=70&sd=10, or ?z=1.5) as calculator state. */
function fromSearch(search: string): State | null {
  const params = new URLSearchParams(search);
  const x = params.get("x");
  const z = params.get("z");
  if (x === null && z === null) return null;
  const tail = params.get("tail");
  return {
    source: x !== null ? "x" : "z",
    typed: (x ?? z)!,
    mean: params.get("mean") ?? "",
    sd: params.get("sd") ?? "",
    tail: isTail(tail) ? tail : EXAMPLE.tail,
  };
}

export default function ZScoreCalculator({ look }: { look: CardLook }) {
  // The link's inputs show until the first edit; after that the edits are the state.
  const search = useUrlSearch();
  const shared = useMemo(() => fromSearch(search), [search]);
  const [edited, setEdited] = useState<State | null>(null);
  const state = edited ?? shared ?? EXAMPLE;
  const { source, tail } = state;
  const set = (patch: Partial<State>) => setEdited({ ...state, ...patch });

  const solved = useMemo(() => {
    const mean = parse(state.mean);
    const sd = parse(state.sd);
    const typed = parse(state.typed);
    const scale = inRange(mean) && validSd(sd) ? { mean, sd } : null;
    if (!inRange(typed)) return { scale, x: null, z: null };
    // A z score needs no mean or standard deviation to have a percentile.
    if (state.source === "z") return { scale, z: typed, x: scale ? scale.mean + typed * scale.sd : null };
    return { scale, x: typed, z: scale ? (typed - scale.mean) / scale.sd : null };
  }, [state]);
  const { scale, x, z } = solved;

  // Only edits are written to the URL, so a shared link survives the first render.
  useEffect(() => {
    if (!edited || z === null) return;
    replaceUrlSearch({
      [source]: String(source === "x" ? x : z),
      ...(scale ? { mean: String(scale.mean), sd: String(scale.sd) } : {}),
      tail,
    });
  }, [edited, source, x, z, scale, tail]);

  const p = useMemo<Record<Tail, number | null>>(
    () =>
      z === null
        ? { left: null, right: null, two: null }
        : { left: lowerTail("z", z), right: upperTail("z", z), two: twoTail("z", z) },
    [z],
  );

  const working =
    z === null || !scale || x === null
      ? null
      : source === "x"
        ? `z = (${shown(x)} − ${bracketed(scale.mean)}) / ${shown(scale.sd)} = ${shown(z)}`
        : `x = ${shown(scale.mean)} + ${bracketed(z)} × ${shown(scale.sd)} = ${shown(x)}`;

  const distance =
    z === null
      ? null
      : z === 0
        ? "At the mean."
        : `${shown(Math.abs(z))} standard deviation${Math.abs(z) === 1 ? "" : "s"} ${z > 0 ? "above" : "below"} the mean.`;

  // An empty mean or standard deviation is fine while a z score is being typed on its own.
  const optional = (raw: string) => source === "z" && raw.trim() === "";

  return (
    <div className="space-y-8">
      <ToolCard title="Z-score" look={look} footer={z === null ? "" : `z = ${shown(z)}`}>
        <div className="grid grid-cols-2 gap-2">
          <NumberCell
            label="Value"
            name="Value"
            value={source === "x" ? state.typed : x === null ? "" : tidy(x)}
            onChange={(typed) => set({ source: "x", typed })}
            invalid={source === "x" && !inRange(parse(state.typed))}
            signed
          />
          <NumberCell
            label="Mean"
            name="Mean"
            value={state.mean}
            onChange={(mean) => set({ mean })}
            invalid={!optional(state.mean) && !inRange(parse(state.mean))}
            signed
          />
          <NumberCell
            label="SD"
            name="Standard deviation"
            value={state.sd}
            onChange={(sd) => set({ sd })}
            invalid={!optional(state.sd) && !validSd(parse(state.sd))}
          />
          <NumberCell
            label="z score"
            name="z score"
            value={source === "z" ? state.typed : z === null ? "" : tidy(z)}
            onChange={(typed) => set({ source: "z", typed })}
            invalid={source === "z" && !inRange(parse(state.typed))}
            color={look.color}
            signed
          />
        </div>

        <div className="mt-5">
          <DensityCurve dist="z" df={[]} x={z} tail={tail} fill="var(--color-dl)" />
        </div>

        <ToolActions
          className="mt-2"
          onExample={() => setEdited(EXAMPLE)}
          onClear={() => setEdited({ source: "x", typed: "", mean: "", sd: "", tail })}
          canShare={z !== null}
        />
      </ToolCard>

      <section aria-label="Results">
        <ResultChoice
          legend="Share of a normal distribution by tail. Choose one to shade it on the curve."
          name="tail"
          options={TAILS.map((t) => ({ ...t, text: percent(p[t.value]) }))}
          value={tail}
          onChange={(t) => set({ tail: t })}
        />

        {working ? <p className="mt-3 font-mono text-xs text-[var(--muted)]">{working}</p> : null}
        {distance ? (
          <p className="mt-2 text-sm">
            {distance} {percent(p.left)} of a normal distribution falls below it.
          </p>
        ) : null}
      </section>
    </div>
  );
}

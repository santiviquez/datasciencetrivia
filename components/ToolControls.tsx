"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";

const noSubscription = () => () => {};

/**
 * The page's query string, where a shared link keeps a calculator's inputs.
 * Empty on the server and while hydrating, so the first render always matches.
 */
export function useUrlSearch(): string {
  return useSyncExternalStore(noSubscription, () => window.location.search, () => "");
}

/** Writes a calculator's inputs to the URL without adding a history entry. */
export function replaceUrlSearch(params: Record<string, string>) {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", url);
}

/** One input on a calculator card: a small label in the corner and a large number. */
export function NumberCell({
  label,
  name,
  value,
  onChange,
  invalid,
  color,
  integer = false,
  signed = false,
}: {
  /** Shown in the corner. */
  label: ReactNode;
  /** The full name, for screen readers. */
  name: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  color?: string;
  integer?: boolean;
  /** Negative values allowed. Leaves the keyboard hint off so phones show a minus key. */
  signed?: boolean;
}) {
  return (
    <label
      className="relative flex h-20 min-w-0 items-end border-[4px] border-black px-2 pb-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#319795] sm:h-24"
      style={{ backgroundColor: color ?? "#fff" }}
    >
      <span aria-hidden="true" className="absolute left-2 top-1.5 font-[family-name:var(--font-card)] text-[11px] font-bold">
        {label}
      </span>
      <span className="sr-only">{name}</span>
      <input
        type="number"
        inputMode={signed ? undefined : integer ? "numeric" : "decimal"}
        min={signed ? undefined : 0}
        step={integer ? 1 : "any"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        className="w-full min-w-0 bg-transparent text-right font-[family-name:var(--font-card)] text-2xl font-bold tabular-nums outline-none [appearance:textfield] aria-[invalid=true]:text-red-700 sm:text-3xl [&::-webkit-inner-spin-button]:appearance-none"
      />
    </label>
  );
}

/** A row of mutually exclusive choices, drawn as one bordered bar. Radio inputs underneath, so arrow keys work. */
export function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: ReactNode; title: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex border-[4px] border-black">
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`flex h-10 flex-1 cursor-pointer select-none items-center justify-center font-[family-name:var(--font-card)] text-base font-bold transition-colors duration-150 ease-out has-checked:bg-black has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#319795] [&:not(:has(:checked))]:hover:bg-black/[0.06] ${i ? "border-l-[4px] border-black" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span aria-hidden="true">{o.label}</span>
            <span className="sr-only">{o.title}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * A calculator's headline results as one bordered strip, where picking a cell
 * changes what the card shows (which tail the curve shades, for example).
 * Results too long to sit side by side are stacked with `rows`.
 */
export function ResultChoice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  rows = false,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: string; text: string }[];
  value: T;
  onChange: (value: T) => void;
  rows?: boolean;
}) {
  const columns = options.length === 3 ? "grid-cols-3" : "grid-cols-2";
  const divider = rows ? "border-t-[4px] border-black" : "border-l-[4px] border-black";
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className={`grid border-[4px] border-black ${rows ? "" : columns}`}>
        {options.map((o, i) => (
          <label
            key={o.value}
            className={`cursor-pointer px-3 py-3 transition-colors duration-150 ease-out has-checked:bg-[var(--color-stats)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#319795] [&:not(:has(:checked))]:hover:bg-black/[0.04] ${rows ? "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1" : ""} ${i ? divider : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="block font-[family-name:var(--font-card)] text-[11px] font-bold uppercase">{o.label}</span>
            <span
              className={`block font-[family-name:var(--font-card)] font-bold tabular-nums ${rows ? "text-lg sm:text-xl" : "mt-1 text-xl sm:text-2xl"}`}
            >
              {o.text}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const ACTION =
  "text-xs font-semibold underline decoration-black/25 underline-offset-4 transition-colors duration-150 hover:decoration-black disabled:opacity-40";

/** The text actions under a card's inputs. "Copy link" shares the page URL, which carries the inputs. */
export function ToolActions({
  onExample,
  onClear,
  canShare,
  className = "",
}: {
  onExample: () => void;
  onClear: () => void;
  canShare: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button type="button" className={ACTION} onClick={onExample}>Example</button>
      <button type="button" className={ACTION} onClick={onClear}>Clear</button>
      <button type="button" className={ACTION} onClick={copyLink} disabled={!canShare}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

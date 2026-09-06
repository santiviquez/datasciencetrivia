"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import TriviaCard from "./TriviaCard";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  type CategoryKey,
  type QuestionWithSlug,
} from "@/lib/questions";

type Rating = "easy" | "neutral" | "hard";
type Ratings = Record<string, Rating>;

const STORAGE_KEY = "dst:ratings:v1";

function loadRatings(): Ratings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Ratings) : {};
  } catch {
    return {};
  }
}

function saveRatings(ratings: Ratings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    /* Private mode or blocked storage — ratings just won't persist. */
  }
}

/** Fisher-Yates on a copy; never mutates the caller's array. */
function shuffled<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Deck order and saved ratings are both client-only: the server has no access
 * to randomness it can agree with, nor to localStorage. They live in one state
 * object so hydration costs exactly one extra render instead of cascading.
 */
interface Session {
  order: QuestionWithSlug[];
  ratings: Ratings;
}

export default function Deck({ questions }: { questions: QuestionWithSlug[] }) {
  const [session, setSession] = useState<Session>({ order: questions, ratings: {} });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [hardOnly, setHardOnly] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const { order, ratings } = session;

  useEffect(() => {
    // Deliberate one-shot client initialisation after hydration: shuffle the
    // deck and restore saved ratings in a single update.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only init, runs once
    setSession({ order: shuffled(questions), ratings: loadRatings() });
  }, [questions]);

  const deck = useMemo(() => {
    let d = order;
    if (filter !== "all") d = d.filter((q) => q.category === filter);
    if (hardOnly) d = d.filter((q) => ratings[q.id] === "hard");
    return d;
  }, [order, filter, hardOnly, ratings]);

  // Keep the cursor in range whenever the deck shrinks under a filter.
  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = Math.min(Math.max(i + delta, 0), Math.max(deck.length - 1, 0));
        return next;
      });
      setRevealed(false);
    },
    [deck.length],
  );

  const rate = useCallback(
    (value: Rating) => {
      if (!current) return;
      setSession((prev) => {
        const ratings = { ...prev.ratings, [current.id]: value };
        saveRatings(ratings);
        return { ...prev, ratings };
      });
    },
    [current],
  );

  const reshuffle = useCallback(() => {
    setSession((prev) => ({ ...prev, order: shuffled(prev.order) }));
    setIndex(0);
    setRevealed(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Never hijack keys while the user is typing somewhere.
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "arrowright": e.preventDefault(); go(1); break;
        case "arrowleft": e.preventDefault(); go(-1); break;
        case "a": case " ": e.preventDefault(); setRevealed((r) => !r); break;
        case "e": rate("easy"); break;
        case "n": rate("neutral"); break;
        case "h": rate("hard"); break;
        case "s": reshuffle(); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, rate, reshuffle]);

  const hardCount = useMemo(
    () => Object.values(ratings).filter((r) => r === "hard").length,
    [ratings],
  );

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-semibold">Nothing to review here.</p>
        <p className="text-sm text-[var(--page-muted)]">
          {hardOnly
            ? "You haven't marked any cards as hard yet."
            : "No questions in this category yet."}
        </p>
        <button
          type="button"
          onClick={() => { setHardOnly(false); setFilter("all"); setIndex(0); }}
          className="border-2 border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
        >
          Back to the full deck
        </button>
      </div>
    );
  }

  const rating = ratings[current.id];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => { setFilter("all"); setIndex(0); }}>
          All
        </FilterChip>
        {CATEGORY_KEYS.map((key) => (
          <FilterChip
            key={key}
            active={filter === key}
            color={CATEGORIES[key].color}
            onClick={() => { setFilter(key); setIndex(0); }}
          >
            {CATEGORIES[key].name}
          </FilterChip>
        ))}
      </div>

      {/* Card + arrows */}
      <div className="flex w-full items-center justify-center gap-2 sm:gap-5">
        <NavButton
          label="Previous card"
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          dir="left"
        />
        <TriviaCard
          category={current.category}
          question={current.question}
          answer={current.answer}
          proposedBy={current.proposedBy}
          revealed={revealed}
        />
        <NavButton
          label="Next card"
          onClick={() => go(1)}
          disabled={safeIndex >= deck.length - 1}
          dir="right"
        />
      </div>

      {/* Screen-reader announcement of position + reveal state */}
      <p ref={liveRef} aria-live="polite" className="sr-only">
        Card {safeIndex + 1} of {deck.length}. {revealed ? `Answer: ${current.answer}` : "Answer hidden."}
      </p>

      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-expanded={revealed}
        className="border-[3px] border-black bg-black px-6 py-2.5 font-[family-name:var(--font-card)] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
      >
        {revealed ? "Hide answer" : "Show answer"}
      </button>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <RateButton active={rating === "easy"} color="#2f9e44" onClick={() => rate("easy")}>
          Easy
        </RateButton>
        <RateButton active={rating === "neutral"} color="#495057" onClick={() => rate("neutral")}>
          Neutral
        </RateButton>
        <RateButton active={rating === "hard"} color="#e03131" onClick={() => rate("hard")}>
          Hard
        </RateButton>
      </div>

      {/* Progress + tools */}
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--page-rule)]">
          <div
            className="h-full rounded-full bg-[var(--page-fg)] transition-[width] duration-300"
            style={{ width: `${((safeIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[var(--page-muted)]">
          <span className="tabular-nums">
            {safeIndex + 1} / {deck.length}
          </span>
          <button type="button" onClick={reshuffle} className="underline underline-offset-2 hover:text-[var(--page-fg)]">
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => { setHardOnly((v) => !v); setIndex(0); }}
            className="underline underline-offset-2 hover:text-[var(--page-fg)]"
            aria-pressed={hardOnly}
          >
            {hardOnly ? "Show all cards" : `Review hard (${hardCount})`}
          </button>
          <Link href={`/questions/${current.slug}`} className="underline underline-offset-2 hover:text-[var(--page-fg)]">
            Permalink
          </Link>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border-2 border-black px-3 py-1 text-xs font-semibold transition ${
        active ? "text-black" : "bg-transparent text-[var(--page-fg)] hover:bg-black/5"
      }`}
      style={active ? { backgroundColor: color ?? "#000", color: color ? "#000" : "#fff" } : undefined}
    >
      {children}
    </button>
  );
}

function RateButton({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="border-2 px-4 py-1.5 text-sm font-semibold transition"
      style={
        active
          ? { backgroundColor: color, borderColor: color, color: "#fff" }
          : { borderColor: "var(--page-rule)", color: "var(--page-muted)" }
      }
    >
      {children}
    </button>
  );
}

function NavButton({
  label,
  onClick,
  disabled,
  dir,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  dir: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="shrink-0 p-2 text-2xl text-[var(--page-fg)] transition disabled:opacity-25 sm:text-3xl"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

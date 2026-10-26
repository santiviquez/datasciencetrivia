"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TriviaCard from "./TriviaCard";
import { Arrow, RateButton, RevealButton } from "./DeckControls";
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from "@/lib/questions";

/**
 * The fields of a card the deck reads. Everything a client component receives
 * is serialized into the page, so pages hand over these instead of whole
 * questions, whose longer answers would otherwise ride along on every page.
 */
export interface DeckCard {
  id: string;
  slug: string;
  category: CategoryKey;
  question: string;
  answer: string;
  proposedBy?: string;
}

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
    /* Blocked storage — ratings simply won't persist. */
  }
}

function shuffled<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface Session {
  order: DeckCard[];
  ratings: Ratings;
}

interface DeckProps {
  questions: DeckCard[];
  /**
   * Set on a permalink page: that card leads the deck and opens revealed, so
   * arriving from search lands you in the same game rather than a second UI.
   */
  focus?: DeckCard;
}

export default function Deck({ questions, focus }: DeckProps) {
  const initial = useMemo(
    () => (focus ? [focus, ...questions.filter((q) => q.slug !== focus.slug)] : questions),
    [questions, focus],
  );

  const [session, setSession] = useState<Session>({ order: initial, ratings: {} });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(Boolean(focus));
  const [filter, setFilter] = useState<CategoryKey | "all">("all");

  const { order, ratings } = session;

  useEffect(() => {
    // One-shot client init: the server can't agree on a shuffle or read storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only init, runs once
    setSession({
      order: focus
        ? [focus, ...shuffled(questions.filter((q) => q.slug !== focus.slug))]
        : shuffled(questions),
      ratings: loadRatings(),
    });
  }, [questions, focus]);

  const deck = useMemo(
    () => (filter === "all" ? order : order.filter((q) => q.category === filter)),
    [order, filter],
  );

  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const current = deck[safeIndex];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(Math.max(i + delta, 0), Math.max(deck.length - 1, 0)));
      setRevealed(false);
    },
    [deck.length],
  );

  const rate = useCallback(
    (value: Rating) => {
      if (!current) return;
      setSession((prev) => {
        const next = { ...prev.ratings, [current.id]: value };
        saveRatings(next);
        return { ...prev, ratings: next };
      });
    },
    [current],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "arrowright": e.preventDefault(); go(1); break;
        case "arrowleft": e.preventDefault(); go(-1); break;
        case "a": setRevealed((r) => !r); break;
        case "e": rate("easy"); break;
        case "n": rate("neutral"); break;
        case "h": rate("hard"); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, rate]);

  if (!current) return null;

  const rating = ratings[current.id];

  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* Category browsing, kept quiet so it doesn't crowd the card. */}
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px]">
        <CategoryLink active={filter === "all"} onClick={() => { setFilter("all"); setIndex(0); }}>
          All
        </CategoryLink>
        {CATEGORY_KEYS.map((key) => (
          <CategoryLink
            key={key}
            active={filter === key}
            color={CATEGORIES[key].color}
            onClick={() => { setFilter(key); setIndex(0); }}
          >
            {CATEGORIES[key].name}
          </CategoryLink>
        ))}
      </div>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <Arrow dir="left" label="Previous card" onClick={() => go(-1)} disabled={safeIndex === 0} />
        <TriviaCard
          category={current.category}
          question={current.question}
          answer={current.answer}
          proposedBy={current.proposedBy}
          revealed={revealed}
          as={focus && safeIndex === 0 && filter === "all" ? "h1" : "p"}
        />
        <Arrow dir="right" label="Next card" onClick={() => go(1)} disabled={safeIndex >= deck.length - 1} />
      </div>

      <p aria-live="polite" className="sr-only">
        Card {safeIndex + 1} of {deck.length}.{" "}
        {revealed ? `Answer: ${current.answer}` : "Answer hidden."}
      </p>

      <RevealButton revealed={revealed} onClick={() => setRevealed((r) => !r)} />

      <div className="mt-4 flex shrink-0 items-center gap-1">
        <RateButton active={rating === "easy"} tone="#38a169" onClick={() => rate("easy")} icon="happy">
          Easy
        </RateButton>
        <RateButton active={rating === "neutral"} tone="#4a5568" onClick={() => rate("neutral")} icon="meh">
          Neutral
        </RateButton>
        <RateButton active={rating === "hard"} tone="#e53e3e" onClick={() => rate("hard")} icon="sad">
          Hard
        </RateButton>
      </div>
    </div>
  );
}

function CategoryLink({
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
      className={`border-b-2 pb-0.5 transition ${active ? "text-[#1a202c]" : "border-transparent text-[var(--muted)] hover:text-[#1a202c]"}`}
      style={active ? { borderColor: color ?? "#1a202c" } : undefined}
    >
      {children}
    </button>
  );
}

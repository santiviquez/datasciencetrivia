"use client";

import { useCallback, useEffect, useState } from "react";
import TriviaCard from "./TriviaCard";
import { Arrow, RateButton, RevealButton } from "./DeckControls";
import type { CategoryKey } from "@/lib/questions";

export interface QuizCard {
  id: string;
  category: CategoryKey;
  question: string;
  answer: string;
  proposedBy?: string;
}

type Mark = "got" | "missed";

interface QuizProps {
  name: string;
  url: string;
  /** The run rendered on the server; "New quiz" draws a fresh one from `pool`. */
  initial: QuizCard[];
  pool: QuizCard[];
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

function draw(pool: readonly QuizCard[], n: number): QuizCard[] {
  const out = [...pool];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, n);
}

function verdict(score: number, total: number): string {
  const share = score / total;
  if (share === 1) return "Perfect run. Share it before it goes to your head.";
  if (share >= 0.8) return "Interview ready on this one.";
  if (share >= 0.5) return "Solid, with a few gaps. Go back with the arrows to see the ones you missed.";
  return "Plenty to review. Go back with the arrows to see the ones you missed.";
}

/**
 * The deck, played as a quiz: the same card, arrows and buttons, with the face
 * buttons answering "did you get it?" instead of "how hard was it?". After the
 * last card, one more card holds the score. Cards have free-text answers, so
 * you mark yourself; multiple choice would mean inventing wrong answers.
 */
export default function Quiz({ name, url, initial, pool }: QuizProps) {
  const [run, setRun] = useState(initial);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  const total = run.length;
  const score = run.filter((q) => marks[q.id] === "got").length;
  const done = run.every((q) => marks[q.id]);
  // Once every card is marked there is one more card: the score.
  const last = done ? total : total - 1;
  const onScore = done && index === total;
  const current = onScore ? undefined : run[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(Math.max(i + delta, 0), last));
      setRevealed(false);
    },
    [last],
  );

  const mark = useCallback(
    (m: Mark) => {
      if (!current || !revealed) return;
      const next = { ...marks, [current.id]: m };
      setMarks(next);
      setRevealed(false);
      const firstOpen = run.findIndex((q) => !next[q.id]);
      if (firstOpen === -1) {
        setIndex(total);
        window.plausible?.("Quiz completed", {
          props: { quiz: name, score: run.filter((q) => next[q.id] === "got").length },
        });
      } else {
        // Carry on from here, or wrap back to a card that was skipped.
        const after = run.findIndex((q, i) => i > index && !next[q.id]);
        setIndex(after === -1 ? firstOpen : after);
      }
    },
    [current, revealed, marks, run, index, total, name],
  );

  const restart = useCallback(() => {
    setRun(draw(pool, initial.length));
    setMarks({});
    setIndex(0);
    setRevealed(false);
  }, [pool, initial.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "arrowright": e.preventDefault(); go(1); break;
        case "arrowleft": e.preventDefault(); go(-1); break;
        case "a": setRevealed((r) => !r); break;
        case "g": mark("got"); break;
        case "m": mark("missed"); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, mark]);

  const shareText = `I scored ${score}/${total} on the ${name} at Data Science Trivia. Can you beat it?`;
  const xShare = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const answered = Object.keys(marks).length;
  const m = current ? marks[current.id] : undefined;

  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* Where the deck has its category filter: where you are in the run. */}
      <p className="mb-4 flex shrink-0 items-center gap-x-5 text-[13px] text-[var(--muted)]" aria-live="polite">
        <span className="text-[#1a202c]">{name}</span>
        <span>{onScore ? "Done" : `${index + 1} of ${total}`}</span>
        {answered > 0 ? <span>{score} right</span> : null}
      </p>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <Arrow dir="left" label="Previous card" onClick={() => go(-1)} disabled={index === 0} />
        {current ? (
          <TriviaCard
            category={current.category}
            question={current.question}
            answer={current.answer}
            proposedBy={current.proposedBy}
            revealed={revealed || Boolean(m)}
          />
        ) : (
          <TriviaCard
            category={run[0].category}
            question={`You scored ${score}/${total}`}
            answer={verdict(score, total)}
            revealed
          />
        )}
        <Arrow dir="right" label="Next card" onClick={() => go(1)} disabled={index >= last} />
      </div>

      {current ? (
        <>
          {m ? (
            <p className="mt-6 shrink-0 py-2 text-sm text-[var(--muted)]">
              {m === "got" ? "You got this one." : "You missed this one."}
            </p>
          ) : (
            <RevealButton revealed={revealed} onClick={() => setRevealed((r) => !r)} />
          )}
          <div className={`mt-4 flex shrink-0 items-center gap-1 ${revealed || m ? "" : "invisible"}`}>
            <RateButton active={m === "got"} tone="#38a169" onClick={() => mark("got")} icon="happy">
              Got it
            </RateButton>
            <RateButton active={m === "missed"} tone="#e53e3e" onClick={() => mark("missed")} icon="sad">
              Missed it
            </RateButton>
          </div>
        </>
      ) : (
        <>
          <RevealButton revealed onClick={restart}>
            New quiz
          </RevealButton>
          <div className="mt-4 flex shrink-0 items-center gap-1 text-sm font-semibold text-[#319795]">
            <a href={xShare} target="_blank" rel="noopener noreferrer" className="rounded-md px-4 py-1.5 transition hover:bg-[#edf2f7]">
              Share on X
            </a>
            <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className="rounded-md px-4 py-1.5 transition hover:bg-[#edf2f7]">
              Share on LinkedIn
            </a>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export interface QuizCard {
  id: string;
  question: string;
  answer: string;
  slug: string;
}

type Mark = "got" | "missed";

interface QuizProps {
  name: string;
  url: string;
  color: string;
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
  if (share === 1) return "Perfect run.";
  if (share >= 0.8) return "Interview ready on this one.";
  if (share >= 0.5) return "Solid, with a few gaps worth a look.";
  return "Plenty to review. The cards you missed are linked below.";
}

/**
 * A self-marked quiz: read the question, answer in your head, reveal, then say
 * whether you got it. The cards have free-text answers, so self-marking is the
 * honest format; multiple choice would mean inventing wrong answers for them.
 */
export default function Quiz({ name, url, color, initial, pool }: QuizProps) {
  const [run, setRun] = useState(initial);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  const total = run.length;
  const marked = run.filter((q) => marks[q.id]).length;
  const score = run.filter((q) => marks[q.id] === "got").length;
  const done = marked === total;

  function mark(id: string, m: Mark) {
    const next = { ...marks, [id]: m };
    setMarks(next);
    if (run.every((q) => next[q.id])) {
      const finalScore = run.filter((q) => next[q.id] === "got").length;
      window.plausible?.("Quiz completed", { props: { quiz: name, score: finalScore } });
    }
  }

  function restart() {
    setRun(draw(pool, initial.length));
    setRevealed({});
    setMarks({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const shareText = `I scored ${score}/${total} on the ${name} at Data Science Trivia. Can you beat it?`;
  const xShare = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const missed = run.filter((q) => marks[q.id] === "missed");

  return (
    <div>
      <p className="sticky top-0 z-10 -mx-4 border-b border-[var(--rule)] bg-white px-4 py-2 text-sm" aria-live="polite">
        <span className="font-semibold">{marked}</span> of {total} answered
        {marked > 0 ? (
          <>
            {" · "}
            <span className="font-semibold">{score}</span> right
          </>
        ) : null}
      </p>

      <ol className="mt-6 space-y-6">
        {run.map((q, i) => {
          const isRevealed = revealed[q.id];
          const m = marks[q.id];
          return (
            <li key={q.id} className="border-l-[3px] pl-4" style={{ borderColor: color }}>
              <p className="font-[family-name:var(--font-card)] text-xs font-bold text-[var(--muted)]">
                Question {i + 1}
              </p>
              <h2 className="mt-1 font-medium leading-snug">{q.question}</h2>

              {/* In the HTML from the start, so crawlers and the Quiz markup see it. */}
              <p hidden={!isRevealed} className="mt-3 text-sm leading-relaxed">
                {q.answer}
              </p>

              {isRevealed ? (
                <div>
                  {m ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {m === "got" ? "You got it." : "Missed."}{" "}
                      <Link href={`/questions/${q.slug}`} className="underline underline-offset-2">
                        Read the card
                      </Link>
                    </p>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => mark(q.id, "got")}
                        className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
                      >
                        I got it
                      </button>
                      <button
                        type="button"
                        onClick={() => mark(q.id, "missed")}
                        className="border-2 border-black/30 px-3 py-1.5 text-xs font-semibold transition hover:border-black"
                      >
                        I missed it
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealed({ ...revealed, [q.id]: true })}
                  className="mt-3 border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
                >
                  Show answer
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {done ? (
        <section aria-labelledby="result" className="mt-10 border-2 border-black p-5 sm:p-6">
          <h2 id="result" className="font-[family-name:var(--font-display)] text-xl">
            You scored {score}/{total}
          </h2>
          <p className="mt-2 text-sm">{verdict(score, total)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={xShare} target="_blank" rel="noopener noreferrer" className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white">
              Share on X
            </a>
            <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white">
              Share on LinkedIn
            </a>
            <button type="button" onClick={restart} className="border-2 border-black bg-black px-3 py-1.5 text-xs font-semibold text-white">
              New quiz
            </button>
          </div>
          {missed.length > 0 ? (
            <div className="mt-5">
              <p className="text-sm font-semibold">Worth another look</p>
              <ul className="mt-2 space-y-1.5">
                {missed.map((q) => (
                  <li key={q.id} className="text-sm leading-snug">
                    <Link href={`/questions/${q.slug}`} className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current">
                      {q.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm">
          <button type="button" onClick={restart} className="underline underline-offset-2">
            Draw 10 different questions
          </button>
        </p>
      )}
    </div>
  );
}

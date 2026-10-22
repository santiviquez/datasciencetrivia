import Link from "next/link";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  getAllQuestions,
  getQuestionsByCategory,
  pageTitle,
} from "@/lib/questions";
import { QUIZZES, QUIZ_SLUGS } from "@/lib/quiz";

/**
 * Everything under the game. It exists so the deck is readable by search
 * engines and AI crawlers — the old site rendered its cards client-side and
 * shipped an empty page to them — and so every card has a linkable home.
 */
export default function BelowFold() {
  const questions = getAllQuestions();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <section aria-labelledby="categories">
        <h2 id="categories" className="font-[family-name:var(--font-display)] text-xl">
          Browse by category
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {CATEGORY_KEYS.map((key) => {
            const c = CATEGORIES[key];
            const count = getQuestionsByCategory(key).length;
            return (
              <li key={key}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="flex items-center gap-3 rounded-md border border-[var(--rule)] px-4 py-3 transition hover:border-black/30"
                >
                  <span className="h-3 w-3 shrink-0" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <span className="font-[family-name:var(--font-card)] text-sm uppercase">{c.name}</span>
                  <span className="ml-auto text-xs text-[var(--muted)]">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="quizzes" className="mt-14">
        <h2 id="quizzes" className="font-[family-name:var(--font-display)] text-xl">
          Take a quiz
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ten questions, answers included, score at the end. Or read the{" "}
          <Link href="/ai-history" className="underline underline-offset-2">
            history of AI as a timeline
          </Link>
          .
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {QUIZ_SLUGS.map((s) => (
            <li key={s}>
              <Link
                href={`/quiz/${s}`}
                className="inline-block border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
              >
                {QUIZZES[s].name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-questions" className="mt-14">
        <h2 id="all-questions" className="font-[family-name:var(--font-display)] text-xl">
          All {QUESTION_COUNT} questions
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Every card has its own page with the answer.{" "}
          <Link href="/questions" className="underline underline-offset-2">
            See them grouped by topic
          </Link>
          .
        </p>
        <ul className="mt-5 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
          {questions.map((q) => (
            <li key={q.id} className="text-sm leading-snug">
              <Link
                href={`/questions/${q.slug}`}
                className="text-[var(--fg)] underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
              >
                {pageTitle(q)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

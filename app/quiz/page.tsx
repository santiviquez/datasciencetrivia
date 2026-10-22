import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { absoluteUrl } from "@/lib/site";
import { CATEGORIES } from "@/lib/questions";
import { QUESTIONS_PER_QUIZ, QUIZZES, QUIZ_SLUGS, getQuizPool } from "@/lib/quiz";

const TITLE = "Data Science, Machine Learning and AI Quizzes with Answers";
const DESCRIPTION = `Free ${QUESTIONS_PER_QUIZ}-question quizzes on machine learning, data science, deep learning, statistics, LLMs and the history of AI. Reveal each answer, mark yourself and share your score.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/quiz" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: absoluteUrl("/quiz") },
};

export default function QuizIndexPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/quiz#list"),
    name: TITLE,
    itemListElement: QUIZ_SLUGS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: QUIZZES[s].name,
      url: absoluteUrl(`/quiz/${s}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--muted)]">
            <Link href="/" className="underline underline-offset-2 hover:text-[var(--fg)]">Home</Link>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">Quizzes</h1>
          <p className="mt-4 max-w-xl leading-relaxed">
            Short quizzes drawn from the deck: {QUESTIONS_PER_QUIZ} questions a run, answers included.
            Answer in your head, reveal, mark yourself, and share the score if it is a good one.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {QUIZ_SLUGS.map((s) => {
              const quiz = QUIZZES[s];
              return (
                <li key={s}>
                  <Link
                    href={`/quiz/${s}`}
                    className="flex h-full flex-col gap-1 rounded-md border border-[var(--rule)] px-4 py-3 transition hover:border-black/30"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 shrink-0" style={{ backgroundColor: CATEGORIES[quiz.categories[0]].color }} aria-hidden="true" />
                      <span className="font-[family-name:var(--font-card)] text-sm font-bold uppercase">{quiz.name}</span>
                    </span>
                    <span className="text-sm text-[var(--muted)]">{quiz.blurb}</span>
                    <span className="text-xs text-[var(--muted)]">{getQuizPool(s).length} questions in the pool</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-10 text-sm">
            <Link href="/ai-history" className="underline underline-offset-2">The history of AI as a timeline</Link>
            {" · "}
            <Link href="/questions" className="underline underline-offset-2">All questions by topic</Link>
          </p>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

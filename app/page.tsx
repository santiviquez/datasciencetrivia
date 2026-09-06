import Link from "next/link";
import type { Metadata } from "next";
import Deck from "@/components/Deck";
import Footer from "@/components/Footer";
import Keymaps from "@/components/Keymaps";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  getAllQuestions,
  getQuestionsByCategory,
} from "@/lib/questions";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: `Free data science flashcards. ${QUESTION_COUNT} questions and answers on machine learning, statistics, deep learning and the history of AI — practise for interviews or just test yourself.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const questions = getAllQuestions();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": absoluteUrl("/#person") },
      },
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: SITE.author.name,
        url: SITE.author.x,
        sameAs: [SITE.author.x, SITE.author.linkedin],
      },
      {
        "@type": "Quiz",
        name: `${SITE.name} — ${QUESTION_COUNT} data science questions`,
        description: SITE.description,
        url: absoluteUrl("/"),
        educationalLevel: "intermediate",
        about: CATEGORY_KEYS.map((k) => ({
          "@type": "Thing",
          name: CATEGORIES[k].name,
        })),
        numberOfQuestions: QUESTION_COUNT,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-8 sm:py-12">
          <header className="mb-8 flex flex-col items-center text-center">
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-tight sm:text-4xl">
              Data Science Trivia
            </h1>
            <p className="mt-3 max-w-xl text-sm text-[var(--page-muted)] sm:text-base">
              {QUESTION_COUNT} flashcards on machine learning, statistics, deep learning
              and the history of AI. Use the arrow keys, reveal the answer, and mark the
              ones you want to see again.
            </p>
          </header>

          <Deck questions={questions} />

          <Keymaps />

          {/* Category hubs — crawlable internal links. */}
          <section aria-labelledby="categories" className="mt-20 w-full">
            <h2 id="categories" className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              Browse by category
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {CATEGORY_KEYS.map((key) => {
                const c = CATEGORIES[key];
                const count = getQuestionsByCategory(key).length;
                return (
                  <Link
                    key={key}
                    href={`/categories/${c.slug}`}
                    className="group flex flex-col border-[3px] border-black bg-[var(--card-bg)] text-[var(--card-ink)] p-5 transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)]"
                  >
                    <span
                      className="mb-3 inline-block h-2 w-12"
                      style={{ backgroundColor: c.color }}
                      aria-hidden="true"
                    />
                    <span className="font-[family-name:var(--font-card)] text-lg font-bold uppercase">
                      {c.name}
                    </span>
                    <span className="mt-1 text-sm text-black/60">{c.blurb}</span>
                    <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-black/50">
                      {count} question{count === 1 ? "" : "s"} →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Every question, linked. Gives crawlers a complete map of the deck. */}
          <section aria-labelledby="all-questions" className="mt-16 w-full">
            <h2 id="all-questions" className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              Every question in the deck
            </h2>
            <p className="mt-2 text-sm text-[var(--page-muted)]">
              Each card has its own page with the answer.{" "}
              <Link href="/questions" className="underline underline-offset-2">
                Browse all {QUESTION_COUNT} with answers
              </Link>
              .
            </p>
            <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {questions.map((q) => (
                <li key={q.id} className="text-sm leading-snug">
                  <Link
                    href={`/questions/${q.slug}`}
                    className="text-[var(--page-fg)] underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current"
                  >
                    {q.question}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <Footer />
        </main>
      </div>
    </>
  );
}

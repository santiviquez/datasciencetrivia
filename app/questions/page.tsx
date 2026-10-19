import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  getQuestionsByCategory,
} from "@/lib/questions";

export const metadata: Metadata = {
  title: { absolute: `${QUESTION_COUNT} Data Science Interview Questions & Answers` },
  description: `Every question in the Data Science Trivia deck with its answer — ${QUESTION_COUNT} flashcards across machine learning, statistics, deep learning, LLMs, MLOps and the history of AI.`,
  alternates: { canonical: "/questions" },
  openGraph: {
    type: "website",
    title: `Data Science Interview Questions and Answers — ${SITE.name}`,
    description: `Every question in the deck with its answer, grouped by category.`,
    url: absoluteUrl("/questions"),
  },
};

export default function QuestionsIndexPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/questions#faq"),
    mainEntity: CATEGORY_KEYS.flatMap((key) =>
      getQuestionsByCategory(key).map((q) => ({
        "@type": "Question",
        name: q.question,
        url: absoluteUrl(`/questions/${q.slug}`),
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    ),
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/questions#list"),
    name: `Data science interview questions (${QUESTION_COUNT})`,
    numberOfItems: QUESTION_COUNT,
    itemListElement: CATEGORY_KEYS.flatMap((key) =>
      getQuestionsByCategory(key).map((q) => ({
        "@type": "ListItem",
        name: q.question,
        url: absoluteUrl(`/questions/${q.slug}`),
      })),
    ).map((item, i) => ({ ...item, position: i + 1 })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--page-muted)]">
            <Link href="/" className="underline underline-offset-2 hover:text-[var(--page-fg)]">
              Home
            </Link>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            Data science interview questions and answers
          </h1>
          <p className="mt-3 text-sm text-[var(--page-muted)]">
            The complete deck with answers.{" "}
            <Link href="/" className="underline underline-offset-2">
              Play it as flashcards instead
            </Link>
            .
          </p>

          {CATEGORY_KEYS.map((key) => {
            const category = CATEGORIES[key];
            const items = getQuestionsByCategory(key);
            if (items.length === 0) return null;
            return (
              <section key={key} aria-labelledby={`cat-${key}`} className="mt-12">
                <h2
                  id={`cat-${key}`}
                  className="font-[family-name:var(--font-card)] text-lg font-bold uppercase"
                >
                  <span className="mr-3 inline-block h-3 w-3 align-middle" style={{ backgroundColor: category.color }} aria-hidden="true" />
                  <Link href={`/categories/${category.slug}`} className="underline decoration-transparent underline-offset-4 hover:decoration-current">
                    {category.name}
                  </Link>
                  <span className="ml-2 text-xs font-normal normal-case text-[var(--page-muted)]">
                    {items.length} questions
                  </span>
                </h2>

                <dl className="mt-5 space-y-6">
                  {items.map((q) => (
                    <div key={q.id} className="border-l-[3px] pl-4" style={{ borderColor: category.color }}>
                      <dt className="font-medium leading-snug">
                        <Link href={`/questions/${q.slug}`} className="underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current">
                          {q.question}
                        </Link>
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-[var(--page-muted)]">
                        {q.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

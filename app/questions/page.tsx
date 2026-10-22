import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  type CategoryKey,
  getCategoryStarters,
  getQuestionsByCategory,
  inSentence,
  pageTitle,
} from "@/lib/questions";

export const metadata: Metadata = {
  title: { absolute: `${QUESTION_COUNT} Data Science Interview Questions & Answers` },
  description: `${QUESTION_COUNT} data science interview questions with answers, grouped by topic: machine learning, statistics, deep learning, LLMs, MLOps and the history of AI. Each topic opens with the questions to answer first.`,
  alternates: { canonical: "/questions" },
  openGraph: {
    type: "website",
    title: `Data Science Interview Questions and Answers — ${SITE.name}`,
    description: `${QUESTION_COUNT} questions grouped by topic, each starting with the ones to answer first.`,
    url: absoluteUrl("/questions"),
  },
};

// Machine learning and statistics first: they are what nearly every data
// science interview tests. Any category not named here keeps its deck order.
const FIRST: CategoryKey[] = ["ml", "stats"];
const ORDER = [...FIRST, ...CATEGORY_KEYS.filter((k) => !FIRST.includes(k))];

/**
 * The deck's index page. Unlike the category hubs, which list every card with
 * its answer, this page answers only each topic's starters and lists the rest
 * as links, so it reads as a guide to the deck rather than a copy of the hubs.
 */
export default function QuestionsIndexPage() {
  const sections = ORDER.map((key) => {
    const starters = getCategoryStarters(key);
    const starterIds = new Set(starters.map((q) => q.id));
    const items = getQuestionsByCategory(key);
    return {
      key,
      category: CATEGORIES[key],
      count: items.length,
      starters,
      rest: items.filter((q) => !starterIds.has(q.id)),
    };
  }).filter((s) => s.count > 0);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/questions#faq"),
    mainEntity: sections.flatMap((s) =>
      s.starters.map((q) => ({
        "@type": "Question",
        name: pageTitle(q),
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
    itemListElement: sections
      .flatMap((s) => [...s.starters, ...s.rest])
      .map((q, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: pageTitle(q),
        url: absoluteUrl(`/questions/${q.slug}`),
      })),
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
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--page-muted)]">
            {QUESTION_COUNT} questions that come up in data science interviews, grouped by topic.
            Machine learning and statistics are tested almost everywhere. Deep learning, LLMs and
            MLOps come up more for ML engineer and research roles, and the history of AI is there
            for the small talk. The deck covers concepts, not SQL or coding rounds.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--page-muted)]">
            Each topic opens with the questions to answer first, with their short answers. Every
            question links to its own page with a longer explanation, usually with a worked
            example. To test yourself instead,{" "}
            <Link href="/" className="underline underline-offset-2">
              play the flashcards
            </Link>{" "}
            or{" "}
            <Link href="/quiz" className="underline underline-offset-2">
              take a ten-question quiz
            </Link>
            .
          </p>

          <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-3">
            {sections.map(({ key, category, count }) => (
              <a
                key={key}
                href={`#${category.slug}`}
                className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
              >
                {category.name} <span className="font-normal">{count}</span>
              </a>
            ))}
          </nav>

          {sections.map(({ key, category, count, starters, rest }) => (
            <section
              key={key}
              id={category.slug}
              aria-labelledby={`cat-${key}`}
              className="mt-14 scroll-mt-6"
            >
              <h2
                id={`cat-${key}`}
                className="font-[family-name:var(--font-card)] text-lg font-bold uppercase"
              >
                <span className="mr-3 inline-block h-3 w-3 align-middle" style={{ backgroundColor: category.color }} aria-hidden="true" />
                <Link href={`/categories/${category.slug}`} className="underline decoration-transparent underline-offset-4 hover:decoration-current">
                  {category.name}
                </Link>
                <span className="ml-2 text-xs font-normal normal-case text-[var(--page-muted)]">
                  {count} questions
                </span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--page-muted)]">{category.blurb}</p>

              <dl className="mt-5 space-y-6">
                {starters.map((q) => (
                  <div key={q.id} className="border-l-[3px] pl-4" style={{ borderColor: category.color }}>
                    <dt className="font-medium leading-snug">
                      <Link href={`/questions/${q.slug}`} className="underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current">
                        {pageTitle(q)}
                      </Link>
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-[var(--page-muted)]">
                      {q.answer}
                    </dd>
                  </div>
                ))}
              </dl>

              {rest.length > 0 ? (
                <>
                  <h3 className="mt-8 font-[family-name:var(--font-card)] text-sm font-bold uppercase">
                    More {inSentence(category.name)} questions
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-snug">
                    {rest.map((q) => (
                      <li key={q.id}>
                        <Link href={`/questions/${q.slug}`} className="underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current">
                          {pageTitle(q)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <p className="mt-5 text-sm">
                <Link href={`/categories/${category.slug}`} className="underline underline-offset-2">
                  All {count} {inSentence(category.name)} questions with their answers
                </Link>
              </p>
            </section>
          ))}

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

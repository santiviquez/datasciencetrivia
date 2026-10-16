import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { CONTENT_UPDATED, SITE, absoluteUrl } from "@/lib/site";
import { SCHEMA_ID } from "@/lib/schema";
import { CATEGORIES, pageTitle } from "@/lib/questions";
import { TIMELINE_SPAN, getTimeline } from "@/lib/timeline";

const PATH = "/ai-history";
const TITLE = `History of Artificial Intelligence: A Timeline from ${TIMELINE_SPAN.from} to ${TIMELINE_SPAN.to}`;
const DESCRIPTION = `The history of AI and machine learning in ${getTimeline().length} milestones, from Bayes' theorem and least squares through the perceptron, backpropagation and AlexNet to the Transformer and ChatGPT, each with a flashcard to test yourself.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
  },
};

export default function AiHistoryPage() {
  const events = getTimeline();
  const color = CATEGORIES.history.color;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`${PATH}#article`),
    headline: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    dateModified: CONTENT_UPDATED,
    author: { "@type": "Person", "@id": SCHEMA_ID.person, name: SITE.author.name },
    isPartOf: { "@type": "WebSite", "@id": SCHEMA_ID.website },
    about: { "@type": "Thing", name: "History of artificial intelligence" },
    mainEntity: {
      "@type": "ItemList",
      name: "Milestones in the history of artificial intelligence",
      numberOfItems: events.length,
      itemListElement: events.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${e.year}: ${e.title}`,
        description: e.text,
        url: absoluteUrl(`${PATH}#y${e.year}`),
      })),
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "History of AI", item: absoluteUrl(PATH) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--muted)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="underline underline-offset-2 hover:text-[var(--fg)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/categories/${CATEGORIES.history.slug}`} className="underline underline-offset-2 hover:text-[var(--fg)]">History questions</Link></li>
            </ol>
          </nav>

          <span className="mb-4 inline-block h-3 w-16" style={{ backgroundColor: color }} aria-hidden="true" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            The history of AI, {TIMELINE_SPAN.from} to {TIMELINE_SPAN.to}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed">
            Artificial intelligence grew out of probability and statistics long before it had a name.
            Bayes and Legendre gave it the maths in the 18th and 19th centuries. Turing, McCulloch
            and Pitts, and the 1956 Dartmouth workshop gave it a goal. The perceptron, backpropagation
            and decades of datasets and hardware made neural networks work, until AlexNet in 2012 and
            the Transformer in 2017 led to the language models in use today.
          </p>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
            {events.length} milestones, oldest first. Most come with a flashcard so you can check you
            remember who did what.
          </p>

          <ol className="relative mt-10 border-l-[3px] pl-6" style={{ borderColor: color }}>
            {events.map((e) => (
              <li key={`${e.year}-${e.title}`} id={`y${e.year}`} className="relative mb-10 scroll-mt-8 last:mb-0">
                <span
                  className="absolute -left-[33px] top-1.5 h-3.5 w-3.5 border-2 border-black bg-white"
                  aria-hidden="true"
                />
                <p className="font-[family-name:var(--font-card)] text-sm font-bold text-[var(--muted)]">
                  <time dateTime={String(e.year)}>{e.year}</time>
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-card)] text-lg font-bold leading-snug">
                  {e.title}
                </h2>
                <p className="mt-2 leading-relaxed">{e.text}</p>
                {e.cards.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {e.cards.map((q) => (
                      <li key={q.id} className="text-sm leading-snug">
                        <span className="text-[var(--muted)]">Flashcard: </span>
                        <Link
                          href={`/questions/${q.slug}`}
                          className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current"
                        >
                          {pageTitle(q)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>

          <section className="mt-14 border border-[var(--rule)] p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-card)] text-sm font-bold uppercase">
              Test yourself
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Take the{" "}
              <Link href="/quiz/ai-history" className="underline underline-offset-2">
                AI history quiz
              </Link>{" "}
              or browse all{" "}
              <Link href={`/categories/${CATEGORIES.history.slug}`} className="underline underline-offset-2">
                history of AI questions
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

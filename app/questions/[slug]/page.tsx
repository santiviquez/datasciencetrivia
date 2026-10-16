import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameScreen from "@/components/GameScreen";
import { SITE, CONTENT_UPDATED, absoluteUrl } from "@/lib/site";
import { SCHEMA_ID } from "@/lib/schema";
import {
  CATEGORIES,
  getAllQuestions,
  getQuestionBySlug,
  getRelatedQuestions,
  pageTitle,
} from "@/lib/questions";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) return {};

  // A longer answer opens with a self-contained summary, which makes a better
  // snippet than a card answer that can be a single word.
  const summary = q.explanation?.[0] ?? q.answer;
  const description = summary.length > 155 ? `${summary.slice(0, 152).trimEnd()}…` : summary;
  const title = pageTitle(q);

  return {
    title,
    description,
    alternates: { canonical: `/questions/${q.slug}` },
    openGraph: {
      type: "article",
      title: `${title} — ${SITE.name}`,
      description,
      url: absoluteUrl(`/questions/${q.slug}`),
    },
    twitter: { card: "summary_large_image", title: `${title} — ${SITE.name}`, description },
  };
}

export default async function QuestionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) notFound();

  const category = CATEGORIES[q.category];
  const related = getRelatedQuestions(q, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": absoluteUrl(`/questions/${q.slug}#qapage`),
    mainEntity: {
      "@type": "Question",
      name: pageTitle(q),
      text: q.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.explanation ? [q.answer, ...q.explanation].join("\n\n") : q.answer,
        url: absoluteUrl(`/questions/${q.slug}`),
      },
      // Carries the same @id as the Person on /about, so all 197 answers are
      // attributed to one author instead of 197 look-alike ones.
      author: {
        "@type": "Person",
        "@id": SCHEMA_ID.person,
        name: SITE.author.name,
        url: absoluteUrl("/about"),
      },
      dateModified: q.updated ?? CONTENT_UPDATED,
    },
    isPartOf: { "@type": "WebSite", "@id": SCHEMA_ID.website },
    about: { "@type": "Thing", name: category.name },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/categories/${category.slug}`) },
      { "@type": "ListItem", position: 3, name: pageTitle(q), item: absoluteUrl(`/questions/${q.slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Same game, this card first and already revealed. */}
      <GameScreen questions={getAllQuestions()} focus={q}>
        {/*
          The card above already renders the question and its answer into the
          HTML, so repeating them here would only duplicate the page's content.
          What is left is the longer answer, where a card has one, and internal
          linking.
        */}
        <div className="mx-auto w-full max-w-4xl px-6 py-16">
          <nav aria-label="Breadcrumb" className="mb-10 text-xs text-[var(--muted)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="underline underline-offset-2">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/questions" className="underline underline-offset-2">All questions</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/categories/${category.slug}`} className="underline underline-offset-2">
                  {category.name}
                </Link>
              </li>
            </ol>
          </nav>

          {q.explanation ? (
            <section aria-labelledby="explained" className="mb-14 max-w-2xl">
              <h2 id="explained" className="font-[family-name:var(--font-display)] text-lg">
                The longer answer
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed">
                {q.explanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section aria-labelledby="related">
              <h2 id="related" className="font-[family-name:var(--font-display)] text-lg">
                More {category.name} questions
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.id} className="text-sm leading-snug">
                    <Link href={`/questions/${r.slug}`} className="underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current">
                      {pageTitle(r)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="mt-12 text-sm">
            <Link href="/questions" className="underline underline-offset-2">
              All questions
            </Link>
          </p>
        </div>
      </GameScreen>
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TriviaCard from "@/components/TriviaCard";
import Footer from "@/components/Footer";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  getAllQuestions,
  getQuestionBySlug,
  getRelatedQuestions,
} from "@/lib/questions";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) return {};

  const title = q.question;
  // Search engines truncate around 160 characters.
  const description =
    q.answer.length > 155 ? `${q.answer.slice(0, 152).trimEnd()}…` : q.answer;

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
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE.name}`,
      description,
    },
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) notFound();

  const category = CATEGORIES[q.category];
  const related = getRelatedQuestions(q);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": absoluteUrl(`/questions/${q.slug}#qapage`),
    mainEntity: {
      "@type": "Question",
      name: q.question,
      text: q.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
        url: absoluteUrl(`/questions/${q.slug}`),
      },
      author: { "@type": "Person", name: SITE.author.name },
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: absoluteUrl(`/categories/${category.slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: q.question,
        item: absoluteUrl(`/questions/${q.slug}`),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--page-muted)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="underline underline-offset-2 hover:text-[var(--page-fg)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/categories/${category.slug}`} className="underline underline-offset-2 hover:text-[var(--page-fg)]">
                  {category.name}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
            <div className="shrink-0">
              <TriviaCard
                category={q.category}
                question={q.question}
                answer={q.answer}
                proposedBy={q.proposedBy}
                revealed={false}
                as="h1"
              />
            </div>

            <div className="w-full">
              <h2 className="font-[family-name:var(--font-display)] text-lg">Answer</h2>
              <p className="mt-3 text-base leading-relaxed">{q.answer}</p>

              <p className="mt-6 text-sm text-[var(--page-muted)]">
                Category:{" "}
                <Link href={`/categories/${category.slug}`} className="underline underline-offset-2">
                  {category.name}
                </Link>
              </p>

              <Link
                href="/"
                className="mt-8 inline-block border-[3px] border-black bg-black px-5 py-2.5 font-[family-name:var(--font-card)] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                Play the full deck
              </Link>
            </div>
          </div>

          {related.length > 0 ? (
            <section aria-labelledby="related" className="mt-16">
              <h2 id="related" className="font-[family-name:var(--font-display)] text-lg">
                More {category.name} questions
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((r) => (
                  <li key={r.id} className="text-sm">
                    <Link href={`/questions/${r.slug}`} className="underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current">
                      {r.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Footer />
        </main>
      </div>
    </>
  );
}

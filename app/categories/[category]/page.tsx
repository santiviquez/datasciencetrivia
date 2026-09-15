import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Author from "@/components/Author";
import { SITE, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  getCategoryBySlug,
  getCategoryStarters,
  getQuestionsByCategory,
} from "@/lib/questions";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return CATEGORY_KEYS.map((k) => ({ category: CATEGORIES[k].slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const key = getCategoryBySlug(slug);
  if (!key) return {};
  const c = CATEGORIES[key];
  const count = getQuestionsByCategory(key).length;

  return {
    title: { absolute: `${count} ${c.name} Interview Questions & Answers` },
    description: `${count} ${c.name.toLowerCase()} flashcards with answers. ${c.blurb}`,
    alternates: { canonical: `/categories/${c.slug}` },
    openGraph: {
      type: "website",
      title: `${c.name} interview questions and answers — ${SITE.name}`,
      description: c.blurb,
      url: absoluteUrl(`/categories/${c.slug}`),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: slug } = await params;
  const key = getCategoryBySlug(slug);
  if (!key) notFound();

  const c = CATEGORIES[key];
  const items = getQuestionsByCategory(key);
  const starters = getCategoryStarters(key);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl(`/categories/${c.slug}#faq`),
    name: `${c.name} interview questions and answers`,
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      url: absoluteUrl(`/questions/${q.slug}`),
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "All questions", item: absoluteUrl("/questions") },
      { "@type": "ListItem", position: 3, name: c.name, item: absoluteUrl(`/categories/${c.slug}`) },
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
              <li><Link href="/questions" className="underline underline-offset-2 hover:text-[var(--page-fg)]">All questions</Link></li>
            </ol>
          </nav>

          <span className="mb-4 inline-block h-3 w-16" style={{ backgroundColor: c.color }} aria-hidden="true" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            {c.name} interview questions
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--page-muted)]">{c.blurb}</p>
          <p className="mt-2 text-sm text-[var(--page-muted)]">
            {items.length} question{items.length === 1 ? "" : "s"} in this category.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--page-muted)]">
            {c.intro}
          </p>

          {starters.length > 0 ? (
            <section aria-labelledby="start-here" className="mt-8 border border-[var(--rule)] p-5 sm:p-6">
              <h2 id="start-here" className="font-[family-name:var(--font-card)] text-sm font-bold uppercase">
                Start with these
              </h2>
              <ol className="mt-4 space-y-2.5">
                {starters.map((q, i) => (
                  <li key={q.id} className="flex gap-3 text-sm leading-snug">
                    <span className="shrink-0 font-[family-name:var(--font-card)] text-xs text-[var(--page-muted)]" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link href={`/questions/${q.slug}`} className="underline decoration-[var(--page-rule)] underline-offset-2 hover:decoration-current">
                      {q.question}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <dl className="mt-10 space-y-6">
            {items.map((q) => (
              <div key={q.id} className="border-l-[3px] pl-4" style={{ borderColor: c.color }}>
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

          <div className="mt-12 flex flex-wrap gap-3">
            {CATEGORY_KEYS.filter((k) => k !== key).map((k) => (
              <Link
                key={k}
                href={`/categories/${CATEGORIES[k].slug}`}
                className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
              >
                {CATEGORIES[k].name}
              </Link>
            ))}
          </div>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

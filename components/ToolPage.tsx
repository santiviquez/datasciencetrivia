import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Author from "@/components/Author";
import type { CardLook } from "@/components/ToolCard";
import { CATEGORIES, getQuestionBySlug } from "@/lib/questions";
import { SCHEMA_ID } from "@/lib/schema";
import { SITE, absoluteUrl } from "@/lib/site";
import { TOOLS_UPDATED, getTool } from "@/lib/tools";

export interface Faq {
  q: string;
  a: string;
}

const toolPath = (slug: string) => `/tools/${slug}`;

export function toolMetadata(slug: string, title: string, description: string): Metadata {
  const path = toolPath(slug);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", title, description, url: absoluteUrl(path) },
  };
}

/** The colour and pattern of a tool's category, for its card. */
export function toolLook(slug: string): CardLook {
  const { color, pattern } = CATEGORIES[getTool(slug).category];
  return { color, pattern };
}

/**
 * Everything around a calculator: breadcrumb, heading, one line of intro, then
 * a short example, a short FAQ and the flashcards behind the numbers. Kept
 * deliberately sparse; the calculator is the page.
 */
export default function ToolPage({
  slug,
  description,
  intro,
  features,
  example,
  faq,
  children,
}: {
  slug: string;
  /** The meta description, reused in the structured data. */
  description: string;
  intro: ReactNode;
  /** What the tool computes, for the structured data. */
  features: string[];
  example: ReactNode;
  faq: Faq[];
  children: ReactNode;
}) {
  const tool = getTool(slug);
  const path = toolPath(slug);

  for (const [card] of tool.cards) {
    if (!getQuestionBySlug(card)) throw new Error(`${slug} links to a card that does not exist: ${card}`);
  }

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": absoluteUrl(`${path}#app`),
    name: tool.name,
    url: absoluteUrl(path),
    description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (runs in the browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: TOOLS_UPDATED,
    author: { "@type": "Person", "@id": SCHEMA_ID.person, name: SITE.author.name },
    isPartOf: { "@type": "WebSite", "@id": SCHEMA_ID.website },
    featureList: features,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
      { "@type": "ListItem", position: 3, name: tool.name, item: absoluteUrl(path) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--muted)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="underline underline-offset-2 hover:text-[var(--fg)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/tools" className="underline underline-offset-2 hover:text-[var(--fg)]">Tools</Link></li>
            </ol>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">{tool.name}</h1>
          <p className="mt-3 text-[var(--muted)]">{intro}</p>

          <div className="mt-8">{children}</div>

          <section aria-labelledby="example" className="mt-14 max-w-xl">
            <h2 id="example" className="font-[family-name:var(--font-display)] text-lg">The example</h2>
            <p className="mt-2 leading-relaxed">{example}</p>
          </section>

          <section aria-labelledby="faq" className="mt-12 max-w-xl">
            <h2 id="faq" className="font-[family-name:var(--font-display)] text-lg">FAQ</h2>
            <dl className="mt-3 space-y-4">
              {faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-[var(--muted)]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="practice" className="mt-12">
            <h2 id="practice" className="font-[family-name:var(--font-display)] text-lg">Flashcards</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tool.cards.map(([card, label]) => (
                <li key={card}>
                  <Link
                    href={`/questions/${card}`}
                    className="inline-block border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

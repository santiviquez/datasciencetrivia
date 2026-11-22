import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { absoluteUrl } from "@/lib/site";
import { CATEGORIES } from "@/lib/questions";
import { TOOLS } from "@/lib/tools";

const TITLE = "Free Data Science and Machine Learning Calculators";
const DESCRIPTION =
  "Free calculators for statistics and machine learning: a p-value calculator and a confusion matrix calculator that show their working, with a flashcard for each concept.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/tools" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: absoluteUrl("/tools") },
};

export default function ToolsPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/tools#list"),
    name: TITLE,
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: absoluteUrl(`/tools/${t.slug}`),
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

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">Tools</h1>
          <p className="mt-3 text-[var(--muted)]">Free calculators that show their working.</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="flex h-full flex-col border-[6px] border-black bg-white transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span className="flex-1 px-4 py-4 font-[family-name:var(--font-card)] text-base font-bold uppercase leading-snug">{t.name}</span>
                  <span className="border-t-[6px] border-black px-4 py-1.5 text-xs" style={{ backgroundColor: CATEGORIES[t.category].color }}>{t.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

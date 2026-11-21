import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { absoluteUrl } from "@/lib/site";
import { CATEGORIES } from "@/lib/questions";
import { TOOLS } from "@/lib/tools";

const TITLE = "Free Data Science and Machine Learning Calculators";
const DESCRIPTION =
  "Free calculators for machine learning and statistics: a confusion matrix calculator for precision, recall, F1 and MCC, with every formula worked out and a flashcard for each concept.";

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
          <p className="mt-4 max-w-xl leading-relaxed">
            Calculators for the numbers that come up in data science work and interviews. Each one shows the
            formula with your numbers in it and links to the flashcard that explains the idea. Free, no sign-up,
            and everything runs in your browser.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="flex h-full flex-col gap-1 rounded-md border border-[var(--rule)] px-4 py-3 transition hover:border-black/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0" style={{ backgroundColor: CATEGORIES[t.category].color }} aria-hidden="true" />
                    <span className="font-[family-name:var(--font-card)] text-sm font-bold uppercase">{t.name}</span>
                  </span>
                  <span className="text-sm text-[var(--muted)]">{t.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm">
            <Link href="/quiz" className="underline underline-offset-2">Quizzes</Link>
            {" · "}
            <Link href="/questions" className="underline underline-offset-2">All questions by topic</Link>
          </p>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

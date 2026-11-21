import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import ConfusionMatrixCalculator from "@/components/ConfusionMatrixCalculator";
import { SITE, absoluteUrl } from "@/lib/site";
import { SCHEMA_ID } from "@/lib/schema";
import { EXAMPLE_COUNTS, METRICS, formatMetric, total } from "@/lib/metrics";
import { TOOLS_UPDATED } from "@/lib/tools";

const PATH = "/tools/confusion-matrix-calculator";
const TITLE = "Confusion Matrix Calculator: Precision, Recall, F1, MCC and More";
const DESCRIPTION =
  "Free confusion matrix calculator. Enter true positives, false positives, false negatives and true negatives to get accuracy, precision, recall, F1 score, specificity, MCC, Cohen's kappa and 7 more metrics, with every formula worked out.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH) },
};

function value(key: string) {
  const m = METRICS.find((d) => d.key === key)!;
  return m.compute(EXAMPLE_COUNTS);
}

const PRACTICE: [string, string][] = [
  ["what-is-a-confusion-matrix", "Confusion matrix"],
  ["what-is-the-difference-between-precision-and-recall", "Precision vs recall"],
  ["what-is-f1-score", "F1 score"],
  ["what-is-the-difference-between-sensitivity-and-specificity", "Sensitivity vs specificity"],
  ["what-is-the-matthews-correlation-coefficient", "MCC"],
  ["what-is-cohens-kappa", "Cohen's kappa"],
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do you calculate precision and recall?",
    a: "Precision = TP / (TP + FP). Recall = TP / (TP + FN). Neither uses true negatives.",
  },
  {
    q: "Which metric should I use on imbalanced data?",
    a: "Not accuracy. Use MCC or balanced accuracy for one number, or F1 if only the positive class matters.",
  },
  {
    q: "What about more than two classes?",
    a: "Treat each class as positive and the rest as negative, compute per class, then macro- or micro-average.",
  },
];

export default function ConfusionMatrixCalculatorPage() {
  const n = total(EXAMPLE_COUNTS);
  const { tp, fn } = EXAMPLE_COUNTS;

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": absoluteUrl(`${PATH}#app`),
    name: "Confusion matrix calculator",
    url: absoluteUrl(PATH),
    description: DESCRIPTION,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (runs in the browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: TOOLS_UPDATED,
    author: { "@type": "Person", "@id": SCHEMA_ID.person, name: SITE.author.name },
    isPartOf: { "@type": "WebSite", "@id": SCHEMA_ID.website },
    featureList: METRICS.map((m) => m.name),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
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
      { "@type": "ListItem", position: 3, name: "Confusion matrix calculator", item: absoluteUrl(PATH) },
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

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">Confusion matrix calculator</h1>
          <p className="mt-3 text-[var(--muted)]">
            Enter the four counts. Get {METRICS.length} metrics, with the working shown.
          </p>

          <div className="mt-8">
            <ConfusionMatrixCalculator />
          </div>

          <section aria-labelledby="example" className="mt-14 max-w-xl">
            <h2 id="example" className="font-[family-name:var(--font-display)] text-lg">The example</h2>
            <p className="mt-2 leading-relaxed">
              A fraud model checks {n.toLocaleString("en-US")} transactions, {tp + fn} of them fraud. Accuracy is{" "}
              {formatMetric(value("accuracy"), 2)}, but a model that flags nothing scores 0.95. Precision (
              {formatMetric(value("precision"), 2)}) and MCC ({formatMetric(value("mcc"), 2)}) tell the real story.
            </p>
          </section>

          <section aria-labelledby="faq" className="mt-12 max-w-xl">
            <h2 id="faq" className="font-[family-name:var(--font-display)] text-lg">FAQ</h2>
            <dl className="mt-3 space-y-4">
              {FAQ.map((f) => (
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
              {PRACTICE.map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={`/questions/${slug}`}
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

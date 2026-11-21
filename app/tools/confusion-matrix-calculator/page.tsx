import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import ConfusionMatrixCalculator from "@/components/ConfusionMatrixCalculator";
import { SITE, absoluteUrl } from "@/lib/site";
import { SCHEMA_ID } from "@/lib/schema";
import { CATEGORIES } from "@/lib/questions";
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

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do you calculate precision and recall from a confusion matrix?",
    a: "Precision is TP / (TP + FP): of the cases the model called positive, the share that really were. Recall is TP / (TP + FN): of the cases that really were positive, the share the model found. Both ignore true negatives.",
  },
  {
    q: "How do you calculate the F1 score from a confusion matrix?",
    a: "F1 is the harmonic mean of precision and recall, which simplifies to 2·TP / (2·TP + FP + FN). With TP = 40, FP = 60 and FN = 10 that is 80 / 150 = 0.533.",
  },
  {
    q: "Which metric should I use on imbalanced data?",
    a: "Not accuracy. When 95% of cases are negative, a model that always says negative scores 95%. Use MCC or balanced accuracy for a single summary of both classes, F1 when you care about the positive class only, and report precision and recall at the threshold you will actually use.",
  },
  {
    q: "Why does the calculator say a metric is undefined?",
    a: "Its denominator is zero. Precision is undefined when the model predicts no positives at all (TP + FP = 0), and recall is undefined when the data has no positives (TP + FN = 0). Libraries such as scikit-learn report 0 with a warning in that case, which hides the problem.",
  },
  {
    q: "Does this work for multi-class problems?",
    a: "This calculator handles one binary matrix. For more classes, treat each class as positive and the rest as negative (one-vs-rest), compute the metrics per class, then average them: macro averaging weighs classes equally, micro averaging weighs every prediction equally.",
  },
  {
    q: "What is the difference between MCC and Cohen's kappa?",
    a: "Both use all four cells and correct for chance, and both run from −1 to 1. MCC is the correlation between predicted and true labels. Kappa compares observed agreement with the agreement expected from the class rates alone. They are usually close; MCC is the more common choice for evaluating a classifier.",
  },
];

export default function ConfusionMatrixCalculatorPage() {
  const n = total(EXAMPLE_COUNTS);
  const { tp, fp, fn, tn } = EXAMPLE_COUNTS;
  const color = CATEGORIES.ml.color;

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

  const link = "underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current";

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

          <span className="mb-4 inline-block h-3 w-16" style={{ backgroundColor: color }} aria-hidden="true" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">Confusion matrix calculator</h1>
          <p className="mt-4 max-w-xl leading-relaxed">
            Type the four counts from your classifier&apos;s{" "}
            <Link href="/questions/what-is-a-confusion-matrix" className={link}>confusion matrix</Link> and get{" "}
            {METRICS.length} metrics at once: accuracy, precision, recall, F1, specificity, MCC, Cohen&apos;s kappa
            and the error rates. Every result shows its formula with your numbers plugged in, so you can check the
            arithmetic or copy it into an answer. Nothing leaves your browser.
          </p>

          <div className="mt-8">
            <ConfusionMatrixCalculator />
          </div>

          <section aria-labelledby="example" className="mt-14">
            <h2 id="example" className="font-[family-name:var(--font-display)] text-xl">Worked example: a fraud model</h2>
            <p className="mt-3 leading-relaxed">
              A model screens {n.toLocaleString("en-US")} card transactions, {tp + fn} of which are fraud. It flags{" "}
              {tp + fp}. {tp} of the flags are real fraud (TP) and {fp} are honest customers (FP). It misses {fn} frauds
              (FN) and correctly clears {tn.toLocaleString("en-US")} transactions (TN).
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li>
                <strong>Accuracy is {formatMetric(value("accuracy"), 2)}</strong>, which sounds great. But a model
                that never flags anything scores 0.95 here, because only 5% of transactions are fraud.
              </li>
              <li>
                <strong>Precision is {formatMetric(value("precision"), 2)}</strong>: 6 in 10 flags are false alarms,
                and each one is a customer whose card gets blocked.
              </li>
              <li>
                <strong>Recall is {formatMetric(value("recall"), 2)}</strong>: it catches 8 in 10 frauds.
              </li>
              <li>
                <strong>F1 is {formatMetric(value("f1"), 2)}</strong> and <strong>MCC is {formatMetric(value("mcc"), 2)}</strong>,
                a far more honest summary than 0.93. Cohen&apos;s kappa comes out at {formatMetric(value("kappa"), 2)}.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Whether 0.40 precision is acceptable depends on what a false alarm costs compared with a missed fraud.
              Moving the decision threshold trades one for the other; the{" "}
              <Link href="/questions/what-is-the-precision-recall-curve" className={link}>precision-recall curve</Link> and
              the <Link href="/questions/graphical-representation-of-the-contrast-between-true-positives-and-false-positives-rates" className={link}>ROC curve</Link>{" "}
              show every threshold at once.
            </p>
          </section>

          <section aria-labelledby="which" className="mt-14">
            <h2 id="which" className="font-[family-name:var(--font-display)] text-xl">Which metric to report</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li><strong>False positives are expensive</strong> (spam filters, blocking payments): watch precision.</li>
              <li><strong>Misses are expensive</strong> (disease screening, fraud you must catch): watch recall.</li>
              <li><strong>You need one number for an imbalanced problem</strong>: MCC or balanced accuracy, or F1 if only the positive class matters.</li>
              <li><strong>Classes are balanced and errors cost the same</strong>: accuracy is fine.</li>
              <li><strong>Medical tests</strong>: sensitivity (recall) and specificity, the pair clinicians use.</li>
            </ul>
          </section>

          <section aria-labelledby="faq" className="mt-14">
            <h2 id="faq" className="font-[family-name:var(--font-display)] text-xl">Questions people ask</h2>
            <dl className="mt-4 space-y-5">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt className="font-[family-name:var(--font-card)] font-bold leading-snug">{f.q}</dt>
                  <dd className="mt-1.5 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="practice" className="mt-14">
            <h2 id="practice" className="font-[family-name:var(--font-display)] text-xl">Test yourself</h2>
            <p className="mt-3 leading-relaxed">
              Interviewers love these metrics. Check you can explain them without a calculator:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link href="/questions/what-is-the-difference-between-precision-and-recall" className={link}>What is the difference between precision and recall?</Link></li>
              <li><Link href="/questions/what-is-f1-score" className={link}>What is the F1 score, and how do you calculate and interpret it?</Link></li>
              <li><Link href="/questions/what-is-the-difference-between-sensitivity-and-specificity" className={link}>What is the difference between sensitivity and specificity?</Link></li>
              <li><Link href="/questions/what-is-the-matthews-correlation-coefficient" className={link}>What is the Matthews correlation coefficient?</Link></li>
              <li><Link href="/questions/what-is-cohens-kappa" className={link}>What is Cohen&apos;s kappa?</Link></li>
              <li><Link href="/questions/what-is-the-difference-between-a-false-positive-and-a-false-negative" className={link}>What is the difference between a false positive and a false negative?</Link></li>
            </ul>
            <p className="mt-4 text-sm">
              Or take the <Link href="/quiz/machine-learning" className="underline underline-offset-2">machine learning quiz</Link>.
            </p>
          </section>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

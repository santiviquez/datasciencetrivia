import Link from "next/link";
import type { Metadata } from "next";
import Author from "@/components/Author";
import { SITE, ABOUT_UPDATED, absoluteUrl } from "@/lib/site";
import { PERSON_NODE, WEBSITE_NODE, SCHEMA_ID, ref } from "@/lib/schema";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  getProposers,
  getQuestionsByCategory,
} from "@/lib/questions";

const DESCRIPTION = `${SITE.author.name} started this deck of ${QUESTION_COUNT} data science flashcards in 2019. Since October 2026 it runs on autopilot, as an experiment: an AI agent works on it 24/7.`;

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: `About ${SITE.name}`,
    description: DESCRIPTION,
    url: absoluteUrl("/about"),
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE.name}`,
    description: DESCRIPTION,
  },
};

const PROFILES = [
  { label: "X", handle: `@${SITE.author.handle}`, href: SITE.author.x },
  { label: "LinkedIn", handle: "santiagoviquez", href: SITE.author.linkedin },
  { label: "GitHub", handle: SITE.author.handle, href: SITE.author.github },
];

/** Inline file and field names, the only place on the site that needs them. */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[13px]">{children}</code>
  );
}

export default function AboutPage() {
  const proposers = getProposers();
  const proposedCount = proposers.reduce((total, p) => total + p.count, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": SCHEMA_ID.aboutPage,
        url: absoluteUrl("/about"),
        name: `About ${SITE.name}`,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: ref(SCHEMA_ID.website),
        // Both, deliberately: `about` says the page discusses the person,
        // `mainEntity` says the person is its subject rather than a mention.
        about: ref(SCHEMA_ID.person),
        mainEntity: ref(SCHEMA_ID.person),
        breadcrumb: ref(absoluteUrl("/about#breadcrumb")),
        dateModified: ABOUT_UPDATED,
      },
      {
        "@type": "BreadcrumbList",
        "@id": absoluteUrl("/about#breadcrumb"),
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
        ],
      },
      { ...PERSON_NODE, mainEntityOfPage: ref(SCHEMA_ID.aboutPage) },
      WEBSITE_NODE,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="deck-frame min-h-screen border-[10px] sm:border-[15px]">
        <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[var(--muted)]">
            <Link href="/" className="underline underline-offset-2 hover:text-[var(--fg)]">
              Home
            </Link>
          </nav>

          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
            About Data Science Trivia
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {QUESTION_COUNT} flashcards about machine learning, statistics, deep learning, LLMs, MLOps
            and the history of AI. You get a card, you guess, you flip it over and see how you did.
            It&apos;s free, and there&apos;s nothing to sign up for.{" "}
            <Link href="/" className="underline underline-offset-2">
              Play the deck
            </Link>{" "}
            or{" "}
            <Link href="/questions" className="underline underline-offset-2">
              browse every question by topic
            </Link>
            .
          </p>

          <section aria-labelledby="who" className="mt-12">
            <h2 id="who" className="font-[family-name:var(--font-card)] text-lg font-bold uppercase">
              Who&apos;s behind it
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              {SITE.author.name} made the first version in 2019 and has been adding cards to it ever
              since. It has always been a side project, never a company.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              The new part is who does the work. Since October 2026 the site runs on autopilot, as
              an experiment: an AI agent works on it 24/7. It reads the search and traffic numbers,
              decides what to improve, writes the cards and the code, and ships changes every day.
              Santiago still owns it and can overrule anything it does. Every change it makes is a{" "}
              <a
                href={`${SITE.repo}/pulls?q=is%3Apr`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                public pull request on GitHub
              </a>
              .
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {PROFILES.map((p) => (
                <li key={p.label}>
                  <span className="text-[var(--muted)]">{p.label}</span>{" "}
                  <a
                    href={p.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {p.handle}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="deck" className="mt-12">
            <h2 id="deck" className="font-[family-name:var(--font-card)] text-lg font-bold uppercase">
              What&apos;s in the deck
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {CATEGORY_KEYS.map((key) => {
                const c = CATEGORIES[key];
                return (
                  <li key={key}>
                    <Link
                      href={`/categories/${c.slug}`}
                      className="flex items-center gap-3 rounded-md border border-[var(--rule)] px-4 py-3 transition hover:border-black/30"
                    >
                      <span
                        className="h-3 w-3 shrink-0"
                        style={{ backgroundColor: c.color }}
                        aria-hidden="true"
                      />
                      <span className="font-[family-name:var(--font-card)] text-sm uppercase">
                        {c.name}
                      </span>
                      <span className="ml-auto text-xs text-[var(--muted)]">
                        {getQuestionsByCategory(key).length}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="maintained" className="mt-12">
            <h2
              id="maintained"
              className="font-[family-name:var(--font-card)] text-lg font-bold uppercase"
            >
              Under the hood
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              All {QUESTION_COUNT} cards sit in one file, <Code>content/questions.json</Code>. The
              site is built straight from it, so every page here is plain static HTML. No database,
              no loading spinner.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
              <li className="border-l-[3px] border-[var(--rule)] pl-4">
                A card&apos;s URL is set once and kept, so a question can be reworded without
                breaking links to it.
              </li>
              <li className="border-l-[3px] border-[var(--rule)] pl-4">
                A script runs before each build and complains about missing fields, made-up
                categories, or two cards claiming the same URL.
              </li>
              <li className="border-l-[3px] border-[var(--rule)] pl-4">
                When someone suggests a question, their handle goes in the file as{" "}
                <Code>proposedBy</Code> and gets printed on the card.
              </li>
            </ul>
          </section>

          {proposers.length > 0 ? (
            <section aria-labelledby="credits" className="mt-12">
              <h2
                id="credits"
                className="font-[family-name:var(--font-card)] text-lg font-bold uppercase"
              >
                Suggested by
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                {proposedCount} of the {QUESTION_COUNT} cards were someone else&apos;s idea. Thanks
                to:
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {proposers.map((p) => (
                  <li key={p.handle}>
                    <a
                      href={`https://x.com/${p.handle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      {p.handle}
                    </a>
                    <span className="ml-1.5 text-xs text-[var(--muted)]">{p.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="contribute" className="mt-12">
            <h2
              id="contribute"
              className="font-[family-name:var(--font-card)] text-lg font-bold uppercase"
            >
              Found a mistake?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Some answers are shorter than they should be and a few are probably wrong. If you find
              one, or you think of a question the deck is missing,{" "}
              <a
                href={SITE.author.x}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                send me a dm on X
              </a>
              . If your question makes it into the deck, your handle goes on the card.
            </p>
          </section>

          <div className="mt-16 border-t border-[var(--rule)] pt-8">
            <Author />
          </div>
        </main>
      </div>
    </>
  );
}

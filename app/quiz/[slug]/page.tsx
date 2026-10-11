import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Author from "@/components/Author";
import Quiz, { type QuizCard } from "@/components/Quiz";
import { SITE, absoluteUrl } from "@/lib/site";
import { SCHEMA_ID } from "@/lib/schema";
import { CATEGORIES, type QuestionWithSlug } from "@/lib/questions";
import {
  QUESTIONS_PER_QUIZ,
  QUIZZES,
  QUIZ_SLUGS,
  getInitialRun,
  getQuizPool,
  isQuizSlug,
} from "@/lib/quiz";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return QUIZ_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

function toCard(q: QuestionWithSlug): QuizCard {
  return { id: q.id, question: q.question, answer: q.answer, slug: q.slug };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isQuizSlug(slug)) return {};
  const quiz = QUIZZES[slug];
  const title = `${quiz.name}: ${QUESTIONS_PER_QUIZ} Questions with Answers`;
  const description = `A free ${quiz.name.toLowerCase()} with answers. ${quiz.blurb} Reveal each answer, mark yourself and share your score.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/quiz/${slug}` },
    openGraph: { type: "website", title, description, url: absoluteUrl(`/quiz/${slug}`) },
  };
}

export default async function QuizPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!isQuizSlug(slug)) notFound();

  const quiz = QUIZZES[slug];
  const pool = getQuizPool(slug);
  const initial = getInitialRun(slug);
  const color = CATEGORIES[quiz.categories[0]].color;
  const url = absoluteUrl(`/quiz/${slug}`);

  // Google's education Q&A markup: a Quiz made of flashcard Questions.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${url}#quiz`,
    name: quiz.name,
    description: quiz.blurb,
    url,
    educationalLevel: "intermediate",
    about: quiz.categories.map((c) => ({ "@type": "Thing", name: CATEGORIES[c].name })),
    author: { "@type": "Person", "@id": SCHEMA_ID.person, name: SITE.author.name },
    isPartOf: { "@type": "WebSite", "@id": SCHEMA_ID.website },
    hasPart: initial.map((q) => ({
      "@type": "Question",
      eduQuestionType: "Flashcard",
      text: q.question,
      url: absoluteUrl(`/questions/${q.slug}`),
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Quizzes", item: absoluteUrl("/quiz") },
      { "@type": "ListItem", position: 3, name: quiz.name, item: url },
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
              <li><Link href="/quiz" className="underline underline-offset-2 hover:text-[var(--fg)]">Quizzes</Link></li>
            </ol>
          </nav>

          <span className="mb-4 inline-block h-3 w-16" style={{ backgroundColor: color }} aria-hidden="true" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">{quiz.name}</h1>
          <p className="mt-4 max-w-xl leading-relaxed">{quiz.intro}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {QUESTIONS_PER_QUIZ} questions per run, drawn from {pool.length}. Free, no sign-up.
          </p>

          <div className="mt-8">
            <Quiz name={quiz.name} url={url} color={color} initial={initial.map(toCard)} pool={pool.map(toCard)} />
          </div>

          <section aria-labelledby="more" className="mt-14 border-t border-[var(--rule)] pt-8">
            <h2 id="more" className="font-[family-name:var(--font-display)] text-lg">More quizzes</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {QUIZ_SLUGS.filter((s) => s !== slug).map((s) => (
                <Link
                  key={s}
                  href={`/quiz/${s}`}
                  className="border-2 border-black px-3 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white"
                >
                  {QUIZZES[s].name}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-[var(--muted)]">
              Prefer to study than be tested? Every question in this quiz comes from the{" "}
              {quiz.categories.map((c, i) => (
                <span key={c}>
                  {i > 0 ? (i === quiz.categories.length - 1 ? " and " : ", ") : null}
                  <Link href={`/categories/${CATEGORIES[c].slug}`} className="underline underline-offset-2">
                    {CATEGORIES[c].name.toLowerCase()} interview questions
                  </Link>
                </span>
              ))}
              {slug === "ai-history" || slug === "ai" ? (
                <>
                  , and the{" "}
                  <Link href="/ai-history" className="underline underline-offset-2">AI history timeline</Link>{" "}
                  puts them in order
                </>
              ) : null}
              .
            </p>
          </section>

          <div className="mt-16 border-t border-[var(--rule)] pt-8"><Author /></div>
        </main>
      </div>
    </>
  );
}

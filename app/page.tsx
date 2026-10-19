import type { Metadata } from "next";
import GameScreen from "@/components/GameScreen";
import BelowFold from "@/components/BelowFold";
import { SITE, CONTENT_UPDATED, absoluteUrl } from "@/lib/site";
import { PERSON_NODE, WEBSITE_NODE, SCHEMA_ID, ref } from "@/lib/schema";
import { CATEGORIES, CATEGORY_KEYS, QUESTION_COUNT, getAllQuestions } from "@/lib/questions";

export const metadata: Metadata = {
  // Leads with the phrase people actually search; the brand tagline lives on
  // the page and in the Open Graph card.
  title: `${SITE.name} — ${QUESTION_COUNT} Data Science Interview Questions`,
  description: `Free data science flashcards. ${QUESTION_COUNT} questions and answers on machine learning, statistics, deep learning, LLMs, MLOps and the history of AI — practise for interviews or just test yourself.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      WEBSITE_NODE,
      PERSON_NODE,
      {
        "@type": "Quiz",
        "@id": absoluteUrl("/#quiz"),
        name: `${SITE.name} — ${QUESTION_COUNT} data science questions`,
        description: SITE.description,
        url: absoluteUrl("/"),
        numberOfQuestions: QUESTION_COUNT,
        about: CATEGORY_KEYS.map((k) => ({ "@type": "Thing", name: CATEGORIES[k].name })),
        isPartOf: ref(SCHEMA_ID.website),
        author: ref(SCHEMA_ID.person),
        publisher: ref(SCHEMA_ID.person),
        dateModified: CONTENT_UPDATED,
        inLanguage: "en",
        isAccessibleForFree: true,
        learningResourceType: "Flashcards",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GameScreen
        questions={getAllQuestions()}
        heading={`Data Science Trivia — ${QUESTION_COUNT} data science interview questions and answers`}
      >
        <BelowFold />
      </GameScreen>
    </>
  );
}

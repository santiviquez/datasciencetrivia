import type { Metadata } from "next";
import GameScreen from "@/components/GameScreen";
import BelowFold from "@/components/BelowFold";
import { SITE, absoluteUrl } from "@/lib/site";
import { CATEGORIES, CATEGORY_KEYS, QUESTION_COUNT, getAllQuestions } from "@/lib/questions";

export const metadata: Metadata = {
  // Leads with the phrase people actually search; the brand tagline lives on
  // the page and in the Open Graph card.
  title: `${SITE.name} — ${QUESTION_COUNT} Data Science Interview Questions`,
  description: `Free data science flashcards. ${QUESTION_COUNT} questions and answers on machine learning, statistics, deep learning and the history of AI — practise for interviews or just test yourself.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": absoluteUrl("/#person") },
      },
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: SITE.author.name,
        url: SITE.author.x,
        sameAs: [SITE.author.x, SITE.author.linkedin],
      },
      {
        "@type": "Quiz",
        name: `${SITE.name} — ${QUESTION_COUNT} data science questions`,
        description: SITE.description,
        url: absoluteUrl("/"),
        numberOfQuestions: QUESTION_COUNT,
        about: CATEGORY_KEYS.map((k) => ({ "@type": "Thing", name: CATEGORIES[k].name })),
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

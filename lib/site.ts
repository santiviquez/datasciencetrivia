export const SITE = {
  name: "Data Science Trivia",
  url: "https://www.datasciencetrivia.com",
  tagline: "Learn Data Science The Fun Way",
  repo: "https://github.com/santiviquez/datasciencetrivia",
  description:
    "Free data science flashcards. Test your knowledge and prepare for interviews with questions on machine learning, statistics, deep learning, LLMs and the history of AI.",
  author: {
    name: "Santiago Víquez",
    handle: "santiviquez",
    x: "https://x.com/santiviquez",
    linkedin: "https://www.linkedin.com/in/santiagoviquez/",
    github: "https://github.com/santiviquez",
  },
} as const;

/**
 * Date the question set last changed. Hard-coded rather than derived from the
 * build, so <lastmod> doesn't claim every page changed on every deploy — which
 * teaches crawlers to ignore the signal.
 */
export const CONTENT_UPDATED = "2026-10-12";

/**
 * Date /about last changed. Tracked separately from the deck so neither date
 * has to lie about the other when only one of them is edited.
 */
export const ABOUT_UPDATED = "2026-10-11";

/** Absolute URL helper — canonical + Open Graph tags must never be relative. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

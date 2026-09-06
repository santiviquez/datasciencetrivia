export const SITE = {
  name: "Data Science Trivia",
  url: "https://www.datasciencetrivia.com",
  tagline: "Learn Data Science The Fun Way",
  description:
    "Free data science flashcards. Test your knowledge and prepare for interviews with questions on machine learning, statistics, deep learning and the history of AI.",
  author: {
    name: "Santiago Víquez",
    handle: "santiviquez",
    x: "https://x.com/santiviquez",
    linkedin: "https://www.linkedin.com/in/santiagoviquez/",
  },
} as const;

/** Absolute URL helper — canonical + Open Graph tags must never be relative. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

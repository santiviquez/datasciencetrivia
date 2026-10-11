import { SITE, absoluteUrl } from "./site";

/**
 * Stable identifiers for the two entities every page on the site refers to.
 *
 * Pages reference these by `@id` instead of repeating a look-alike copy of the
 * node, which is what lets a crawler merge them into one Person and one WebSite
 * instead of one of each per URL. The Person is anchored on `/about` because
 * that is the page describing them; once published these strings must not move,
 * or the entity a search engine has been accumulating signals for disappears.
 */
export const SCHEMA_ID = {
  website: absoluteUrl("/#website"),
  person: absoluteUrl("/about#person"),
  aboutPage: absoluteUrl("/about#webpage"),
} as const;

/** A pointer to a node defined elsewhere in the same `@graph`. */
export function ref(id: string) {
  return { "@id": id };
}

/**
 * The author, publisher and copyright holder of everything here are the same
 * person. There is no company behind the site, so no Organization is claimed.
 */
export const PERSON_NODE = {
  "@type": "Person",
  "@id": SCHEMA_ID.person,
  name: SITE.author.name,
  alternateName: SITE.author.handle,
  url: absoluteUrl("/about"),
  description: `Started ${SITE.name}, a free deck of data science flashcards, in 2019. Since October 2026 the site runs on autopilot as an experiment, with an AI agent working on it 24/7.`,
  // The deck's five categories, named as topics rather than as UI labels —
  // "History" on its own says nothing outside this site.
  knowsAbout: [
    "Data science",
    "Machine learning",
    "Deep learning",
    "Large language models",
    "Statistics",
    "History of artificial intelligence",
  ],
  sameAs: [SITE.author.x, SITE.author.linkedin, SITE.author.github],
} as const;

export const WEBSITE_NODE = {
  "@type": "WebSite",
  "@id": SCHEMA_ID.website,
  url: absoluteUrl("/"),
  name: SITE.name,
  alternateName: SITE.tagline,
  description: SITE.description,
  inLanguage: "en",
  author: ref(SCHEMA_ID.person),
  publisher: ref(SCHEMA_ID.person),
  copyrightHolder: ref(SCHEMA_ID.person),
} as const;

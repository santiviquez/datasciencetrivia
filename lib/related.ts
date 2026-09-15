/**
 * Ranking for the "More questions" links under every card.
 *
 * Deck order is meaningless as a relevance signal: it is the order the cards
 * were imported in. Following it made every card in a category link to the
 * same first few cards, which wastes the strongest internal-linking surface on
 * the site and leaves most cards with no inbound links at all.
 *
 * So cards are scored by how much vocabulary they share, TF-IDF over the
 * question and answer text with cosine similarity. Document frequency is
 * counted inside the category rather than across the whole deck: on a machine
 * learning hub "model" and "training" say nothing, while on the history hub
 * they are a real signal, and per-category counts get that right for free.
 *
 * Plain similarity alone returns near-duplicates — the four cards that ask
 * about L1 versus L2 in slightly different words — so selection is greedy with
 * a penalty for repeating a card already picked (maximal marginal relevance).
 * The result is a cluster that covers the topic rather than restating it.
 *
 * Everything is derived from the content file at build time, so the output is
 * baked into static HTML and has to be deterministic; every tie breaks on a
 * defined order rather than on whatever the sort happens to do.
 */

/** The fields ranking needs. Kept structural so this module stays standalone. */
export interface RankableCard {
  id: string;
  question: string;
  answer: string;
}

export interface RelatedIndex<T extends RankableCard> {
  related(target: T, limit: number): T[];
}

/**
 * English filler plus the phrasing this deck is written in ("what is", "name
 * three", "true or false"). IDF already discounts them; dropping them keeps
 * them from crowding out the terms that carry the topic.
 */
const STOPWORDS = new Set(
  `a an the this that these those it its is are was were be been being am
   do does did doing done have has had having can could should would will
   shall may might must of in on at to from by for with without within into
   over under about between among across during after before than then so
   such as and or but not no nor if when while where how why what which who
   whom whose you your we our they them their he she his her i me my
   there here also very much more most many any all both each other others
   some one two three four five explain explained name named give given
   call called mean meaning used using use difference true false yes
   know known imagine say said thing type kind way example
   following word term question answer need get got make made take taken
   possible possibly best better good bad happen famous case point`
    .split(/\s+/)
    .filter(Boolean),
);

/** The question is the topic; the answer is supporting evidence. */
const QUESTION_WEIGHT = 2;
const ANSWER_WEIGHT = 1;

/**
 * How hard to penalise a candidate for repeating a card already picked. The
 * penalty is quadratic in the overlap, so it barely touches a card that is
 * merely in the same area and bites hard on one that restates a pick: two
 * rewordings of "L1 or L2?" overlap far more with each other than either does
 * with the rest of the regularization cluster. A linear penalty at any useful
 * strength demoted relevant-but-distinct cards instead.
 */
const DIVERSITY = 0.5;

/** Candidates considered for the diversity pass, as a multiple of the limit. */
const SHORTLIST_FACTOR = 4;

/**
 * Folds the plurals this deck mixes freely ("network"/"networks",
 * "probabilities"/"probability"). Deliberately not a real stemmer: aggressive
 * suffix stripping conflates terms of art here ("boosting" is not "boost").
 */
function fold(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(s|x|ch|sh)es$/.test(word)) return word.slice(0, -2);
  // A trailing "s" only counts as a plural after a consonant or an "e", which
  // leaves the terms that simply end in one alone: bias, analysis, loss.
  if (word.length > 3 && /[bcdefghklmnprtvwyz]s$/.test(word)) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(text: string): string[] {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(fold)
    .filter((t) => !STOPWORDS.has(t));
}

/** Term weights keyed by term, normalised to unit length once built. */
type Vector = Map<string, number>;

function termFrequencies(card: RankableCard): Vector {
  const tf: Vector = new Map();
  const add = (text: string, weight: number) => {
    for (const term of tokenize(text)) {
      tf.set(term, (tf.get(term) ?? 0) + weight);
    }
  };
  add(card.question, QUESTION_WEIGHT);
  add(card.answer, ANSWER_WEIGHT);
  return tf;
}

function cosine(a: Vector, b: Vector): number {
  // Both vectors are unit length, so the dot product is the cosine. Walk the
  // shorter one; most pairs of cards share only a handful of terms.
  const [short, long] = a.size <= b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [term, weight] of short) {
    const other = long.get(term);
    if (other !== undefined) dot += weight * other;
  }
  return dot;
}

export function buildRelatedIndex<T extends RankableCard>(
  cards: T[],
): RelatedIndex<T> {
  const frequencies = cards.map(termFrequencies);

  const documentFrequency = new Map<string, number>();
  for (const tf of frequencies) {
    for (const term of tf.keys()) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const total = cards.length;
  const vectors = new Map<string, Vector>();
  const deckOrder = new Map<string, number>();

  cards.forEach((card, i) => {
    const vector: Vector = new Map();
    let norm = 0;
    for (const [term, tf] of frequencies[i]) {
      const idf = Math.log(1 + total / (documentFrequency.get(term) ?? 1));
      const weight = (1 + Math.log(tf)) * idf;
      if (weight <= 0) continue;
      vector.set(term, weight);
      norm += weight * weight;
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (const [term, weight] of vector) vector.set(term, weight / norm);
    }
    vectors.set(card.id, vector);
    deckOrder.set(card.id, i);
  });

  const empty: Vector = new Map();
  const vectorFor = (id: string) => vectors.get(id) ?? empty;

  return {
    related(target, limit) {
      if (limit <= 0) return [];

      const targetVector = vectorFor(target.id);
      // Cards sharing no vocabulary with the target all score zero, and in a
      // small category there are enough of them to fill out a list. Breaking
      // that tie on the distance *after* the target, wrapping around the deck,
      // spreads those slots across the category instead of handing every one
      // of them to whichever cards happen to be imported first.
      const from = deckOrder.get(target.id) ?? 0;
      const distance = (id: string) =>
        ((deckOrder.get(id) ?? 0) - from + total) % total;

      const scored = cards
        .filter((card) => card.id !== target.id)
        .map((card) => ({
          card,
          similarity: cosine(targetVector, vectorFor(card.id)),
        }))
        .sort(
          (a, b) =>
            b.similarity - a.similarity ||
            distance(a.card.id) - distance(b.card.id),
        );

      // Diversity is only allowed to reorder cards that are relevant in the
      // first place, never to pull in an unrelated one to break up the list.
      const shortlist = scored.slice(0, limit * SHORTLIST_FACTOR);
      const picked: T[] = [];

      while (picked.length < limit && shortlist.length > 0) {
        let bestIndex = 0;
        let bestScore = -Infinity;

        shortlist.forEach((candidate, i) => {
          let overlap = 0;
          for (const chosen of picked) {
            overlap = Math.max(
              overlap,
              cosine(vectorFor(candidate.card.id), vectorFor(chosen.id)),
            );
          }
          const score = candidate.similarity - DIVERSITY * overlap * overlap;
          // Strictly greater, so ties keep the better-ranked candidate.
          if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
          }
        });

        picked.push(shortlist.splice(bestIndex, 1)[0].card);
      }

      return picked;
    },
  };
}

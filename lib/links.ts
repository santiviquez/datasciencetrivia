/**
 * Links in the longer answers. When an explanation names a concept that has
 * its own card ("the confusion matrix", "a p-value", "RLHF"), the first
 * mention on the page links to that card, the way a textbook cross-references
 * a term it defines elsewhere.
 *
 * The terms come from `content/links.json`, card id to the phrases that name
 * it, rather than being guessed from card text: a wrong link teaches a reader
 * the wrong thing, so every term is one a person picked as unambiguous.
 *
 * A term with a capital letter in it (RLHF, Bayes' theorem) only matches with
 * that exact casing; an all-lowercase one matches any casing, so "dropout"
 * also links "Dropout" at the start of a sentence. A plural "s" or "es" is
 * allowed after any term, and the longest term wins where several start at
 * the same place, so "adjusted R-squared" beats "R-squared".
 */

export type Segment = string | { text: string; slug: string };

interface Target {
  id: string;
  slug: string;
}

/** Most links one page gets, so the text never turns into a wall of underlines. */
const MAX_LINKS = 8;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function createLinker(
  cards: { id: string; slug: string }[],
  terms: Record<string, string[]>,
) {
  const slugs = new Map(cards.map((c) => [c.id, c.slug]));
  const byTerm = new Map<string, Target>();
  for (const [id, names] of Object.entries(terms)) {
    const slug = slugs.get(id);
    if (!slug) continue;
    for (const name of names) byTerm.set(name === name.toLowerCase() ? name : `=${name}`, { id, slug });
  }

  const alternatives = [...byTerm.keys()]
    .map((k) => k.replace(/^=/, ""))
    .sort((a, b) => b.length - a.length || a.localeCompare(b))
    .map(escape);
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${alternatives.join("|")})(?:e?s)?(?![\\p{L}\\p{N}])`,
    "giu",
  );

  function lookup(matched: string): Target | undefined {
    return byTerm.get(`=${matched}`) ?? byTerm.get(matched.toLowerCase());
  }

  /**
   * A card's explanation paragraphs, split into text and links. A target is
   * linked once per page, at its first mention, and never to the card itself.
   */
  return function linkParagraphs(selfId: string, paragraphs: string[]): Segment[][] {
    const used = new Set<string>([selfId]);
    return paragraphs.map((para) => {
      const out: Segment[] = [];
      let last = 0;
      pattern.lastIndex = 0;
      for (let m = pattern.exec(para); m; m = pattern.exec(para)) {
        const target = lookup(m[1]);
        if (!target || used.has(target.id) || used.size > MAX_LINKS) continue;
        used.add(target.id);
        if (m.index > last) out.push(para.slice(last, m.index));
        out.push({ text: m[0], slug: target.slug });
        last = m.index + m[0].length;
      }
      if (last < para.length) out.push(para.slice(last));
      return out;
    });
  };
}

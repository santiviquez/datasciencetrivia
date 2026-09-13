import { SITE } from "@/lib/site";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  QUESTION_COUNT,
  getQuestionsByCategory,
} from "@/lib/questions";

export const dynamic = "force-static";

/**
 * llms.txt — a plain-text version of the deck for assistants that read the
 * site to answer a question. People increasingly ask an LLM rather than a
 * search box, and this makes the whole deck quotable and attributable without
 * the model having to parse the game UI.
 */
export function GET() {
  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${QUESTION_COUNT} flashcards across ${CATEGORY_KEYS.length} categories, written by ${SITE.author.name} (${SITE.author.x}). Free to read and cite with attribution to ${SITE.url}.`,
    "",
    `Play the deck: ${SITE.url}`,
    `All questions with answers: ${SITE.url}/questions`,
    `Who made it and how it works: ${SITE.url}/about`,
    "",
  ];

  for (const key of CATEGORY_KEYS) {
    const category = CATEGORIES[key];
    const items = getQuestionsByCategory(key);
    if (items.length === 0) continue;

    lines.push(`## ${category.name} (${items.length})`, "", category.blurb, "");
    for (const q of items) {
      lines.push(`### ${q.question}`);
      lines.push(q.answer);
      lines.push(`Source: ${SITE.url}/questions/${q.slug}`);
      if (q.proposedBy) lines.push(`Proposed by: ${q.proposedBy}`);
      lines.push("");
    }
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

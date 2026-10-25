/**
 * Renders the deck as Markdown files under interview-questions/, one per
 * category plus an index. GitHub is the domain AI assistants cite most for
 * "data science interview questions" prompts, so the repo carries a readable
 * copy of every card that links back to its page on the site.
 *
 * Only the card answers go here. The longer answers stay on the site, so the
 * GitHub copy never competes with a question page for the same text.
 *
 * Shared by scripts/export-questions.mjs, which writes the files, and
 * scripts/check-content.mjs, which fails the build when they are stale.
 * Plain JavaScript for the same reason as check-content.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.datasciencetrivia.com";

export const OUT_DIR = "interview-questions";

/** File name per category; history gets a clearer name than the hub slug. */
const FILE_NAMES = { history: "history-of-ai.md" };

/** Category names, slugs and blurbs, read from lib/questions.ts so they can't drift. */
function readCategories() {
  const source = readFileSync(join(root, "lib", "questions.ts"), "utf8");
  const pattern =
    /\n {2}(\w+): \{\s*slug: "([^"]+)",\s*name: "([^"]+)",[\s\S]*?blurb:\s*"((?:[^"\\]|\\.)*)"/g;
  return [...source.matchAll(pattern)].map(([, key, slug, name, blurb]) => ({
    key,
    slug,
    name,
    blurb: blurb.replace(/\\"/g, '"'),
    file: FILE_NAMES[slug] ?? `${slug}.md`,
  }));
}

/** Escapes the characters that would turn card text into links or emphasis. */
function md(text) {
  return text.replace(/([\\`*_[\]|<>])/g, "\\$1");
}

/** A category name mid-sentence: lowercase words, keep acronyms (AI, MLOps). Mirrors inSentence in lib/questions.ts. */
const inSentence = (name) =>
  name
    .split(" ")
    .map((word) => (/[A-Z].*[A-Z]/.test(word) ? word : word.toLowerCase()))
    .join(" ");

const pageUrl = (q) => `${SITE}/questions/${q.slug}`;

const NOTICE =
  "<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->";

/** The anchor GitHub gives a heading, for the topic contents list. */
const anchor = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/ /g, "-");

function renderCategory(category, cards, topics) {
  const lines = [
    `# ${category.name} interview questions and answers`,
    "",
    NOTICE,
    "",
    `${cards.length} ${inSentence(category.name)} questions with short answers, from [Data Science Trivia](${SITE}), free flashcards for data science and machine learning interviews. ${category.blurb}`,
    "",
    `Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](${SITE}/categories/${category.slug}).`,
    "",
    `[All categories](README.md)`,
  ];

  // Ids that aren't cards of this category are skipped here and reported by
  // check-content, which renders these files before it prints its errors.
  const byId = new Map(cards.map((q) => [q.id, q]));
  const groups = topics.map((t) => ({ ...t, cards: (t.ids ?? []).map((id) => byId.get(id)).filter(Boolean) }));
  lines.push("", "## Topics", "", ...groups.map((t) => `- [${t.name}](#${anchor(t.name)}) (${t.cards.length})`));

  for (const t of groups) {
    lines.push("", `## ${t.name}`, "", md(t.lead));
    for (const q of t.cards) {
      lines.push("", `### ${md(q.title ?? q.question)}`, "");
      // A card with a search title is a statement or a fill-in prompt: show the
      // card itself, since its answer only makes sense next to it.
      if (q.title) lines.push(`> **Flashcard:** ${md(q.question)}`, "");
      lines.push(md(q.answer), "", `[Read the longer answer →](${pageUrl(q)})`);
    }
  }

  lines.push(
    "",
    "---",
    "",
    `Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).`,
    "",
  );
  return lines.join("\n");
}

function renderIndex(categories, cards) {
  const lines = [
    "# Data science interview questions and answers",
    "",
    NOTICE,
    "",
    `${cards.length} questions with short answers on machine learning, deep learning, generative AI, MLOps, statistics and the history of AI. They are the cards of [Data Science Trivia](${SITE}), a free flashcard deck for data science and machine learning interviews, written out so you can read or search them in one place.`,
    "",
    "| Category | Questions | Covers |",
    "|---|---|---|",
    ...categories.map((c) => {
      const count = cards.filter((q) => q.category === c.key).length;
      return `| [${c.name}](${c.file}) | ${count} | ${md(c.blurb)} |`;
    }),
    "",
    `Each question links to its own page on the site, with a longer answer: the mechanism, a worked example and what an interviewer asks next.`,
    "",
    "## Practise instead of reading",
    "",
    `- [Flashcards](${SITE}): guess, flip the card, see how you did.`,
    `- [Quizzes](${SITE}/quiz): ten questions per topic, marked as you go.`,
    `- [History of AI timeline](${SITE}/ai-history): the milestones behind the history cards.`,
    "",
    "---",
    "",
    "These files are generated from [content/questions.json](../content/questions.json) with `npm run export:questions`; corrections and new questions go there.",
    "",
  ];
  return lines.join("\n");
}

/** Every file under interview-questions/, keyed by path relative to the repo root. */
export function renderQuestionFiles() {
  const cards = JSON.parse(readFileSync(join(root, "content", "questions.json"), "utf8"));
  const topics = JSON.parse(readFileSync(join(root, "content", "topics.json"), "utf8"));
  const categories = readCategories();
  const keys = new Set(categories.map((c) => c.key));
  const orphan = cards.find((q) => !keys.has(q.category));
  if (orphan) throw new Error(`questions-markdown: no category "${orphan.category}" found in lib/questions.ts`);
  const files = new Map();
  files.set(`${OUT_DIR}/README.md`, renderIndex(categories, cards));
  for (const c of categories) {
    files.set(
      `${OUT_DIR}/${c.file}`,
      renderCategory(c, cards.filter((q) => q.category === c.key), topics[c.key] ?? []),
    );
  }
  return files;
}

export { root as repoRoot };

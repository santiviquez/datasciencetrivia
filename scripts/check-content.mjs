/**
 * Content integrity gate. Runs in CI and before every deploy: a duplicate slug
 * would silently make one question unreachable, and an unknown category would
 * fail deep inside the card renderer with a much less obvious message.
 *
 * Plain JavaScript on purpose — it must run on whatever Node the build host
 * provides, without type-stripping flags.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { OUT_DIR, renderQuestionFiles } from "./questions-markdown.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(
  readFileSync(join(here, "..", "content", "questions.json"), "utf8"),
);

const VALID_CATEGORIES = new Set(["ml", "dl", "genai", "stats", "history"]);

function slugify(text) {
  const base = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"“”’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length <= 90) return base;
  const cut = base.slice(0, 90);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 40 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

const errors = [];
const seenIds = new Map();
const seenSlugs = new Map();
const seenTitles = new Map();

raw.forEach((q, i) => {
  const at = `questions[${i}]`;
  for (const field of ["id", "category", "question", "answer"]) {
    if (typeof q[field] !== "string" || !q[field].trim()) {
      errors.push(`${at}: missing or empty "${field}"`);
    }
  }

  if (
    q.explanation !== undefined &&
    (!Array.isArray(q.explanation) ||
      q.explanation.length === 0 ||
      q.explanation.some((para) => typeof para !== "string" || !para.trim()))
  ) {
    errors.push(`${at}: "explanation" must be a non-empty list of non-empty paragraphs`);
  }

  if (
    q.updated !== undefined &&
    (typeof q.updated !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(q.updated) ||
      Number.isNaN(Date.parse(q.updated)) ||
      q.updated > new Date().toISOString().slice(0, 10))
  ) {
    errors.push(`${at}: "updated" must be a YYYY-MM-DD date that isn't in the future`);
  }

  // A search title is a question people would type, and two pages sharing a
  // <title> compete with each other for the same searches.
  if (q.title !== undefined) {
    if (typeof q.title !== "string" || !q.title.trim().endsWith("?")) {
      errors.push(`${at}: "title" must be a question ending in "?"`);
    } else if (q.title.length > 75) {
      errors.push(`${at}: "title" is ${q.title.length} characters; keep it to 75 so it fits a search result`);
    }
  }
  const shown = typeof q.title === "string" ? q.title : q.question;
  const title = typeof shown === "string" ? shown.trim().toLowerCase() : "";
  if (title) {
    if (seenTitles.has(title)) {
      errors.push(`${at}: page title "${title}" is also used at index ${seenTitles.get(title)}`);
    }
    seenTitles.set(title, i);
  }

  if (q.category && !VALID_CATEGORIES.has(q.category)) {
    errors.push(`${at}: unknown category "${q.category}"`);
  }
  if (q.id) {
    if (seenIds.has(q.id)) {
      errors.push(`${at}: duplicate id "${q.id}" (also at index ${seenIds.get(q.id)})`);
    }
    seenIds.set(q.id, i);
  }
  if (q.question) {
    // The stored slug is what routing uses; fall back to deriving one.
    const slug = typeof q.slug === "string" && q.slug ? q.slug : slugify(q.question);
    if (!slug) errors.push(`${at}: question produces an empty slug`);
    if (seenSlugs.has(slug)) {
      errors.push(
        `${at}: duplicate slug "${slug}" (also at index ${seenSlugs.get(slug)}) — reword one, or give it an explicit unique "slug"`,
      );
    }
    seenSlugs.set(slug, i);
  }
});

/**
 * Each category hub recommends a handful of cards by id in `lib/questions.ts`.
 * A typo there, or an id that a later edit removed, drops a starter from the
 * hub without anything failing — the same class of silent break the slug check
 * exists for. The ids are read out of the source text rather than imported,
 * because this script deliberately runs without type stripping.
 */
const categorySource = readFileSync(join(here, "..", "lib", "questions.ts"), "utf8");
const starterLists = [...categorySource.matchAll(/starters:\s*\[([^\]]*)\]/g)];

if (starterLists.length !== VALID_CATEGORIES.size) {
  errors.push(
    `lib/questions.ts: found ${starterLists.length} "starters" lists for ${VALID_CATEGORIES.size} categories`,
  );
}
for (const [, list] of starterLists) {
  const ids = [...list.matchAll(/"([^"]+)"/g)].map(([, id]) => id);
  if (ids.length === 0) errors.push(`lib/questions.ts: empty "starters" list`);
  for (const id of ids) {
    if (!seenIds.has(id)) {
      errors.push(`lib/questions.ts: starter "${id}" is not a question id`);
    }
  }
}

/**
 * A redirect from a merged card must land on a live card, and must not shadow
 * one: Next applies redirects before routing, so a "from" that is still a live
 * slug would make that card unreachable.
 */
const redirects = JSON.parse(
  readFileSync(join(here, "..", "content", "redirects.json"), "utf8"),
);
const seenFrom = new Set();
redirects.forEach(({ from, to }, i) => {
  const at = `redirects[${i}]`;
  if (typeof from !== "string" || typeof to !== "string" || !from || !to) {
    errors.push(`${at}: needs non-empty "from" and "to" slugs`);
    return;
  }
  if (seenSlugs.has(from)) errors.push(`${at}: "${from}" is still a live card's slug`);
  if (!seenSlugs.has(to)) errors.push(`${at}: target "${to}" is not a card slug`);
  if (seenFrom.has(from)) errors.push(`${at}: "${from}" is redirected twice`);
  seenFrom.add(from);
});

/**
 * interview-questions/ is generated from the deck. A stale copy would show
 * GitHub readers answers the site has since corrected.
 */
const markdown = renderQuestionFiles();
const onDisk = existsSync(join(here, "..", OUT_DIR)) ? readdirSync(join(here, "..", OUT_DIR)) : [];
const stale = [...markdown].filter(([path, content]) => {
  const file = join(here, "..", path);
  return !existsSync(file) || readFileSync(file, "utf8") !== content;
});
const extra = onDisk.filter((name) => !markdown.has(`${OUT_DIR}/${name}`));
if (stale.length > 0 || extra.length > 0) {
  errors.push(
    `${OUT_DIR}/ is out of date (${[...stale.map(([p]) => p), ...extra].join(", ")}): run npm run export:questions`,
  );
}

if (errors.length > 0) {
  console.error(`content check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `content OK — ${raw.length} questions, ${seenSlugs.size} unique slugs, ${starterLists.length} starter lists, ${redirects.length} redirects, ${markdown.size} Markdown files`,
);

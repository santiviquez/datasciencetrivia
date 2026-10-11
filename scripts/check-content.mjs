/**
 * Content integrity gate. Runs in CI and before every deploy: a duplicate slug
 * would silently make one question unreachable, and an unknown category would
 * fail deep inside the card renderer with a much less obvious message.
 *
 * Plain JavaScript on purpose — it must run on whatever Node the build host
 * provides, without type-stripping flags.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

if (errors.length > 0) {
  console.error(`content check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `content OK — ${raw.length} questions, ${seenSlugs.size} unique slugs, ${starterLists.length} starter lists`,
);

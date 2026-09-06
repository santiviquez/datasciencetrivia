/**
 * Content integrity gate. Run in CI and before every deploy: a duplicate slug
 * would silently make one question unreachable, and an unknown category would
 * crash the card renderer at build time with a much less obvious message.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(
  readFileSync(join(here, "..", "content", "questions.json"), "utf8"),
) as Array<Record<string, unknown>>;

const VALID_CATEGORIES = new Set(["ml", "dl", "stats", "history"]);

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"“”’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 12)
    .join("-");
}

const errors: string[] = [];
const seenIds = new Map<string, number>();
const seenSlugs = new Map<string, number>();

raw.forEach((q, i) => {
  const at = `questions[${i}]`;
  for (const field of ["id", "category", "question", "answer"]) {
    if (typeof q[field] !== "string" || !(q[field] as string).trim()) {
      errors.push(`${at}: missing or empty "${field}"`);
    }
  }
  const id = q.id as string;
  const category = q.category as string;
  const question = q.question as string;

  if (category && !VALID_CATEGORIES.has(category)) {
    errors.push(`${at}: unknown category "${category}"`);
  }
  if (id) {
    if (seenIds.has(id)) errors.push(`${at}: duplicate id "${id}" (also at index ${seenIds.get(id)})`);
    seenIds.set(id, i);
  }
  if (question) {
    const slug = slugify(question);
    if (!slug) errors.push(`${at}: question produces an empty slug`);
    if (seenSlugs.has(slug)) {
      errors.push(`${at}: duplicate slug "${slug}" (also at index ${seenSlugs.get(slug)}) — reword one of the questions`);
    }
    seenSlugs.set(slug, i);
  }
});

if (errors.length > 0) {
  console.error(`content check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`content OK — ${raw.length} questions, ${seenSlugs.size} unique slugs`);

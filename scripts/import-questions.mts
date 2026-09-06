/**
 * Import a question deck into content/questions.json.
 *
 * Written for the day the original Supabase deck comes back. It accepts the
 * shapes that export tool actually produces — a Supabase table export (JSON or
 * CSV), or any array of objects with question/answer/category fields — and
 * normalises them into the repo's content format.
 *
 *   node --experimental-strip-types scripts/import-questions.mts <file> [--merge]
 *
 * Default behaviour replaces the deck. --merge keeps the existing questions and
 * appends only the ones whose slug isn't already present, so re-running an
 * import is safe.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const TARGET = join(here, "..", "content", "questions.json");

const [file, ...flags] = process.argv.slice(2);
const merge = flags.includes("--merge");

if (!file) {
  console.error("usage: import-questions.mts <file.json|file.csv> [--merge]");
  process.exit(1);
}

/** Category aliases seen across the old exports and the current schema. */
const CATEGORY_ALIASES: Record<string, string> = {
  ml: "ml", "machine learning": "ml", "machine-learning": "ml",
  dl: "dl", "deep learning": "dl", "deep-learning": "dl",
  stats: "stats", statistics: "stats", stat: "stats",
  history: "history", hist: "history",
};

function slugify(text: string): string {
  const base = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"\u201c\u201d\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length <= 90) return base;
  const cut = base.slice(0, 90);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 40 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

/** Minimal RFC4180 CSV parser — handles quoted fields containing , and \n. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim() !== ""));
  if (!header) return [];
  return body.map((r) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])),
  );
}

const rawText = readFileSync(file, "utf8");
const records: Record<string, unknown>[] = file.endsWith(".csv")
  ? parseCsv(rawText)
  : JSON.parse(rawText);

if (!Array.isArray(records)) {
  console.error("expected a top-level array of question objects");
  process.exit(1);
}

function pick(rec: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

const skipped: string[] = [];
const imported = records.flatMap((rec, i) => {
  const question = pick(rec, ["question", "Question", "front", "prompt"]);
  const answer = pick(rec, ["answer", "Answer", "back", "response"]);
  const rawCategory = pick(rec, ["category", "Category", "topic", "deck"]).toLowerCase();
  const proposedBy = pick(rec, ["proposed_by", "proposedBy", "author", "credit"]);
  const sourceId = pick(rec, ["id", "Id", "ID"]);

  if (!question || !answer) {
    skipped.push(`row ${i}: missing question or answer`);
    return [];
  }
  const category = CATEGORY_ALIASES[rawCategory];
  if (!category) {
    skipped.push(`row ${i}: unknown category "${rawCategory}" — ${question.slice(0, 50)}`);
    return [];
  }

  return [{
    // Prefer the source's own id: it is unique and stable across re-imports,
    // which keeps saved card ratings attached to the right question.
    id: sourceId ? `${category}-${sourceId}` : `${category}-${slugify(question).slice(0, 40)}`,
    category,
    question,
    answer,
    ...(proposedBy ? { proposedBy } : {}),
  }];
});

const existing = merge
  ? (JSON.parse(readFileSync(TARGET, "utf8")) as Record<string, string>[])
  : [];

/**
 * Slugs are the public URLs, so they must be unique. Two questions can share a
 * slug when they differ only past the length limit; suffix rather than drop, so
 * an import never silently loses a question.
 */
const takenSlugs = new Set(
  existing.map((q) => (q.slug as string) || slugify(q.question)),
);
const takenIds = new Set(existing.map((q) => q.id));

/** In merge mode an already-present question is skipped, so re-running is safe. */
const existingQuestions = new Set(existing.map((q) => q.question));
let alreadyPresent = 0;

const added = imported.flatMap((q) => {
  if (merge && existingQuestions.has(q.question)) {
    alreadyPresent++;
    return [];
  }
  let slug = slugify(q.question);
  if (takenSlugs.has(slug)) {
    let n = 2;
    while (takenSlugs.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }
  takenSlugs.add(slug);

  let id = q.id;
  if (takenIds.has(id)) {
    let n = 2;
    while (takenIds.has(`${id}-${n}`)) n++;
    id = `${id}-${n}`;
  }
  takenIds.add(id);

  return [{ ...q, id, slug }];
});

const result = [...existing, ...added];
writeFileSync(TARGET, `${JSON.stringify(result, null, 2)}\n`);

console.log(`imported ${added.length} question${added.length === 1 ? "" : "s"}` +
  (merge ? ` (merged into ${existing.length} existing → ${result.length} total)` : ` (deck replaced → ${result.length} total)`));
if (alreadyPresent > 0) {
  console.log(`skipped ${alreadyPresent} question(s) already in the deck`);
}
if (skipped.length) {
  console.log(`skipped ${skipped.length} unusable row(s):`);
  for (const s of skipped.slice(0, 20)) console.log(`  - ${s}`);
}
console.log("\nnow run: npm run check:content");

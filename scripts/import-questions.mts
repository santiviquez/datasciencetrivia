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
    id: `${category}-${slugify(question).split("-").slice(0, 6).join("-")}`,
    category,
    question,
    answer,
    ...(proposedBy ? { proposedBy } : {}),
  }];
});

const existing = merge
  ? (JSON.parse(readFileSync(TARGET, "utf8")) as Record<string, string>[])
  : [];

const seen = new Set(existing.map((q) => slugify(q.question)));
const added = imported.filter((q) => {
  const s = slugify(q.question);
  if (seen.has(s)) return false;
  seen.add(s);
  return true;
});

const result = [...existing, ...added];
writeFileSync(TARGET, `${JSON.stringify(result, null, 2)}\n`);

console.log(`imported ${added.length} question${added.length === 1 ? "" : "s"}` +
  (merge ? ` (merged into ${existing.length} existing → ${result.length} total)` : ` (deck replaced → ${result.length} total)`));
if (imported.length - added.length > 0) {
  console.log(`skipped ${imported.length - added.length} duplicate slug(s)`);
}
if (skipped.length) {
  console.log(`skipped ${skipped.length} unusable row(s):`);
  for (const s of skipped.slice(0, 20)) console.log(`  - ${s}`);
}
console.log("\nnow run: npm run check:content");

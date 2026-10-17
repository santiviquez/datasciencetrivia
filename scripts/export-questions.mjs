/**
 * Writes the Markdown copy of the deck to interview-questions/. Run it after
 * editing content/questions.json; check:content fails while it is stale.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT_DIR, renderQuestionFiles, repoRoot } from "./questions-markdown.mjs";

const files = renderQuestionFiles();
const dir = join(repoRoot, OUT_DIR);
mkdirSync(dir, { recursive: true });

// Drop files a renamed or removed category left behind.
for (const name of readdirSync(dir)) {
  if (!files.has(`${OUT_DIR}/${name}`)) rmSync(join(dir, name));
}
for (const [path, content] of files) writeFileSync(join(repoRoot, path), content);

console.log(`wrote ${files.size} files to ${OUT_DIR}/`);

---
name: ai-visibility
description: Measure how often ChatGPT, Gemini, Claude and Perplexity mention or cite datasciencetrivia.com for data science interview and quiz prompts, compared with competitors, and track it over time. Use for the monthly AI-mentions check or to see which sources AI assistants cite for a topic.
---

# AI visibility

Adapted from DataForSEO's `ai-visibility-report` skill for this repo: it calls the
API directly (no MCP connector), runs without questions, uses the live answers
only (no paid mentions-dataset calls), and writes JSON + Markdown instead of a
branded PDF.

## Run

```bash
python3 scripts/seo/ai_visibility.py --dry-run                 # prompts x models, cost estimate
python3 scripts/seo/ai_visibility.py                           # full run
python3 scripts/seo/ai_visibility.py --llms chat_gpt,perplexity --prompts practice-sites,bias-variance
```

- Each prompt in `config.json` goes to each assistant through
  `/v3/ai_optimization/{llm}/llm_responses/live` with web search on. One answer
  costs $0.01–0.05 (billed by tokens; ChatGPT and Claude are the expensive ones), so
  the full 12 × 4 run is about $1–2. `--max-cost` (default $3) is a hard stop.
- **Cadence: monthly.** AI answers move slowly and the account balance is small. Run
  a subset when checking whether a specific page change got picked up.
- Output: `/mnt/project-files/seo/ai-visibility/<date>.json|md` (or `.seo-output/`).
  The Markdown compares with the previous run in the same folder.

## What it measures

Per answer: **mentioned** (a brand name from `config.json` appears in the text),
**cited** (our domain is in the answer's source links or inline links; Gemini's
redirect links are resolved through `direct_url`), the rank at which we appear among
the tracked brands, every cited domain, and our cited URLs. Headline rates and the
visibility score (`0.6 × mention% + 0.4 × citation%`) use **unbranded prompts only**.
Branded prompts check what assistants say about the site itself.

## Reading the results

- `invisible_prompts`: questions where no assistant mentions us. These are content
  targets: a page that answers that question better than the sites in
  `top_cited_domains`.
- `top_cited_domains` / `share_of_voice_unbranded`: which competitors win the
  citations and how. Open their cited pages to see their format.
- `our_cited_pages`: pages that already earn citations. Protect them and link to
  them internally.
- Read the `answer_excerpt` of a few cells before drawing conclusions. The mention
  check is a regex, so read the answer if a result looks surprising.

## Editing the config

Add competitors when they keep showing up in `top_cited_domains`. Change prompts
sparingly, because changing them breaks the month-over-month comparison. Add new
ones instead of rewording old ones. If a model in `models` stops being offered, the
script falls back to the first web-search model for that assistant and says so.

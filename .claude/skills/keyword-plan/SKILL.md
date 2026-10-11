---
name: keyword-plan
description: Turn seed topics into a clustered, prioritized list of pages to write or improve on datasciencetrivia.com, using DataForSEO keyword data joined with our Search Console positions. Use when picking what to write next, building topic clusters, or researching keywords for a category.
---

# Keyword plan

Adapted from DataForSEO's `content-plan-builder` skill for this repo: it calls the
API directly (no MCP connector), runs without questions, and writes data files
instead of a branded PDF.

## 1. Pull the keyword universe

```bash
python3 scripts/seo/keyword_plan.py --seed "machine learning interview questions" \
    --seed "statistics interview questions" --dry-run   # prints worst-case cost
python3 scripts/seo/keyword_plan.py --seed "..." --seed "..."
```

- One `keyword_ideas` call for all seeds, plus `keyword_suggestions` and
  `related_keywords` per seed. Volume, difficulty and intent come back inline; bulk
  difficulty and intent calls only fill gaps.
- Cost is $0.012 per call plus $0.00012 per keyword returned. Two seeds at the
  default limits cost about $0.25. `--max-cost` (default $1.50) is a hard stop.
- Keep seeds to 1–4 per run. Defaults: United States, English, 200 results per
  call, 300 keywords kept.
- Output goes to `/mnt/project-files/seo/keyword-plans/<date>_<seed>.json|csv`
  (or `.seo-output/` when the shared folder is missing). Before spending again,
  check whether a recent file already covers the seed and reuse it.

Each keyword has `volume`, `difficulty` (0–100), `intent`, `cpc`, `opportunity`
(`ln(1+volume) × (100−difficulty)/100`), `gsc_position` / `gsc_impressions` (our
last 28 days, exact-query match) and `closest_card` (the existing flashcard whose
question shares the most topic-specific words with the keyword; a hint to check,
not proof that it's covered).

## 2. Cluster (your judgement, no API)

1. Drop junk: navigational terms for other sites (`geeksforgeeks`, `github`,
   `pdf`), unrelated meanings, and anything we can't credibly answer.
2. Split by intent, then group by theme into topics a writer would recognise, such
   as "Bias-variance tradeoff" or "LLM interview questions". Each cluster maps to
   **one page**: an existing question page, a category page, or a new one.
   Aim for 3+ keywords per cluster and 6–15 clusters; put leftovers in "Long tail".
3. Per cluster: `total_volume`, `avg_difficulty`, `winnability = 100 − avg_difficulty`.

## 3. Prioritize

- `priority = round(100 × ln(1+total_volume)/ln(1+max_total_volume) × winnability/100)`
- **Quick win**: avg difficulty ≤ 30 and volume ≥ the median cluster.
  **Strategic**: volume ≥ median, difficulty > 30. **Fill**: everything else.
- Boost clusters where we already rank 8–30 in Search Console (`gsc_position`):
  pushing a page-2 page onto page 1 usually beats starting a new page.
- Prefer improving an existing page (`closest_card`, category pages under
  `app/categories`) over creating a near-duplicate.

## 4. Turn it into work

For the top cluster, name the target page, the primary keyword, the 3–5 secondary
keywords it should answer, and the internal links (pillar ↔ supporting pages, and
the category page). That is the brief for the day's PR. Save the clustered plan
next to the raw data as `<date>_<seed>_plan.md` so later runs can pick the next
cluster without paying for the same data again.

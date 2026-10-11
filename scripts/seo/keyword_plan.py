"""Expand seed topics into a scored keyword universe for datasciencetrivia.com.

Pulls keyword ideas, suggestions and related searches from DataForSEO Labs, keeps
the volume, difficulty and intent that come back inline (bulk calls only fill
gaps), joins our own Search Console positions, and points at the closest
existing flashcard. Clustering and the roadmap are left to the caller
(see .claude/skills/keyword-plan/SKILL.md).

    python3 scripts/seo/keyword_plan.py --seed "machine learning interview questions" \
        --seed "statistics interview questions" --dry-run
"""

import argparse
import csv
import datetime as dt
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dataforseo import Spend, balance, dfs, gsc_queries  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LABS = "/dataforseo_labs/google"
PER_REQUEST, PER_RESULT = 0.012, 0.00012
# Field-level words every card shares; matching on them alone says nothing.
GENERIC = set(
    "machine learning data science scientist deep ai artificial intelligence ml statistics "
    "statistical model models algorithm algorithms interview interviews questions question "
    "quiz trivia answers answer basics engineer engineering".split()
)
STOP = set(
    "a an and are as at be by can do does for from how i in is it of on or the to vs what "
    "when where which who why with you your".split()
)


def tokens(text):
    return {t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in STOP}


def labs_cost(limit):
    return PER_REQUEST + PER_RESULT * limit


def flatten(item, source):
    """Normalise a Labs item (ideas/suggestions shape, or related_keywords' keyword_data)."""
    kd = item.get("keyword_data", item)
    info = kd.get("keyword_info") or {}
    props = kd.get("keyword_properties") or {}
    intent = kd.get("search_intent_info") or {}
    return {
        "keyword": kd["keyword"].strip().lower(),
        "volume": info.get("search_volume"),
        "cpc": info.get("cpc"),
        "difficulty": props.get("keyword_difficulty"),
        "intent": intent.get("main_intent"),
        "sources": [source],
    }


def expand(seeds, args, spend):
    found = []
    base = {"location_name": args.location, "language_code": args.lang}
    calls = [("ideas", "/keyword_ideas/live", {"keywords": seeds[:200]})]
    for s in seeds:
        calls.append(("suggestions", "/keyword_suggestions/live", {"keyword": s}))
        calls.append(("related", "/related_keywords/live", {"keyword": s, "depth": 1}))
    for source, path, extra in calls:
        spend.check(labs_cost(args.limit))
        task = dfs(LABS + path, {**base, **extra, "limit": args.limit}, spend)
        items = (task.get("result") or [{}])[0].get("items") or []
        found += [flatten(i, source) for i in items]
        print(f"  {source:<11} {extra.get('keyword', 'all seeds')!r}: {len(items)} keywords", file=sys.stderr)
    return found


def dedupe(rows, universe):
    merged = {}
    for r in rows:
        k = r["keyword"]
        if len(k) < 3:
            continue
        if k not in merged:
            merged[k] = r
            continue
        m = merged[k]
        m["sources"] = sorted(set(m["sources"] + r["sources"]))
        for f in ("volume", "cpc", "difficulty", "intent"):
            if m.get(f) is None:
                m[f] = r.get(f)
        if (r.get("volume") or 0) > (m.get("volume") or 0):
            m["volume"] = r["volume"]
    out = sorted(merged.values(), key=lambda r: r.get("volume") or 0, reverse=True)
    return out[:universe]


def fill_gaps(rows, args, spend):
    missing_kd = [r["keyword"] for r in rows if r.get("difficulty") is None]
    missing_int = [r["keyword"] for r in rows if r.get("intent") is None]
    by_kw = {r["keyword"]: r for r in rows}
    for i in range(0, len(missing_kd), 1000):
        chunk = missing_kd[i : i + 1000]
        spend.check(labs_cost(len(chunk)))
        t = dfs(LABS + "/bulk_keyword_difficulty/live",
                {"keywords": chunk, "location_name": args.location, "language_code": args.lang}, spend)
        for it in (t.get("result") or [{}])[0].get("items") or []:
            by_kw[it["keyword"].lower()]["difficulty"] = it.get("keyword_difficulty")
    for i in range(0, len(missing_int), 1000):
        chunk = missing_int[i : i + 1000]
        spend.check(labs_cost(len(chunk)))
        t = dfs(LABS + "/search_intent/live", {"keywords": chunk, "language_code": args.lang}, spend)
        for it in (t.get("result") or [{}])[0].get("items") or []:
            by_kw[it["keyword"].lower()]["intent"] = (it.get("keyword_intent") or {}).get("label")
    return len(missing_kd), len(missing_int)


def coverage(rows):
    """Closest existing flashcard per keyword (Jaccard overlap with the question text).

    Field words (GENERIC) are ignored, so "pca machine learning" matches a PCA card, not
    any card that says "machine learning". A hint, not a verdict: check before writing.
    """
    with open(os.path.join(REPO, "content", "questions.json")) as f:
        questions = json.load(f)
    qtok = [(q, tokens(q["question"]) - GENERIC) for q in questions]
    for r in rows:
        kt = tokens(r["keyword"]) - GENERIC
        best, score = None, 0.0
        for q, t in qtok:
            if kt and t:
                s = len(kt & t) / len(kt | t)
                if s > score:
                    best, score = q, s
        r["closest_card"] = f"/questions/{best['slug']}" if best and score >= 0.5 else None
        r["card_overlap"] = round(score, 2) if r["closest_card"] else None


def score(rows):
    for r in rows:
        vol, kd = r.get("volume") or 0, r.get("difficulty")
        win = 100 - (kd if kd is not None else 50)
        r["opportunity"] = round(math.log1p(vol) * win / 100, 2)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--seed", action="append", required=True, help="seed topic; repeat for several")
    p.add_argument("--location", default="United States")
    p.add_argument("--lang", default="en")
    p.add_argument("--limit", type=int, default=200, help="results per expansion call")
    p.add_argument("--universe", type=int, default=300, help="keywords kept after dedupe")
    p.add_argument("--max-cost", type=float, default=1.50, help="hard DataForSEO spend cap in USD")
    p.add_argument("--no-gsc", action="store_true", help="skip the Search Console join")
    p.add_argument("--out-dir", default=None)
    p.add_argument("--dry-run", action="store_true", help="print the cost estimate and exit")
    args = p.parse_args()

    seeds = [s.strip().lower() for s in args.seed if s.strip()]
    n_calls = 1 + 2 * len(seeds)
    est = n_calls * labs_cost(args.limit) + labs_cost(args.universe)
    print(f"Plan: {n_calls} expansion calls x limit {args.limit}, universe {args.universe}. "
          f"Worst-case cost ~${est:.2f} (cap ${args.max_cost:.2f}).", file=sys.stderr)
    if args.dry_run:
        return

    spend = Spend(args.max_cost)
    start_balance = balance()
    rows = dedupe(expand(seeds, args, spend), args.universe)
    if not rows:
        raise SystemExit("Expansion returned no keywords; try broader seeds.")
    gaps = fill_gaps(rows, args, spend)
    coverage(rows)
    if not args.no_gsc:
        end = dt.date.today() - dt.timedelta(days=3)
        gsc = gsc_queries((end - dt.timedelta(days=27)).isoformat(), end.isoformat())
        for r in rows:
            g = gsc.get(r["keyword"])
            r["gsc_position"] = round(g["position"], 1) if g else None
            r["gsc_impressions"] = g["impressions"] if g else None
    score(rows)
    rows.sort(key=lambda r: r["opportunity"], reverse=True)

    out_dir = args.out_dir or (
        "/mnt/project-files/seo/keyword-plans" if os.path.isdir("/mnt/project-files")
        else os.path.join(REPO, ".seo-output", "keyword-plans"))
    os.makedirs(out_dir, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", seeds[0]).strip("-")[:50]
    stem = os.path.join(out_dir, f"{dt.date.today().isoformat()}_{slug}")
    meta = {"seeds": seeds, "location": args.location, "language": args.lang,
            "date": dt.date.today().isoformat(), "keywords": len(rows),
            "gap_fill_calls": {"difficulty": gaps[0], "intent": gaps[1]},
            "cost_usd": round(spend.total, 4), "balance_before": start_balance}
    with open(stem + ".json", "w") as f:
        json.dump({"meta": meta, "keywords": rows}, f, indent=1)
    cols = ["keyword", "volume", "difficulty", "intent", "cpc", "opportunity",
            "closest_card", "card_overlap", "gsc_position", "gsc_impressions", "sources"]
    with open(stem + ".csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({**r, "sources": "+".join(r["sources"])})

    print(f"\n{len(rows)} keywords, cost ${spend.total:.3f}. Saved {stem}.json / .csv\n")
    print(f"{'keyword':<55}{'vol':>7}{'kd':>4}  {'intent':<14}{'opp':>5}  gsc  closest card")
    for r in rows[:40]:
        print(f"{r['keyword'][:54]:<55}{r.get('volume') or 0:>7}{r['difficulty'] if r['difficulty'] is not None else '-':>4}  "
              f"{(r.get('intent') or '-'):<14}{r['opportunity']:>5}  {r.get('gsc_position') or '-':>4}  {r['closest_card'] or ''}")


if __name__ == "__main__":
    main()

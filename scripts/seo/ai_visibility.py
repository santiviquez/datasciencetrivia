"""Measure whether AI assistants mention and cite datasciencetrivia.com.

Sends each prompt in the config to ChatGPT, Gemini, Claude and Perplexity (with
web search) through DataForSEO's LLM Responses API, then records per answer
whether the brand is mentioned, whether our domain is cited, which other sites
are cited, and how competitors fare in the same answers. Writes a JSON and a
Markdown summary and compares with the previous run.

    python3 scripts/seo/ai_visibility.py --dry-run
    python3 scripts/seo/ai_visibility.py --llms chat_gpt,perplexity --prompts practice-sites
"""

import argparse
import datetime as dt
import glob
import json
import os
import re
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dataforseo import Spend, balance, dfs  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_CONFIG = os.path.join(REPO, ".claude", "skills", "ai-visibility", "config.json")
LLMS = ["chat_gpt", "gemini", "claude", "perplexity"]
EST_PER_CELL = 0.05  # flagship model + web search; one ChatGPT probe cost $0.042


def host(url):
    h = urllib.parse.urlparse(url).hostname or ""
    return h[4:] if h.startswith("www.") else h


def resolve_redirect(url):
    """Gemini cites vertexaisearch grounding redirects; follow one hop to the real host."""
    if "grounding-api-redirect" not in url:
        return url

    class NoFollow(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    try:
        opener = urllib.request.build_opener(NoFollow)
        opener.open(urllib.request.Request(url, method="HEAD"), timeout=10)
    except urllib.error.HTTPError as e:
        if e.headers.get("Location"):
            return e.headers["Location"]
    except Exception:
        pass
    return url


def name_pattern(names, flags=re.I):
    return re.compile(r"(?<![\w.])(" + "|".join(re.escape(n) for n in names) + r")(?![\w])", flags)


QUIZ_WORDS = {"quiz", "quizzes", "question", "questions", "game", "games", "night", "deck", "set"}


def find_mention(text, names, generic):
    """First brand mention in text. Names in `generic` are also ordinary phrases
    ("a data science trivia quiz", "BrainPickle's Data Science Trivia Quiz"), so they
    only count when written in title case as a standalone name, not as part of another
    product's title."""
    m = name_pattern([n for n in names if n not in generic]).search(text) if set(names) - set(generic) else None
    for g in name_pattern(generic, 0).finditer(text) if generic else []:
        before = text[: g.start()].rstrip(" *_[\"“'")
        prev = before.split()[-1].lstrip("*_([\"“'") if before.split() else ""
        nxt = re.match(r"[\s*_\]\"”']*(\w+)", text[g.end():])
        sentence_start = not prev or prev.endswith((".", ":", "|", "!", "?"))
        if (prev[:1].isupper() and not sentence_start) or prev.endswith(("'s", "’s")):
            continue
        if nxt and nxt.group(1).lower() in QUIZ_WORDS:
            continue
        if m is None or g.start() < m.start():
            m = g
        break
    return m


def pick_model(llm, wanted):
    models = dfs(f"/ai_optimization/{llm}/llm_responses/models")["result"]
    names = [m["model_name"] for m in models if m.get("web_search_supported")]
    if wanted in names:
        return wanted
    print(f"  {llm}: {wanted!r} unavailable, using {names[0]!r}", file=sys.stderr)
    return names[0]


def classify(text, urls, cfg):
    b = cfg["brand"]
    entities = [{"name": b["names"][0], "names": b["names"], "generic": b.get("generic_names", []),
                 "domain": b["domain"], "brand": True}]
    entities += [{"name": c["name"], "names": [c["name"], c["domain"]], "generic": c.get("generic_names", []),
                  "domain": c["domain"], "brand": False} for c in cfg["competitors"]]
    hosts = [host(u) for u in urls]
    found = []
    for e in entities:
        m = find_mention(text, e["names"], e["generic"])
        cited = any(h == e["domain"] or h.endswith("." + e["domain"]) for h in hosts)
        cited = cited or e["domain"] in text.lower()
        if m or cited:
            found.append({"name": e["name"], "brand": e["brand"], "mentioned": bool(m),
                          "cited": cited, "first_at": m.start() if m else len(text)})
    found.sort(key=lambda f: f["first_at"])
    for rank, f in enumerate(found, 1):
        f["rank"] = rank
        del f["first_at"]
    return found


def run_cell(llm, model, prompt, cfg, spend):
    spend.check(EST_PER_CELL)
    t = dfs(f"/ai_optimization/{llm}/llm_responses/live",
            {"user_prompt": prompt["text"], "model_name": model, "web_search": True}, spend)
    r = t["result"][0]
    text, urls = [], []
    for it in r.get("items") or []:
        if it.get("type") != "message":
            continue
        for s in it.get("sections") or []:
            text.append(s.get("text") or "")
            # Gemini annotations carry the real target in direct_url.
            urls += [a.get("direct_url") or a["url"] for a in (s.get("annotations") or []) if a.get("url")]
    text = "\n".join(text)
    # Links written inline in the answer text count as citations too.
    urls += [u.rstrip(".,;:") for u in re.findall(r"https?://[^\s)\]>\"'*]+", text)]
    urls = list(dict.fromkeys(resolve_redirect(u) for u in urls))
    entities = classify(text, urls, cfg)
    brand = next((e for e in entities if e["brand"]), None)
    return {
        "llm": llm, "model": model, "prompt_id": prompt["id"], "prompt_type": prompt["type"],
        "mentioned": bool(brand and brand["mentioned"]), "cited": bool(brand and brand["cited"]),
        "brand_rank": brand["rank"] if brand else None,
        "brands_in_answer": entities,
        "cited_domains": sorted({host(u) for u in urls}),
        "our_cited_urls": [u.split("?")[0] for u in urls if host(u) == cfg["brand"]["domain"]],
        "unresolved_redirects": sum("grounding-api-redirect" in u for u in urls),
        "fan_out_queries": r.get("fan_out_queries"),
        "cost": r.get("money_spent"),
        "answer_excerpt": text[:3000],
    }


def summarise(cells, cfg):
    measured = [c for c in cells if "error" not in c]
    unb = [c for c in measured if c["prompt_type"] == "unbranded"]
    pct = lambda n, d: round(100 * n / d, 1) if d else None  # noqa: E731
    s = {
        "cells_total": len(cells), "cells_measured": len(measured),
        "unbranded_cells": len(unb),
        "mention_rate": pct(sum(c["mentioned"] for c in unb), len(unb)),
        "citation_rate": pct(sum(c["cited"] for c in unb), len(unb)),
    }
    if s["mention_rate"] is not None:
        s["ai_visibility_score"] = round(0.6 * s["mention_rate"] + 0.4 * s["citation_rate"], 1)
    s["by_llm"] = {}
    for llm in sorted({c["llm"] for c in unb}):
        cs = [c for c in unb if c["llm"] == llm]
        s["by_llm"][llm] = {"cells": len(cs), "mention_rate": pct(sum(c["mentioned"] for c in cs), len(cs)),
                            "citation_rate": pct(sum(c["cited"] for c in cs), len(cs))}
    s["by_prompt"] = {}
    for c in measured:
        p = s["by_prompt"].setdefault(c["prompt_id"], {"type": c["prompt_type"], "mentioned_by": [], "cited_by": []})
        if c["mentioned"]:
            p["mentioned_by"].append(c["llm"])
        if c["cited"]:
            p["cited_by"].append(c["llm"])
    s["invisible_prompts"] = [k for k, v in s["by_prompt"].items() if v["type"] == "unbranded" and not v["mentioned_by"] and not v["cited_by"]]
    sov = {}
    for c in unb:
        for e in c["brands_in_answer"]:
            row = sov.setdefault(e["name"], {"mentions": 0, "citations": 0})
            row["mentions"] += e["mentioned"]
            row["citations"] += e["cited"]
    s["share_of_voice_unbranded"] = dict(sorted(sov.items(), key=lambda kv: -kv[1]["mentions"]))
    dom = {}
    for c in unb:
        for d in c["cited_domains"]:
            dom[d] = dom.get(d, 0) + 1
    s["top_cited_domains"] = sorted(dom.items(), key=lambda kv: -kv[1])[:20]
    s["our_cited_pages"] = sorted({u for c in measured for u in c["our_cited_urls"]})
    return s


def markdown(meta, s, prev):
    def delta(key):
        if not prev or prev.get(key) is None or s.get(key) is None:
            return ""
        d = round(s[key] - prev[key], 1)
        return f" ({'+' if d >= 0 else ''}{d} vs {prev['_date']})"

    lines = [f"# AI visibility, {meta['date']}", "",
             f"{s['cells_measured']}/{s['cells_total']} answers measured, cost ${meta['cost_usd']:.2f}. "
             f"Models: {', '.join(f'{k} {v}' for k, v in meta['models'].items())}.", "",
             "## Unbranded prompts", "",
             f"- Mentioned in {s['mention_rate']}% of answers{delta('mention_rate')}",
             f"- Cited in {s['citation_rate']}% of answers{delta('citation_rate')}",
             f"- AI visibility score {s.get('ai_visibility_score')}{delta('ai_visibility_score')} (0.6 x mention + 0.4 x citation)",
             "", "| LLM | Mention % | Citation % |", "|---|---|---|"]
    lines += [f"| {k} | {v['mention_rate']} | {v['citation_rate']} |" for k, v in s["by_llm"].items()]
    lines += ["", "| Prompt | Type | Mentioned by | Cited by |", "|---|---|---|---|"]
    lines += [f"| {k} | {v['type']} | {', '.join(v['mentioned_by']) or '-'} | {', '.join(v['cited_by']) or '-'} |"
              for k, v in s["by_prompt"].items()]
    lines += ["", "## Share of voice (unbranded answers)", "", "| Site | Mentions | Citations |", "|---|---|---|"]
    lines += [f"| {k} | {v['mentions']} | {v['citations']} |" for k, v in s["share_of_voice_unbranded"].items()]
    lines += ["", "## Most-cited domains", ""] + [f"- {d}: {n}" for d, n in s["top_cited_domains"]]
    lines += ["", "## Our pages that got cited", ""] + ([f"- {u}" for u in s["our_cited_pages"]] or ["- none"])
    return "\n".join(lines) + "\n"


def rescore(path, cfg):
    """Re-run classify() over a saved run's answer excerpts, e.g. after a matching fix."""
    with open(path) as f:
        run = json.load(f)
    for c in run["cells"]:
        if "error" in c:
            continue
        urls = ["https://" + d + "/" for d in c["cited_domains"]] + c["our_cited_urls"]
        entities = classify(c["answer_excerpt"], urls, cfg)
        brand = next((e for e in entities if e["brand"]), None)
        c.update(mentioned=bool(brand and brand["mentioned"]), cited=bool(brand and brand["cited"]),
                 brand_rank=brand["rank"] if brand else None, brands_in_answer=entities)
    run["summary"] = summarise(run["cells"], cfg)
    run["meta"]["rescored"] = dt.date.today().isoformat()
    with open(path, "w") as f:
        json.dump(run, f, indent=1)
    md = markdown(run["meta"], run["summary"], None)
    with open(path[:-5] + ".md", "w") as f:
        f.write(md)
    print(md)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--config", default=DEFAULT_CONFIG)
    p.add_argument("--llms", default=",".join(LLMS), help="comma list of " + ", ".join(LLMS))
    p.add_argument("--prompts", default=None, help="comma list of prompt ids (default: all)")
    p.add_argument("--max-cost", type=float, default=3.00, help="hard DataForSEO spend cap in USD")
    p.add_argument("--out-dir", default=None)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--rescore", metavar="JSON", help="re-classify a saved run with the current rules (no API calls)")
    args = p.parse_args()

    with open(args.config) as f:
        cfg = json.load(f)
    if args.rescore:
        return rescore(args.rescore, cfg)
    llms = [x for x in args.llms.split(",") if x]
    prompts = cfg["prompts"]
    if args.prompts:
        keep = set(args.prompts.split(","))
        prompts = [q for q in prompts if q["id"] in keep]
    n = len(llms) * len(prompts)
    print(f"Plan: {len(prompts)} prompts x {len(llms)} LLMs = {n} answers, "
          f"~${n * EST_PER_CELL:.2f} (cap ${args.max_cost:.2f}).", file=sys.stderr)
    if args.dry_run:
        return

    spend = Spend(args.max_cost)
    start_balance = balance()
    models = {llm: pick_model(llm, cfg["models"].get(llm, "")) for llm in llms}
    cells = []
    for q in prompts:
        for llm in llms:
            try:
                cells.append(run_cell(llm, models[llm], q, cfg, spend))
                c = cells[-1]
                print(f"  {q['id']:<18} {llm:<11} mentioned={c['mentioned']!s:<5} cited={c['cited']}", file=sys.stderr)
            except SystemExit:
                raise
            except Exception as e:  # one retry, then record as not measured
                try:
                    cells.append(run_cell(llm, models[llm], q, cfg, spend))
                except SystemExit:
                    raise
                except Exception:
                    cells.append({"llm": llm, "prompt_id": q["id"], "prompt_type": q["type"], "error": str(e)})
                    print(f"  {q['id']:<18} {llm:<11} FAILED: {e}", file=sys.stderr)

    out_dir = args.out_dir or (
        "/mnt/project-files/seo/ai-visibility" if os.path.isdir("/mnt/project-files")
        else os.path.join(REPO, ".seo-output", "ai-visibility"))
    os.makedirs(out_dir, exist_ok=True)
    today = dt.date.today().isoformat()
    prev = None
    earlier = sorted(f for f in glob.glob(os.path.join(out_dir, "*.json")) if os.path.basename(f)[:10] < today)
    if earlier:
        with open(earlier[-1]) as f:
            prev = json.load(f)["summary"]
        prev["_date"] = os.path.basename(earlier[-1])[:10]
    meta = {"date": today, "models": models, "llms": llms, "prompt_ids": [q["id"] for q in prompts],
            "cost_usd": round(spend.total, 4), "balance_before": start_balance}
    summary = summarise(cells, cfg)
    stem = os.path.join(out_dir, today)
    with open(stem + ".json", "w") as f:
        json.dump({"meta": meta, "summary": summary, "cells": cells}, f, indent=1)
    md = markdown(meta, summary, prev)
    with open(stem + ".md", "w") as f:
        f.write(md)
    print(md)
    print(f"Saved {stem}.json / .md")


if __name__ == "__main__":
    main()

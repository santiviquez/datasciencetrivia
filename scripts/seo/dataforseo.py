"""Tiny DataForSEO + Search Console client for the SEO skills in .claude/skills.

In Claude cloud sessions both APIs are authenticated by the egress proxy, so no
keys are read here. Locally, set DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD and
GSC_ACCESS_TOKEN instead. Standard library only.
"""

import base64
import json
import os
import urllib.parse
import urllib.request

DFS_BASE = "https://api.dataforseo.com/v3"
GSC_PROPERTY = "sc-domain:datasciencetrivia.com"


class Spend:
    """Running total of DataForSEO cost, with a hard cap."""

    def __init__(self, cap):
        self.cap = cap
        self.total = 0.0

    def add(self, cost):
        self.total += cost or 0.0

    def check(self, next_estimate=0.0):
        if self.total + next_estimate > self.cap:
            raise SystemExit(
                f"Stopping: spend ${self.total:.3f} + next call ~${next_estimate:.3f} "
                f"would exceed the ${self.cap:.2f} cap (raise it with --max-cost)."
            )


def _request(url, body=None, headers=None, timeout=180):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("Content-Type", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def _dfs_headers():
    login, pw = os.environ.get("DATAFORSEO_LOGIN"), os.environ.get("DATAFORSEO_PASSWORD")
    if login and pw:
        return {"Authorization": "Basic " + base64.b64encode(f"{login}:{pw}".encode()).decode()}
    return {}


def dfs(path, task=None, spend=None):
    """Call a DataForSEO v3 endpoint with one task; return tasks[0] (raises on error)."""
    url = DFS_BASE + path
    resp = _request(url, None if task is None else [task], _dfs_headers())
    if spend is not None:
        spend.add(resp.get("cost"))
    if resp.get("status_code") != 20000:
        raise RuntimeError(f"{path}: {resp.get('status_code')} {resp.get('status_message')}")
    t = resp["tasks"][0]
    if t.get("status_code") != 20000:
        raise RuntimeError(f"{path}: {t.get('status_code')} {t.get('status_message')}")
    return t


def balance():
    t = dfs("/appendix/user_data")
    return t["result"][0]["money"]["balance"]


def gsc_queries(start, end, row_limit=25000):
    """Search Console rows by query for the site: {query: {clicks, impressions, ctr, position}}."""
    headers = {}
    if os.environ.get("GSC_ACCESS_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GSC_ACCESS_TOKEN"]
    url = (
        "https://searchconsole.googleapis.com/webmasters/v3/sites/"
        + urllib.parse.quote(GSC_PROPERTY, safe="")
        + "/searchAnalytics/query"
    )
    body = {"startDate": start, "endDate": end, "dimensions": ["query"], "rowLimit": row_limit}
    rows = _request(url, body, headers).get("rows", [])
    return {
        r["keys"][0].lower(): {k: r[k] for k in ("clicks", "impressions", "ctr", "position")}
        for r in rows
    }

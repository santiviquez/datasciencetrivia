/**
 * Tells IndexNow engines (Bing, Yandex, Seznam, Naver and others; Google does
 * not take part) that every URL in the live sitemap may have changed, so they
 * recrawl without waiting for their own schedule. Bing's index also feeds
 * Copilot and is one input to ChatGPT search.
 *
 * The key is public by design: engines verify ownership by fetching
 * /<key>.txt from the site, which lives in public/.
 *
 * Runs from .github/workflows/indexnow.yml after each push to master.
 */
const SITE = "https://www.datasciencetrivia.com";
const KEY = "0dcf584373f41541f6bf4e90b374ae87";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml returned ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("No URLs found in sitemap.xml");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 and 202 both mean accepted; 403 means the key file isn't live yet.
console.log(`IndexNow: submitted ${urlList.length} URLs, status ${res.status}`);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}

# Data Science Trivia

Flashcards for data science interviews and idle curiosity, at
[datasciencetrivia.com](https://www.datasciencetrivia.com).

Machine learning, statistics, deep learning and the history of AI. Arrow keys to
move, `A` to reveal, `E`/`N`/`H` to rate a card, `S` to reshuffle.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- Deployed on **Vercel**

Every route is prerendered at build time. There is no database, no API and no
runtime data fetching.

## Why there's no database

The site originally read its cards from Supabase in the browser on every page
load. When that project went away the fetch failed, an empty `catch` swallowed
the error, and the page crashed for every visitor.

The questions are now plain content in `content/questions.json`, committed to
the repo and baked into static HTML at build time. That removes the outage
class entirely, puts every answer in the HTML where search engines and AI
crawlers can read it, and drops the API keys the browser used to ship.

## Content

All questions live in `content/questions.json`:

```json
{
  "id": "ml-ensemble-learning",
  "category": "ml",
  "question": "What is ensemble learning?",
  "answer": "Combining individual models together with the purpose of improving the predictive power of the model.",
  "slug": "what-is-ensemble-learning",
  "proposedBy": "@optional_handle"
}
```

`category` must be one of `ml`, `dl`, `stats`, `history`. `slug` is the page's
URL and is written once at import time, so rewording a question does not break
its link. Omit it and one is derived from the question text.

### Adding questions

Edit `content/questions.json`, then:

```bash
npm run check:content
```

This validates required fields, category names, and — importantly — that no two
questions share a URL slug. It runs automatically before every build.

### Importing a deck

To bring in an export (a Supabase table dump, an Anki export converted to CSV,
or any array of objects with question/answer/category fields):

```bash
npm run import:questions -- path/to/export.csv --merge
npm run check:content
```

Accepts JSON or CSV. Maps common column names (`question`/`front`/`prompt`,
`answer`/`back`, `category`/`topic`) and category aliases (`Machine Learning`
→ `ml`). `--merge` appends only questions whose slug isn't already present, so
re-running is safe. Without `--merge` it replaces the deck.

## Development

Needs Node 20.9 or newer. Vercel builds on Node 24, set in the project's
settings rather than in `engines`, so the build version never changes on its
own when a new major is released.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # content check + production build
npm run lint
npm run typecheck
```

## SEO

- A static page per question at `/questions/<slug>` with `QAPage` structured data
- Category hubs at `/categories/<slug>` with `FAQPage` structured data
- A full deck listing at `/questions`
- `sitemap.xml` and `robots.txt` generated from the content file
- Per-question Open Graph images generated at build time

## Security

Response headers are set in `next.config.ts`: CSP, HSTS, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.

`script-src` allows `'unsafe-inline'` because Next streams its RSC payload
through inline script tags; a nonce would require rendering every page
dynamically. The site takes no user input, reflects no query parameters, and has
no auth, cookies or database, so there is no injection path that inline script
would be the vector for.

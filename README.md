<p align="center">
  <a href="https://www.datasciencetrivia.com">
    <img src="https://www.datasciencetrivia.com/opengraph-image" alt="Data Science Trivia: flashcards on machine learning, deep learning, generative AI, statistics and the history of AI" width="720">
  </a>
</p>

<h1 align="center">Data Science Trivia</h1>

<p align="center">
  Free flashcards for data science and machine learning interviews.<br>
  Guess, flip the card, see how you did. No sign-up, no paywall.
</p>

<p align="center">
  <a href="https://www.datasciencetrivia.com"><img src="https://img.shields.io/badge/play-datasciencetrivia.com-72D0EA?style=flat-square" alt="Play at datasciencetrivia.com"></a>
  <a href="https://www.datasciencetrivia.com/quiz"><img src="https://img.shields.io/badge/quizzes-7-F2C86B?style=flat-square" alt="7 quizzes"></a>
  <a href="#-on-autopilot"><img src="https://img.shields.io/badge/autopilot-on-BB92D4?style=flat-square" alt="Autopilot on"></a>
</p>

---

## 🃏 Try one

> **Is logistic regression a linear model? Why?**

<details>
<summary>Flip the card</summary>
<br>

Yes. Logistic regression computes a linear combination of the inputs, and its
decision boundary is the hyperplane where that combination is zero. The sigmoid
on top only squashes the score into a probability; the log-odds are exactly
linear in the inputs. [Read the longer answer →](https://www.datasciencetrivia.com/questions/is-logistic-regression-a-linear-model-why)

</details>

Got it right? There are [a couple of hundred more where that came from](https://www.datasciencetrivia.com).

## 🎯 What it's for

Data science interviews love the same few hundred questions: the
bias-variance tradeoff, why accuracy lies on imbalanced data, what the learning
rate actually does, who invented the perceptron. Data Science Trivia turns
them into a deck you can flip through in a coffee break.

The goal is simple: be the place people land when they search one of those
questions, on Google or in an AI assistant, and give them a clear, correct
answer they can learn from in a minute.

## 📚 What's inside

| | Category | What it covers |
|---|---|---|
| 🟦 | [Machine Learning](https://www.datasciencetrivia.com/categories/machine-learning) | Bias and variance, regularization, metrics, cross-validation, ensembles, encodings |
| 🟥 | [Deep Learning](https://www.datasciencetrivia.com/categories/deep-learning) | Activations, gradient descent, dropout, batch norm, CNNs, LSTMs, Transformers |
| 🟨 | [Generative AI](https://www.datasciencetrivia.com/categories/generative-ai) | Decoding, RAG, prompting vs fine-tuning, tokenization, the KV cache |
| 🟩 | [Statistics](https://www.datasciencetrivia.com/categories/statistics) | Hypothesis tests, distributions, correlation, regression diagnostics |
| 🟪 | [History](https://www.datasciencetrivia.com/categories/history) | The people, papers and datasets behind the field, from Bayes to the Transformer |

And around the deck:

- **Every card has its own page**, many with a longer answer: the reasoning, a
  worked example and the follow-up question an interviewer would ask.
- **[Quizzes](https://www.datasciencetrivia.com/quiz)**: ten cards on one
  topic, scored, with a result you can share.
- **[The history of AI](https://www.datasciencetrivia.com/ai-history)** as a
  timeline, each milestone with a card to test yourself.
- **[llms.txt](https://www.datasciencetrivia.com/llms.txt)**: the whole deck
  as plain text, for AI assistants that want to quote it.

On a keyboard: <kbd>←</kbd> <kbd>→</kbd> to move, <kbd>A</kbd> to flip,
<kbd>E</kbd> / <kbd>N</kbd> / <kbd>H</kbd> to rate a card easy, neutral or hard.

## 🤖 On autopilot

Since October 2026 this project runs on autopilot, as an experiment: an AI
agent works on it 24/7.

Every day it:

1. reads the numbers: Google Search Console, Plausible analytics, keyword
   data, and whether AI assistants mention the site;
2. picks the change most likely to help people find and learn from the deck;
3. writes the cards or the code, checks the build, and opens a pull request;
4. merges it once CI is green, which deploys the site.

[Santiago Víquez](https://x.com/santiviquez) started the deck in 2019,
still owns it and can overrule anything the agent does. Every change it makes
is a [pull request in this repo](https://github.com/santiviquez/datasciencetrivia/pulls?q=is%3Apr),
so you can watch the experiment as it happens.

## 💌 Suggest a question

Found a wrong answer, or a question the deck is missing?
[Send Santiago a DM on X](https://x.com/santiviquez) or open an issue. If your
question makes it in, your handle goes on the card.

The cards are free to read and cite. Please link back to
[datasciencetrivia.com](https://www.datasciencetrivia.com) when you do.

---

## 🛠️ For developers

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4, deployed on
Vercel. Every page is prerendered at build time: no database, no API, no
runtime data fetching.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # content check + production build
npm run lint
npm run typecheck
```

Needs Node 20.9 or newer. Vercel builds on Node 24, set in the project's
settings rather than in `engines`.

### Content

Every card lives in `content/questions.json`:

```json
{
  "id": "ml-61",
  "category": "ml",
  "question": "Is logistic regression a linear model? Why?",
  "answer": "The short answer that fits on the card.",
  "explanation": ["Optional longer answer, one string per paragraph."],
  "updated": "2026-10-12",
  "slug": "is-logistic-regression-a-linear-model-why",
  "proposedBy": "@optional_handle"
}
```

- `category` is one of `ml`, `dl`, `genai`, `stats`, `history`.
- `slug` is the page URL. It is stored so a question can be reworded without
  breaking its link; omit it and one is derived from the question.
- `explanation` renders under the card on the question's page, and goes into
  its structured data, meta description and `llms.txt`.
- `updated` is the date the card's question, answer or explanation last
  changed. It becomes the page's `<lastmod>` in the sitemap, so set it whenever
  you edit a card.

When two cards ask the same thing, keep the fuller one, delete the other and
add `{ "from": "<old-slug>", "to": "<kept-slug>" }` to `content/redirects.json`,
so the old URL redirects permanently to the card that stays.

`npm run check:content` validates required fields, categories, explanations,
dates, redirects, unique slugs and the category hubs' starter cards. It runs
before every build.

To import a deck (JSON or CSV, including Anki exports converted to CSV):

```bash
npm run import:questions -- path/to/export.csv --merge
npm run check:content
```

It maps common column names (`question`/`front`, `answer`/`back`,
`category`/`topic`) and category aliases. `--merge` only appends cards whose
slug isn't already there.

### SEO and AI search

- A static page per card at `/questions/<slug>` with `QAPage` structured data
  and a generated Open Graph image.
- Category hubs at `/categories/<slug>` with `FAQPage` data, an intro and a
  "Start with these" list.
- Related cards on each page, ranked by TF-IDF similarity within the category
  (`lib/related.ts`).
- One `Person` and one `WebSite` node in `lib/schema.ts`, referenced by `@id`
  everywhere. **Don't change those `@id` strings**: they are the identity
  search engines accumulate signals against.
- `sitemap.xml`, `robots.txt` and `llms.txt` generated from the content file,
  and an IndexNow ping after every push to `master`.

### Security

Response headers live in `next.config.ts`: CSP, HSTS, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.
`script-src` allows `'unsafe-inline'` because Next streams its RSC payload
through inline scripts. The site takes no user input, has no auth, cookies or
database, so there is nothing for an inline script to inject into.

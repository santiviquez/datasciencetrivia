# Generative AI interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

16 generative ai questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Large language models in practice: prompting, retrieval, evaluation and the tradeoffs behind shipping them.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/generative-ai).

[All categories](README.md)

## What do temperature, top-p and top-k control?

How the next token is sampled: temperature flattens or sharpens the distribution, top-k keeps the k likeliest tokens, top-p the smallest set whose mass reaches p. Near zero for extraction and code; raise it only when you want variety.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-do-temperature-top-p-and-top-k-control)

## When do you use RAG instead of fine-tuning?

RAG when the model lacks knowledge: facts that change, are private, or need a citation. Fine-tuning when it lacks behaviour: a format, a tone, a narrow task. An index is cheaper to update than weights, so reach for RAG first.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-do-you-use-rag-instead-of-fine-tuning)

## What are the tradeoffs in RAG chunk size?

Small chunks retrieve precisely but strip the context that qualifies a fact; large ones keep context but dilute the embedding and spend tokens. Start near a few hundred tokens with some overlap, split on document structure, then tune against an eval set.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-are-the-tradeoffs-in-rag-chunk-size)

## Why combine embeddings with keyword search?

Because they fail differently: embeddings match paraphrase but miss rare exact strings like error codes and part numbers, while BM25 matches those tokens and misses paraphrase. Hybrid search fuses both rankings, usually with a reranker on top.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-combine-embeddings-with-keyword-search)

## How do you evaluate a RAG system?

Retrieval and generation separately. Retrieval: recall@k and nDCG on labelled question-document pairs. Generation: faithfulness (every claim supported by the context), relevance and citations. Many bad answers are retrieval failures.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-do-you-evaluate-a-rag-system)

## What actually reduces hallucinations?

Grounding, not scolding: retrieval with citations, permission to answer that it does not know, tool calls for facts and arithmetic, and a verification pass. The model optimises for the likeliest next token, not for truth, so instructions alone will not.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-actually-reduces-hallucinations)

## Why is a bigger context window not always the answer?

Tokens cost money and latency, and accuracy sags for material buried mid-prompt. Retrieving the 2k tokens that matter usually beats pasting 200k. Long windows are for genuinely long documents; prompt caching makes a stable prefix cheaper, not free.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-is-a-bigger-context-window-not-always-the-answer)

## Prompt, system prompt, tools: what does each do?

The system prompt sets durable role, rules and output format; the user prompt carries the request; tool definitions are schemas the model can call so your code fetches data or acts. The model never runs a tool itself: your application does, or the provider for hosted tools like web search.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/prompt-system-prompt-tools-what-does-each-do)

## Why did transformers replace RNNs for most NLP tasks?

Self-attention lets every token weigh every other token in one parallel step, instead of pushing information down a recurrent chain, so long-range dependencies survive and training parallelises. The cost is attention quadratic in sequence length.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-did-transformers-replace-rnns-for-most-nlp-tasks)

## How does BERT differ from a GPT-style model?

BERT is an encoder: bidirectional, trained by masking tokens, so every position sees both sides, which suits classification and embeddings but cannot generate. GPT is a causal decoder trained to predict the next token, which is what enables generation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-does-bert-differ-from-a-gpt-style-model)

## When should you build a workflow instead of an agent?

Whenever the steps are known ahead of time. A fixed sequence of model calls and code is cheaper, faster and testable, and you can see which step broke. An agent earns its loop only when the next action depends on intermediate results.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-should-you-build-a-workflow-instead-of-an-agent)

## What is an embedding?

A fixed-length vector for text, an image or audio, placed so similar meanings land near each other, which turns search into a nearest-neighbour lookup. Vectors only compare within one model, and closeness is not relevance, hence rerankers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-an-embedding)

## When do few-shot examples beat zero-shot prompting?

When the output format or labelling rule is easier to show than to describe: examples let the model infer the pattern in context, with no weight updates. They cost tokens on every call and can bias style, so add them where an eval shows a gain.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-do-few-shot-examples-beat-zero-shot-prompting)

## What does RLHF change about a base model?

Behaviour, not knowledge. Supervised fine-tuning on demonstrations, then a reward model trained on human preference pairs, then policy optimisation against it with a KL penalty to stay near the SFT model. DPO skips the reward model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-rlhf-change-about-a-base-model)

## How does byte pair encoding tokenization work?

Text is cut into subword tokens from a fixed vocabulary; BPE builds that vocabulary from characters up, repeatedly merging the most frequent adjacent pair. So common words are one token, rare and non-English text cost more, and letters are invisible.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-does-byte-pair-encoding-tokenization-work)

## What is the KV cache, and why does it cap concurrency?

Attention keys and values for the prefix, cached per layer, so each new token attends over saved state instead of recomputing the sequence. The cache grows with batch size, sequence length and layers, so GPU memory rather than compute limits throughput.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-kv-cache-and-why-does-it-cap-concurrency)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

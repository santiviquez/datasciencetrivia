# Generative AI interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

26 generative AI questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Large language models in practice: prompting, retrieval, evaluation and the tradeoffs behind shipping them.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/generative-ai).

[All categories](README.md)

## Topics

- [How LLMs work](#how-llms-work) (6)
- [Retrieval-augmented generation](#retrieval-augmented-generation) (5)
- [Prompting and agents](#prompting-and-agents) (5)
- [Post-training and evaluation](#post-training-and-evaluation) (5)
- [Inference efficiency](#inference-efficiency) (5)

## How LLMs work

What sits under the hood: why Transformers replaced RNNs, how BERT's encoder differs from a GPT-style decoder, how text becomes tokens and embeddings, how temperature, top-p and top-k pick the next token, and what the Chinchilla scaling laws say about model size versus training data.

### Why did transformers replace RNNs for most NLP tasks?

Self-attention lets every token weigh every other token in one parallel step, instead of pushing information down a recurrent chain, so long-range dependencies survive and training parallelises. The cost is attention quadratic in sequence length.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-did-transformers-replace-rnns-for-most-nlp-tasks)

### How does BERT differ from a GPT-style model?

BERT is an encoder: bidirectional, trained by masking tokens, so every position sees both sides, which suits classification and embeddings but cannot generate. GPT is a causal decoder trained to predict the next token, which is what enables generation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-does-bert-differ-from-a-gpt-style-model)

### How does byte pair encoding tokenization work?

Text is cut into subword tokens from a fixed vocabulary; BPE builds that vocabulary from characters up, repeatedly merging the most frequent adjacent pair. So common words are one token, rare and non-English text cost more, and letters are invisible.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-does-byte-pair-encoding-tokenization-work)

### What is an embedding?

A fixed-length vector for text, an image or audio, placed so similar meanings land near each other, which turns search into a nearest-neighbour lookup. Vectors only compare within one model, and closeness is not relevance, hence rerankers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-an-embedding)

### What do temperature, top-p and top-k control?

How the next token is sampled: temperature flattens or sharpens the distribution, top-k keeps the k likeliest tokens, top-p the smallest set whose mass reaches p. Near zero for extraction and code; raise it only when you want variety.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-do-temperature-top-p-and-top-k-control)

### What are the Chinchilla scaling laws?

For a fixed compute budget, a language model's size and its number of training tokens should grow in equal proportion, which works out to roughly 20 training tokens per parameter. Hoffmann and colleagues at DeepMind showed in 2022 that most large models of the time were too big and undertrained.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-are-the-chinchilla-scaling-laws)

## Retrieval-augmented generation

Retrieval questions ask you to argue RAG against fine-tuning, pick a chunk size, explain why hybrid search pairs embeddings with keyword matching, evaluate retrieval and generation separately, and say why a longer context window doesn't replace any of it.

### When do you use RAG instead of fine-tuning?

RAG when the model lacks knowledge: facts that change, are private, or need a citation. Fine-tuning when it lacks behaviour: a format, a tone, a narrow task. An index is cheaper to update than weights, so reach for RAG first.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-do-you-use-rag-instead-of-fine-tuning)

### What are the tradeoffs in RAG chunk size?

Small chunks retrieve precisely but strip the context that qualifies a fact; large ones keep context but dilute the embedding and spend tokens. Start near a few hundred tokens with some overlap, split on document structure, then tune against an eval set.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-are-the-tradeoffs-in-rag-chunk-size)

### Why combine embeddings with keyword search?

Because they fail differently: embeddings match paraphrase but miss rare exact strings like error codes and part numbers, while BM25 matches those tokens and misses paraphrase. Hybrid search fuses both rankings, usually with a reranker on top.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-combine-embeddings-with-keyword-search)

### How do you evaluate a RAG system?

Retrieval and generation separately. Retrieval: recall@k and nDCG on labelled question-document pairs. Generation: faithfulness (every claim supported by the context), relevance and citations. Many bad answers are retrieval failures.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-do-you-evaluate-a-rag-system)

### Why is a bigger context window not always the answer?

Tokens cost money and latency, and accuracy sags for material buried mid-prompt. Retrieving the 2k tokens that matter usually beats pasting 200k. Long windows are for genuinely long documents; prompt caching makes a stable prefix cheaper, not free.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-is-a-bigger-context-window-not-always-the-answer)

## Prompting and agents

What system prompts, tools and few-shot examples each do, when chain-of-thought prompting helps, what actually reduces hallucinations, and when a fixed workflow beats an autonomous agent.

### Prompt, system prompt, tools: what does each do?

The system prompt sets durable role, rules and output format; the user prompt carries the request; tool definitions are schemas the model can call so your code fetches data or acts. The model never runs a tool itself: your application does, or the provider for hosted tools like web search.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/prompt-system-prompt-tools-what-does-each-do)

### When do few-shot examples beat zero-shot prompting?

When the output format or labelling rule is easier to show than to describe: examples let the model infer the pattern in context, with no weight updates. They cost tokens on every call and can bias style, so add them where an eval shows a gain.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-do-few-shot-examples-beat-zero-shot-prompting)

### What is chain-of-thought prompting?

Prompting a model to write out intermediate reasoning steps before its final answer, either by showing worked examples or by adding an instruction such as "Let's think step by step". It improves accuracy on multi-step problems such as arithmetic and logic, at the cost of more output tokens.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-chain-of-thought-prompting)

### What actually reduces hallucinations?

Grounding, not scolding: retrieval with citations, permission to answer that it does not know, tool calls for facts and arithmetic, and a verification pass. The model optimises for the likeliest next token, not for truth, so instructions alone will not.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-actually-reduces-hallucinations)

### When should you build a workflow instead of an agent?

Whenever the steps are known ahead of time. A fixed sequence of model calls and code is cheaper, faster and testable, and you can see which step broke. An agent earns its loop only when the next action depends on intermediate results.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-should-you-build-a-workflow-instead-of-an-agent)

## Post-training and evaluation

What fine-tuning changes: RLHF and DPO align a base model with human preferences, and LoRA makes fine-tuning cheap by training small low-rank updates instead of every weight. Judging the output is its own problem, handled with LLM judges and overlap metrics like BLEU and ROUGE.

### What does RLHF change about a base model?

Behaviour, not knowledge. Supervised fine-tuning on demonstrations, then a reward model trained on human preference pairs, then policy optimisation against it with a KL penalty to stay near the SFT model. DPO skips the reward model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-rlhf-change-about-a-base-model)

### What is DPO (direct preference optimization)?

> **Flashcard:** What is DPO?

Direct preference optimization: aligning a language model to human preferences by training directly on pairs of preferred and rejected answers with a simple classification-style loss. It targets the same objective as RLHF without training a separate reward model or running reinforcement learning.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-dpo)

### What is LoRA (low-rank adaptation) fine-tuning?

> **Flashcard:** What is LoRA?

Low-rank adaptation: a fine-tuning method that freezes a model's weights and learns a small low-rank update for chosen weight matrices, W + BA. It trains a fraction of a percent of the parameters, and the update can be merged into W afterwards, so inference costs nothing extra.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-lora)

### What is LLM-as-a-judge?

Using a strong language model to grade outputs, either scoring one answer against a rubric or picking the better of two. It scales the evaluation of open-ended text, where exact-match metrics fail, but the judge has biases you have to measure against human labels.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-llm-as-a-judge)

### What are BLEU and ROUGE scores?

Metrics that score generated text by its n-gram overlap with reference texts. BLEU, built for machine translation, is precision-oriented: how many of the output's n-grams appear in the references. ROUGE, built for summarization, is recall-oriented: how many of the reference's n-grams the output recovers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-are-bleu-and-rouge-scores)

## Inference efficiency

The details that set an LLM's latency and serving cost: the KV cache and how grouped-query attention shrinks it, FlashAttention's memory-aware attention, speculative decoding, and mixture-of-experts models that run only part of their weights for each token.

### What is the KV cache, and why does it cap concurrency?

Attention keys and values for the prefix, cached per layer, so each new token attends over saved state instead of recomputing the sequence. The cache grows with batch size, sequence length and layers, so GPU memory rather than compute limits throughput.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-kv-cache-and-why-does-it-cap-concurrency)

### What is grouped-query attention?

An attention variant in which groups of query heads share one key head and one value head. It shrinks the KV cache, and the memory traffic of generating each token, by the group size while keeping quality close to full multi-head attention.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-grouped-query-attention)

### What is FlashAttention?

An exact implementation of attention that is faster because it never writes the full n × n attention matrix to GPU memory. It computes attention in tiles that fit in fast on-chip memory, using an online softmax, so it moves far less data and its memory use grows linearly with sequence length.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-flashattention)

### What is speculative decoding?

A way to speed up LLM generation: a small draft model proposes several tokens, and the large model checks all of them in one forward pass, keeping the longest accepted run. With the right acceptance rule the output follows exactly the large model's distribution, so it gets faster with no loss in quality.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-speculative-decoding)

### What is a mixture of experts (MoE) model?

A model whose feed-forward layers are split into many expert networks, with a router that sends each token to only a few of them. Total parameters can grow without a matching rise in compute per token, so an MoE model gets more capacity for a given inference cost.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-mixture-of-experts-moe-model)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

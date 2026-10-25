# MLOps interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

14 MLOps questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. What happens after a model ships: drift, monitoring, deployment and the system design questions around them.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/mlops).

[All categories](README.md)

## Topics

- [Drift, monitoring and retraining](#drift-monitoring-and-retraining) (6)
- [Deployment and testing](#deployment-and-testing) (6)
- [Recommender systems](#recommender-systems) (2)

## Drift, monitoring and retraining

The ways a deployed model goes stale: its inputs drift, the relationship between inputs and target drifts, and its performance decays. These cards cover measuring a shift with the Population Stability Index, monitoring before labels arrive, and deciding when to retrain.

### What is data drift?

A change in the distribution of a model's inputs between training and production, so the live features stop looking like the data it learned from. When P(X) moves but P(y \| X) stays the same, it is called covariate shift.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-data-drift)

### What is concept drift?

A change in the relationship between the inputs and the target, P(y \| X), so the same inputs now call for a different prediction. The model's learned rules go stale even when the input data looks unchanged.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-concept-drift)

### What is model drift?

The decay of a deployed model's performance over time, also called model decay, because the world it scores moves away from the data it learned from. Data drift and concept drift are its usual causes; a broken data pipeline can look the same.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-model-drift)

### What is the Population Stability Index (PSI)?

A score for how far a variable's distribution has shifted between two samples, usually training and production: bin the variable, then sum (actual% − expected%) × ln(actual% / expected%) over the bins. Below 0.1 is usually read as stable and above 0.25 as a major shift.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-population-stability-index-psi)

### How do you monitor a model before its labels arrive?

Watch proxies until the ground truth lands: data quality, drift in the inputs and in the predictions, and, for a well-calibrated classifier, an estimate of performance from its own confidence scores. Confirm with realized performance once the labels arrive.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-do-you-monitor-a-model-before-its-labels-arrive)

### How do you decide when to retrain a model?

Retrain on a schedule when the data changes steadily and retraining is cheap, or on a trigger when measured or estimated performance falls below a threshold. Drift alone is a weak trigger, because not all drift hurts the model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-do-you-decide-when-to-retrain-a-model)

## Deployment and testing

Getting a model in front of users safely: batch versus online inference, feature stores and the training-serving skew they guard against, shadow and canary releases, and why a model that wins offline can still lose its A/B test.

### What is the difference between batch and online inference?

Batch inference scores many rows on a schedule and stores the predictions for later lookup; online inference scores each request on demand, within a latency budget. Batch is cheaper and simpler, while online can use features from the moment of the request.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-batch-and-online-inference)

### What is a feature store?

A system that computes, stores and serves machine learning features from one definition: an offline store with the full history for training and a low-latency online store with the latest values for serving. It stops training and serving from drifting apart and lets teams reuse features.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-feature-store)

### What is training-serving skew?

A mismatch between how features are computed for training and how they are computed when the model serves predictions, so the live model sees inputs that differ from what it learned from. It is a pipeline bug, not a change in the world.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-training-serving-skew)

### What is shadow deployment?

Running a new model next to the live one on real production traffic, logging its predictions without acting on them. It tests the model on real inputs, latency and load with no effect on users.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-shadow-deployment)

### What is a canary deployment?

Releasing a new model to a small slice of live traffic, say 1 to 5%, watching errors, latency and business metrics, and widening the rollout in steps while they hold. If they don't, traffic goes back to the old model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-canary-deployment)

### Why can a model that wins offline lose in an A/B test?

Offline metrics are computed on logged data that the old system shaped, against a proxy target, while the A/B test measures the real outcome on live users. Selection bias in the logs, a weak proxy, feedback loops and added latency all open a gap.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-can-a-model-that-wins-offline-lose-in-an-a-b-test)

## Recommender systems

Two staples of recommendation system design questions: the cold start problem for new users and items, and the two-tower model used to retrieve candidates at scale.

### What is the cold start problem?

A recommender or personalization model has nothing to go on for new users or new items that have no interaction history yet. The usual fixes use content features, popularity and onboarding questions until enough interactions arrive.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-cold-start-problem)

### What is a two-tower model?

A retrieval model with two neural networks, one that embeds the user or query and one that embeds the item, trained so that the dot product of the two embeddings scores relevance. Item embeddings are computed in advance, so millions of candidates can be searched quickly with nearest-neighbour search.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-two-tower-model)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

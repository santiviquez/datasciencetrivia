# Machine Learning interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

82 machine learning questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Models, metrics and the tradeoffs that decide whether a model survives contact with real data.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/machine-learning).

[All categories](README.md)

## What are some examples of supervised learning algorithms?

> **Flashcard:** Name three supervised learning algorithms.

Any three of: linear regression, logistic regression, decision trees, random forests, gradient boosting, support vector machines, k-nearest neighbors, naive Bayes and neural networks.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-supervised-learning-algorithms)

## What are some examples of unsupervised learning algorithms?

> **Flashcard:** Name three unsupervised learning algorithms.

k-means clustering, principal component analysis (PCA) and DBSCAN; others include hierarchical clustering, Gaussian mixture models, isolation forest and autoencoders. Clustering and anomaly detection are tasks rather than algorithms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-unsupervised-learning-algorithms)

## What is the type of machine learning algorithms used to draw inferences from labeled data?

Supervised Learning.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-type-of-machine-learning-algorithms-used-to-draw-inferences-from-labeled-data)

## What is the type of machine learning algorithms used to draw inferences from data without labels?

Unsupervised Learning.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-type-of-machine-learning-algorithms-used-to-draw-inferences-from-data-without)

## What is a ROC curve?

> **Flashcard:** Which graph plots the true positive rate against the false positive rate at various classification thresholds?

ROC curve.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/graphical-representation-of-the-contrast-between-true-positives-and-false-positives-rates)

## What are the types of kernels in SVM?

> **Flashcard:** Name three types of kernels in SVM.

Linear, polynomial and RBF (radial basis function), with sigmoid a fourth. A kernel computes inner products in a higher-dimensional space without ever building that space, so linear is the default for wide sparse text and RBF for low-dimensional, curved boundaries.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-types-of-kernels-in-svm)

## What is pruning in a decision tree?

Removing sub-nodes that do not earn their keep, so a fully grown tree stops fitting noise. Pre-pruning caps growth up front with max depth or minimum samples per leaf; post-pruning grows the tree, then collapses branches whose removal does not hurt held-out error.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-pruning-in-a-decision-tree)

## What is ensemble learning?

Combining individual models together with the purpose of improving the predictive power of the model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-ensemble-learning)

## Can you use k-fold cross-validation on time series data?

> **Flashcard:** Would you use k-fold cross validation on time series data? Explain.

Not standard shuffled k-fold: time series rows are ordered and autocorrelated, so random folds train on the future to predict the past. Use time-ordered splits instead, such as walk-forward validation (scikit-learn's TimeSeriesSplit).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/would-you-use-k-fold-cross-validation-on-time-series-data-explain)

## What is the process of adding tuning parameters to a model to induce smoothness in order to prevent overfitting?

Regularization: a penalty on parameter size added to the loss, so the fit stays smooth rather than chasing every training point. L1 (lasso) zeroes weights outright and selects features, L2 (ridge) shrinks them all. Its strength is tuned on validation data, never training loss.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-process-of-adding-tuning-parameters-to-a-model-to-induce-smoothness-in-order)

## What is count encoding?

Count encoding replaces each categorical value with the number of times it appears in the dataset.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-count-encoding)

## What is one hot encoding?

Encoding a categorical feature as one binary column per category: each row gets a 1 in the column for its own category and 0 in all the others, so every encoded vector is sparse with exactly one 1.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-one-hot-encoding)

## What is target encoding?

Target encoding replaces a categorical value with the average value of the target for that value of the feature.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-target-encoding)

## What is data leakage?

When information from outside the training dataset is used to create the model. For example, including any information from the validation or test sets into the model.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-data-leakage)

## Imagine you are applying a decision-tree-based model to a numerical dataset and you run an experiment where you scale the features. Which model would give better results, the original or the scaled one?

They should give the same result because tree-based models are scale invariant.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/imagine-you-are-applying-a-decision-tree-based-model-to-a-numerical-dataset-and-you-run-a)

## What is the difference between L1 (Lasso) and L2 (Ridge) regularization?

L1 penalizes the absolute magnitude of the coefficients while L2 penalizes the square of the coefficients.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-l1-lasso-and-l2-ridge-regularization)

## What is a confusion matrix?

A table that shows how a classifier's predicted classes compare with the actual classes. For binary classification it is a 2x2 grid of true positives, false positives, true negatives and false negatives; with k classes it is a k × k grid with correct predictions on the diagonal.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-confusion-matrix)

## Should a confusion matrix be used for supervised or unsupervised learning problems?

Supervised, specifically classification: it compares predicted classes with true labels.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/confusion-matrix-should-be-used-for-supervised-or-unsupervised-learning-problems)

## What is boosting when referring to machine learning algorithms?

A family of ensemble methods that trains weak learners in sequence, each one focusing on the examples the previous ones got wrong, and combines them in a weighted vote or sum to form a strong learner. AdaBoost and gradient boosting are the best-known examples.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-boosting-when-referring-to-machine-learning-algorithms)

## What is bucketing in machine learning?

> **Flashcard:** Explain what bucketing is.

Converting a (usually continuous) feature into multiple binary features called buckets or bins, typically based on value range.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/explain-what-is-bucketing)

## How many centroids would a k-means algorithm with k = 3 find?

3

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-many-centroids-a-k-means-algorithm-with-k-3-would-find)

## What is the difference between a dense and a sparse feature?

A dense feature is one in which most values are non-zero in contrast with a sparse one where most values are zeros or empty.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-a-dense-and-a-sparse-feature)

## What is downsampling in the context of class-imbalanced dataset?

Training on a disproportionately low percentage of over-represented class examples in order to improve model training on under-represented classes.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-downsampling-in-the-context-of-class-imbalanced-dataset)

## What is early stopping?

A method for regularization that involves ending model training before training loss finishes decreasing. In early stopping, you end model training when the loss on a validation dataset starts to increase.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-early-stopping)

## Is logistic regression useful for estimating continuous variables?

No. Logistic regression models a categorical, usually binary, outcome: its output is the probability, between 0 and 1, that an example is in the positive class, not an estimate of a continuous target such as a price.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/logistic-regression-is-useful-for-estimating-continuous-variables)

## What is it called when a model fits the training data too closely?

> **Flashcard:** Creating a model that matches the training data so closely that the model fails to make correct predictions on new data.

Overfitting: the model has memorised noise particular to the training set, so training error keeps falling while validation error turns back up. The fixes matter as much as the name: more data, regularization, early stopping, a simpler model, and cross-validation to detect it.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/creating-a-model-that-matches-the-training-data-so-closely-that-the-model-fails-to-make)

## How does a random forest work?

> **Flashcard:** Explain the basic concept of random forest.

An ensemble of many decision trees, each trained on a bootstrap sample of the rows and choosing each split from a random subset of features. It predicts by majority vote or by averaging the trees' outputs; it doesn't pick one best tree.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/explain-the-basic-concept-of-random-forest)

## What does "random" mean in the term random forest?

Two sources of randomness: each tree is trained on a bootstrap sample of the rows, and each split considers only a random subset of the features, drawn afresh at every split. Averaging these decorrelated trees reduces variance.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-random-means-in-the-random-forest-term)

## If someone asks you: out of all the actual positive labels, how many did the model correctly identify? Which metric should you calculate?

Recall: true positives over all actual positives, TP / (TP + FN). It is the metric to optimise when a miss is the expensive error, as in fraud or disease screening. You can always buy recall by lowering the threshold, which is why it is quoted next to precision.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/if-someone-ask-you-out-of-all-the-possible-positive-labels-how-many-did-the-model)

## What is underfitting in machine learning?

> **Flashcard:** Producing a model with poor predictive ability because the model hasn't captured the complexity of the training data.

Underfitting: high bias, a model too simple for the signal, so training and validation error are both high and close to each other. Add capacity or better features, weaken the regularization, or train longer. More data will not rescue a model that cannot fit what it already has.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/producing-a-model-with-poor-predictive-ability-because-the-model-hasnt-captured-the)

## What is precision?

Precision is the number of correct positive predictions divided by the total number of positive predictions: TP / (TP + FP).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-precision)

## What is recall?

Recall is the number of the correct predictions of the positive class divided by the number of predictions that should have been classified in the positive class. TP/(TP + FN)

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-recall)

## What is F1-score?

Is a measure of a test's accuracy. F1-score is the harmonic mean of the precision and recall.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-f1-score)

## Is it better to have an F1 score of 1 or of 0?

F1-score reaches its best value at 1 (perfect precision and recall).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-better-to-have-a-f1-score-equals-to-1-or-to-0)

## Which regularization technique penalizes the sum of absolute value of weights? L1 or L2?

L1.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-regularization-technique-penalizes-the-sum-of-absolute-value-of-weights-l1-or-l2)

## Which regularization technique penalizes the sum of square weights? L1 or L2?

L2.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-regularization-technique-penalizes-the-sum-of-square-weights-l1-or-l2)

## L1 regularization is also called?

Lasso, short for least absolute shrinkage and selection operator. It adds λ times the L1 norm of the weights, λ Σ \|wᵢ\|, to the loss, which drives some weights exactly to zero.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/l1-regularization-is-also-called)

## L2 regularization is also called?

Ridge.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/l2-regularization-is-also-called)

## Can we have both L1 and L2 regularization components in a linear model?

Yes, it is called Elastic net regularization.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/can-we-have-both-l1-and-l2-regularization-components-in-a-linear-model)

## What is Elastic net regularization?

A regularization technique that linearly combines the L1 (lasso) and L2 (ridge) penalties.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-elastic-net-regularization)

## What is unsupervised learning?

Unsupervised learning aims to detect patterns in data where no labels are given.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-unsupervised-learning)

## Does feature selection tend to increase overfitting?

No. It actually could help to reduce overfitting.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/does-feature-selection-tends-to-increase-overfitting)

## Mean Squared Error, Root Mean Squared Error, Mean Absolute Error, R-squared are metrics for evaluation which type of models?

Regression models.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/mean-squared-error-root-mean-squared-error-mean-absolute-error-r-squared-are-metrics-for)

## Model simplification tends to decrease bias and increase variance, which leads to underfitting. True or False?

False. Model simplification decreases the variance but increases the bias.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/model-simplification-tends-to-decrease-the-bias-and-increase-the-variance-which-leads-to)

## Increasing model complexity tends to decrease bias and increase variance, which leads to overfitting. True or False?

True.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/model-complexity-tends-to-decrease-the-bias-and-increase-the-variance-which-leads-to)

## Accuracy, Precision, Recall, F1 score, ... are metrics to evaluate which types of models?

Classification models.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/accuracy-precision-recall-f1-score-are-metrics-to-evaluate-which-types-of-models)

## Why is naive Bayes 'naive'?

Because it assumes the features are independent of each other given the class, so an example's likelihood is simply the product of each feature's likelihood.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-is-naive-bayes-naive)

## Is KNN a clustering algorithm?

No. It is a supervised learning method that could be used for classification and regression problems.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-knn-a-clustering-algorithm)

## How is random forest different from gradient boosting algorithm?

The fundamental difference is, random forest uses bagging technique to make predictions. GBM uses boosting techniques to make predictions.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-is-random-forest-different-from-gradient-boosting-algorithm)

## Is it possible to design a linear regression algorithm using a neural network?

Yes.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/it-is-possible-to-design-a-linear-regression-algorithm-using-a-neural-network)

## Which regularization would you use if your model is underfitting?

None: regularization fights overfitting, and adding it to an underfitting model makes things worse. If the model is already regularized, weaken or remove it, and add capacity or better features.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-regularization-would-you-use-if-your-model-is-underfitting)

## Is standardization of features required before training a logistic regression?

No — rescaling a feature just rescales its coefficient, so the predictions are unchanged. It still matters in practice: gradient descent converges far faster when features share a scale, and any L1 or L2 penalty is scale-dependent, so unscaled features get penalised unevenly.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/standardization-of-features-is-required-before-training-a-logistic-regression)

## What is the difference between online and batch learning?

Batch (offline) learning trains on the whole dataset at once and must be retrained to absorb new data. Online learning updates the model incrementally as each new example, or small group of examples, arrives.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-online-and-batch-learning)

## Bagging stands for?

Bootstrap aggregating: train the same learner on many bootstrap resamples and average the predictions, which cuts variance and leaves bias roughly untouched. That is why it suits deep unstable trees, while boosting attacks bias by fitting each model to the last one's errors.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/bagging-stands-for)

## What is the difference between boosting and bagging?

Bagging trains models independently on bootstrap samples and averages or votes their predictions, which mainly reduces variance. Boosting trains weak learners one after another, each focusing on the errors of the ensemble so far, and combines them in a weighted sum, which mainly reduces bias.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-boosting-and-bagging)

## High bias can cause an algorithm to underfit? True or False?

True.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/high-bias-can-cause-an-algorithm-to-underfit-true-or-false)

## High variance can cause an algorithm to overfit. True or False?

True.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/high-variance-can-cause-an-algorithm-to-overfit-true-of-false)

## What is variance in the context of machine learning?

Variance is the error that comes from a model's sensitivity to small fluctuations in the training set: trained on a different sample, a high-variance model makes noticeably different predictions. High variance can cause an algorithm to model the random noise in the training data, which is overfitting.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-variance-in-the-context-of-machine-learning)

## What is the bias-variance tradeoff?

> **Flashcard:** Explain the bias-variance tradeoff.

Expected squared error splits into squared bias (a model too simple for the truth), variance (sensitivity to which training sample you drew) and irreducible noise. Pushing one down usually lifts the other, so you tune capacity and regularization to minimise the sum, not either term alone.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/explain-what-is-bias-variance-tradeoff)

## What happens to our linear regression if we have columns x, y and z, and z is the sum of x and y?

The coefficients are no longer unique: z is a linear combination of x and y (perfect multicollinearity), so XᵀX is singular and infinitely many coefficient sets give the same fit. Predictions still work; drop z or use ridge regression.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-happens-to-our-linear-regression-if-we-have-columns-x-y-z-and-z-is-a-sum-of-x-and-y)

## Is logistic regression a linear model? Why?

Logistic regression is considered a generalized linear model because the outcome always depends on the sum of the inputs and parameters.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-logistic-regression-a-linear-model-why)

## What is TF-IDF?

TF-IDF weights a word in a document by its term frequency (how often it appears there) times its inverse document frequency, log(N / df), which is high for words few documents contain. Words frequent in one document but rare across the corpus score highest.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-tf-idf)

## What is overfitting?

When a model performs very well on its training set but poorly on new data, such as a test set, because it has fit the noise and quirks of the training data instead of only the underlying pattern.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-overfitting)

## What is the precision-recall curve?

A precision-recall curve (or PR Curve) is a plot of the precision (y-axis) and the recall (x-axis) for different probability thresholds.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-precision-recall-curve)

## Can we use L1 regularization for feature selection?

Yes, because the nature of L1 regularization will lead to sparse coefficients of features. Feature selection can be done by keeping only features with non-zero coefficients.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/can-we-use-l1-regularization-for-feature-selection)

## What is bag of words?

Bag of Words is a representation of text that describes the occurrence of words within a document.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-bag-of-words)

## What is clustering?

Clustering algorithms group objects such that similar feature points are put into the same groups (clusters).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-clustering)

## What is a time series?

A time series is a set of observations ordered in time usually collected at regular intervals.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-time-series)

## When building your vocabulary, is it OK to use the tokens from the entire dataset to shrink your out-of-vocabulary list?

False. Build the vocabulary from the training split only (or from an external corpus, such as a pretrained model's vocabulary); tokens seen only in validation or test data map to UNK, or are split into known subword pieces by a subword tokenizer.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/when-building-your-vocabulary-set-its-ok-to-use-the-tokens-from-the-entire-dataset-to)

## What is the main data structure used in causal modelling?

Graphs! More specifically, directed acyclic graphs.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-main-data-structure-used-in-causal-modelling)

## What is the difference between sensitivity and specificity?

Sensitivity is the share of actual positives a test catches, TP / (TP + FN), the same as recall. Specificity is the share of actual negatives it correctly clears, TN / (TN + FP). Moving the decision threshold trades one for the other.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-sensitivity-and-specificity)

## What is a calibration curve in machine learning?

> **Flashcard:** What does it mean for a classifier to be well calibrated?

Its predicted probabilities match observed frequencies: of all the cases it scores 0.8, about 80% turn out positive. A calibration curve, or reliability diagram, plots the observed positive rate against the predicted probability; a calibrated model follows the diagonal.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-it-mean-for-a-classifier-to-be-well-calibrated)

## What is the Brier score?

The mean squared difference between predicted probabilities and actual outcomes coded as 0 or 1: (1/N) Σ (pᵢ − yᵢ)². Lower is better: 0 is perfect, and always predicting 0.5 scores 0.25.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-brier-score)

## What is log loss (cross-entropy loss)?

> **Flashcard:** What is log loss?

The average negative log of the probability the model gave to the true class: −(1/N) Σ \[yᵢ log pᵢ + (1 − yᵢ) log(1 − pᵢ)\] for binary labels. It rewards confident correct predictions and punishes confident wrong ones heavily.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-log-loss)

## What is hinge loss?

The loss behind support vector machines: max(0, 1 − y·f(x)) with labels y = ±1 and raw score f(x). It is zero for points on the correct side of the margin and grows linearly as a point moves into the margin or past the boundary.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-hinge-loss)

## What is Huber loss?

A regression loss that is squared for small errors and linear for large ones, with a threshold δ between the two. It behaves like squared error near zero and like absolute error for outliers, so a few extreme points can't dominate the fit.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-huber-loss)

## What is pinball loss (quantile loss)?

> **Flashcard:** What is pinball loss?

The loss used to predict a quantile instead of a mean: for quantile τ, an under-prediction costs τ × error and an over-prediction costs (1 − τ) × error. Minimizing it with τ = 0.9 gives a forecast that actual values fall below 90% of the time.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-pinball-loss)

## What is MAPE?

Mean absolute percentage error: the average of \|actual − forecast\| / \|actual\|, as a percentage. It is easy to explain, but it is undefined when an actual value is 0, explodes near 0, and penalizes over-forecasts more than under-forecasts.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-mape)

## What is WAPE?

Weighted absolute percentage error: total absolute error divided by total actual volume, Σ\|actual − forecast\| / Σ\|actual\|. Unlike MAPE it doesn't blow up on small or zero actuals, because each error counts in proportion to volume.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-wape)

## What is NDCG?

Normalized discounted cumulative gain, a ranking metric: add up each result's relevance, discounted by the log of its position, then divide by the same sum for the ideal ordering. It runs from 0 to 1 and rewards putting the most relevant items at the top.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-ndcg)

## What is Cohen's kappa?

A measure of agreement between two raters, or between a classifier and the truth, that corrects for agreement expected by chance: κ = (p\_o − p\_e) / (1 − p\_e). A value of 1 is perfect agreement and 0 is what chance alone would give.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-cohens-kappa)

## What is the Matthews correlation coefficient?

A single score for a binary classifier that uses all four cells of the confusion matrix: MCC = (TP·TN − FP·FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN)). It runs from −1 to 1, with 0 for random guessing, and stays honest on imbalanced data.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-matthews-correlation-coefficient)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

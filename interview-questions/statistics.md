# Statistics interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

36 statistics questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Inference, uncertainty and the ideas that people most often get subtly wrong in interviews.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/statistics).

[All categories](README.md)

## What is the generalization of the median?

The Quantile.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-generalization-of-the-median)

## What is the difference between "long" and "wide" format data?

Wide: categorical data is grouped in a single row, long: each row is an observation belonging to a particular category.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-long-and-wide-format-data)

## What is cluster sampling?

> **Flashcard:** Probability sampling technique in which each sampling unit is a cluster, a group of population elements, rather than a single element.

Cluster sampling.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/technique-used-to-sample-based-on-a-probability-where-each-sample-unit-is-a-collection-of)

## What is a Type I and a Type II error?

Type I errors are false positives (rejecting a true null hypothesis) and Type II errors are false negatives (missing a real effect).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-type-i-and-a-type-ii-error)

## What two parameters define a normal distribution?

Its mean and its standard deviation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-two-parameters-defined-a-normal-distribution)

## In a normal distribution which parameter indicates where the bell is centered?

The mean.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/in-a-normal-distribution-which-parameter-indicates-where-the-bell-is-centered)

## In a normal distribution, which parameter indicates how wide the bell is?

The standard deviation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/in-a-normal-distribution-which-parameter-indicates-how-wide-is-the-bell)

## What is the difference between a nominal and an ordinal feature?

Nominal data names categories with no natural order, ex: eye color, city or payment method. Ordinal data has categories with a meaningful order but no fixed spacing between them, ex: grades A, B, C, D, E and F.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-of-and-nominal-and-ordinal-feature)

## What does high and low cardinality mean?

High cardinality refers to columns with values that are very uncommon or unique, example: email addresses, or user names. And low cardinality: refers to columns with few unique values, example: status flags, boolean values.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-high-and-low-cardinality-mean)

## What is R-squared?

R-squared, the coefficient of determination, is the proportion of variance in the target that the model explains: R² = 1 − SS\_res / SS\_tot. 1 is a perfect fit, 0 is no better than predicting the mean, and on new data it can even be negative.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-r-squared)

## What is a residual?

It is the difference between the observed value and the value estimated by the model: eᵢ = yᵢ − ŷᵢ.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-residual)

## What is dimensionality reduction?

It is the process of reducing the number of variables under consideration by obtaining a set of principal variables.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-dimensionality-reduction)

## What is a false negative?

An example in which the model mistakenly predicted the negative class.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-false-negative)

## What is a false positive?

An example in which the model mistakenly predicted the positive class.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-false-positive)

## Values distant from most other values are?

Outliers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/values-distant-from-most-other-values-are)

## Precision is the ratio between which two quantities?

True positives over predicted positives, TP / (TP + FP): of the cases you flagged, how many were right. It says nothing about the positives you missed, so it is read alongside recall, and it is the metric to favour when a false alarm is the costly error.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/precision-is-the-rate-between)

## What does stationarity in a dataset mean?

A property of data in a dataset, in which the data distribution stays constant across one or more dimensions. Most commonly, that dimension is time.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-stationarity-in-a-dataset-means)

## The normal distribution derives its importance from which famous theorem?

The Central Limit Theorem: the mean of n independent draws from a distribution with finite variance is approximately normal for large n, whatever the population's shape. That is what justifies normal-based confidence intervals and t-tests on non-normal data, provided the sample is large enough for the data's skew.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/the-normal-distribution-derives-its-importance-from-which-famous-theorem)

## What are the common dimensionality reduction techniques?

> **Flashcard:** Name three techniques of dimensionality reduction.

Singular Value Decomposition (SVD), Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA), Autoencoders, Fourier and Wavelet Transforms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-techniques-of-dimensionality-reduction)

## What measures how far a set of numbers is spread out from their average?

> **Flashcard:** Measures how far a set of (random) numbers is spread out from their average value.

Variance: the average squared deviation from the mean. Its square root, the standard deviation, measures the same spread in the original units.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/measures-how-far-a-set-of-random-numbers-are-spread-out-from-their-average-value)

## What values could you infer from a boxplot?

The median (the line inside the box, not the mean), the first and third quartiles (the box edges, whose gap is the IQR), the whisker ends and any outliers. Whiskers stop at the most extreme point within 1.5 × IQR of the box, so they show the minimum and maximum only when no outliers are drawn.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-values-could-you-infer-from-a-boxplot)

## Is rotation necessary in PCA?

Not as an extra step: PCA is itself an orthogonal rotation of the axes onto the directions of maximum variance. A further rotation such as varimax is optional and only aids interpretation; it keeps the total explained variance but loses the variance-maximizing order.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-rotation-necessary-in-pca)

## What is the difference between covariance and correlation?

Correlation is covariance divided by the two standard deviations, so it is unitless and bounded in \[-1, 1\], while covariance carries the units of both variables and has no fixed scale. That is what makes correlation comparable across pairs; both only capture linear association.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-covariance-and-correlation)

## Is it possible to capture the correlation between a continuous and a categorical variable?

Yes. Use the point-biserial correlation when the category has two levels, or one-way ANOVA with eta squared (the correlation ratio) for more levels; Kruskal-Wallis if the data are skewed. ANCOVA answers a different question: it compares group means while adjusting for a continuous covariate.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-it-possible-capture-the-correlation-between-continuous-and-categorical-variable)

## If pearson correlation is 0 between two variables can we assume that there isn't any relation between them?

No. Pearson correlation coefficient between 2 variables might be zero even when they have a relationship between them. Example: x and x^2

[Read the longer answer →](https://www.datasciencetrivia.com/questions/if-pearson-correlation-is-0-between-two-variables-can-we-assume-that-there-isnt-any)

## Does mean imputation take feature correlation into account?

No.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/does-mean-imputation-takes-into-account-feature-correlation)

## How do you handle missing values in a dataset?

> **Flashcard:** Give 3 techniques for handling missing values.

Delete rows (or columns) with missing data; impute with a simple statistic such as the mean, median or mode; or predict the missing values from the other features with a model such as k-NN or regression imputation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/give-3-techniques-for-handling-missing-values)

## What is the Law of Large Numbers?

A theorem stating that as the number of independent trials increases, the average of the results gets closer to the expected value.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-law-of-large-numbers)

## What is Survivorship bias?

Is the logical error of concentrating on the people or things that made it past some selection process and overlooking those that did not.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-survivorship-bias)

## What is a confounding variable?

A variable that influences both the independent and the dependent variable, distorting the association between them: it can create a spurious link, hide a real effect or even reverse it.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-confounding-variable)

## How is the interquartile range calculated?

Q3 - Q1

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-interquartile-range-is-calculated)

## What is autocorrelation?

It is the correlation of a signal with a delayed copy of itself, as a function of the delay (lag).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-autocorrelation)

## What is MSE?

MSE stands for Mean Squared Error. And is a measure of how close a fitted line is to data points by measuring the average squared of the errors.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-mse)

## What is RMSE?

Root Mean Squared Error: the square root of MSE, which puts the error back in the units of the target. Squaring first lets large misses dominate, so RMSE is always at least MAE and far more outlier-sensitive — report MAE too when a handful of extreme rows drives the number.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-rmse)

## How can we select K for K-means?

Domain knowledge first, then the elbow of inertia against k, average silhouette, or the gap statistic. Inertia falls monotonically, so the elbow is often ambiguous; silhouette scores separation as well as compactness. If a downstream use defines the segments, let that pick k.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-can-we-select-k-for-k-means)

## What is precision and recall at k?

Precision at k and recall at k are evaluation metrics for ranking algorithms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-precision-and-recall-at-k)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

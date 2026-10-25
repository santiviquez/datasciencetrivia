# Statistics interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

73 statistics questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Inference, uncertainty and the ideas that people most often get subtly wrong in interviews.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/statistics).

[All categories](README.md)

## Topics

- [Describing data](#describing-data) (11)
- [Probability and distributions](#probability-and-distributions) (13)
- [Hypothesis testing](#hypothesis-testing) (17)
- [Experiments, bias and causal inference](#experiments-bias-and-causal-inference) (10)
- [Correlation, regression and time series](#correlation-regression-and-time-series) (10)
- [Model errors and metrics](#model-errors-and-metrics) (6)
- [PCA, clustering and divergences](#pca-clustering-and-divergences) (6)

## Describing data

Before any test, an interviewer wants to see that you can describe a dataset: what type each column is, how the table is laid out, its center, spread and shape (quantiles, the interquartile range, variance, skewness), and what to do about outliers and missing values.

### What is the difference between a nominal and an ordinal feature?

Nominal data names categories with no natural order, ex: eye color, city or payment method. Ordinal data has categories with a meaningful order but no fixed spacing between them, ex: grades A, B, C, D, E and F.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-of-and-nominal-and-ordinal-feature)

### What does high and low cardinality mean?

High cardinality refers to columns with values that are very uncommon or unique, example: email addresses, or user names. And low cardinality: refers to columns with few unique values, example: status flags, boolean values.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-high-and-low-cardinality-mean)

### What is the difference between "long" and "wide" format data?

Wide: categorical data is grouped in a single row, long: each row is an observation belonging to a particular category.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-long-and-wide-format-data)

### What is the generalization of the median?

The Quantile.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-generalization-of-the-median)

### How is the interquartile range calculated?

Q3 - Q1

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-interquartile-range-is-calculated)

### What values could you infer from a boxplot?

The median (the line inside the box, not the mean), the first and third quartiles (the box edges, whose gap is the IQR), the whisker ends and any outliers. Whiskers stop at the most extreme point within 1.5 × IQR of the box, so they show the minimum and maximum only when no outliers are drawn.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-values-could-you-infer-from-a-boxplot)

### What measures how far a set of numbers is spread out from their average?

> **Flashcard:** Measures how far a set of (random) numbers is spread out from their average value.

Variance: the average squared deviation from the mean. Its square root, the standard deviation, measures the same spread in the original units.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/measures-how-far-a-set-of-random-numbers-are-spread-out-from-their-average-value)

### What do skewness and kurtosis measure?

Skewness measures a distribution's asymmetry: positive when the right tail is longer, negative when the left one is. Kurtosis measures how heavy the tails are compared with a normal distribution, which has kurtosis 3, or excess kurtosis 0.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-do-skewness-and-kurtosis-measure)

### Values distant from most other values are?

Outliers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/values-distant-from-most-other-values-are)

### How do you handle missing values in a dataset?

> **Flashcard:** Give 3 techniques for handling missing values.

Delete rows (or columns) with missing data; impute with a simple statistic such as the mean, median or mode; or predict the missing values from the other features with a model such as k-NN or regression imputation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/give-3-techniques-for-handling-missing-values)

### Does mean imputation take feature correlation into account?

No.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/does-mean-imputation-takes-into-account-feature-correlation)

## Probability and distributions

Probability questions build from conditional probability to Bayes' theorem, often through a positive test for a rare condition. The distribution questions cover the normal, binomial and Poisson, density functions, maximum likelihood, and the two results that make sample means behave: the law of large numbers and the central limit theorem.

### What is conditional probability?

The probability of an event given that another event has happened: P(A \| B) = P(A and B) / P(B). Knowing that B happened shrinks the outcomes to those where B holds, and A's probability is recomputed within them.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-conditional-probability)

### What is the law of total probability?

A way to get an overall probability by splitting into cases: if B₁, …, Bₙ partition the possible outcomes, P(A) = Σ P(A \| Bᵢ) P(Bᵢ). The overall probability is a weighted average of the conditional ones, weighted by how common each case is.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-law-of-total-probability)

### What is Bayes' theorem?

A rule for reversing a conditional probability: P(A \| B) = P(B \| A) P(A) / P(B). It updates a prior belief P(A) with evidence B into a posterior P(A \| B), and it is why a positive test for a rare condition can still be more likely wrong than right.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-bayes-theorem)

### Bayesian vs frequentist statistics: what is the difference?

> **Flashcard:** What is the difference between Bayesian and frequentist statistics?

Frequentists treat parameters as fixed and probability as a long-run frequency, so they reason about how the data would vary over repeated samples. Bayesians treat parameters as uncertain, start from a prior distribution and update it with the data into a posterior.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-bayesian-and-frequentist-statistics)

### What is a probability density function?

A function that describes a continuous random variable: the probability of landing in an interval is the area under the curve over that interval. Its value at a point is a density, not a probability, so it can exceed 1. The cumulative distribution function (CDF) gives P(X ≤ x).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-probability-density-function)

### What two parameters define a normal distribution?

Its mean and its standard deviation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-two-parameters-defined-a-normal-distribution)

### In a normal distribution which parameter indicates where the bell is centered?

The mean.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/in-a-normal-distribution-which-parameter-indicates-where-the-bell-is-centered)

### In a normal distribution, which parameter indicates how wide the bell is?

The standard deviation.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/in-a-normal-distribution-which-parameter-indicates-how-wide-is-the-bell)

### What is the binomial distribution?

The distribution of the number of successes in n independent trials that each succeed with the same probability p: P(k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ. Its mean is np and its variance np(1 − p).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-binomial-distribution)

### What is the Poisson distribution?

The distribution of the number of events in a fixed interval when events happen independently at a constant average rate λ: P(k) = λᵏ e^(−λ) / k!. Its mean and its variance are both λ.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-poisson-distribution)

### What is maximum likelihood estimation?

A way to fit a model's parameters by choosing the values that make the observed data most probable: maximize the likelihood L(θ) = Π p(xᵢ \| θ), in practice its logarithm. Least squares and logistic regression's log loss are both maximum likelihood under particular assumptions.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-maximum-likelihood-estimation)

### What is the Law of Large Numbers?

A theorem stating that as the number of independent trials increases, the average of the results gets closer to the expected value.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-law-of-large-numbers)

### What is the central limit theorem?

> **Flashcard:** The normal distribution derives its importance from which famous theorem?

The Central Limit Theorem: the mean of n independent draws from a distribution with finite variance is approximately normal for large n, whatever the population's shape. That is what justifies normal-based confidence intervals and t-tests on non-normal data, provided the sample is large enough for the data's skew.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/the-normal-distribution-derives-its-importance-from-which-famous-theorem)

## Hypothesis testing

The most tested part of statistics. Know what a p-value and a confidence interval do and don't say, the two ways a test can be wrong and how sample size drives power, which test fits which data (t, z, chi-square, ANOVA, Fisher's exact, and rank-based tests when normality is doubtful), and what running many tests does to the false positive rate.

### What is a p-value?

The probability, if the null hypothesis were true, of getting a result at least as extreme as the one observed. A small p-value means the data would be surprising if there were no effect; it is not the probability that the null hypothesis is true.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-p-value)

### What is statistical significance?

> **Flashcard:** What does it mean for a result to be statistically significant?

That the result would be unlikely if there were no real effect: its p-value is below a threshold, the significance level α, chosen before the test, usually 0.05. It says the effect is probably not zero, not that it is large or important.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-it-mean-for-a-result-to-be-statistically-significant)

### What is a confidence interval?

A range computed from a sample by a method that, over repeated samples, captures the true parameter a stated share of the time, such as 95%. The 95% describes the method, not the chance that this particular interval contains the true value.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-confidence-interval)

### What is a Type I and a Type II error?

Type I errors are false positives (rejecting a true null hypothesis) and Type II errors are false negatives (missing a real effect).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-type-i-and-a-type-ii-error)

### What is statistical power?

The probability that a test rejects the null hypothesis when a real effect of a given size exists, 1 − β. It grows with sample size, effect size and the significance level; 80% is the usual target when planning an experiment.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-statistical-power)

### What is a t-test?

A test of whether a mean differs from a given value, or whether two means differ, when the population standard deviation is unknown and estimated from the sample. The statistic is the difference divided by its standard error, which follows a t distribution under the null hypothesis.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-t-test)

### What is a z-test?

A hypothesis test whose statistic follows a standard normal distribution under the null hypothesis: the difference divided by its standard error, compared with ±1.96 for a two-sided test at 5%. It applies when the standard error is known or the sample is large, as with conversion rates.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-z-test)

### What is a chi-square test?

A test that compares observed counts with the counts expected under a null hypothesis: χ² = Σ (O − E)² / E. The test of independence checks whether two categorical variables are related; the goodness-of-fit test checks whether counts follow an expected distribution.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-chi-square-test)

### What is ANOVA?

Analysis of variance: a test of whether three or more group means are all equal. It compares the variation between the group means with the variation within the groups; a large ratio, the F statistic, says at least one mean differs, but not which.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-anova)

### What is Fisher's exact test?

A test of association in a 2 × 2 table that computes the p-value exactly, from the hypergeometric distribution, instead of relying on the chi-square approximation. It is the standard choice when counts are small, for example when any expected cell count is below 5.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-fishers-exact-test)

### What is the Mann-Whitney U test?

A non-parametric test that compares two independent groups using ranks instead of raw values. It asks whether a value drawn from one group tends to be larger than a value drawn from the other, so it holds up with skewed data and outliers where a t-test struggles.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-mann-whitney-u-test)

### What is the Wilcoxon signed-rank test?

A non-parametric test for paired data, such as before-and-after measurements on the same users. It ranks the absolute differences, then compares the total rank of the positive differences with that of the negative ones. It is the rank-based alternative to the paired t-test.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-wilcoxon-signed-rank-test)

### What is the Kolmogorov-Smirnov test?

A nonparametric test of whether a sample follows a given distribution, or whether two samples come from the same one. Its statistic D is the largest vertical gap between the two cumulative distribution functions.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-kolmogorov-smirnov-test)

### What is bootstrapping in statistics?

Estimating the uncertainty of a statistic by resampling the data with replacement many times, recomputing the statistic on each resample, and using the spread of those values as its sampling distribution. It gives standard errors and confidence intervals without needing a formula.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-bootstrapping-in-statistics)

### What is the Bonferroni correction?

A fix for multiple comparisons: when you run m tests, compare each p-value with α/m instead of α. It keeps the probability of any false positive, the family-wise error rate, at or below α, at the cost of power.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-bonferroni-correction)

### What is the Benjamini-Hochberg procedure?

A multiple-testing correction that controls the false discovery rate, the expected share of false positives among the results called significant. Sort the m p-values, find the largest rank k with p₍ₖ₎ ≤ (k / m) × q, and reject the k smallest.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-benjamini-hochberg-procedure)

### What is p-hacking?

Trying many analyses, such as different metrics, subgroups, outlier rules or stopping points, and reporting only those that reach p \< 0.05. Each extra try is another chance for a false positive, so the reported p-value overstates the evidence.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-p-hacking)

## Experiments, bias and causal inference

Product data science interviews lean on this part: why correlation doesn't prove causation, how confounders, Simpson's paradox and selection or survivorship bias fake an effect, how CUPED makes an A/B test more sensitive, and the methods for when you can't randomize: difference-in-differences, instrumental variables and regression discontinuity.

### Why doesn't correlation imply causation?

Because an association can come from a confounder that drives both variables, from causation running the other way, from how the data were selected, or from chance. Only an experiment, or careful causal analysis of observational data, shows that changing one changes the other.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-doesnt-correlation-imply-causation)

### What is a confounding variable?

A variable that influences both the independent and the dependent variable, distorting the association between them: it can create a spurious link, hide a real effect or even reverse it.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-confounding-variable)

### What is Simpson's paradox?

A trend that shows up in every subgroup of the data reverses, or disappears, when the groups are combined. It happens when a third variable is unevenly spread across the groups, so the right answer depends on the causal story, not the arithmetic.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-simpsons-paradox)

### What is selection bias?

Distortion that occurs when the data you analyze are not representative of the population you want to draw conclusions about, because of how units ended up in the sample. Survivorship bias, non-response bias and self-selection are common forms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-selection-bias)

### What is Survivorship bias?

Is the logical error of concentrating on the people or things that made it past some selection process and overlooking those that did not.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-survivorship-bias)

### What is cluster sampling?

> **Flashcard:** Probability sampling technique in which each sampling unit is a cluster, a group of population elements, rather than a single element.

Cluster sampling.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/technique-used-to-sample-based-on-a-probability-where-each-sample-unit-is-a-collection-of)

### What is CUPED in A/B testing?

Controlled-experiment Using Pre-Experiment Data: a variance reduction method that adjusts each user's metric with a covariate measured before the test, usually the same metric from the pre-period. Less variance means narrower confidence intervals, so a test reaches the same power with fewer users.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-cuped-in-a-b-testing)

### What is difference-in-differences?

A method that estimates a causal effect by comparing the change over time in a treated group with the change in an untreated group over the same period. Subtracting the control group's change removes trends that affect both groups, such as seasonality.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-difference-in-differences)

### What is an instrumental variable?

A variable that changes the treatment but affects the outcome only through the treatment, used to estimate a causal effect when unmeasured confounders make a direct comparison biased. The effect is the instrument's effect on the outcome divided by its effect on the treatment.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-an-instrumental-variable)

### What is regression discontinuity design?

A causal method for treatments assigned by a cutoff on a score, such as a scholarship for test scores above a threshold. Units just above and just below the cutoff are nearly identical, so a jump in the outcome right at the cutoff estimates the treatment's effect there.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-regression-discontinuity-design)

## Correlation, regression and time series

Correlation questions check that you can tell covariance from correlation and know that a Pearson correlation of zero doesn't rule out a relationship. Regression questions are about diagnostics: residuals, R-squared and its adjusted version, heteroscedasticity and multicollinearity. Two cards cover autocorrelation and stationarity in time series.

### What is the difference between covariance and correlation?

Correlation is covariance divided by the two standard deviations, so it is unitless and bounded in \[-1, 1\], while covariance carries the units of both variables and has no fixed scale. That is what makes correlation comparable across pairs; both only capture linear association.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-difference-between-covariance-and-correlation)

### If pearson correlation is 0 between two variables can we assume that there isn't any relation between them?

No. Pearson correlation coefficient between 2 variables might be zero even when they have a relationship between them. Example: x and x^2

[Read the longer answer →](https://www.datasciencetrivia.com/questions/if-pearson-correlation-is-0-between-two-variables-can-we-assume-that-there-isnt-any)

### Is it possible to capture the correlation between a continuous and a categorical variable?

Yes. Use the point-biserial correlation when the category has two levels, or one-way ANOVA with eta squared (the correlation ratio) for more levels; Kruskal-Wallis if the data are skewed. ANCOVA answers a different question: it compares group means while adjusting for a continuous covariate.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-it-possible-capture-the-correlation-between-continuous-and-categorical-variable)

### What is a residual?

It is the difference between the observed value and the value estimated by the model: eᵢ = yᵢ − ŷᵢ.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-residual)

### What is R-squared?

R-squared, the coefficient of determination, is the proportion of variance in the target that the model explains: R² = 1 − SS\_res / SS\_tot. 1 is a perfect fit, 0 is no better than predicting the mean, and on new data it can even be negative.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-r-squared)

### What is adjusted R-squared?

R-squared corrected for the number of predictors: 1 − (1 − R²)(n − 1)/(n − p − 1), with n rows and p predictors. Unlike R², it only rises when a new predictor improves the fit by more than chance would, so it can fall when you add a useless one.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-adjusted-r-squared)

### What is heteroscedasticity?

When the spread of a regression's errors changes across the range of the inputs instead of staying constant, which is called homoscedasticity. The coefficient estimates stay unbiased, but the usual standard errors, and so the p-values and confidence intervals, become unreliable.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-heteroscedasticity)

### What is multicollinearity?

When two or more predictors in a regression are strongly correlated, so the model can't separate their individual effects. Their coefficients get large standard errors and can swing or flip sign between samples, though the predictions are often fine.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-multicollinearity)

### What is autocorrelation?

It is the correlation of a signal with a delayed copy of itself, as a function of the delay (lag).

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-autocorrelation)

### What does stationarity in a dataset mean?

A property of data in a dataset, in which the data distribution stays constant across one or more dimensions. Most commonly, that dimension is time.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-stationarity-in-a-dataset-means)

## Model errors and metrics

The statistics side of model evaluation: false positives and false negatives, precision as a ratio, precision and recall at k for ranked results, and the squared-error metrics MSE and RMSE. The machine learning cards cover the other metrics.

### What is a false positive?

An example in which the model mistakenly predicted the positive class.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-false-positive)

### What is a false negative?

An example in which the model mistakenly predicted the negative class.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-false-negative)

### Precision is the ratio between which two quantities?

True positives over predicted positives, TP / (TP + FP): of the cases you flagged, how many were right. It says nothing about the positives you missed, so it is read alongside recall, and it is the metric to favour when a false alarm is the costly error.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/precision-is-the-rate-between)

### What is precision and recall at k?

Precision at k and recall at k are evaluation metrics for ranking algorithms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-precision-and-recall-at-k)

### What is MSE?

MSE stands for Mean Squared Error. And is a measure of how close a fitted line is to data points by measuring the average squared of the errors.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-mse)

### What is RMSE?

Root Mean Squared Error: the square root of MSE, which puts the error back in the units of the target. Squaring first lets large misses dominate, so RMSE is always at least MAE and far more outlier-sensitive — report MAE too when a handful of extreme rows drives the number.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-rmse)

## PCA, clustering and divergences

PCA and SVD for reducing dimensions, the elbow and silhouette methods for picking k in k-means, and KL and Jensen-Shannon divergence for measuring how far apart two distributions are, which drift monitoring often relies on.

### What is dimensionality reduction?

It is the process of reducing the number of variables under consideration by obtaining a set of principal variables.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-dimensionality-reduction)

### What are the common dimensionality reduction techniques?

> **Flashcard:** Name three techniques of dimensionality reduction.

Singular Value Decomposition (SVD), Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA), Autoencoders, Fourier and Wavelet Transforms.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-techniques-of-dimensionality-reduction)

### Is rotation necessary in PCA?

Not as an extra step: PCA is itself an orthogonal rotation of the axes onto the directions of maximum variance. A further rotation such as varimax is optional and only aids interpretation; it keeps the total explained variance but loses the variance-maximizing order.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/is-rotation-necessary-in-pca)

### How can we select K for K-means?

Domain knowledge first, then the elbow of inertia against k, average silhouette, or the gap statistic. Inertia falls monotonically, so the elbow is often ambiguous; silhouette scores separation as well as compactness. If a downstream use defines the segments, let that pick k.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-can-we-select-k-for-k-means)

### What is KL divergence?

The Kullback-Leibler divergence, KL(P ‖ Q) = Σ P(x) log(P(x) / Q(x)), measures how much information is lost when Q is used to approximate P. It is never negative, is zero only when P = Q, and is not symmetric, so it is not a distance.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-kl-divergence)

### What is the Jensen-Shannon divergence?

A symmetric, bounded measure of the difference between two distributions: the average KL divergence of each from their mixture M = (P + Q) / 2. It is 0 for identical distributions, at most ln 2 (1 bit), and stays finite even when the distributions don't overlap.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-jensen-shannon-divergence)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

# Deep Learning interview questions and answers

<!-- Generated from content/questions.json by `npm run export:questions`. Edit the JSON, not this file. -->

56 deep learning questions with short answers, from [Data Science Trivia](https://www.datasciencetrivia.com), free flashcards for data science and machine learning interviews. Neural networks from backpropagation to attention, and the tricks that make them trainable.

Every question links to its page on the site, with a longer answer. To test yourself instead of reading, [flip through them as flashcards](https://www.datasciencetrivia.com/categories/deep-learning).

[All categories](README.md)

## What is stochastic gradient descent?

> **Flashcard:** Type of gradient descent where we use only a single training example to calculate the gradient and update the parameters.

Stochastic Gradient Descent.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/type-of-backpropagation-where-we-use-only-a-single-training-example-for-calculation-of)

## What is batch gradient descent?

> **Flashcard:** Type of gradient descent where we use the whole dataset to perform a single update step.

Batch Gradient Descent.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/type-of-backpropagation-where-we-use-the-whole-dataset-to-perform-a-single-step)

## What is mini-batch gradient descent?

> **Flashcard:** Type of gradient descent where we use a fixed number of training examples, fewer than the whole dataset, to calculate the gradient.

Mini-batch Gradient Descent.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/type-of-backpropagation-where-we-use-a-fixed-number-of-training-examples-which-is-lees)

## What are some popular deep learning frameworks?

> **Flashcard:** Name three different deep learning frameworks.

PyTorch, TensorFlow and JAX. Keras is a popular high-level API that runs on top of them; older frameworks include Caffe and Theano.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/name-three-different-deep-learning-frameworks)

## What is AdaGrad?

A sophisticated gradient descent algorithm that rescales the gradients of each parameter, effectively giving each parameter an independent learning rate.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-adagrad)

## What are the two actors in a convolution operation?

Convolutional filter and a slice of an input matrix.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-ones-are-two-actors-in-a-convolutional-operation)

## How does dropout regularization work in deep learning?

During training, each unit in a layer is set to zero independently with probability p on every forward pass, so each gradient step trains a different random sub-network. At inference no units are dropped.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/how-does-dropout-regularization-works-in-deep-learning)

## What is an epoch?

A full training pass over the entire dataset such that each example has been seen once.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-an-epoch)

## What is a batch?

The set of training examples processed together in one forward and one backward pass, producing one weight update. The number of examples in it is the batch size.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-a-batch)

## Which are the two components of a Generative Adversarial Network?

A generator that turns noise into samples and a discriminator that judges them real or fake, trained against each other in a minimax game. The tension is the point and also the difficulty: unstable training and mode collapse, where the generator serves one convincing output.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-are-the-two-components-of-a-generative-adversarial-network)

## What is the function of the generator in a GAN?

It creates new examples.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-function-of-the-generator-in-a-gan)

## What is the function of the discriminator in a GAN?

Determine whether examples are real or fake.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-the-function-of-the-discriminator-in-a-gan)

## What does gradient descent try to minimize?

A loss function.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-gradient-descent-tries-to-minimize)

## Which activation function outputs max(0, x)?

> **Flashcard:** Which activation function follows these rules: If input is negative or zero, output is 0 and if input is positive, output is equal to input.

ReLU, the rectified linear unit, max(0, x). It is cheap and its gradient is exactly 1 on the positive side, so it does not saturate as sigmoid and tanh do, which is much of why deep stacks became trainable. Its failure mode is dead units stuck at zero.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/which-activation-function-follows-these-rules-if-input-is-negative-or-zero-output-is-0)

## What does the softmax function do?

> **Flashcard:** Explain what a softmax function does.

Provides probabilities for each possible class in a multi-class classification model. The probabilities add up to exactly 1.0

[Read the longer answer →](https://www.datasciencetrivia.com/questions/explain-what-a-softmax-function-does)

## What is learning rate?

Is a tuning parameter in an optimization algorithm that determines the step size at each iteration while moving toward a minimum of a loss function.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-learning-rate)

## What does LSTM mean?

Long Short-Term Memory.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-lstm-means)

## What type of layer typically has a cell, an input gate, an output gate and a forget gate?

An LSTM. The cell state carries information along a mostly additive path while the gates learn what to write, forget and read, which is how it survives the vanishing gradients that stall plain RNNs on long sequences. Attention has since displaced it for most sequence work.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/type-of-layer-that-tipically-has-a-cell-input-gate-output-gate-and-a-forget-gate)

## Sigmoid squishes values to be between?

0 and 1, which is what makes it the right output layer for a binary probability. Inside a deep network it is a poor choice: gradients vanish once inputs saturate at either tail, and its output is not zero-centred, so ReLU-family activations replaced it in hidden layers.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/sigmoid-squishes-values-to-be-between)

## What does GRU mean?

Gated Recurrent Unit.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-does-gru-means)

## Tanh function squishes values to be between?

-1 and 1

[Read the longer answer →](https://www.datasciencetrivia.com/questions/tanh-function-squishes-values-to-be-between)

## Type of layer that typically has a reset gate and an update gate?

A GRU. It folds the LSTM's cell and hidden state into one and drops a gate, so it has fewer parameters and trains faster, usually matching LSTM accuracy on short and medium sequences.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/type-of-layer-that-tipically-has-a-reset-gate-and-a-output-gate)

## What if we set all the weights of a neural network to 0?

The network can't learn useful features: every unit in a layer computes the same output and gets the same gradient, so the symmetry never breaks. With tanh or ReLU the weights don't move at all; with sigmoid they move in lockstep. Use small random weights instead.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-if-we-set-all-the-weights-of-a-neural-network-to-0)

## What happens when the learning rate is too large?

Can accelerate the training. However, it is possible that we “shoot” too far and miss the minimum of the function that we want to optimize.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-happens-when-the-learning-rate-is-too-large)

## What happens when the learning rate is too small?

Training is slow: tiny steps need many more iterations, and on a fixed budget the model may stop before converging. With noisy mini-batch gradients it does settle closer to a minimum, but it can't step past a poor nearby minimum or a plateau.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-happens-when-the-learning-rate-is-too-small)

## Why do we need activation functions?

Without a nonlinear activation, stacked layers collapse into one linear map: W₂(W₁x + b₁) + b₂ is just another linear function of x. Activation functions add the nonlinearity that lets a neural network learn complex functions, such as XOR, that no linear model can represent.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-do-we-need-activation-functions)

## What are the problems with sigmoid as an activation function?

The output of the sigmoid function for large positive or negative numbers is almost zero. From this comes the problem of vanishing gradient.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-are-the-problems-with-sigmoid-as-an-activation-function)

## What is ReLU? How is it better than sigmoid?

ReLU, max(0, x), zeroes negative inputs and passes positive ones through. Unlike sigmoid it doesn't saturate for positive inputs, where its gradient is 1, so it greatly reduces vanishing gradients in deep networks, and it is cheaper to compute.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-relu-how-is-it-better-than-sigmoid)

## What’s pooling in CNN? Why do we need it?

Pooling downsamples each feature map by summarizing small windows, usually with the max or the average. It reduces spatial size and computation, lets deeper layers cover a larger part of the input, and makes features somewhat robust to small shifts. It has no learned weights.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/whats-pooling-in-cnn-why-do-we-need-it)

## Why did the embedding layers and all sub-layers of the original Transformer (Attention Is All You Need, 2017) need the same output dimension?

Because of the residual connections.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/why-did-the-output-dimension-of-all-the-embedding-and-sublayers-of-original-transformer)

## Is one-hot encoding good for high-cardinality categorical features?

> **Flashcard:** One hot encoding is an excellent solution to transform categorical features with high cardinality.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/one-hot-encoding-is-an-excellent-solution-to-transform-categorical-features-with-high)

## Is the F1 score the harmonic mean of precision, recall and accuracy?

> **Flashcard:** The F1 Score is a metric defined as the harmonic mean of precision, recall, and accuracy.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/the-f1-score-is-a-metric-defined-as-the-harmonic-mean-of-precision-recall-and-accuracy)

## Does adding hidden layers increase a neural network's capacity?

> **Flashcard:** As the number of hidden layers increases in a neural network, its capacity also increases.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/as-the-number-of-hidden-layers-increases-in-a-neural-network-its-capacity-also-increases)

## Should you initialize neural network weights to zero?

> **Flashcard:** Initializing a neural network’s weights with zero is our best bet to allow the network to converge.

False: with zero weights every unit in a layer computes the same thing and receives the same gradient, so the symmetry never breaks and the layer behaves like a single neuron. Use small random values scaled to the layer's size: He (variance 2/fan\_in) for ReLU, Xavier (variance 2/(fan\_in + fan\_out)) for tanh. Biases can start at zero.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/initializing-a-neural-networks-weights-with-zero-is-our-best-bet-to-allow-the-network-to)

## Does a higher dropout rate increase a neural network's capacity?

> **Flashcard:** As the dropout ratio used in a neural network increases, the network’s capacity also increases.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/as-the-dropout-ratio-used-in-a-neural-network-increases-the-networks-capacity-also)

## Should you use SGD when the dataset doesn't fit in memory?

> **Flashcard:** Stochastic Gradient Descent is the proper technique to use when the full dataset doesn’t fit in memory.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/stochastic-gradient-descent-is-the-proper-technique-to-use-when-the-full-dataset-doesnt)

## Is batch normalization a backpropagation technique?

> **Flashcard:** Batch Normalization is an efficient backpropagation technique that allows neural networks to learn.

False — it is a normalization layer, not a backpropagation technique. It standardises each activation across the mini-batch, then rescales with learned parameters, which smooths optimisation and allows higher learning rates. Batch statistics also add noise, so it regularises mildly.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/batch-normalization-is-an-efficient-backpropagation-technique-that-allows-neural-networks)

## Is gradient descent used to reduce overfitting?

> **Flashcard:** Gradient Descent is an algorithm used to minimize overfitting in neural networks.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/gradient-descent-is-an-algorithm-used-to-minimize-overfitting-in-neural-networks)

## Is high bias the same as overfitting?

> **Flashcard:** Having high bias means the model is too simple and can’t capture many features during the training phase. This is also known as overfitting.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/having-high-bias-means-the-model-is-too-simple-and-cant-capture-many-features-during-the)

## Does precision measure a model's ability to find only relevant samples?

> **Flashcard:** Precision is a performance metric that defines a classification model's ability to identify only relevant samples.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/precision-is-a-performance-metric-that-defines-a-classification-models-ability-to)

## Does recall measure a model's ability to find all relevant samples?

> **Flashcard:** Recall is a performance metric that measures a classification model's ability to identify all relevant samples.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/recall-is-a-performance-metric-that-defines-a-classification-models-ability-to-identify)

## Does softmax return the input if it's positive and zero otherwise?

> **Flashcard:** Softmax is an activation function that always returns the input value if it’s positive and zeroes otherwise.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/softmax-is-an-activation-function-that-always-returns-the-input-value-if-its-positive-and)

## Is an activation function's main role to decide whether a neuron fires?

> **Flashcard:** In neural networks, an activation function’s most essential role is to decide whether a unit or neuron should fire.

False. The fire-or-not idea comes from early step-function neurons. An activation function's essential role is to add nonlinearity, without which stacked layers collapse into one linear map.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/in-neural-networks-an-activation-functions-most-essential-role-is-to-decide-whether-a)

## Does a learning rate that is too low slow down training?

> **Flashcard:** Using a learning rate that’s too low will cause the training process to be very slow.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/using-a-learning-rate-thats-too-low-will-cause-the-training-process-to-be-very-slow)

## Does ReLU output values that sum to one?

> **Flashcard:** ReLU is an activation function that, given an input vector, generates an output where the sum of the values in the vector is equal to one.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/relu-is-an-activation-function-that-given-an-input-vector-generates-an-output-where-the)

## Does an autoencoder learn by using its inputs as the target?

> **Flashcard:** An autoencoder is a neural network that automatically learns by using its inputs as the expected output.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/an-autoencoder-is-a-neural-network-that-automatically-learns-by-using-its-inputs-as-the)

## Are convolutional neural networks translation invariant?

> **Flashcard:** Convolutional neural networks are translation invariant.

False as stated: convolution layers are translation equivariant, and pooling makes a CNN only approximately invariant to small shifts.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/convolutional-neural-networks-are-translation-invariant)

## Are autoencoders a supervised learning method?

> **Flashcard:** Autoencoders are one of the most popular supervised learning methods.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/autoencoders-are-one-of-the-most-popular-supervised-learning-methods)

## Is giving each input exactly one class called multi-class classification?

> **Flashcard:** The type of problem where you need to classify the input into a single class is called multi class classification.

True, when there are three or more classes: each input gets exactly one label. With two classes it's binary classification; when an input can carry several labels at once, it's multi-label classification.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/the-type-of-problem-where-you-need-to-classify-the-input-into-a-single-class-is-called)

## Does dropout speed up neural network training?

> **Flashcard:** Dropout is an excellent regularization technique that speeds the training process.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/dropout-is-an-excellent-regularization-technique-that-speeds-the-training-process)

## Can a neural network with a single layer approximate any function?

> **Flashcard:** A neural network with a single layer is capable of approximating any function.

True with conditions: by the universal approximation theorem, one hidden layer with enough units and a non-polynomial activation can approximate any continuous function on a closed, bounded domain. With no hidden layer, a network only draws linear boundaries and can't even fit XOR.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/a-neural-network-with-a-single-layer-is-capable-of-approximating-any-function)

## Does leaky ReLU let small negative values pass through?

> **Flashcard:** Leaky ReLU is an activation function that lets small negative values pass through when a neuron's input is less than zero.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/leaky-relu-is-an-activation-function-that-allows-the-passing-of-small-sized-negative)

## Does bagging mean splitting a dataset into random bags?

> **Flashcard:** Bagging is the concept of splitting a dataset and randomly placing it into bags for training a model.

False

[Read the longer answer →](https://www.datasciencetrivia.com/questions/bagging-is-the-concept-of-splitting-a-dataset-and-randomly-placing-it-into-bags-for)

## Is a categorical feature one that takes a limited set of values?

> **Flashcard:** A categorical feature is a feature that can only take a limited number of possible values.

True

[Read the longer answer →](https://www.datasciencetrivia.com/questions/a-categorical-feature-is-a-feature-that-can-only-take-a-limited-number-of-possible-values)

## What is intersection over union (IoU)?

A measure of overlap between a predicted region and the ground truth: the area of their intersection divided by the area of their union. It runs from 0 for no overlap to 1 for a perfect match and is the standard score for detection boxes and segmentation masks.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-intersection-over-union-iou)

## What is focal loss?

A version of cross-entropy that down-weights easy examples: FL = −(1 − p\_t)^γ log(p\_t), where p\_t is the probability given to the true class. With γ \> 0, well-classified examples contribute little, so training concentrates on the hard ones; γ = 0 gives back cross-entropy.

[Read the longer answer →](https://www.datasciencetrivia.com/questions/what-is-focal-loss)

---

Spotted a mistake or have a question to add? Open an issue or a pull request against [content/questions.json](../content/questions.json).

import { getAllQuestions, type QuestionWithSlug } from "./questions";

/**
 * Milestones for /ai-history, oldest first. Most of them are told by a card in
 * the History category, and `cards` links the event to them so the timeline
 * and the deck stay one body of content rather than two. A few landmarks have
 * no card yet (Dartmouth, ChatGPT); they are here because a history of AI that
 * skips them would not answer the question someone searched for.
 *
 * A card id that is not in the deck fails the build in `getTimeline()`.
 */
interface TimelineEntry {
  year: number;
  title: string;
  text: string;
  cards?: string[];
}

const ENTRIES: TimelineEntry[] = [
  {
    year: 1763,
    title: "Bayes' theorem is published, after Bayes",
    text: "Richard Price publishes Thomas Bayes' essay on inverse probability two years after Bayes' death. The idea of updating a belief with evidence sits under every probabilistic model that followed.",
    cards: ["history-136"],
  },
  {
    year: 1805,
    title: "Legendre publishes least squares",
    text: "Adrien-Marie Legendre describes the method of least squares for fitting orbits to noisy observations. Linear regression is still fitted the same way.",
    cards: ["history-111"],
  },
  {
    year: 1812,
    title: "Laplace's Théorie analytique des probabilités",
    text: "Pierre-Simon Laplace states Bayes' theorem in the general form used today, half a century after Bayes' essay.",
    cards: ["history-112"],
  },
  {
    year: 1913,
    title: "Markov counts the letters of a poem",
    text: "Andrey Markov analyses the sequence of vowels and consonants in Pushkin's Eugene Onegin, the first real application of what became Markov chains.",
    cards: ["history-113"],
  },
  {
    year: 1943,
    title: "The first model of an artificial neuron",
    text: "Warren McCulloch and Walter Pitts describe a neuron as a threshold unit that fires when its weighted inputs pass a limit, the building block of every neural network since.",
  },
  {
    year: 1950,
    title: "Turing proposes the imitation game",
    text: "Alan Turing's paper \"Computing Machinery and Intelligence\" replaces the question \"can machines think?\" with a test judged over text: the Turing Test.",
    cards: ["history-126"],
  },
  {
    year: 1951,
    title: "SNARC, the first neural network machine",
    text: "Marvin Minsky and Dean Edmonds build SNARC, a machine of about 40 artificial neurons that learned to find its way through a maze.",
    cards: ["history-114"],
  },
  {
    year: 1956,
    title: "The Dartmouth workshop names the field",
    text: "John McCarthy, Marvin Minsky, Claude Shannon and Nathaniel Rochester run a summer workshop at Dartmouth College whose proposal coined the term \"artificial intelligence\".",
  },
  {
    year: 1958,
    title: "Rosenblatt's perceptron",
    text: "Frank Rosenblatt publishes the perceptron, a single-layer network that learns its weights from examples. The press coverage promised far more than one layer could deliver.",
    cards: ["history-115"],
  },
  {
    year: 1967,
    title: "Nearest neighbours gets its theory",
    text: "Thomas Cover and Peter Hart publish the error bounds for the nearest neighbor rule, the classifier that simply looks up the closest known example.",
    cards: ["history-125"],
  },
  {
    year: 1970,
    title: "Linnainmaa's reverse-mode differentiation",
    text: "Seppo Linnainmaa publishes the general method for reverse-mode automatic differentiation, the algorithm behind backpropagation. Rumelhart, Hinton and Williams popularised it for neural networks in 1986.",
    cards: ["history-116"],
  },
  {
    year: 1989,
    title: "Q-learning and convolutional nets",
    text: "Christopher Watkins introduces Q-learning in his PhD thesis \"Learning from Delayed Rewards\". The same year Yann LeCun trains a convolutional network with backpropagation to read handwritten zip codes.",
    cards: ["history-133", "history-134"],
  },
  {
    year: 1993,
    title: "R is announced",
    text: "Statisticians Ross Ihaka and Robert Gentleman announce R, a free language for statistical computing that became a default tool of data analysis.",
    cards: ["history-131", "history-132"],
  },
  {
    year: 1995,
    title: "Random forests and support vector machines",
    text: "Tin Kam Ho publishes random decision forests, and Corinna Cortes and Vladimir Vapnik publish support-vector networks. Both remain strong baselines on tabular data.",
    cards: ["history-117", "history-118"],
  },
  {
    year: 1997,
    title: "Deep Blue beats Kasparov, and the LSTM",
    text: "IBM's Deep Blue defeats world chess champion Garry Kasparov in a six-game match. Sepp Hochreiter and Jürgen Schmidhuber publish the LSTM, the recurrent architecture that dominated sequence modelling for two decades.",
    cards: ["history-119", "history-120"],
  },
  {
    year: 1998,
    title: "MNIST",
    text: "Yann LeCun, Corinna Cortes and Christopher Burges release MNIST, 70,000 images of handwritten digits that became the field's first benchmark.",
    cards: ["history-110"],
  },
  {
    year: 2002,
    title: "Torch is released",
    text: "The Torch machine learning library is released. Its design later carried over to PyTorch.",
    cards: ["history-121"],
  },
  {
    year: 2006,
    title: "Deep learning gets its name back",
    text: "Geoffrey Hinton's work on deep belief networks shows that deep networks can be trained layer by layer, and puts the term \"deep learning\" at the centre of the field.",
    cards: ["history-127", "history-141"],
  },
  {
    year: 2007,
    title: "Theano",
    text: "The Montreal Institute for Learning Algorithms releases Theano, one of the first libraries to compile and differentiate numerical expressions on the GPU.",
    cards: ["history-138"],
  },
  {
    year: 2009,
    title: "ImageNet",
    text: "Fei-Fei Li's team presents ImageNet, millions of labelled images across thousands of categories, built on the bet that models were starved of data rather than ideas.",
    cards: ["history-122"],
  },
  {
    year: 2012,
    title: "AlexNet wins ImageNet",
    text: "Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton win the ImageNet challenge by a wide margin with a GPU-trained convolutional network written in CUDA and C++. This is the moment deep learning went mainstream.",
    cards: ["history-139"],
  },
  {
    year: 2014,
    title: "Generative adversarial networks",
    text: "Ian Goodfellow and colleagues introduce GANs, two networks trained against each other until one can generate convincing samples.",
    cards: ["history-109"],
  },
  {
    year: 2015,
    title: "Keras and TensorFlow",
    text: "François Chollet releases Keras in March, and Google open-sources TensorFlow in November. Deep learning becomes something most engineers can try.",
    cards: ["history-129", "history-128"],
  },
  {
    year: 2016,
    title: "AlphaGo beats Lee Sedol, and PyTorch",
    text: "DeepMind's AlphaGo, running on Google's TPUs, beats Lee Sedol 4-1 at Go. At NIPS, Yann LeCun describes intelligence as a cake. Facebook releases PyTorch.",
    cards: ["history-123", "history-140", "history-143", "history-137", "history-130"],
  },
  {
    year: 2017,
    title: "Attention Is All You Need",
    text: "Vaswani et al. publish the Transformer, a model built entirely on attention with 512-dimensional embeddings. Every large language model since descends from it.",
    cards: ["history-142"],
  },
  {
    year: 2018,
    title: "The Turing Award for deep learning",
    text: "Yoshua Bengio, Geoffrey Hinton and Yann LeCun receive the 2018 Turing Award for the conceptual and engineering breakthroughs that made deep neural networks practical.",
    cards: ["history-124", "history-135"],
  },
  {
    year: 2022,
    title: "ChatGPT",
    text: "OpenAI releases ChatGPT in November, a chat interface on a Transformer language model tuned with human feedback, and large language models reach the general public.",
  },
];

export interface TimelineEvent extends Omit<TimelineEntry, "cards"> {
  cards: QuestionWithSlug[];
}

export function getTimeline(): TimelineEvent[] {
  const byId = new Map(getAllQuestions().map((q) => [q.id, q]));
  return ENTRIES.map((e) => ({
    ...e,
    cards: (e.cards ?? []).map((id) => {
      const q = byId.get(id);
      if (!q) throw new Error(`Timeline ${e.year} "${e.title}" links unknown card "${id}"`);
      return q;
    }),
  }));
}

/** First and last year on the timeline, for titles and descriptions. */
export const TIMELINE_SPAN = {
  from: ENTRIES[0].year,
  to: ENTRIES[ENTRIES.length - 1].year,
} as const;

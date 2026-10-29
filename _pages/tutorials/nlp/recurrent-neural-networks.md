---
layout: archive
title: "Recurrent Neural Networks (RNNs)"
permalink: /Resources/nlp/recurrent-neural-networks/
author_profile: true
---

[Back to NLP Index](/Resources/nlp/)

<!-- Overview -->
<div class="problem-card" id="rnn-overview">
    <div class="problem-header">
        <h3 class="problem-title">Recurrent Neural Networks (RNNs)</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Topics:</strong> RNN idea, RNN for NLP task types, Word2vec vs RNN</div>
        <div class="meta-item"><strong>Variants:</strong> Traditional RNN, LSTM</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Word2vec gives every word a fixed vector but ignores the order of words in a sentence. A Recurrent Neural Network (RNN) fixes this by reading text one token at a time and keeping a memory of what it has seen so far. The same network step is reused at every position, and its memory (the hidden state) is passed from one step to the next. This page covers how an RNN works, how it is arranged for classification, multi-classification and generation, and how it compares with Word2vec.</p>
</div>

<!-- Topic 1 -->
<div class="problem-card" id="how-rnn-works">
    <div class="problem-header">
        <h3 class="problem-title">1. How an RNN Works</h3>
        <span class="badge badge-medium">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> One token at each time step</div>
        <div class="meta-item"><strong>Passed Forward:</strong> Hidden state (memory)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>An RNN processes a sentence from left to right. At each step it takes the current token and the hidden state from the previous step, and from them it produces a new hidden state and, if needed, an output. Because the hidden state carries information from earlier words, the prediction at each position depends on everything read before it. Drawn out over time ("unrolled"), the RNN looks like a chain of identical blocks that share the same weights.</p>
    <p><img src="/images/rnn-unrolled.svg" alt="An unrolled RNN reads A, cute, teddy bear and is one at a time, passing a hidden state forward, and predicts the next word at each step, ending with reading" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Sentence: "A cute teddy bear is reading"

Step 1: input "A"           -> predict "cute"
Step 2: input "cute"        -> predict "teddy bear"
Step 3: input "teddy bear"  -> predict "is"
Step 4: input "is"          -> predict "reading"

At step 4 the hidden state still carries information about
"A cute teddy bear", so the model can guess a word like "reading".
    {% endhighlight %}
</div>

<!-- Architectures overview -->
<div class="problem-card" id="rnn-for-nlp-tasks">
    <div class="problem-header">
        <h3 class="problem-title">2. RNN Architectures for NLP Tasks</h3>
        <span class="badge badge-medium">Architecture</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Task Families:</strong> Classification, "Multi"-classification, Generation</div>
        <div class="meta-item"><strong>Building Block:</strong> The same RNN cell, wired differently</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>The three NLP task families from the earlier overview can all be built from the same RNN cell. What changes is where the outputs are read: only at the end, at every step, or after the whole input has been read. In the diagram, green boxes are inputs and the starting state, blue boxes are RNN cells, and red boxes are outputs.</p>
    <p><img src="/images/rnn-task-architectures.svg" alt="Three RNN layouts: classification with one output at the last step, multi-classification with an output at every step, and generation with an encoder that reads the source followed by a decoder that writes the output" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
</div>

<!-- Topic 2.1 -->
<div class="problem-card" id="rnn-classification">
    <div class="problem-header">
        <h3 class="problem-title">2.1 Classification (Many-to-One)</h3>
        <span class="badge badge-easy">Classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sequence of tokens</div>
        <div class="meta-item"><strong>Output:</strong> One label, from the last step</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>The RNN reads the whole input text token by token and ignores the outputs of the earlier steps. Only the final hidden state, which now summarizes the entire text, is used to produce one label. This fits tasks such as sentiment analysis, where a whole opinion is mapped to a single class.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "The food was great but the service was slow"
        x(1)  x(2) ...                              x(Tx)
Output: one label from the last step -> Mixed / Neutral
    {% endhighlight %}
</div>

<!-- Topic 2.2 -->
<div class="problem-card" id="rnn-multi-classification">
    <div class="problem-header">
        <h3 class="problem-title">2.2 "Multi"-classification (Many-to-Many, Same Length)</h3>
        <span class="badge badge-medium">Multi-classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sequence of tokens</div>
        <div class="meta-item"><strong>Output:</strong> One label per token</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Here the RNN produces an output at every time step, so the output sequence has the same length as the input. Each tag is predicted using the current token and the hidden state built from all earlier tokens. This is the layout used for part-of-speech tagging and named entity recognition.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : Sundar   Pichai   works   at   Google
Output: PERSON   PERSON   O       O    ORG
    {% endhighlight %}
</div>

<!-- Topic 2.3 -->
<div class="problem-card" id="rnn-generation">
    <div class="problem-header">
        <h3 class="problem-title">2.3 Generation (Many-to-Many, Encoder and Decoder)</h3>
        <span class="badge badge-hard">Generation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A source text of length Tx</div>
        <div class="meta-item"><strong>Output:</strong> A new text of length Ty (can differ from Tx)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>For generation, the RNN first reads the entire source text without producing any output, which builds up a summary in its hidden state. It then continues from that state and writes the output tokens one by one. Because the reading part and the writing part are separate, the output length does not have to match the input length. This layout is used for machine translation and summarization.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Source (read first): "How are you?"        (English, 3 tokens)
Output (written)   : "¿Cómo estás?"        (Spanish, 2 tokens)
    {% endhighlight %}
</div>

<!-- Topic 3 -->
<div class="problem-card" id="word2vec-vs-rnn">
    <div class="problem-header">
        <h3 class="problem-title">3. Summary of Main Methods: Word2vec vs RNN</h3>
        <span class="badge badge-hard">Comparison</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Compared:</strong> Word2vec (CBOW, Skip-gram) and RNNs (traditional RNN, LSTM)</div>
        <div class="meta-item"><strong>Note:</strong> This list of methods is not exhaustive</div>
    </div>
    <div class="section-subtitle">Summary Table</div>
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>Pros</th>
                <th>Cons</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Word2vec</strong><br>e.g. CBOW, Skip-gram</td>
                <td>
                    <ul>
                        <li>Very simple, yet powerful</li>
                        <li>Intuitive embeddings</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Word order does not count</li>
                        <li>Embeddings not context aware</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td><strong>Recurrent Neural Networks</strong><br>e.g. traditional RNN, LSTM</td>
                <td>
                    <ul>
                        <li>Word order matters</li>
                        <li>State-of-the-art results</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Vanishing gradient problem</li>
                        <li>Slow computations</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="section-subtitle">Word2vec: Pros</div>
    <p><strong>Very simple, yet powerful:</strong> The model is a small shallow network trained on an easy prediction task, but the vectors it learns work well for many downstream tasks. <strong>Intuitive embeddings:</strong> Similar words get similar vectors, so distances and directions in the space have a clear meaning (for example, "teddy bear" is close to "soft").</p>

    <div class="section-subtitle">Word2vec: Cons</div>
    <p><strong>Word order does not count:</strong> CBOW treats the context as a bag of words, so "dog bites man" and "man bites dog" look alike to it. <strong>Embeddings not context aware:</strong> Each word has one fixed vector, so a word with several meanings, such as "bank" in "river bank" and "bank account", gets the same vector in both sentences.</p>

    <div class="section-subtitle">RNN: Pros</div>
    <p><strong>Word order matters:</strong> The hidden state is updated token by token, so the model can tell "dog bites man" from "man bites dog", and the representation of a word depends on its context. <strong>State-of-the-art results:</strong> RNNs, especially LSTMs, gave the best results on many NLP tasks such as translation and tagging before newer architectures such as Transformers became popular.</p>

    <div class="section-subtitle">RNN: Cons</div>
    <p><strong>Vanishing gradient problem:</strong> During training, the learning signal is passed backward through every time step and tends to shrink along the way. As a result, a plain RNN struggles to learn links between words that are far apart, and LSTMs were designed with gates to ease this problem. <strong>Slow computations:</strong> Each step needs the result of the previous one, so tokens cannot be processed in parallel, which makes training and inference slow on long texts.</p>
</div>

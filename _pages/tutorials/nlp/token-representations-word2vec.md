---
layout: archive
title: "Token Representations and Word2vec"
permalink: /Resources/nlp/token-representations-word2vec/
author_profile: true
---

[Back to Resources](/Resources/)

<!-- Overview -->
<div class="problem-card" id="token-representations-overview">
    <div class="problem-header">
        <h3 class="problem-title">Token Representations and Word2vec</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Topics:</strong> One-hot encoding, Learned embeddings, Word2vec (CBOW, Skip-gram)</div>
        <div class="meta-item"><strong>Goal:</strong> Turn tokens into numbers that capture meaning</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>After text is split into tokens, each token must be converted into numbers before a model can use it. The simplest option is one-hot encoding, but it carries no information about meaning. Learned embeddings fix this by placing similar tokens close together in a vector space. Word2vec is a classic method that learns such embeddings from raw text, using two training tasks called CBOW and Skip-gram.</p>
</div>

<!-- Topic 1 -->
<div class="problem-card" id="one-hot-vs-learned-embedding">
    <div class="problem-header">
        <h3 class="problem-title">1. Motivation: One-hot Encoding vs Learned Embedding</h3>
        <span class="badge badge-easy">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>One-hot Size:</strong> Vocabulary size (very large, sparse)</div>
        <div class="meta-item"><strong>Embedding Size:</strong> Small and dense (e.g., 100 to 1000)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>In <strong>one-hot encoding</strong>, every token gets its own axis: the vector is all zeros except for a single 1 at the token's position. Because the axes are perpendicular, the dot product of any two different tokens is 0, so "teddy bear" looks as unrelated to "soft" as it does to "book". In a <strong>learned embedding</strong>, each token is a short dense vector whose values are learned from data, so related tokens point in similar directions. Now the dot product of "teddy bear" and "soft" is close to 1, while "teddy bear" and "book" stay close to 0.</p>
    <p><img src="/images/one-hot-vs-embedding.svg" alt="One-hot encoding places teddy bear, soft and book on perpendicular axes, while a learned embedding places teddy bear and soft close together and book far away" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Vocabulary: [soft, teddy bear, book]

One-hot  : soft = [1, 0, 0]
           <teddy bear, soft> = 0     (no similarity captured)

Embedding: soft = [0.95, 0.32, 0.01]
           <teddy bear, soft> ~ 1     (similar meaning, similar vectors)
           <teddy bear, book> ~ 0     (unrelated meaning)
    {% endhighlight %}
</div>

<!-- Topic 2 -->
<div class="problem-card" id="word2vec-overview">
    <div class="problem-header">
        <h3 class="problem-title">2. Word2vec Overview</h3>
        <span class="badge badge-medium">Method</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Model:</strong> Shallow neural network</div>
        <div class="meta-item"><strong>Training Data:</strong> Billions of words of unlabeled text</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Word2vec trains a neural network on a <strong>proxy task</strong>, which is a prediction problem that is not the real goal but forces the model to learn useful representations. The network reads billions of words of raw text, so no manual labels are required. The proxy task is only a means to an end: once training is done, the prediction part is discarded and the learned <strong>embedding layer</strong> (one vector per word) is kept. Words that appear in similar contexts end up with similar vectors.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Training text : "A cute teddy bear is reading a book"
Proxy task    : predict words from their neighbors (or the reverse)
Result        : an embedding vector for every word in the vocabulary,
                e.g. "teddy bear" ends up near "toy" and "soft"
    {% endhighlight %}
</div>

<!-- Topic 3 -->
<div class="problem-card" id="cbow">
    <div class="problem-header">
        <h3 class="problem-title">3. CBOW (Continuous Bag of Words)</h3>
        <span class="badge badge-medium">Proxy Task</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> Surrounding context words</div>
        <div class="meta-item"><strong>Output:</strong> The center (target) word</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>CBOW looks at the words around a position and tries to predict the missing word in the middle. The context word vectors are combined (averaged), which is why it is called a "bag" of words: the order of the context words is ignored. It is fast to train and works well for frequent words. The training signal teaches the model that words which fill the same gap should have similar embeddings.</p>
    <p><img src="/images/word2vec-cbow.svg" alt="CBOW: the context words A, cute, is and reading are used to predict the center word teddy bear" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Sentence : "A cute teddy bear is reading"
Input    : [A, cute, ___, is, reading]    (context words)
Output   : teddy bear                     (word to predict)
    {% endhighlight %}
</div>

<!-- Topic 4 -->
<div class="problem-card" id="skip-gram">
    <div class="problem-header">
        <h3 class="problem-title">4. Skip-gram</h3>
        <span class="badge badge-medium">Proxy Task</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> The center (target) word</div>
        <div class="meta-item"><strong>Output:</strong> Surrounding context words</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Skip-gram reverses CBOW: it takes one word and tries to predict the words that appear around it. Each (center word, context word) pair becomes a separate training example, so a single sentence gives many examples. This makes training slower, but it usually represents rare words better. The model learns that a word should have an embedding that is useful for guessing its neighbors. </p>
    <p><img src="/images/word2vec-skipgram.svg" alt="Skip-gram: the center word teddy bear is used to predict the surrounding words A, cute, is and reading" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Sentence : "A cute teddy bear is reading"
Input    : teddy bear                     (center word)
Output   : A, cute, is, reading           (context words)

Training pairs: (teddy bear, A), (teddy bear, cute),
                (teddy bear, is), (teddy bear, reading)
    {% endhighlight %}
</div>

<!-- Topic 5 -->
<div class="problem-card" id="cbow-vs-skip-gram">
    <div class="problem-header">
        <h3 class="problem-title">5. CBOW vs Skip-gram</h3>
        <span class="badge badge-hard">Comparison</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Same Goal:</strong> Learn useful word embeddings</div>
        <div class="meta-item"><strong>Difference:</strong> Direction of prediction</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Both methods use the same idea, that a word is defined by the words around it, but they predict in opposite directions. CBOW is quicker and suits large amounts of text with common words, while Skip-gram handles smaller datasets and rare words better.</p>
    <table>
        <thead>
            <tr>
                <th>Aspect</th>
                <th>CBOW</th>
                <th>Skip-gram</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Input</strong></td>
                <td>Context words</td>
                <td>Center word</td>
            </tr>
            <tr>
                <td><strong>Output</strong></td>
                <td>Center word</td>
                <td>Context words</td>
            </tr>
            <tr>
                <td><strong>Training speed</strong></td>
                <td>Faster</td>
                <td>Slower</td>
            </tr>
            <tr>
                <td><strong>Rare words</strong></td>
                <td>Less accurate</td>
                <td>Better</td>
            </tr>
        </tbody>
    </table>
    <p>To view tokenization done in various llms try using <a href="https://tiktokenizer.vercel.app/"> tiktokenizer</a></p>
</div>

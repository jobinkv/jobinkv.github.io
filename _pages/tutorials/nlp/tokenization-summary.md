---
layout: archive
title: "Tokenization Summary"
permalink: /Resources/nlp/tokenization-summary/
author_profile: true
---

[Back to NLP Index](/Resources/nlp/)

<!-- Overview -->
<div class="problem-card" id="tokenization-summary">
    <div class="problem-header">
        <h3 class="problem-title">Tokenization Summary</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Methods:</strong> Word-level, Subword-level, Character-level</div>
        <div class="meta-item"><strong>Key Term:</strong> OOV (Out-Of-Vocabulary)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Tokenization is the step that splits raw text into smaller units called tokens, which are then mapped to numbers and fed to a model. The size of these units is a design choice: whole words, pieces of words, or single characters. Each choice has trade-offs in vocabulary size, sequence length, and how well the model handles rare or new words. A word that is missing from the model's vocabulary is called <strong>OOV</strong> (out-of-vocabulary), and it is usually replaced by a generic unknown token.</p>
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
                <td><strong>Word-level</strong></td>
                <td>
                    <ul>
                        <li>Simple</li>
                        <li>Interpretable</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Risk of OOV</li>
                        <li>Does not leverage knowledge of root</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td><strong>Subword-level</strong><br>e.g. WordPiece, BPE</td>
                <td>
                    <ul>
                        <li>Leverages common prefixes and suffixes</li>
                        <li>Learned from the data</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Risk of OOV, though less than word-level</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td><strong>Character-level</strong></td>
                <td>
                    <ul>
                        <li>Small chance of OOV</li>
                        <li>RoBUsT tO CASinG anD MIspeliNGs</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Makes computations slower</li>
                        <li>Embeddings not interpretable</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Method 1 -->
<div class="problem-card" id="word-level-tokenization">
    <div class="problem-header">
        <h3 class="problem-title">1. Word-level Tokenization</h3>
        <span class="badge badge-easy">Word</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Token Unit:</strong> Whole word</div>
        <div class="meta-item"><strong>Vocabulary Size:</strong> Large</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Word-level tokenization splits text on spaces and punctuation, so every word becomes one token. It is the most straightforward approach and gives one embedding per word.</p>
    {% highlight text %}
Input : "I love running"
Tokens: ["I", "love", "running"]
    {% endhighlight %}
    <div class="section-subtitle">Pros</div>
    <p><strong>Simple:</strong> No special algorithm or training is needed, because splitting on whitespace and punctuation is usually enough. <strong>Interpretable:</strong> Every token is a real word, so it is easy to inspect what the model sees and what each embedding stands for.</p>
    <div class="section-subtitle">Cons</div>
    <p><strong>Risk of OOV:</strong> The vocabulary is fixed, so any new word, name, typo, or rare term becomes an unknown token and its meaning is lost. For example, "blockchainify" would be replaced by <code>[UNK]</code>. <strong>Does not leverage knowledge of root:</strong> Words such as "run", "running", and "runner" are treated as three unrelated tokens, so the model cannot reuse what it learned about the shared root.</p>
</div>

<!-- Method 2 -->
<div class="problem-card" id="subword-level-tokenization">
    <div class="problem-header">
        <h3 class="problem-title">2. Subword-level Tokenization</h3>
        <span class="badge badge-medium">Subword</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Token Unit:</strong> Word piece (prefix, root, suffix)</div>
        <div class="meta-item"><strong>Examples:</strong> WordPiece, BPE</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Subword tokenization keeps common words whole and breaks rare words into smaller, reusable pieces. Algorithms such as Byte Pair Encoding (BPE) and WordPiece build this vocabulary from the training data. This is the standard choice in modern models such as BERT and GPT.</p>
    {% highlight text %}
Input : "unhappiness"
Tokens: ["un", "##happi", "##ness"]    (WordPiece style)
    {% endhighlight %}
    <div class="section-subtitle">Pros</div>
    <p><strong>Leverages common prefixes and suffixes:</strong> Pieces such as "un-", "-ness", and "-ing" are shared across many words, so the model can understand a new word from parts it already knows. <strong>Learned from the data:</strong> The vocabulary is not hand-written. BPE repeatedly merges the most frequent pair of symbols, so frequent patterns get their own tokens automatically.</p>
    <div class="section-subtitle">Cons</div>
    <p><strong>Risk of OOV, though less than word-level:</strong> A rare word is split into smaller known pieces rather than being replaced by an unknown token, so OOV is much less likely. It can still happen if a character or symbol never appeared in the training data, such as a rare emoji or script.</p>
</div>

<!-- Method 3 -->
<div class="problem-card" id="character-level-tokenization">
    <div class="problem-header">
        <h3 class="problem-title">3. Character-level Tokenization</h3>
        <span class="badge badge-hard">Character</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Token Unit:</strong> Single character</div>
        <div class="meta-item"><strong>Vocabulary Size:</strong> Very small</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Character-level tokenization treats every individual character as a token. The vocabulary is just the alphabet, digits, and symbols, but each sentence turns into a much longer sequence.</p>
    {% highlight text %}
Input : "cat"
Tokens: ["c", "a", "t"]
    {% endhighlight %}
    <div class="section-subtitle">Pros</div>
    <p><strong>Small chance of OOV:</strong> Any word is built from a small, fixed set of characters, so nearly any input can be represented, including new words and names. <strong>Robust to casing and misspellings:</strong> A noisy input like "RoBUsT tO CASinG anD MIspeliNGs" or "helo wrld" still breaks down into familiar characters, so the model can cope with it instead of failing on an unseen word.</p>
    <div class="section-subtitle">Cons</div>
    <p><strong>Makes computations slower:</strong> A sentence becomes many more tokens than with words, and models such as Transformers get more expensive as the sequence grows. <strong>Embeddings not interpretable:</strong> A single character like "t" carries almost no meaning on its own, so its embedding is hard to interpret, and the model must learn meaning from long character combinations.</p>
</div>

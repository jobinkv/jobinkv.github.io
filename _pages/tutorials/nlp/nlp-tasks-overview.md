---
layout: archive
title: "NLP Tasks Overview"
permalink: /Resources/nlp/nlp-tasks-overview/
author_profile: true
---

[Back to Resources](/Resources/)

<!-- Overview -->
<div class="problem-card" id="nlp-tasks-overview">
    <div class="problem-header">
        <h3 class="problem-title">NLP Tasks Overview</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Task Families:</strong> Classification, "Multi"-classification, Generation</div>
        <div class="meta-item"><strong>Common Pattern:</strong> Input text → Model → Output</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Most NLP tasks can be grouped by the kind of output the model produces. In <strong>Classification</strong>, the model reads a piece of text and returns a single label. In <strong>"Multi"-classification</strong>, the model returns one label for every token (word) in the input. In <strong>Generation</strong>, the model returns new text of its own. The sections below explain each task in these three families.</p>
</div>

<!-- Classification -->
<h2>1. Classification</h2>
<p>Input text goes into the model and a single label (for example, a class number) comes out.</p>

<!-- Task 1 -->
<div class="problem-card" id="sentiment-extraction">
    <div class="problem-header">
        <h3 class="problem-title">1.1 Sentiment Extraction</h3>
        <span class="badge badge-easy">Classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sentence or document</div>
        <div class="meta-item"><strong>Output:</strong> One label (e.g., positive / negative / neutral)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Sentiment extraction identifies the opinion or emotional tone expressed in a piece of text. The model maps the whole text to a single class such as positive, negative, or neutral. It is widely used to analyze product reviews, social media posts, and customer feedback at scale. Sarcasm and mixed opinions make this task harder than it looks.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "The battery life is amazing and the screen is gorgeous!"
Output: Positive
    {% endhighlight %}
</div>

<!-- Task 2 -->
<div class="problem-card" id="intent-detection">
    <div class="problem-header">
        <h3 class="problem-title">1.2 Intent Detection</h3>
        <span class="badge badge-easy">Classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A user utterance</div>
        <div class="meta-item"><strong>Output:</strong> One intent label</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Intent detection determines what a user wants to achieve from a short message or query. The model picks one intent from a predefined list, such as "book_flight" or "check_balance". It is a core component of chatbots and voice assistants, because the detected intent decides which action the system takes next. It is often paired with entity extraction to fill in details like dates and places.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "Book me a flight to Dubai for tomorrow morning"
Output: book_flight
    {% endhighlight %}
</div>

<!-- Task 3 -->
<div class="problem-card" id="language-detection">
    <div class="problem-header">
        <h3 class="problem-title">1.3 Language Detection</h3>
        <span class="badge badge-easy">Classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A piece of text</div>
        <div class="meta-item"><strong>Output:</strong> One language code</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Language detection identifies which language a given text is written in. The model uses clues such as character sets, common words, and character n-gram patterns to choose a language label. It is usually the first step in a multilingual pipeline, for example to route text to the right translation or search model. Very short texts and code-mixed text (such as Hinglish) are the main difficulties.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "Bonjour, comment allez-vous aujourd'hui ?"
Output: French (fr)
    {% endhighlight %}
</div>

<!-- Task 4 -->
<div class="problem-card" id="topic-modeling">
    <div class="problem-header">
        <h3 class="problem-title">1.4 Topic Modeling</h3>
        <span class="badge badge-easy">Classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A document (or a collection of documents)</div>
        <div class="meta-item"><strong>Output:</strong> Topic label(s) or topic distribution</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Topic modeling discovers the main themes that run through a text or a large collection of documents. It can be supervised, where each document is assigned to a known category, or unsupervised, where methods such as LDA find groups of related words without any labels. Each document is then described by the topics it covers. It is useful for organizing news archives, support tickets, and research papers.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "The striker scored twice as the team secured a place in the final."
Output: Topic = Sports
    {% endhighlight %}
</div>

<!-- Multi-classification -->
<h2>2. "Multi"-classification</h2>
<p>Input text goes into the model and a label is produced for every token (or for every part) of the input.</p>

<!-- Task 5 -->
<div class="problem-card" id="part-of-speech-tagging">
    <div class="problem-header">
        <h3 class="problem-title">2.1 Part of Speech (POS) Tagging</h3>
        <span class="badge badge-medium">Multi-classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sequence of tokens</div>
        <div class="meta-item"><strong>Output:</strong> One grammatical tag per token</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>POS tagging assigns a grammatical category, such as noun, verb, adjective, or preposition, to every word in a sentence. The same word can take different tags depending on context, so the model must look at the surrounding words. For example, "book" is a noun in "read a book" but a verb in "book a ticket". POS tags are a basic building block for parsing and information extraction.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : The   cat   sat   on   the   mat
Output: DET   NOUN  VERB  ADP  DET   NOUN
    {% endhighlight %}
</div>

<!-- Task 6 -->
<div class="problem-card" id="named-entity-recognition">
    <div class="problem-header">
        <h3 class="problem-title">2.2 Named Entity Recognition (NER)</h3>
        <span class="badge badge-medium">Multi-classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sequence of tokens</div>
        <div class="meta-item"><strong>Output:</strong> An entity tag per token (e.g., BIO scheme)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>NER finds and labels real-world entities in text, such as people, organizations, locations, dates, and amounts. Each token receives a tag showing whether it begins an entity, continues one, or is outside any entity. This turns unstructured text into structured data that can be searched or stored in a database. It is commonly used in resume parsing, news analysis, and medical record processing.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "Sundar Pichai announced a Google office in Bengaluru on Monday."
Output: Sundar Pichai -> PERSON | Google -> ORG | Bengaluru -> LOCATION | Monday -> DATE
    {% endhighlight %}
</div>

<!-- Task 7 -->
<div class="problem-card" id="dependency-parsing">
    <div class="problem-header">
        <h3 class="problem-title">2.3 Dependency Parsing</h3>
        <span class="badge badge-medium">Multi-classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sentence</div>
        <div class="meta-item"><strong>Output:</strong> A head word and relation label for each word</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Dependency parsing analyzes the grammatical structure of a sentence by linking each word to the word it depends on. Every link carries a relation label, such as subject, object, or modifier, and the main verb usually becomes the root of the tree. This shows who did what to whom in the sentence. The result is useful for relation extraction, question answering, and grammar checking.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "She reads books"
Output: reads -> ROOT
        She   -> nsubj (subject of "reads")
        books -> obj   (object of "reads")
    {% endhighlight %}
</div>

<!-- Task 8 -->
<div class="problem-card" id="constituency-parsing">
    <div class="problem-header">
        <h3 class="problem-title">2.4 Constituency Parsing</h3>
        <span class="badge badge-medium">Multi-classification</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A sentence</div>
        <div class="meta-item"><strong>Output:</strong> A phrase-structure tree</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Constituency parsing breaks a sentence into nested phrases, such as noun phrases (NP) and verb phrases (VP), and builds a tree from them. Unlike dependency parsing, which links individual words, it groups words into larger units that act together. The tree shows how small phrases combine to form the full sentence. It is helpful for grammar analysis and for tasks that need phrase-level structure.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "The dog chased the ball"
Output: (S (NP The dog) (VP chased (NP the ball)))
    {% endhighlight %}
</div>

<!-- Generation -->
<h2>3. Generation</h2>
<p>Input text goes into the model and new output text is produced, whose length and content are not fixed in advance.</p>

<!-- Task 9 -->
<div class="problem-card" id="machine-translation">
    <div class="problem-header">
        <h3 class="problem-title">3.1 Machine Translation</h3>
        <span class="badge badge-hard">Generation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> Text in a source language</div>
        <div class="meta-item"><strong>Output:</strong> Text in a target language</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Machine translation automatically converts text from one language to another while keeping its meaning. The model reads the whole source sentence and then generates the target sentence word by word. Word order, grammar, and idioms differ between languages, so a good system cannot simply swap words one by one. Modern systems are built on sequence-to-sequence and Transformer models.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "How are you today?"   (English)
Output: "¿Cómo estás hoy?"      (Spanish)
    {% endhighlight %}
</div>

<!-- Task 10 -->
<div class="problem-card" id="question-answering">
    <div class="problem-header">
        <h3 class="problem-title">3.2 Question Answering</h3>
        <span class="badge badge-hard">Generation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A question (optionally with a context passage)</div>
        <div class="meta-item"><strong>Output:</strong> An answer in text form</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Question answering systems respond to a question written in natural language. In the extractive form, the answer is a span copied from a given passage; in the generative form, the model writes the answer in its own words. Some systems use only the knowledge stored in the model, while others retrieve documents first and answer from them. It powers search assistants, customer support bots, and reading comprehension tools.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Context : "The Eiffel Tower was completed in 1889 in Paris."
Question: "When was the Eiffel Tower completed?"
Answer  : "1889"
    {% endhighlight %}
</div>

<!-- Task 11 -->
<div class="problem-card" id="summarization">
    <div class="problem-header">
        <h3 class="problem-title">3.3 Summarization</h3>
        <span class="badge badge-hard">Generation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A long document</div>
        <div class="meta-item"><strong>Output:</strong> A shorter text with the key points</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Summarization condenses a long text into a shorter version that keeps the most important information. Extractive summarization selects key sentences from the original, while abstractive summarization writes new sentences that capture the meaning. The main challenge is to stay faithful to the source and avoid adding facts that were never stated. It is used for news digests, meeting notes, and research paper abstracts.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : A 500-word article about a city's new metro line, covering its route,
        cost, opening date, and expected ridership.
Output: "The city opened a 20 km metro line on Monday, expected to carry
        200,000 riders daily."
    {% endhighlight %}
</div>

<!-- Task 12 -->
<div class="problem-card" id="text-generation">
    <div class="problem-header">
        <h3 class="problem-title">3.4 Text Generation</h3>
        <span class="badge badge-hard">Generation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Input:</strong> A prompt or the beginning of a text</div>
        <div class="meta-item"><strong>Output:</strong> A continuation or a full new text</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Text generation produces new, fluent text from a prompt by predicting one token at a time, each based on the tokens before it. It is the basic mechanism behind large language models and can be used for stories, emails, code, and conversation. Settings such as temperature control how predictable or creative the output is. Because the model can sound confident even when it is wrong, the generated text needs to be checked for accuracy.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Input : "Once upon a time, in a small village by the sea,"
Output: "there lived a fisherman who dreamed of sailing beyond the horizon..."
    {% endhighlight %}
</div>

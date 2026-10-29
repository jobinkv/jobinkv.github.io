---
layout: archive
title: "Mixture of Experts and Guided Decoding"
permalink: /Resources/nlp/moe-and-guided-decoding/
author_profile: true
---

[Back to NLP Index](/Resources/nlp/)

<!-- Overview -->
<div class="problem-card" id="moe-guided-overview">
    <div class="problem-header">
        <h3 class="problem-title">Mixture of Experts and Guided Decoding</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Part 1:</strong> Mixture of Experts (dense, sparse, routing collapse, interpreting experts)</div>
        <div class="meta-item"><strong>Part 2:</strong> Sampling and guided decoding (finite state machine, context-free grammar)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>This page covers two ideas that matter when building and using large language models. <strong>Mixture of Experts (MoE)</strong> makes a model larger without making every token more expensive, by sending each token only to a few specialist sub-networks. <strong>Guided decoding</strong> controls what the model is allowed to write, so that its output always follows a required format such as JSON. Between them sits <strong>sampling</strong>, the step where the next token is drawn from the model's probability distribution and where the format rules are enforced.</p>
</div>

<!-- Topic 1 -->
<div class="problem-card" id="mixture-of-experts">
    <div class="problem-header">
        <h3 class="problem-title">1. Mixture of Experts (MoE)</h3>
        <span class="badge badge-medium">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Parts:</strong> A gating network G and n experts E<sub>1</sub> ... E<sub>n</sub></div>
        <div class="meta-item"><strong>Formula:</strong> \(\hat{y} = \sum_{i=1}^{n} G(x)_i \, E_i(x)\)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>An MoE layer replaces one big network with several smaller networks called <strong>experts</strong>, plus a <strong>gate</strong> (router) that decides how much each expert should contribute for a given input. The gate looks at the input \(x\) and produces one weight \(G(x)_i\) per expert. The final output \(\hat{y}\) is the weighted sum of the expert outputs \(E_i(x)\). In a Transformer, the experts are usually the feed forward networks, so an MoE layer takes the place of the feed forward block, while attention stays shared. The routing is done separately for every token.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
3 experts, one input x, scalar outputs to keep the numbers simple

Gate weights    G(x) = [0.5, 0.3, 0.2]
Expert outputs  E(x) = [2.0, 4.0, 0.0]

y_hat = 0.5 * 2.0 + 0.3 * 4.0 + 0.2 * 0.0 = 1.0 + 1.2 + 0.0 = 2.2
    {% endhighlight %}
</div>

<!-- Topic 2 -->
<div class="problem-card" id="dense-moe">
    <div class="problem-header">
        <h3 class="problem-title">2. Dense MoE</h3>
        <span class="badge badge-medium">Variant</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Gate:</strong> Softmax over all experts (every weight is non-zero)</div>
        <div class="meta-item"><strong>Compute per token:</strong> All n experts</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>In a dense MoE, the gate gives a non-zero weight to every expert, usually with a softmax over all of them, and every expert is run for every token. The output is a smooth blend of all experts, and the formula is exactly the one above with all n terms. This is easy to train, because every expert receives a learning signal from every token. The drawback is cost: the compute grows with the number of experts, so adding experts makes the model slower and does not give the efficiency benefit that MoE is known for.</p>
    <p><img src="/images/moe-dense-vs-sparse.svg" alt="Dense MoE where the gate weights and runs all four experts, next to sparse MoE where only the top two experts are run and the other two are skipped" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
4 experts, gate scores (logits) = [2.0, 1.0, 0.1, -1.0]

Softmax over all 4 : [0.64, 0.24, 0.10, 0.03]   (all experts get a weight)
Experts run        : E1, E2, E3, E4              (4 experts of compute)
    {% endhighlight %}
</div>

<!-- Topic 3 -->
<div class="problem-card" id="sparse-moe">
    <div class="problem-header">
        <h3 class="problem-title">3. Sparse MoE</h3>
        <span class="badge badge-hard">Variant</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Gate:</strong> Keep only the top-k scores, all other weights are 0</div>
        <div class="meta-item"><strong>Compute per token:</strong> Only k experts (k is much smaller than n)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>A sparse MoE keeps only the <strong>top-k</strong> gate scores for each token, applies the softmax over those k scores, and gives every other expert a weight of exactly 0. Experts with weight 0 are simply not run. This breaks the link between model size and cost: the model can hold many experts (many parameters), but each token pays only for k of them. For example, Mixtral 8x7B has 8 experts per layer and picks the top 2 for each token, so it has about 47 billion parameters in total but uses only about 13 billion of them per token. The price is extra complexity in training, shown in the next section.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import torch
import torch.nn as nn

class SparseMoE(nn.Module):
    def __init__(self, experts, d_model, top_k=2):
        super().__init__()
        self.experts = nn.ModuleList(experts)
        self.gate = nn.Linear(d_model, len(experts), bias=False)
        self.top_k = top_k

    def forward(self, x):                              # x: (num_tokens, d_model)
        logits = self.gate(x)                          # one score per expert
        weights, chosen = torch.topk(logits, self.top_k, dim=-1)
        weights = torch.softmax(weights, dim=-1)       # softmax over the chosen experts only
        out = torch.zeros_like(x)
        for i, expert in enumerate(self.experts):
            token_idx, slot = torch.where(chosen == i) # tokens that selected expert i
            if token_idx.numel() == 0:
                continue                               # expert i is skipped entirely
            out[token_idx] += weights[token_idx, slot, None] * expert(x[token_idx])
        return out
    {% endhighlight %}
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Same gate scores as before: [2.0, 1.0, 0.1, -1.0], top-2 routing

Top-2 experts  : E1 (2.0) and E2 (1.0)
Softmax on those two : [0.73, 0.27]
Final weights  : [0.73, 0.27, 0, 0]       (E3 and E4 are not computed)

Dense vs sparse
                     Dense MoE            Sparse MoE
Gate weights         all non-zero         only k non-zero
Experts run / token  n                    k
Parameters           all used each time   many, but few used each time
Training             simple               needs load balancing
    {% endhighlight %}
</div>

<!-- Topic 4 -->
<div class="problem-card" id="routing-collapse">
    <div class="problem-header">
        <h3 class="problem-title">4. Training Challenge: Routing Collapse</h3>
        <span class="badge badge-hard">Training</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Symptom:</strong> The same expert is selected most of the time</div>
        <div class="meta-item"><strong>Remedy:</strong> Auxiliary load-balancing loss</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>In sparse MoE, the gate can fall into a bad habit called <strong>routing collapse</strong>: a few experts are chosen for almost every token while the others are barely used. It happens because an expert that gets more tokens trains faster, becomes better, and is then chosen even more often. The unused experts waste parameters and the model behaves like a much smaller one. The remedy is to force the other experts to be "part of the game" too, by adding an auxiliary loss to the training loss:</p>
    <p>\(\text{loss} = \alpha \cdot N \cdot \sum_{i=1}^{N} f_i \cdot P_i\)</p>
    <p>Here \(N\) is the number of experts, \(f_i\) is the fraction of tokens routed to expert \(i\), and \(P_i\) is the average routing probability the gate gives to expert \(i\). The sum is smallest when both are spread evenly (every value is \(1/N\)), so the loss pushes the gate toward balanced use. The factor \(\alpha\) is a small constant (the Switch Transformer paper used 0.01). Because \(f_i\) comes from a hard choice and cannot be differentiated, the gradient flows through \(P_i\).</p>
    <p><img src="/images/routing-collapse.svg" alt="Two bar charts of the fraction of tokens routed to four experts: left shows collapse onto the first expert, right shows an even spread after adding the auxiliary loss" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
N = 4 experts

Balanced : f = [0.25, 0.25, 0.25, 0.25]   P = [0.25, 0.25, 0.25, 0.25]
           sum f*P = 4 * (0.25 * 0.25) = 0.25
           loss    = alpha * 4 * 0.25 = 1.0 * alpha      (the minimum)

Collapsed: f = [1.0, 0.0, 0.0, 0.0]       P = [0.7, 0.1, 0.1, 0.1]
           sum f*P = 1.0 * 0.7 = 0.7
           loss    = alpha * 4 * 0.7 = 2.8 * alpha      (penalized)
    {% endhighlight %}
</div>

<!-- Topic 5 -->
<div class="problem-card" id="interpreting-experts">
    <div class="problem-header">
        <h3 class="problem-title">5. Interpreting Experts</h3>
        <span class="badge badge-medium">Analysis</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Model studied:</strong> Mixtral of Experts (Jiang et al., 2024)</div>
        <div class="meta-item"><strong>Visualization:</strong> Each color represents an expert</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>A natural guess is that each expert becomes a specialist in a subject, for example one for math, one for biology and one for code. To test this, the Mixtral paper colors every token of a text by the expert that processed it. The picture does not show a clear split by subject. Instead, the routing follows more superficial, syntactic patterns, such as the same expert handling certain keywords or indentation in code, and neighbouring tokens often going to the same expert. So "expert" here means a learned sub-network chosen by the router, not a human-style specialist, and the specialization is hard to describe in words.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Python code, one layer, colors = expert chosen for each token

class MoeLayer(nn.Module):        <- the tokens are spread over many colors
    def __init__(self, experts):  <- but the same token types (for example
        super().__init__()           "self" or indentation) tend to share
                                     an expert, regardless of topic
    {% endhighlight %}
</div>

<!-- Topic 6 -->
<div class="problem-card" id="next-token-sampling">
    <div class="problem-header">
        <h3 class="problem-title">6. Predicting the Next Token with Sampling</h3>
        <span class="badge badge-medium">Decoding</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Formula:</strong> \(\hat{w}_{t+1} \sim P(w_{t+1} \mid C)\)</div>
        <div class="meta-item"><strong>Input:</strong> The probabilities from the final softmax layer</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>At the end of the Transformer, the softmax layer gives a probability for every word in the vocabulary, given the context \(C\) written so far. One option is to always take the single most likely word (greedy decoding), which is deterministic and often repetitive. The idea on the slide is to <strong>sample</strong> the next token from the whole distribution instead. Likely words are chosen more often, but unlikely ones can still appear, so the text becomes more varied. The chosen token is appended to the context and the process repeats for the next position.</p>
    <p><img src="/images/next-token-sampling.svg" alt="Bar chart of next-token probabilities over words such as kind, smart, fluffy and gentle, from which one word is sampled" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Context C = "My teddy bear is"            (probabilities are illustrative)

P(kind) = 0.17   P(smart) = 0.14   P(fluffy) = 0.13   P(gentle) = 0.13 ...

Greedy   : always "kind"
Sampling : "kind" about 17% of the time, "smart" about 14%, "fluffy" about 13%, ...
           so repeated runs can give different but sensible sentences
    {% endhighlight %}
</div>

<!-- Topic 7 -->
<div class="problem-card" id="guided-decoding">
    <div class="problem-header">
        <h3 class="problem-title">7. Constraining the Output via Guided Decoding</h3>
        <span class="badge badge-medium">Technique</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Motivation:</strong> Generate output in a specific format (for example JSON)</div>
        <div class="meta-item"><strong>Method:</strong> Mask out tokens that would break the format</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Sometimes a program, not a person, reads the model's answer, so the format must be exact. If you only ask the model for JSON in the prompt, it can still add extra text, forget a quote, or write a number as a word. <strong>Guided (constrained) decoding</strong> guarantees the format instead of hoping for it. At every step, a rule system decides which tokens could still lead to a valid output, the logits of all other tokens are set to \(-\infty\), the probabilities are renormalized, and the next token is sampled from what remains. The rules themselves are described with a finite state machine or a context-free grammar, covered next.</p>
    <p><img src="/images/guided-decoding-masking.svg" alt="Next-token probabilities before masking and after masking: only digit tokens remain allowed and their probabilities are renormalized to 0.75 and 0.25" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Prompt : "Generate a description of my 33-year old teddy bear who likes
          reading. Do this in JSON format."

Required output:
{
    "first_name": "teddy",
    "last_name": "bear",
    "age": 33,
    "hobby": "reading"
}

After  "age":  the rules allow only digits, so "thirty-three", a quote
or a closing brace are masked out and the model must write a number.
    {% endhighlight %}
</div>

<!-- Topic 8 -->
<div class="problem-card" id="finite-state-machine">
    <div class="problem-header">
        <h3 class="problem-title">8. Finite State Machine (FSM)</h3>
        <span class="badge badge-medium">Formal Tool</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Parts:</strong> States, start state, transitions, accepting states</div>
        <div class="meta-item"><strong>Equivalent to:</strong> Regular expressions</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>A finite state machine is a small machine with a fixed number of <strong>states</strong>. It starts in a start state, reads symbols one at a time, and each symbol moves it along a <strong>transition</strong> to another state. If the input ends in an <strong>accepting</strong> state, it is valid. FSMs describe the same patterns as regular expressions, such as "one or more digits followed by a comma". For guided decoding, the generator keeps track of the current state: the tokens that have a transition out of that state are allowed, and the others are masked. After a token is chosen, the machine moves to the next state.</p>
    <p>An FSM has only a fixed amount of memory (its current state), so it cannot count. It cannot check that braces are balanced to any depth, which is why nested structures need the more powerful tool in the next section.</p>
    <p><img src="/images/fsm-number.svg" alt="Finite state machine with states q0, q1 and q2: a digit moves q0 to q1, more digits loop on q1, and a comma moves q1 to the accepting state q2" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Pattern: one or more digits, then a comma     regex: [0-9]+,

Input "33,"  :  q0 --3--> q1 --3--> q1 --,--> q2   accepted
Input ",5"   :  q0 --,--> ?                        rejected (no transition)
Input "3a"   :  q0 --3--> q1 --a--> ?              rejected (no transition)

While generating after "age": the machine is in q0 (digits only);
after the first digit it is in q1 (digits or a comma).
    {% endhighlight %}
</div>

<!-- Topic 9 -->
<div class="problem-card" id="context-free-grammar">
    <div class="problem-header">
        <h3 class="problem-title">9. Context-Free Grammar (CFG)</h3>
        <span class="badge badge-hard">Formal Tool</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Parts:</strong> Non-terminals, terminals, production rules, start symbol</div>
        <div class="meta-item"><strong>Recognized by:</strong> A machine with a stack (pushdown automaton)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>A context-free grammar describes a language with <strong>production rules</strong>. Each rule replaces one <strong>non-terminal</strong> (a named category such as Object or Value) with a sequence of non-terminals and <strong>terminals</strong> (actual characters or tokens such as "{" or ":"). It is called "context-free" because a rule can be applied to a non-terminal wherever it appears, whatever surrounds it. The key power of a CFG is <strong>recursion</strong>: a rule can refer back to itself, directly or indirectly, so it can describe nested structures of any depth, such as JSON objects inside objects, brackets in code, or nested parentheses.</p>
    <p>To use a CFG in guided decoding, a parser follows the text generated so far and keeps a stack of what is still expected (for example, which braces are still open). From that state, it works out which tokens may come next and masks the rest. This can enforce a complete, valid JSON document, which an FSM cannot do on its own.</p>
    <p><img src="/images/cfg-parse-tree.svg" alt="Parse tree for a nested JSON object: Object expands to a brace, Members and a closing brace, down to a Value that is again an Object, showing recursion" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
A small JSON grammar (non-terminals in capitals, terminals in quotes)

Object  -> "{" Members "}"
Members -> Pair | Pair "," Members
Pair    -> String ":" Value
Value   -> Number | String | Object        <- Object again: recursion
Number  -> Digit | Digit Number

Derivation of {"a": 1}:
Object => { Members } => { Pair } => { String : Value }
       => { "a" : Number } => { "a" : 1 }

During generation, after  {"first_name": "teddy",  the grammar expects
another Pair, so the next token must start a String (a quote).
A closing brace or a number would be masked out.
    {% endhighlight %}
</div>

<!-- Topic 10 -->
<div class="problem-card" id="fsm-vs-cfg">
    <div class="problem-header">
        <h3 class="problem-title">10. FSM vs CFG for Guided Decoding</h3>
        <span class="badge badge-hard">Comparison</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Pipeline:</strong> logits &rarr; mask by current state &rarr; softmax &rarr; sample &rarr; update state</div>
        <div class="meta-item"><strong>Rule of thumb:</strong> Flat patterns use an FSM, nested formats need a CFG</div>
    </div>
    <div class="section-subtitle">Summary Table</div>
    <table>
        <thead>
            <tr>
                <th>Aspect</th>
                <th>Finite state machine</th>
                <th>Context-free grammar</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Describes</strong></td>
                <td>Regular patterns (regex)</td>
                <td>Nested, recursive structures</td>
            </tr>
            <tr>
                <td><strong>Memory</strong></td>
                <td>Only the current state</td>
                <td>Current state plus a stack</td>
            </tr>
            <tr>
                <td><strong>Can it match nested brackets?</strong></td>
                <td>No (depth is unbounded)</td>
                <td>Yes</td>
            </tr>
            <tr>
                <td><strong>Typical use</strong></td>
                <td>Numbers, dates, IDs, fixed choices</td>
                <td>Full JSON, code, expressions</td>
            </tr>
            <tr>
                <td><strong>Cost</strong></td>
                <td>Cheap and simple</td>
                <td>More complex to run</td>
            </tr>
        </tbody>
    </table>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Field value "age": 33          -> an FSM is enough ([0-9]+)
Whole document with nesting    -> needs a CFG:
{ "pet": { "name": "teddy", "toys": { "book": 1 } } }

Both work the same way inside the decoder:
state -> allowed tokens -> mask the rest -> sample -> new state
    {% endhighlight %}
</div>

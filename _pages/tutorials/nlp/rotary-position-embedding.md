---
layout: archive
title: "Rotary Position Embedding (RoPE)"
permalink: /Resources/nlp/rotary-position-embedding/
author_profile: true
---

[Back to NLP Index](/Resources/nlp/)

<!-- Overview -->
<div class="problem-card" id="rope-overview">
    <div class="problem-header">
        <h3 class="problem-title">Rotary Position Embedding (RoPE)</h3>
        <span class="badge badge-easy">Overview</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Paper:</strong> "RoFormer: Enhanced Transformer with Rotary Position Embedding" (Su et al., 2021)</div>
        <div class="meta-item"><strong>Used In:</strong> Default choice in many modern LLMs (e.g., LLaMA)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Attention does not know the order of tokens, so a Transformer needs some way to tell it where each token sits. The original Transformer adds a sinusoidal vector to the input embeddings. RoPE (<strong>Ro</strong>tary <strong>P</strong>osition <strong>E</strong>mbedding) takes a different route: instead of adding anything, it <strong>rotates the query and key vectors</strong> by an angle that depends on their position. As a result, the attention score between two tokens depends on how far apart they are, which is exactly the information language needs. This page covers the motivation, the rotation idea, the formulas, the role of different frequencies, the relative-distance property, long-term decay, and a small implementation.</p>
</div>

<!-- Topic 1 -->
<div class="problem-card" id="why-not-sinusoidal">
    <div class="problem-header">
        <h3 class="problem-title">1. Motivation: Issues with Sinusoidal Positional Encoding</h3>
        <span class="badge badge-easy">Motivation</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Question:</strong> Can position be added to the queries and keys instead of the input?</div>
        <div class="meta-item"><strong>Key Matrices:</strong> Query (N × d), Keys^T (d × N)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>In attention, the influence of one token on another is measured by the score matrix \(QK^T\). Sinusoidal positional encoding adds position information only once, to the input embeddings, so it reaches the scores indirectly through the learned projections and many layers. Consider "The dog chased another dog": both "dog" tokens have the same embedding, and only the added position vector tells them apart. RoPE asks a more direct question: can the queries and keys, which produce the scores, carry the position themselves?</p>
    <p><img src="/images/attention-score-shapes.svg" alt="Query matrix of 5 by 4 times transposed key matrix of 4 by 5 gives a 5 by 5 attention score matrix for the sentence The dog chased another dog, with both dog rows highlighted" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Sentence : "The dog chased another dog"      (5 tokens, vectors of size 4)
Q  : 5 x 4     K^T : 4 x 5     Scores = Q K^T : 5 x 5

Without position information:
  "dog" (token 2) and "dog" (token 5) have identical vectors,
  so they would receive identical attention scores.
Goal: make the score between two tokens depend on their distance.
    {% endhighlight %}
</div>

<!-- Topic 2 -->
<div class="problem-card" id="rope-idea">
    <div class="problem-header">
        <h3 class="problem-title">2. The Idea: Rotate Queries and Keys</h3>
        <span class="badge badge-medium">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Rotate query and key vectors with a rotation matrix</div>
        <div class="meta-item"><strong>Angle:</strong> m·θ for the token at position m</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>RoPE treats a vector as an arrow in a plane and turns it by an angle proportional to the token's position. The query at position \(m\) is rotated by \(m\theta\) and the key at position \(n\) is rotated by \(n\theta\). Notice that nothing is added to the vector: positional information is included only by rotating it, which keeps its length unchanged. After the rotation, the angle between the query and the key is \((n-m)\theta\), so their dot product depends only on the distance \(n-m\) and not on the absolute positions.</p>
    <p><img src="/images/rope-rotation.svg" alt="A query at position m is rotated by m theta, a key at position n is rotated by n theta, and the angle between the rotated vectors is n minus m times theta" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
theta = 25 degrees, query at position m = 2, key at position n = 5

query is rotated by m * theta = 50 degrees
key   is rotated by n * theta = 125 degrees
angle between them           = 125 - 50 = 75 degrees = (n - m) * theta

Moving both tokens 10 positions to the right changes both angles,
but the angle between them stays 75 degrees.
    {% endhighlight %}
</div>

<!-- Topic 3 -->
<div class="problem-card" id="rotation-matrix">
    <div class="problem-header">
        <h3 class="problem-title">3. The Rotation Matrix (2D)</h3>
        <span class="badge badge-medium">Formula</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Formula:</strong> \(R_{\theta,m}\) rotates a 2D vector by \(m\theta\)</div>
        <div class="meta-item"><strong>Property:</strong> Length of the vector is preserved</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>The rotation by an angle \(m\theta\) is done with the standard 2D rotation matrix:</p>
    <p>\(R_{\theta,m} = \begin{pmatrix} \cos(m\theta) & -\sin(m\theta) \\ \sin(m\theta) & \cos(m\theta) \end{pmatrix}\)</p>
    <p>Multiplying a 2D vector \((x_1, x_2)\) by this matrix gives the rotated vector \((x_1', x_2')\) with \(x_1' = x_1\cos(m\theta) - x_2\sin(m\theta)\) and \(x_2' = x_1\sin(m\theta) + x_2\cos(m\theta)\). Some sources write the matrix with the signs of the sine terms swapped, which just means the rotation is applied in the opposite direction; the idea is the same. Position \(m=0\) means no rotation at all.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
theta = 30 degrees, vector q = (2, 0)   (length 2)

position m = 0 : angle   0 degrees -> (2.000, 0.000)
position m = 1 : angle  30 degrees -> (1.732, 1.000)
position m = 2 : angle  60 degrees -> (1.000, 1.732)

Each result is the same arrow turned further around; the length stays 2.
    {% endhighlight %}
</div>

<!-- Topic 4 -->
<div class="problem-card" id="extension-to-d-dimensions">
    <div class="problem-header">
        <h3 class="problem-title">4. Extension to Dimension d &gt; 2</h3>
        <span class="badge badge-medium">Formula</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Rotate every block (pair) of 2 dimensions</div>
        <div class="meta-item"><strong>Angles:</strong> \(\theta_i = 10000^{-2(i-1)/d}\), for \(i = 1, \dots, d/2\)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Real query and key vectors have many dimensions (for example 64 or 128), but a rotation is easiest to describe in a plane. RoPE therefore splits the \(d\) dimensions into \(d/2\) consecutive pairs and rotates each pair in its own plane, using its own angle \(\theta_i\). The full rotation matrix is block-diagonal, with the 2 &times; 2 rotation of each pair on the diagonal and zeros elsewhere:</p>
    <p>\(R_{\theta,m} = \begin{pmatrix} \text{block}_1 & 0 & \cdots & 0 \\ 0 & \text{block}_2 & \ddots & \vdots \\ \vdots & \ddots & \ddots & 0 \\ 0 & \cdots & 0 & \text{block}_{d/2} \end{pmatrix}, \quad \text{block}_i = \begin{pmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \cos(m\theta_i) \end{pmatrix}\)</p>
    <p>Some write the angle as \(\omega_i = 1/10000^{2i/d}\) with \(i\) starting at 0; it is the same set of values. In practice the big matrix is never built: each pair is rotated directly, so the cost is small and RoPE adds <strong>no learnable parameters</strong>.</p>
    <p><img src="/images/rope-pairs.svg" alt="An 8-dimensional vector split into four pairs, each pair rotated by m times its own theta, shown for position m equal to 3" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
d = 4  ->  2 pairs, theta_1 = 1, theta_2 = 0.01
Vector x = [1, 0, 1, 0]

position 0 : [ 1.000, 0.000, 1.000, 0.000]   (no rotation)
position 1 : [ 0.540, 0.841, 1.000, 0.010]   (pair 1 turned 1 rad, pair 2 turned 0.01 rad)
position 2 : [-0.416, 0.909, 1.000, 0.020]
    {% endhighlight %}
</div>

<!-- Topic 5 -->
<div class="problem-card" id="rope-frequencies">
    <div class="problem-header">
        <h3 class="problem-title">5. Different Frequencies Across Dimensions</h3>
        <span class="badge badge-medium">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Low index:</strong> Rotates fast with position (high frequency)</div>
        <div class="meta-item"><strong>High index:</strong> Rotates slowly with position (low frequency)</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Each pair has its own rotation speed, set by \(\theta_i\). The rotation angle of pair \(i\) at position \(p\) is \(p \cdot \theta_i\), which grows with the position. Three consequences follow. <strong>(1)</strong> Larger position differences lead to larger rotations, so nearby tokens get similar rotations while distant tokens get different ones. <strong>(2)</strong> Low-index pairs change quickly with position (high frequency), and high-index pairs change slowly (low frequency). <strong>(3)</strong> The fast pairs capture small shifts, while the slow pairs keep track of long distances, much like the hands of a clock.</p>
    <p><img src="/images/rope-frequencies.svg" alt="Dial grid showing rotation angles for four pairs across five token positions: the first pair turns a lot at each step while the last pair barely moves" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Compare "I just told her the truth"  vs  "I told just her the truth"

Only the word "told" moves by one position. A fast pair (large theta)
rotates noticeably for a 1-position shift, so the model can see the
difference. A slow pair barely changes, so it cannot tell these two
sentences apart but is useful for relations over long distances.
    {% endhighlight %}
</div>

<!-- Topic 6 -->
<div class="problem-card" id="relative-distance">
    <div class="problem-header">
        <h3 class="problem-title">6. Benefit: Relative Distance Is Captured</h3>
        <span class="badge badge-hard">Key Property</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Formula:</strong> \(q_m k_n^T = x_m W_q R_{\theta,n-m} W_k^T x_n^T\)</div>
        <div class="meta-item"><strong>Meaning:</strong> The score depends on \(n-m\), not on \(m\) and \(n\) separately</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>Take the token vectors \(x_m\) and \(x_n\), project them with \(W_q\) and \(W_k\), and rotate the results by their positions. The rotated query is \(x_m W_q R_{\theta,m}^T\) and the rotated key is \(x_n W_k R_{\theta,n}^T\). When their dot product is taken, the two rotations combine into one, because \(R_{\theta,m}^T R_{\theta,n} = R_{\theta,n-m}\). The absolute positions disappear and only the relative distance \(n-m\) remains:</p>
    <p>\(q_m k_n^T = x_m W_q R_{\theta,m}^T R_{\theta,n} W_k^T x_n^T = x_m W_q R_{\theta,n-m} W_k^T x_n^T\)</p>
    <p>So the model learns patterns such as "the word two places before me" in a way that works at any position in the text.</p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
2D case, theta = 30 degrees, query = key = (1, 0) before rotation.
The dot product of the rotated vectors is cos((n - m) * theta):

m = 1, n = 3  (distance 2) -> cos(60 degrees) = 0.50
m = 5, n = 7  (distance 2) -> cos(60 degrees) = 0.50   (same distance, same score)
m = 2, n = 3  (distance 1) -> cos(30 degrees) = 0.87   (closer, higher score)
    {% endhighlight %}
</div>

<!-- Topic 7 -->
<div class="problem-card" id="long-term-decay">
    <div class="problem-header">
        <h3 class="problem-title">7. Attention Weight Has a Long-term Decay</h3>
        <span class="badge badge-medium">Property</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Observation:</strong> Upper bound of the attention score shrinks as \(|m-n|\) grows</div>
        <div class="meta-item"><strong>Effect:</strong> Distant tokens interact less than nearby ones</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>The RoFormer paper shows that the relative upper bound of the attention score \(A(q_m k_n^T)\) decreases as the distance \(|m-n|\) grows. The reason is the mix of frequencies: for a small distance all pairs are rotated by similar amounts and their contributions add up, but for a large distance the fast-rotating pairs point in different directions and partly cancel each other. This matches the intuition that tokens close to each other are usually more relevant than far-away ones. It is a bound, not a rule, so the model can still attend strongly to a distant token when the content demands it.</p>
    <p><img src="/images/rope-decay.svg" alt="Curve of the relative upper bound of attention against the distance between positions, dropping quickly at first and then decreasing slowly with small oscillations" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Relative upper bound (d = 256, scaled so that distance 0 = 100%):

distance   0 : 100%
distance  50 :  about 35%
distance 150 :  about 23%
distance 255 :  about 19%

A token 5 positions away is influenced much more than one 200 positions away.
    {% endhighlight %}
</div>

<!-- Topic 8 -->
<div class="problem-card" id="rope-implementation">
    <div class="problem-header">
        <h3 class="problem-title">8. Implementation</h3>
        <span class="badge badge-medium">Code</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Applied To:</strong> Queries and keys only (not values)</div>
        <div class="meta-item"><strong>Where:</strong> In every attention layer, after the Q and K projections</div>
    </div>
    <div class="section-subtitle">Explanation</div>
    <p>RoPE is applied after the linear projections that create Q and K, inside every attention layer. For each token, the vector is split into pairs, and each pair is rotated by (position &times; \(\theta_i\)) using the element-wise formulas from section 3. The value vectors are not rotated, because positions only need to influence <em>which</em> tokens are attended to, not the content that is passed on. The code below rotates one vector and then checks the relative-distance property from section 6.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import numpy as np

def rope(x: np.ndarray, pos: int, base: float = 10000.0) -> np.ndarray:
    d = len(x)                                   # d must be even
    i = np.arange(d // 2)
    theta = base ** (-2 * i / d)                 # one angle per pair
    angle = pos * theta                          # rotation angle of each pair
    x1, x2 = x[0::2], x[1::2]                    # split into pairs
    out = np.empty_like(x, dtype=float)
    out[0::2] = x1 * np.cos(angle) - x2 * np.sin(angle)
    out[1::2] = x1 * np.sin(angle) + x2 * np.cos(angle)
    return out

# Relative-distance check: the score only depends on n - m
rng = np.random.default_rng(0)
q, k = rng.normal(size=8), rng.normal(size=8)
for m, n in [(1, 3), (5, 7), (10, 12), (2, 3)]:
    print(m, n, round(float(rope(q, m) @ rope(k, n)), 4))
    {% endhighlight %}
    <div class="section-subtitle">Example</div>
    {% highlight text %}
Output of the check above:
1 3  -1.3804
5 7  -1.3804
10 12 -1.3804      <- distance 2 every time: identical scores
2 3  -1.3091       <- distance 1: a different score
    {% endhighlight %}
</div>

<!-- Topic 9 -->
<div class="problem-card" id="sinusoidal-vs-rope">
    <div class="problem-header">
        <h3 class="problem-title">9. Sinusoidal Encoding vs RoPE</h3>
        <span class="badge badge-hard">Comparison</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Compared:</strong> Original sinusoidal positional encoding and RoPE</div>
        <div class="meta-item"><strong>Takeaway:</strong> RoPE puts relative position directly into the attention score</div>
    </div>
    <div class="section-subtitle">Summary Table</div>
    <table>
        <thead>
            <tr>
                <th>Aspect</th>
                <th>Sinusoidal positional encoding</th>
                <th>RoPE</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>How position is used</strong></td>
                <td>A vector is added to the input embeddings</td>
                <td>Queries and keys are rotated; nothing is added</td>
            </tr>
            <tr>
                <td><strong>Where it acts</strong></td>
                <td>Once, at the input of the model</td>
                <td>In every attention layer, on Q and K</td>
            </tr>
            <tr>
                <td><strong>Relative distance</strong></td>
                <td>Only indirectly available to the model</td>
                <td>Directly in the score through \(R_{\theta,n-m}\)</td>
            </tr>
            <tr>
                <td><strong>Extra parameters</strong></td>
                <td>None (when hardcoded)</td>
                <td>None</td>
            </tr>
            <tr>
                <td><strong>Long-distance behavior</strong></td>
                <td>No built-in decay</td>
                <td>Attention bound decays with distance</td>
            </tr>
        </tbody>
    </table>
</div>

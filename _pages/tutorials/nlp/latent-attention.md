---
layout: archive
title: "Latent Attention (MLA)"
permalink: /Resources/nlp/latent-attention/
author_profile: true
---

[Back to NLP Index](/Resources/nlp/)

<!-- Topic 1 -->
<div class="problem-card" id="latent-attention-overview">
    <div class="problem-header">
        <h3 class="problem-title">1. Multi-head Latent Attention (MLA): Concept</h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>KV Cache per Token (standard):</strong> \(2 \cdot n_h \cdot d_h\)</div>
        <div class="meta-item"><strong>KV Cache per Token (MLA):</strong> \(d_c\) (latent dimension)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>During autoregressive decoding, standard Multi-Head Attention (MHA) caches the Key and Value vectors of every previous token. For long contexts, this <code>KV cache</code> dominates GPU memory and limits batch size and sequence length. How can we shrink the cache without hurting attention quality?</p>
    <div class="section-subtitle">Explanation</div>
    <p><strong>Latent attention</strong> (introduced in DeepSeek-V2) does not cache \(K\) and \(V\) directly. Instead, each token's hidden state \(x\) is first compressed by a <strong>down-projection</strong> \(W_{DKV}\) into a small shared <strong>latent vector</strong> \(c_{KV}\). Only this latent vector is stored in the cache. When Keys and Values are needed, they are reconstructed from the latent with two <strong>up-projection</strong> matrices, \(W_{UK}\) and \(W_{UV}\).</p>
    <p>Because \(K\) and \(V\) are both derived from the same low-dimensional latent, the cache stores one compact vector per token instead of two full-size vectors per head.</p>
    <p><img src="/images/mla-latent-attention.png" alt="Latent attention data flow: X is projected to Q by Wq and to the latent C_KV by W_DKV; C_KV is up-projected to K and V by W_UK and W_UV; Q times K transpose gives attention scores, which pass through scaling, softmax and causal masking to give attention weights; weights times V gives the context matrix" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import torch
import torch.nn as nn

class LatentKVCompression(nn.Module):
    """Compress hidden states into a latent and rebuild K, V from it."""
    def __init__(self, d_model: int = 8, d_latent: int = 4, d_head: int = 4):
        super().__init__()
        self.W_dkv = nn.Linear(d_model, d_latent, bias=False)   # down-projection
        self.W_uk = nn.Linear(d_latent, d_head, bias=False)     # up-projection for K
        self.W_uv = nn.Linear(d_latent, d_head, bias=False)     # up-projection for V

    def forward(self, x: torch.Tensor):
        c_kv = self.W_dkv(x)      # (T, d_latent)  <- only this is cached
        k = self.W_uk(c_kv)       # (T, d_head)
        v = self.W_uv(c_kv)       # (T, d_head)
        return c_kv, k, v
    {% endhighlight %}
</div>

<!-- Topic 2 -->
<div class="problem-card" id="latent-attention-kv-calculation">
    <div class="problem-header">
        <h3 class="problem-title">2. Step-by-Step Calculation up to the Context Vector</h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(T^2 \cdot d)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(T \cdot d_c)\) for the cache</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Trace the full forward pass of latent attention for the input sentence <code>"The next day is"</code>, using sample dimensions: \(T = 4\) tokens, model dimension \(d_{model} = 8\), latent dimension \(d_c = 4\) and head dimension \(d_h = 4\). Compute every tensor from the input \(X\) to the context matrix.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The sample dimensions used in the diagram are:</p>
    <p>
        <strong>Input \(X\):</strong> \((4, 8)\), one 8-dimensional feature row per token (<code>The</code>, <code>next</code>, <code>day</code>, <code>is</code>).<br>
        <strong>\(W_q\):</strong> \((8, 4)\), <strong>\(W_{DKV}\):</strong> \((8, 4)\), <strong>\(W_{UK}\):</strong> \((4, 4)\), <strong>\(W_{UV}\):</strong> \((4, 4)\).
    </p>
    <p><strong>Step 1: Query.</strong> Project the input directly to queries: \(Q = X W_q\), giving shape \((4, 8) \times (8, 4) = (4, 4)\).</p>
    <p><strong>Step 2: Latent (KV compression).</strong> Down-project the input: \(C_{KV} = X W_{DKV}\), giving shape \((4, 8) \times (8, 4) = (4, 4)\). This is the only tensor stored in the KV cache.</p>
    <p><strong>Step 3: Key and Value reconstruction.</strong> Up-project the latent: \(K = C_{KV} W_{UK}\) and \(V = C_{KV} W_{UV}\), each of shape \((4, 4) \times (4, 4) = (4, 4)\).</p>
    <p><strong>Step 4: Attention scores.</strong> \(S = Q K^{T}\), shape \((4, 4) \times (4, 4) = (4, 4)\).</p>
    <p><strong>Step 5: Scaling, causal mask and softmax.</strong> Divide by \(\sqrt{d_h}\), set the upper triangle (future tokens) to \(-\infty\), then apply softmax row-wise:</p>
    <p>\[ A = \text{softmax}\left(\frac{Q K^{T}}{\sqrt{d_h}} + M_{causal}\right) \]</p>
    <p>The attention weights \(A\) have shape \((4, 4)\), and each row sums to 1. For example, the token <code>day</code> (row 3) can only attend to <code>The</code>, <code>next</code> and itself.</p>
    <p><strong>Step 6: Context matrix.</strong> Weight the Values by the attention weights: \(\text{Context} = A V\), shape \((4, 4) \times (4, 4) = (4, 4)\). Each row is the context vector of one token.</p>
    <p><strong>Cache comparison for this example:</strong> standard attention caches \(K\) and \(V\), which is \(2 \times 4 \times 4 = 32\) values. Latent attention caches only \(C_{KV}\), which is \(4 \times 4 = 16\) values. In real models \(d_c\) is much smaller than \(n_h \cdot d_h\), so the saving is far larger.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import math
import torch
import torch.nn.functional as F

T, d_model, d_c, d_h = 4, 8, 4, 4
X = torch.randn(T, d_model)            # (4, 8)  "The next day is"

W_q   = torch.randn(d_model, d_h)      # (8, 4)
W_dkv = torch.randn(d_model, d_c)      # (8, 4)
W_uk  = torch.randn(d_c, d_h)          # (4, 4)
W_uv  = torch.randn(d_c, d_h)          # (4, 4)

Q    = X @ W_q                         # (4, 4)
C_kv = X @ W_dkv                       # (4, 4)  latent, cached
K    = C_kv @ W_uk                     # (4, 4)
V    = C_kv @ W_uv                     # (4, 4)

scores = Q @ K.T / math.sqrt(d_h)      # (4, 4)
mask = torch.triu(torch.ones(T, T), diagonal=1).bool()
scores = scores.masked_fill(mask, float('-inf'))
weights = F.softmax(scores, dim=-1)    # (4, 4)

context = weights @ V                  # (4, 4)
print(context.shape)                   # torch.Size([4, 4])
    {% endhighlight %}
</div>

<!-- Topic 3 -->
<div class="problem-card" id="latent-attention-absorption-matrix">
    <div class="problem-header">
        <h3 class="problem-title">3. Absorption Matrix (Weight Absorption)</h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(T \cdot d_c)\) per decoded token</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) extra (matrices merged offline)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>At inference time, rebuilding \(K\) and \(V\) from the latent for every cached token on every decoding step is wasteful. Can we avoid materialising \(K\) and \(V\) at all, and compute attention directly on the cached latent \(C_{KV}\)?</p>
    <div class="section-subtitle">Explanation</div>
    <p>Matrix multiplication is associative, so the up-projection matrices can be <strong>absorbed</strong> into neighbouring weights. This is done once, offline, and creates the <strong>absorption matrices</strong>.</p>
    <p><strong>Absorbing \(W_{UK}\) into the query side.</strong> Substitute \(K = C_{KV} W_{UK}\) into the score:</p>
    <p>\[ Q K^{T} = (X W_q)(C_{KV} W_{UK})^{T} = X \underbrace{(W_q W_{UK}^{T})}_{W_{absorb}} C_{KV}^{T} \]</p>
    <p>The merged matrix \(W_{absorb} = W_q W_{UK}^{T}\) has shape \((8, 4) \times (4, 4) = (8, 4)\). The scores are now computed as \((X W_{absorb}) C_{KV}^{T}\), directly against the cached latent, so \(K\) is never built.</p>
    <p><strong>Absorbing \(W_{UV}\) into the output projection.</strong> Substitute \(V = C_{KV} W_{UV}\) into the context and apply the output projection \(W_O\):</p>
    <p>\[ \text{Out} = (A\, C_{KV} W_{UV})\, W_O = (A\, C_{KV}) \underbrace{(W_{UV} W_O)}_{W_{absorb}'} \]</p>
    <p>Attention weights are applied to the latent first, and the merged matrix \(W_{UV} W_O\) maps the result to the model dimension, so \(V\) is never built either.</p>
    <p><strong>Important notes:</strong></p>
    <p>
        1. Absorption is an <em>inference-time</em> optimisation. Training keeps the separate matrices.<br>
        2. It pays off when \(d_c < n_h \cdot d_h\) (many heads, small latent). In this toy example \(d_c = d_h\) so there is no real saving, but the algebra is identical.<br>
        3. RoPE position encoding breaks absorption, because the rotation sits between \(W_q\) and \(W_{UK}^{T}\) and does not commute with them. DeepSeek solves this with a small separate <strong>decoupled RoPE</strong> key/query component that is not absorbed.
    </p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import math
import torch
import torch.nn.functional as F

T, d_model, d_c, d_h = 4, 8, 4, 4
X     = torch.randn(T, d_model)
W_q   = torch.randn(d_model, d_h)
W_dkv = torch.randn(d_model, d_c)
W_uk  = torch.randn(d_c, d_h)
W_uv  = torch.randn(d_c, d_h)
W_o   = torch.randn(d_h, d_model)

C_kv = X @ W_dkv                        # only this is cached

# Offline: merge weights (absorption matrices)
W_absorb_q = W_q @ W_uk.T               # (8, 4)
W_absorb_o = W_uv @ W_o                 # (4, 8)

# Attention directly on the latent (K and V never materialised)
scores = (X @ W_absorb_q) @ C_kv.T / math.sqrt(d_h)   # (4, 4)
mask = torch.triu(torch.ones(T, T), diagonal=1).bool()
weights = F.softmax(scores.masked_fill(mask, float('-inf')), dim=-1)
out_absorbed = (weights @ C_kv) @ W_absorb_o          # (4, 8)

# Reference: standard path with explicit K and V
Q, K, V = X @ W_q, C_kv @ W_uk, C_kv @ W_uv
ref_scores = Q @ K.T / math.sqrt(d_h)
ref_w = F.softmax(ref_scores.masked_fill(mask, float('-inf')), dim=-1)
out_ref = (ref_w @ V) @ W_o

print(torch.allclose(out_absorbed, out_ref, atol=1e-4))  # True
    {% endhighlight %}
</div>

---
layout: archive
title: "Math & Miscellaneous"
permalink: /Resources/leetcode/math-miscellaneous/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 72 -->
<div class="problem-card" id="powx-n">
    <div class="problem-header">
        <h3 class="problem-title">72. <a href="https://leetcode.com/problems/powx-n/" target="_blank" rel="noopener noreferrer">Pow(x, n)</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\log |n|)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Implement <code>pow(x, n)</code>, which calculates <code>x</code> raised to the power <code>n</code> (\(x^n\)), where <code>n</code> is an integer that may be negative.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Multiplying <code>x</code> by itself <code>n</code> times is \(O(n)\) and too slow. Use <strong>exponentiation by squaring</strong>, which is based on the binary representation of <code>n</code>. Squaring the base each step gives \(x, x^2, x^4, x^8, \dots\), and the result only multiplies in the powers that correspond to a <code>1</code> bit of <code>n</code>. For example, \(x^{13} = x^8 \cdot x^4 \cdot x^1\) since \(13 = 1101_2\). The loop runs once per bit, so it takes \(O(\log |n|)\) steps. A negative exponent is handled with \(x^{-n} = (1/x)^n\), by inverting <code>x</code> and negating <code>n</code> first. The iterative version avoids recursion depth entirely.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def myPow(x: float, n: int) -> float:
    if n < 0:
        x = 1 / x
        n = -n

    result = 1.0
    while n:
        if n & 1:      # current bit is set: multiply this power in
            result *= x
        x *= x         # x, x^2, x^4, x^8, ...
        n >>= 1
    return result
    {% endhighlight %}
</div>

<!-- Problem 73 -->
<div class="problem-card" id="multiply-strings">
    <div class="problem-header">
        <h3 class="problem-title">73. <a href="https://leetcode.com/problems/multiply-strings/" target="_blank" rel="noopener noreferrer">Multiply Strings</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(M + N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string. You must not use any built-in big integer library or convert the inputs to integers directly.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Simulate grade-school multiplication. A number with \(M\) digits times a number with \(N\) digits has at most \(M + N\) digits, so allocate a result array of that length. The product of <code>num1[i]</code> and <code>num2[j]</code> contributes to positions <code>i + j</code> (the carry) and <code>i + j + 1</code> (the digit). For each pair, add the product to whatever is already stored at <code>res[i + j + 1]</code>, keep the last digit there, and add the carry to <code>res[i + j]</code>. Iterating from the right (least significant digits) lets the carry be absorbed by the next iteration. At the end, strip leading zeros. If either input is <code>"0"</code>, return <code>"0"</code> immediately.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def multiply(num1: str, num2: str) -> str:
    if num1 == "0" or num2 == "0":
        return "0"

    m, n = len(num1), len(num2)
    res = [0] * (m + n)

    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            total = int(num1[i]) * int(num2[j]) + res[i + j + 1]
            res[i + j + 1] = total % 10   # digit stays at this position
            res[i + j] += total // 10     # carry goes to the next position

    return "".join(map(str, res)).lstrip("0")
    {% endhighlight %}
</div>

<!-- Problem 74 -->
<div class="problem-card" id="rotate-image">
    <div class="problem-header">
        <h3 class="problem-title">74. <a href="https://leetcode.com/problems/rotate-image/" target="_blank" rel="noopener noreferrer">Rotate Image</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N^2)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given an <code>n x n</code> 2D matrix representing an image. Rotate the image by 90 degrees clockwise. You must rotate the image <strong>in-place</strong>, which means you have to modify the input matrix directly without allocating another matrix.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A 90 degree clockwise rotation is the combination of two simple in-place operations: <strong>transpose</strong> the matrix (swap <code>matrix[i][j]</code> with <code>matrix[j][i]</code>), then <strong>reverse each row</strong>. The transpose turns rows into columns, and reversing each row puts those columns in the correct clockwise order. For a counter-clockwise rotation, reverse each row first or reverse the order of the rows after transposing instead. Every element is touched a constant number of times, which is optimal since every cell must be read.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)

    # Transpose: swap across the main diagonal
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Reverse each row
    for row in matrix:
        row.reverse()
    {% endhighlight %}
</div>

<!-- Problem 75 -->
<div class="problem-card" id="spiral-matrix">
    <div class="problem-header">
        <h3 class="problem-title">75. <a href="https://leetcode.com/problems/spiral-matrix/" target="_blank" rel="noopener noreferrer">Spiral Matrix</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) extra</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an <code>m x n</code> matrix, return all elements of the matrix in spiral order, starting at the top-left corner and moving clockwise.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Keep four boundaries: <code>top</code>, <code>bottom</code>, <code>left</code> and <code>right</code>. Each loop iteration peels off one layer in four moves: left to right along the top row, top to bottom along the right column, right to left along the bottom row, and bottom to top along the left column. After each move, shrink the matching boundary. The bottom row and left column moves need a check (<code>top &lt;= bottom</code> and <code>left &lt;= right</code>), because after the first two moves a single remaining row or column would otherwise be traversed twice. Every cell is visited exactly once, and no visited matrix is needed.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def spiralOrder(matrix: list[list[int]]) -> list[int]:
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # Left to right along the top row
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1

        # Top to bottom along the right column
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1

        # Right to left along the bottom row (if a row remains)
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1

        # Bottom to top along the left column (if a column remains)
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1

    return res
    {% endhighlight %}
</div>

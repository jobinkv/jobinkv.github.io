---
layout: archive
title: "Dynamic Programming"
permalink: /Resources/leetcode/dynamic-programming/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 50 -->
<div class="problem-card" id="climbing-stairs">
    <div class="problem-header">
        <h3 class="problem-title">50. <a href="https://leetcode.com/problems/climbing-stairs/" target="_blank" rel="noopener noreferrer">Climbing Stairs</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are climbing a staircase that takes <code>n</code> steps to reach the top. Each time you can climb either <code>1</code> or <code>2</code> steps. Return the number of distinct ways you can climb to the top.</p>
    <div class="section-subtitle">Explanation</div>
    <p>To stand on step \(i\), you came from step \(i-1\) (one step) or step \(i-2\) (two steps), so \(\text{ways}(i) = \text{ways}(i-1) + \text{ways}(i-2)\), which is the Fibonacci recurrence. Since each value only depends on the previous two, keep just two variables instead of a full DP array.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def climbStairs(n: int) -> int:
    prev, curr = 1, 1  # ways(0), ways(1)
    for _ in range(n - 1):
        prev, curr = curr, prev + curr
    return curr
    {% endhighlight %}
</div>

<!-- Problem 51 -->
<div class="problem-card" id="coin-change">
    <div class="problem-header">
        <h3 class="problem-title">51. <a href="https://leetcode.com/problems/coin-change/" target="_blank" rel="noopener noreferrer">Coin Change</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(A \cdot C)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(A)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array <code>coins</code> of different denominations and an integer <code>amount</code>, return the fewest number of coins needed to make up that amount, or <code>-1</code> if it cannot be made. You have an infinite supply of each coin.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Greedy fails here (for example, coins <code>[1, 3, 4]</code> and amount <code>6</code>), so use bottom-up DP. Let <code>dp[a]</code> be the fewest coins needed for amount <code>a</code>. Then \(dp[a] = \min_{c \le a}(dp[a - c] + 1)\) over all coins <code>c</code>, with <code>dp[0] = 0</code>. Amounts that are unreachable stay at infinity. Here \(A\) is the amount and \(C\) is the number of coin types.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
    {% endhighlight %}
</div>

<!-- Problem 52 -->
<div class="problem-card" id="longest-increasing-subsequence">
    <div class="problem-header">
        <h3 class="problem-title">52. <a href="https://leetcode.com/problems/longest-increasing-subsequence/" target="_blank" rel="noopener noreferrer">Longest Increasing Subsequence</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The classic DP is \(O(N^2)\). The optimal approach keeps an array <code>tails</code> where <code>tails[i]</code> is the smallest possible tail value of an increasing subsequence of length <code>i + 1</code>. This array is always sorted, so for each number use binary search (<code>bisect_left</code>) to find the first tail that is greater than or equal to it and replace that tail; if the number is larger than every tail, append it. Replacing keeps tails as small as possible, leaving more room to extend later. The length of <code>tails</code> is the answer. Note that <code>tails</code> itself is not necessarily a valid subsequence, only its length is meaningful.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from bisect import bisect_left

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
    {% endhighlight %}
</div>

<!-- Problem 53 -->
<div class="problem-card" id="longest-common-subsequence">
    <div class="problem-header">
        <h3 class="problem-title">53. <a href="https://leetcode.com/problems/longest-common-subsequence/" target="_blank" rel="noopener noreferrer">Longest Common Subsequence</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\min(M, N))\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence. If there is no common subsequence, return <code>0</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Let <code>dp[i][j]</code> be the LCS length of the first <code>i</code> characters of <code>text1</code> and the first <code>j</code> characters of <code>text2</code>. If the characters match, extend the diagonal: \(dp[i][j] = dp[i-1][j-1] + 1\). Otherwise take the better of dropping one character from either string: \(dp[i][j] = \max(dp[i-1][j], dp[i][j-1])\). Each row only depends on the previous row, so keep just two rows, and make the shorter string the column dimension to get \(O(\min(M, N))\) space.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def longestCommonSubsequence(text1: str, text2: str) -> int:
    # Make text2 the shorter string so rows are as small as possible
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    n = len(text2)

    prev = [0] * (n + 1)
    for i in range(1, len(text1) + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev = curr
    return prev[n]
    {% endhighlight %}
</div>

<!-- Problem 54 -->
<div class="problem-card" id="word-break">
    <div class="problem-header">
        <h3 class="problem-title">54. <a href="https://leetcode.com/problems/word-break/" target="_blank" rel="noopener noreferrer">Word Break</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \cdot L^2)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N + W)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>True</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words. The same word may be reused multiple times.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Let <code>dp[i]</code> be <code>True</code> if the prefix <code>s[:i]</code> can be segmented. <code>dp[0]</code> is <code>True</code> (empty prefix). For each position <code>i</code>, check whether some last word <code>s[i-l:i]</code> is in the dictionary while the prefix before it, <code>dp[i-l]</code>, is also segmentable. Store the words in a set for \(O(1)\) average lookups, and only try lengths up to the longest dictionary word \(L\), since longer pieces can never match. Slicing and hashing each substring costs \(O(L)\), which gives the \(O(N \cdot L^2)\) bound, where \(W\) is the total number of characters in the dictionary.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def wordBreak(s: str, wordDict: list[str]) -> bool:
    words = set(wordDict)
    max_len = max(len(w) for w in words)
    n = len(s)

    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for l in range(1, min(i, max_len) + 1):
            if dp[i - l] and s[i - l:i] in words:
                dp[i] = True
                break
    return dp[n]
    {% endhighlight %}
</div>

<!-- Problem 55 -->
<div class="problem-card" id="combination-sum-iv">
    <div class="problem-header">
        <h3 class="problem-title">55. <a href="https://leetcode.com/problems/combination-sum-iv/" target="_blank" rel="noopener noreferrer">Combination Sum IV</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(T \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(T)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of distinct integers <code>nums</code> and a target integer <code>target</code>, return the number of possible combinations that add up to <code>target</code>. Sequences with a different order are counted as different combinations.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Because order matters, this really counts permutations. Let <code>dp[t]</code> be the number of ordered sequences that sum to <code>t</code>, with <code>dp[0] = 1</code> (the empty sequence). Then \(dp[t] = \sum dp[t - \text{num}]\) over every <code>num</code> that fits. The loop order is important: put the <strong>target in the outer loop and the numbers in the inner loop</strong> so every number can be the last element at each sum. Swapping the loops would count each set of numbers only once (as in Coin Change II). Here \(T\) is the target and \(N\) is the length of <code>nums</code>.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def combinationSum4(nums: list[int], target: int) -> int:
    dp = [0] * (target + 1)
    dp[0] = 1
    for t in range(1, target + 1):
        for num in nums:
            if num <= t:
                dp[t] += dp[t - num]
    return dp[target]
    {% endhighlight %}
</div>

<!-- Problem 56 -->
<div class="problem-card" id="house-robber">
    <div class="problem-header">
        <h3 class="problem-title">56. <a href="https://leetcode.com/problems/house-robber/" target="_blank" rel="noopener noreferrer">House Robber</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are a robber planning to rob houses along a street. Each house has a certain amount of money, <code>nums[i]</code>, but adjacent houses have connected security systems, so robbing two adjacent houses alerts the police. Return the maximum amount you can rob without alerting the police.</p>
    <div class="section-subtitle">Explanation</div>
    <p>At each house you either skip it (keep the best so far) or rob it (add its value to the best result from two houses back): \(dp[i] = \max(dp[i-1],\; dp[i-2] + \text{nums}[i])\). Only the last two values are needed, so two variables replace the DP array.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def rob(nums: list[int]) -> int:
    prev, curr = 0, 0  # best up to i-2, best up to i-1
    for n in nums:
        prev, curr = curr, max(curr, prev + n)
    return curr
    {% endhighlight %}
</div>

<!-- Problem 57 -->
<div class="problem-card" id="house-robber-ii">
    <div class="problem-header">
        <h3 class="problem-title">57. <a href="https://leetcode.com/problems/house-robber-ii/" target="_blank" rel="noopener noreferrer">House Robber II</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Same as House Robber, but all houses are arranged in a <strong>circle</strong>, so the first and last houses are adjacent. Return the maximum amount you can rob without alerting the police.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The first and last houses cannot both be robbed, so split the circle into two linear problems: rob from houses <code>0..n-2</code> (skipping the last) or from houses <code>1..n-1</code> (skipping the first), and take the better result. Both cases reuse the House Robber logic. A single house is a special case, since both ranges would be empty. Index ranges are used instead of slicing to avoid copying the array.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def rob(nums: list[int]) -> int:
    if len(nums) == 1:
        return nums[0]

    def rob_range(lo: int, hi: int) -> int:
        prev, curr = 0, 0
        for i in range(lo, hi + 1):
            prev, curr = curr, max(curr, prev + nums[i])
        return curr

    return max(rob_range(0, len(nums) - 2), rob_range(1, len(nums) - 1))
    {% endhighlight %}
</div>

<!-- Problem 58 -->
<div class="problem-card" id="decode-ways">
    <div class="problem-header">
        <h3 class="problem-title">58. <a href="https://leetcode.com/problems/decode-ways/" target="_blank" rel="noopener noreferrer">Decode Ways</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>A message containing letters from <code>A-Z</code> is encoded to numbers using the mapping <code>'A' -> 1, 'B' -> 2, ..., 'Z' -> 26</code>. Given a string <code>s</code> containing only digits, return the number of ways to decode it.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Let <code>dp[i]</code> be the number of ways to decode the first <code>i</code> characters. The last piece is either a single digit or a two-digit number. A single digit is valid if it is not <code>'0'</code> and adds <code>dp[i-1]</code>. A two-digit number is valid if it lies between <code>10</code> and <code>26</code> and adds <code>dp[i-2]</code>. A leading <code>'0'</code> means there are no valid decodings. Only the last two values are needed, so the table is replaced by two variables.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def numDecodings(s: str) -> int:
    if s[0] == '0':
        return 0

    prev2, prev1 = 1, 1  # dp[i-2], dp[i-1]
    for i in range(1, len(s)):
        curr = 0
        if s[i] != '0':
            curr += prev1
        if 10 <= int(s[i - 1:i + 1]) <= 26:
            curr += prev2
        prev2, prev1 = prev1, curr
    return prev1
    {% endhighlight %}
</div>

<!-- Problem 59 -->
<div class="problem-card" id="unique-paths">
    <div class="problem-header">
        <h3 class="problem-title">59. <a href="https://leetcode.com/problems/unique-paths/" target="_blank" rel="noopener noreferrer">Unique Paths</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\min(M, N))\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>A robot is located at the top-left corner of an <code>m x n</code> grid and can only move either down or right at any point in time. Return the number of unique paths the robot can take to reach the bottom-right corner.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The DP solution \(dp[r][c] = dp[r-1][c] + dp[r][c-1]\) takes \(O(M \cdot N)\) time. Combinatorics gives a direct formula: every path has exactly \(m-1\) down moves and \(n-1\) right moves, \(m+n-2\) moves in total, so the number of paths is the number of ways to choose which of those moves are the down moves:</p>
    <p>\[ \binom{m+n-2}{m-1} \]</p>
    <p><code>math.comb</code> computes this using about \(\min(m, n)\) arithmetic operations.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from math import comb

def uniquePaths(m: int, n: int) -> int:
    return comb(m + n - 2, m - 1)
    {% endhighlight %}
</div>

<!-- Problem 60 -->
<div class="problem-card" id="jump-game">
    <div class="problem-header">
        <h3 class="problem-title">60. <a href="https://leetcode.com/problems/jump-game/" target="_blank" rel="noopener noreferrer">Jump Game</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given an integer array <code>nums</code>. You are initially positioned at the first index, and each element represents your maximum jump length from that position. Return <code>True</code> if you can reach the last index, or <code>False</code> otherwise.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A DP or backtracking solution is unnecessary; a greedy scan is enough. Track <code>reach</code>, the farthest index reachable so far. For each index <code>i</code>, if <code>i &gt; reach</code> then this position cannot be reached at all, so return <code>False</code>. Otherwise update <code>reach = max(reach, i + nums[i])</code>. If the scan finishes, the last index is reachable.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def canJump(nums: list[int]) -> bool:
    reach = 0
    for i, jump in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + jump)
    return True
    {% endhighlight %}
</div>

<!-- Problem 61 -->
<div class="problem-card" id="partition-equal-subset-sum">
    <div class="problem-header">
        <h3 class="problem-title">61. <a href="https://leetcode.com/problems/partition-equal-subset-sum/" target="_blank" rel="noopener noreferrer">Partition Equal Subset Sum</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \cdot S)\) (bitwise, word-parallel)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(S)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, return <code>True</code> if you can partition the array into two subsets such that the sum of the elements in both subsets is equal, or <code>False</code> otherwise.</p>
    <div class="section-subtitle">Explanation</div>
    <p>If the total sum is odd, the answer is immediately <code>False</code>. Otherwise the task reduces to the 0/1 knapsack question: is there a subset with sum exactly \(S = \text{total} / 2\)? The usual 1D DP keeps a boolean array and updates it from high to low sums for each number. A faster equivalent uses a <strong>bitset</strong> stored in a Python integer, where bit \(k\) is set if sum \(k\) is reachable. Taking a number <code>n</code> turns every reachable sum \(k\) into \(k + n\), which is just a left shift: <code>bits |= bits &lt;&lt; n</code>. This updates all sums in one word-parallel operation. At the end, check whether bit \(S\) is set.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2

    bits = 1  # bit k is set if sum k is reachable; sum 0 is reachable
    for n in nums:
        bits |= bits << n
    return (bits >> target) & 1 == 1
    {% endhighlight %}
</div>

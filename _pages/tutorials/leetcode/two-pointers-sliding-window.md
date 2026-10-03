---
layout: archive
title: "Two Pointers / Sliding Window"
permalink: /Resources/leetcode/two-pointers-sliding-window/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 11 -->
<div class="problem-card" id="valid-palindrome">
    <div class="problem-header">
        <h3 class="problem-title">11. <a href="https://leetcode.com/problems/valid-palindrome/" target="_blank" rel="noopener noreferrer">Valid Palindrome</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a string <code>s</code>, return <code>True</code> if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, otherwise return <code>False</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Two Pointers starting at both ends of the string. Move <code>l</code> forward and <code>r</code> backward, skipping any non-alphanumeric characters. If the lowercase characters at both pointers differ, the string is not a palindrome. This avoids building a cleaned copy of the string, so extra space stays constant.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
    {% endhighlight %}
</div>

<!-- Problem 12 -->
<div class="problem-card" id="3sum-closest">
    <div class="problem-header">
        <h3 class="problem-title">12. <a href="https://leetcode.com/problems/3sum-closest/" target="_blank" rel="noopener noreferrer">3Sum Closest</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N^2)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) / \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code> of length <code>n</code> and an integer <code>target</code>, find three integers in <code>nums</code> such that the sum is closest to <code>target</code>. Return the sum of the three integers.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Sort the array first. Fix one element <code>nums[i]</code>, then use the Two-Pointer approach (<code>l</code> and <code>r</code>) on the remaining part. If the current sum is smaller than <code>target</code>, move <code>l</code> right to increase it; if larger, move <code>r</code> left to decrease it. Update the closest sum whenever \(|\text{sum} - \text{target}|\) improves, and return immediately if the sum equals <code>target</code>.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def threeSumClosest(nums: list[int], target: int) -> int:
    nums.sort()
    closest = nums[0] + nums[1] + nums[2]
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            total = nums[i] + nums[l] + nums[r]
            if abs(total - target) < abs(closest - target):
                closest = total
            if total < target:
                l += 1
            elif total > target:
                r -= 1
            else:
                return total
    return closest
    {% endhighlight %}
</div>

<!-- Problem 13 -->
<div class="problem-card" id="trapping-rain-water">
    <div class="problem-header">
        <h3 class="problem-title">13. <a href="https://leetcode.com/problems/trapping-rain-water/" target="_blank" rel="noopener noreferrer">Trapping Rain Water</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given \(n\) non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Water above a bar is \(\min(\text{maxLeft}, \text{maxRight}) - \text{height}[i]\). Instead of precomputing prefix and suffix arrays, use Two Pointers with running <code>left_max</code> and <code>right_max</code>. Always process the side with the smaller maximum, because that side's water level is limited by its own maximum no matter what lies on the other side. Move that pointer inward, update its maximum, and add the trapped water.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def trap(height: list[int]) -> int:
    if not height:
        return 0
    l, r = 0, len(height) - 1
    left_max, right_max = height[l], height[r]
    water = 0
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            water += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            water += right_max - height[r]
    return water
    {% endhighlight %}
</div>

<!-- Problem 14 -->
<div class="problem-card" id="remove-duplicates-from-sorted-array">
    <div class="problem-header">
        <h3 class="problem-title">14. <a href="https://leetcode.com/problems/remove-duplicates-from-sorted-array/" target="_blank" rel="noopener noreferrer">Remove Duplicates from Sorted Array</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code> sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements <code>k</code>, with the first <code>k</code> elements of <code>nums</code> holding the unique values in order.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a slow and fast pointer. The fast pointer <code>i</code> scans the array, while the slow pointer <code>k</code> marks the next position to write a unique value. Because the array is sorted, a value is new only if it differs from the last unique value written (<code>nums[k - 1]</code>).</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def removeDuplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    k = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[k - 1]:
            nums[k] = nums[i]
            k += 1
    return k
    {% endhighlight %}
</div>

<!-- Problem 15 -->
<div class="problem-card" id="move-zeroes">
    <div class="problem-header">
        <h3 class="problem-title">15. <a href="https://leetcode.com/problems/move-zeroes/" target="_blank" rel="noopener noreferrer">Move Zeroes</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, move all <code>0</code>'s to the end of it while maintaining the relative order of the non-zero elements. This must be done in-place without making a copy of the array.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Keep a write pointer <code>k</code> that marks where the next non-zero element belongs. Scan the array with <code>i</code>; whenever <code>nums[i]</code> is non-zero, swap it with <code>nums[k]</code> and advance <code>k</code>. Everything before <code>k</code> is always non-zero and in original order, and the zeroes get pushed to the end. This does the minimum number of writes in a single pass.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def moveZeroes(nums: list[int]) -> None:
    k = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[k], nums[i] = nums[i], nums[k]
            k += 1
    {% endhighlight %}
</div>

<!-- Problem 16 -->
<div class="problem-card" id="longest-substring-without-repeating-characters">
    <div class="problem-header">
        <h3 class="problem-title">16. <a href="https://leetcode.com/problems/longest-substring-without-repeating-characters/" target="_blank" rel="noopener noreferrer">Longest Substring Without Repeating Characters</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\min(N, \Sigma))\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a Sliding Window with a hash map storing the last index at which each character was seen. Expand the window by moving <code>right</code>. If the current character was last seen inside the window (<code>last[ch] &gt;= left</code>), jump <code>left</code> directly to one position after that index instead of shrinking one step at a time. Track the maximum window size. Here \(\Sigma\) is the size of the character set.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def lengthOfLongestSubstring(s: str) -> int:
    last = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best
    {% endhighlight %}
</div>

<!-- Problem 17 -->
<div class="problem-card" id="minimum-window-substring">
    <div class="problem-header">
        <h3 class="problem-title">17. <a href="https://leetcode.com/problems/minimum-window-substring/" target="_blank" rel="noopener noreferrer">Minimum Window Substring</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M + N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\Sigma)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given two strings <code>s</code> and <code>t</code> of lengths \(M\) and \(N\), return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If no such substring exists, return an empty string.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a Sliding Window with a single <code>need</code> counter built from <code>t</code> and a <code>missing</code> variable that counts how many required characters are still absent. Expanding <code>right</code> decrements <code>need[ch]</code>, and <code>missing</code> only drops when the count was positive (a useful character). Once <code>missing == 0</code>, the window is valid: shrink from the left while the leftmost character is surplus (<code>need[s[left]] &lt; 0</code>), record the best window, then drop one required character to start searching for the next window. Each index enters and leaves the window at most once.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import Counter

def minWindow(s: str, t: str) -> str:
    if not t or len(t) > len(s):
        return ""
    need = Counter(t)
    missing = len(t)
    left = 0
    best_start, best_len = 0, float('inf')

    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        if missing == 0:
            # Shrink while the left character is surplus
            while need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            if right - left + 1 < best_len:
                best_start, best_len = left, right - left + 1
            # Drop one required character to look for the next window
            need[s[left]] += 1
            missing += 1
            left += 1

    return "" if best_len == float('inf') else s[best_start:best_start + best_len]
    {% endhighlight %}
</div>

<!-- Problem 18 -->
<div class="problem-card" id="longest-repeating-character-replacement">
    <div class="problem-header">
        <h3 class="problem-title">18. <a href="https://leetcode.com/problems/longest-repeating-character-replacement/" target="_blank" rel="noopener noreferrer">Longest Repeating Character Replacement</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a string <code>s</code> of uppercase English letters and an integer <code>k</code>, you can replace at most <code>k</code> characters with any other character. Return the length of the longest substring containing the same letter after performing these replacements.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A window is valid if \(\text{window size} - \text{max frequency} \le k\), meaning the characters that are not the most frequent one can all be replaced. Expand <code>right</code> while counting characters and tracking <code>max_freq</code>. If the window becomes invalid, shrink it by one from the left. Note that <code>max_freq</code> is never decreased: the answer can only improve when a larger frequency is found, so a stale value never produces a wrong result. The space is \(O(1)\) because the alphabet has only 26 letters.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def characterReplacement(s: str, k: int) -> int:
    count = {}
    left = 0
    max_freq = 0
    best = 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        max_freq = max(max_freq, count[ch])

        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)
    return best
    {% endhighlight %}
</div>

<!-- Problem 19 -->
<div class="problem-card" id="permutation-in-string">
    <div class="problem-header">
        <h3 class="problem-title">19. <a href="https://leetcode.com/problems/permutation-in-string/" target="_blank" rel="noopener noreferrer">Permutation in String</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given two strings <code>s1</code> and <code>s2</code>, return <code>True</code> if <code>s2</code> contains a permutation of <code>s1</code>, or <code>False</code> otherwise. In other words, return <code>True</code> if one of <code>s1</code>'s permutations is a substring of <code>s2</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A permutation has the same character counts as <code>s1</code>, so slide a fixed-size window of length <code>len(s1)</code> over <code>s2</code> and compare 26-letter frequency arrays. Instead of comparing the arrays at every step, maintain a <code>matches</code> counter, the number of letters whose counts are equal. When a character enters or leaves the window, only that one letter's status can change, so <code>matches</code> is updated in \(O(1)\). A window is a permutation when <code>matches == 26</code>.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def checkInclusion(s1: str, s2: str) -> bool:
    n1, n2 = len(s1), len(s2)
    if n1 > n2:
        return False

    cnt1, cnt2 = [0] * 26, [0] * 26
    for i in range(n1):
        cnt1[ord(s1[i]) - ord('a')] += 1
        cnt2[ord(s2[i]) - ord('a')] += 1

    matches = sum(cnt1[i] == cnt2[i] for i in range(26))

    for r in range(n1, n2):
        if matches == 26:
            return True

        # Character entering the window
        i = ord(s2[r]) - ord('a')
        cnt2[i] += 1
        if cnt2[i] == cnt1[i]:
            matches += 1
        elif cnt2[i] == cnt1[i] + 1:
            matches -= 1

        # Character leaving the window
        i = ord(s2[r - n1]) - ord('a')
        cnt2[i] -= 1
        if cnt2[i] == cnt1[i]:
            matches += 1
        elif cnt2[i] == cnt1[i] - 1:
            matches -= 1

    return matches == 26
    {% endhighlight %}
</div>

<!-- Problem 20 -->
<div class="problem-card" id="sliding-window-maximum">
    <div class="problem-header">
        <h3 class="problem-title">20. <a href="https://leetcode.com/problems/sliding-window-maximum/" target="_blank" rel="noopener noreferrer">Sliding Window Maximum</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(K)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code> and a sliding window of size <code>k</code> moving from the far left to the far right, return the maximum value in each window position.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a Monotonic Decreasing Deque that stores indices. Before adding index <code>i</code>, pop from the back every index whose value is <code>&lt;= nums[i]</code>, since those elements can never be a window maximum while <code>nums[i]</code> is in the window. Pop from the front if its index has left the window (<code>&lt;= i - k</code>). The front of the deque is always the index of the current maximum. Each index is pushed and popped at most once, giving \(O(N)\) total time.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    dq = deque()  # indices, values in decreasing order
    res = []
    for i, num in enumerate(nums):
        # Remove smaller elements from the back
        while dq and nums[dq[-1]] <= num:
            dq.pop()
        dq.append(i)

        # Remove the front index if it is out of the window
        if dq[0] <= i - k:
            dq.popleft()

        # Window is fully formed
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
    {% endhighlight %}
</div>

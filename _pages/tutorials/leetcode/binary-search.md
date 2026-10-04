---
layout: archive
title: "Binary Search"
permalink: /Resources/leetcode/binary-search/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 68 -->
<div class="problem-card" id="binary-search">
    <div class="problem-header">
        <h3 class="problem-title">68. <a href="https://leetcode.com/problems/binary-search/" target="_blank" rel="noopener noreferrer">Binary Search</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of integers <code>nums</code> sorted in ascending order and an integer <code>target</code>, return the index of <code>target</code> if it exists in <code>nums</code>, otherwise return <code>-1</code>. The algorithm must run in \(O(\log N)\) time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Keep a search range <code>[left, right]</code> and compare the middle element with <code>target</code>. If they are equal, return the index. If the middle value is smaller than <code>target</code>, the target can only be in the right half (<code>left = mid + 1</code>); otherwise it can only be in the left half (<code>right = mid - 1</code>). Each step halves the range. The loop condition <code>left &lt;= right</code> keeps the range inclusive, so a single remaining element is still checked. Computing <code>mid = left + (right - left) // 2</code> avoids integer overflow in languages with fixed-size integers.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
    {% endhighlight %}
</div>

<!-- Problem 69 -->
<div class="problem-card" id="search-a-2d-matrix">
    <div class="problem-header">
        <h3 class="problem-title">69. <a href="https://leetcode.com/problems/search-a-2d-matrix/" target="_blank" rel="noopener noreferrer">Search a 2D Matrix</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\log (M \cdot N))\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given an <code>m x n</code> integer matrix <code>matrix</code> where each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row. Given an integer <code>target</code>, return <code>True</code> if <code>target</code> is in the matrix, or <code>False</code> otherwise, in \(O(\log (M \cdot N))\) time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Because every row starts after the previous row ends, reading the matrix row by row gives one fully sorted sequence of \(M \cdot N\) values. Run a single binary search over the virtual indices <code>0 .. m*n - 1</code> without actually flattening the matrix. A virtual index <code>mid</code> maps to the cell at row <code>mid // n</code> and column <code>mid % n</code>. Doing one binary search to find the row and a second one to find the column has the same \(O(\log M + \log N) = O(\log (M \cdot N))\) cost, but the single search is simpler to write.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    while left <= right:
        mid = left + (right - left) // 2
        value = matrix[mid // n][mid % n]
        if value == target:
            return True
        elif value < target:
            left = mid + 1
        else:
            right = mid - 1
    return False
    {% endhighlight %}
</div>

<!-- Problem 70 -->
<div class="problem-card" id="kth-largest-element-in-an-array">
    <div class="problem-header">
        <h3 class="problem-title">70. <a href="https://leetcode.com/problems/kth-largest-element-in-an-array/" target="_blank" rel="noopener noreferrer">Kth Largest Element in an Array</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\) average, \(O(N^2)\) worst case</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code>-th largest element in the array. Note that it is the <code>k</code>-th largest element in sorted order, not the <code>k</code>-th distinct element.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Sorting costs \(O(N \log N)\), and a min-heap of size <code>k</code> costs \(O(N \log k)\) with a guaranteed worst case. The fastest approach on average is <strong>Quickselect</strong>, which uses the partition step of Quicksort but only continues into the one side that contains the answer. The <code>k</code>-th largest element is at index <code>N - k</code> in ascending order. Pick a random pivot (this makes the \(O(N^2)\) worst case extremely unlikely) and partition the current range into three parts: values less than the pivot, equal to the pivot, and greater than the pivot. If the target index falls inside the "equal" part, the pivot is the answer; otherwise repeat on the side that contains the target index. The three-way split keeps the algorithm fast when the array has many duplicates. The work shrinks geometrically on average (\(N + N/2 + N/4 + \dots\)), giving \(O(N)\) expected time.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import random

def findKthLargest(nums: list[int], k: int) -> int:
    target = len(nums) - k  # index of the answer in ascending order
    left, right = 0, len(nums) - 1

    while True:
        pivot = nums[random.randint(left, right)]

        # Three-way partition of nums[left..right]:
        # [left, lt) < pivot, [lt, gt] == pivot, (gt, right] > pivot
        lt, i, gt = left, left, right
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1
                i += 1
            elif nums[i] > pivot:
                nums[i], nums[gt] = nums[gt], nums[i]
                gt -= 1
            else:
                i += 1

        if target < lt:
            right = lt - 1
        elif target > gt:
            left = gt + 1
        else:
            return nums[target]
    {% endhighlight %}
</div>

<!-- Problem 71 -->
<div class="problem-card" id="find-median-from-data-stream">
    <div class="problem-header">
        <h3 class="problem-title">71. <a href="https://leetcode.com/problems/find-median-from-data-stream/" target="_blank" rel="noopener noreferrer">Find Median from Data Stream</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> <code>addNum</code> \(O(\log N)\); <code>findMedian</code> \(O(1)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Design a data structure that supports adding integers from a data stream and finding the median of all elements added so far. Implement <code>addNum(num)</code> and <code>findMedian()</code>. The median is the middle value of the sorted list, or the average of the two middle values if the count is even.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Keep the data split into two halves using two heaps: a <strong>max-heap</strong> <code>small</code> holding the smaller half and a <strong>min-heap</strong> <code>large</code> holding the larger half. Python only has a min-heap, so the max-heap stores negated values. Maintain two invariants: every value in <code>small</code> is less than or equal to every value in <code>large</code>, and <code>small</code> is either the same size as <code>large</code> or exactly one element bigger. With these, the median is the top of <code>small</code> (odd count) or the average of both tops (even count), available in \(O(1)\).</p>
    <p>To add a number, push it into <code>small</code>, then move the largest value of <code>small</code> to <code>large</code>. This guarantees the ordering invariant. If <code>large</code> is now bigger than <code>small</code>, move its smallest value back to <code>small</code> to restore the size invariant. Each insertion uses a constant number of heap operations.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (store negatives): smaller half
        self.large = []  # min-heap: larger half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        # Move the largest of the small half to the large half
        heapq.heappush(self.large, -heapq.heappop(self.small))
        # Keep small the same size as large, or one bigger
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
    {% endhighlight %}
</div>

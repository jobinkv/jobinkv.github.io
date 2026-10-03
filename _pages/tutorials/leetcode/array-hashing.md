---
layout: archive
title: "Array Hashing"
permalink: /Resources/leetcode/array-hashing/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 1 -->
<div class="problem-card" id="two-sum">
    <div class="problem-header">
        <h3 class="problem-title">1. <a href="https://leetcode.com/problems/two-sum/" target="_blank" rel="noopener noreferrer">Two Sum</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>. Each input has exactly one solution, and you may not use the same element twice.</p>
    <div class="section-subtitle">Explanation</div>
    <p>To find two numbers \(a + b = \text{target}\), we rewrite it as \(b = \text{target} - a\). As we iterate through the array, we check if the required complement (\(\text{target} - \text{nums}[i]\)) already exists in a hash map. If it does, we return its index along with the current index. Otherwise, we store the current number and its index in the hash map.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
    {% endhighlight %}
</div>

<!-- Problem 2 -->
<div class="problem-card" id="best-time-to-buy-and-sell-stock">
    <div class="problem-header">
        <h3 class="problem-title">2. <a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" target="_blank" rel="noopener noreferrer">Best Time to Buy and Sell Stock</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the \(i\)-th day, maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Track the minimum purchase price seen so far as you iterate through the prices. For each price, calculate the potential profit if sold on that day (\(\text{price} - \text{min\_price}\)). Keep updating the maximum profit seen.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit
    {% endhighlight %}
</div>

<!-- Problem 3 -->
<div class="problem-card" id="contains-duplicate">
    <div class="problem-header">
        <h3 class="problem-title">3. <a href="https://leetcode.com/problems/contains-duplicate/" target="_blank" rel="noopener noreferrer">Contains Duplicate</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, return <code>True</code> if any value appears at least twice in the array, and return <code>False</code> if every element is distinct.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a hash set to store elements as you iterate. If an element is already in the hash set, a duplicate exists. Alternatively, compare the length of the array to the length of a set created from the array.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def containsDuplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))
    {% endhighlight %}
</div>

<!-- Problem 4 -->
<div class="problem-card" id="product-of-array-except-self">
    <div class="problem-header">
        <h3 class="problem-title">4. <a href="https://leetcode.com/problems/product-of-array-except-self/" target="_blank" rel="noopener noreferrer">Product of Array Except Self</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) extra space</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>, without using division and in \(O(N)\) time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Compute prefix products and suffix products. First, pass from left to right to calculate the product of all elements to the left of each index. Then, pass from right to left, multiplying the prefix product with the running product of all elements to the right.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n

    # Left prefix products
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]

    # Right suffix products
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]

    return res
    {% endhighlight %}
</div>

<!-- Problem 5 -->
<div class="problem-card" id="maximum-subarray">
    <div class="problem-header">
        <h3 class="problem-title">5. <a href="https://leetcode.com/problems/maximum-subarray/" target="_blank" rel="noopener noreferrer">Maximum Subarray</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.</p>
    <div class="section-subtitle">Explanation</div>
    <p><strong>Kadane's Algorithm:</strong> Iterate through the array maintaining a running <code>current_sum</code>. At each position, decide whether to add the current number to <code>current_sum</code> or start a new subarray starting at the current element (\(\max(\text{num}, \text{current\_sum} + \text{num})\)). Track the overall maximum.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
    {% endhighlight %}
</div>

<!-- Problem 6 -->
<div class="problem-card" id="maximum-product-subarray">
    <div class="problem-header">
        <h3 class="problem-title">6. <a href="https://leetcode.com/problems/maximum-product-subarray/" target="_blank" rel="noopener noreferrer">Maximum Product Subarray</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Since multiplying two negative numbers creates a positive number, keep track of both the maximum product and the minimum product up to the current index. When encountering a negative number, the minimum and maximum swap roles.</p>
    <p><img src="/images/leetcodeproblem6.png" alt="Maximum Product Subarray walkthrough showing how current maximum and minimum products change at each array index" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        res = nums[0]
        curMin, curMax = 1, 1

        for n in nums:
            tmp = curMax * n
            curMax = max(tmp, curMin * n, n)
            curMin = min(tmp, curMin * n, n)
            res = max(res, curMax)

        return res
    {% endhighlight %}
</div>

<!-- Problem 7 -->
<div class="problem-card" id="find-minimum-in-rotated-sorted-array">
    <div class="problem-header">
        <h3 class="problem-title">7. <a href="https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" target="_blank" rel="noopener noreferrer">Find Minimum in Rotated Sorted Array</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the sorted rotated array <code>nums</code> of unique elements, return the minimum element of this array in \(O(\log N)\) time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Binary Search. Compare <code>nums[mid]</code> with <code>nums[right]</code>. If <code>nums[mid] &gt; nums[right]</code>, the minimum must lie in the right half (<code>left = mid + 1</code>). Otherwise, the minimum lies in the left half including <code>mid</code> (<code>right = mid</code>).</p>
    <p>For all sorted array problem use binary search apprach</p>
    <p><img src="/images/leetcodeproblem7.png" alt="find-minimum-in-rotated-sorted-array" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def findMin(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]: # Right side is unsorted
            left = mid + 1
        else: # left side is unsorted
            right = mid
    return nums[left]
    {% endhighlight %}
</div>

<!-- Problem 8 -->
<div class="problem-card" id="search-in-rotated-sorted-array">
    <div class="problem-header">
        <h3 class="problem-title">8. <a href="https://leetcode.com/problems/search-in-rotated-sorted-array/" target="_blank" rel="noopener noreferrer">Search in Rotated Sorted Array</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(\log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a rotated sorted array <code>nums</code> and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not, in \(O(\log N)\) time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Modify Binary Search. At least one half (left or right) of the array will always be strictly sorted. Determine which half is sorted, then check if <code>target</code> lies within that sorted half's range to decide where to search next.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Left sorted portion
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right sorted portion
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
    {% endhighlight %}
</div>

<!-- Problem 9 -->
<div class="problem-card" id="3sum">
    <div class="problem-header">
        <h3 class="problem-title">9. <a href="https://leetcode.com/problems/3sum/" target="_blank" rel="noopener noreferrer">3Sum</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N^2)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) / \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an integer array <code>nums</code>, return all unique triplets <code>[nums[i], nums[j], nums[k]]</code> such that \(i \neq j, i \neq k, j \neq k\), and \(\text{nums}[i] + \text{nums}[j] + \text{nums}[k] == 0\).</p>
    <div class="section-subtitle">Explanation</div>
    <p>Sort the array first. Iterate through each element as the first element of the triplet. For the remaining part of the array, use the Two-Pointer approach (<code>left</code> and <code>right</code>) to find pairs that sum to <code>-nums[i]</code>. Skip duplicate values to ensure unique triplets.</p>
    <div class="section-subtitle">Python Solution</div>
    <p><img src="/images/leetcodeproblem9.png" alt="3sum" style="display: block; width: 100%; max-width: 100%; height: auto;"></p>
    {% highlight python %}
def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i, a in enumerate(nums):
        if i > 0 and a == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            three_sum = a + nums[l] + nums[r]
            if three_sum > 0:
                r -= 1
            elif three_sum < 0:
                l += 1
            else:
                res.append([a, nums[l], nums[r]])
                l += 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1
    return res
    {% endhighlight %}
</div>

<!-- Problem 10 -->
<div class="problem-card" id="container-with-most-water">
    <div class="problem-header">
        <h3 class="problem-title">10. <a href="https://leetcode.com/problems/container-with-most-water/" target="_blank" rel="noopener noreferrer">Container With Most Water</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given \(n\) non-negative integers representing heights where each point is at \((i, \text{height}[i])\), find two lines that together with the x-axis form a container containing the most water.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Two Pointers starting at both ends of the array. The amount of water stored is determined by \(\text{width} \times \min(\text{height}[left], \text{height}[right])\). To maximize water, move the pointer pointing to the shorter height inward, as keeping the shorter height could never yield a larger area with a smaller width.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def maxArea(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_area = 0
    while l < r:
        area = (r - l) * min(height[l], height[r])
        max_area = max(max_area, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_area
    {% endhighlight %}
</div>
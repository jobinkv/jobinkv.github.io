---
layout: archive
title: "Greedy / Intervals"
permalink: /Resources/leetcode/greedy-intervals/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 62 -->
<div class="problem-card" id="insert-interval">
    <div class="problem-header">
        <h3 class="problem-title">62. <a href="https://leetcode.com/problems/insert-interval/" target="_blank" rel="noopener noreferrer">Insert Interval</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\) for the output</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given an array of non-overlapping intervals <code>intervals</code> sorted by start time, and a new interval <code>newInterval</code>. Insert <code>newInterval</code> into <code>intervals</code> so that the result is still sorted and has no overlapping intervals (merge if necessary), and return it.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Because the input is already sorted, no sorting is needed. A single linear pass splits the intervals into three groups:</p>
    <p>1. <strong>Before:</strong> intervals that end before <code>newInterval</code> starts. Add them unchanged.<br>2. <strong>Overlapping:</strong> intervals that start on or before <code>newInterval</code> ends. Merge each one into <code>newInterval</code> by taking the minimum start and maximum end.<br>3. <strong>After:</strong> all remaining intervals. Add the merged interval, then append them unchanged.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
    res = []
    i, n = 0, len(intervals)

    # 1. Intervals completely before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        res.append(intervals[i])
        i += 1

    # 2. Intervals overlapping newInterval: merge them
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval = [min(newInterval[0], intervals[i][0]),
                       max(newInterval[1], intervals[i][1])]
        i += 1
    res.append(newInterval)

    # 3. Intervals completely after newInterval
    res.extend(intervals[i:])
    return res
    {% endhighlight %}
</div>

<!-- Problem 63 -->
<div class="problem-card" id="merge-intervals">
    <div class="problem-header">
        <h3 class="problem-title">63. <a href="https://leetcode.com/problems/merge-intervals/" target="_blank" rel="noopener noreferrer">Merge Intervals</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\) for the output</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start, end]</code>, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Sort the intervals by start time. After sorting, any interval that overlaps the last merged interval must start no later than that interval's end. Walk through the list: if the current interval starts at or before the end of the last merged interval, extend that end with <code>max(end, current_end)</code>; otherwise start a new merged interval. Sorting dominates the cost, and the merge pass itself is linear.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0][:]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
    {% endhighlight %}
</div>

<!-- Problem 64 -->
<div class="problem-card" id="non-overlapping-intervals">
    <div class="problem-header">
        <h3 class="problem-title">64. <a href="https://leetcode.com/problems/non-overlapping-intervals/" target="_blank" rel="noopener noreferrer">Non-overlapping Intervals</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) extra</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start, end]</code>, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping. Intervals that only touch at an endpoint (such as <code>[1, 2]</code> and <code>[2, 3]</code>) do not overlap.</p>
    <div class="section-subtitle">Explanation</div>
    <p>This is the classic interval scheduling problem: removing the fewest intervals is the same as keeping the most. The greedy choice is to <strong>sort by end time</strong> and always keep the interval that finishes earliest, because it leaves the most room for the intervals after it. Scan in order: if the current interval starts at or after the end of the last kept interval, keep it; otherwise it overlaps, so remove it (count it). Sorting by start time and comparing ends also works, but sorting by end makes the greedy argument simple.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    prev_end = float('-inf')
    removed = 0
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end  # keep this interval
        else:
            removed += 1    # overlaps with the kept one, remove it
    return removed
    {% endhighlight %}
</div>

<!-- Problem 65 -->
<div class="problem-card" id="meeting-rooms">
    <div class="problem-header">
        <h3 class="problem-title">65. <a href="https://leetcode.com/problems/meeting-rooms/" target="_blank" rel="noopener noreferrer">Meeting Rooms</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\) extra</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of meeting time intervals <code>intervals</code> where <code>intervals[i] = [start, end]</code>, determine if a person could attend all meetings.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A person can attend all meetings only if no two meetings overlap. Sort the meetings by start time; then it is enough to compare each meeting with the one just before it. If a meeting starts before the previous one ends, there is a conflict. A meeting that starts exactly when the previous one ends is allowed.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def canAttendMeetings(intervals: list[list[int]]) -> bool:
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True
    {% endhighlight %}
</div>

<!-- Problem 66 -->
<div class="problem-card" id="meeting-rooms-ii">
    <div class="problem-header">
        <h3 class="problem-title">66. <a href="https://leetcode.com/problems/meeting-rooms-ii/" target="_blank" rel="noopener noreferrer">Meeting Rooms II</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an array of meeting time intervals <code>intervals</code> where <code>intervals[i] = [start, end]</code>, return the minimum number of conference rooms required.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Sort the start times and the end times <strong>separately</strong>. The identity of each meeting does not matter, only how many are running at once. Process meetings in order of start time with a pointer <code>e</code> on the earliest end time. If the next meeting starts at or after that earliest end, a room has just been freed, so reuse it by moving <code>e</code> forward. Otherwise every room is busy and a new room is needed. The total rooms opened is the answer. This is simpler than the equivalent min-heap solution and uses no heap operations.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def minMeetingRooms(intervals: list[list[int]]) -> int:
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)

    rooms = 0
    e = 0
    for s in starts:
        if s >= ends[e]:
            e += 1      # a meeting has ended, reuse its room
        else:
            rooms += 1  # all rooms busy, open a new one
    return rooms
    {% endhighlight %}
</div>

<!-- Problem 67 -->
<div class="problem-card" id="minimum-interval-to-include-each-query">
    <div class="problem-header">
        <h3 class="problem-title">67. <a href="https://leetcode.com/problems/minimum-interval-to-include-each-query/" target="_blank" rel="noopener noreferrer">Minimum Interval to Include Each Query</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O((N + Q) \log (N + Q))\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N + Q)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given a 2D integer array <code>intervals</code>, where <code>intervals[i] = [left, right]</code> describes an interval containing all integers from <code>left</code> to <code>right</code> inclusive (its size is <code>right - left + 1</code>), and an integer array <code>queries</code>. For each query <code>q</code>, return the size of the smallest interval that contains <code>q</code>, or <code>-1</code> if none exists.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Checking every interval for every query is \(O(N \cdot Q)\). Instead, answer the queries <strong>offline in increasing order</strong> while sweeping through the intervals sorted by start. For each query <code>q</code>:</p>
    <p>1. Push every interval with <code>left &lt;= q</code> into a min-heap keyed by <code>(size, right)</code>.<br>2. Pop from the top of the heap while its interval ends before <code>q</code>. Such an interval can never contain <code>q</code> or any larger query, so it is safe to discard permanently.<br>3. The heap top is now the smallest interval that contains <code>q</code>, or the heap is empty and the answer is <code>-1</code>.</p>
    <p>Store results in a dictionary keyed by query value so the answers can be returned in the original query order, including duplicate queries. Each interval is pushed and popped at most once.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import heapq

def minInterval(intervals: list[list[int]], queries: list[int]) -> list[int]:
    intervals.sort()
    heap = []   # (size, right)
    res = {}
    i = 0

    for q in sorted(queries):
        # Add all intervals that start on or before q
        while i < len(intervals) and intervals[i][0] <= q:
            left, right = intervals[i]
            heapq.heappush(heap, (right - left + 1, right))
            i += 1

        # Discard intervals that end before q
        while heap and heap[0][1] < q:
            heapq.heappop(heap)

        res[q] = heap[0][0] if heap else -1

    return [res[q] for q in queries]
    {% endhighlight %}
</div>

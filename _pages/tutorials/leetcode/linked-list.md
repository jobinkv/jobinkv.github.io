---
layout: archive
title: "Linked List"
permalink: /Resources/leetcode/linked-list/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 21 -->
<div class="problem-card" id="reverse-linked-list">
    <div class="problem-header">
        <h3 class="problem-title">21. <a href="https://leetcode.com/problems/reverse-linked-list/" target="_blank" rel="noopener noreferrer">Reverse Linked List</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>head</code> of a singly linked list, reverse the list and return the reversed list.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Iterate through the list while keeping two pointers: <code>prev</code> (the already reversed part, initially <code>None</code>) and <code>curr</code> (the current node). At each step, save <code>curr.next</code>, point <code>curr.next</code> back to <code>prev</code>, then advance both pointers. When <code>curr</code> becomes <code>None</code>, <code>prev</code> is the new head. This is preferred over recursion because it uses constant space and avoids stack overflow on long lists.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
    {% endhighlight %}
</div>

<!-- Problem 22 -->
<div class="problem-card" id="merge-two-sorted-lists">
    <div class="problem-header">
        <h3 class="problem-title">22. <a href="https://leetcode.com/problems/merge-two-sorted-lists/" target="_blank" rel="noopener noreferrer">Merge Two Sorted Lists</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M + N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>, merge them into one sorted list by splicing together the nodes of the two lists, and return the head of the merged list.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a dummy node and a <code>tail</code> pointer to build the result. Compare the heads of both lists, attach the smaller node to <code>tail</code>, and advance that list. When one list is exhausted, attach the remainder of the other list directly, since it is already sorted. Reusing the existing nodes keeps extra space constant, and the dummy node removes special handling for the head.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def mergeTwoLists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode()
    tail = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 or list2
    return dummy.next
    {% endhighlight %}
</div>

<!-- Problem 23 -->
<div class="problem-card" id="reorder-list">
    <div class="problem-header">
        <h3 class="problem-title">23. <a href="https://leetcode.com/problems/reorder-list/" target="_blank" rel="noopener noreferrer">Reorder List</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the head of a singly linked list <code>L0 &rarr; L1 &rarr; ... &rarr; Ln-1 &rarr; Ln</code>, reorder it to <code>L0 &rarr; Ln &rarr; L1 &rarr; Ln-1 &rarr; L2 &rarr; Ln-2 &rarr; ...</code> in-place, without modifying node values.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Combine three standard linked list techniques. First, find the middle using slow and fast pointers. Second, cut the list in two and reverse the second half. Third, merge the two halves by alternating nodes (one from the first half, one from the reversed second half). Using a different technique per step avoids the \(O(N)\) extra space of storing nodes in an array.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def reorderList(head: Optional[ListNode]) -> None:
    # 1. Find the middle
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # 2. Split and reverse the second half
    second = slow.next
    slow.next = None
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev = second
        second = nxt

    # 3. Merge the two halves alternately
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
    {% endhighlight %}
</div>

<!-- Problem 24 -->
<div class="problem-card" id="remove-nth-node-from-end-of-list">
    <div class="problem-header">
        <h3 class="problem-title">24. <a href="https://leetcode.com/problems/remove-nth-node-from-end-of-list/" target="_blank" rel="noopener noreferrer">Remove Nth Node From End of List</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>head</code> of a linked list, remove the <code>n</code>-th node from the end of the list and return its head.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use the Two Pointers technique with a fixed gap in a single pass. Start both pointers at a dummy node placed before <code>head</code>. Move <code>fast</code> ahead by <code>n + 1</code> steps, then move both pointers together until <code>fast</code> reaches <code>None</code>. At that point <code>slow</code> sits right before the node to delete, so skip it with <code>slow.next = slow.next.next</code>. The dummy node handles the case where the head itself is removed.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def removeNthFromEnd(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    slow = fast = dummy

    # Create a gap of n nodes between slow and fast
    for _ in range(n + 1):
        fast = fast.next

    while fast:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next
    {% endhighlight %}
</div>

<!-- Problem 25 -->
<div class="problem-card" id="linked-list-cycle">
    <div class="problem-header">
        <h3 class="problem-title">25. <a href="https://leetcode.com/problems/linked-list-cycle/" target="_blank" rel="noopener noreferrer">Linked List Cycle</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. Return <code>True</code> if there is a cycle, otherwise return <code>False</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p><strong>Floyd's Tortoise and Hare:</strong> Move <code>slow</code> one step and <code>fast</code> two steps at a time. If the list has a cycle, <code>fast</code> eventually laps <code>slow</code> and they meet at the same node. If <code>fast</code> reaches <code>None</code>, the list ends and there is no cycle. A hash set of visited nodes also works but costs \(O(N)\) space.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def hasCycle(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
    {% endhighlight %}
</div>

<!-- Problem 26 -->
<div class="problem-card" id="merge-k-sorted-lists">
    <div class="problem-header">
        <h3 class="problem-title">26. <a href="https://leetcode.com/problems/merge-k-sorted-lists/" target="_blank" rel="noopener noreferrer">Merge k Sorted Lists</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \log k)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(k)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>You are given an array of <code>k</code> linked lists <code>lists</code>, each sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a Min-Heap holding the current head of each list. Repeatedly pop the smallest node, append it to the result, and push that node's <code>next</code> into the heap. The heap never holds more than <code>k</code> nodes, so each of the \(N\) total nodes costs \(O(\log k)\). Since <code>ListNode</code> objects are not comparable, store tuples <code>(value, list_index, node)</code> so ties are broken by the unique index. An equivalent alternative is divide and conquer, merging lists pairwise with the Problem 22 routine, which also runs in \(O(N \log k)\).</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
import heapq

def mergeKLists(lists: list[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode()
    tail = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
    {% endhighlight %}
</div>

<!-- Problem 27 -->
<div class="problem-card" id="lru-cache">
    <div class="problem-header">
        <h3 class="problem-title">27. <a href="https://leetcode.com/problems/lru-cache/" target="_blank" rel="noopener noreferrer">LRU Cache</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(1)\) per <code>get</code> / <code>put</code></div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\text{capacity})\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Design a data structure that follows the Least Recently Used (LRU) cache policy. Implement <code>LRUCache(capacity)</code>, <code>get(key)</code> (return the value or <code>-1</code>) and <code>put(key, value)</code> (insert or update, evicting the least recently used key when capacity is exceeded). Both operations must run in \(O(1)\) average time.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Combine a Hash Map with a Doubly Linked List. The hash map gives \(O(1)\) access from a key to its node, and the doubly linked list keeps nodes ordered by recency: the node after the left sentinel is the least recently used, and the node before the right sentinel is the most recently used. Because each node has <code>prev</code> and <code>next</code> pointers, removing it from any position and re-inserting it at the most-recent end is \(O(1)\). Two sentinel nodes remove all edge cases at the ends. In Python, <code>collections.OrderedDict</code> gives the same behavior in fewer lines, but this manual version shows the underlying design.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        # Sentinels: left.next is the LRU node, right.prev is the MRU node
        self.left, self.right = Node(), Node()
        self.left.next = self.right
        self.right.prev = self.left

    def _remove(self, node: Node) -> None:
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def _insert(self, node: Node) -> None:
        # Insert just before the right sentinel (most recently used)
        prev = self.right.prev
        prev.next = node
        node.prev = prev
        node.next = self.right
        self.right.prev = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._insert(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        self.cache[key] = Node(key, value)
        self._insert(self.cache[key])

        if len(self.cache) > self.cap:
            lru = self.left.next
            self._remove(lru)
            del self.cache[lru.key]
    {% endhighlight %}
</div>

<!-- Problem 28 -->
<div class="problem-card" id="reverse-nodes-in-k-group">
    <div class="problem-header">
        <h3 class="problem-title">28. <a href="https://leetcode.com/problems/reverse-nodes-in-k-group/" target="_blank" rel="noopener noreferrer">Reverse Nodes in k-Group</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time and return the modified list. If the number of remaining nodes is not a multiple of <code>k</code>, the left-out nodes at the end stay as they are. Only the nodes themselves may be changed, not their values.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Process the list group by group using a dummy node and a <code>group_prev</code> pointer that sits right before the current group. For each group, find the <code>k</code>-th node (<code>kth</code>); if it does not exist, fewer than <code>k</code> nodes remain, so stop. Otherwise reverse the group with the standard reversal, but initialize <code>prev</code> to <code>kth.next</code> so the reversed group links to the rest of the list automatically. Finally reconnect <code>group_prev</code> to <code>kth</code> and move it to the old first node of the group, which is now the group's tail. Each node is visited a constant number of times, and the iterative approach avoids \(O(N/k)\) recursion stack space.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def reverseKGroup(head: Optional[ListNode], k: int) -> Optional[ListNode]:
    def getKth(curr, k):
        while curr and k > 0:
            curr = curr.next
            k -= 1
        return curr

    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        kth = getKth(group_prev, k)
        if not kth:
            break
        group_next = kth.next

        # Reverse the group; prev starts at group_next to link the tail
        prev, curr = group_next, group_prev.next
        while curr != group_next:
            tmp = curr.next
            curr.next = prev
            prev = curr
            curr = tmp

        # Reconnect: old first node is now the group's tail
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp

    return dummy.next
    {% endhighlight %}
</div>

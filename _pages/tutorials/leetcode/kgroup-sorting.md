---
layout: archive
title: "Linked List"
permalink: /Resources/leetcode/linked-list/kgroup
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/linked-list)

<style>
.kg-step{margin:18px 0 6px;padding-top:14px;border-top:1px solid rgba(128,128,128,.35)}
.kg-step-title{margin:0 0 4px;font-size:1.05em}
.kg-code{margin:0 0 10px;font-size:.85em;opacity:.85}
.kg-scroll{overflow-x:auto;padding-bottom:4px}
.kg-diagram{width:max-content;padding:0 36px 0 36px}
.kg-row{display:flex;align-items:flex-start;position:relative}
.kg-cell{display:flex;flex-direction:column;align-items:center;width:64px}
.kg-node{width:56px;height:56px;border-radius:50%;border:2px solid #333;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#1a1a1a}
.kg-dummy{background:#e9ecef}.kg-group{background:#ffd9b3}.kg-done{background:#d3f0d8}.kg-plain{background:#cfe2ff}
.kg-ptr{height:24px;width:64px;display:flex;align-items:center;justify-content:center;white-space:nowrap;font:600 12px/1 monospace;color:#b3261e}
.kg-ptr.kg-gray{color:#888}
.kg-arrow{width:40px;height:56px;margin-top:24px;display:flex;align-items:center;justify-content:center;font-size:24px;color:#777}
.kg-arrow.kg-new{color:#1a8f3c}
.kg-arrow.kg-old{color:#999}
.kg-arc{position:absolute;top:80px;height:22px;border:2px solid #1a8f3c;border-top:none;border-radius:0 0 50% 50%/0 0 100% 100%;box-sizing:border-box}
.kg-arc::after{content:"";position:absolute;right:-6px;top:-2px;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:9px solid #1a8f3c}
.kg-brackets{position:relative;height:44px;margin-top:-20px}
.kg-bracket{position:absolute;top:4px;height:10px;border:2px solid #888;border-top:none;box-sizing:border-box}
.kg-bracket span{position:absolute;top:14px;left:0;right:0;text-align:center;font-size:12px;white-space:nowrap}
.kg-note{margin:6px 0 0;font-size:.9em}
.kg-legend{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:16px;font-size:.85em}
.kg-legend i{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #333;vertical-align:-2px;margin-right:6px;box-sizing:border-box}
</style>

<!-- Problem 1 -->
<div class="problem-card" id="reverse-nodes-in-k-group">
    <div class="problem-header">
        <h3 class="problem-title">1. <a href="https://leetcode.com/problems/reverse-nodes-in-k-group/" target="_blank" rel="noopener noreferrer">Reverse Nodes in k-Group</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time and return the modified list. <code>k</code> is a positive integer that is at most the length of the list. If the number of nodes is not a multiple of <code>k</code>, the left-out nodes at the end stay in their original order. Only the nodes' links may be changed, not their values.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use a <strong>dummy node</strong> in front of the list so the first group can be handled like every other group, and keep a pointer <code>group_prev</code> to the node just before the current group. For each group:</p>
    <p><strong>1. Find the group.</strong> Walk <code>k</code> steps from <code>group_prev</code> with <code>getKth</code> to get <code>kth</code>, the last node of the group. If it returns <code>None</code>, fewer than <code>k</code> nodes are left, so stop. Otherwise <code>group_next = kth.next</code> is the first node of the next group.</p>
    <p><strong>2. Reverse the group.</strong> Reverse the links as in a normal linked-list reversal, but start <code>prev</code> at <code>group_next</code> instead of <code>None</code>. The old first node then points to the next group automatically.</p>
    <p><strong>3. Reconnect.</strong> The old first node is now the tail of the reversed group. Save it in <code>tmp</code>, point <code>group_prev.next</code> at <code>kth</code> (the new head of the group), then move <code>group_prev</code> to <code>tmp</code> and repeat.</p>
    <p>Every node is visited a constant number of times (once to find the group, once to reverse it), so the total time is \(O(N)\) with only a few pointers of extra space.</p>
    <div class="section-subtitle">Visual Walkthrough (k = 2)</div>
    <p>Input: <code>1 → 2 → 3 → 4 → 5</code> &nbsp;&nbsp; Output: <code>2 → 1 → 4 → 3 → 5</code></p>
    <section class="kg-step"><h4 class="kg-step-title">① Find the group</h4><div class="kg-code"><code>kth = getKth(group_prev, k);  group_next = kth.next</code></div><div class="kg-scroll"><div class="kg-diagram"><div class="kg-row" role="img" aria-label="Dummy 0 to 1 to 2 to 3 to 4 to 5. group_prev is at the dummy, kth at 2, group_next at 3."><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-dummy">D</span><span class="kg-ptr">↑ group_prev</span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-group">1</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">kth ↓</span><span class="kg-node kg-group">2</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">group_next ↓</span><span class="kg-node kg-plain">3</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">4</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">5</span><span class="kg-ptr"></span></span></div><div class="kg-brackets"><span class="kg-bracket" style="left:108px;width:160px"><span>k = 2 nodes</span></span><span class="kg-bracket" style="left:316px;width:264px"><span>rest of the list</span></span></div></div></div><p class="kg-note">Walk <code>k</code> steps from <code>group_prev</code> to reach <code>kth</code>. The node after it, <code>group_next</code>, starts the next group.</p></section>
    <section class="kg-step"><h4 class="kg-step-title">② Reverse the group (inner while loop)</h4><div class="kg-code"><code>prev, curr = group_next, group_prev.next  →  tmp = curr.next; curr.next = prev; prev = curr; curr = tmp</code></div><div class="kg-scroll"><div class="kg-diagram"><div class="kg-row" role="img" aria-label="After the loop: 1 points to 3, 2 points to 1, and the dummy still points to 1 through the old link."><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-dummy">D</span><span class="kg-ptr"></span></span><span class="kg-arrow kg-old">⇢</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-group">1</span><span class="kg-ptr"></span></span><span class="kg-arrow kg-new">←</span><span class="kg-cell"><span class="kg-ptr">prev ↓</span><span class="kg-node kg-group">2</span><span class="kg-ptr"></span></span><span class="kg-arrow"></span><span class="kg-cell"><span class="kg-ptr">curr = group_next ↓</span><span class="kg-node kg-plain">3</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">4</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">5</span><span class="kg-ptr"></span></span><span class="kg-arc" style="left:136px;width:208px"></span></div></div></div><p class="kg-note"><code>1.next = group_next (3)</code> (green arc) and <code>2.next = 1</code>. The dummy still points to 1 (grey, old link) until we reconnect.</p></section>
    <section class="kg-step"><h4 class="kg-step-title">③ Reconnect and move group_prev</h4><div class="kg-code"><code>tmp = group_prev.next;  group_prev.next = kth;  group_prev = tmp</code></div><div class="kg-scroll"><div class="kg-diagram"><div class="kg-row" role="img" aria-label="Dummy now points to 2, then 2 to 1, 1 to 3, 3 to 4, 4 to 5. group_prev moves to node 1."><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-dummy">D</span><span class="kg-ptr kg-gray">↑ old group_prev</span></span><span class="kg-arrow kg-new">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">2</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">group_prev = tmp ↓</span><span class="kg-node kg-done">1</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">3</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">4</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">5</span><span class="kg-ptr"></span></span></div></div></div><p class="kg-note"><code>D.next = kth (2)</code>. The old first node 1 is now the group's tail, so it becomes the new <code>group_prev</code>.</p></section>
    <section class="kg-step"><h4 class="kg-step-title">④ Second group: repeat with the new group_prev</h4><div class="kg-code"><code>kth = getKth(group_prev, k)  →  4;   group_next = kth.next  →  5</code></div><div class="kg-scroll"><div class="kg-diagram"><div class="kg-row" role="img" aria-label="List D, 2, 1, 3, 4, 5 with group_prev at 1, kth at 4 and group_next at 5."><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-dummy">D</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">2</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">1</span><span class="kg-ptr">↑ group_prev</span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-group">3</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">kth ↓</span><span class="kg-node kg-group">4</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">group_next ↓</span><span class="kg-node kg-plain">5</span><span class="kg-ptr"></span></span></div><div class="kg-brackets"><span class="kg-bracket" style="left:316px;width:160px"><span>k = 2 nodes</span></span></div></div></div><p class="kg-note">Same three moves again on nodes 3 and 4: reverse them so 3 → 5 and 4 → 3, then set <code>group_prev.next = kth</code> (1 → 4).</p></section>
    <section class="kg-step"><h4 class="kg-step-title">⑤ Reverse 3, 4 → reconnect → stop</h4><div class="kg-code"><code>getKth(group_prev, k) returns None (only node 5 left)  →  break;   return dummy.next</code></div><div class="kg-scroll"><div class="kg-diagram"><div class="kg-row" role="img" aria-label="Final list D, 2, 1, 4, 3, 5 with group_prev at 3. return dummy.next points at 2."><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-dummy">D</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr">return dummy.next ↓</span><span class="kg-node kg-done">2</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">1</span><span class="kg-ptr"></span></span><span class="kg-arrow kg-new">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">4</span><span class="kg-ptr"></span></span><span class="kg-arrow">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-done">3</span><span class="kg-ptr">↑ group_prev</span></span><span class="kg-arrow kg-new">→</span><span class="kg-cell"><span class="kg-ptr"></span><span class="kg-node kg-plain">5</span><span class="kg-ptr"></span></span></div></div></div><p class="kg-note">Only node 5 is left, fewer than <code>k</code>, so <code>getKth</code> returns <code>None</code> and the loop breaks. <strong>Result: 2 → 1 → 4 → 3 → 5</strong>.</p></section>
    <div class="kg-legend"><span><i class="kg-group"></i>group being reversed</span><span><i class="kg-done"></i>already reversed</span><span><i class="kg-plain"></i>untouched node</span><span><i class="kg-dummy"></i>dummy (D = 0)</span><span>green arrow = new link · grey dashed = old link</span></div>
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

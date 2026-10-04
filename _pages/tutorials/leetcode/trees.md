---
layout: archive
title: "Trees"
permalink: /Resources/leetcode/trees/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 29 -->
<div class="problem-card" id="maximum-depth-of-binary-tree">
    <div class="problem-header">
        <h3 class="problem-title">29. <a href="https://leetcode.com/problems/maximum-depth-of-binary-tree/" target="_blank" rel="noopener noreferrer">Maximum Depth of Binary Tree</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>root</code> of a binary tree, return its maximum depth, which is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Depth-First Search. The depth of a node is <code>1 + max(depth(left), depth(right))</code>, and an empty tree has depth <code>0</code>. Every node is visited exactly once, and the recursion stack grows with the tree height \(H\) (\(O(\log N)\) for a balanced tree, \(O(N)\) for a skewed one).</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
    {% endhighlight %}
</div>

<!-- Problem 30 -->
<div class="problem-card" id="same-tree">
    <div class="problem-header">
        <h3 class="problem-title">30. <a href="https://leetcode.com/problems/same-tree/" target="_blank" rel="noopener noreferrer">Same Tree</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same. Two binary trees are the same if they are structurally identical and the nodes have the same values.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Compare the trees recursively. If both nodes are <code>None</code>, they match. If only one is <code>None</code> or the values differ, the trees are different. Otherwise, the trees are the same only if both the left subtrees and the right subtrees are the same. The recursion stops at the first mismatch.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
    {% endhighlight %}
</div>

<!-- Problem 31 -->
<div class="problem-card" id="invert-binary-tree">
    <div class="problem-header">
        <h3 class="problem-title">31. <a href="https://leetcode.com/problems/invert-binary-tree/" target="_blank" rel="noopener noreferrer">Invert Binary Tree</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>root</code> of a binary tree, invert the tree (mirror it), and return its root.</p>
    <div class="section-subtitle">Explanation</div>
    <p>At every node, swap the left and right children, then recursively invert both subtrees. Each node is processed once, and the tree is modified in-place without creating new nodes.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
    {% endhighlight %}
</div>

<!-- Problem 32 -->
<div class="problem-card" id="binary-tree-maximum-path-sum">
    <div class="problem-header">
        <h3 class="problem-title">32. <a href="https://leetcode.com/problems/binary-tree-maximum-path-sum/" target="_blank" rel="noopener noreferrer">Binary Tree Maximum Path Sum</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can appear in the sequence at most once, and the path does not need to pass through the root. Given the <code>root</code> of a binary tree, return the maximum path sum of any non-empty path.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use post-order DFS. For each node, compute the best <em>gain</em> from its left and right subtrees, ignoring any negative gain by taking <code>max(gain, 0)</code>. Two different values matter at each node:</p>
    <p>1. The best path that <strong>passes through</strong> this node (both sides allowed): \(\text{node.val} + \text{left} + \text{right}\). This updates the global answer.<br>2. The best path <strong>extending upward</strong> to the parent (only one side allowed): \(\text{node.val} + \max(\text{left}, \text{right})\). This is the value the function returns.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def maxPathSum(root: Optional[TreeNode]) -> int:
    res = root.val

    def dfs(node: Optional[TreeNode]) -> int:
        nonlocal res
        if not node:
            return 0
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)

        # Path that splits at this node
        res = max(res, node.val + left + right)

        # Path that continues up to the parent
        return node.val + max(left, right)

    dfs(root)
    return res
    {% endhighlight %}
</div>

<!-- Problem 33 -->
<div class="problem-card" id="binary-tree-level-order-traversal">
    <div class="problem-header">
        <h3 class="problem-title">33. <a href="https://leetcode.com/problems/binary-tree-level-order-traversal/" target="_blank" rel="noopener noreferrer">Binary Tree Level Order Traversal</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>root</code> of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Breadth-First Search with a queue. At the start of each round, the queue holds exactly the nodes of one level, so record <code>len(queue)</code> and process that many nodes, collecting their values and enqueuing their children. Each node enters and leaves the queue once.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def levelOrder(root: Optional[TreeNode]) -> list[list[int]]:
    res = []
    queue = deque([root] if root else [])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
    return res
    {% endhighlight %}
</div>

<!-- Problem 34 -->
<div class="problem-card" id="serialize-and-deserialize-binary-tree">
    <div class="problem-header">
        <h3 class="problem-title">34. <a href="https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" target="_blank" rel="noopener noreferrer">Serialize and Deserialize Binary Tree</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Design an algorithm to serialize a binary tree into a string and deserialize that string back into the original tree structure. There is no restriction on the format of the encoding.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use pre-order traversal and record <code>None</code> children with a marker (<code>N</code>). Because null markers are included, a single pre-order sequence uniquely identifies the tree shape, so no second traversal is needed. To deserialize, read the values from an iterator in the same order: take the next token, return <code>None</code> if it is the marker, otherwise create a node and build its left and right subtrees recursively.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        res = []

        def dfs(node):
            if not node:
                res.append("N")
                return
            res.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(res)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        vals = iter(data.split(","))

        def dfs():
            val = next(vals)
            if val == "N":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node

        return dfs()
    {% endhighlight %}
</div>

<!-- Problem 35 -->
<div class="problem-card" id="subtree-of-another-tree">
    <div class="problem-header">
        <h3 class="problem-title">35. <a href="https://leetcode.com/problems/subtree-of-another-tree/" target="_blank" rel="noopener noreferrer">Subtree of Another Tree</a></h3>
        <span class="badge badge-easy">Easy</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M + N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(M + N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the roots of two binary trees <code>root</code> and <code>subRoot</code>, return <code>True</code> if there is a subtree of <code>root</code> with the same structure and node values as <code>subRoot</code>, and <code>False</code> otherwise.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The straightforward solution calls the Same Tree check at every node of <code>root</code>, which costs \(O(M \cdot N)\). A faster approach converts each tree into a pre-order string, including null markers, then checks whether one string is a substring of the other. Each value gets a <code>^</code> prefix so that a value like <code>2</code> cannot match inside <code>12</code>, and tokens are comma separated. With a linear-time substring search (such as KMP) the whole check is \(O(M + N)\). The traversal here is iterative to avoid deep recursion.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def isSubtree(root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
    def serialize(node: Optional[TreeNode]) -> str:
        res = []
        stack = [node]
        while stack:
            cur = stack.pop()
            if cur is None:
                res.append("#")
            else:
                res.append("^" + str(cur.val))
                stack.append(cur.right)
                stack.append(cur.left)
        return ",".join(res)

    return serialize(subRoot) in serialize(root)
    {% endhighlight %}
</div>

<!-- Problem 36 -->
<div class="problem-card" id="construct-binary-tree-from-preorder-and-inorder-traversal">
    <div class="problem-header">
        <h3 class="problem-title">36. <a href="https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" target="_blank" rel="noopener noreferrer">Construct Binary Tree from Preorder and Inorder Traversal</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given two integer arrays <code>preorder</code> and <code>inorder</code>, where <code>preorder</code> is the pre-order traversal of a binary tree and <code>inorder</code> is the in-order traversal of the same tree, construct and return the binary tree. All values are unique.</p>
    <div class="section-subtitle">Explanation</div>
    <p>The next unused element in <code>preorder</code> is always the root of the current subtree. Locating that value in <code>inorder</code> splits it into the left subtree (everything before it) and the right subtree (everything after it). Searching the array each time would cost \(O(N^2)\), so store each value's inorder index in a hash map for \(O(1)\) lookups. Build the left subtree before the right one, because pre-order visits the left subtree first. A single shared pointer <code>pre_i</code> advances through <code>preorder</code>, so no array slicing is needed.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def buildTree(preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:
    index = {val: i for i, val in enumerate(inorder)}
    pre_i = 0

    def build(left: int, right: int) -> Optional[TreeNode]:
        nonlocal pre_i
        if left > right:
            return None
        root = TreeNode(preorder[pre_i])
        pre_i += 1
        mid = index[root.val]
        root.left = build(left, mid - 1)
        root.right = build(mid + 1, right)
        return root

    return build(0, len(inorder) - 1)
    {% endhighlight %}
</div>

<!-- Problem 37 -->
<div class="problem-card" id="validate-binary-search-tree">
    <div class="problem-header">
        <h3 class="problem-title">37. <a href="https://leetcode.com/problems/validate-binary-search-tree/" target="_blank" rel="noopener noreferrer">Validate Binary Search Tree</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST): the left subtree of a node contains only keys less than the node's key, the right subtree contains only keys greater than the node's key, and both subtrees are also BSTs.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Comparing a node only with its direct children is not enough, since a node must respect <em>all</em> of its ancestors. Instead, pass down a valid range <code>(low, high)</code>. Every node must satisfy \(\text{low} &lt; \text{val} &lt; \text{high}\). Going left tightens the upper bound to the current value, and going right tightens the lower bound.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def isValidBST(root: Optional[TreeNode]) -> bool:
    def valid(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return valid(node.left, low, node.val) and valid(node.right, node.val, high)

    return valid(root, float('-inf'), float('inf'))
    {% endhighlight %}
</div>

<!-- Problem 38 -->
<div class="problem-card" id="kth-smallest-element-in-a-bst">
    <div class="problem-header">
        <h3 class="problem-title">38. <a href="https://leetcode.com/problems/kth-smallest-element-in-a-bst/" target="_blank" rel="noopener noreferrer">Kth Smallest Element in a BST</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(H + k)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(H)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given the <code>root</code> of a binary search tree and an integer <code>k</code>, return the <code>k</code>-th smallest value (1-indexed) of all the values of the nodes in the tree.</p>
    <div class="section-subtitle">Explanation</div>
    <p>An in-order traversal of a BST visits values in sorted order. Run the traversal iteratively with an explicit stack and stop as soon as the <code>k</code>-th node is popped, instead of collecting all \(N\) values first. Going down to the leftmost node costs \(O(H)\), and then only <code>k</code> nodes are processed.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def kthSmallest(root: Optional[TreeNode], k: int) -> int:
    stack = []
    curr = root
    while stack or curr:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right
    {% endhighlight %}
</div>

<!-- Problem 39 -->
<div class="problem-card" id="lowest-common-ancestor-of-a-binary-search-tree">
    <div class="problem-header">
        <h3 class="problem-title">39. <a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" target="_blank" rel="noopener noreferrer">Lowest Common Ancestor of a Binary Search Tree</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(H)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(1)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes <code>p</code> and <code>q</code>. The LCA is the lowest node that has both <code>p</code> and <code>q</code> as descendants (a node can be a descendant of itself).</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use the BST ordering property. Starting at the root, if both <code>p</code> and <code>q</code> are smaller than the current node, the LCA must be in the left subtree. If both are larger, it is in the right subtree. Otherwise, <code>p</code> and <code>q</code> are on different sides of the current node (or one of them equals it), which makes the current node the LCA. This iterative walk follows a single root-to-node path.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    curr = root
    while curr:
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right
        else:
            return curr
    {% endhighlight %}
</div>

<!-- Problem 40 -->
<div class="problem-card" id="implement-trie-prefix-tree">
    <div class="problem-header">
        <h3 class="problem-title">40. <a href="https://leetcode.com/problems/implement-trie-prefix-tree/" target="_blank" rel="noopener noreferrer">Implement Trie (Prefix Tree)</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(L)\) per operation</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\text{total characters})\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Implement a Trie with <code>insert(word)</code>, <code>search(word)</code> (returns <code>True</code> if the word is in the trie) and <code>startsWith(prefix)</code> (returns <code>True</code> if any inserted word has the given prefix).</p>
    <div class="section-subtitle">Explanation</div>
    <p>Each trie node holds a dictionary mapping a character to its child node, plus an <code>is_end</code> flag marking the end of a complete word. All operations walk one node per character, so they cost \(O(L)\) where \(L\) is the length of the word or prefix. <code>search</code> and <code>startsWith</code> share the same traversal, and the only difference is that <code>search</code> also requires <code>is_end</code> to be set.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def _find(self, prefix: str) -> Optional[TrieNode]:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None
    {% endhighlight %}
</div>

<!-- Problem 41 -->
<div class="problem-card" id="add-and-search-word-data-structure-design">
    <div class="problem-header">
        <h3 class="problem-title">41. <a href="https://leetcode.com/problems/add-and-search-word-data-structure-design/" target="_blank" rel="noopener noreferrer">Add and Search Word - Data Structure Design</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> <code>addWord</code> \(O(L)\); <code>search</code> \(O(L)\) without wildcards, up to \(O(26^L)\) in the worst case</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\text{total characters})\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Design a data structure that supports adding new words and finding if a string matches any previously added word. <code>search(word)</code> may contain dots <code>.</code>, where a dot can match any letter.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Store the words in a Trie, exactly as in the previous problem. For <code>search</code>, use DFS with the current position in the word. A normal letter follows the single matching child. A dot branches into every child of the current node, and the search succeeds if any branch matches the rest of the word. The wildcard branching only blows up when the word has many dots, which is the worst case.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(i: int, node: TrieNode) -> bool:
            for j in range(i, len(word)):
                ch = word[j]
                if ch == '.':
                    # Try every child for the wildcard
                    for child in node.children.values():
                        if dfs(j + 1, child):
                            return True
                    return False
                if ch not in node.children:
                    return False
                node = node.children[ch]
            return node.is_end

        return dfs(0, self.root)
    {% endhighlight %}
</div>

<!-- Problem 42 -->
<div class="problem-card" id="word-search-ii">
    <div class="problem-header">
        <h3 class="problem-title">42. <a href="https://leetcode.com/problems/word-search-ii/" target="_blank" rel="noopener noreferrer">Word Search II</a></h3>
        <span class="badge badge-hard">Hard</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N \cdot 3^{L})\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\text{total characters in words})\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an <code>m x n</code> board of characters and a list of strings <code>words</code>, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically), and the same cell may not be used more than once in a word.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Running Word Search I once per word repeats a lot of work. Instead, insert all words into a single Trie and run one backtracking DFS from every cell, moving only into neighbors that exist as children in the current trie node. This prunes every path that is not a prefix of some word. Three optimizations make it fast: store the complete word at its end node so no string has to be rebuilt, set <code>node.word = None</code> after finding it to avoid duplicate results, and delete exhausted trie branches so later searches skip dead prefixes. Here \(L\) is the maximum word length.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # full word stored at its end node

def findWords(board: list[list[str]], words: list[str]) -> list[str]:
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.word = w

    rows, cols = len(board), len(board[0])
    res = []

    def dfs(r: int, c: int, parent: TrieNode) -> None:
        ch = board[r][c]
        node = parent.children[ch]

        if node.word:
            res.append(node.word)
            node.word = None  # avoid duplicates

        board[r][c] = '#'  # mark visited
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in node.children:
                dfs(nr, nc, node)
        board[r][c] = ch  # backtrack

        # Prune exhausted branches
        if not node.children:
            del parent.children[ch]

    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root.children:
                dfs(r, c, root)
    return res
    {% endhighlight %}
</div>

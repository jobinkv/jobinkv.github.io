---
layout: archive
title: "Graphs"
permalink: /Resources/leetcode/graphs/
author_profile: true
---

[Back to LeetCode topics](/Resources/leetcode/)

<!-- Problem 43 -->
<div class="problem-card" id="number-of-islands">
    <div class="problem-header">
        <h3 class="problem-title">43. <a href="https://leetcode.com/problems/number-of-islands/" target="_blank" rel="noopener noreferrer">Number of Islands</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(\min(M, N))\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Scan every cell. When an unvisited land cell is found, it is a new island, so increment the count and flood-fill the whole island using Breadth-First Search, marking each visited land cell as <code>'0'</code> so it is never counted again. Marking in place removes the need for a separate visited set. Every cell is processed a constant number of times. BFS is used instead of recursive DFS because the BFS queue only grows to \(O(\min(M, N))\), while recursion on a grid full of land can reach a depth of \(M \cdot N\) and overflow the stack.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def numIslands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])
    islands = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                grid[r][c] = '0'
                queue = deque([(r, c)])
                while queue:
                    row, col = queue.popleft()
                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
    return islands
    {% endhighlight %}
</div>

<!-- Problem 44 -->
<div class="problem-card" id="clone-graph">
    <div class="problem-header">
        <h3 class="problem-title">44. <a href="https://leetcode.com/problems/clone-graph/" target="_blank" rel="noopener noreferrer">Clone Graph</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(V + E)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(V)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value <code>val</code> and a list of its neighbors <code>neighbors</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use DFS with a hash map from each original node to its clone. When visiting a node, if it is already in the map return its clone; otherwise create the clone, <strong>register it in the map before</strong> visiting its neighbors, then recursively clone each neighbor and append the results. Registering first is what stops infinite recursion on cycles and guarantees every node is copied exactly once.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
# Definition for a Node.
# class Node:
#     def __init__(self, val=0, neighbors=None):
#         self.val = val
#         self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node: Optional['Node']) -> Optional['Node']:
    if not node:
        return None

    old_to_new = {}

    def dfs(curr: 'Node') -> 'Node':
        if curr in old_to_new:
            return old_to_new[curr]
        copy = Node(curr.val)
        old_to_new[curr] = copy
        for neighbor in curr.neighbors:
            copy.neighbors.append(dfs(neighbor))
        return copy

    return dfs(node)
    {% endhighlight %}
</div>

<!-- Problem 45 -->
<div class="problem-card" id="pacific-atlantic-water-flow">
    <div class="problem-header">
        <h3 class="problem-title">45. <a href="https://leetcode.com/problems/pacific-atlantic-water-flow/" target="_blank" rel="noopener noreferrer">Pacific Atlantic Water Flow</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(M \cdot N)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(M \cdot N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given an <code>m x n</code> matrix <code>heights</code> where <code>heights[r][c]</code> is the height of a cell, water can flow from a cell to a neighboring cell (up, down, left, right) with height less than or equal to the current cell. The Pacific Ocean touches the top and left edges, and the Atlantic Ocean touches the bottom and right edges. Return all cells from which water can flow to <strong>both</strong> oceans.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Checking every cell separately would be too slow. Instead, <strong>reverse the flow</strong>: start from the ocean borders and move to neighbors that are equal or <em>higher</em>, since those are exactly the cells whose water can reach that ocean. Run one multi-source BFS from all Pacific border cells and another from all Atlantic border cells. The answer is the intersection of the two visited sets. Each cell is visited at most once per ocean.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    rows, cols = len(heights), len(heights[0])

    def bfs(starts):
        visited = set(starts)
        queue = deque(visited)
        while queue:
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if (0 <= nr < rows and 0 <= nc < cols
                        and (nr, nc) not in visited
                        and heights[nr][nc] >= heights[r][c]):
                    visited.add((nr, nc))
                    queue.append((nr, nc))
        return visited

    pacific = [(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)]
    atlantic = [(rows - 1, c) for c in range(cols)] + [(r, cols - 1) for r in range(rows)]

    return [[r, c] for r, c in bfs(pacific) & bfs(atlantic)]
    {% endhighlight %}
</div>

<!-- Problem 46 -->
<div class="problem-card" id="course-schedule">
    <div class="problem-header">
        <h3 class="problem-title">46. <a href="https://leetcode.com/problems/course-schedule/" target="_blank" rel="noopener noreferrer">Course Schedule</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(V + E)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(V + E)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>There are <code>numCourses</code> courses labeled from <code>0</code> to <code>numCourses - 1</code>. Given an array <code>prerequisites</code> where <code>prerequisites[i] = [a, b]</code> means you must take course <code>b</code> before course <code>a</code>, return <code>True</code> if you can finish all courses, otherwise <code>False</code>.</p>
    <div class="section-subtitle">Explanation</div>
    <p>All courses can be finished if and only if the prerequisite graph has no cycle. Use <strong>Kahn's algorithm</strong> (BFS topological sort). Compute the in-degree of every course and start with the courses that have in-degree <code>0</code>. Each time a course is taken, decrease the in-degree of the courses that depend on it, and enqueue any that reach <code>0</code>. If a cycle exists, the courses inside it never reach in-degree <code>0</code>, so the number of courses taken ends up smaller than <code>numCourses</code>.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    queue = deque(i for i in range(numCourses) if indegree[i] == 0)
    taken = 0
    while queue:
        node = queue.popleft()
        taken += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    return taken == numCourses
    {% endhighlight %}
</div>

<!-- Problem 47 -->
<div class="problem-card" id="course-schedule-ii">
    <div class="problem-header">
        <h3 class="problem-title">47. <a href="https://leetcode.com/problems/course-schedule-ii/" target="_blank" rel="noopener noreferrer">Course Schedule II</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(V + E)\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(V + E)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Same setup as Course Schedule, but return an ordering of courses you should take to finish all of them. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.</p>
    <div class="section-subtitle">Explanation</div>
    <p>This is a direct extension of the previous problem. Kahn's algorithm already produces a valid topological order: the order in which courses leave the queue is a valid course order. Record each course as it is taken. If the final order contains fewer than <code>numCourses</code> courses, a cycle exists and the answer is an empty list.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
from collections import deque

def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    graph = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    queue = deque(i for i in range(numCourses) if indegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    return order if len(order) == numCourses else []
    {% endhighlight %}
</div>

<!-- Problem 48 -->
<div class="problem-card" id="graph-valid-tree">
    <div class="problem-header">
        <h3 class="problem-title">48. <a href="https://leetcode.com/problems/graph-valid-tree/" target="_blank" rel="noopener noreferrer">Graph Valid Tree</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O(N \cdot \alpha(N))\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(N)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code> and a list of undirected <code>edges</code>, write a function to check whether these edges make up a valid tree.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A graph with \(n\) nodes is a tree if and only if it is connected and has no cycle, which is equivalent to having <strong>exactly \(n - 1\) edges and no cycle</strong>. First reject any input whose edge count is not \(n - 1\). Then use <strong>Union-Find</strong> (Disjoint Set Union): for each edge, find the roots of both endpoints; if they are already the same, the edge closes a cycle and the graph is not a tree. Otherwise union them. With \(n - 1\) edges and no cycle, the graph is automatically connected. Path compression and union by size make each operation nearly constant, \(O(\alpha(N))\).</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def validTree(n: int, edges: list[list[int]]) -> bool:
    if len(edges) != n - 1:
        return False

    parent = list(range(n))
    size = [1] * n

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path compression
            x = parent[x]
        return x

    for a, b in edges:
        root_a, root_b = find(a), find(b)
        if root_a == root_b:
            return False  # cycle detected
        if size[root_a] < size[root_b]:
            root_a, root_b = root_b, root_a
        parent[root_b] = root_a
        size[root_a] += size[root_b]

    return True
    {% endhighlight %}
</div>

<!-- Problem 49 -->
<div class="problem-card" id="number-of-connected-components-in-an-undirected-graph">
    <div class="problem-header">
        <h3 class="problem-title">49. <a href="https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" target="_blank" rel="noopener noreferrer">Number of Connected Components in an Undirected Graph</a></h3>
        <span class="badge badge-medium">Medium</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Time Complexity:</strong> \(O((V + E) \cdot \alpha(V))\)</div>
        <div class="meta-item"><strong>Space Complexity:</strong> \(O(V)\)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Given <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code> and a list of undirected <code>edges</code>, return the number of connected components in the graph.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Use Union-Find. Start with <code>n</code> components, one per node. For every edge, find the roots of both endpoints; if they differ, the edge merges two components, so union them and decrease the component count by one. If the roots are the same, the edge adds nothing. After processing all edges, the counter holds the number of connected components. This avoids building an adjacency list and a visited array that a DFS/BFS solution would need.</p>
    <div class="section-subtitle">Python Solution</div>
    {% highlight python %}
def countComponents(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    size = [1] * n

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path compression
            x = parent[x]
        return x

    components = n
    for a, b in edges:
        root_a, root_b = find(a), find(b)
        if root_a != root_b:
            if size[root_a] < size[root_b]:
                root_a, root_b = root_b, root_a
            parent[root_b] = root_a
            size[root_a] += size[root_b]
            components -= 1

    return components
    {% endhighlight %}
</div>

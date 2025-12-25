# Pathfinding Algorithm Visualizer
## An Interactive Comparison of Search Algorithms in Artificial Intelligence

---

## Table of Contents
1. [Introduction](#introduction)
2. [Problem Formulation](#problem-formulation)
3. [Search Algorithms](#search-algorithms)
   - [Depth-First Search (DFS)](#depth-first-search-dfs)
   - [Breadth-First Search (BFS)](#breadth-first-search-bfs)
   - [A* Search Algorithm](#a-search-algorithm)
4. [Heuristic Functions](#heuristic-functions)
5. [Algorithm Comparison](#algorithm-comparison)
6. [Implementation Details](#implementation-details)
7. [Visualization Approach](#visualization-approach)
8. [Conclusions](#conclusions)

---

## Introduction

This project implements an interactive visualization tool for comparing fundamental search algorithms used in Artificial Intelligence. The visualizer demonstrates how different pathfinding strategies explore a maze environment to find a path from a start state to a goal state.

Search algorithms are fundamental to AI because they provide systematic methods for exploring state spaces to solve problems. The maze pathfinding problem serves as an excellent educational model because:

- It has a clearly defined state space (grid cells)
- States have well-defined successors (adjacent walkable cells)
- The goal test is simple (reaching the target cell)
- Path costs can be easily measured (number of steps)

---

## Problem Formulation

### State Space Representation

The maze is represented as a 2D grid where:

| Symbol | Meaning |
|--------|---------|
| **Empty Cell** | Walkable path (valid state) |
| **Wall** | Obstacle (invalid state) |
| **Start** | Initial state |
| **Goal** | Target state |

### Formal Definition

- **State**: A position $(x, y)$ on the grid
- **Initial State**: The designated start cell
- **Goal State**: The designated target cell
- **Actions**: Move to an adjacent cell (up, down, left, right)
- **Transition Model**: Moving from $(x, y)$ to an adjacent non-wall cell
- **Path Cost**: Number of moves taken (uniform cost of 1 per move)

### Search Tree vs. State Space

The algorithms explore the state space by building a **search tree**:
- Each **node** represents a state
- Each **edge** represents an action
- The **root** is the initial state
- **Goal nodes** are states that satisfy the goal test

---

## Search Algorithms

### Depth-First Search (DFS)

#### Theory

DFS is an **uninformed (blind) search** algorithm that explores as far as possible along each branch before backtracking. It uses a **Last-In-First-Out (LIFO)** strategy, implemented with a stack data structure.

#### Algorithm Pseudocode

```
function DFS(start, goal):
    stack ← [start]
    visited ← {}
    
    while stack is not empty:
        current ← stack.pop()
        
        if current == goal:
            return reconstruct_path(current)
        
        if current not in visited:
            visited.add(current)
            for each neighbor of current:
                if neighbor not in visited:
                    stack.push(neighbor)
    
    return failure
```

#### Properties

| Property | Value |
|----------|-------|
| **Complete** | No (may get stuck in infinite paths without cycle detection) |
| **Optimal** | No (finds *a* path, not necessarily the shortest) |
| **Time Complexity** | $O(b^m)$ where $b$ = branching factor, $m$ = maximum depth |
| **Space Complexity** | $O(bm)$ - linear in the maximum depth |

#### Characteristics

- **Advantages**: Low memory usage, good for deep solutions
- **Disadvantages**: May find suboptimal paths, can get trapped in deep branches
- **Use Cases**: Memory-constrained environments, when any solution suffices

---

### Breadth-First Search (BFS)

#### Theory

BFS is an **uninformed search** algorithm that explores all nodes at the current depth before moving to nodes at the next depth level. It uses a **First-In-First-Out (FIFO)** strategy, implemented with a queue data structure.

#### Algorithm Pseudocode

```
function BFS(start, goal):
    queue ← [start]
    visited ← {}
    
    while queue is not empty:
        current ← queue.dequeue()
        
        if current == goal:
            return reconstruct_path(current)
        
        if current not in visited:
            visited.add(current)
            for each neighbor of current:
                if neighbor not in visited:
                    queue.enqueue(neighbor)
    
    return failure
```

#### Properties

| Property | Value |
|----------|-------|
| **Complete** | Yes (will always find a solution if one exists) |
| **Optimal** | Yes (for uniform edge costs) |
| **Time Complexity** | $O(b^d)$ where $b$ = branching factor, $d$ = depth of solution |
| **Space Complexity** | $O(b^d)$ - exponential, stores all nodes at current level |

#### Characteristics

- **Advantages**: Guarantees shortest path (in unweighted graphs), complete
- **Disadvantages**: High memory consumption for wide search spaces
- **Use Cases**: Finding shortest paths, when optimality is required

---

### A* Search Algorithm

#### Theory

A* is an **informed (heuristic) search** algorithm that combines the benefits of BFS's optimality with heuristic guidance to reduce exploration. It uses an **evaluation function**:

$$f(n) = g(n) + h(n)$$

Where:
- $g(n)$ = actual cost from start to node $n$
- $h(n)$ = estimated cost from node $n$ to goal (heuristic)
- $f(n)$ = estimated total cost through node $n$

A* expands the node with the lowest $f(n)$ value, using a **priority queue** (min-heap).

#### Algorithm Pseudocode

```
function A*(start, goal):
    openSet ← priority_queue containing start
    gScore[start] ← 0
    fScore[start] ← h(start)
    
    while openSet is not empty:
        current ← node in openSet with lowest fScore
        
        if current == goal:
            return reconstruct_path(current)
        
        openSet.remove(current)
        
        for each neighbor of current:
            tentative_g ← gScore[current] + cost(current, neighbor)
            
            if tentative_g < gScore[neighbor]:
                cameFrom[neighbor] ← current
                gScore[neighbor] ← tentative_g
                fScore[neighbor] ← gScore[neighbor] + h(neighbor)
                
                if neighbor not in openSet:
                    openSet.add(neighbor)
    
    return failure
```

#### Properties

| Property | Value |
|----------|-------|
| **Complete** | Yes (if solution exists and heuristic is admissible) |
| **Optimal** | Yes (if heuristic is admissible and consistent) |
| **Time Complexity** | $O(b^d)$ worst case, but typically much better with good heuristic |
| **Space Complexity** | $O(b^d)$ - stores all generated nodes |

#### Characteristics

- **Advantages**: Optimal, efficient with good heuristics, widely applicable
- **Disadvantages**: Memory-intensive, performance depends on heuristic quality
- **Use Cases**: Navigation systems, game AI, robotics path planning

---

## Heuristic Functions

### What Makes a Good Heuristic?

A heuristic $h(n)$ must be:

1. **Admissible**: Never overestimates the true cost to reach the goal
   $$h(n) \leq h^*(n) \text{ for all } n$$
   where $h^*(n)$ is the true optimal cost

2. **Consistent (Monotonic)**: Satisfies the triangle inequality
   $$h(n) \leq c(n, n') + h(n')$$
   for every node $n$ and successor $n'$

### Manhattan Distance

This project uses **Manhattan distance** (also called taxicab distance or L1 norm):

$$h(n) = |x_n - x_{goal}| + |y_n - y_{goal}|$$

#### Why Manhattan Distance?

- **Admissible**: In a grid with only horizontal/vertical movement, you can never reach the goal in fewer moves than the Manhattan distance
- **Consistent**: Moving one cell changes the heuristic by at most 1
- **Efficient**: Simple to compute: $O(1)$

#### Visual Example

```
Start (0,0) → Goal (3,2)
Manhattan Distance = |3-0| + |2-0| = 5

  0 1 2 3
0 S → → ↓
1       ↓
2       G
```

### Comparison of Heuristics

| Heuristic | Formula | Properties |
|-----------|---------|------------|
| **Zero** | $h(n) = 0$ | Degrades A* to Dijkstra's algorithm |
| **Manhattan** | $\|x_1-x_2\| + \|y_1-y_2\|$ | Admissible for 4-directional movement |
| **Euclidean** | $\sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}$ | Admissible, but less informative for grids |
| **Chebyshev** | $\max(\|x_1-x_2\|, \|y_1-y_2\|)$ | Admissible for 8-directional movement |

---

## Algorithm Comparison

### Theoretical Comparison

| Algorithm | Strategy | Complete | Optimal | Time | Space |
|-----------|----------|----------|---------|------|-------|
| **DFS** | LIFO Stack | No* | No | $O(b^m)$ | $O(bm)$ |
| **BFS** | FIFO Queue | Yes | Yes** | $O(b^d)$ | $O(b^d)$ |
| **A*** | Priority Queue | Yes | Yes*** | $O(b^d)$ | $O(b^d)$ |

*With cycle detection, DFS becomes complete in finite spaces
**Optimal only for uniform costs
***Optimal with admissible heuristic

### Practical Observations

#### Exploration Patterns

- **DFS**: Creates a winding, deep exploration pattern. Often explores many cells far from the goal before finding it. The path found is typically longer than optimal.

- **BFS**: Creates a uniform wavefront expanding from the start. Explores all cells at distance $d$ before any cell at distance $d+1$. Guarantees finding the shortest path.

- **A***: Creates a focused exploration toward the goal. The heuristic guides search, resulting in fewer explored cells while still finding the optimal path.

#### When Each Algorithm Excels

| Scenario | Best Algorithm | Reason |
|----------|----------------|--------|
| Memory-constrained | DFS | Linear space complexity |
| Need shortest path | BFS or A* | Both guarantee optimality |
| Large state space | A* | Heuristic reduces exploration |
| Unknown goal location | BFS | Systematic coverage |

---

## Implementation Details

### Technology Stack

- **React**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript for reliable code
- **Vite**: Fast build tool and development server

### Data Structures

```typescript
// Cell states for visualization
enum CellState {
  EMPTY, WALL, START, END,
  EXPLORED, PATH,
  DFS_BFS_EXPLORED,      // Visited by both DFS and BFS
  DFS_ASTAR_EXPLORED,    // Visited by both DFS and A*
  BFS_ASTAR_EXPLORED,    // Visited by both BFS and A*
  ALL_EXPLORED           // Visited by all three
}

// Algorithm result structure
interface AlgorithmResult {
  exploredCells: number;
  pathLength: number;
  executionTime: number;
  path: Cell[];
  explorationOrder: Cell[];
  stepsToGoal?: number;
}
```

### Maze Generation

The maze is generated using a **Randomized Depth-First Search** algorithm:

1. Start with a grid full of walls
2. Choose a random starting cell, mark it as passage
3. Randomly select a wall that separates a passage from an unvisited cell
4. Remove the wall and mark the new cell as passage
5. Repeat until all cells are visited

This creates perfect mazes (exactly one path between any two points).

### Animation System

The visualization uses a step-by-step animation with configurable speed:

```typescript
// Visual timing calculation
const visualTime = totalAnimationTime × (stepsToGoal / totalSteps)
```

This ensures timing metrics reflect actual visual experience, not just algorithm execution time.

---

## Visualization Approach

### Color Coding

The visualizer uses distinct colors for each algorithm:

| Algorithm | Color | Hex Code |
|-----------|-------|----------|
| DFS | Orange | `#f97316` |
| BFS | Blue | `#3b82f6` |
| A* | Green | `#22c55e` |

### Overlap Visualization

When comparing algorithms, overlapping explored cells use gradients:

- **DFS + BFS**: Orange-Blue gradient
- **DFS + A***: Orange-Green gradient
- **BFS + A***: Blue-Green gradient
- **All Three**: Three-color gradient

### Metrics Displayed

1. **Explored Cells**: Total cells visited during search
2. **Path Length**: Number of steps in the found path
3. **Visual Time**: Actual time to reach goal in animation
4. **Efficiency Ratio**: Path length ÷ explored cells (higher = better)

---

## Conclusions

### Key Findings

1. **DFS** is space-efficient but often produces non-optimal paths
2. **BFS** guarantees optimality but explores more cells uniformly
3. **A*** combines optimality with efficiency through heuristic guidance

### Educational Value

This visualizer demonstrates:

- How different search strategies explore state spaces
- The trade-offs between completeness, optimality, and efficiency
- The power of heuristics in reducing search complexity
- Real-world applications of fundamental AI algorithms

### Future Extensions

Potential improvements could include:
- Weighted edges for non-uniform costs
- Diagonal movement support
- Additional algorithms (Dijkstra, Greedy Best-First)
- Custom maze editing
- Performance benchmarking on larger grids

---

## References

1. Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.
2. Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A Formal Basis for the Heuristic Determination of Minimum Cost Paths. *IEEE Transactions on Systems Science and Cybernetics*, 4(2), 100-107.
3. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.

---

*This documentation was created for the AI Pathfinding Visualizer project.*

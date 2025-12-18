# 🔍 AI Pathfinding Visualizer

An interactive visualization tool that compares Depth-First Search (DFS), Breadth-First Search (BFS), and A* search algorithms on maze pathfinding problems.

## 🎯 Project Goal

This project demonstrates the fundamental differences between uninformed and informed search algorithms, showcasing how heuristics in A* can dramatically improve search efficiency while maintaining optimality.

## ✨ Features

### Core Algorithms
- **Depth-First Search (DFS)**: Explores depth-first using a stack (LIFO)
- **Breadth-First Search (BFS)**: Explores level-by-level using a queue (FIFO)
- **A* Search**: Uses Manhattan distance heuristic to guide search efficiently

### Visualization
- Real-time step-by-step animation of node exploration
- Color-coded cell states:
  - 🟩 Green: Start position
  - 🟥 Red: Goal position
  - ⬛ Dark: Walls
  - 🟦 Blue: Frontier (nodes being considered)
  - ⬜ Gray: Explored nodes
  - 🟧 Orange: Final solution path
- Adjustable animation speed

### Interactive Maze Editing
- Click to toggle walls
- Move start and goal positions
- Generate random mazes (DFS-based algorithm)
- Clear maze to empty grid
- All algorithms run on the SAME maze for fair comparison

### Metrics & Analysis
- Nodes expanded (efficiency measure)
- Path length (solution quality)
- Time taken (performance)
- Optimality guarantee
- Side-by-side comparison of all three algorithms

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd pathfinding-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

1. **Select an Algorithm**: Click DFS, BFS, or A* button
2. **Run Single Algorithm**: Click "Run [Algorithm]" to visualize one algorithm
3. **Compare All**: Click "Compare All Algorithms" to run all three sequentially on the same maze
4. **Edit Maze**:
   - Select edit mode (Toggle Wall, Set Start, Set Goal)
   - Click on cells to modify the maze
5. **Generate New Maze**: Click "Generate Random Maze" for a new challenge
6. **Adjust Speed**: Use the slider to control animation speed
7. **Reset**: Clear visualization to start over

## 📚 Algorithm Details

### Depth-First Search (DFS)

```
Uses: Stack (LIFO)
Guarantee: Finds a path if one exists
Optimality: ❌ NOT guaranteed
Efficiency: Can be inefficient, explores deeply
```

**How it works:**
1. Push start node onto stack
2. Pop node from stack (most recent)
3. If goal found, reconstruct path
4. Otherwise, push unvisited neighbors onto stack
5. Repeat until goal found or stack empty

**Characteristics:**
- Explores as far as possible along each branch before backtracking
- Memory efficient (stores only current path)
- May find very long paths when short ones exist

### Breadth-First Search (BFS)

```
Uses: Queue (FIFO)
Guarantee: Finds shortest path
Optimality: ✅ Guaranteed for unweighted graphs
Efficiency: Explores all nodes at distance d before d+1
```

**How it works:**
1. Enqueue start node
2. Dequeue node from front of queue
3. If goal found, reconstruct path
4. Otherwise, enqueue unvisited neighbors
5. Repeat until goal found or queue empty

**Characteristics:**
- Explores nodes level-by-level (layer-by-layer)
- Always finds shortest path in terms of steps
- More memory intensive than DFS
- No heuristic guidance

### A* Search

```
Uses: Priority Queue (ordered by f(n) = g(n) + h(n))
Guarantee: Finds optimal path
Optimality: ✅ Guaranteed with admissible heuristic
Efficiency: Most efficient - uses heuristic guidance
```

**How it works:**
1. Initialize start node with:
   - g(n) = 0 (cost from start)
   - h(n) = Manhattan distance to goal
   - f(n) = g(n) + h(n)
2. Add start to open set (priority queue)
3. While open set not empty:
   - Remove node with lowest f(n)
   - If goal, reconstruct path
   - For each neighbor:
     - Calculate tentative g(n) = current g + 1
     - If better path found, update costs and parent
4. Add explored nodes to closed set

**Manhattan Distance Heuristic:**
```
h(n) = |n.row - goal.row| + |n.col - goal.col|
```

This heuristic is:
- **Admissible**: Never overestimates actual cost (allows only 4-directional movement)
- **Consistent**: h(n) ≤ cost(n, n') + h(n') for all neighbors n'

**Why is A* more efficient?**

1. **Heuristic Guidance**: Unlike BFS which blindly explores in all directions, A* prioritizes nodes that are closer to the goal
2. **Informed Decisions**: The h(n) component guides search toward the goal region
3. **Fewer Nodes Expanded**: Only explores promising paths, avoiding unnecessary exploration
4. **Still Optimal**: Admissible heuristic ensures shortest path is found

**Example:**
```
If you're at position (5, 5) and goal is at (15, 15):
- BFS: Explores all nodes at distance 1, then 2, then 3, etc.
- A*: Prioritizes nodes in the direction of (15, 15)
- Result: A* might explore 50 nodes while BFS explores 200+
```

## 📊 Understanding the Metrics

### Nodes Expanded
- Number of nodes actually explored (marked as "explored")
- Lower is more efficient
- A* typically expands fewest nodes

### Path Length
- Number of steps in the solution
- BFS and A* find optimal (shortest) path
- DFS may find longer path

### Time Taken
- Execution time in milliseconds
- Rough measure (JavaScript performance.now())
- A* is often fastest despite optimality

### Optimality
- Whether the path is guaranteed to be shortest
- ✅ BFS: Yes (explores level-by-level)
- ✅ A*: Yes (admissible heuristic)
- ❌ DFS: No (explores deeply, not broadly)

## 🏗️ Project Structure

```
pathfinding-visualizer/
├── src/
│   ├── algorithms/
│   │   ├── dfs.ts           # DFS implementation
│   │   ├── bfs.ts           # BFS implementation
│   │   └── astar.ts         # A* implementation
│   ├── components/
│   │   ├── Grid.tsx         # Interactive maze grid
│   │   ├── Controls.tsx     # Algorithm controls
│   │   └── MetricsPanel.tsx # Metrics display
│   ├── types/
│   │   └── maze.types.ts    # TypeScript types
│   ├── utils/
│   │   └── mazeGenerator.ts # Maze generation
│   ├── App.tsx              # Main application
│   ├── App.css              # Styling
│   └── main.tsx             # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Testing Different Scenarios

### Scenario 1: Simple Open Maze
- Clear the maze
- Few walls
- Observe: All algorithms find similar paths, but A* explores fewer nodes

### Scenario 2: Complex Maze
- Generate random maze
- Many walls and corridors
- Observe: DFS may take very long path, BFS guarantees shortest, A* finds it faster

### Scenario 3: Impossible Maze
- Create walls blocking all paths to goal
- Observe: All algorithms explore entire reachable space and report no path

## 🎓 Educational Insights

### Why does DFS find longer paths?
DFS commits to exploring one direction deeply before trying alternatives. If it goes down a long wrong path, it will return that path even if a shorter one exists.

### Why does BFS always find the shortest path?
BFS explores all nodes at distance d before exploring any node at distance d+1. The first time it reaches the goal, it has taken the minimum number of steps.

### Why is A* better than BFS?
While BFS explores uniformly in all directions, A* uses the Manhattan distance heuristic to preferentially explore toward the goal. This means it typically explores far fewer nodes while still guaranteeing the optimal path.

### When might BFS be preferred over A*?
- When heuristic computation is expensive
- When you want simplest possible implementation
- In very small search spaces where the overhead of A* isn't worth it

## 🛠️ Technology Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Pure CSS** - Styling (no external UI libraries)

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment with:
- Different heuristics (Euclidean, Chebyshev)
- 8-directional movement
- Weighted graphs (different terrain costs)
- Additional algorithms (Dijkstra, Greedy Best-First)

## 📝 License

MIT License - Feel free to use for learning and teaching.

## 🙏 Acknowledgments

This project was created as an AI fundamentals demonstration, focusing on clarity and educational value over complexity.

---

**Happy Pathfinding! 🚀**

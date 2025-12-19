# Quick Reference Guide

## 🎮 Controls Quick Reference

### Algorithm Selection
- **DFS Button**: Select Depth-First Search
- **BFS Button**: Select Breadth-First Search  
- **A* Button**: Select A* Search

### Execution
- **Run [Algorithm]**: Execute selected algorithm
- **Compare All Algorithms**: Run DFS, BFS, and A* sequentially
- **Reset**: Clear visualization (keeps maze)

### Maze Editing
- **Toggle Wall**: Click cells to add/remove walls
- **Set Start**: Click to move start position (green)
- **Set Goal**: Click to move goal position (red)

### Maze Generation
- **Generate Random Maze**: Create new DFS-generated maze
- **Clear Maze**: Empty maze with just borders

### Animation
- **Speed Slider**: Control animation speed (1=slow, 100=fast)

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🟩 Green | Start position |
| 🟥 Red | Goal position |
| ⬛ Dark Gray | Wall (impassable) |
| ⬜ Light Gray | Free space / Explored |
| 🟦 Blue | Frontier (being considered) |
| 🟧 Orange | Final path |

## 📊 Metrics Explained

**Nodes Expanded**: Total number of cells explored
- Lower = more efficient
- A* typically has the lowest

**Path Length**: Number of steps in solution
- BFS and A* find shortest path
- DFS may find longer path

**Time Taken**: Execution time in milliseconds
- Rough measure using JavaScript timing

**Optimal**: Whether path is guaranteed to be shortest
- ✅ BFS and A*: Always optimal
- ❌ DFS: Not guaranteed

## 🔍 Algorithm Comparison

| Algorithm | Data Structure | Optimal | Efficiency | Use Case |
|-----------|---------------|---------|------------|----------|
| **DFS** | Stack (LIFO) | ❌ No | Low | Memory-constrained |
| **BFS** | Queue (FIFO) | ✅ Yes | Medium | Shortest path needed |
| **A*** | Priority Queue | ✅ Yes | High | Optimal + efficient |

## 💡 Tips

1. **Start Simple**: Clear maze and draw simple walls to understand each algorithm
2. **Generate Complex**: Use random maze to see real differences
3. **Compare All**: Use comparison mode to see side-by-side behavior
4. **Slow Down**: Lower animation speed to see step-by-step exploration
5. **Test Edge Cases**: Try impossible mazes (fully blocked) to see how algorithms handle it

## 🧪 Testing Scenarios

### Scenario 1: Open Space
- Clear maze, add few scattered walls
- **Expected**: All find similar paths, A* explores fewer nodes

### Scenario 2: Corridor
- Create a long winding corridor
- **Expected**: All find same path, but exploration differs

### Scenario 3: Complex Maze
- Generate random maze
- **Expected**: DFS may find very long path, BFS/A* find shortest, A* explores fewer

### Scenario 4: No Path
- Block all routes to goal
- **Expected**: All algorithms explore reachable area and report failure

## 🐛 Troubleshooting

**Algorithm not running?**
- Make sure an algorithm is selected
- Check that start and goal exist
- Ensure not already running

**Can't edit maze?**
- Wait for algorithm to complete
- Click Reset first

**Animation too fast/slow?**
- Adjust speed slider
- Range: 1 (slowest) to 100 (fastest)

## 📖 Further Reading

See [README.md](README.md) for:
- Detailed algorithm explanations
- Mathematical formulas
- Time/space complexity analysis
- Educational insights
- Code structure

## 🚀 Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:5173
```

---

**Enjoy exploring AI search algorithms! 🎉**

/**
 * A* Search Algorithm
 * 
 * CHARACTERISTICS:
 * - Uses a priority queue ordered by f(n) = g(n) + h(n)
 * - g(n): actual cost from start to node n
 * - h(n): heuristic estimate from node n to goal (Manhattan distance)
 * - f(n): total estimated cost of path through n
 * - GUARANTEED to find optimal path if heuristic is admissible
 * - More efficient than BFS by using heuristic guidance
 * - Explores fewer nodes than BFS/DFS when heuristic is good
 * 
 * TIME COMPLEXITY: O(b^d) where b = branching factor, d = depth
 * SPACE COMPLEXITY: O(b^d) - stores all generated nodes
 * 
 * ADMISSIBILITY: Manhattan distance never overestimates (admissible for 4-directional movement)
 * OPTIMALITY: Guaranteed to find shortest path with admissible heuristic
 */

import { CellType, Position, AlgorithmResult, AStarNode } from '../types/maze.types';

const DIRECTIONS = [
  { row: -1, col: 0 },  // Up
  { row: 1, col: 0 },   // Down
  { row: 0, col: -1 },  // Left
  { row: 0, col: 1 },   // Right
];

/**
 * Calculate Manhattan distance heuristic
 * This is admissible for 4-directional movement (never overestimates)
 * @param from - Current position
 * @param to - Goal position
 * @returns Manhattan distance
 */
function manhattanDistance(from: Position, to: Position): number {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

/**
 * Check if two positions are equal
 */
function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * Get neighbors of a cell (4-directional)
 */
function getNeighbors(pos: Position, grid: CellType[][]): Position[] {
  const neighbors: Position[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (const dir of DIRECTIONS) {
    const newPos: Position = {
      row: pos.row + dir.row,
      col: pos.col + dir.col,
    };

    // Check bounds and if not a wall
    if (
      newPos.row >= 0 &&
      newPos.row < rows &&
      newPos.col >= 0 &&
      newPos.col < cols &&
      grid[newPos.row][newPos.col] !== CellType.WALL
    ) {
      neighbors.push(newPos);
    }
  }

  return neighbors;
}

/**
 * Reconstruct path from start to goal using parent pointers
 */
function reconstructPath(
  nodeMap: Map<string, AStarNode>,
  goal: Position
): Position[] {
  const path: Position[] = [];
  let current: Position | null = goal;

  while (current !== null) {
    path.unshift(current);
    const key = `${current.row},${current.col}`;
    const node = nodeMap.get(key);
    current = node?.parent || null;
  }

  return path;
}

/**
 * Simple priority queue implementation for A*
 * Orders nodes by f-value (lowest first)
 */
class PriorityQueue {
  private items: AStarNode[] = [];

  enqueue(node: AStarNode): void {
    this.items.push(node);
    // Sort by f-value (lower is better)
    // In case of tie, use h-value (prefer nodes closer to goal)
    this.items.sort((a, b) => {
      if (a.f === b.f) {
        return a.h - b.h;
      }
      return a.f - b.f;
    });
  }

  dequeue(): AStarNode | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  contains(position: Position): boolean {
    return this.items.some(
      (node) =>
        node.position.row === position.row &&
        node.position.col === position.col
    );
  }

  updateNode(position: Position, newG: number, newF: number, parent: Position): void {
    const index = this.items.findIndex(
      (node) =>
        node.position.row === position.row &&
        node.position.col === position.col
    );
    
    if (index !== -1) {
      this.items[index].g = newG;
      this.items[index].f = newF;
      this.items[index].parent = parent;
      
      // Re-sort after update
      this.items.sort((a, b) => {
        if (a.f === b.f) {
          return a.h - b.h;
        }
        return a.f - b.f;
      });
    }
  }
}

/**
 * Execute A* algorithm
 * @param grid - The maze grid
 * @param start - Starting position
 * @param goal - Goal position
 * @returns Algorithm result with path and metrics
 */
export function executeAStar(
  grid: CellType[][],
  start: Position,
  goal: Position
): AlgorithmResult {
  const startTime = performance.now();
  
  // Priority queue ordered by f-value
  const openSet = new PriorityQueue();
  
  // Track closed (explored) nodes
  const closedSet = new Set<string>();
  
  // Map to store node information including g, h, f values
  const nodeMap = new Map<string, AStarNode>();
  
  // Track exploration order
  const explorationOrder: Position[] = [];
  
  let nodesExpanded = 0;

  // Initialize start node
  const h = manhattanDistance(start, goal);
  const startNode: AStarNode = {
    position: start,
    g: 0,           // Cost from start to start is 0
    h: h,           // Heuristic estimate to goal
    f: 0 + h,       // Total estimated cost
    parent: null,
  };

  openSet.enqueue(startNode);
  nodeMap.set(`${start.row},${start.col}`, startNode);

  while (!openSet.isEmpty()) {
    // Get node with lowest f-value
    const current = openSet.dequeue()!;
    const key = `${current.position.row},${current.position.col}`;

    // Skip if already in closed set
    if (closedSet.has(key)) {
      continue;
    }

    // Add to closed set and mark as explored
    closedSet.add(key);
    explorationOrder.push(current.position);
    nodesExpanded++;

    // Check if goal reached
    if (positionsEqual(current.position, goal)) {
      const path = reconstructPath(nodeMap, goal);
      const endTime = performance.now();

      return {
        algorithmName: 'A*',
        found: true,
        path,
        explorationOrder,
        nodesExpanded,
        pathLength: path.length - 1,
        timeTaken: endTime - startTime,
        isOptimal: true, // A* with admissible heuristic guarantees optimal path
      };
    }

    // Explore neighbors
    const neighbors = getNeighbors(current.position, grid);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      
      // Skip if already explored
      if (closedSet.has(neighborKey)) {
        continue;
      }

      // Calculate costs for neighbor
      const tentativeG = current.g + 1; // Cost to reach neighbor (uniform cost = 1)
      const h = manhattanDistance(neighbor, goal);
      const f = tentativeG + h;

      const existingNode = nodeMap.get(neighborKey);

      if (!existingNode) {
        // New node - add to open set
        const newNode: AStarNode = {
          position: neighbor,
          g: tentativeG,
          h: h,
          f: f,
          parent: current.position,
        };
        openSet.enqueue(newNode);
        nodeMap.set(neighborKey, newNode);
      } else if (tentativeG < existingNode.g) {
        // Found a better path to this node - update it
        existingNode.g = tentativeG;
        existingNode.f = f;
        existingNode.parent = current.position;
        
        // Update in open set if it's there
        if (openSet.contains(neighbor)) {
          openSet.updateNode(neighbor, tentativeG, f, current.position);
        }
      }
    }
  }

  // No path found
  const endTime = performance.now();
  return {
    algorithmName: 'A*',
    found: false,
    path: [],
    explorationOrder,
    nodesExpanded,
    pathLength: 0,
    timeTaken: endTime - startTime,
    isOptimal: true,
  };
}

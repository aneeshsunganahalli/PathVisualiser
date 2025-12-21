/**
 * Weighted A* Search Algorithm
 * 
 * CHARACTERISTICS:
 * - Similar to A* but multiplies heuristic by weight (ε > 1)
 * - f(n) = g(n) + ε * h(n) where ε is the weight (typically 1.5-2.5)
 * - Trades optimality for speed - explores fewer nodes
 * - Higher weight = faster search but potentially longer path
 * - With ε > 1, path is at most ε times optimal
 * - Useful when speed is more important than finding the absolute shortest path
 * 
 * TIME COMPLEXITY: O(b^d) but typically much faster than A* in practice
 * SPACE COMPLEXITY: O(b^d)
 * 
 * OPTIMALITY: NOT guaranteed - path can be up to ε times longer than optimal
 * SPEED: Faster than standard A*, explores fewer nodes
 */

import { CellType, Position, AlgorithmResult, AStarNode } from '../types/maze.types';

const DIRECTIONS = [
  { row: -1, col: 0 },  // Up
  { row: 1, col: 0 },   // Down
  { row: 0, col: -1 },  // Left
  { row: 0, col: 1 },   // Right
];

const WEIGHT = 2.0; // Weight for the heuristic (ε)

/**
 * Calculate Manhattan distance heuristic
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
 * Priority queue for Weighted A*
 */
class PriorityQueue {
  private items: AStarNode[] = [];

  enqueue(node: AStarNode): void {
    this.items.push(node);
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
 * Execute Weighted A* algorithm
 */
export function executeWeightedAStar(
  grid: CellType[][],
  start: Position,
  goal: Position
): AlgorithmResult {
  const startTime = performance.now();
  
  const openSet = new PriorityQueue();
  const closedSet = new Set<string>();
  const nodeMap = new Map<string, AStarNode>();
  const explorationOrder: Position[] = [];
  
  let nodesExpanded = 0;

  // Initialize start node with weighted heuristic
  const h = manhattanDistance(start, goal);
  const startNode: AStarNode = {
    position: start,
    g: 0,
    h: h,
    f: 0 + WEIGHT * h, // Apply weight to heuristic
    parent: null,
  };

  openSet.enqueue(startNode);
  nodeMap.set(`${start.row},${start.col}`, startNode);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const key = `${current.position.row},${current.position.col}`;

    if (closedSet.has(key)) {
      continue;
    }

    closedSet.add(key);
    explorationOrder.push(current.position);
    nodesExpanded++;

    if (positionsEqual(current.position, goal)) {
      const path = reconstructPath(nodeMap, goal);
      const endTime = performance.now();

      return {
        algorithmName: `Weighted A* (ε=${WEIGHT})`,
        found: true,
        path,
        explorationOrder,
        nodesExpanded,
        pathLength: path.length - 1,
        timeTaken: endTime - startTime,
        isOptimal: false, // Weighted A* sacrifices optimality for speed
      };
    }

    const neighbors = getNeighbors(current.position, grid);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      
      if (closedSet.has(neighborKey)) {
        continue;
      }

      const tentativeG = current.g + 1;
      const h = manhattanDistance(neighbor, goal);
      const f = tentativeG + WEIGHT * h; // Apply weight to heuristic

      const existingNode = nodeMap.get(neighborKey);

      if (!existingNode) {
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
        existingNode.g = tentativeG;
        existingNode.f = f;
        existingNode.parent = current.position;
        
        if (openSet.contains(neighbor)) {
          openSet.updateNode(neighbor, tentativeG, f, current.position);
        }
      }
    }
  }

  const endTime = performance.now();
  return {
    algorithmName: `Weighted A* (ε=${WEIGHT})`,
    found: false,
    path: [],
    explorationOrder,
    nodesExpanded,
    pathLength: 0,
    timeTaken: endTime - startTime,
    isOptimal: false,
  };
}

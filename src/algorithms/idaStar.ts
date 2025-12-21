/**
 * IDA* (Iterative Deepening A*) Search Algorithm
 * 
 * CHARACTERISTICS:
 * - Memory-efficient variant of A*
 * - Uses depth-first search with iteratively increasing f-cost threshold
 * - Space complexity is O(d) instead of O(b^d)
 * - Optimal like A* but uses much less memory
 * - Can be slower than A* due to repeated node expansions
 * - Perfect for memory-constrained environments
 * 
 * TIME COMPLEXITY: O(b^d) but with more repeated work than A*
 * SPACE COMPLEXITY: O(d) - only stores current path!
 * 
 * OPTIMALITY: Guaranteed with admissible heuristic
 * MEMORY: Much more efficient than A*, only stores current path
 */

import { CellType, Position, AlgorithmResult } from '../types/maze.types';

const DIRECTIONS = [
  { row: -1, col: 0 },  // Up
  { row: 1, col: 0 },   // Down
  { row: 0, col: -1 },  // Left
  { row: 0, col: 1 },   // Right
];

const INFINITY_THRESHOLD = 999999;

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
 * Depth-first search with f-cost bound
 * Returns: [threshold, path] where threshold is the minimum cost that exceeded bound
 */
function search(
  grid: CellType[][],
  path: Position[],
  g: number,
  bound: number,
  goal: Position,
  explorationOrder: Position[],
  nodesExpanded: { count: number }
): [number, Position[] | null] {
  const node = path[path.length - 1];
  const h = manhattanDistance(node, goal);
  const f = g + h;

  // Current node exceeds threshold
  if (f > bound) {
    return [f, null];
  }

  // Goal found!
  if (positionsEqual(node, goal)) {
    return [f, [...path]];
  }

  explorationOrder.push(node);
  nodesExpanded.count++;

  let min = INFINITY_THRESHOLD;
  const neighbors = getNeighbors(node, grid);

  for (const neighbor of neighbors) {
    // Avoid cycles - don't revisit nodes in current path
    const inPath = path.some(p => positionsEqual(p, neighbor));
    if (inPath) {
      continue;
    }

    // Recursively search neighbor
    path.push(neighbor);
    const [t, result] = search(grid, path, g + 1, bound, goal, explorationOrder, nodesExpanded);
    
    if (result !== null) {
      return [t, result];
    }
    
    if (t < min) {
      min = t;
    }
    
    path.pop();
  }

  return [min, null];
}

/**
 * Execute IDA* algorithm
 */
export function executeIDAStar(
  grid: CellType[][],
  start: Position,
  goal: Position
): AlgorithmResult {
  const startTime = performance.now();
  
  const explorationOrder: Position[] = [];
  const nodesExpanded = { count: 0 };
  
  // Initial threshold is the heuristic from start to goal
  let bound = manhattanDistance(start, goal);
  const path = [start];

  while (true) {
    const [t, result] = search(grid, path, 0, bound, goal, explorationOrder, nodesExpanded);
    
    if (result !== null) {
      // Path found!
      const endTime = performance.now();
      return {
        algorithmName: 'IDA*',
        found: true,
        path: result,
        explorationOrder,
        nodesExpanded: nodesExpanded.count,
        pathLength: result.length - 1,
        timeTaken: endTime - startTime,
        isOptimal: true, // IDA* with admissible heuristic is optimal
      };
    }
    
    if (t === INFINITY_THRESHOLD) {
      // No path exists
      const endTime = performance.now();
      return {
        algorithmName: 'IDA*',
        found: false,
        path: [],
        explorationOrder,
        nodesExpanded: nodesExpanded.count,
        pathLength: 0,
        timeTaken: endTime - startTime,
        isOptimal: true,
      };
    }
    
    // Increase threshold and try again
    bound = t;
  }
}

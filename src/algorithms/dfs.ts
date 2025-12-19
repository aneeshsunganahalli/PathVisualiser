/**
 * Depth-First Search (DFS) Algorithm
 * 
 * CHARACTERISTICS:
 * - Uses a stack (LIFO) data structure
 * - Explores as far as possible along each branch before backtracking
 * - NOT guaranteed to find the shortest path
 * - Memory efficient (stores only current path)
 * - May explore many unnecessary nodes
 * 
 * TIME COMPLEXITY: O(V + E) where V = vertices, E = edges
 * SPACE COMPLEXITY: O(h) where h = max depth
 */

import { CellType, Position, AlgorithmResult, SearchNode } from '../types/maze.types';

const DIRECTIONS = [
  { row: -1, col: 0 },  // Up
  { row: 1, col: 0 },   // Down
  { row: 0, col: -1 },  // Left
  { row: 0, col: 1 },   // Right
];

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
  nodeMap: Map<string, SearchNode>,
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
 * Execute DFS algorithm
 * @param grid - The maze grid
 * @param start - Starting position
 * @param goal - Goal position
 * @returns Algorithm result with path and metrics
 */
export function executeDFS(
  grid: CellType[][],
  start: Position,
  goal: Position
): AlgorithmResult {
  const startTime = performance.now();
  
  // Stack for DFS (LIFO)
  const stack: SearchNode[] = [{ position: start, parent: null }];
  
  // Track visited nodes
  const visited = new Set<string>();
  
  // Map to store node information
  const nodeMap = new Map<string, SearchNode>();
  
  // Track exploration order
  const explorationOrder: Position[] = [];
  
  let nodesExpanded = 0;

  while (stack.length > 0) {
    // Pop from stack (LIFO - explores depth first)
    const current = stack.pop()!;
    const key = `${current.position.row},${current.position.col}`;

    // Skip if already visited
    if (visited.has(key)) {
      continue;
    }

    // Mark as visited and explored
    visited.add(key);
    nodeMap.set(key, current);
    explorationOrder.push(current.position);
    nodesExpanded++;

    // Check if goal reached
    if (positionsEqual(current.position, goal)) {
      const path = reconstructPath(nodeMap, goal);
      const endTime = performance.now();

      return {
        algorithmName: 'DFS',
        found: true,
        path,
        explorationOrder,
        nodesExpanded,
        pathLength: path.length - 1, // Subtract 1 to get number of steps
        timeTaken: endTime - startTime,
        isOptimal: false, // DFS does NOT guarantee optimal path
      };
    }

    // Add neighbors to stack (in reverse order for consistent exploration)
    const neighbors = getNeighbors(current.position, grid);
    
    // Reverse to maintain consistent left-to-right, top-to-bottom exploration
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      
      if (!visited.has(neighborKey)) {
        stack.push({
          position: neighbor,
          parent: current.position,
        });
      }
    }
  }

  // No path found
  const endTime = performance.now();
  return {
    algorithmName: 'DFS',
    found: false,
    path: [],
    explorationOrder,
    nodesExpanded,
    pathLength: 0,
    timeTaken: endTime - startTime,
    isOptimal: false,
  };
}

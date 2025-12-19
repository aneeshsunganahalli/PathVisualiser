/**
 * Breadth-First Search (BFS) Algorithm
 * 
 * CHARACTERISTICS:
 * - Uses a queue (FIFO) data structure
 * - Explores all nodes at depth d before exploring nodes at depth d+1
 * - GUARANTEED to find the shortest path in unweighted graphs
 * - Explores nodes level by level
 * - More memory intensive than DFS
 * 
 * TIME COMPLEXITY: O(V + E) where V = vertices, E = edges
 * SPACE COMPLEXITY: O(V) - stores all nodes at current level
 * 
 * OPTIMALITY: Always finds the shortest path in terms of number of steps
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
 * Execute BFS algorithm
 * @param grid - The maze grid
 * @param start - Starting position
 * @param goal - Goal position
 * @returns Algorithm result with path and metrics
 */
export function executeBFS(
  grid: CellType[][],
  start: Position,
  goal: Position
): AlgorithmResult {
  const startTime = performance.now();
  
  // Queue for BFS (FIFO)
  const queue: SearchNode[] = [{ position: start, parent: null }];
  
  // Track visited nodes
  const visited = new Set<string>();
  
  // Map to store node information
  const nodeMap = new Map<string, SearchNode>();
  
  // Track exploration order
  const explorationOrder: Position[] = [];
  
  let nodesExpanded = 0;

  // Mark start as visited immediately
  const startKey = `${start.row},${start.col}`;
  visited.add(startKey);

  while (queue.length > 0) {
    // Dequeue from front (FIFO - explores breadth first)
    const current = queue.shift()!;
    const key = `${current.position.row},${current.position.col}`;

    // Store node and mark as explored
    nodeMap.set(key, current);
    explorationOrder.push(current.position);
    nodesExpanded++;

    // Check if goal reached
    if (positionsEqual(current.position, goal)) {
      const path = reconstructPath(nodeMap, goal);
      const endTime = performance.now();

      return {
        algorithmName: 'BFS',
        found: true,
        path,
        explorationOrder,
        nodesExpanded,
        pathLength: path.length - 1, // Subtract 1 to get number of steps
        timeTaken: endTime - startTime,
        isOptimal: true, // BFS guarantees optimal path in unweighted graphs
      };
    }

    // Add neighbors to queue
    const neighbors = getNeighbors(current.position, grid);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      
      // Only add if not visited (prevents cycles and duplicate processing)
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        queue.push({
          position: neighbor,
          parent: current.position,
        });
      }
    }
  }

  // No path found
  const endTime = performance.now();
  return {
    algorithmName: 'BFS',
    found: false,
    path: [],
    explorationOrder,
    nodesExpanded,
    pathLength: 0,
    timeTaken: endTime - startTime,
    isOptimal: true, // Still optimal (no path exists)
  };
}

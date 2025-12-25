/**
 * Type definitions for the pathfinding visualizer
 */

// Cell types in the maze
export enum CellType {
  WALL = 'wall',
  FREE = 'free',
  START = 'start',
  GOAL = 'goal',
}

// Cell state during algorithm execution
export enum CellState {
  UNEXPLORED = 'unexplored',
  FRONTIER = 'frontier',      // In the open set (to be explored)
  EXPLORED = 'explored',       // Already visited
  PATH = 'path',               // Part of the final solution path
  DFS_EXPLORED = 'dfs_explored',     // Explored by DFS only
  BFS_EXPLORED = 'bfs_explored',     // Explored by BFS only
  ASTAR_EXPLORED = 'astar_explored', // Explored by A* only
  DFS_BFS_EXPLORED = 'dfs_bfs_explored',     // Explored by DFS and BFS
  DFS_ASTAR_EXPLORED = 'dfs_astar_explored', // Explored by DFS and A*
  BFS_ASTAR_EXPLORED = 'bfs_astar_explored', // Explored by BFS and A*
  ALL_EXPLORED = 'all_explored',             // Explored by all three
}

// Position in the grid
export interface Position {
  row: number;
  col: number;
}

// Cell in the maze
export interface Cell {
  position: Position;
  type: CellType;
  state: CellState;
}

// Result of running a pathfinding algorithm
export interface AlgorithmResult {
  algorithmName: string;
  found: boolean;              // Whether a path was found
  path: Position[];            // Final path from start to goal
  explorationOrder: Position[]; // Order in which nodes were explored
  nodesExpanded: number;       // Total nodes explored
  pathLength: number;          // Length of final path (0 if not found)
  timeTaken: number;           // Time in milliseconds (visual time in comparison mode)
  isOptimal: boolean;          // Whether the path is guaranteed to be optimal
  stepsToGoal?: number;        // Number of steps to reach goal (for comparison)
}

// A* specific node data
export interface AStarNode {
  position: Position;
  g: number;  // Cost from start to this node
  h: number;  // Heuristic estimate from this node to goal
  f: number;  // Total cost: f = g + h
  parent: Position | null;
}

// Generic node for BFS/DFS
export interface SearchNode {
  position: Position;
  parent: Position | null;
}

// Algorithm type
export enum Algorithm {
  DFS = 'DFS',
  BFS = 'BFS',
  ASTAR = 'A*',
}

// Edit mode for user interaction
export enum EditMode {
  TOGGLE_WALL = 'toggle_wall',
  SET_START = 'set_start',
  SET_GOAL = 'set_goal',
}

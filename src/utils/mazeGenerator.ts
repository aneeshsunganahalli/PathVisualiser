/**
 * DFS-based maze generation algorithm
 * Creates a perfect maze (one path between any two cells) using recursive backtracking
 */

import { CellType, Position } from '../types/maze.types';

const DIRECTIONS = [
  { row: -2, col: 0 },  // Up (skip one cell to create walls)
  { row: 2, col: 0 },   // Down
  { row: 0, col: -2 },  // Left
  { row: 0, col: 2 },   // Right
];

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  
  // Simple seeded random number generator (LCG)
  let random = seed !== undefined ? seed : Math.random() * 2147483647;
  const nextRandom = () => {
    random = (random * 1103515245 + 12345) % 2147483648;
    return random / 2147483648;
  };
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Check if position is within grid bounds
 */
function isInBounds(pos: Position, rows: number, cols: number): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
}

/**
 * Recursive DFS maze generation
 */
function carvePath(
  grid: CellType[][],
  current: Position,
  visited: Set<string>,
  seed?: number
): void {
  const key = `${current.row},${current.col}`;
  visited.add(key);
  grid[current.row][current.col] = CellType.FREE;

  // Randomize directions for more interesting mazes
  const directions = shuffleArray(DIRECTIONS, seed);

  for (const dir of directions) {
    const next: Position = {
      row: current.row + dir.row,
      col: current.col + dir.col,
    };

    const nextKey = `${next.row},${next.col}`;

    if (
      isInBounds(next, grid.length, grid[0].length) &&
      !visited.has(nextKey)
    ) {
      // Carve through the wall between current and next
      const wallRow = current.row + dir.row / 2;
      const wallCol = current.col + dir.col / 2;
      grid[wallRow][wallCol] = CellType.FREE;

      carvePath(grid, next, visited, seed);
    }
  }
}

/**
 * Generate a maze using DFS algorithm with multiple paths
 * @param rows - Number of rows (should be odd for best results)
 * @param cols - Number of columns (should be odd for best results)
 * @param seed - Optional seed for deterministic generation
 */
export function generateMaze(
  rows: number,
  cols: number,
  seed?: number
): CellType[][] {
  // Ensure odd dimensions for proper maze generation
  const actualRows = rows % 2 === 0 ? rows - 1 : rows;
  const actualCols = cols % 2 === 0 ? cols - 1 : cols;

  // Initialize grid with all walls
  const grid: CellType[][] = Array(actualRows)
    .fill(null)
    .map(() => Array(actualCols).fill(CellType.WALL));

  // Start carving from top-left corner
  const startPos: Position = { row: 1, col: 1 };
  const visited = new Set<string>();

  carvePath(grid, startPos, visited, seed);

  // Add some extra openings to create multiple paths (makes comparison more interesting)
  const random = seed !== undefined ? seed : Math.random() * 2147483647;
  let currentRandom = random;
  const nextRandom = () => {
    currentRandom = (currentRandom * 1103515245 + 12345) % 2147483648;
    return currentRandom / 2147483648;
  };

  // Open some additional walls (10-15% of walls) to create alternative paths
  const wallsToOpen = Math.floor((actualRows * actualCols) * 0.08);
  let opened = 0;
  let attempts = 0;
  const maxAttempts = wallsToOpen * 5;

  while (opened < wallsToOpen && attempts < maxAttempts) {
    const row = 2 + Math.floor(nextRandom() * (actualRows - 4));
    const col = 2 + Math.floor(nextRandom() * (actualCols - 4));
    
    if (grid[row][col] === CellType.WALL) {
      // Make sure we're not opening a wall that would create a 2x2 open space
      const adjacentFree = [
        grid[row - 1]?.[col],
        grid[row + 1]?.[col],
        grid[row]?.[col - 1],
        grid[row]?.[col + 1]
      ].filter(cell => cell === CellType.FREE).length;
      
      if (adjacentFree >= 2 && adjacentFree <= 3) {
        grid[row][col] = CellType.FREE;
        opened++;
      }
    }
    attempts++;
  }

  // Set start and goal positions - place them further apart
  grid[1][1] = CellType.START;
  grid[actualRows - 2][actualCols - 2] = CellType.GOAL;

  return grid;
}

/**
 * Create a simple predefined maze for testing
 */
export function createSimpleMaze(): CellType[][] {
  const rows = 15;
  const cols = 25;
  
  // Initialize with free space
  const grid: CellType[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(CellType.FREE));

  // Add border walls
  for (let i = 0; i < rows; i++) {
    grid[i][0] = CellType.WALL;
    grid[i][cols - 1] = CellType.WALL;
  }
  for (let j = 0; j < cols; j++) {
    grid[0][j] = CellType.WALL;
    grid[rows - 1][j] = CellType.WALL;
  }

  // Add some interior walls to create interesting paths
  for (let i = 2; i < rows - 2; i += 2) {
    for (let j = 2; j < cols - 2; j++) {
      if (j !== cols / 2) {
        grid[i][j] = CellType.WALL;
      }
    }
  }

  // Set start and goal
  grid[1][1] = CellType.START;
  grid[rows - 2][cols - 2] = CellType.GOAL;

  return grid;
}

/**
 * Create an empty grid with just borders
 */
export function createEmptyMaze(rows: number, cols: number): CellType[][] {
  const grid: CellType[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(CellType.FREE));

  // Add border walls
  for (let i = 0; i < rows; i++) {
    grid[i][0] = CellType.WALL;
    grid[i][cols - 1] = CellType.WALL;
  }
  for (let j = 0; j < cols; j++) {
    grid[0][j] = CellType.WALL;
    grid[rows - 1][j] = CellType.WALL;
  }

  // Set start and goal
  grid[1][1] = CellType.START;
  grid[rows - 2][cols - 2] = CellType.GOAL;

  return grid;
}

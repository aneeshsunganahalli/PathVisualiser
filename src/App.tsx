/**
 * Main App Component
 * Orchestrates the pathfinding visualization
 */

import { useState, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import MetricsPanel from './components/MetricsPanel';
import { executeDFS } from './algorithms/dfs';
import { executeBFS } from './algorithms/bfs';
import { executeAStar } from './algorithms/astar';
import { generateMaze, createEmptyMaze } from './utils/mazeGenerator';
import {
  CellType,
  CellState,
  Position,
  Algorithm,
  AlgorithmResult,
  EditMode,
} from './types/maze.types';
import './App.css';

const GRID_ROWS = 21;
const GRID_COLS = 41;

function App() {
  // Maze state
  const [grid, setGrid] = useState<CellType[][]>(() => generateMaze(GRID_ROWS, GRID_COLS, 12345));
  const [cellStates, setCellStates] = useState<CellState[][]>(() =>
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(CellState.UNEXPLORED))
  );

  // Control state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [editMode, setEditMode] = useState<EditMode>(EditMode.TOGGLE_WALL);

  // Results
  const [results, setResults] = useState<AlgorithmResult[]>([]);

  /**
   * Find start and goal positions in the grid
   */
  const findPositions = useCallback((currentGrid: CellType[][]) => {
    let start: Position | null = null;
    let goal: Position | null = null;

    for (let row = 0; row < currentGrid.length; row++) {
      for (let col = 0; col < currentGrid[0].length; col++) {
        if (currentGrid[row][col] === CellType.START) {
          start = { row, col };
        } else if (currentGrid[row][col] === CellType.GOAL) {
          goal = { row, col };
        }
      }
    }

    return { start, goal };
  }, []);

  /**
   * Reset visualization (clear cell states but keep maze)
   */
  const resetVisualization = useCallback(() => {
    setCellStates(
      Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(CellState.UNEXPLORED))
    );
    setResults([]);
  }, [grid]);

  /**
   * Animate algorithm execution step by step
   */
  const animateAlgorithm = async (result: AlgorithmResult): Promise<void> => {
    return new Promise((resolve) => {
      const { explorationOrder, path } = result;
      let step = 0;

      const intervalId = setInterval(() => {
        if (step < explorationOrder.length) {
          const pos = explorationOrder[step];
          setCellStates((prev) => {
            const newStates = prev.map((row) => [...row]);
            newStates[pos.row][pos.col] = CellState.EXPLORED;
            return newStates;
          });
          step++;
        } else if (step === explorationOrder.length && path.length > 0) {
          // Show final path
          setCellStates((prev) => {
            const newStates = prev.map((row) => [...row]);
            for (const pos of path) {
              // Don't override start/goal visualization
              if (
                grid[pos.row][pos.col] !== CellType.START &&
                grid[pos.row][pos.col] !== CellType.GOAL
              ) {
                newStates[pos.row][pos.col] = CellState.PATH;
              }
            }
            return newStates;
          });
          clearInterval(intervalId);
          resolve();
        } else {
          clearInterval(intervalId);
          resolve();
        }
      }, Math.max(1, 101 - animationSpeed)); // Speed control
    });
  };

  /**
   * Run selected algorithm
   */
  const runAlgorithm = async () => {
    if (!selectedAlgorithm) return;

    const { start, goal } = findPositions(grid);
    if (!start || !goal) {
      alert('Start or goal position not found!');
      return;
    }

    setIsRunning(true);
    resetVisualization();

    // Execute algorithm
    let result: AlgorithmResult;
    switch (selectedAlgorithm) {
      case Algorithm.DFS:
        result = executeDFS(grid, start, goal);
        break;
      case Algorithm.BFS:
        result = executeBFS(grid, start, goal);
        break;
      case Algorithm.ASTAR:
        result = executeAStar(grid, start, goal);
        break;
      default:
        return;
    }

    // Animate
    await animateAlgorithm(result);

    setResults([result]);
    setIsRunning(false);
  };

  /**
   * Run comparison of all algorithms (CONCURRENT with different colors)
   * All algorithms run simultaneously with distinct colors
   */
  const runComparison = async () => {
    const { start, goal } = findPositions(grid);
    if (!start || !goal) {
      alert('Start or goal position not found!');
      return;
    }

    setIsRunning(true);
    resetVisualization();

    // Execute all algorithms (they compute results independently)
    const dfsResult = executeDFS(grid, start, goal);
    const bfsResult = executeBFS(grid, start, goal);
    const astarResult = executeAStar(grid, start, goal);

    // Track which algorithms have explored each cell
    const exploredBy: Map<string, Set<string>> = new Map();

    // Find the maximum exploration length to know when to stop
    const maxExplorationSteps = Math.max(
      dfsResult.explorationOrder.length,
      bfsResult.explorationOrder.length,
      astarResult.explorationOrder.length
    );

    // Animate all algorithms concurrently with different colors
    let step = 0;
    const intervalId = setInterval(() => {
      if (step < maxExplorationSteps) {
        setCellStates((prev) => {
          const newStates = prev.map((row) => [...row]);
          
          // Update DFS exploration (Red)
          if (step < dfsResult.explorationOrder.length) {
            const pos = dfsResult.explorationOrder[step];
            if (grid[pos.row][pos.col] !== CellType.START && grid[pos.row][pos.col] !== CellType.GOAL) {
              const key = `${pos.row},${pos.col}`;
              if (!exploredBy.has(key)) {
                exploredBy.set(key, new Set());
              }
              exploredBy.get(key)!.add('dfs');
              
              // Determine state based on how many algorithms have explored this cell
              const algorithms = exploredBy.get(key)!;
              if (algorithms.size === 1) {
                newStates[pos.row][pos.col] = CellState.DFS_EXPLORED;
              }
            }
          }
          
          // Update BFS exploration (Blue)
          if (step < bfsResult.explorationOrder.length) {
            const pos = bfsResult.explorationOrder[step];
            if (grid[pos.row][pos.col] !== CellType.START && grid[pos.row][pos.col] !== CellType.GOAL) {
              const key = `${pos.row},${pos.col}`;
              if (!exploredBy.has(key)) {
                exploredBy.set(key, new Set());
              }
              exploredBy.get(key)!.add('bfs');
              
              const algorithms = exploredBy.get(key)!;
              if (algorithms.size === 1) {
                newStates[pos.row][pos.col] = CellState.BFS_EXPLORED;
              } else {
                // Multiple algorithms - show blended color
                newStates[pos.row][pos.col] = CellState.EXPLORED;
              }
            }
          }
          
          // Update A* exploration (Green)
          if (step < astarResult.explorationOrder.length) {
            const pos = astarResult.explorationOrder[step];
            if (grid[pos.row][pos.col] !== CellType.START && grid[pos.row][pos.col] !== CellType.GOAL) {
              const key = `${pos.row},${pos.col}`;
              if (!exploredBy.has(key)) {
                exploredBy.set(key, new Set());
              }
              exploredBy.get(key)!.add('astar');
              
              const algorithms = exploredBy.get(key)!;
              if (algorithms.size === 1) {
                newStates[pos.row][pos.col] = CellState.ASTAR_EXPLORED;
              } else {
                // Multiple algorithms - show blended color
                newStates[pos.row][pos.col] = CellState.EXPLORED;
              }
            }
          }
          
          return newStates;
        });
        step++;
      } else {
        // Show final path (A* typically has the best path, show that)
        if (astarResult.path.length > 0) {
          setCellStates((prev) => {
            const newStates = prev.map((row) => [...row]);
            for (const pos of astarResult.path) {
              if (grid[pos.row][pos.col] !== CellType.START && grid[pos.row][pos.col] !== CellType.GOAL) {
                newStates[pos.row][pos.col] = CellState.PATH;
              }
            }
            return newStates;
          });
        }
        
        clearInterval(intervalId);
        setResults([dfsResult, bfsResult, astarResult]);
        setIsRunning(false);
      }
    }, Math.max(1, 101 - animationSpeed));
  };

  /**
   * Generate new random maze
   */
  const handleGenerateMaze = () => {
    const newGrid = generateMaze(GRID_ROWS, GRID_COLS);
    setGrid(newGrid);
    resetVisualization();
  };

  /**
   * Clear maze to empty grid
   */
  const handleClearMaze = () => {
    const newGrid = createEmptyMaze(GRID_ROWS, GRID_COLS);
    setGrid(newGrid);
    resetVisualization();
  };

  /**
   * Handle cell click for editing
   */
  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;

    const currentCell = grid[row][col];

    switch (editMode) {
      case EditMode.TOGGLE_WALL:
        // Don't allow toggling start/goal
        if (currentCell !== CellType.START && currentCell !== CellType.GOAL) {
          setGrid((prev) => {
            const newGrid = prev.map((r) => [...r]);
            newGrid[row][col] =
              currentCell === CellType.WALL ? CellType.FREE : CellType.WALL;
            return newGrid;
          });
        }
        break;

      case EditMode.SET_START:
        // Remove old start
        setGrid((prev) => {
          const newGrid = prev.map((r) => [...r]);
          for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
              if (newGrid[i][j] === CellType.START) {
                newGrid[i][j] = CellType.FREE;
              }
            }
          }
          newGrid[row][col] = CellType.START;
          return newGrid;
        });
        break;

      case EditMode.SET_GOAL:
        // Remove old goal
        setGrid((prev) => {
          const newGrid = prev.map((r) => [...r]);
          for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
              if (newGrid[i][j] === CellType.GOAL) {
                newGrid[i][j] = CellType.FREE;
              }
            }
          }
          newGrid[row][col] = CellType.GOAL;
          return newGrid;
        });
        break;
    }

    resetVisualization();
  };

  return (
    <div className="app">
      <div className="toolbar">
        <Controls
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmSelect={setSelectedAlgorithm}
          onRunAlgorithm={runAlgorithm}
          onRunComparison={runComparison}
          onResetVisualization={resetVisualization}
          onGenerateMaze={handleGenerateMaze}
          onClearMaze={handleClearMaze}
          animationSpeed={animationSpeed}
          onSpeedChange={setAnimationSpeed}
          editMode={editMode}
          onEditModeChange={setEditMode}
          isRunning={isRunning}
        />
      </div>

      <div className="content-area">
        <div className="maze-container">
          <Grid
            grid={grid}
            cellStates={cellStates}
            onCellClick={handleCellClick}
            editMode={editMode}
            isRunning={isRunning}
          />
        </div>

        <div className="metrics-container">
          <MetricsPanel results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;

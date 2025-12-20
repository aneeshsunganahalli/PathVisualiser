/**
 * Grid component - Interactive maze visualization
 * Displays the maze grid with cells colored based on their type and state
 */

import React, { useEffect, useRef, useState } from 'react';
import { CellType, CellState, EditMode } from '../types/maze.types';

interface GridProps {
  grid: CellType[][];
  cellStates: CellState[][];
  onCellClick: (row: number, col: number) => void;
  editMode: EditMode;
  isRunning: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, cellStates, onCellClick, editMode, isRunning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(18);

  useEffect(() => {
    const calculateCellSize = () => {
      if (!containerRef.current || grid.length === 0) return;

      const container = containerRef.current.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth - 64; // padding
      const containerHeight = container.clientHeight - 64;
      
      const rows = grid.length;
      const cols = grid[0]?.length || 0;

      // Calculate the maximum cell size that fits
      const maxCellWidth = Math.floor(containerWidth / cols);
      const maxCellHeight = Math.floor(containerHeight / rows);
      
      const size = Math.min(maxCellWidth, maxCellHeight, 30); // Max 30px per cell
      setCellSize(Math.max(size, 8)); // Min 8px per cell
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [grid]);

  /**
   * Get cell color based on type and state
   */
  const getCellColor = (type: CellType, state: CellState): string => {
    // Cell type takes precedence
    if (type === CellType.WALL) return '#111111';
    if (type === CellType.START) return '#10b981';
    if (type === CellType.GOAL) return '#ef4444';

    // Then check state - with algorithm-specific colors
    switch (state) {
      case CellState.FRONTIER:
        return '#3b82f6'; // Blue - in queue/stack
      case CellState.DFS_EXPLORED:
        return '#ef4444'; // Red - DFS
      case CellState.BFS_EXPLORED:
        return '#3b82f6'; // Blue - BFS
      case CellState.ASTAR_EXPLORED:
        return '#10b981'; // Green - A*
      case CellState.EXPLORED:
        return '#8b5cf6'; // Purple - overlapping algorithms
      case CellState.PATH:
        return '#fbbf24'; // Amber - final path
      case CellState.UNEXPLORED:
      default:
        return '#1f2937'; // Dark gray - not yet visited
    }
  };

  /**
   * Get cursor style based on edit mode
   */
  const getCursorStyle = (): string => {
    if (isRunning) return 'not-allowed';
    
    switch (editMode) {
      case EditMode.TOGGLE_WALL:
        return 'pointer';
      case EditMode.SET_START:
        return 'crosshair';
      case EditMode.SET_GOAL:
        return 'crosshair';
      default:
        return 'default';
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-block',
        border: '2px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {grid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            height: `${cellSize}px`,
          }}
        >
          {row.map((cell, colIndex) => {
            const state = cellStates[rowIndex][colIndex];
            const color = getCellColor(cell, state);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => !isRunning && onCellClick(rowIndex, colIndex)}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: color,
                  border: '0.5px solid rgba(255, 255, 255, 0.05)',
                  cursor: getCursorStyle(),
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                title={`(${rowIndex}, ${colIndex}) - ${cell} - ${state}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;

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

      // Use viewport dimensions for better sizing
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Account for toolbar (~60px) and padding
      const availableHeight = viewportHeight - 150;
      const availableWidth = Math.min(viewportWidth - 100, 1400); // Max width constraint
      
      const rows = grid.length;
      const cols = grid[0]?.length || 0;

      // Calculate the maximum cell size that fits
      const maxCellWidth = Math.floor(availableWidth / cols);
      const maxCellHeight = Math.floor(availableHeight / rows);
      
      const size = Math.min(maxCellWidth, maxCellHeight, 28); // Max 28px per cell
      setCellSize(Math.max(size, 10)); // Min 10px per cell
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [grid]);

  /**
   * Get cell styling based on type and state with better visibility for comparison
   */
  const getCellStyle = (type: CellType, state: CellState): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
      cursor: getCursorStyle(),
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    // Algorithm colors
    const DFS_COLOR = '#f97316';  // Orange
    const BFS_COLOR = '#3b82f6';  // Blue
    const ASTAR_COLOR = '#22c55e'; // Green

    // Cell type takes precedence
    if (type === CellType.WALL) return { ...baseStyle, backgroundColor: '#111111' };
    if (type === CellType.START) return { ...baseStyle, backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' };
    if (type === CellType.GOAL) return { ...baseStyle, backgroundColor: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' };

    // Then check state - solid colors for single algorithms, gradients for combinations
    switch (state) {
      case CellState.FRONTIER:
        return { ...baseStyle, backgroundColor: '#60a5fa' };
      
      // Single algorithm - solid colors
      case CellState.DFS_EXPLORED:
        return { ...baseStyle, backgroundColor: DFS_COLOR };
      case CellState.BFS_EXPLORED:
        return { ...baseStyle, backgroundColor: BFS_COLOR };
      case CellState.ASTAR_EXPLORED:
        return { ...baseStyle, backgroundColor: ASTAR_COLOR };
      
      // Two algorithms - gradient of those two colors
      case CellState.DFS_BFS_EXPLORED:
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${DFS_COLOR} 0%, ${BFS_COLOR} 100%)`,
        };
      case CellState.DFS_ASTAR_EXPLORED:
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${DFS_COLOR} 0%, ${ASTAR_COLOR} 100%)`,
        };
      case CellState.BFS_ASTAR_EXPLORED:
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${BFS_COLOR} 0%, ${ASTAR_COLOR} 100%)`,
        };
      
      // All three algorithms - gradient with all three colors
      case CellState.ALL_EXPLORED:
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${DFS_COLOR} 0%, ${BFS_COLOR} 50%, ${ASTAR_COLOR} 100%)`,
        };
      
      // Generic explored (fallback)
      case CellState.EXPLORED:
        return { 
          ...baseStyle, 
          background: `linear-gradient(135deg, ${DFS_COLOR} 0%, ${BFS_COLOR} 50%, ${ASTAR_COLOR} 100%)`,
        };
      
      case CellState.PATH:
        return { 
          ...baseStyle, 
          backgroundColor: '#fbbf24',
          boxShadow: '0 0 8px rgba(251, 191, 36, 0.7)',
        };
      
      case CellState.UNEXPLORED:
      default:
        return { ...baseStyle, backgroundColor: '#1f2937' };
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
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        background: '#0f0f0f',
        padding: '4px',
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
            const style = getCellStyle(cell, state);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => !isRunning && onCellClick(rowIndex, colIndex)}
                style={style}
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

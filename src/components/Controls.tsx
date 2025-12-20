/**
 * Controls component - Algorithm selection and execution controls
 */

import React, { useState } from 'react';
import { Algorithm, EditMode } from '../types/maze.types';
import Modal from './Modal';

interface ControlsProps {
  selectedAlgorithm: Algorithm | null;
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  onRunAlgorithm: () => void;
  onRunComparison: () => void;
  onResetVisualization: () => void;
  onGenerateMaze: () => void;
  onClearMaze: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
  isRunning: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  selectedAlgorithm,
  onAlgorithmSelect,
  onRunAlgorithm,
  onRunComparison,
  onResetVisualization,
  onGenerateMaze,
  onClearMaze,
  animationSpeed,
  onSpeedChange,
  editMode,
  onEditModeChange,
  isRunning,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="toolbar-content">
        {/* Algorithm Selection */}
        <div className="toolbar-group">
          <span className="toolbar-label">Algorithm:</span>
          {Object.values(Algorithm).map((algo) => (
            <button
              key={algo}
              onClick={() => onAlgorithmSelect(algo)}
              disabled={isRunning}
              className={`btn btn-sm ${selectedAlgorithm === algo ? 'btn-primary' : 'btn-secondary'}`}
            >
              {algo}
            </button>
          ))}
        </div>

        <div className="toolbar-divider" />

        {/* Run Controls */}
        <div className="toolbar-group">
          <button
            onClick={onRunAlgorithm}
            disabled={!selectedAlgorithm || isRunning}
            className="btn btn-sm btn-success"
          >
            {isRunning ? '⚡ Running...' : '▶ Run'}
          </button>
          
          <button
            onClick={onRunComparison}
            disabled={isRunning}
            className="btn btn-sm btn-warning"
          >
            🔄 Compare All
          </button>
          
          <button
            onClick={onResetVisualization}
            disabled={isRunning}
            className="btn btn-sm btn-danger"
          >
            ⟲ Reset
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Maze Controls */}
        <div className="toolbar-group">
          <button
            onClick={onGenerateMaze}
            disabled={isRunning}
            className="btn btn-sm btn-primary"
          >
            🎲 Generate Maze
          </button>
          
          <button
            onClick={() => setShowEditModal(true)}
            disabled={isRunning}
            className="btn btn-sm btn-primary"
          >
            ✏️ Edit
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Speed Control */}
        <div className="toolbar-group speed-control">
          <span className="toolbar-label">Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="speed-slider-inline"
            disabled={isRunning}
          />
          <span className="speed-value-inline">{animationSpeed}</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="✏️ Edit Maze"
      >
        <div className="settings-section">
          <h3>Edit Mode</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '16px' }}>
            Select a mode, then click on the maze grid to make changes
          </p>
          <div className="btn-group" style={{ flexDirection: 'column' }}>
            <button
              onClick={() => {
                onEditModeChange(EditMode.TOGGLE_WALL);
                setShowEditModal(false);
              }}
              className={`btn ${editMode === EditMode.TOGGLE_WALL ? 'btn-primary' : 'btn-secondary'}`}
            >
              🧱 Toggle Wall
            </button>
            
            <button
              onClick={() => {
                onEditModeChange(EditMode.SET_START);
                setShowEditModal(false);
              }}
              className={`btn ${editMode === EditMode.SET_START ? 'btn-primary' : 'btn-secondary'}`}
            >
              🟢 Set Start Position
            </button>
            
            <button
              onClick={() => {
                onEditModeChange(EditMode.SET_GOAL);
                setShowEditModal(false);
              }}
              className={`btn ${editMode === EditMode.SET_GOAL ? 'btn-primary' : 'btn-secondary'}`}
            >
              🎯 Set Goal Position
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Current Mode</h3>
          <div style={{ 
            padding: '12px', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#3b82f6',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {editMode === EditMode.TOGGLE_WALL && '🧱 Toggle Wall Mode'}
            {editMode === EditMode.SET_START && '🟢 Set Start Mode'}
            {editMode === EditMode.SET_GOAL && '🎯 Set Goal Mode'}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Controls;

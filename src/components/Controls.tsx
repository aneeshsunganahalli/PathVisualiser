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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="control-panel">
        {/* Algorithm Selection */}
        <div className="control-section">
          <h3>Select Algorithm</h3>
          <div className="btn-group">
            {Object.values(Algorithm).map((algo) => (
              <button
                key={algo}
                onClick={() => onAlgorithmSelect(algo)}
                disabled={isRunning}
                className={`btn ${selectedAlgorithm === algo ? 'btn-primary' : 'btn-secondary'}`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Run Controls */}
        <div className="control-section">
          <h3>Execution</h3>
          <div className="btn-group">
            <button
              onClick={onRunAlgorithm}
              disabled={!selectedAlgorithm || isRunning}
              className="btn btn-success"
              style={{ flex: '1 1 100%' }}
            >
              {isRunning ? '⚡ Running...' : `▶ Run ${selectedAlgorithm || 'Algorithm'}`}
            </button>
            
            <button
              onClick={onRunComparison}
              disabled={isRunning}
              className="btn btn-warning"
              style={{ flex: '1 1 100%' }}
            >
              🔄 Compare All (3 Colors)
            </button>
            
            <button
              onClick={onResetVisualization}
              disabled={isRunning}
              className="btn btn-danger"
            >
              ⟲ Reset
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="control-section">
          <h3>Quick Actions</h3>
          <div className="btn-group">
            <button
              onClick={() => setShowSettingsModal(true)}
              disabled={isRunning}
              className="btn btn-primary"
            >
              ⚙️ Settings
            </button>
            
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isRunning}
              className="btn btn-primary"
            >
              ✏️ Edit Maze
            </button>
          </div>
        </div>

        {/* Legend - Concurrent Mode Colors */}
        <div className="control-section">
          <h3>Concurrent Mode Legend</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '10px', 
            fontSize: '0.875rem',
            color: '#d1d5db'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ef4444',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
              }} />
              <span>DFS (Red)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }} />
              <span>BFS (Blue)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#10b981',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
              }} />
              <span>A* (Green)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#8b5cf6',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
              }} />
              <span>Overlap (Purple)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        title="⚙️ Settings"
      >
        <div className="settings-section">
          <h3>Animation Speed</h3>
          <div className="speed-slider-container">
            <span className="speed-slider-label">Slow</span>
            <input
              type="range"
              min="1"
              max="100"
              value={animationSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="speed-slider"
            />
            <span className="speed-slider-label">Fast</span>
            <span className="speed-value">{animationSpeed}</span>
          </div>
        </div>

        <div className="settings-section">
          <h3>Maze Controls</h3>
          <div className="btn-group">
            <button
              onClick={() => {
                onGenerateMaze();
                setShowSettingsModal(false);
              }}
              className="btn btn-primary"
              style={{ flex: '1' }}
            >
              🎲 Generate New Maze
            </button>
            
            <button
              onClick={() => {
                onClearMaze();
                setShowSettingsModal(false);
              }}
              className="btn btn-secondary"
              style={{ flex: '1' }}
            >
              🗑️ Clear Maze
            </button>
          </div>
        </div>
      </Modal>

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

/**
 * MetricsPanel component - Display algorithm performance metrics
 */

import React from 'react';
import { AlgorithmResult } from '../types/maze.types';

interface MetricsPanelProps {
  results: AlgorithmResult[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="metrics-panel">
        <h2 className="metrics-header">Metrics</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">
            Run an algorithm to see<br />performance metrics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-panel">
      <h2 className="metrics-header">Algorithm Metrics</h2>
      
      {results.map((result, index) => (
        <div key={index} className="metric-card">
          <div className="metric-card-header">
            <h3 className="metric-card-title">{result.algorithmName}</h3>
            <span className={`metric-badge ${result.isOptimal ? 'badge-optimal' : 'badge-suboptimal'}`}>
              {result.isOptimal ? '✓ Optimal' : '⚠ Sub-optimal'}
            </span>
          </div>
          
          <div className="metric-grid">
            <div className="metric-item">
              <div className="metric-label">Path Found</div>
              <div className={`metric-value ${result.found ? 'metric-value-success' : 'metric-value-danger'}`}>
                {result.found ? 'Yes' : 'No'}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-label">Nodes Expanded</div>
              <div className="metric-value">
                {result.nodesExpanded.toLocaleString()}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-label">Path Length</div>
              <div className="metric-value">
                {result.pathLength > 0 ? result.pathLength.toLocaleString() : 'N/A'}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-label">Time Taken</div>
              <div className="metric-value metric-value-success">
                {result.timeTaken.toFixed(2)} ms
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Comparison Analysis */}
      {results.length > 1 && (
        <div className="analysis-section">
          <h3 className="analysis-title">📊 Comparative Analysis</h3>
          
          {(() => {
            const successfulResults = results.filter(r => r.found);
            if (successfulResults.length === 0) {
              return (
                <p className="analysis-content" style={{ margin: 0 }}>
                  No paths were found by any algorithm.
                </p>
              );
            }

            const minNodes = Math.min(...successfulResults.map(r => r.nodesExpanded));
            const mostEfficient = successfulResults.find(r => r.nodesExpanded === minNodes);
            
            const optimalResults = successfulResults.filter(r => r.isOptimal);
            const shortestPath = optimalResults.length > 0 
              ? Math.min(...optimalResults.map(r => r.pathLength))
              : null;

            const fastestResult = successfulResults.reduce((prev, current) => 
              current.timeTaken < prev.timeTaken ? current : prev
            );

            return (
              <div className="analysis-content">
                <p style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#3b82f6' }}>Most Efficient:</strong>{' '}
                  {mostEfficient?.algorithmName} explored only{' '}
                  <strong>{minNodes.toLocaleString()}</strong> nodes
                </p>
                
                {shortestPath !== null && (
                  <p style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#10b981' }}>Optimal Path Length:</strong>{' '}
                    <strong>{shortestPath}</strong> steps
                    {' '}(Found by: {optimalResults.map(r => r.algorithmName).join(', ')})
                  </p>
                )}

                <p style={{ marginBottom: '16px' }}>
                  <strong style={{ color: '#f59e0b' }}>Fastest Execution:</strong>{' '}
                  {fastestResult.algorithmName} completed in{' '}
                  <strong>{fastestResult.timeTaken.toFixed(2)} ms</strong>
                </p>
                
                <div style={{ 
                  paddingTop: '12px', 
                  borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                  marginTop: '4px'
                }}>
                  <p style={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#9ca3af'
                  }}>
                    KEY INSIGHTS
                  </p>
                  <ul className="insight-list">
                    <li>
                      <strong>DFS</strong> explores deeply but doesn't guarantee the shortest path
                    </li>
                    <li>
                      <strong>BFS</strong> guarantees the shortest path but explores more nodes
                    </li>
                    <li>
                      <strong>A*</strong> uses heuristics (Manhattan distance) to find optimal paths efficiently
                    </li>
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;

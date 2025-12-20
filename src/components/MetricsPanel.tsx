/**
 * MetricsPanel component - Display algorithm performance metrics
 */

import React from 'react';
import { AlgorithmResult } from '../types/maze.types';

interface MetricsPanelProps {
  results: AlgorithmResult[];
  showAnalysis?: boolean;
  metricsOnly?: boolean;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ results, showAnalysis = true, metricsOnly = true }) => {
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

  // Only show analysis section
  if (!metricsOnly && showAnalysis) {
    const successfulResults = results.filter(r => r.found);
    if (successfulResults.length === 0) {
      return null;
    }

    const minNodes = Math.min(...successfulResults.map(r => r.nodesExpanded));
    const mostEfficient = successfulResults.find(r => r.nodesExpanded === minNodes);
    
    const optimalResults = successfulResults.filter(r => r.isOptimal);
    const shortestPath = optimalResults.length > 0 
      ? Math.min(...optimalResults.map(r => r.pathLength))
      : null;

    const fastestTime = Math.min(...successfulResults.map(r => r.timeTaken));

    return (
      <div className="analysis-section-full">
        <h3 className="analysis-title">📊 Comparative Analysis</h3>
        <div className="analysis-content">
          <p style={{ marginTop: '12px', marginBottom: '12px' }}>
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

          {/* Speed Comparison */}
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#f59e0b' }}>Speed Comparison:</strong>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {successfulResults.map((result) => {
                const speedRatio = result.timeTaken / fastestTime;
                const percentage = ((speedRatio - 1) * 100);
                const isFastest = speedRatio === 1;
                
                return (
                  <div 
                    key={result.algorithmName}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '0.875rem'
                    }}
                  >
                    <span style={{ minWidth: '60px', fontWeight: 600 }}>
                      {result.algorithmName}:
                    </span>
                    <div style={{
                      flex: 1,
                      height: '20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, (speedRatio / Math.max(...successfulResults.map(r => r.timeTaken / fastestTime))) * 100)}%`,
                        background: isFastest 
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #3b82f6, #2563eb)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ 
                      minWidth: '80px', 
                      textAlign: 'right',
                      color: isFastest ? '#10b981' : '#9ca3af',
                      fontWeight: isFastest ? 700 : 400
                    }}>
                      {isFastest ? '⚡ Fastest' : `+${percentage.toFixed(0)}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
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
      </div>
    );
  }

  return (
    <div className="metrics-panel">
      <h2 className="metrics-header">Metrics</h2>
      
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
              <div className="metric-label">Operations</div>
              <div className="metric-value metric-value-success">
                {result.nodesExpanded + result.pathLength}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;

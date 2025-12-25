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

// Algorithm color mapping for consistent visual identity
const algorithmColors: Record<string, string> = {
  'DFS': '#f97316',
  'BFS': '#3b82f6',
  'A*': '#22c55e',
};

const MetricsPanel: React.FC<MetricsPanelProps> = ({ results, showAnalysis = true, metricsOnly = true }) => {
  if (results.length === 0) {
    return (
      <div className="metrics-panel">
        <h2 className="metrics-header">Metrics</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📈</div>
          <p className="empty-state-text">
            Run an algorithm to see<br />performance metrics
          </p>
        </div>
      </div>
    );
  }

  // Only show analysis section (for comparison mode)
  if (!metricsOnly && showAnalysis) {
    const successfulResults = results.filter(r => r.found);
    if (successfulResults.length === 0) {
      return (
        <div className="analysis-section-full">
          <h3 className="analysis-title">📊 Comparative Analysis</h3>
          <div className="analysis-content">
            <p style={{ color: '#ef4444', fontWeight: 600 }}>No algorithm found a path to the goal.</p>
          </div>
        </div>
      );
    }

    // Calculate metrics
    const minNodes = Math.min(...successfulResults.map(r => r.nodesExpanded));
    const maxNodes = Math.max(...successfulResults.map(r => r.nodesExpanded));
    const mostEfficient = successfulResults.find(r => r.nodesExpanded === minNodes);
    const leastEfficient = successfulResults.find(r => r.nodesExpanded === maxNodes);
    
    const optimalResults = successfulResults.filter(r => r.isOptimal);
    const shortestPath = Math.min(...successfulResults.map(r => r.pathLength));
    const longestPath = Math.max(...successfulResults.map(r => r.pathLength));
    
    const fastestTime = Math.min(...successfulResults.map(r => r.timeTaken));
    const slowestTime = Math.max(...successfulResults.map(r => r.timeTaken));
    const fastestAlgo = successfulResults.find(r => r.timeTaken === fastestTime);

    // Calculate efficiency ratio (nodes expanded vs path length)
    const getEfficiencyRatio = (r: AlgorithmResult) => r.pathLength > 0 ? r.nodesExpanded / r.pathLength : Infinity;
    const efficiencyRatios = successfulResults.map(r => ({ name: r.algorithmName, ratio: getEfficiencyRatio(r) }));
    efficiencyRatios.sort((a, b) => a.ratio - b.ratio);

    return (
      <div className="analysis-section-full">
        <h3 className="analysis-title">📊 Comparative Analysis</h3>
        <div className="analysis-content">
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Fastest to Goal */}
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                ⚡ Fastest to Goal
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: algorithmColors[fastestAlgo?.algorithmName || 'A*'] }}>
                {fastestAlgo?.algorithmName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '4px' }}>
                {(fastestTime / 1000).toFixed(2)}s
              </div>
            </div>

            {/* Most Efficient */}
            <div style={{ 
              background: 'rgba(249, 115, 22, 0.1)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid rgba(249, 115, 22, 0.3)'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                🎯 Most Efficient
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: algorithmColors[mostEfficient?.algorithmName || 'DFS'] }}>
                {mostEfficient?.algorithmName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '4px' }}>
                {minNodes.toLocaleString()} nodes
              </div>
            </div>

            {/* Shortest Path */}
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                📏 Shortest Path
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3b82f6' }}>
                {shortestPath} steps
              </div>
              <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '4px' }}>
                by {successfulResults.filter(r => r.pathLength === shortestPath).map(r => r.algorithmName).join(', ')}
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 600 }}>
              Detailed Comparison
            </div>
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              borderRadius: '10px', 
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              {/* Header */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', 
                gap: '8px', 
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div>Algo</div>
                <div>Time</div>
                <div>Nodes</div>
                <div>Path</div>
                <div>Efficiency</div>
              </div>
              {/* Rows */}
              {successfulResults.map((result, idx) => {
                const efficiency = getEfficiencyRatio(result);
                const timePercent = ((result.timeTaken - fastestTime) / fastestTime * 100);
                const nodesPercent = ((result.nodesExpanded - minNodes) / minNodes * 100);
                
                return (
                  <div key={idx} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', 
                    gap: '8px', 
                    padding: '12px 16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ fontWeight: 700, color: algorithmColors[result.algorithmName] }}>
                      {result.algorithmName}
                    </div>
                    <div style={{ color: result.timeTaken === fastestTime ? '#22c55e' : '#d1d5db' }}>
                      {(result.timeTaken / 1000).toFixed(2)}s
                      {result.timeTaken !== fastestTime && (
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', marginLeft: '4px' }}>
                          +{timePercent.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div style={{ color: result.nodesExpanded === minNodes ? '#22c55e' : '#d1d5db' }}>
                      {result.nodesExpanded.toLocaleString()}
                      {result.nodesExpanded !== minNodes && (
                        <span style={{ fontSize: '0.7rem', color: '#f59e0b', marginLeft: '4px' }}>
                          +{nodesPercent.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div style={{ color: result.pathLength === shortestPath ? '#22c55e' : '#f59e0b' }}>
                      {result.pathLength}
                      {result.pathLength !== shortestPath && (
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', marginLeft: '4px' }}>
                          +{result.pathLength - shortestPath}
                        </span>
                      )}
                    </div>
                    <div style={{ color: efficiency === efficiencyRatios[0].ratio ? '#22c55e' : '#9ca3af' }}>
                      {efficiency.toFixed(1)}x
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Bars */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 600 }}>
              Nodes Explored Comparison
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {successfulResults.map((result) => {
                const percentage = (result.nodesExpanded / maxNodes) * 100;
                const color = algorithmColors[result.algorithmName] || '#3b82f6';
                
                return (
                  <div key={result.algorithmName} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ minWidth: '40px', fontWeight: 700, color, fontSize: '0.85rem' }}>
                      {result.algorithmName}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.8rem', color: '#9ca3af' }}>
                      {result.nodesExpanded}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Key Insights */}
          <div style={{ 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <p style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700,
              marginBottom: '12px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Key Insights
            </p>
            <ul className="insight-list">
              {mostEfficient?.algorithmName === 'A*' && (
                <li>
                  <strong style={{ color: '#22c55e' }}>A*</strong> was most efficient, exploring {((1 - minNodes/maxNodes) * 100).toFixed(0)}% fewer nodes than {leastEfficient?.algorithmName}
                </li>
              )}
              {shortestPath !== longestPath && (
                <li>
                  <strong style={{ color: '#f97316' }}>DFS</strong> found a path {longestPath - shortestPath} steps longer than the optimal
                </li>
              )}
              {optimalResults.length > 0 && (
                <li>
                  <strong style={{ color: '#3b82f6' }}>{optimalResults.map(r => r.algorithmName).join(' & ')}</strong> {optimalResults.length === 1 ? 'guarantees' : 'guarantee'} the shortest path
                </li>
              )}
              <li>
                Efficiency ratio = nodes explored / path length (lower is better)
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
      
      {results.map((result, index) => {
        const color = algorithmColors[result.algorithmName] || '#3b82f6';
        
        return (
          <div 
            key={index} 
            className="metric-card"
            style={{ '--card-accent': color } as React.CSSProperties}
          >
            <div className="metric-card-header">
              <h3 className="metric-card-title" style={{ color }}>
                {result.algorithmName === 'DFS' && '🔴'} 
                {result.algorithmName === 'BFS' && '🔵'} 
                {result.algorithmName === 'A*' && '🟢'} 
                {' '}{result.algorithmName}
              </h3>
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
                <div className="metric-label">Time</div>
                <div className="metric-value" style={{ color }}>
                  {(result.timeTaken / 1000).toFixed(2)}s
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsPanel;

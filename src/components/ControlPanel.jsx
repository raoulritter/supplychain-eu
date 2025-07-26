import './ControlPanel.css'

function ControlPanel({ 
  selectedMaterial, 
  setSelectedMaterial, 
  activeDisruption, 
  setActiveDisruption,
  timeline = 0,
  setTimeline,
  bottleneckMode = false,
  setBottleneckMode 
}) {
  const materials = [
    { id: 'all', name: 'All Materials', color: '#ffffff' },
    { id: 'lithium', name: 'Lithium (Battery)', color: 'var(--color-lithium)' },
    { id: 'cobalt', name: 'Cobalt (Battery)', color: 'var(--color-cobalt)' },
    { id: 'rare-earth', name: 'Rare Earths (Wind)', color: 'var(--color-rare-earth)' },
    { id: 'nickel', name: 'Nickel (Battery)', color: '#8b5cf6' },
    { id: 'polysilicon', name: 'Polysilicon (Solar)', color: '#06b6d4' }
  ]

  const disruptions = [
    { id: 'suez', name: 'Block Suez Canal', icon: '🚫', description: 'Reroute via Africa (+21 days)' },
    { id: 'rotterdam', name: 'Close Rotterdam Port', icon: '⚓', description: 'Redirect to Hamburg' },
    { id: 'china-ban', name: 'China Export Ban', icon: '🛑', description: 'Critical supply disruption' }
  ]

  const handleDisruption = (disruptionId) => {
    setActiveDisruption(activeDisruption === disruptionId ? null : disruptionId)
  }

  return (
    <div className="control-panel">
      <h2>🇪🇺 EU Energy Independence</h2>
      
      {/* Analysis Mode Toggle */}
      <div className="control-section">
        <h3>Analysis Mode</h3>
        <div className="analysis-toggle">
          <button
            className={`analysis-btn ${!bottleneckMode ? 'active' : ''}`}
            onClick={() => setBottleneckMode && setBottleneckMode(false)}
          >
            🌍 Normal View
          </button>
          <button
            className={`analysis-btn ${bottleneckMode ? 'active warning' : ''}`}
            onClick={() => setBottleneckMode && setBottleneckMode(true)}
          >
            ⚠️ Bottleneck Analysis
          </button>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="control-section">
        <h3>Timeline Projection</h3>
        <div className="timeline-control">
          <div className="timeline-header">
            <span className="timeline-label">Now</span>
            <span className="timeline-value">{timeline} months ahead</span>
            <span className="timeline-label">24mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            value={timeline}
            onChange={(e) => setTimeline && setTimeline(parseInt(e.target.value))}
            className="timeline-slider"
          />
          <div className="timeline-markers">
            <span>0</span>
            <span>6</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
          </div>
        </div>
      </div>
      
      <div className="control-section">
        <h3>Materials</h3>
        <div className="material-filters">
          {materials.map(material => (
            <button
              key={material.id}
              className={`material-btn ${selectedMaterial === material.id ? 'active' : ''}`}
              onClick={() => setSelectedMaterial(material.id)}
              style={{ '--material-color': material.color }}
            >
              <span className="material-indicator" />
              {material.name}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Disruption Scenarios</h3>
        <div className="disruption-controls">
          {disruptions.map(disruption => (
            <button
              key={disruption.id}
              className={`disruption-btn ${activeDisruption === disruption.id ? 'active danger' : ''}`}
              onClick={() => handleDisruption(disruption.id)}
              title={disruption.description}
            >
              <span className="disruption-icon">{disruption.icon}</span>
              <div className="disruption-content">
                <div className="disruption-name">{disruption.name}</div>
                <div className="disruption-description">{disruption.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeDisruption && (
        <button 
          className="reset-btn"
          onClick={() => setActiveDisruption(null)}
        >
          Reset Scenario
        </button>
      )}

      {/* Bottleneck Legend */}
      {bottleneckMode && (
        <div className="control-section bottleneck-legend">
          <h3>Bottleneck Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-indicator critical-port"></span>
              <span>Critical EU Ports</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator high-risk-source"></span>
              <span>High-Risk Sources</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator critical-facility"></span>
              <span>Critical EU Facilities</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
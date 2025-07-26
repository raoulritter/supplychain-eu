import './ControlPanel.css'

function ControlPanel({ selectedMaterial, setSelectedMaterial, activeDisruption, setActiveDisruption }) {
  const materials = [
    { id: 'all', name: 'All Materials', color: '#ffffff' },
    { id: 'lithium', name: 'Lithium', color: 'var(--color-lithium)' },
    { id: 'cobalt', name: 'Cobalt', color: 'var(--color-cobalt)' },
    { id: 'rare-earth', name: 'Rare Earths', color: 'var(--color-rare-earth)' }
  ]

  const disruptions = [
    { id: 'suez', name: 'Block Suez Canal', icon: '🚫' },
    { id: 'rotterdam', name: 'Close Rotterdam Port', icon: '⚓' },
    { id: 'china-ban', name: 'China Export Ban', icon: '🛑' }
  ]

  const handleDisruption = (disruptionId) => {
    setActiveDisruption(activeDisruption === disruptionId ? null : disruptionId)
  }

  return (
    <div className="control-panel">
      <h2>Supply Chain Control</h2>
      
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
            >
              <span className="disruption-icon">{disruption.icon}</span>
              {disruption.name}
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
    </div>
  )
}

export default ControlPanel
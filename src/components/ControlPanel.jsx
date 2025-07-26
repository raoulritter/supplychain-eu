import './ControlPanel.css'

function ControlPanel({ selectedMaterial, setSelectedMaterial, activeDisruption, setActiveDisruption }) {
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
    </div>
  )
}

export default ControlPanel
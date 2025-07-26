import './StatusDashboard.css'

function StatusDashboard({ shipments, activeDisruption }) {
  const materials = [
    { id: 'lithium', name: 'Lithium', daysSupply: 45, color: 'var(--color-lithium)' },
    { id: 'cobalt', name: 'Cobalt', daysSupply: 32, color: 'var(--color-cobalt)' },
    { id: 'rare-earth', name: 'Rare Earths', daysSupply: 28, color: 'var(--color-rare-earth)' }
  ]

  const ports = [
    { name: 'Rotterdam', congestion: 75 },
    { name: 'Hamburg', congestion: 45 },
    { name: 'Antwerp', congestion: 60 }
  ]

  const getDisruptionImpact = () => {
    if (!activeDisruption) return null

    const impacts = {
      suez: { transitTime: '+21 days', affectedShips: 12, costIncrease: '+35%' },
      rotterdam: { transitTime: '+7 days', affectedShips: 8, costIncrease: '+15%' },
      'china-ban': { transitTime: 'N/A', affectedShips: 15, costIncrease: '+120%' }
    }

    return impacts[activeDisruption]
  }

  const impact = getDisruptionImpact()

  return (
    <div className="status-dashboard">
      <div className="status-section">
        <h3>Active Shipments</h3>
        <div className="shipment-count">24</div>
      </div>

      <div className="status-section">
        <h3>Material Supply</h3>
        <div className="material-supply">
          {materials.map(material => (
            <div key={material.id} className="supply-item">
              <div className="supply-header">
                <span className="material-name">{material.name}</span>
                <span className="days-count">{material.daysSupply} days</span>
              </div>
              <div className="supply-bar">
                <div 
                  className="supply-fill"
                  style={{ 
                    width: `${material.daysSupply / 60 * 100}%`,
                    backgroundColor: material.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-section">
        <h3>Port Congestion</h3>
        <div className="port-status">
          {ports.map(port => (
            <div key={port.name} className="port-item">
              <span className="port-name">{port.name}</span>
              <div className="congestion-bar">
                <div 
                  className="congestion-fill"
                  style={{ 
                    width: `${port.congestion}%`,
                    backgroundColor: port.congestion > 70 ? 'var(--color-danger)' : 
                                    port.congestion > 50 ? 'var(--color-rare-earth)' : 
                                    'var(--color-lithium)'
                  }}
                />
              </div>
              <span className="congestion-percent">{port.congestion}%</span>
            </div>
          ))}
        </div>
      </div>

      {impact && (
        <div className="status-section disruption-impact">
          <h3>Disruption Impact</h3>
          <div className="impact-metrics">
            <div className="impact-item">
              <span className="impact-label">Transit Time</span>
              <span className="impact-value">{impact.transitTime}</span>
            </div>
            <div className="impact-item">
              <span className="impact-label">Affected Ships</span>
              <span className="impact-value">{impact.affectedShips}</span>
            </div>
            <div className="impact-item">
              <span className="impact-label">Cost Impact</span>
              <span className="impact-value">{impact.costIncrease}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusDashboard
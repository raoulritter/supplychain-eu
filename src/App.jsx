import Globe from './components/Globe'
import ControlPanel from './components/ControlPanel'
import StatusDashboard from './components/StatusDashboard'
import { useState } from 'react'
import './App.css'

function App() {
  const [selectedMaterial, setSelectedMaterial] = useState('all')
  const [activeDisruption, setActiveDisruption] = useState(null)
  const [shipments, setShipments] = useState([])

  return (
    <div className="app">
      <Globe 
        selectedMaterial={selectedMaterial}
        activeDisruption={activeDisruption}
        shipments={shipments}
      />
      
      <ControlPanel 
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        activeDisruption={activeDisruption}
        setActiveDisruption={setActiveDisruption}
      />
      
      <StatusDashboard 
        shipments={shipments}
        activeDisruption={activeDisruption}
      />
    </div>
  )
}

export default App

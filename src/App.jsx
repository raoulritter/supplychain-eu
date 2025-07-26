import Globe from './components/Globe'
import ControlPanel from './components/ControlPanel'
import StatusDashboard from './components/StatusDashboard'
import { useState } from 'react'
import './App.css'

function App() {
  const [selectedMaterial, setSelectedMaterial] = useState('all')
  const [activeDisruption, setActiveDisruption] = useState(null)
  const [shipments, setShipments] = useState([])
  const [timeline, setTimeline] = useState(0)
  const [bottleneckMode, setBottleneckMode] = useState(false)

  return (
    <div className="app">
      <Globe 
        selectedMaterial={selectedMaterial}
        activeDisruption={activeDisruption}
        shipments={shipments}
        timeline={timeline}
        bottleneckMode={bottleneckMode}
      />
      
      <ControlPanel 
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        activeDisruption={activeDisruption}
        setActiveDisruption={setActiveDisruption}
        timeline={timeline}
        setTimeline={setTimeline}
        bottleneckMode={bottleneckMode}
        setBottleneckMode={setBottleneckMode}
      />
      
      <StatusDashboard 
        shipments={shipments}
        activeDisruption={activeDisruption}
        bottleneckMode={bottleneckMode}
        timeline={timeline}
      />
    </div>
  )
}

export default App

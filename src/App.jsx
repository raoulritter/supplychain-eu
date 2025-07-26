import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
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
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4169E1" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade />
        <Globe 
          selectedMaterial={selectedMaterial}
          activeDisruption={activeDisruption}
          shipments={shipments}
        />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      
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

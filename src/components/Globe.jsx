import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere } from '@react-three/drei'

function Globe({ selectedMaterial, activeDisruption, shipments }) {
  const globeRef = useRef()
  
  // Create Earth texture procedurally
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 2048
    canvas.height = 1024
    
    // Ocean background
    ctx.fillStyle = '#0a1929'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, 'rgba(30, 58, 95, 0.8)')
    oceanGradient.addColorStop(0.5, 'rgba(12, 31, 61, 0.9)')
    oceanGradient.addColorStop(1, 'rgba(30, 58, 95, 0.8)')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Function to draw landmass
    const drawLandmass = (x, y, width, height, color = '#2d4a2d') => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(x, y, width, height, 10)
      ctx.fill()
      
      // Add some texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.beginPath()
      ctx.roundRect(x + 5, y + 5, width - 10, height - 10, 8)
      ctx.fill()
    }
    
    // Europe (centered for our view)
    drawLandmass(950, 320, 180, 120, '#3a5f3a')
    
    // Africa
    drawLandmass(980, 450, 120, 200, '#4a6b4a')
    
    // Asia
    drawLandmass(1120, 280, 350, 200, '#3a5f3a')
    
    // Middle East
    drawLandmass(1100, 380, 80, 80, '#5a7b5a')
    
    // India
    drawLandmass(1250, 480, 80, 100, '#4a6b4a')
    
    // North America
    drawLandmass(200, 300, 300, 250, '#3a5f3a')
    
    // South America  
    drawLandmass(300, 560, 200, 300, '#4a6b4a')
    
    // Australia
    drawLandmass(1550, 550, 150, 100, '#5a7b5a')
    
    // Greenland
    drawLandmass(700, 200, 100, 80, '#6a8b6a')
    
    // Add some islands
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 20 + 5
      ctx.fillStyle = '#4a6b4a'
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      <Sphere ref={globeRef} args={[1.5, 64, 32]}>
        <meshPhongMaterial 
          map={earthTexture}
          bumpScale={0.05}
          specular={new THREE.Color('#1e3a5f')}
          shininess={25}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.53, 64, 32]} />
        <meshBasicMaterial 
          color="#4169E1"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Extra glow layer */}
      <mesh>
        <sphereGeometry args={[1.56, 64, 32]} />
        <meshBasicMaterial 
          color="#60a5fa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export default Globe
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import ThreeGlobe from 'three-globe'

function Globe({ selectedMaterial, activeDisruption, shipments }) {
  const globeRef = useRef()
  const [globeData, setGlobeData] = useState(null)
  const { scene } = useThree()

  useEffect(() => {
    // Create the globe
    const globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#3a82f6')
      .atmosphereAltitude(0.1)

    // Set initial position and scale
    globe.scale.set(0.01, 0.01, 0.01)

    // Add ports as points on the globe
    const ports = [
      { name: 'Rotterdam', lat: 51.9244, lng: 4.4777, color: '#60a5fa' },
      { name: 'Hamburg', lat: 53.5511, lng: 9.9937, color: '#60a5fa' },
      { name: 'Antwerp', lat: 51.2194, lng: 4.4025, color: '#60a5fa' },
      { name: 'Marseille', lat: 43.2965, lng: 5.3698, color: '#60a5fa' },
      { name: 'Valencia', lat: 39.4699, lng: -0.3763, color: '#60a5fa' }
    ]

    // Add material sources
    const sources = [
      { name: 'Chile (Lithium)', lat: -30.0, lng: -71.0, color: '#4ade80' },
      { name: 'Australia (Lithium)', lat: -25.0, lng: 133.0, color: '#4ade80' },
      { name: 'DRC (Cobalt)', lat: -4.0383, lng: 21.7587, color: '#60a5fa' },
      { name: 'China (Rare Earths)', lat: 35.8617, lng: 104.1954, color: '#fb923c' }
    ]

    const allPoints = [...ports, ...sources]

    globe
      .pointsData(allPoints)
      .pointAltitude(0.01)
      .pointColor('color')
      .pointRadius(0.5)
      .pointResolution(12)

    // Add arcs for trade routes
    const arcs = [
      { startLat: -30.0, startLng: -71.0, endLat: 51.9244, endLng: 4.4777, color: '#4ade80' },
      { startLat: -25.0, startLng: 133.0, endLat: 51.9244, endLng: 4.4777, color: '#4ade80' },
      { startLat: -4.0383, startLng: 21.7587, endLat: 51.9244, endLng: 4.4777, color: '#60a5fa' },
      { startLat: 35.8617, startLng: 104.1954, endLat: 53.5511, endLng: 9.9937, color: '#fb923c' }
    ]

    globe
      .arcsData(arcs)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(1500)
      .arcStroke(0.5)

    globeRef.current = globe
    setGlobeData(globe)

    return () => {
      if (globeRef.current) {
        scene.remove(globeRef.current)
      }
    }
  }, [scene])

  useEffect(() => {
    if (globeRef.current) {
      scene.add(globeRef.current)
    }
  }, [globeData, scene])

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1
    }
  })

  // Handle disruptions
  useEffect(() => {
    if (globeRef.current && activeDisruption) {
      if (activeDisruption === 'suez') {
        // Add alternative route around Africa
        const alternativeArcs = [
          {
            startLat: 35.8617,
            startLng: 104.1954,
            endLat: 51.9244,
            endLng: 4.4777,
            color: '#ef4444',
            // Add waypoints for route around Africa
            waypoints: [
              { lat: 1.3521, lng: 103.8198 }, // Singapore
              { lat: -34.9285, lng: 18.4241 }, // Cape Town
              { lat: 36.8065, lng: -5.3168 }, // Gibraltar
            ]
          }
        ]

        globeRef.current.arcsData([...globeRef.current.arcsData(), ...alternativeArcs])
      }
    }
  }, [activeDisruption])

  return null
}

export default Globe
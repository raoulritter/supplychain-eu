import { useEffect, useRef, useState } from 'react'
import Globe from 'globe.gl'
import { 
  fetchMaterialSources, 
  fetchEUManufacturingFacilities, 
  fetchEUPorts, 
  fetchSupplyRoutes 
} from '../services/euEnergyService.js'

function GlobeComponent({ selectedMaterial, activeDisruption, shipments, timeline = 0, bottleneckMode = false }) {
  const mountRef = useRef()
  const globeRef = useRef()
  const [locations, setLocations] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  const loadData = async () => {
    try {
      setLoading(true)
      const [sources, facilities, ports, supplyRoutes] = await Promise.all([
        fetchMaterialSources(),
        fetchEUManufacturingFacilities(), 
        fetchEUPorts(),
        fetchSupplyRoutes()
      ])

      // Combine all locations - manufacturing facilities have different structure
      const allLocations = [
        ...(sources || []),
        ...(facilities || []).map(f => ({
          ...f,
          type: f.facility_type,
          capacity: f.output_capacity,
          eu_strategic_importance: f.eu_strategic_importance
        })),
        ...(ports || [])
      ]

      // Transform data for globe visualization
      const transformedLocations = allLocations.map(location => ({
        name: location.name,
        lat: Number(location.lat),
        lng: Number(location.lng),
        size: getLocationSize(location),
        color: getLocationColor(location),
        type: location.type || location.facility_type,
        country: location.country,
        region: location.region,
        capacity: location.capacity || location.output_capacity,
        importance: location.eu_strategic_importance || location.strategic_importance || 1,
        isBottleneck: isBottleneck(location) // Add bottleneck flag for filtering
      }))

      setLocations(transformedLocations)
      setRoutes(supplyRoutes || [])
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to sample data if Supabase fails
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }

  // Identify critical bottlenecks
  const isBottleneck = (location) => {
    const locationType = location.type || location.facility_type
    
    // EU ports are critical bottlenecks
    if (locationType === 'port' && (location.is_eu_facility || location.region === 'EU')) {
      return true
    }
    
    // High-risk source dependencies (>60% EU dependency)
    if (location.country === 'China' || location.country === 'DRC') {
      return true
    }
    
    // Major EU manufacturing with high strategic importance
    if ((location.is_eu_facility || location.region === 'EU') && 
        (location.eu_strategic_importance || location.strategic_importance || 0) >= 9) {
      return true
    }
    
    return false
  }

  // Calculate size based on capacity and strategic importance - FIXED for no overlap
  const getLocationSize = (location) => {
    const baseSize = 0.3 // Reduced base size to prevent overlap
    const importanceMultiplier = (location.eu_strategic_importance || 1) * 0.1 // Reduced multiplier
    
    // More controlled capacity scaling to prevent huge differences
    let capacityMultiplier = 0.2
    if (location.capacity) {
      // Use logarithmic scaling to prevent massive size differences
      capacityMultiplier = Math.min(Math.log(location.capacity / 1000) * 0.1, 0.6)
    }
    
    // Subtle bottleneck emphasis without making them massive
    const bottleneckMultiplier = isBottleneck(location) ? 1.2 : 1
    
    // Ensure size stays within reasonable bounds (0.3 to 1.2)
    const finalSize = (baseSize + importanceMultiplier + capacityMultiplier) * bottleneckMultiplier
    return Math.max(0.3, Math.min(finalSize, 1.2))
  }

  // Color based on location type and risk level with bottleneck highlighting
  const getLocationColor = (location) => {
    const locationType = location.type || location.facility_type
    
    // Override with bottleneck colors if this is a critical bottleneck
    if (isBottleneck(location)) {
      if (locationType === 'port') {
        return '#ef4444' // Bright red for critical port bottlenecks
      }
      
      if (location.country === 'China' || location.country === 'DRC') {
        return '#dc2626' // Dark red for high-risk dependencies
      }
      
      if ((location.is_eu_facility || location.region === 'EU') && 
          (location.eu_strategic_importance || location.strategic_importance || 0) >= 9) {
        return '#f97316' // Orange for critical EU facilities
      }
    }
    
    // Standard colors for non-bottleneck locations
    switch (locationType) {
      case 'battery_plant':
      case 'solar_facility':
      case 'wind_facility':
      case 'processing_plant':
        return '#22c55e' // Green for EU manufacturing
      case 'port':
        return '#60a5fa' // Blue for EU ports
      case 'source':
        // Color by region/risk level
        if (location.region === 'EU' || location.is_eu_facility) return '#10b981' // EU domestic sources (green)
        if (location.country === 'Australia' || location.country === 'Canada') return '#f59e0b' // Allied nations (yellow)
        if (location.country === 'China') return '#ef4444' // High risk (red)
        return '#fb923c' // Other sources (orange)
      default:
        return '#94a3b8' // Gray default
    }
  }

  // Color routes based on risk level and material
  const getRouteColor = (route) => {
    const riskColors = {
      'low': '#22c55e',      // Green
      'moderate': '#f59e0b', // Yellow  
      'high': '#fb923c',     // Orange
      'very_high': '#ef4444' // Red
    }
    return riskColors[route.risk_level] || '#94a3b8'
  }

  // Calculate route thickness based on volume and criticality - FIXED for visibility
  const getRouteThickness = (route) => {
    const baseThickness = 0.8 // Increased base for better visibility
    
    // Logarithmic volume scaling to prevent extreme differences
    let volumeMultiplier = 1
    if (route.volume && route.volume > 0) {
      volumeMultiplier = Math.min(Math.log(route.volume / 1000) * 0.3, 2)
    }
    
    // Moderate criticality multipliers
    const criticalityMultiplier = route.risk_level === 'very_high' ? 1.3 : 
                                 route.risk_level === 'high' ? 1.2 : 1
    
    // Subtle emphasis for major routes
    const routeName = route.name || `${route.origin?.name || ''} → ${route.destination?.name || ''}`
    const majorRouteMultiplier = (routeName.includes('China') || routeName.includes('DRC')) ? 1.1 : 1
    
    // Keep thickness within reasonable bounds (0.5 to 2.5)
    const finalThickness = baseThickness * volumeMultiplier * criticalityMultiplier * majorRouteMultiplier
    return Math.max(0.5, Math.min(finalThickness, 2.5))
  }

  // Enhanced route animation speed based on criticality
  const getRouteAnimationSpeed = (route) => {
    const baseSpeed = 1500
    
    // High-risk routes pulse faster to show urgency
    if (route.risk_level === 'very_high') return baseSpeed - 400
    if (route.risk_level === 'high') return baseSpeed - 200
    
    return baseSpeed
  }

  // Fallback sample data if Supabase is not available
  const loadSampleData = () => {
    const sampleLocations = [
      { name: 'Tesla Berlin', lat: 52.3988, lng: 13.6878, size: 1.5, color: '#22c55e', type: 'battery_plant' },
      { name: 'Northvolt Sweden', lat: 65.5845, lng: 22.1567, size: 1.3, color: '#22c55e', type: 'battery_plant' },
      { name: 'Rotterdam Port', lat: 51.9244, lng: 4.4777, size: 1.2, color: '#60a5fa', type: 'port' },
      { name: 'Hamburg Port', lat: 53.5511, lng: 9.9937, size: 1.0, color: '#60a5fa', type: 'port' },
      { name: 'Chile Lithium', lat: -24.5, lng: -69.25, size: 1.1, color: '#f59e0b', type: 'source' },
      { name: 'Australia Lithium', lat: -25.0, lng: 133.0, size: 1.3, color: '#f59e0b', type: 'source' },
      { name: 'DRC Cobalt', lat: -11.6094, lng: 27.4731, size: 1.4, color: '#fb923c', type: 'source' },
      { name: 'China Rare Earths', lat: 41.77, lng: 109.97, size: 1.5, color: '#ef4444', type: 'source' },
      { name: 'Finland Lithium', lat: 63.8403, lng: 23.1306, size: 0.8, color: '#10b981', type: 'source' }
    ]
    setLocations(sampleLocations)
    
    // Sample routes - CRITICAL: Make sure routes state is set
    const sampleRoutes = [
      { 
        origin: { lat: -24.5, lng: -69.25, name: 'Chile' }, 
        destination: { lat: 51.9244, lng: 4.4777, name: 'Rotterdam' }, 
        material: { name: 'Lithium' }, 
        volume: 50000, 
        risk_level: 'medium' 
      },
      { 
        origin: { lat: -11.6094, lng: 27.4731, name: 'DRC' }, 
        destination: { lat: 51.9244, lng: 4.4777, name: 'Rotterdam' }, 
        material: { name: 'Cobalt' }, 
        volume: 20000, 
        risk_level: 'high' 
      },
      { 
        origin: { lat: 41.77, lng: 109.97, name: 'China' }, 
        destination: { lat: 53.5511, lng: 9.9937, name: 'Hamburg' }, 
        material: { name: 'Rare Earths' }, 
        volume: 30000, 
        risk_level: 'very_high' 
      }
    ]
    console.log('Setting sample routes:', sampleRoutes) // Debug log
    setRoutes(sampleRoutes)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!mountRef.current || loading) return

    // Initialize the globe using the working pattern from the example
    const globe = Globe()(mountRef.current)
      .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
      .showAtmosphere(true)
      .atmosphereColor('#3a82f6')
      .atmosphereAltitude(0.1)
      .width(window.innerWidth)
      .height(window.innerHeight)

    // Filter locations based on bottleneck mode
    const displayLocations = bottleneckMode ? 
      locations.filter(location => location.isBottleneck) : 
      locations

    // Add points to globe as flat circles/blobs - FIXED overlap issue
    globe
      .pointsData(displayLocations)
      .pointAltitude(0.01) // Keep all points at same level to prevent z-fighting
      .pointColor('color')
      .pointRadius('size') // Use consistent sizing - no multipliers that cause overlap
      .pointResolution(8) // Reduced resolution for better performance and less visual noise
      .pointLabel(d => {
        const isBottleneckLocation = isBottleneck(d)
        const bottleneckWarning = isBottleneckLocation ? '<br/>⚠️ <strong style="color: #ef4444;">CRITICAL BOTTLENECK</strong>' : ''
        
        return `
          <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white; font-size: 12px; border: ${isBottleneckLocation ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.2)'};">
            <strong>${d.name}</strong>${bottleneckWarning}<br/>
            Type: ${d.type}<br/>
            ${d.country ? `Country: ${d.country}<br/>` : ''}
            ${d.capacity ? `Capacity: ${d.capacity.toLocaleString()}<br/>` : ''}
            ${d.importance ? `Strategic Importance: ${d.importance}/5<br/>` : ''}
            ${isBottleneckLocation ? `<span style="color: #f59e0b;">Risk Level: HIGH</span>` : ''}
          </div>
        `
      })

    // Create arcs from supply routes data with enhanced bottleneck visualization
    const arcs = routes.map(route => ({
      startLat: route.origin?.lat || 0,
      startLng: route.origin?.lng || 0,
      endLat: route.destination?.lat || 0,
      endLng: route.destination?.lng || 0,
      color: getRouteColor(route),
      name: `${route.origin?.name || 'Unknown'} → ${route.destination?.name || 'Unknown'} (${route.material?.name || 'Material'})`,
      volume: route.volume,
      riskLevel: route.risk_level,
      thickness: getRouteThickness(route),
      animationSpeed: getRouteAnimationSpeed(route),
      // Pass the full route object for thickness calculation
      routeData: route
    }))

    globe
      .arcsData(arcs)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(d => d.animationSpeed) // Use enhanced animation speed
      .arcStroke(d => d.thickness) // Use enhanced thickness calculation
      .arcLabel(d => `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white; font-size: 12px;">
          <strong>${d.name}</strong><br/>
          Volume: ${d.volume?.toLocaleString() || 'N/A'} tons/year<br/>
          Risk Level: ${d.riskLevel || 'Unknown'}
        </div>
      `)

    // Auto-rotate
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.5

    globeRef.current = globe

    // Handle window resize
    const handleResize = () => {
      if (globeRef.current) {
        globeRef.current
          .width(window.innerWidth)
          .height(window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (globeRef.current) {
        globeRef.current._destructor()
      }
    }
  }, [locations, routes, loading])

  // Handle disruptions with dynamic data
  useEffect(() => {
    if (!globeRef.current || !routes.length) return

    const originalArcs = routes.map(route => ({
      startLat: route.origin?.lat || 0,
      startLng: route.origin?.lng || 0,
      endLat: route.destination?.lat || 0,
      endLng: route.destination?.lng || 0,
      color: getRouteColor(route),
      name: `${route.origin?.name || 'Unknown'} → ${route.destination?.name || 'Unknown'} (${route.material?.name || 'Material'})`,
      volume: route.volume,
      riskLevel: route.risk_level
    }))

    if (activeDisruption === 'suez') {
      // Add alternative routes around Africa for affected shipments
      const alternativeArcs = originalArcs.map(arc => {
        if (arc.name.includes('China') || arc.name.includes('Asia')) {
          return {
            ...arc,
            color: '#ef4444',
            name: arc.name + ' (Around Africa - Suez Blocked)',
            riskLevel: 'very_high'
          }
        }
        return arc
      })
      
      globeRef.current.arcsData([...originalArcs, ...alternativeArcs])
    } else if (activeDisruption === 'rotterdam') {
      // Redirect Rotterdam routes to Hamburg
      const redirectedArcs = originalArcs.map(arc => {
        if (arc.name.includes('Rotterdam')) {
          return {
            ...arc,
            endLat: 53.5511, // Hamburg
            endLng: 9.9937,
            color: '#ef4444',
            name: arc.name.replace('Rotterdam', 'Hamburg') + ' (Rotterdam Closed)',
            riskLevel: 'high'
          }
        }
        return arc
      })
      
      globeRef.current.arcsData(redirectedArcs)
    } else if (activeDisruption === 'china-ban') {
      // Remove/highlight China routes
      const filteredArcs = originalArcs.filter(arc => !arc.name.includes('China'))
      const chinaBanArcs = originalArcs
        .filter(arc => arc.name.includes('China'))
        .map(arc => ({
          ...arc,
          color: '#7f1d1d',
          name: arc.name + ' (BLOCKED - China Export Ban)',
          riskLevel: 'blocked'
        }))
      
      globeRef.current.arcsData([...filteredArcs, ...chinaBanArcs])
    } else {
      // Reset to original arcs
      globeRef.current.arcsData(originalArcs)
    }
  }, [activeDisruption, routes])

  // Show loading state
  if (loading) {
    return (
      <div ref={mountRef} style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0e1a',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading EU Energy Supply Chain Data...
      </div>
    )
  }

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent
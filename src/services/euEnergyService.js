import { supabase, handleSupabaseError } from '../lib/supabase.js'

// Fetch critical materials for EU energy independence
export const fetchCriticalMaterials = async () => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('criticality_level', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Fetch material sources with EU dependency risk assessment
export const fetchMaterialSources = async () => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_eu_facility', false)  // Get non-EU facilities (likely sources)
      .order('lat', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching material sources:', error)
    return []
  }
}

// Fetch EU manufacturing facilities from dedicated table
export const fetchEUManufacturingFacilities = async () => {
  try {
    const { data, error } = await supabase
      .from('manufacturing_facilities')
      .select('*')
      .order('output_capacity', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching manufacturing facilities:', error)
    return []
  }
}

// Fetch EU strategic ports for critical materials
export const fetchEUPorts = async () => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_eu_facility', true)
      .order('capacity', { ascending: false })

    if (error) throw error
    
    // Filter for ports (in case there are different type names)
    const ports = data?.filter(location => 
      location.name && location.name.toLowerCase().includes('port')
    ) || []
    
    return ports
  } catch (error) {
    console.error('Error fetching EU ports:', error)
    return []
  }
}

// Fetch supply routes with risk assessment
export const fetchSupplyRoutes = async () => {
  try {
    const { data, error } = await supabase
      .from('supply_routes')
      .select(`
        *,
        origin:origin_id(name, lat, lng, country),
        destination:destination_id(name, lat, lng, country),
        material:material_id(name, type, criticality_level)
      `)
      .order('risk_level', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching supply routes:', error)
    return []
  }
}

// Fetch real-time shipment data
export const fetchRealTimeShipments = async () => {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        route:route_id(
          origin:origin_id(name, lat, lng),
          destination:destination_id(name, lat, lng),
          material:material_id(name, type)
        )
      `)
      .eq('status', 'in_transit')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Calculate EU energy independence metrics
export const calculateEUIndependenceMetrics = async () => {
  try {
    // Get materials with EU production capacity
    const { data: materials, error } = await supabase
      .from('materials')
      .select('*')

    if (error) throw error

    // Get EU manufacturing facilities capacity
    const { data: facilities, error: facilitiesError } = await supabase
      .from('manufacturing_facilities')
      .select('materials_needed, output_capacity')

    if (facilitiesError) throw facilitiesError

    // Calculate independence percentage for each material
    const metrics = materials?.map(material => {
      const euProduction = facilities
        ?.filter(f => f.materials_needed && f.materials_needed[material.name])
        ?.reduce((sum, facility) => sum + (facility.output_capacity || 0), 0) || 0
      
      const totalDemand = material.european_demand || 1
      const independenceLevel = Math.min((euProduction / totalDemand) * 100, 100)
      
      return {
        material: material.name,
        type: material.type,
        independenceLevel,
        riskLevel: material.supply_risk || 'moderate',
        criticalityLevel: material.criticality_level || 1
      }
    })

    return metrics
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Simulate disruption scenarios
export const simulateDisruption = async (disruptionType, affectedLocation) => {
  try {
    // Get disruption scenarios from the database
    const { data, error } = await supabase
      .from('disruption_scenarios')
      .select('*')
      .eq('type', disruptionType)

    if (error) throw error
    return data
  } catch (error) {
    return handleSupabaseError(error)
  }
}
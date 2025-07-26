// Sample data for EU Energy Independence Supply Chain Database

export const materials = [
  {
    id: 1,
    name: 'Lithium',
    type: 'battery_material',
    criticality_level: 5,
    supply_risk: 'high',
    total_demand: 100000, // tons per year
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Cobalt',
    type: 'battery_material', 
    criticality_level: 5,
    supply_risk: 'very_high',
    total_demand: 50000,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Rare Earth Elements',
    type: 'renewable_energy',
    criticality_level: 5,
    supply_risk: 'very_high',
    total_demand: 80000,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Nickel',
    type: 'battery_material',
    criticality_level: 4,
    supply_risk: 'medium',
    total_demand: 200000,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Polysilicon',
    type: 'solar_material',
    criticality_level: 4,
    supply_risk: 'high',
    total_demand: 150000,
    created_at: new Date().toISOString()
  }
]

export const locations = [
  // EU Manufacturing Facilities
  {
    id: 1,
    name: 'Tesla Gigafactory Berlin',
    type: 'battery_plant',
    lat: 52.3988,
    lng: 13.6878,
    country: 'Germany',
    region: 'EU',
    capacity: 500000, // battery packs per year
    current_output: 200000,
    eu_strategic_importance: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Northvolt Ett',
    type: 'battery_plant',
    lat: 65.5845,
    lng: 22.1567,
    country: 'Sweden',
    region: 'EU',
    capacity: 60000, // tons of batteries per year
    current_output: 30000,
    eu_strategic_importance: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Ørsted Wind Farm Production',
    type: 'wind_facility',
    lat: 55.6761,
    lng: 12.5683,
    country: 'Denmark',
    region: 'EU',
    capacity: 15000, // MW capacity
    current_output: 12000,
    eu_strategic_importance: 4,
    created_at: new Date().toISOString()
  },
  
  // Critical Material Sources (Global)
  {
    id: 4,
    name: 'Albemarle Chile',
    type: 'source',
    lat: -24.5000,
    lng: -69.2500,
    country: 'Chile',
    region: 'South America',
    capacity: 180000, // tons lithium per year
    current_output: 150000,
    eu_strategic_importance: 4, // Important but diversified
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Tianqi Lithium Australia',
    type: 'source',
    lat: -32.0000,
    lng: 116.0000,
    country: 'Australia',
    region: 'Oceania',
    capacity: 80000,
    current_output: 75000,
    eu_strategic_importance: 3, // Allied nation
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Glencore Katanga Mining',
    type: 'source',
    lat: -11.6094,
    lng: 27.4731,
    country: 'DRC',
    region: 'Africa',
    capacity: 40000, // tons cobalt per year
    current_output: 35000,
    eu_strategic_importance: 5, // High risk concentration
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Bayan Obo China',
    type: 'source',
    lat: 41.7700,
    lng: 109.9700,
    country: 'China',
    region: 'Asia',
    capacity: 120000, // tons rare earths per year
    current_output: 110000,
    eu_strategic_importance: 5, // Very high risk - China dominance
    created_at: new Date().toISOString()
  },

  // EU Strategic Ports
  {
    id: 8,
    name: 'Port of Rotterdam',
    type: 'port',
    lat: 51.9244,
    lng: 4.4777,
    country: 'Netherlands',
    region: 'EU',
    throughput_capacity: 469000000, // tons per year
    current_output: 400000000,
    eu_strategic_importance: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Port of Hamburg',
    type: 'port',
    lat: 53.5511,
    lng: 9.9937,
    country: 'Germany', 
    region: 'EU',
    throughput_capacity: 126000000,
    current_output: 120000000,
    eu_strategic_importance: 4,
    created_at: new Date().toISOString()
  },

  // Emerging EU Sources (Domestic)
  {
    id: 10,
    name: 'Keliber Lithium Finland',
    type: 'source',
    lat: 63.8403,
    lng: 23.1306,
    country: 'Finland',
    region: 'EU',
    capacity: 15000, // tons lithium per year (planned)
    current_output: 0, // Under development
    eu_strategic_importance: 5, // Domestic EU source
    created_at: new Date().toISOString()
  }
]

export const supplyRoutes = [
  {
    id: 1,
    origin_id: 4, // Chile
    destination_id: 8, // Rotterdam
    material_id: 1, // Lithium
    volume: 50000, // tons per year
    transit_time: 21, // days
    risk_level: 'medium',
    alternative_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    origin_id: 6, // DRC
    destination_id: 8, // Rotterdam  
    material_id: 2, // Cobalt
    volume: 20000,
    transit_time: 28,
    risk_level: 'high',
    alternative_available: false,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    origin_id: 7, // China
    destination_id: 9, // Hamburg
    material_id: 3, // Rare Earths
    volume: 30000,
    transit_time: 35,
    risk_level: 'very_high',
    alternative_available: true,
    created_at: new Date().toISOString()
  }
]

export const locationMaterials = [
  // Tesla Berlin needs lithium, cobalt, nickel
  { location_id: 1, material_id: 1 },
  { location_id: 1, material_id: 2 },
  { location_id: 1, material_id: 4 },
  
  // Northvolt needs lithium, cobalt, nickel
  { location_id: 2, material_id: 1 },
  { location_id: 2, material_id: 2 },
  { location_id: 2, material_id: 4 },
  
  // Wind facilities need rare earths
  { location_id: 3, material_id: 3 },
  
  // Material sources
  { location_id: 4, material_id: 1 }, // Chile - Lithium
  { location_id: 5, material_id: 1 }, // Australia - Lithium
  { location_id: 6, material_id: 2 }, // DRC - Cobalt
  { location_id: 7, material_id: 3 }, // China - Rare Earths
  { location_id: 10, material_id: 1 }, // Finland - Lithium
]

// Database schema SQL for reference
export const databaseSchema = `
-- Materials table
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  criticality_level INTEGER CHECK (criticality_level >= 1 AND criticality_level <= 5),
  supply_risk VARCHAR(20) CHECK (supply_risk IN ('low', 'medium', 'high', 'very_high')),
  total_demand INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table  
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('source', 'port', 'battery_plant', 'solar_facility', 'wind_facility', 'processing_plant')),
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  capacity INTEGER,
  current_output INTEGER,
  throughput_capacity BIGINT,
  eu_strategic_importance INTEGER CHECK (eu_strategic_importance >= 1 AND eu_strategic_importance <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supply routes table
CREATE TABLE supply_routes (
  id SERIAL PRIMARY KEY,
  origin_id INTEGER REFERENCES locations(id),
  destination_id INTEGER REFERENCES locations(id),
  material_id INTEGER REFERENCES materials(id),
  volume INTEGER,
  transit_time INTEGER,
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
  alternative_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for locations and materials
CREATE TABLE location_materials (
  location_id INTEGER REFERENCES locations(id),
  material_id INTEGER REFERENCES materials(id),
  PRIMARY KEY (location_id, material_id)
);

-- Shipments table for real-time tracking
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES supply_routes(id),
  status VARCHAR(20) CHECK (status IN ('loading', 'in_transit', 'customs', 'delivered', 'delayed')),
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  progress DECIMAL(3, 2) CHECK (progress >= 0 AND progress <= 1),
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`